export type AppointmentStatus =
  | "Scheduled"
  | "Confirmed"
  | "Completed"
  | "Cancelled"
  | "No Show";

export type AppointmentPurpose =
  | "General Consultation"
  | "Prenatal Checkup"
  | "Postnatal Visit"
  | "Immunization / Vaccine"
  | "Family Planning"
  | "Dental Care"
  | "Tuberculosis (TB-DOTS)"
  | "Non-Communicable Disease (PhilPEN)"
  | "Child Growth & Nutrition"
  | "Medicine Resupply"
  | "Follow-up / Lab Results"
  | "Other Health Center Service";

export interface Appointment {
  id: string; // e.g. "APT-2026-001"
  patientName: string;
  patientId?: string; // e.g. "PAT-2026-042"
  patientContact?: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "09:00 AM" or "09:00"
  purpose: AppointmentPurpose | string;
  assignedBHW: string; // Health worker, midwife, or doctor
  status: AppointmentStatus;
  notes?: string;
  createdAt: string; // ISO date or YYYY-MM-DD
}

export interface AppointmentFiltersState {
  searchQuery: string;
  timeframe: "all" | "today" | "upcoming" | "completed";
  status: "all" | AppointmentStatus;
  purpose: "all" | string;
  assignedBHW: "all" | string;
  selectedDate?: string; // YYYY-MM-DD
}

export interface AppointmentDashboardStats {
  today: number;
  upcoming: number;
  completed: number;
  total: number;
  pendingConfirmation: number;
  cancelledNoShow: number;
}
