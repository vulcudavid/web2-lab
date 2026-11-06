import { runGaleShapley, handleMinimalReallocation } from "./matching";

function testGaleShapley() {
  console.log("🧪 Testare Algoritm Gale-Shapley (Many-to-One)...");

  const students = [
    { studentId: "stud-1", preferences: ["off-A", "off-B"] },
    { studentId: "stud-2", preferences: ["off-A", "off-B"] },
    { studentId: "stud-3", preferences: ["off-B", "off-A"] },
  ];

  const offers = [
    { offerId: "off-A", capacity: 1, studentRanking: ["stud-2", "stud-1", "stud-3"] },
    { offerId: "off-B", capacity: 2, studentRanking: ["stud-1", "stud-3", "stud-2"] },
  ];

  const result = runGaleShapley(students, offers);
  console.log("Rezultat matching:", result.allocations);

  // Verificare:
  // off-A are capacitate 1 si prefera stud-2 > stud-1.
  // stud-1 prefera off-A, dar e respins in favoarea lui stud-2, deci merge la off-B.
  // stud-3 prefera off-B.
  // off-B are capacitate 2 si ii ia pe stud-1 si stud-3.
  const matchMap = new Map(result.allocations.map((a) => [a.studentId, a.offerId]));
  if (matchMap.get("stud-2") === "off-A" && matchMap.get("stud-1") === "off-B" && matchMap.get("stud-3") === "off-B") {
    console.log("✅ Gale-Shapley a produs alocarea stabilă corectă!");
  } else {
    throw new Error("Gale-Shapley a eșuat!");
  }

  console.log("\n🧪 Testare Realocare Minimală (Excepție: Studentul refuză locul)...");
  const confirmed = [...result.allocations];
  const realloc = handleMinimalReallocation(
    confirmed,
    { type: "STUDENT_REFUSED", studentId: "stud-1", offerId: "off-B" },
    offers,
    students
  );
  console.log("Alocări actualizate:", realloc.updatedPlacements);
  console.log("Studenți afectați:", realloc.affectedStudents);

  if (realloc.updatedPlacements.find((p) => p.studentId === "stud-2" && p.offerId === "off-A")) {
    console.log("✅ Studentul confirmat anterior (stud-2) NU a fost mutat!");
  }
}

testGaleShapley();
