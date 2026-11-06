import { PrismaClient, UserRole, EngineeringDomain, ProficiencyLevel } from "@prisma/client";
import { PREDEFINED_ENGINEERING_TAGS } from "../src/lib/tags";
import { calculateCompatibilityScore } from "../src/lib/scoring";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Începe popularea bazei de date (Seeding)...");

  // 1. Populare Nomenclator Tag-uri Predefinite Inginerie ULBS
  console.log("📌 Populare tag-uri predefinite pentru Facultatea de Inginerie...");
  for (const tagDef of PREDEFINED_ENGINEERING_TAGS) {
    await prisma.tag.upsert({
      where: { name: tagDef.name },
      update: {
        domain: tagDef.domain,
        isPredefined: true,
      },
      create: {
        name: tagDef.name,
        domain: tagDef.domain,
        isPredefined: true,
      },
    });
  }
  console.log(`✅ ${PREDEFINED_ENGINEERING_TAGS.length} tag-uri predefinite create/actualizate.`);

  // 2. Utilizator Coordonator Facultate
  const coordinatorUser = await prisma.user.upsert({
    where: { email: "coordonator.practica@ulbsibiu.ro" },
    update: {},
    create: {
      email: "coordonator.practica@ulbsibiu.ro",
      passwordHash: "demo_hash_coordonator",
      role: UserRole.COORDINATOR,
      firstName: "Mihai",
      lastName: "Ionescu",
    },
  });

  // 3. Companie Parteneră & Tutore
  const companyUser = await prisma.user.upsert({
    where: { email: "recruitment@continental-sibiu.com" },
    update: {},
    create: {
      email: "recruitment@continental-sibiu.com",
      passwordHash: "demo_hash_company",
      role: UserRole.COMPANY_TUTOR,
      firstName: "Elena",
      lastName: "Popa",
    },
  });

  const companyProfile = await prisma.companyProfile.upsert({
    where: { userId: companyUser.id },
    update: {},
    create: {
      userId: companyUser.id,
      companyName: "Continental Automotive Sibiu",
      cuiCif: "RO12345678",
      address: "Str. Salzburg nr. 8",
      city: "Sibiu",
      website: "https://www.continental.com/ro-ro/",
      description: "Lider tehnologic global în mobilitate autonomă și sisteme conectate.",
      contactPhone: "+40 269 123 456",
    },
  });

  // 4. Ofertă de Practică
  const offer = await prisma.internshipOffer.upsert({
    where: { id: "demo-offer-conti-1" },
    update: {},
    create: {
      id: "demo-offer-conti-1",
      companyId: companyProfile.id,
      title: "Software Engineering Intern - Autonomous & Connected Mobility",
      description: "Vei contribui la dezvoltarea modulelor cloud și edge computing pentru vehicule conectate.",
      primaryDomain: EngineeringDomain.COMPUTER_SCIENCE_IT,
      slotsTotal: 3,
      slotsAvailable: 3,
      location: "Sibiu, Str. Salzburg 8 (Hibrid)",
      isRemote: false,
      startDate: new Date("2026-07-01"),
      endDate: new Date("2026-09-30"),
      tutorName: "Elena Popa (Lead Software Architect)",
      tutorEmail: "elena.popa@continental-sibiu.com",
    },
  });

  // Asociere tag-uri cerute de ofertă
  const tagsToRequire = [
    { name: "TypeScript", isRequired: true, weight: 1.0 },
    { name: "React", isRequired: true, weight: 1.0 },
    { name: "Docker", isRequired: false, weight: 0.8 },
    { name: "PostgreSQL", isRequired: false, weight: 0.8 },
    { name: "Git / GitHub", isRequired: true, weight: 1.0 },
  ];

  for (const t of tagsToRequire) {
    const dbTag = await prisma.tag.findUnique({ where: { name: t.name } });
    if (dbTag) {
      await prisma.offerTag.upsert({
        where: {
          offerId_tagId: {
            offerId: offer.id,
            tagId: dbTag.id,
          },
        },
        update: {
          isRequired: t.isRequired,
          weight: t.weight,
        },
        create: {
          offerId: offer.id,
          tagId: dbTag.id,
          isRequired: t.isRequired,
          weight: t.weight,
        },
      });
    }
  }

  // 5. Profil Student cu competențe
  const studentUser = await prisma.user.upsert({
    where: { email: "alexandru.radu@student.ulbsibiu.ro" },
    update: {},
    create: {
      email: "alexandru.radu@student.ulbsibiu.ro",
      passwordHash: "demo_hash_student",
      role: UserRole.STUDENT,
      firstName: "Alexandru",
      lastName: "Radu",
    },
  });

  const studentProfile = await prisma.studentProfile.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      faculty: "Facultatea de Inginerie ULBS",
      specialization: "Calculatoare",
      studyYear: 3,
      group: "331 CTI",
      domain: EngineeringDomain.COMPUTER_SCIENCE_IT,
      headline: "Student CTI pasionat de Web Full-Stack și Sisteme Distribuite",
      bio: "Dezvoltator pasionat de TypeScript, React și arhitecturi cloud. Caut un stagiu de practică axat pe dezvoltare software modernă.",
      phone: "+40 740 111 222",
      cvUrl: "/uploads/cvs/alexandru-radu-cv.pdf", // Protejat conform regulii de confidențialitate
      githubUrl: "https://github.com/alex-radu-demo",
      linkedinUrl: "https://linkedin.com/in/alex-radu-demo",
      availableFrom: new Date("2026-07-01"),
      availableTo: new Date("2026-09-30"),
    },
  });

  // Competențe student
  const studentSkills = [
    { name: "TypeScript", proficiency: ProficiencyLevel.ADVANCED },
    { name: "React", proficiency: ProficiencyLevel.INTERMEDIATE },
    { name: "Next.js", proficiency: ProficiencyLevel.INTERMEDIATE },
    { name: "Git / GitHub", proficiency: ProficiencyLevel.ADVANCED },
    { name: "PostgreSQL", proficiency: ProficiencyLevel.BEGINNER },
  ];

  for (const s of studentSkills) {
    const dbTag = await prisma.tag.findUnique({ where: { name: s.name } });
    if (dbTag) {
      await prisma.studentTag.upsert({
        where: {
          studentId_tagId: {
            studentId: studentProfile.id,
            tagId: dbTag.id,
          },
        },
        update: { proficiency: s.proficiency },
        create: {
          studentId: studentProfile.id,
          tagId: dbTag.id,
          proficiency: s.proficiency,
        },
      });
    }
  }

  // 6. Testare Motor de Compatibilitate
  const studentSkillInputs = studentSkills.map((s) => ({
    tagId: s.name,
    tagName: s.name,
    domain: EngineeringDomain.COMPUTER_SCIENCE_IT,
    proficiency: s.proficiency,
  }));

  const offerTagInputs = tagsToRequire.map((t) => ({
    tagId: t.name,
    tagName: t.name,
    domain: EngineeringDomain.COMPUTER_SCIENCE_IT,
    isRequired: t.isRequired,
    weight: t.weight,
  }));

  const compResult = calculateCompatibilityScore(
    studentProfile.domain,
    studentSkillInputs,
    offer.primaryDomain,
    offerTagInputs
  );

  console.log("🎯 Rezultat calcul compatibilitate demo:");
  console.log(`   - Student: ${studentUser.firstName} ${studentUser.lastName}`);
  console.log(`   - Ofertă: ${offer.title}`);
  console.log(`   - Scor calculat: ${compResult.score}% (Puncte: Obligatorii=${compResult.breakdown.requiredScore}, Opționale=${compResult.breakdown.optionalScore}, Domeniu=${compResult.breakdown.domainScore})`);
  console.log(`   - Competențe obligatorii potrivite: ${compResult.matchedRequiredTags.join(", ")}`);
  console.log(`   - Competențe opționale potrivite: ${compResult.matchedOptionalTags.join(", ")}`);

  console.log("✨ Seeding finalizat cu succes!");
}

main()
  .catch((e) => {
    console.error("Eroare la popularea bazei de date:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
