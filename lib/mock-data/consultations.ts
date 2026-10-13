import { getStoredPatients } from "./patients";

export type ConsultationStatus = "Completed" | "Follow-up" | "Pending";
export type VisitType = "General Consultation" | "Follow-up" | "Health Check" | "Other";

export interface ConsultationVitalSigns {
  temperature: string; // in °C
  bloodPressureSystolic: string; // in mmHg
  bloodPressureDiastolic: string; // in mmHg
  pulseRate: string; // in bpm
  respiratoryRate: string; // in cpm
  weightKg: string; // in kg
  heightCm: string; // in cm
  bmi: string; // in kg/m²
}

export interface ConsultationFollowUp {
  required: "No" | "Yes";
  date?: string;
  instructions?: string;
}

export interface MockConsultation {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientSex: "Male" | "Female";
  patientContact: string;
  date: string;
  visitType: VisitType;
  provider: string;
  reasonForVisit: string;
  diagnosis: string;
  vitalSigns: ConsultationVitalSigns;
  notes: string;
  followUp: ConsultationFollowUp;
  status: ConsultationStatus;
}

export interface PatientOption {
  id: string;
  name: string;
  age: number;
  sex: "Male" | "Female";
  contact: string;
}

export const MOCK_PROVIDERS: string[] = [
  "Dr. Alcantara (Municipal Physician)",
  "Nurse Joy Ramos, RN",
  "Elena Flores, BHW",
  "Maria Santos, BHW",
  "Ana Reyes, BHW",
  "Barangay Health Center Staff",
];

export const MOCK_VISIT_TYPES: VisitType[] = [
  "General Consultation",
  "Follow-up",
  "Health Check",
  "Other",
];

// Strictly EMPTY - No mock consultations
export const INITIAL_MOCK_CONSULTATIONS: MockConsultation[] = [];

// Dynamic patient options loaded from registered patients
export function getPatientOptions(): PatientOption[] {
  const patients = getStoredPatients();
  return patients.map((p) => ({
    id: p.id,
    name: p.fullName || `${p.firstName} ${p.lastName}`,
    age: p.age,
    sex: p.sex,
    contact: p.contact || p.phicNo || "",
  }));
}

// Kept for backward compatibility but empty by default
export const MOCK_PATIENTS_LIST: PatientOption[] = [];

const LOCAL_STORAGE_KEY = "bhcms_consultations_v2";

export function getStoredConsultations(): MockConsultation[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredConsultations(consultations: MockConsultation[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(consultations));
  } catch (e) {
    console.error("Failed to save consultations to localStorage", e);
  }
}

export function addStoredConsultation(consultation: MockConsultation): MockConsultation[] {
  const current = getStoredConsultations();
  const existingIndex = current.findIndex((c) => c.id === consultation.id);
  let updated: MockConsultation[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = consultation;
  } else {
    updated = [consultation, ...current];
  }
  saveStoredConsultations(updated);
  return updated;
}

export function updateStoredConsultation(consultation: MockConsultation): MockConsultation[] {
  const current = getStoredConsultations();
  const updated = current.map((c) => (c.id === consultation.id ? consultation : c));
  saveStoredConsultations(updated);
  return updated;
}

export function getConsultationById(id: string): MockConsultation | undefined {
  const consultations = getStoredConsultations();
  return consultations.find((c) => c.id.toLowerCase() === id.toLowerCase());
}
