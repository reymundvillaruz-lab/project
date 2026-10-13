"use client";

import * as React from "react";
import { Users } from "lucide-react";
import { YesNoRadio } from "./yes-no-radio";
import { PhilpenFamilyHistory } from "@/lib/mock-data/philpen";

interface FamilyHistorySectionProps {
  data: PhilpenFamilyHistory;
  onChange: (field: keyof PhilpenFamilyHistory, value: "Yes" | "No") => void;
}

const FAMILY_HISTORY_ITEMS: Array<{
  id: keyof PhilpenFamilyHistory;
  label: string;
  description?: string;
}> = [
  {
    id: "hypertension",
    label: "Hypertension",
    description: "Parents, siblings, or grandparents with diagnosed elevated blood pressure",
  },
  {
    id: "stroke",
    label: "Stroke",
    description: "Cerebrovascular accident, hemorrhagic or ischemic stroke in family",
  },
  {
    id: "heartDisease",
    label: "Heart Disease",
    description: "Coronary heart disease, myocardial infarction, or bypass surgery",
  },
  {
    id: "diabetesMellitus",
    label: "Diabetes Mellitus",
    description: "Type 1 or Type 2 Diabetes among immediate family members",
  },
  {
    id: "asthma",
    label: "Asthma",
    description: "Chronic bronchial asthma or atopic diseases in family",
  },
  {
    id: "cancer",
    label: "Cancer",
    description: "Malignancies in first-degree relatives (breast, lung, colon, cervix, etc.)",
  },
  {
    id: "kidneyDisease",
    label: "Kidney Disease",
    description: "Chronic kidney disease, dialysis, or polycystic kidney disease",
  },
  {
    id: "prematureVascularDisease",
    label: "1st degree relative with premature coronary disease or vascular disease",
    description: "Men <55 years old or women <65 years old with vascular events",
  },
  {
    id: "familyTbLast5Years",
    label: "Family members having TB in the last 5 years",
    description: "Pulmonary or extra-pulmonary tuberculosis treatment in household",
  },
  {
    id: "mentalNeurologicalSubstance",
    label: "Mental, Neurological and Substance Abuse Disorder",
    description: "Psychiatric illness, epilepsy, dementia, or severe substance dependency",
  },
  {
    id: "copd",
    label: "COPD (Chronic Obstructive Pulmonary Disease)",
    description: "Chronic emphysema or bronchitis in family members",
  },
];

export function FamilyHistorySection({
  data,
  onChange,
}: FamilyHistorySectionProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-2.5">
          <Users className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs">
            <p className="font-semibold text-slate-800">
              PHILPEN Family Medical History (Revised 2022)
            </p>
            <p className="text-slate-500 leading-relaxed">
              Screen for genetic predispositions and familial non-communicable disease risks in first- and second-degree relatives.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {FAMILY_HISTORY_ITEMS.map((item) => (
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
