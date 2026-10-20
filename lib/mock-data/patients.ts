import { PhilpenFormData } from "./philpen";

export interface MockPatient {
  id: string;
  patientIdNumber?: string;
  firstName: string;
  lastName: string;
  middleName: string;
  suffix?: string;
  fullName: string;
  sex: "Male" | "Female";
  age: number;
  birthdate: string;
  barangay: string;
  address: string;
  purokOrStreet?: string;
  purok?: string;
  cityOrMunicipality?: string;
  municipality?: string;
  province?: string;
  postalCode?: string;
  contact: string;
  contactNumber?: string;
  lastVisit: string;
  registeredDate?: string;
  createdAt?: string;
  updatedAt?: string;
  status: "Active" | "Inactive" | "Follow-up Needed";
  phicNo: string;
  philhealthNumber?: string;
  civilStatus: string;
  religion: string;
  bloodType?: string;
  pwdId: string;
  employmentStatus: string;
  isIp: string;
  ethnicity: string;
  isNhtsBeneficiary?: boolean;
  isSeniorCitizen?: boolean;
  isPwd?: boolean;
  emergencyContact: {
    name: string;
    relationship: string;
    contact: string;
  };
  healthInfo: {
    bloodType: string;
    allergies: string[];
    chronicConditions: string[];
    philpenStatus: "Completed" | "Pending" | "High Risk";
    lastBp: string;
    lastBmi: string;
  };
  consultations: Array<{
    id: string;
    date: string;
    purpose: string;
    physician: string;
    diagnosis: string;
  }>;
  immunizations: Array<{
    vaccine: string;
    dateGiven: string;
    batchNo: string;
    administeredBy: string;
  }>;
  appointments: Array<{
    id: string;
    date: string;
    time: string;
    purpose: string;
    status: string;
  }>;
  prescriptions: Array<{
    id: string;
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  philpenRecord?: Partial<PhilpenFormData>;
}

// Strictly EMPTY - No mock patients
export const INITIAL_MOCK_PATIENTS: MockPatient[] = [];

const LOCAL_STORAGE_KEY = "bhcms_patient_registry_v2";

export function getStoredPatients(): MockPatient[] {
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

export function saveStoredPatients(patients: MockPatient[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(patients));
    window.dispatchEvent(
      new CustomEvent("bhcms:patients-updated", { detail: patients })
    );
  } catch (e) {
    console.error("Failed to save patients to localStorage", e);
  }
}

export function addStoredPatient(patient: MockPatient): MockPatient[] {
  const current = getStoredPatients();
  const existingIndex = current.findIndex((p) => p.id === patient.id);
  let updated: MockPatient[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = patient;
  } else {
    updated = [patient, ...current];
  }
  saveStoredPatients(updated);
  return updated;
}

export function deleteStoredPatient(id: string): MockPatient[] {
  const current = getStoredPatients();
  const updated = current.filter((p) => p.id !== id);
  saveStoredPatients(updated);
  return updated;
}

export function getPatientById(id: string): MockPatient | undefined {
  const patients = getStoredPatients();
  return patients.find((p) => p.id.toLowerCase() === id.toLowerCase());
}
