export type Gender = "Male" | "Female" | "Other";
export type CivilStatus = "Single" | "Married" | "Widowed" | "Separated" | "Solo Parent";

export interface Address {
  purokOrStreet: string;
  barangay: string;
  cityOrMunicipality: string;
  province: string;
  postalCode?: string;
}

export interface EmergencyContact {
  fullName: string;
  relationship: string;
  contactNumber: string;
}

export interface Patient {
  id: string;
  patientIdNumber: string; // e.g., BHC-2026-0001
  philHealthNumber?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  dateOfBirth: string;
  age: number;
  gender: Gender;
  civilStatus: CivilStatus;
  bloodType?: string;
  contactNumber: string;
  address: Address;
  emergencyContact: EmergencyContact;
  isNHTSBeneficiary: boolean; // National Household Targeting System (4Ps)
  isSeniorCitizen: boolean;
  isPWD: boolean;
  registeredDate: string;
  lastVisitDate?: string;
}
