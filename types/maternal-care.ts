export type MaternalStatus = "Active" | "Follow-up Due" | "Completed";

export type AppointmentStatus = "Scheduled" | "Completed" | "Follow-up Due" | "Cancelled";

export type TetanusToxoidStatus = "None" | "TT1" | "TT2" | "TT3" | "TT4" | "TT5";

export type Trimester = "1st Trimester" | "2nd Trimester" | "3rd Trimester";

export interface PrenatalVisit {
  id: string;
  visitDate: string; // YYYY-MM-DD
  trimester: Trimester;
  assignedProvider: string; // BHW or Midwife name
  visitNotes: string;
  followUpDate?: string; // YYYY-MM-DD
  weightKg?: number;
  bloodPressure?: string;
}

export interface MaternalAppointment {
  id: string;
  patientId: string;
  patientName: string;
  appointmentDate: string; // YYYY-MM-DD
  purpose: string;
  assignedProvider: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface MaternalRecord {
  id: string; // e.g., "MAT-2026-001"
  // A. Patient Information (BNC Form 1-G-a)
  patientName: string;
  dateOfBirth: string; // YYYY-MM-DD
  age: number;
  address: string; // Purok / Sitio, Barangay
  contactNumber: string;
  philhealthNo?: string;

  // B. Pregnancy Information (BNC Form 1-G-a)
  recordDate: string; // Date of Registration / Enrollment (YYYY-MM-DD)
  gravida: number; // Total number of pregnancies
  para: number; // Total number of viable births
  lmp: string; // Last Menstrual Period (YYYY-MM-DD)
  edc: string; // Estimated Date of Confinement / EDD (YYYY-MM-DD)
  gestationalAgeWeeks?: number;
  tetanusToxoidStatus: TetanusToxoidStatus;
  ironFolicAcidSupplementation?: string; // e.g., "Given 30 tablets", "Ongoing"
  nutritionalStatus?: string; // e.g., "Normal", "Underweight", "Overweight"

  // C. Prenatal Visit Information
  prenatalVisits: PrenatalVisit[];

  // D. Appointments & Follow-up
  appointments: MaternalAppointment[];

  // E. General Notes & Administration
  assignedBhw: string;
  status: MaternalStatus;
  generalNotes: string;

  // Computed / Cache helpers
  lastPrenatalVisit?: string;
  nextAppointmentDate?: string;
}

export interface MaternalFiltersState {
  searchQuery: string;
  status: "all" | MaternalStatus;
  appointmentFilter: "all" | "today" | "this_week" | "this_month" | "upcoming" | "overdue";
}

export interface MaternalDashboardStats {
  activeCases: number;
  visitsThisMonth: number;
  upcomingAppointments: number;
  followUpsDue: number;
}
