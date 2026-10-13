export interface PhilpenPatientInfo {
  healthFacilityName: string;
  assessmentDate: string;
  surname: string;
  givenName: string;
  middleName: string;
  age: number | "";
  sex: "Male" | "Female" | "";
  birthdate: string;
  phicNo: string;
  civilStatus: "Single" | "Married" | "Widowed" | "Separated" | "Cohabiting" | "";
  religion: string;
  contactNo: string;
  address: string;
  pwdIdNo: string;
  employmentStatus: "Employed" | "Unemployed" | "Self-Employed" | "Student" | "Retired" | "";
  isIp: "IP" | "Non-IP" | "";
  ethnicity: string;
}

export interface PhilpenRedFlags {
  chestPain: "Yes" | "No" | "";
  difficultyBreathing: "Yes" | "No" | "";
  lossOfConsciousness: "Yes" | "No" | "";
  slurredSpeech: "Yes" | "No" | "";
  facialAsymmetry: "Yes" | "No" | "";
  weaknessNumbness: "Yes" | "No" | "";
  disoriented: "Yes" | "No" | "";
  chestRetractions: "Yes" | "No" | "";
  seizureConvulsion: "Yes" | "No" | "";
  selfHarmSuicide: "Yes" | "No" | "";
  agitatedBehavior: "Yes" | "No" | "";
  eyeInjuryForeignBody: "Yes" | "No" | "";
  severeInjuries: "Yes" | "No" | "";
}

export interface PhilpenMedicalHistory {
  hypertension: "Yes" | "No" | "";
  heartDiseases: "Yes" | "No" | "";
  diabetes: "Yes" | "No" | "";
  cancer: "Yes" | "No" | "";
  copd: "Yes" | "No" | "";
  asthma: "Yes" | "No" | "";
  allergies: "Yes" | "No" | "";
  mentalNeurologicalSubstance: "Yes" | "No" | "";
  visionProblems: "Yes" | "No" | "";
  previousSurgicalHistory: "Yes" | "No" | "";
  thyroidDisorders: "Yes" | "No" | "";
  kidneyDisorders: "Yes" | "No" | "";
}

export interface PhilpenFamilyHistory {
  hypertension: "Yes" | "No" | "";
  stroke: "Yes" | "No" | "";
  heartDisease: "Yes" | "No" | "";
  diabetesMellitus: "Yes" | "No" | "";
  asthma: "Yes" | "No" | "";
  cancer: "Yes" | "No" | "";
  kidneyDisease: "Yes" | "No" | "";
  prematureVascularDisease: "Yes" | "No" | "";
  familyTbLast5Years: "Yes" | "No" | "";
  mentalNeurologicalSubstance: "Yes" | "No" | "";
  copd: "Yes" | "No" | "";
}

export interface PhilpenNcdRiskFactors {
  tobaccoUse: "Q1" | "Q2" | "Q3" | "Q4" | "";
  alcoholIntake: "Never" | "Yes" | "";
  bingeDrinking: "Yes" | "No" | "";
  physicalActivity: "Yes" | "No" | "";
  nutritionDietary: "Yes" | "No" | "";
  weightKg: string;
  heightCm: string;
  bmi: string;
  waistCircumferenceCm: string;
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
}

export interface PhilpenRiskScreening {
  fbsResult: string;
  fbsDate: string;
  rbsResult: string;
  symptoms: {
    polyphagia: boolean;
    polydipsia: boolean;
    polyuria: boolean;
  };
  lipidProfile: {
    totalCholesterol: string;
    dateTaken: string;
    hdl: string;
    ldl: string;
    vldl: string;
    triglyceride: string;
  };
  urinalysis: {
    proteinResult: string;
    dateTaken: string;
    dipstickTest: string;
    ketones: string;
    ketonesDate: string;
  };
  respiratory: {
    breathlessness: boolean;
    chronicCough: boolean;
    sputumProduction: boolean;
    chestTightness: boolean;
    wheezing: boolean;
    pefrResult: string;
    pefrComparison: ">=20% change" | "<20% change" | "";
  };
}

export interface PhilpenManagement {
  lifestyleModification: "Yes" | "No" | "";
  antiHypertensives: "Yes" | "No" | "";
  oralHypoglycemic: "Yes" | "No" | "";
  followUpDate: string;
  remarks: string;
}

export interface PhilpenFormData {
  patientInfo: PhilpenPatientInfo;
  redFlags: PhilpenRedFlags;
  medicalHistory: PhilpenMedicalHistory;
  familyHistory: PhilpenFamilyHistory;
  ncdRiskFactors: PhilpenNcdRiskFactors;
  riskScreening: PhilpenRiskScreening;
  management: PhilpenManagement;
}

export const INITIAL_PHILPEN_FORM_DATA: PhilpenFormData = {
  patientInfo: {
    healthFacilityName: "Barangay Health Center",
    assessmentDate: new Date().toISOString().split("T")[0],
    surname: "",
    givenName: "",
    middleName: "",
    age: "",
    sex: "",
    birthdate: "",
    phicNo: "",
    civilStatus: "",
    religion: "",
    contactNo: "",
    address: "",
    pwdIdNo: "",
    employmentStatus: "",
    isIp: "",
    ethnicity: "",
  },
  redFlags: {
    chestPain: "",
    difficultyBreathing: "",
    lossOfConsciousness: "",
    slurredSpeech: "",
    facialAsymmetry: "",
    weaknessNumbness: "",
    disoriented: "",
    chestRetractions: "",
    seizureConvulsion: "",
    selfHarmSuicide: "",
    agitatedBehavior: "",
    eyeInjuryForeignBody: "",
    severeInjuries: "",
  },
  medicalHistory: {
    hypertension: "",
    heartDiseases: "",
    diabetes: "",
    cancer: "",
    copd: "",
    asthma: "",
    allergies: "",
    mentalNeurologicalSubstance: "",
    visionProblems: "",
    previousSurgicalHistory: "",
    thyroidDisorders: "",
    kidneyDisorders: "",
  },
  familyHistory: {
    hypertension: "",
    stroke: "",
    heartDisease: "",
    diabetesMellitus: "",
    asthma: "",
    cancer: "",
    kidneyDisease: "",
    prematureVascularDisease: "",
    familyTbLast5Years: "",
    mentalNeurologicalSubstance: "",
    copd: "",
  },
  ncdRiskFactors: {
    tobaccoUse: "",
    alcoholIntake: "",
    bingeDrinking: "",
    physicalActivity: "",
    nutritionDietary: "",
    weightKg: "",
    heightCm: "",
    bmi: "",
    waistCircumferenceCm: "",
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
  },
  riskScreening: {
    fbsResult: "",
    fbsDate: "",
    rbsResult: "",
    symptoms: {
      polyphagia: false,
      polydipsia: false,
      polyuria: false,
    },
    lipidProfile: {
      totalCholesterol: "",
      dateTaken: "",
      hdl: "",
      ldl: "",
      vldl: "",
      triglyceride: "",
    },
    urinalysis: {
      proteinResult: "",
      dateTaken: "",
      dipstickTest: "",
      ketones: "",
      ketonesDate: "",
    },
    respiratory: {
      breathlessness: false,
      chronicCough: false,
      sputumProduction: false,
      chestTightness: false,
      wheezing: false,
      pefrResult: "",
      pefrComparison: "",
    },
  },
  management: {
    lifestyleModification: "",
    antiHypertensives: "",
    oralHypoglycemic: "",
    followUpDate: "",
    remarks: "",
  },
};
