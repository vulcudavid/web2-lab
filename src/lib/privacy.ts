import { prisma } from "@/lib/prisma";

/**
 * Verifică dacă o companie are permisiunea legală de a accesa CV-ul complet
 * și datele de contact directe ale unui student.
 * 
 * REGULĂ DE SECURITATE (P14):
 * CV-ul detaliat este accesibil companiei DOAR DACĂ studentul a aplicat
 * (sau este clasat) la cel puțin o poziție deschisă a companiei respective.
 */
export async function canCompanyAccessStudentCv(
  companyProfileId: string,
  studentId: string,
  targetOfferId?: string
): Promise<boolean> {
  if (targetOfferId) {
    // Verifică aplicarea la o ofertă specifică
    const application = await prisma.companyApplicantRank.findFirst({
      where: {
        offerId: targetOfferId,
        studentId: studentId,
        offer: {
          companyId: companyProfileId,
        },
      },
    });

    if (application) return true;

    // Verifică și în preferințele studentului
    const preference = await prisma.studentPreference.findFirst({
      where: {
        offerId: targetOfferId,
        studentId: studentId,
        offer: {
          companyId: companyProfileId,
        },
      },
    });

    return !!preference;
  }

  // Verifică dacă a aplicat la oricare dintre ofertele acestei companii
  const companyOfferIds = await prisma.internshipOffer.findMany({
    where: { companyId: companyProfileId },
    select: { id: true },
  });

  const offerIds = companyOfferIds.map((o) => o.id);
  if (offerIds.length === 0) return false;

  const hasApplicantRank = await prisma.companyApplicantRank.findFirst({
    where: {
      offerId: { in: offerIds },
      studentId: studentId,
    },
  });

  if (hasApplicantRank) return true;

  const hasPreference = await prisma.studentPreference.findFirst({
    where: {
      offerId: { in: offerIds },
      studentId: studentId,
    },
  });

  return !!hasPreference;
}

/**
 * Filtrează / maschează datele private (CV, telefon) din profilul studentului
 * atunci când o firmă accesează lista generală de recomandări / feed-ul social.
 */
export function sanitizeStudentProfileForCompany<
  T extends {
    cvUrl?: string | null;
    phone?: string | null;
  }
>(studentProfile: T, canAccessDetails: boolean): T {
  if (canAccessDetails) {
    return studentProfile;
  }

  return {
    ...studentProfile,
    cvUrl: null,
    phone: null,
  };
}
