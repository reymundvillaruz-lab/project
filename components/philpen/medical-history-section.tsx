"use client";

import * as React from "react";
import { Activity } from "lucide-react";
import { YesNoRadio } from "./yes-no-radio";
import { PhilpenMedicalHistory } from "@/lib/mock-data/philpen";

interface MedicalHistorySectionProps {
  data: PhilpenMedicalHistory;
  onChange: (field: keyof PhilpenMedicalHistory, value: "Yes" | "No") => void;
}

const MEDICAL_HISTORY_ITEMS: Array<{
  id: keyof PhilpenMedicalHistory;
  label: string;
  description: string;
}> = [
  {
    id: "hypertension",
    label: "Hypertension",
    description: "Previously diagnosed elevated blood pressure or taking anti-hypertensive medication",
  },
  {
    id: "heartDiseases",
    label: "Heart Diseases",
    description: "Coronary artery disease, heart failure, myocardial infarction, or arrhythmias",
  },
  {
    id: "diabetes",
    label: "Diabetes",
    description: "Type 1 or Type 2 Diabetes Mellitus or currently on glucose-lowering therapy",
  },
  {
    id: "cancer",
    label: "Cancer",
    description: "History of malignancy, active tumor treatment, or cancer remission",
  },
  {
    id: "copd",
    label: "COPD (Chronic Obstructive Pulmonary Disease)",
    description: "Chronic bronchitis, emphysema, or persistent airflow limitation",
  },
  {
    id: "asthma",
    label: "Asthma",
    description: "Recurrent bronchial spasms, wheezing episodes, or inhaler usage",
  },
  {
    id: "allergies",
    label: "Allergies",
    description: "Adverse drug reactions, severe food allergies, or anaphylaxis",
  },
  {
    id: "mentalNeurologicalSubstance",
    label: "Mental, Neurological, and Substance-Abuse Disorders",
    description: "Depression, anxiety, epilepsy, stroke history, or substance use disorder",
  },
  {
    id: "visionProblems",
    label: "Vision Problems",
    description: "Cataracts, glaucoma, diabetic retinopathy, or severe refractive errors",
  },
  {
    id: "previousSurgicalHistory",
    label: "Previous Surgical History",
    description: "Major operative procedures, hospitalizations, or organ resections",
  },
  {
    id: "thyroidDisorders",
    label: "Thyroid Disorders",
    description: "Hyperthyroidism, hypothyroidism, goiter, or thyroid replacement therapy",
  },
  {
    id: "kidneyDisorders",
    label: "Kidney Disorders",
    description: "Chronic kidney disease (CKD), nephrolithiasis, or proteinuria history",
  },
];

export function MedicalHistorySection({
  data,
  onChange,
}: MedicalHistorySectionProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-2.5">
          <Activity className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs">
            <p className="font-semibold text-slate-800">
              PHILPEN Past Medical History (Revised 2022)
            </p>
            <p className="text-slate-500 leading-relaxed">
              Identify existing chronic conditions, prior non-communicable disease diagnoses, and previous clinical history.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {MEDICAL_HISTORY_ITEMS.map((item) => (
          <YesNoRadio
            key={item.id}
            name={item.id}
            value={data[item.id]}
            onChange={(val) => onChange(item.id, val)}
            label={item.label}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
}
