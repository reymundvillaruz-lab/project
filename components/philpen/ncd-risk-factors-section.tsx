"use client";

import * as React from "react";
import { Cigarette, Wine, Dumbbell, Utensils, Scale, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { YesNoRadio } from "./yes-no-radio";
import { PhilpenNcdRiskFactors } from "@/lib/mock-data/philpen";

interface NcdRiskFactorsSectionProps {
  data: PhilpenNcdRiskFactors;
  onChange: (field: keyof PhilpenNcdRiskFactors, value: any) => void;
}

export function NcdRiskFactorsSection({
  data,
  onChange,
}: NcdRiskFactorsSectionProps) {
  // Auto-calculate BMI whenever weight (kg) or height (cm) changes
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange("weightKg", val);
    calculateBmi(val, data.heightCm);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange("heightCm", val);
    calculateBmi(data.weightKg, val);
  };

  const calculateBmi = (weightStr: string, heightStr: string) => {
    const w = parseFloat(weightStr);
    const h = parseFloat(heightStr);
    if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
      const heightInMeters = h / 100;
      const calculatedBmi = (w / (heightInMeters * heightInMeters)).toFixed(1);
      onChange("bmi", calculatedBmi);
    } else {
      onChange("bmi", "");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TOBACCO USE */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Cigarette className="h-4 w-4 text-slate-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Tobacco Use
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Select the patient&apos;s current tobacco exposure status (PHILPEN Q1–Q4):
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {[
            { id: "Q1", label: "Q1. Never Used", desc: "Never smoked or consumed any tobacco product" },
            { id: "Q2", label: "Q2. Exposure to secondhand smoke", desc: "Regularly exposed to environmental tobacco smoke" },
            { id: "Q3", label: "Q3. Former tobacco user", desc: "Previously used tobacco but has quit" },
            { id: "Q4", label: "Q4. Current tobacco user", desc: "Currently smokes cigarettes, cigars, or uses tobacco products" },
          ].map((item) => (
            <label
              key={item.id}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                data.tobaccoUse === item.id
                  ? "border-teal-700 bg-teal-50/60 ring-1 ring-teal-700 text-teal-950"
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
              }`}
            >
              <input
                type="radio"
                name="tobaccoUse"
                value={item.id}
                checked={data.tobaccoUse === item.id}
                onChange={() => onChange("tobaccoUse", item.id)}
                className="mt-0.5 text-teal-700 focus:ring-teal-700"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold block">{item.label}</span>
                <span className="text-[11px] text-slate-500 block">{item.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* 2. ALCOHOL INTAKE */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Wine className="h-4 w-4 text-slate-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Alcohol Intake
          </h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              General Alcohol Consumption:
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="alcoholIntake"
                  value="Never"
                  checked={data.alcoholIntake === "Never"}
                  onChange={() => onChange("alcoholIntake", "Never")}
                  className="text-teal-700 focus:ring-teal-700"
                />
                Never Consumed
              </label>

              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="alcoholIntake"
                  value="Yes"
                  checked={data.alcoholIntake === "Yes"}
                  onChange={() => onChange("alcoholIntake", "Yes")}
                  className="text-teal-700 focus:ring-teal-700"
                />
                Yes, drinks alcohol
              </label>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <YesNoRadio
              name="bingeDrinking"
              value={data.bingeDrinking}
              onChange={(val) => onChange("bingeDrinking", val)}
              label="Binge Drinking Assessment"
              description="Do you drink 5 or more standard drinks for men, and 4 or more for women, in one sitting/occasion in the past year?"
            />
          </div>
        </div>
      </div>

      {/* 3. PHYSICAL ACTIVITY */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-4 w-4 text-slate-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Physical Activity
          </h3>
        </div>

        <YesNoRadio
          name="physicalActivity"
          value={data.physicalActivity}
          onChange={(val) => onChange("physicalActivity", val)}
          label="Moderate-Intensity Physical Activity"
          description="Does the patient do at least 2.5 hours a week of moderate-intensity physical activity (e.g. brisk walking, cycling, farming, housework)?"
        />
      </div>

      {/* 4. NUTRITION / DIETARY ASSESSMENT */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Utensils className="h-4 w-4 text-slate-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Nutrition / Dietary Assessment
          </h3>
        </div>

        <YesNoRadio
          name="nutritionDietary"
          value={data.nutritionDietary}
          onChange={(val) => onChange("nutritionDietary", val)}
          label="Unhealthy Diet Pattern"
          description="Weekly consumption of high-fat, high-salt, processed/fast foods, fried/ihaw-ihaw foods, and high-sugar foods/drinks?"
        />
      </div>

      {/* 5. ANTHROPOMETRICS & VITAL SIGNS */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-slate-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Weight, Height, BMI &amp; Vital Signs
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="weightKg" className="block text-xs font-semibold text-slate-700 mb-1">
              Weight (kg) <span className="text-rose-500">*</span>
            </label>
            <Input
              id="weightKg"
              type="number"
              step="0.1"
              value={data.weightKg}
              onChange={handleWeightChange}
              placeholder="e.g. 68.5"
              className="text-xs font-mono"
            />
          </div>

          <div>
            <label htmlFor="heightCm" className="block text-xs font-semibold text-slate-700 mb-1">
              Height (cm) <span className="text-rose-500">*</span>
            </label>
            <Input
              id="heightCm"
              type="number"
              step="0.5"
              value={data.heightCm}
              onChange={handleHeightChange}
              placeholder="e.g. 165"
              className="text-xs font-mono"
            />
          </div>

          <div>
            <label htmlFor="bmi" className="block text-xs font-semibold text-slate-700 mb-1">
              BMI (kg/m²) &bull; Read-only
            </label>
            <Input
              id="bmi"
              value={data.bmi ? `${data.bmi} kg/m²` : ""}
              readOnly
              placeholder="Auto-calculated"
              className="text-xs font-mono font-bold bg-slate-50 text-slate-900"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Calculated as weight(kg) / height(m)²
            </span>
          </div>

          <div>
            <label htmlFor="waistCircumferenceCm" className="block text-xs font-semibold text-slate-700 mb-1">
              Waist Circumference (cm)
            </label>
            <Input
              id="waistCircumferenceCm"
              type="number"
              step="0.5"
              value={data.waistCircumferenceCm}
              onChange={(e) => onChange("waistCircumferenceCm", e.target.value)}
              placeholder="e.g. 84"
              className="text-xs font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Blood Pressure (mmHg)
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  value={data.bloodPressureSystolic}
                  onChange={(e) => onChange("bloodPressureSystolic", e.target.value)}
                  placeholder="Systolic (e.g. 120)"
                  className="text-xs font-mono"
                  aria-label="Systolic blood pressure"
                />
              </div>
              <span className="text-slate-400 font-bold">/</span>
              <div className="flex-1">
                <Input
                  type="number"
                  value={data.bloodPressureDiastolic}
                  onChange={(e) => onChange("bloodPressureDiastolic", e.target.value)}
                  placeholder="Diastolic (e.g. 80)"
                  className="text-xs font-mono"
                  aria-label="Diastolic blood pressure"
                />
              </div>
              <span className="text-xs text-slate-500 font-mono">mmHg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
