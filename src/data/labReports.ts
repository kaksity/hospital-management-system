export type LabReportStatus = "pending" | "processing" | "completed";

/** A test definition in the lab catalog */
export interface LabTestDefinition {
  id: string;
  name: string;
  category: string;
  unit: string;
  referenceRange: string;
}

/** A single test entry within a report (result filled in later) */
export interface LabTestItem {
  definitionId: string;
  testName: string;
  testCategory: string;
  result: string;
  unit: string;
  referenceRange: string;
}

export interface LabReport {
  id: string;
  patientId: string;
  patientName: string;
  patientGender: "Male" | "Female";
  tests: LabTestItem[];
  status: LabReportStatus;
  requestedBy: string;
  performedBy: string;
  requestedAt: string;
  completedAt?: string;
  notes: string;
}

export const TEST_CATEGORIES = [
  "Hematology",
  "Biochemistry",
  "Microbiology",
  "Immunology",
  "Serology",
  "Urinalysis",
  "Parasitology",
  "Histopathology",
];

/** The initial lab test catalog — managed dynamically by the laboratory */
export const initialLabCatalog: LabTestDefinition[] = [
  { id: "TC-001", name: "Full Blood Count (FBC)",         category: "Hematology",    unit: "×10⁹/L",  referenceRange: "WBC: 4–11, RBC: 4.5–5.5, Hb: 13–17" },
  { id: "TC-002", name: "Erythrocyte Sedimentation Rate", category: "Hematology",    unit: "mm/hr",   referenceRange: "Male: 0–15, Female: 0–20" },
  { id: "TC-003", name: "Random Blood Sugar (RBS)",       category: "Biochemistry",  unit: "mmol/L",  referenceRange: "3.9–7.8 mmol/L" },
  { id: "TC-004", name: "Fasting Blood Sugar (FBS)",      category: "Biochemistry",  unit: "mmol/L",  referenceRange: "3.9–5.5 mmol/L" },
  { id: "TC-005", name: "Liver Function Test (LFT)",      category: "Biochemistry",  unit: "U/L",     referenceRange: "ALT: 7–56, AST: 10–40" },
  { id: "TC-006", name: "Kidney Function Test (KFT)",     category: "Biochemistry",  unit: "µmol/L",  referenceRange: "Creatinine: 62–115, Urea: 2.5–7.5" },
  { id: "TC-007", name: "Urine Culture & Sensitivity",   category: "Microbiology",  unit: "",        referenceRange: "No growth expected" },
  { id: "TC-008", name: "Blood Culture",                  category: "Microbiology",  unit: "",        referenceRange: "No growth expected" },
  { id: "TC-009", name: "Hepatitis B Surface Antigen",    category: "Serology",      unit: "",        referenceRange: "Non-reactive" },
  { id: "TC-010", name: "HIV 1 & 2 Screening",            category: "Serology",      unit: "",        referenceRange: "Non-reactive" },
  { id: "TC-011", name: "Urinalysis (Routine)",           category: "Urinalysis",    unit: "",        referenceRange: "See report for details" },
  { id: "TC-012", name: "Stool Microscopy & Culture",     category: "Parasitology",  unit: "",        referenceRange: "No ova/cysts seen" },
];

/** Mock reports using the new multi-test structure */
export const labReports: LabReport[] = [
  {
    id: "LR-001",
    patientId: "CP120456A",
    patientName: "Alex Turner",
    patientGender: "Male",
    tests: [
      { definitionId: "TC-001", testName: "Full Blood Count (FBC)", testCategory: "Hematology", result: "WBC: 7.2, RBC: 4.8, Hb: 14.5", unit: "×10⁹/L", referenceRange: "WBC: 4–11, RBC: 4.5–5.5, Hb: 13–17" },
      { definitionId: "TC-003", testName: "Random Blood Sugar (RBS)", testCategory: "Biochemistry", result: "5.4", unit: "mmol/L", referenceRange: "3.9–7.8 mmol/L" },
    ],
    status: "completed",
    requestedBy: "Dr. Sarah Johnson",
    performedBy: "Laboratory Services",
    requestedAt: "2025-01-15T08:00:00.000Z",
    completedAt: "2025-01-15T10:30:00.000Z",
    notes: "All values within normal range.",
  },
  {
    id: "LR-002",
    patientId: "CP120457B",
    patientName: "Grace Adeyemi",
    patientGender: "Female",
    tests: [
      { definitionId: "TC-003", testName: "Random Blood Sugar (RBS)", testCategory: "Biochemistry", result: "11.2", unit: "mmol/L", referenceRange: "3.9–7.8 mmol/L" },
      { definitionId: "TC-005", testName: "Liver Function Test (LFT)", testCategory: "Biochemistry", result: "ALT: 42, AST: 38", unit: "U/L", referenceRange: "ALT: 7–56, AST: 10–40" },
    ],
    status: "completed",
    requestedBy: "Dr. Michael Chen",
    performedBy: "Laboratory Services",
    requestedAt: "2025-01-18T09:00:00.000Z",
    completedAt: "2025-01-18T09:45:00.000Z",
    notes: "RBS elevated. Patient advised to follow up with endocrinologist.",
  },
  {
    id: "LR-003",
    patientId: "CP120460E",
    patientName: "Emeka Okafor",
    patientGender: "Male",
    tests: [
      { definitionId: "TC-007", testName: "Urine Culture & Sensitivity", testCategory: "Microbiology", result: "Pending incubation", unit: "", referenceRange: "No growth expected" },
      { definitionId: "TC-008", testName: "Blood Culture", testCategory: "Microbiology", result: "", unit: "", referenceRange: "No growth expected" },
    ],
    status: "processing",
    requestedBy: "Dr. Sarah Johnson",
    performedBy: "Laboratory Services",
    requestedAt: "2025-01-22T11:30:00.000Z",
    notes: "Samples received and inoculated.",
  },
  {
    id: "LR-004",
    patientId: "CP120461F",
    patientName: "Fatima Bello",
    patientGender: "Female",
    tests: [
      { definitionId: "TC-005", testName: "Liver Function Test (LFT)", testCategory: "Biochemistry", result: "", unit: "U/L", referenceRange: "ALT: 7–56, AST: 10–40" },
      { definitionId: "TC-006", testName: "Kidney Function Test (KFT)", testCategory: "Biochemistry", result: "", unit: "µmol/L", referenceRange: "Creatinine: 62–115, Urea: 2.5–7.5" },
      { definitionId: "TC-011", testName: "Urinalysis (Routine)", testCategory: "Urinalysis", result: "", unit: "", referenceRange: "See report for details" },
    ],
    status: "pending",
    requestedBy: "Dr. Michael Chen",
    performedBy: "",
    requestedAt: "2025-01-23T09:00:00.000Z",
    notes: "",
  },
];
