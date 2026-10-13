export type ReportDateFilter = "today" | "week" | "month" | "year" | "custom";

export interface ReportDateRange {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  label: string; // e.g. "October 2026", "October 1 - October 31, 2026"
}

export interface PatientReportData {
  totalRegistered: number;
  newRegistrationsThisPeriod: number;
  demographics: {
    under5: { count: number; percentage: number };
    schoolAge: { count: number; percentage: number };
    womenReproductiveAge: { count: number; percentage: number };
    adults: { count: number; percentage: number };
    seniors: { count: number; percentage: number };
  };
  socialCoverage: {
    philhealthMembers: number;
    nhts4PsBeneficiaries: number;
    seniorCitizenMembers: number;
    pwdMembers: number;
  };
}

export interface MorbidityItem {
  disease: string;
  cases: number;
  percentage: number;
  icdCode?: string;
}

export interface ConsultationReportData {
  totalConsultations: number;
  triageLevels: {
    routine: number;
    priority: number;
    urgent: number;
  };
  topMorbidities: MorbidityItem[];
  outcomes: {
    treatedSentHome: number;
    referredHospital: number;
    followUpRequired: number;
  };
}

export interface VaccineAntigenItem {
  antigen: string;
  targetPopulation: number;
  dosesAdministered: number;
  coveragePercentage: number;
}

export interface ImmunizationReportData {
  targetInfants: number;
  fullyImmunizedChildren: number;
  ficCoverageRate: number;
  defaulterRate: number;
  antigens: VaccineAntigenItem[];
}

export interface MaternalCareReportData {
  totalExpectedPregnancies: number;
  firstTrimesterBooking: number;
  fourOrMoreAntenatalVisits: number;
  tetanusVaccinatedMothers: number;
  ironFolicAcidSupplemented: number;
  highRiskPregnanciesIdentified: number;
  postpartumVisitsCompleted: number;
  facilityBasedDeliveryRate: number;
}

export interface FPMethodDistributionItem {
  method: string;
  usersCount: number;
  percentage: number;
  category: "Modern Artificial" | "Long-Acting & Permanent" | "Natural / LAM";
}

export interface FamilyPlanningReportData {
  totalCurrentUsers: number;
  newAcceptors: number;
  methodChangers: number;
  dropoutsRestart: number;
  unmetNeedPercentage: number;
  methodDistribution: FPMethodDistributionItem[];
}

export interface AppointmentReportData {
  totalScheduled: number;
  completedVisits: number;
  confirmedUpcoming: number;
  pendingScheduled: number;
  noShowCount: number;
  cancelledCount: number;
  completionRate: number;
  noShowRate: number;
}

export interface TopPrescribedMedItem {
  name: string;
  prescriptionsCount: number;
  quantityDispensed: number;
  unit: string;
}

export interface MedicineReportData {
  totalPrescriptionsIssued: number;
  totalPrescriptionsDispensed: number;
  dispensationFulfillmentRate: number;
  inventorySummary: {
    totalItems: number;
    adequateStock: number;
    lowStockWarnings: number;
    outOfStockDepleted: number;
    expiredItems: number;
  };
  topPrescribedMedicines: TopPrescribedMedItem[];
}

export interface ComprehensiveReportData {
  period: ReportDateRange;
  generatedDate: string;
  facilityName: string;
  healthOfficer: string;
  patients: PatientReportData;
  consultations: ConsultationReportData;
  immunizations: ImmunizationReportData;
  maternalCare: MaternalCareReportData;
  familyPlanning: FamilyPlanningReportData;
  appointments: AppointmentReportData;
  medicines: MedicineReportData;
}
