/**
 * Motorul de Matching Stabil Gale-Shapley (Many-to-One / Hospital-Residents)
 * și Algoritmul de Realocare Minimală pentru Excepții Umane (P14 Portal de Practică)
 */

export interface StudentPreferences {
  studentId: string;
  preferences: string[]; // Listă ordonată de offerId-uri (cea mai dorită prima)
}

export interface OfferPreferences {
  offerId: string;
  capacity: number; // Numărul de locuri disponibile
  studentRanking: string[]; // Listă ordonată de studentId-uri (cel mai preferat primul)
}

export interface MatchingResult {
  allocations: {
    studentId: string;
    offerId: string;
  }[];
  unassignedStudents: string[];
  unfilledOffers: {
    offerId: string;
    remainingSlots: number;
  }[];
}

/**
 * Algoritmul Gale-Shapley cu capacități (Student-Proposing Deferred Acceptance).
 * Garantează stabilitatea alocării (nu există nicio pereche student-firmă care s-ar prefera reciproc
 * peste alocarea actuală respectând capacitățile).
 */
export function runGaleShapley(
  students: StudentPreferences[],
  offers: OfferPreferences[]
): MatchingResult {
  // Mapare rapidă pentru capacități și clasamente firme
  const offerCapacityMap = new Map<string, number>();
  const offerRankingMap = new Map<string, Map<string, number>>();
  const offerCurrentMatches = new Map<string, string[]>(); // offerId -> studentIds[]

  for (const offer of offers) {
    offerCapacityMap.set(offer.offerId, offer.capacity);
    offerCurrentMatches.set(offer.offerId, []);

    const rankMap = new Map<string, number>();
    offer.studentRanking.forEach((studentId, index) => {
      rankMap.set(studentId, index); // index mai mic = prioritate mai mare
    });
    offerRankingMap.set(offer.offerId, rankMap);
  }

  // Pointer pentru următorul index din lista de preferințe a fiecărui student
  const nextProposalIndex = new Map<string, number>();
  const freeStudents: string[] = [];

  for (const s of students) {
    nextProposalIndex.set(s.studentId, 0);
    if (s.preferences.length > 0) {
      freeStudents.push(s.studentId);
    }
  }

  const studentPrefMap = new Map<string, string[]>();
  for (const s of students) {
    studentPrefMap.set(s.studentId, s.preferences);
  }

  // Bucla Deferred Acceptance
  while (freeStudents.length > 0) {
    const studentId = freeStudents.shift()!;
    const prefs = studentPrefMap.get(studentId) || [];
    const propIdx = nextProposalIndex.get(studentId) || 0;

    if (propIdx >= prefs.length) {
      // Studentul a epuizat lista de preferințe și rămâne nealocat
      continue;
    }

    const targetOfferId = prefs[propIdx];
    nextProposalIndex.set(studentId, propIdx + 1);

    const capacity = offerCapacityMap.get(targetOfferId) || 0;
    const ranking = offerRankingMap.get(targetOfferId);
    const currentMatches = offerCurrentMatches.get(targetOfferId) || [];

    // Verifică dacă firma acceptă/clasifică acest student
    if (!ranking || !ranking.has(studentId)) {
      // Firma nu a inclus studentul în clasament; studentul rămâne liber și încearcă următoarea ofertă
      freeStudents.push(studentId);
      continue;
    }

    const studentRank = ranking.get(studentId)!;

    if (currentMatches.length < capacity) {
      // Firma mai are locuri libere
      currentMatches.push(studentId);
      offerCurrentMatches.set(targetOfferId, currentMatches);
    } else {
      // Firma este plină: găsește studentul cel mai slab cotat admis provizoriu
      let worstStudentId = currentMatches[0];
      let worstRank = ranking.get(worstStudentId) ?? -1;

      for (const matchedStudent of currentMatches) {
        const r = ranking.get(matchedStudent) ?? -1;
        if (r > worstRank) {
          worstRank = r;
          worstStudentId = matchedStudent;
        }
      }

      if (studentRank < worstRank) {
        // Noul student este preferat celui mai slab student curent
        const idxToReplace = currentMatches.indexOf(worstStudentId);
        currentMatches[idxToReplace] = studentId;
        offerCurrentMatches.set(targetOfferId, currentMatches);

        // Studentul respins devine din nou liber
        freeStudents.push(worstStudentId);
      } else {
        // Noul student este respins
        freeStudents.push(studentId);
      }
    }
  }

  // Colectare rezultate
  const allocations: { studentId: string; offerId: string }[] = [];
  const allocatedStudents = new Set<string>();

  for (const [offerId, matchedStudents] of offerCurrentMatches.entries()) {
    for (const studentId of matchedStudents) {
      allocations.push({ studentId, offerId });
      allocatedStudents.add(studentId);
    }
  }

  const unassignedStudents = students
    .map((s) => s.studentId)
    .filter((id) => !allocatedStudents.has(id));

  const unfilledOffers = offers.map((offer) => {
    const matchedCount = (offerCurrentMatches.get(offer.offerId) || []).length;
    return {
      offerId: offer.offerId,
      remainingSlots: Math.max(0, offer.capacity - matchedCount),
    };
  });

  return {
    allocations,
    unassignedStudents,
    unfilledOffers,
  };
}

/**
 * Realocare minimală la apariția unei excepții umane.
 * Cerință din brief:
 * „fără a re-rula tot matching-ul și fără a muta studenții confirmați”
 */
export function handleMinimalReallocation(
  confirmedPlacements: { studentId: string; offerId: string }[],
  exception:
    | { type: "STUDENT_REFUSED"; studentId: string; offerId: string }
    | { type: "COMPANY_WITHDREW_OFFER"; offerId: string },
  offers: OfferPreferences[],
  students: StudentPreferences[]
): {
  updatedPlacements: { studentId: string; offerId: string }[];
  newlyAssigned: { studentId: string; offerId: string }[];
  affectedStudents: string[];
} {
  // Studenții confirmați sunt protejați și înghețați
  const frozenStudentMap = new Map<string, string>();
  for (const cp of confirmedPlacements) {
    frozenStudentMap.set(cp.studentId, cp.offerId);
  }

  const updatedPlacements = [...confirmedPlacements];
  const newlyAssigned: { studentId: string; offerId: string }[] = [];
  const affectedStudents: string[] = [];

  if (exception.type === "STUDENT_REFUSED") {
    // 1. Înlăturăm studentul care a refuzat
    const idx = updatedPlacements.findIndex(
      (p) => p.studentId === exception.studentId && p.offerId === exception.offerId
    );
    if (idx !== -1) {
      updatedPlacements.splice(idx, 1);
    }
    affectedStudents.push(exception.studentId);

    // 2. Oferta are acum un loc vacant
    const offer = offers.find((o) => o.offerId === exception.offerId);
    if (offer) {
      const alreadyPlacedStudents = new Set(updatedPlacements.map((p) => p.studentId));

      // Căutăm următorul student disponibil din clasamentul companiei care nu este deja confirmat
      for (const candidateId of offer.studentRanking) {
        if (!alreadyPlacedStudents.has(candidateId) && candidateId !== exception.studentId) {
          // Verificăm dacă studentul acceptă această ofertă în lista sa de preferințe
          const candPref = students.find((s) => s.studentId === candidateId);
          if (candPref && candPref.preferences.includes(offer.offerId)) {
            updatedPlacements.push({ studentId: candidateId, offerId: offer.offerId });
            newlyAssigned.push({ studentId: candidateId, offerId: offer.offerId });
            break;
          }
        }
      }
    }
  } else if (exception.type === "COMPANY_WITHDREW_OFFER") {
    // Înlăturăm toți studenții afectați de retragerea ofertei
    const remainingPlacements: { studentId: string; offerId: string }[] = [];

    for (const p of updatedPlacements) {
      if (p.offerId === exception.offerId) {
        affectedStudents.push(p.studentId);
      } else {
        remainingPlacements.push(p);
      }
    }

    updatedPlacements.length = 0;
    updatedPlacements.push(...remainingPlacements);

    // Calculăm locurile libere în ofertele rămase
    const offerFilledCount = new Map<string, number>();
    for (const p of updatedPlacements) {
      offerFilledCount.set(p.offerId, (offerFilledCount.get(p.offerId) || 0) + 1);
    }

    // Încercăm realocarea studenților afectați pe locurile rămase libere
    for (const studentId of affectedStudents) {
      const studPref = students.find((s) => s.studentId === studentId);
      if (!studPref) continue;

      for (const prefOfferId of studPref.preferences) {
        if (prefOfferId === exception.offerId) continue;

        const off = offers.find((o) => o.offerId === prefOfferId);
        if (!off) continue;

        const currentFilled = offerFilledCount.get(prefOfferId) || 0;
        if (currentFilled < off.capacity && off.studentRanking.includes(studentId)) {
          updatedPlacements.push({ studentId, offerId: prefOfferId });
          newlyAssigned.push({ studentId, offerId: prefOfferId });
          offerFilledCount.set(prefOfferId, currentFilled + 1);
          break;
        }
      }
    }
  }

  return {
    updatedPlacements,
    newlyAssigned,
    affectedStudents,
  };
}
