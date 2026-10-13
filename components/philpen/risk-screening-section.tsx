"use client";

import * as React from "react";
import { Droplet, HeartPulse, Wind, FlaskConical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { PhilpenRiskScreening } from "@/lib/mock-data/philpen";

interface RiskScreeningSectionProps {
  data: PhilpenRiskScreening;
  onChange: (field: keyof PhilpenRiskScreening, value: any) => void;
}

export function RiskScreeningSection({
  data,
  onChange,
}: RiskScreeningSectionProps) {
  const handleSymptomChange = (symptomKey: "polyphagia" | "polydipsia" | "polyuria", checked: boolean) => {
    onChange("symptoms", {
      ...data.symptoms,
      [symptomKey]: checked,
    });
  };

  const handleLipidChange = (field: string, value: string) => {
    onChange("lipidProfile", {
      ...data.lipidProfile,
      [field]: value,
    });
  };

  const handleUrinalysisChange = (field: string, value: string) => {
    onChange("urinalysis", {
      ...data.urinalysis,
      [field]: value,
    });
  };

  const handleRespiratoryChange = (field: string, value: any) => {
    onChange("respiratory", {
      ...data.respiratory,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. BLOOD GLUCOSE & DIABETES CLINICAL SYMPTOMS */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Droplet className="h-4 w-4 text-teal-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Blood Glucose Assessment (FBS / RBS)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="fbsResult" className="block text-xs font-semibold text-slate-700 mb-1">
              FBS Result (mg/dL)
            </label>
            <Input
              id="fbsResult"
              type="number"
              value={data.fbsResult}
              onChange={(e) => onChange("fbsResult", e.target.value)}
              placeholder="e.g. 98"
              className="text-xs font-mono"
            />
          </div>

          <div>
            <label htmlFor="fbsDate" className="block text-xs font-semibold text-slate-700 mb-1">
              FBS Date Taken
            </label>
            <Input
              id="fbsDate"
              type="date"
              value={data.fbsDate}
              onChange={(e) => onChange("fbsDate", e.target.value)}
              className="text-xs"
            />
          </div>

          <div>
            <label htmlFor="rbsResult" className="block text-xs font-semibold text-slate-700 mb-1">
              RBS Result (mg/dL)
            </label>
            <Input
              id="rbsResult"
              type="number"
              value={data.rbsResult}
              onChange={(e) => onChange("rbsResult", e.target.value)}
              placeholder="e.g. 135"
              className="text-xs font-mono"
            />
          </div>
        </div>

        {/* Diabetes Symptoms Checkboxes */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <span className="block text-xs font-semibold text-slate-700">
            Diabetes Clinical Symptoms (Check if present):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <Checkbox
                id="polyphagia"
                checked={data.symptoms.polyphagia}
                onCheckedChange={(checked) => handleSymptomChange("polyphagia", checked)}
              />
              <span>Polyphagia (Excessive hunger)</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <Checkbox
                id="polydipsia"
                checked={data.symptoms.polydipsia}
                onCheckedChange={(checked) => handleSymptomChange("polydipsia", checked)}
              />
              <span>Polydipsia (Excessive thirst)</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <Checkbox
                id="polyuria"
                checked={data.symptoms.polyuria}
                onCheckedChange={(checked) => handleSymptomChange("polyuria", checked)}
              />
              <span>Polyuria (Frequent urination)</span>
            </label>
          </div>
        </div>
      </div>

      {/* 2. LIPID PROFILE */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-4 w-4 text-teal-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Lipid Profile (mg/dL)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="totalCholesterol" className="block text-xs font-semibold text-slate-700 mb-1">
              Total Cholesterol
            </label>
            <Input
              id="totalCholesterol"
              type="number"
              value={data.lipidProfile.totalCholesterol}
              onChange={(e) => handleLipidChange("totalCholesterol", e.target.value)}
              placeholder="e.g. 190"
              className="text-xs font-mono"
            />
          </div>

          <div>
            <label htmlFor="lipidDate" className="block text-xs font-semibold text-slate-700 mb-1">
              Date Taken
            </label>
            <Input
              id="lipidDate"
              type="date"
              value={data.lipidProfile.dateTaken}
              onChange={(e) => handleLipidChange("dateTaken", e.target.value)}
              className="text-xs"
            />
          </div>

          <div>
            <label htmlFor="hdl" className="block text-xs font-semibold text-slate-700 mb-1">
              HDL (High-Density Lipoprotein)
            </label>
            <Input
              id="hdl"
              type="number"
              value={data.lipidProfile.hdl}
              onChange={(e) => handleLipidChange("hdl", e.target.value)}
              placeholder="e.g. 50"
              className="text-xs font-mono"
            />
          </div>

          <div>
            <label htmlFor="ldl" className="block text-xs font-semibold text-slate-700 mb-1">
              LDL (Low-Density Lipoprotein)
            </label>
            <Input
              id="ldl"
              type="number"
              value={data.lipidProfile.ldl}
              onChange={(e) => handleLipidChange("ldl", e.target.value)}
              placeholder="e.g. 110"
              className="text-xs font-mono"
            />
          </div>

          <div>
            <label htmlFor="vldl" className="block text-xs font-semibold text-slate-700 mb-1">
              VLDL (Very Low-Density Lipoprotein)
            </label>
            <Input
              id="vldl"
              type="number"
              value={data.lipidProfile.vldl}
              onChange={(e) => handleLipidChange("vldl", e.target.value)}
              placeholder="e.g. 24"
              className="text-xs font-mono"
            />
          </div>

          <div>
            <label htmlFor="triglyceride" className="block text-xs font-semibold text-slate-700 mb-1">
              Triglyceride
            </label>
            <Input
              id="triglyceride"
              type="number"
              value={data.lipidProfile.triglyceride}
              onChange={(e) => handleLipidChange("triglyceride", e.target.value)}
              placeholder="e.g. 145"
              className="text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* 3. URINALYSIS / URINE PROTEIN */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-teal-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Urinalysis / Urine Protein
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="proteinResult" className="block text-xs font-semibold text-slate-700 mb-1">
              Urinalysis / Urine Protein
            </label>
            <Input
              id="proteinResult"
              value={data.urinalysis.proteinResult}
              onChange={(e) => handleUrinalysisChange("proteinResult", e.target.value)}
              placeholder="e.g. Negative, Trace, +1, +2"
              className="text-xs"
            />
          </div>

          <div>
            <label htmlFor="proteinDate" className="block text-xs font-semibold text-slate-700 mb-1">
              Date Taken
            </label>
            <Input
              id="proteinDate"
              type="date"
              value={data.urinalysis.dateTaken}
              onChange={(e) => handleUrinalysisChange("dateTaken", e.target.value)}
              className="text-xs"
            />
          </div>

          <div>
            <label htmlFor="dipstickTest" className="block text-xs font-semibold text-slate-700 mb-1">
              Dipstick Test Result
            </label>
            <Input
              id="dipstickTest"
              value={data.urinalysis.dipstickTest}
              onChange={(e) => handleUrinalysisChange("dipstickTest", e.target.value)}
              placeholder="e.g. Normal, Positive"
              className="text-xs"
            />
          </div>

          <div>
            <label htmlFor="ketones" className="block text-xs font-semibold text-slate-700 mb-1">
              Ketones
            </label>
            <Input
              id="ketones"
              value={data.urinalysis.ketones}
              onChange={(e) => handleUrinalysisChange("ketones", e.target.value)}
              placeholder="e.g. Negative, Positive"
              className="text-xs"
            />
          </div>

          <div>
            <label htmlFor="ketonesDate" className="block text-xs font-semibold text-slate-700 mb-1">
              Ketones Date Taken
            </label>
            <Input
              id="ketonesDate"
              type="date"
              value={data.urinalysis.ketonesDate}
              onChange={(e) => handleUrinalysisChange("ketonesDate", e.target.value)}
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* 4. CHRONIC RESPIRATORY DISEASES (ASTHMA AND COPD) */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Wind className="h-4 w-4 text-teal-700" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Chronic Respiratory Diseases
            </h3>
            <p className="text-[11px] text-slate-400 font-normal">
              (Asthma and COPD)
            </p>
          </div>
        </div>

        {/* Symptoms Checkboxes */}
        <div className="space-y-2">
          <span className="block text-xs font-semibold text-slate-700">
            Respiratory Symptoms (Check all that apply):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { id: "breathlessness", label: "Breathlessness" },
              { id: "chronicCough", label: "Chronic cough" },
              { id: "sputumProduction", label: "Sputum (mucous) production" },
              { id: "chestTightness", label: "Chest tightness" },
              { id: "wheezing", label: "Wheezing" },
            ].map((symptom) => (
              <label
                key={symptom.id}
                className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer"
              >
                <Checkbox
                  id={symptom.id}
                  checked={(data.respiratory as any)[symptom.id]}
                  onCheckedChange={(checked) => handleRespiratoryChange(symptom.id, checked)}
                />
                <span>{symptom.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* PEFR Result & Comparison */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pefrResult" className="block text-xs font-semibold text-slate-700 mb-1">
              PEFR Result (L/min)
            </label>
            <Input
              id="pefrResult"
              type="number"
              value={data.respiratory.pefrResult}
              onChange={(e) => handleRespiratoryChange("pefrResult", e.target.value)}
              placeholder="Peak Expiratory Flow Rate"
              className="text-xs font-mono"
            />
          </div>

          <div>
            <label htmlFor="pefrComparison" className="block text-xs font-semibold text-slate-700 mb-1">
              PEFR Comparison (PHILPEN Baseline)
            </label>
            <Select
              id="pefrComparison"
              value={data.respiratory.pefrComparison}
              onChange={(e) => handleRespiratoryChange("pefrComparison", e.target.value)}
            >
              <option value="">Select Comparison</option>
              <option value=">=20% change">&ge;20% change from baseline</option>
              <option value="<20% change">&lt;20% change from baseline</option>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
