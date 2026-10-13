export type FPClientType =
  | "New Acceptor"
  | "Current User"
  | "Changing Method"
  | "Changing Clinic"
  | "Dropout/Restart";

export type FPMethod =
  | "Subdermal Implant"
  | "Interval IUD"
  | "Postpartum IUD"
  | "Injectable (DMPA)"
  | "Oral Contraceptive Pills (COC)"
  | "Oral Contraceptive Pills (POP)"
  | "Male Condom"
  | "LAM (Lactational Amenorrhea)"
  | "Standard Days Method (SDM)"
  | "Bilateral Tubal Ligation (BTL)"
  | "No-Scalpel Vasectomy (NSV)"
  | "Cervical Mucus Method"
  | "Basal Body Temperature (BBT)"
  | "Symptothermal Method"
  | "Other Method";

export type FPClientStatus =
  | "Active User"
  | "Follow-up Due"
  | "Discontinued"
  | "Referred";

export type FPFollowUpStatus =
  | "Scheduled"
  | "Due"
  | "Overdue"
  | "Completed"
  | "Cancelled"
  | "Not Scheduled";

export interface FPServiceRecord {
  id: string;
  serviceDate: string; // YYYY-MM-DD
  method: FPMethod | string;
  suppliesGiven: string; // e.g. "3 blister packs", "1 vial DMPA", "10 condoms"
  observationsComplaints: string;
  servicesRendered: string;
  laboratoryReferralNotes?: string;
  provider: string;
  nextServiceDate?: string; // YYYY-MM-DD
}

export interface FPFollowUp {
  id: string;
  clientId: string;
  clientName: string;
  method: FPMethod | string;
  lastServiceDate: string; // YYYY-MM-DD
  nextServiceDate: string; // YYYY-MM-DD
  provider: string;
  status: FPFollowUpStatus;
  notes?: string;
}

export interface FPMedicalHistory {
  severeHeadache: boolean;
  historyOfStrokeHeartAttack: boolean;
  hypertension: boolean;
  coagulationDisorder: boolean;
  breastCancerLump: boolean;
  severeChestPain: boolean;
  unexplainedVaginalBleeding: boolean;
  vaginalDischargeInfection: boolean;
  jaundiceLiverDisease: boolean;
  smokingHabit: boolean;
  takingAntiSeizureOrAntiTB: boolean;
  otherMedicalConditions?: string;
}

export interface FPObGynHistory {
  gravida: number;
  para: number;
  fullTerm: number;
  premature: number;
  abortion: number;
  livingChildren: number;
  dateOfLastDelivery?: string;
  typeOfLastDelivery?: "Vaginal" | "Cesarean" | "None / N/A";
  lmp: string; // Last menstrual period date
  pmp?: string; // Previous menstrual period date
  menstrualFlow: "Scanty" | "Moderate" | "Heavy";
  dysmenorrhea: boolean;
  hydatidiformMoleHistory: boolean;
  ectopicPregnancyHistory: boolean;
}

export interface FPSTIRiskAssessment {
  abnormalVaginalDischarge: boolean;
  genitalSoresUlcers: boolean;
  painBurningUrination: boolean;
  historyTreatedSTI: boolean;
  partnerWithSTISymptoms: boolean;
  multipleSexualPartners: boolean;
}

export interface FPVAWAssessment {
  unpleasantRelationship: boolean;
  partnerDisapprovesFP: boolean;
  domesticViolenceHistory: boolean;
  referredToVAWDesk: boolean;
}

export interface FPPhysicalExam {
  weightKg?: number;
  heightCm?: number;
  bloodPressure?: string; // e.g. "120/80"
  pulseRate?: number;
  conjunctiva?: "Normal" | "Pale" | "Yellowish";
  neckThyroid?: "Normal" | "Enlarged";
  breast?: "Normal" | "Mass" | "Nipple Discharge";
  abdomen?: "Normal" | "Mass" | "Tenderness";
  extremities?: "Normal" | "Edema" | "Varicosities";
  pelvicExamFindings?: string;
}

export interface FPClient {
  id: string; // e.g. "FP-2026-001"

  // 1. Client Information
  philhealthNo?: string;
  nhts4PsStatus: "Yes" | "No";
  lastName: string;
  firstName: string;
  middleName?: string;
  fullName: string;
  birthdate: string; // YYYY-MM-DD
  age: number;
  education: string;
  occupation: string;
  address: string;
  contactNumber: string;
  civilStatus: "Single" | "Married" | "Living-in" | "Widowed" | "Separated";
  religion: string;

  // 2. Spouse Information (Optional)
  hasSpouse: boolean;
  spouseName?: string;
  spouseBirthdate?: string;
  spouseAge?: number;
  spouseEducation?: string;
  spouseOccupation?: string;

  // 3. Family Planning Information
  livingChildrenTotal: number;
  livingChildrenFemale: number;
  livingChildrenMale: number;
  plansForMoreChildren: "Yes" | "No" | "Spacing" | "Undecided";
  monthlyFamilyIncome?: string;
  clientType: FPClientType;
  reasonForFP: "Spacing" | "Limiting" | "Others";
  previousMethod?: string;
  currentMethod: FPMethod | string;
  reasonForChangingMethod?: string;

  // 4. Assessment (DOH FP Form 1)
  medicalHistory: FPMedicalHistory;
  obGynHistory: FPObGynHistory;
  stiRiskAssessment: FPSTIRiskAssessment;
  vawAssessment: FPVAWAssessment;
  physicalExam: FPPhysicalExam;

  // 5. Consent and Acknowledgment
  consentAcknowledged: boolean;
  consentDate: string;

  // 6. Provider and Facility
  provider: string;
  facility: string;
  generalNotes?: string;

  // Service History & Follow-ups
  services: FPServiceRecord[];
  followUps: FPFollowUp[];

  // Status
  status: FPClientStatus;

  // Helper tracking
  registrationDate: string;
  lastServiceDate?: string;
  nextFollowUpDate?: string;
  followUpStatus?: FPFollowUpStatus;
}

export interface FPFiltersState {
  searchQuery: string;
  clientType: "all" | FPClientType;
  method: "all" | FPMethod;
  status: "all" | FPClientStatus;
  followUpDateFilter: "all" | "today" | "this_week" | "this_month" | "upcoming" | "overdue";
}

export interface FPDashboardStats {
  totalRegisteredClients: number;
  currentFPUsers: number;
  upcomingFollowUps: number;
  followUpsDue: number;
}
