export interface DashboardMetrics {
  totalRegisteredPatients: number;
  totalPatients?: number;
  todayConsultations: number;
  todayAppointments?: number;
  pendingAppointments: number;
  immunizationsThisMonth?: number;
  immunizationsDueThisWeek: number;
  activeMaternalCases: number;
  lowStockMedicines: number;
}

export interface ActivityItem {
  id: string;
  type: "PATIENT_REGISTRATION" | "CONSULTATION" | "IMMUNIZATION" | "APPOINTMENT" | "PRESCRIPTION";
  description: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  patientId?: string;
  patientName?: string;
}

export interface TodayConsultationSummary {
  id: string;
  queueNumber: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: "Male" | "Female";
  purpose: string;
  vitals?: string;
  attendingStaff: string;
  status: "WAITING" | "IN_PROGRESS" | "COMPLETED" | "REFERRED";
  timeIn: string;
}

export interface PendingAppointmentSummary {
  id: string;
  patientId: string;
  patientName: string;
  scheduledTime: string;
  serviceType: "General Consultation" | "Immunization" | "Prenatal Checkup" | "Family Planning" | "Dental Care";
  assignedBHW: string;
  status: "CONFIRMED" | "PENDING" | "RESCHEDULED" | "CANCELLED";
}

export interface UpcomingActivityItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  targetGroup: string;
  category: "IMMUNIZATION" | "MATERNAL" | "SENIOR_CARE" | "COMMUNITY_HEALTH";
  badgeLabel: string;
}

export interface DemographicGroup {
  label: string;
  count: number;
  percentage: number;
  colorClass: string;
}

export interface PatientStatisticsData {
  totalPatients: number;
  groups: DemographicGroup[];
  coverage: {
    philHealthIndigent: number;
    philHealthKonsulta: number;
    seniorCitizenMembers: number;
    pwdMembers: number;
  };
}

export interface DashboardData {
  metrics: DashboardMetrics;
  todayConsultations: TodayConsultationSummary[];
  upcomingAppointments: PendingAppointmentSummary[];
  recentActivities: ActivityItem[];
  upcomingActivities?: UpcomingActivityItem[];
  patientStatistics?: PatientStatisticsData;
}
