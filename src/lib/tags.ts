import { EngineeringDomain } from "@prisma/client";

export interface PredefinedTagDef {
  name: string;
  domain: EngineeringDomain;
  description?: string;
}

/**
 * Nomenclatorul de competențe și tag-uri predefinite structurat pe domeniile
 * Facultății de Inginerie (Universitatea „Lucian Blaga” din Sibiu - ULBS)
 */
export const PREDEFINED_ENGINEERING_TAGS: PredefinedTagDef[] = [
  // 1. Calculatoare și Tehnologia Informației (CTI / IS / TI)
  { name: "TypeScript", domain: "COMPUTER_SCIENCE_IT" },
  { name: "React", domain: "COMPUTER_SCIENCE_IT" },
  { name: "Next.js", domain: "COMPUTER_SCIENCE_IT" },
  { name: "Node.js", domain: "COMPUTER_SCIENCE_IT" },
  { name: "Python", domain: "COMPUTER_SCIENCE_IT" },
  { name: "PostgreSQL", domain: "COMPUTER_SCIENCE_IT" },
  { name: "Docker", domain: "COMPUTER_SCIENCE_IT" },
  { name: "Kubernetes", domain: "COMPUTER_SCIENCE_IT" },
  { name: "Linux / Bash", domain: "COMPUTER_SCIENCE_IT" },
  { name: "Git / GitHub", domain: "COMPUTER_SCIENCE_IT" },
  { name: "AI / Machine Learning", domain: "COMPUTER_SCIENCE_IT" },
  { name: "Cybersecurity", domain: "COMPUTER_SCIENCE_IT" },
  { name: "C++", domain: "COMPUTER_SCIENCE_IT" },
  { name: "Java / Spring Boot", domain: "COMPUTER_SCIENCE_IT" },
  { name: "Cloud (AWS / GCP / Azure)", domain: "COMPUTER_SCIENCE_IT" },

  // 2. Inginerie Electronică, Telecomunicații și Tehnologii Informaționale (IETTI)
  { name: "Embedded C", domain: "ELECTRONICS_TELECOM" },
  { name: "Microcontrollere (STM32 / AVR)", domain: "ELECTRONICS_TELECOM" },
  { name: "Arduino / ESP32", domain: "ELECTRONICS_TELECOM" },
  { name: "Proiectare PCB (Altium / KiCad)", domain: "ELECTRONICS_TELECOM" },
  { name: "Semnale și Sisteme", domain: "ELECTRONICS_TELECOM" },
  { name: "IoT & Senzori", domain: "ELECTRONICS_TELECOM" },
  { name: "Rețele Telecom & 5G", domain: "ELECTRONICS_TELECOM" },
  { name: "VHDL / FPGA", domain: "ELECTRONICS_TELECOM" },

  // 3. Mecatronică, Robotică și Inginerie Mecanică
  { name: "CAD / SolidWorks", domain: "ROBOTICS_MECHATRONICS" },
  { name: "CATIA", domain: "ROBOTICS_MECHATRONICS" },
  { name: "Programare PLC (Siemens / Beckhoff)", domain: "ROBOTICS_MECHATRONICS" },
  { name: "Robot Operating System (ROS)", domain: "ROBOTICS_MECHATRONICS" },
  { name: "Cinematică și Dinamică Robotică", domain: "ROBOTICS_MECHATRONICS" },
  { name: "Pneumatică și Hidraulică", domain: "ROBOTICS_MECHATRONICS" },
  { name: "Simulare FEM / ANSYS", domain: "ROBOTICS_MECHATRONICS" },

  // 4. Inginerie Industrială și Management Tehnologic
  { name: "Lean Manufacturing", domain: "INDUSTRIAL_MANAGEMENT" },
  { name: "Six Sigma & Kaizen", domain: "INDUSTRIAL_MANAGEMENT" },
  { name: "Controlul Calității (QA / QC)", domain: "INDUSTRIAL_MANAGEMENT" },
  { name: "Sisteme ERP (SAP)", domain: "INDUSTRIAL_MANAGEMENT" },
  { name: "Managementul Proiectelor Tehnice", domain: "INDUSTRIAL_MANAGEMENT" },
  { name: "Supply Chain & Logistică", domain: "INDUSTRIAL_MANAGEMENT" },

  // 5. Competențe Inginerești Generale / Interdisciplinare
  { name: "Algoritmi & Structuri de Date", domain: "GENERAL_ENGINEERING" },
  { name: "Matematică Aplicată & Statistică", domain: "GENERAL_ENGINEERING" },
  { name: "Engleză Tehnică", domain: "GENERAL_ENGINEERING" },
  { name: "Agile / Scrum", domain: "GENERAL_ENGINEERING" },
  { name: "Lucru în echipă & Comunicare", domain: "GENERAL_ENGINEERING" },
];

export const DOMAIN_LABELS: Record<EngineeringDomain, string> = {
  COMPUTER_SCIENCE_IT: "Calculatoare și Tehnologia Informației",
  ELECTRONICS_TELECOM: "Electronică și Telecomunicații",
  ROBOTICS_MECHATRONICS: "Mecatronică și Robotică",
  INDUSTRIAL_MANAGEMENT: "Inginerie Industrială și Management",
  GENERAL_ENGINEERING: "Inginerie Generală",
};
