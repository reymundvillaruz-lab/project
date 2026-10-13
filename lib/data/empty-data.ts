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

// Public health schedule template (official DOH programs)
export const INITIAL_UPCOMING_ACTIVITIES: UpcomingActivityItem[] = [
  {
    id: "act-001",
    title: "Expanded Program on Immunization (EPI Day)",
    date: "Every Wednesday & Friday",
    time: "8:00 AM – 12:00 PM",
    location: "Health Station Immunization Room",
    targetGroup: "Infants (0–12 months) • BCG, Pentavalent, OPV/IPV, PCV",
    category: "IMMUNIZATION",
    badgeLabel: "EPI Schedule",
  },
  {
    id: "act-002",
    title: "Maternal Health & Safe Motherhood Consultation",
    date: "Every Tuesday & Thursday",
    time: "8:00 AM – 3:00 PM",
    location: "Maternal Care Clinic",
    targetGroup: "Pregnant Mothers (Prenatal & Postnatal Care)",
    category: "MATERNAL",
    badgeLabel: "Maternal Care",
  },
  {
    id: "act-003",
    title: "Non-Communicable Disease (PHILPEN) Risk Assessment",
    date: "Daily (Monday to Friday)",
    time: "8:00 AM – 5:00 PM",
    location: "Triage & PHILPEN Screening Station",
    targetGroup: "Adults 20+ yrs (Blood Pressure, Blood Glucose, BMI)",
    category: "SENIOR_CARE",
    badgeLabel: "PHILPEN Screening",
  },
];

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
