"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { PhilpenProgress, PHILPEN_STEPS } from "./philpen-progress";
import { PatientInformationSection } from "./patient-information-section";
import { RedFlagsSection } from "./red-flags-section";
import { MedicalHistorySection } from "./medical-history-section";
import { FamilyHistorySection } from "./family-history-section";
import { NcdRiskFactorsSection } from "./ncd-risk-factors-section";
import { RiskScreeningSection } from "./risk-screening-section";
import { ManagementSection } from "./management-section";
import {
  PhilpenFormData,
  INITIAL_PHILPEN_FORM_DATA,
} from "@/lib/mock-data/philpen";
import {
  MockPatient,
  getPatientById,
  addStoredPatient,
  getStoredPatients,
  saveStoredPatients,
} from "@/lib/mock-data/patients";

export function PhilpenForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [formData, setFormData] = React.useState<PhilpenFormData>(INITIAL_PHILPEN_FORM_DATA);
  const [ageValidationError, setAgeValidationError] = React.useState<string | null>(null);
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [savedPatientId, setSavedPatientId] = React.useState<string>("");

  // Pre-fill form if editing an existing patient
  React.useEffect(() => {
    if (editId) {
      const existing = getPatientById(editId);
      if (existing) {
        setFormData((prev) => ({
          ...prev,
          patientInfo: {
            ...prev.patientInfo,
            surname: existing.lastName,
            givenName: existing.firstName,
            middleName: existing.middleName,
            age: existing.age,
            sex: existing.sex,
            birthdate: existing.birthdate,
            phicNo: existing.phicNo,
            civilStatus: (existing.civilStatus as any) || "",
            religion: existing.religion,
            contactNo: existing.contact,
            address: existing.address,
            pwdIdNo: existing.pwdId === "N/A" ? "" : existing.pwdId,
            employmentStatus: (existing.employmentStatus as any) || "",
            isIp: (existing.isIp as any) || "Non-IP",
            ethnicity: existing.ethnicity,
          },
        }));
      }
    }
  }, [editId]);

  // Real-time Age Validation check
  React.useEffect(() => {
    const age = formData.patientInfo.age;
    if (age !== "" && typeof age === "number") {
      if (age < 20) {
        setAgeValidationError("PHILPEN Risk Assessment is intended for adults 20 years old and above.");
      } else {
        setAgeValidationError(null);
      }
    } else {
      setAgeValidationError(null);
    }
  }, [formData.patientInfo.age]);

  // Section update handlers
  const handlePatientInfoChange = (field: keyof PhilpenFormData["patientInfo"], value: any) => {
    setFormData((prev) => ({
      ...prev,
      patientInfo: { ...prev.patientInfo, [field]: value },
    }));
    setValidationError(null);
  };

  const handleRedFlagsChange = (field: keyof PhilpenFormData["redFlags"], value: "Yes" | "No") => {
    setFormData((prev) => ({
      ...prev,
      redFlags: { ...prev.redFlags, [field]: value },
    }));
  };

  const handleMedicalHistoryChange = (field: keyof PhilpenFormData["medicalHistory"], value: "Yes" | "No") => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: { ...prev.medicalHistory, [field]: value },
    }));
  };

  const handleFamilyHistoryChange = (field: keyof PhilpenFormData["familyHistory"], value: "Yes" | "No") => {
    setFormData((prev) => ({
      ...prev,
      familyHistory: { ...prev.familyHistory, [field]: value },
    }));
  };

  const handleNcdRiskFactorsChange = (field: keyof PhilpenFormData["ncdRiskFactors"], value: any) => {
    setFormData((prev) => ({
      ...prev,
      ncdRiskFactors: { ...prev.ncdRiskFactors, [field]: value },
    }));
  };

  const handleRiskScreeningChange = (field: keyof PhilpenFormData["riskScreening"], value: any) => {
    setFormData((prev) => ({
      ...prev,
      riskScreening: { ...prev.riskScreening, [field]: value },
    }));
  };

  const handleManagementChange = (field: keyof PhilpenFormData["management"], value: any) => {
    setFormData((prev) => ({
      ...prev,
      management: { ...prev.management, [field]: value },
    }));
  };

  // Step validation
  const validateCurrentStep = (): boolean => {
    setValidationError(null);

    if (currentStep === 1) {
      const { surname, givenName, birthdate, age, sex, contactNo, address } = formData.patientInfo;
      if (!surname.trim() || !givenName.trim()) {
        setValidationError("Please enter the patient's surname and given name.");
        return false;
      }
      if (!birthdate) {
        setValidationError("Please select the patient's birthdate.");
        return false;
      }
      if (typeof age === "number" && age < 20) {
        setValidationError("PHILPEN Risk Assessment is intended for adults 20 years old and above.");
        return false;
      }
      if (!sex) {
        setValidationError("Please select the patient's sex.");
        return false;
      }
      if (!contactNo.trim()) {
        setValidationError("Please enter a valid contact number.");
        return false;
      }
      if (!address.trim()) {
        setValidationError("Please enter the patient's address.");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < 7) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId < currentStep) {
      setCurrentStep(stepId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (stepId > currentStep) {
      if (validateCurrentStep()) {
        setCurrentStep(stepId);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // Mock Save Assessment handler
  const handleSaveAssessment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    // Check age eligibility requirement
    const age = formData.patientInfo.age;
    if (typeof age === "number" && age < 20) {
      setValidationError("PHILPEN Risk Assessment is intended for adults 20 years old and above. Assessment cannot be submitted.");
      return;
    }

    // Generate new mock Patient ID or reuse existing
    const currentPatients = getStoredPatients();
    let patientId = editId;

    if (!patientId) {
      const nextNum = currentPatients.length + 1;
      patientId = `BHC-${String(nextNum).padStart(6, "0")}`;
    }

    const fullName = `${formData.patientInfo.givenName} ${
      formData.patientInfo.middleName ? formData.patientInfo.middleName + " " : ""
    }${formData.patientInfo.surname}`;

    // Has any red flag?
    const hasRedFlag = Object.values(formData.redFlags).some((v) => v === "Yes");

    const newPatientRecord: MockPatient = {
      id: patientId,
      firstName: formData.patientInfo.givenName,
      lastName: formData.patientInfo.surname,
      middleName: formData.patientInfo.middleName,
      fullName: fullName,
      sex: (formData.patientInfo.sex as "Male" | "Female") || "Female",
      age: typeof formData.patientInfo.age === "number" ? formData.patientInfo.age : 20,
      birthdate: formData.patientInfo.birthdate,
      barangay: "Barangay Central",
      address: formData.patientInfo.address,
      contact: formData.patientInfo.contactNo,
      lastVisit: formData.patientInfo.assessmentDate,
      status: hasRedFlag ? "Follow-up Needed" : "Active",
      phicNo: formData.patientInfo.phicNo,
      civilStatus: formData.patientInfo.civilStatus || "Single",
      religion: formData.patientInfo.religion || "None",
      pwdId: formData.patientInfo.pwdIdNo || "N/A",
      employmentStatus: formData.patientInfo.employmentStatus || "Employed",
      isIp: formData.patientInfo.isIp || "Non-IP",
      ethnicity: formData.patientInfo.ethnicity || "Tagalog",
      emergencyContact: {
        name: "Immediate Family",
        relationship: "Family Member",
        contact: formData.patientInfo.contactNo,
      },
      healthInfo: {
        bloodType: "O+",
        allergies: formData.medicalHistory.allergies === "Yes" ? ["Reported Allergies"] : ["None known"],
        chronicConditions: [
          ...(formData.medicalHistory.hypertension === "Yes" ? ["Hypertension"] : []),
          ...(formData.medicalHistory.diabetes === "Yes" ? ["Diabetes Mellitus"] : []),
          ...(formData.medicalHistory.asthma === "Yes" ? ["Asthma"] : []),
        ],
        philpenStatus: hasRedFlag ? "High Risk" : "Completed",
        lastBp: formData.ncdRiskFactors.bloodPressureSystolic
          ? `${formData.ncdRiskFactors.bloodPressureSystolic}/${formData.ncdRiskFactors.bloodPressureDiastolic} mmHg`
          : "120/80 mmHg",
        lastBmi: formData.ncdRiskFactors.bmi ? `${formData.ncdRiskFactors.bmi} kg/m²` : "22.5 kg/m²",
      },
      consultations: [
        {
          id: `CON-${Date.now().toString().slice(-3)}`,
          date: formData.patientInfo.assessmentDate,
          purpose: "PHILPEN Risk Assessment (Revised 2022)",
          physician: "Barangay Health Center Staff",
          diagnosis: hasRedFlag ? "High Risk - Immediate Physician Referral" : "Completed Primary Care Screening",
        },
      ],
      immunizations: [],
      appointments: formData.management.followUpDate
        ? [
            {
              id: `APT-${Date.now().toString().slice(-3)}`,
              date: formData.management.followUpDate,
              time: "08:30 AM",
              purpose: "PHILPEN Care Plan Follow-up",
              status: "Scheduled",
            },
          ]
        : [],
      prescriptions: [],
      philpenRecord: formData,
    };

    if (editId) {
      const updated = currentPatients.map((p) => (p.id === editId ? newPatientRecord : p));
      saveStoredPatients(updated);
    } else {
      addStoredPatient(newPatientRecord);
    }

    setSavedPatientId(patientId);
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.push("/patients");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Header Titles & Form Description */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              PHILPEN Risk Assessment
            </h1>
            <span className="rounded bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-800 border border-teal-200">
              Annex C
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            PHILPEN Risk Assessment Form (Revised 2022) &bull; Adults 20 years old and above
          </p>
        </div>

        <Link href="/patients">
          <Button variant="outline" size="sm" className="text-xs">
            <X className="h-3.5 w-3.5 mr-1" />
            Cancel
          </Button>
        </Link>
      </div>

      {/* 2. Step Progress Indicator */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs">
        <PhilpenProgress currentStep={currentStep} onStepClick={handleStepClick} />
      </div>

      {/* 3. Validation Error Callout */}
      {validationError && (
        <div
          role="alert"
          className="rounded-lg border border-rose-300 bg-rose-50 p-3.5 text-xs text-rose-900 flex items-center gap-2.5 animate-in fade-in-50"
        >
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <span className="font-semibold">{validationError}</span>
        </div>
      )}

      {/* 4. Active Section Form Card */}
      <Card className="shadow-xs">
        <CardHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">
                Step {currentStep} of 7
              </span>
              <CardTitle className="text-base font-bold text-slate-900">
                {PHILPEN_STEPS[currentStep - 1].title}
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <form onSubmit={handleSaveAssessment}>
            {/* Step 1: Patient's Information */}
            {currentStep === 1 && (
              <PatientInformationSection
                data={formData.patientInfo}
                onChange={handlePatientInfoChange}
                ageValidationError={ageValidationError}
              />
            )}

            {/* Step 2: Assess for Red Flags */}
            {currentStep === 2 && (
              <RedFlagsSection
                data={formData.redFlags}
                onChange={handleRedFlagsChange}
              />
            )}

            {/* Step 3: Past Medical History */}
            {currentStep === 3 && (
              <MedicalHistorySection
                data={formData.medicalHistory}
                onChange={handleMedicalHistoryChange}
              />
            )}

            {/* Step 4: Family History */}
            {currentStep === 4 && (
              <FamilyHistorySection
                data={formData.familyHistory}
                onChange={handleFamilyHistoryChange}
              />
            )}

            {/* Step 5: NCD Risk Factors */}
            {currentStep === 5 && (
              <NcdRiskFactorsSection
                data={formData.ncdRiskFactors}
                onChange={handleNcdRiskFactorsChange}
              />
            )}

            {/* Step 6: Risk Screening */}
            {currentStep === 6 && (
              <RiskScreeningSection
                data={formData.riskScreening}
                onChange={handleRiskScreeningChange}
              />
            )}

            {/* Step 7: Management */}
            {currentStep === 7 && (
              <ManagementSection
                data={formData.management}
                onChange={handleManagementChange}
              />
            )}
          </form>
        </CardContent>

        {/* 5. Navigation Footer Controls */}
        <CardFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 p-4 rounded-b-lg">
          <div>
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="text-xs"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                Back
              </Button>
            ) : (
              <Link href="/patients">
                <Button variant="ghost" size="sm" className="text-xs text-slate-500">
                  Cancel
                </Button>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStep < 7 ? (
              <Button
                type="button"
                size="sm"
                onClick={handleNext}
                className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs"
              >
                Next
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={handleSaveAssessment}
                disabled={Boolean(ageValidationError)}
                className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs"
              >
                <Save className="h-3.5 w-3.5 mr-1.5" />
                Save Assessment
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* 6. Mock Success Modal Dialog */}
      {showSuccessModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in-50"
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                <CheckCircle2 className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 id="success-modal-title" className="text-base font-bold text-slate-900">
                  PHILPEN Risk Assessment saved successfully.
                </h3>
                <p className="text-xs text-slate-500">
                  Patient record {savedPatientId} has been successfully recorded in the local registry.
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3.5 text-xs space-y-1.5 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Patient ID:</span>
                <span className="font-mono font-bold text-teal-800">{savedPatientId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Patient Name:</span>
                <span className="font-semibold text-slate-800">
                  {formData.patientInfo.givenName} {formData.patientInfo.surname}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assessment Version:</span>
                <span className="font-medium text-slate-700">PHILPEN Revised 2022 (Annex C)</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                onClick={handleSuccessClose}
                className="bg-teal-700 hover:bg-teal-800 text-xs w-full sm:w-auto"
              >
                Return to Patient Registry
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
