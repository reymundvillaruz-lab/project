export type StaffRole = "Administrator" | "BHW" | "Midwife" | "Nurse" | "Doctor";
export type StaffStatus = "Active" | "Inactive" | "On Leave";

export interface HealthStaffUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: StaffRole;
  roleTitle?: string;
  status: StaffStatus;
  assignedStation?: string;
  lastActive?: string;
}

export interface HealthCenterInfo {
  name: string;
  barangay: string;
  municipalityCity: string;
  province: string;
  region: string;
  dohFacilityCode: string;
  contactNumber: string;
  emergencyHotline: string;
  operatingHours: string;
  officialEmail: string;
  address: string;
}

export interface SystemPreferences {
  theme: "light" | "dark" | "system";
  defaultRoute: string;
  language: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  autoSaveDrafts: boolean;
  offlineMode: boolean;
}

export interface NotificationSettings {
  consultationChime: boolean;
  lowStockPharmacyAlerts: boolean;
  highRiskMaternalAlerts: boolean;
  followUpDueAlerts: boolean;
  immunizationDefaulterAlerts: boolean;
  dailyCensusDigest: boolean;
}
