import {
  DashboardData,
  DashboardMetrics,
  PendingAppointmentSummary,
  TodayConsultationSummary,
  UpcomingActivityItem,
  PatientStatisticsData,
} from "@/types/dashboard";
import { UserProfile } from "@/types/user";

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: "bhc-admin-001",
  name: "Administrator",
  email: "admin@barangayhealth.gov.ph",
  role: "ADMINISTRATOR",
  roleTitle: "Barangay Health Center",
  barangay: "Barangay Health Center",
  healthCenter: "Barangay Health Center",
  assignedStation: "Triage & Clinical Management Station",
};

export const EMPTY_DASHBOARD_METRICS: DashboardMetrics = {
  totalRegisteredPatients: 0,
  totalPatients: 0,
  todayConsultations: 0,
  todayAppointments: 0,
  pendingAppointments: 0,
  immunizationsThisMonth: 0,
  immunizationsDueThisWeek: 0,
  activeMaternalCases: 0,
  lowStockMedicines: 0,
};

export const EMPTY_DASHBOARD_DATA: DashboardData = {
  metrics: EMPTY_DASHBOARD_METRICS,
  todayConsultations: [],
  upcomingAppointments: [],
  recentActivities: [],
  upcomingActivities: [],
};

// Strictly EMPTY - Zero mock activities
export const INITIAL_UPCOMING_ACTIVITIES: UpcomingActivityItem[] = [];

export const INITIAL_PATIENT_STATISTICS: PatientStatisticsData = {
  totalPatients: 0,
  groups: [
    { label: "Women of Reproductive Age (15–49)", count: 0, percentage: 0, colorClass: "bg-rose-500" },
    { label: "Senior Citizens (60+ yrs)", count: 0, percentage: 0, colorClass: "bg-teal-600" },
    { label: "Adult Population (18–59 yrs)", count: 0, percentage: 0, colorClass: "bg-sky-500" },
    { label: "Children & Infants (0–5 yrs)", count: 0, percentage: 0, colorClass: "bg-emerald-500" },
    { label: "Persons with Disability (PWD)", count: 0, percentage: 0, colorClass: "bg-amber-500" },
  ],
  coverage: {
    philHealthIndigent: 0,
    philHealthKonsulta: 0,
    seniorCitizenMembers: 0,
    pwdMembers: 0,
  },
};

export const INITIAL_TODAY_APPOINTMENTS: PendingAppointmentSummary[] = [];

export const INITIAL_RECENT_CONSULTATIONS: TodayConsultationSummary[] = [];

export const INITIAL_DASHBOARD_METRICS: DashboardMetrics = {
  totalRegisteredPatients: 0,
  totalPatients: 0,
  todayConsultations: 0,
  todayAppointments: 0,
  pendingAppointments: 0,
  immunizationsThisMonth: 0,
  immunizationsDueThisWeek: 0,
  activeMaternalCases: 0,
  lowStockMedicines: 0,
};

export const INITIAL_DASHBOARD_DATA: DashboardData = {
  metrics: INITIAL_DASHBOARD_METRICS,
  todayConsultations: [],
  upcomingAppointments: [],
  recentActivities: [],
  upcomingActivities: INITIAL_UPCOMING_ACTIVITIES,
  patientStatistics: INITIAL_PATIENT_STATISTICS,
};
