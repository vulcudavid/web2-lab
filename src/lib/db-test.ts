import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runDatabaseConnectionTest() {
  console.log("🔍 Verificare conexiune la baza de date PostgreSQL...\n");

  try {
    // 1. Verificare ping de bază prin query raw
    const rawResult = await prisma.$queryRaw<
      { is_connected: number; db_name: string; server_time: Date }[]
    >`SELECT 1 as is_connected, current_database() as db_name, NOW() as server_time`;

    if (!rawResult || rawResult.length === 0 || rawResult[0].is_connected !== 1) {
      throw new Error("Query-ul de test raw a eșuat.");
    }

    console.log("✅ Conexiune PostgreSQL stabilită cu succes!");
    console.log(`   - Bază de date: ${rawResult[0].db_name}`);
    console.log(`   - Timp server BD: ${rawResult[0].server_time.toISOString()}`);

    // 2. Verificare acces la tabelele principale
    const [userCount, tagCount, offerCount, studentCount, companyCount] = await Promise.all([
      prisma.user.count(),
      prisma.tag.count(),
      prisma.internshipOffer.count(),
      prisma.studentProfile.count(),
      prisma.companyProfile.count(),
    ]);

    console.log("\n📊 Verificare integritate tabele Prisma:");
    console.log(`   - Utilizatori înregistrați: ${userCount}`);
    console.log(`   - Tag-uri / Competențe în catalog: ${tagCount}`);
    console.log(`   - Oferte de practică: ${offerCount}`);
    console.log(`   - Profiluri studenți: ${studentCount}`);
    console.log(`   - Profiluri companii: ${companyCount}`);

    // 3. Verificare tranzacție de scriere și ștergere (Read/Write test)
    const testProbeName = `__db_health_probe_${Date.now()}`;
    const testTag = await prisma.tag.create({
      data: {
        name: testProbeName,
        isPredefined: false,
      },
    });

    await prisma.tag.delete({
      where: { id: testTag.id },
    });

    console.log("\n✅ Test de scriere/ștergere (CRUD) realizat cu succes!");
    console.log("🎉 Toate testele bazei de date au trecut fără erori!\n");
    process.exit(0);
  } catch (err) {
    console.error("❌ Eroare la testul conexiunii la baza de date:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runDatabaseConnectionTest();
