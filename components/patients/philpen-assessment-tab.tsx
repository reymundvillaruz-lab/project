"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  HeartPulse,
  HeartHandshake,
  Stethoscope,
  Calendar,
  Building2,
  Printer,
  Edit3,
  Flame,
  Wine,
  Footprints,
  Salad,
  Scale,
  Ruler,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MockPatient } from "@/lib/mock-data/patients";
import { PhilpenFormData } from "@/lib/mock-data/philpen";

interface PhilpenAssessmentTabProps {
  patient: MockPatient;
}

export function PhilpenAssessmentTab({ patient }: PhilpenAssessmentTabProps) {
  const philpen = patient.philpenRecord;

  // Derive Red Flags
  const redFlags = philpen?.redFlags || {};
  const activeRedFlags = Object.entries(redFlags).filter(([_, val]) => val === "Yes");
  const hasRedFlags = activeRedFlags.length > 0;

  // Medical History
  const medicalHistory = philpen?.medicalHistory || {};
  const reportedMedicalConditions = Object.entries(medicalHistory).filter(([_, val]) => val === "Yes");

  // Family History
  const familyHistory = philpen?.familyHistory || {};
  const reportedFamilyConditions = Object.entries(familyHistory).filter(([_, val]) => val === "Yes");

  // Lifestyle Risk Factors
  const ncd = philpen?.ncdRiskFactors;

  // Measurements
  const systolic = ncd?.bloodPressureSystolic || patient.healthInfo?.lastBp?.split("/")[0] || "";
  const diastolic = ncd?.bloodPressureDiastolic || patient.healthInfo?.lastBp?.split("/")[1]?.replace(/[^0-9]/g, "") || "";
  const bpDisplay = systolic && diastolic ? `${systolic}/${diastolic} mmHg` : patient.healthInfo?.lastBp || "Not recorded";
  
  const bmiVal = ncd?.bmi || patient.healthInfo?.lastBmi?.replace(/[^0-9.]/g, "") || "";
  const weightKg = ncd?.weightKg || "";
  const heightCm = ncd?.heightCm || "";
  const waistCm = ncd?.waistCircumferenceCm || "";

  // Diagnostics & Screening
  const screening = philpen?.riskScreening;
  const management = philpen?.management;

  // Determine BP Classification
  const getBpClassification = (sysStr: string, diaStr: string) => {
    const sys = parseInt(sysStr, 10);
    const dia = parseInt(diaStr, 10);
    if (isNaN(sys) || isNaN(dia)) return { label: "Recorded", color: "text-slate-700 bg-slate-100" };
    if (sys >= 140 || dia >= 90) return { label: "Stage 2 Hypertension", color: "text-rose-700 bg-rose-50 border-rose-200" };
    if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) return { label: "Stage 1 Hypertension", color: "text-amber-700 bg-amber-50 border-amber-200" };
    if (sys >= 120 && sys <= 129 && dia < 80) return { label: "Elevated BP", color: "text-yellow-700 bg-yellow-50 border-yellow-200" };
    return { label: "Normal BP", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  };

  // Determine Asian-Pacific BMI Classification
  const getBmiClassification = (bmiStr: string) => {
    const b = parseFloat(bmiStr);
    if (isNaN(b)) return { label: "Recorded", color: "text-slate-700 bg-slate-100" };
    if (b < 18.5) return { label: "Underweight (<18.5)", color: "text-sky-700 bg-sky-50 border-sky-200" };
    if (b <= 22.9) return { label: "Normal (18.5-22.9)", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    if (b <= 24.9) return { label: "Overweight (23.0-24.9)", color: "text-amber-700 bg-amber-50 border-amber-200" };
    return { label: "Obese (≥25.0)", color: "text-rose-700 bg-rose-50 border-rose-200" };
  };

  // Determine Tobacco Label
  const getTobaccoLabel = (q?: string) => {
    switch (q) {
      case "Q1": return "Never Used Tobacco";
      case "Q2": return "Former Smoker (Quit)";
      case "Q3": return "Current Smoker (Occasional / Non-Daily)";
      case "Q4": return "Current Daily Smoker";
      default: return "Not recorded";
    }
  };

  const bpStatus = getBpClassification(systolic, diastolic);
  const bmiStatus = getBmiClassification(bmiVal);

  const handlePrint = () => {
    window.print();
  };

  // Red Flags Definitions Map
  const RED_FLAGS_MAP: Record<string, string> = {
    chestPain: "Chest Pain / Heavy Pressure",
    difficultyBreathing: "Difficulty Breathing / Severe Dyspnea",
    lossOfConsciousness: "Loss of Consciousness / Syncope",
    slurredSpeech: "Slurred Speech / Inability to Speak",
    facialAsymmetry: "Facial Asymmetry / Drooping",
    weaknessNumbness: "Sudden Weakness / Numbness of Limbs",
    disoriented: "Disoriented / Altered Mental Status",
    chestRetractions: "Severe Chest Retractions",
    seizureConvulsion: "Seizure / Active Convulsion",
    selfHarmSuicide: "Risk of Self-Harm / Suicidal Ideation",
    agitatedBehavior: "Severe Agitated / Violent Behavior",
    eyeInjuryForeignBody: "Acute Eye Injury / Foreign Body",
    severeInjuries: "Severe Trauma / Physical Injuries",
  };

  // Past Medical History Map
  const MEDICAL_HISTORY_MAP: Record<string, string> = {
    hypertension: "Hypertension",
    heartDiseases: "Heart Diseases",
    diabetes: "Diabetes Mellitus",
    cancer: "Cancer / Malignancy",
    copd: "COPD",
    asthma: "Bronchial Asthma",
    allergies: "Known Drug / Food Allergies",
    mentalNeurologicalSubstance: "Mental / Neurological Condition",
    visionProblems: "Impaired Vision / Eye Disease",
    previousSurgicalHistory: "Previous Surgical History",
    thyroidDisorders: "Thyroid Disorder",
    kidneyDisorders: "Chronic Kidney Disease",
  };

  // Family History Map
  const FAMILY_HISTORY_MAP: Record<string, string> = {
    hypertension: "Hypertension",
    stroke: "Stroke / Cerebrovascular Disease",
    heartDisease: "Heart Disease / Heart Attack",
    diabetesMellitus: "Diabetes Mellitus",
    asthma: "Bronchial Asthma",
    cancer: "Cancer",
    kidneyDisease: "Kidney Disease",
    prematureVascularDisease: "Premature Vascular Disease (<55y male, <65y female)",
    familyTbLast5Years: "Tuberculosis in Family (Past 5 Years)",
    mentalNeurologicalSubstance: "Mental / Neurological / Substance Condition",
    copd: "COPD / Chronic Lung Disease",
  };

  return (
    <div className="space-y-6 print:space-y-4">
      {/* 1. Official Header & Summary Banner */}
      <div className="rounded-xl border border-teal-200 bg-linear-to-r from-teal-50/80 via-emerald-50/50 to-white p-5 shadow-2xs print:border-slate-300 print:bg-none">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-700 px-3 py-1 text-xs font-semibold text-white shadow-xs">
                <HeartPulse className="h-3.5 w-3.5" />
                DOH PHILPEN Risk Assessment Form
              </span>
              <span className="text-xs font-semibold text-teal-900 bg-teal-100/70 border border-teal-200 px-2.5 py-0.5 rounded-full">
                Revised 2022 Standard
              </span>
              <Badge
                variant={hasRedFlags ? "destructive" : patient.healthInfo?.philpenStatus === "High Risk" ? "destructive" : "success"}
                className="text-xs font-semibold px-2.5 py-0.5"
              >
                {hasRedFlags ? "HIGH RISK (Red Flag)" : patient.healthInfo?.philpenStatus || "Completed Assessment"}
              </Badge>
            </div>

            <h2 className="text-lg font-bold text-slate-900 tracking-tight sm:text-xl">
              Philippine Package of Essential NCD Interventions Record
            </h2>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 pt-0.5">
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-teal-700" />
                <strong className="text-slate-800">Facility:</strong>{" "}
                {philpen?.patientInfo?.healthFacilityName || "Barangay Health Center"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-teal-700" />
                <strong className="text-slate-800">Assessment Date:</strong>{" "}
                {philpen?.patientInfo?.assessmentDate || patient.lastVisit || patient.registeredDate || "Recent"}
              </span>
              <span className="flex items-center gap-1">
                <Stethoscope className="h-3.5 w-3.5 text-teal-700" />
                <strong className="text-slate-800">Assessed by:</strong> Healthcare Provider / Nurse
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs text-slate-700 hover:bg-slate-100 border-slate-200"
            >
              <Printer className="h-3.5 w-3.5 mr-1.5" />
              Print Form
            </Button>
            <Link href={`/patients/new?edit=${patient.id}`}>
              <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-xs text-white">
                <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                Update PHILPEN
              </Button>
            </Link>
          </div>
        </div>

        {/* Red Flag Alert Banner */}
        {hasRedFlags && (
          <div className="mt-4 rounded-lg border border-rose-300 bg-rose-50 p-4 text-rose-900">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-rose-800 uppercase tracking-wide">
                  Urgent Clinical Alert: Positive Red Flag Symptoms Detected
                </h4>
                <p className="leading-relaxed text-rose-700">
                  This patient presented with one or more immediate danger signs during assessment. Mandatory protocol:{" "}
                  <strong>Immediate physician triage or referral to higher-level healthcare facility</strong>.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeRedFlags.map(([k]) => (
                    <span
                      key={k}
                      className="inline-flex items-center rounded bg-rose-200/80 px-2 py-0.5 font-bold text-rose-900 border border-rose-300 text-[11px]"
                    >
                      {RED_FLAGS_MAP[k] || k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Key Vitals & Anthropometrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-slate-200 shadow-2xs">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Blood Pressure</span>
              <Activity className="h-3.5 w-3.5 text-teal-700" />
            </div>
            <div className="font-mono text-lg font-bold text-slate-900">{bpDisplay}</div>
            <div className="text-[11px]">
              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold border ${bpStatus.color}`}>
                {bpStatus.label}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-2xs">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Body Mass Index (BMI)</span>
              <Scale className="h-3.5 w-3.5 text-teal-700" />
            </div>
            <div className="font-mono text-lg font-bold text-slate-900">
              {bmiVal ? `${bmiVal} kg/m²` : "Not recorded"}
            </div>
            <div className="text-[11px]">
              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold border ${bmiStatus.color}`}>
                {bmiStatus.label}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-2xs">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Height &amp; Weight</span>
              <Ruler className="h-3.5 w-3.5 text-teal-700" />
            </div>
            <div className="font-mono text-sm font-bold text-slate-900 pt-1">
              {weightKg ? `${weightKg} kg` : "—"} &bull; {heightCm ? `${heightCm} cm` : "—"}
            </div>
            <div className="text-[11px] text-slate-500">
              Waist: <span className="font-mono font-semibold text-slate-800">{waistCm ? `${waistCm} cm` : "—"}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-2xs">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>NCD Risk Category</span>
              <HeartPulse className="h-3.5 w-3.5 text-teal-700" />
            </div>
            <div className="text-base font-bold text-teal-900 pt-0.5">
              {patient.healthInfo?.philpenStatus || "Standard Risk"}
            </div>
            <div className="text-[11px] text-slate-500 truncate">
              {hasRedFlags ? "Referral Required" : "Community Management"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Section 1: Demographics & Social Identifiers */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="py-3 px-5 border-b border-slate-100 bg-slate-50/70">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
              1
            </span>
            Part 1: Demographic &amp; Civil Identifiers
          </CardTitle>
          <CardDescription className="text-[11px]">Official PHILPEN patient demographic baseline</CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">PhilHealth Identification No. (PIN)</span>
              <span className="font-mono font-bold text-slate-900">
                {philpen?.patientInfo?.phicNo || patient.phicNo || "Not Enrolled"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Civil Status</span>
              <span className="font-semibold text-slate-800">
                {philpen?.patientInfo?.civilStatus || patient.civilStatus || "Not Specified"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Religion</span>
              <span className="font-semibold text-slate-800">
                {philpen?.patientInfo?.religion || patient.religion || "None / Not Disclosed"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Employment Status</span>
              <span className="font-semibold text-slate-800">
                {philpen?.patientInfo?.employmentStatus || patient.employmentStatus || "Not Specified"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Indigenous People (IP) Affiliation</span>
              <span className="font-semibold text-slate-800">
                {philpen?.patientInfo?.isIp || patient.isIp || "Non-IP"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Ethnicity</span>
              <span className="font-semibold text-slate-800">
                {philpen?.patientInfo?.ethnicity || patient.ethnicity || "Filipino"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Person with Disability (PWD)</span>
              <span className="font-semibold text-slate-800">
                {philpen?.patientInfo?.pwdIdNo ? `PWD (ID: ${philpen.patientInfo.pwdIdNo})` : patient.pwdId && patient.pwdId !== "N/A" ? `PWD (ID: ${patient.pwdId})` : "Non-PWD"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Catchment Contact</span>
              <span className="font-mono font-semibold text-slate-800">
                {philpen?.patientInfo?.contactNo || patient.contact || "None"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Section 2: Red Flags Assessment */}
      <Card className={`border-slate-200 shadow-2xs ${hasRedFlags ? "border-rose-300" : ""}`}>
        <CardHeader className={`py-3 px-5 border-b border-slate-100 ${hasRedFlags ? "bg-rose-50/50" : "bg-slate-50/70"}`}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
                2
              </span>
              Part 2: Red Flags (Immediate Referral Warning Signs)
            </CardTitle>
            <Badge variant={hasRedFlags ? "destructive" : "outline"} className="text-[10px]">
              {hasRedFlags ? `${activeRedFlags.length} Flag(s) Present` : "All 13 Flags Cleared (Negative)"}
            </Badge>
          </div>
          <CardDescription className="text-[11px]">
            Critical signs requiring emergency physician triage
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
            {Object.entries(RED_FLAGS_MAP).map(([key, label]) => {
              const val = (redFlags as any)[key];
              const isPositive = val === "Yes";
              return (
                <div
                  key={key}
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors ${
                    isPositive
                      ? "border-rose-300 bg-rose-50/90 text-rose-950 font-semibold"
                      : "border-slate-100 bg-slate-50/50 text-slate-700"
                  }`}
                >
                  <span className="text-[11px] leading-tight pr-2">{label}</span>
                  {isPositive ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-rose-600 px-2 py-0.5 rounded-full shrink-0 shadow-2xs">
                      <XCircle className="h-3 w-3" />
                      YES
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      No
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 5. Section 3 & 4: Medical History & Family History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Past Medical History */}
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="py-3 px-5 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
                  3
                </span>
                Part 3: Past Medical History
              </CardTitle>
              <span className="text-[10px] text-slate-500 font-mono">
                {reportedMedicalConditions.length} Reported
              </span>
            </div>
            <CardDescription className="text-[11px]">Diagnosed non-communicable and chronic diseases</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {Object.entries(MEDICAL_HISTORY_MAP).map(([key, label]) => {
                const val = (medicalHistory as any)[key];
                const isPositive = val === "Yes";
                return (
                  <div
                    key={key}
                    className={`flex items-center justify-between p-2 rounded border text-[11px] ${
                      isPositive
                        ? "border-amber-300 bg-amber-50/80 text-amber-950 font-semibold"
                        : "border-slate-100 bg-slate-50/40 text-slate-600"
                    }`}
                  >
                    <span className="truncate pr-1">{label}</span>
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        isPositive ? "bg-amber-200 text-amber-900 font-bold" : "text-slate-400"
                      }`}
                    >
                      {isPositive ? "Yes" : "No"}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Family Medical History */}
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="py-3 px-5 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
                  4
                </span>
                Part 4: Family Medical History
              </CardTitle>
              <span className="text-[10px] text-slate-500 font-mono">
                {reportedFamilyConditions.length} Reported
              </span>
            </div>
            <CardDescription className="text-[11px]">Hereditary and genetic non-communicable predispositions</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {Object.entries(FAMILY_HISTORY_MAP).map(([key, label]) => {
                const val = (familyHistory as any)[key];
                const isPositive = val === "Yes";
                return (
                  <div
                    key={key}
                    className={`flex items-center justify-between p-2 rounded border text-[11px] ${
                      isPositive
                        ? "border-purple-200 bg-purple-50/70 text-purple-950 font-semibold"
                        : "border-slate-100 bg-slate-50/40 text-slate-600"
                    }`}
                  >
                    <span className="truncate pr-1">{label}</span>
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        isPositive ? "bg-purple-200 text-purple-900 font-bold" : "text-slate-400"
                      }`}
                    >
                      {isPositive ? "Yes" : "No"}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 6. Section 5: NCD Lifestyle Risk Factors */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="py-3 px-5 border-b border-slate-100 bg-slate-50/70">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
              5
            </span>
            Part 5: Lifestyle &amp; Behavioral Risk Factors
          </CardTitle>
          <CardDescription className="text-[11px]">
            Modifiable behavioral patterns impacting cardiovascular and metabolic health
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {/* Tobacco */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-[11px]">
                <Flame className="h-4 w-4 text-amber-600" />
                Tobacco Smoking
              </div>
              <p className="font-bold text-slate-900 text-xs">
                {getTobaccoLabel(ncd?.tobaccoUse)}
              </p>
              <p className="text-[10px] text-slate-500">
                {ncd?.tobaccoUse === "Q4" ? "High Risk Daily Smoking" : ncd?.tobaccoUse === "Q3" ? "Moderate Risk Occasional" : "Low Risk / Non-Smoker"}
              </p>
            </div>

            {/* Alcohol */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-[11px]">
                <Wine className="h-4 w-4 text-purple-600" />
                Alcohol Consumption
              </div>
              <p className="font-bold text-slate-900 text-xs">
                {ncd?.alcoholIntake === "Yes" ? "Regular Drinker" : "Never / Non-Drinker"}
              </p>
              <p className="text-[10px] text-slate-500">
                Binge Drinking: <span className="font-semibold text-slate-800">{ncd?.bingeDrinking === "Yes" ? "YES (5+ drinks)" : "No"}</span>
              </p>
            </div>

            {/* Physical Activity */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-[11px]">
                <Footprints className="h-4 w-4 text-emerald-600" />
                Physical Activity
              </div>
              <p className="font-bold text-slate-900 text-xs">
                {ncd?.physicalActivity === "Yes" ? "Physically Active" : "Sedentary / Insufficient"}
              </p>
              <p className="text-[10px] text-slate-500">
                {ncd?.physicalActivity === "Yes" ? "≥150 min/wk moderate activity" : "<150 min/wk activity"}
              </p>
            </div>

            {/* Nutrition */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-[11px]">
                <Salad className="h-4 w-4 text-teal-600" />
                Dietary &amp; Nutrition
              </div>
              <p className="font-bold text-slate-900 text-xs">
                {ncd?.nutritionDietary === "Yes" ? "High Salt / Unhealthy Diet" : "Balanced / Low Salt Diet"}
              </p>
              <p className="text-[10px] text-slate-500">
                {ncd?.nutritionDietary === "Yes" ? "High sodium & processed food" : "Adequate vegetable & low sodium"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 7. Section 6: Diagnostic & Risk Screening Tests */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="py-3 px-5 border-b border-slate-100 bg-slate-50/70">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
              6
            </span>
            Part 6: Risk Screening &amp; Laboratory Diagnostic Tests
          </CardTitle>
          <CardDescription className="text-[11px]">Blood glucose, lipid profile, urinalysis, and respiratory assessment</CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Blood Glucose */}
            <div className="rounded-lg border border-slate-200 p-3.5 space-y-2 bg-white">
              <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                Blood Sugar Screening
              </h5>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">FBS Result:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {screening?.fbsResult ? `${screening.fbsResult} mg/dL` : "Not recorded"}
                  </span>
                </div>
                {screening?.fbsDate && (
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>FBS Date:</span>
                    <span className="font-mono">{screening.fbsDate}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">RBS Result:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {screening?.rbsResult ? `${screening.rbsResult} mg/dL` : "Not recorded"}
                  </span>
                </div>
                <div className="pt-1.5 border-t border-slate-100">
                  <span className="text-slate-400 block text-[10px] mb-1">Diabetes Symptoms:</span>
                  <div className="flex flex-wrap gap-1">
                    {screening?.symptoms?.polyphagia && (
                      <span className="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded text-[10px] font-semibold">Polyphagia</span>
                    )}
                    {screening?.symptoms?.polydipsia && (
                      <span className="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded text-[10px] font-semibold">Polydipsia</span>
                    )}
                    {screening?.symptoms?.polyuria && (
                      <span className="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded text-[10px] font-semibold">Polyuria</span>
                    )}
                    {!screening?.symptoms?.polyphagia && !screening?.symptoms?.polydipsia && !screening?.symptoms?.polyuria && (
                      <span className="text-slate-400 text-[10px]">No symptoms reported</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Lipid Profile */}
            <div className="rounded-lg border border-slate-200 p-3.5 space-y-2 bg-white">
              <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                Lipid Profile Panel
              </h5>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Cholesterol:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {screening?.lipidProfile?.totalCholesterol ? `${screening.lipidProfile.totalCholesterol} mg/dL` : "Not recorded"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">HDL (Good):</span>
                  <span className="font-mono text-slate-800">
                    {screening?.lipidProfile?.hdl ? `${screening.lipidProfile.hdl} mg/dL` : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">LDL (Bad):</span>
                  <span className="font-mono text-slate-800">
                    {screening?.lipidProfile?.ldl ? `${screening.lipidProfile.ldl} mg/dL` : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Triglycerides:</span>
                  <span className="font-mono text-slate-800">
                    {screening?.lipidProfile?.triglyceride ? `${screening.lipidProfile.triglyceride} mg/dL` : "—"}
                  </span>
                </div>
                {screening?.lipidProfile?.dateTaken && (
                  <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                    <span>Date Taken:</span>
                    <span className="font-mono">{screening.lipidProfile.dateTaken}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Urinalysis & Respiratory */}
            <div className="rounded-lg border border-slate-200 p-3.5 space-y-2 bg-white">
              <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-sky-500"></span>
                Urinalysis &amp; Respiratory
              </h5>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Urine Protein:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {screening?.urinalysis?.proteinResult || "Not tested"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Urine Ketones:</span>
                  <span className="font-mono text-slate-800">
                    {screening?.urinalysis?.ketones || "Negative / None"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Peak Flow (PEFR):</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {screening?.respiratory?.pefrResult ? `${screening.respiratory.pefrResult} L/min` : "Not measured"}
                  </span>
                </div>
                <div className="pt-1.5 border-t border-slate-100">
                  <span className="text-slate-400 block text-[10px] mb-1">Respiratory Symptoms:</span>
                  <div className="flex flex-wrap gap-1">
                    {screening?.respiratory?.breathlessness && <span className="bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded text-[10px]">Dyspnea</span>}
                    {screening?.respiratory?.chronicCough && <span className="bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded text-[10px]">Cough</span>}
                    {screening?.respiratory?.wheezing && <span className="bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded text-[10px]">Wheeze</span>}
                    {!screening?.respiratory?.breathlessness && !screening?.respiratory?.chronicCough && !screening?.respiratory?.wheezing && (
                      <span className="text-slate-400 text-[10px]">No symptoms reported</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 8. Section 7: Management & Care Plan */}
      <Card className="border-teal-200 bg-linear-to-b from-teal-50/40 to-white shadow-2xs">
        <CardHeader className="py-3 px-5 border-b border-teal-100 bg-teal-50/70">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
              7
            </span>
            Part 7: Clinical Management &amp; Follow-up Care Plan
          </CardTitle>
          <CardDescription className="text-[11px]">Primary care action plan, medication regimen, and next visit</CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 block text-[11px]">Lifestyle Counseling</span>
              <Badge variant={management?.lifestyleModification === "Yes" ? "success" : "outline"} className="text-xs">
                {management?.lifestyleModification === "Yes" ? "Prescribed & Advised" : "Standard Advice"}
              </Badge>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 block text-[11px]">Anti-Hypertensive Medication</span>
              <Badge variant={management?.antiHypertensives === "Yes" ? "warning" : "outline"} className="text-xs">
                {management?.antiHypertensives === "Yes" ? "Initiated / Maintained" : "Not Indicated"}
              </Badge>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 block text-[11px]">Oral Hypoglycemic Agents</span>
              <Badge variant={management?.oralHypoglycemic === "Yes" ? "warning" : "outline"} className="text-xs">
                {management?.oralHypoglycemic === "Yes" ? "Initiated / Maintained" : "Not Indicated"}
              </Badge>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 block text-[11px]">Scheduled Follow-up Date</span>
              <div className="flex items-center gap-1 font-mono font-bold text-teal-800 text-sm">
                <Clock className="h-3.5 w-3.5 text-teal-600" />
                {management?.followUpDate || "Routine Schedule (3-6 Months)"}
              </div>
            </div>
          </div>

          {/* Clinical Remarks */}
          <div className="mt-4 pt-4 border-t border-teal-100 text-xs">
            <span className="text-slate-500 block text-[11px] font-semibold mb-1">
              Clinical Assessment Remarks &amp; Recommendations:
            </span>
            <div className="rounded-lg bg-white border border-teal-200/80 p-3 text-slate-800 leading-relaxed text-xs">
              {management?.remarks ? (
                management.remarks
              ) : (
                <span className="italic text-slate-500">
                  Patient registered under PHILPEN NCD monitoring. Routine follow-up scheduled. Regular blood pressure check and lifestyle modifications advised.
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
