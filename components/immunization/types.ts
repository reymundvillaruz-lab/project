export type VaccineStatus = "Completed" | "Due" | "Overdue" | "Scheduled";

export interface VaccineDoseConfig {
  key: string;
  vaccineName: string;
  dose: string;
  targetSchedule: string;
  description: string;
}

export const NIP_VACCINE_LIST: VaccineDoseConfig[] = [
  {
    key: "bcg",
    vaccineName: "BCG",
    dose: "At Birth",
    targetSchedule: "At birth",
    description: "Bacillus Calmette–Guérin (Tuberculosis)",
  },
  {
    key: "hepb",
    vaccineName: "Hepatitis B",
    dose: "At Birth",
    targetSchedule: "At birth (< 24 hrs)",
    description: "Hepatitis B Birth Dose",
  },
  {
    key: "penta1",
    vaccineName: "Penta",
    dose: "1",
    targetSchedule: "6 weeks (1½ mos)",
    description: "Pentavalent 1 (DTP-HepB-HiB)",
  },
  {
    key: "penta2",
    vaccineName: "Penta",
    dose: "2",
    targetSchedule: "10 weeks (2½ mos)",
    description: "Pentavalent 2 (DTP-HepB-HiB)",
  },
  {
    key: "penta3",
    vaccineName: "Penta",
    dose: "3",
    targetSchedule: "14 weeks (3½ mos)",
    description: "Pentavalent 3 (DTP-HepB-HiB)",
  },
  {
    key: "opv1",
    vaccineName: "OPV",
    dose: "1",
    targetSchedule: "6 weeks (1½ mos)",
    description: "Oral Polio Vaccine 1",
  },
  {
    key: "opv2",
    vaccineName: "OPV",
    dose: "2",
    targetSchedule: "10 weeks (2½ mos)",
    description: "Oral Polio Vaccine 2",
  },
  {
    key: "opv3",
    vaccineName: "OPV",
    dose: "3",
    targetSchedule: "14 weeks (3½ mos)",
    description: "Oral Polio Vaccine 3",
  },
  {
    key: "ipv",
    vaccineName: "IPV",
    dose: "1",
    targetSchedule: "14 weeks (3½ mos)",
    description: "Inactivated Polio Vaccine",
  },
  {
    key: "pcv1",
    vaccineName: "PCV",
    dose: "1",
    targetSchedule: "6 weeks (1½ mos)",
    description: "Pneumococcal Conjugate Vaccine 1",
  },
  {
    key: "pcv2",
    vaccineName: "PCV",
    dose: "2",
    targetSchedule: "10 weeks (2½ mos)",
    description: "Pneumococcal Conjugate Vaccine 2",
  },
  {
    key: "pcv3",
    vaccineName: "PCV",
    dose: "3",
    targetSchedule: "14 weeks (3½ mos)",
    description: "Pneumococcal Conjugate Vaccine 3",
  },
  {
    key: "mcv",
    vaccineName: "MCV",
    dose: "1",
    targetSchedule: "9 months",
    description: "Measles-Containing Vaccine (MCV 1)",
  },
  {
    key: "mmr",
    vaccineName: "MMR",
    dose: "1",
    targetSchedule: "12 months",
    description: "Measles, Mumps, Rubella (MCV 2)",
  },
  {
    key: "rota1",
    vaccineName: "Rota",
    dose: "1",
    targetSchedule: "6 weeks (1½ mos)",
    description: "Rotavirus Vaccine 1",
  },
  {
    key: "rota2",
    vaccineName: "Rota",
    dose: "2",
    targetSchedule: "10 weeks (2½ mos)",
    description: "Rotavirus Vaccine 2",
  },
];

export interface VaccineEntryForm {
  dateGiven: string;
  nextDue: string;
  status: VaccineStatus | "";
}

export interface NipPatientRecord {
  id: string;
  // SECTION 1 — PERSONAL INFORMATION
  patientName: string;
  sex: "Male" | "Female" | "";
  phicNumber: string;
  birthdate: string;
  age: string;
  nhts: "Yes" | "No" | "";
  birthplace: string;

  // SECTION 2 — FAMILY INFORMATION
  motherName: string;
  fatherName: string;
  familySerialNo: string;

  // SECTION 3 — ADDRESS / REGISTRATION
  address: string;
  dateRegistered: string;

  // SECTION 4 — HEALTH MEASUREMENTS
  measurementDate: string;
  heightCm: string;
  weightKg: string;
  temperatureC: string;
  remarks: string;

  // SECTION 5 — IMMUNIZATION RECORD
  vaccines: Record<string, VaccineEntryForm>;

  // SECTION 6 — PROVIDER INFORMATION
  providerName: string;
  notes: string;

  createdAt: string;
  updatedAt: string;
}

export interface ImmunizationTableRow {
  id: string;
  recordId: string;
  patientName: string;
  age: string;
  birthdate: string;
  address: string;
  phicNumber: string;
  vaccineKey: string;
  vaccineName: string;
  dose: string;
  dateGiven: string;
  nextDue: string;
  status: VaccineStatus;
  providerName: string;
}

export type PatientImmunizationStatus =
  | "Fully Immunized"
  | "Partially Immunized"
  | "Due"
  | "Overdue"
  | "Not Started";

export interface PatientImmunizationAnalyticsRow {
  id: string;
  recordId: string;
  patientName: string;
  sex: "Male" | "Female" | "";
  phicNumber: string;
  birthdate: string;
  age: string;
  address: string;
  motherName: string;

  // Analytics Metrics
  completedDoses: number;
  totalDoses: number;
  completionRate: number; // 0 to 100 percentage
  dueDoses: number;
  overdueDoses: number;
  overallStatus: PatientImmunizationStatus;

  lastVaccineGiven: {
    vaccineName: string;
    dose: string;
    dateGiven: string;
  } | null;

  nextDueVaccine: {
    vaccineName: string;
    dose: string;
    targetSchedule: string;
    nextDue?: string;
  } | null;

  measurements: {
    weightKg: string;
    heightCm: string;
    temperatureC: string;
  } | null;

  providerName: string;
  updatedAt: string;
}

export const IMMUNIZATION_STORAGE_KEY = "bhcms_immunization_records_v1";

export function getStoredImmunizationRecords(): NipPatientRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(IMMUNIZATION_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredImmunizationRecords(records: NipPatientRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(IMMUNIZATION_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error("Failed to save immunization records to storage", e);
  }
}
