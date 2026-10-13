"use client";

import * as React from "react";
import { ClipboardCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { YesNoRadio } from "./yes-no-radio";
import { PhilpenManagement } from "@/lib/mock-data/philpen";

interface ManagementSectionProps {
  data: PhilpenManagement;
  onChange: (field: keyof PhilpenManagement, value: any) => void;
}

export function ManagementSection({
  data,
  onChange,
}: ManagementSectionProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-2.5">
          <ClipboardCheck className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs">
            <p className="font-semibold text-slate-800">
              PHILPEN Clinical Management &amp; Care Plan (Revised 2022)
            </p>
            <p className="text-slate-500 leading-relaxed">
              Record immediate interventions, pharmacologic management, scheduled follow-up, and specific provider remarks.
            </p>
          </div>
        </div>
      </div>

      {/* Intervention Yes/No Items */}
      <div className="space-y-2">
        <YesNoRadio
          name="lifestyleModification"
          value={data.lifestyleModification}
          onChange={(val) => onChange("lifestyleModification", val)}
          label="Lifestyle Modification"
          description="Dietary intervention, physical activity counseling, tobacco cessation, and alcohol reduction advice"
        />

        <YesNoRadio
          name="antiHypertensives"
          value={data.antiHypertensives}
          onChange={(val) => onChange("antiHypertensives", val)}
          label="Anti-Hypertensives"
          description="Initiated or maintained on anti-hypertensive medication regimen"
        />

        <YesNoRadio
          name="oralHypoglycemic"
          value={data.oralHypoglycemic}
          onChange={(val) => onChange("oralHypoglycemic", val)}
          label="Oral Hypoglycemic Agents / Insulin"
          description="Initiated or maintained on oral antidiabetic agents or insulin therapy"
        />
      </div>

      {/* Follow-up & Remarks */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="followUpDate" className="block text-xs font-semibold text-slate-700 mb-1">
              Date of Follow-up
            </label>
            <Input
              id="followUpDate"
              type="date"
              value={data.followUpDate}
              onChange={(e) => onChange("followUpDate", e.target.value)}
              className="text-xs"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Scheduled clinical reassessment date
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="remarks" className="block text-xs font-semibold text-slate-700 mb-1">
            Clinical Remarks / Specific Care Recommendations
          </label>
          <Textarea
            id="remarks"
            rows={4}
            value={data.remarks}
            onChange={(e) => onChange("remarks", e.target.value)}
            placeholder="Enter clinical assessment notes, physician referral details, lab requisitions, or patient counseling remarks..."
            className="text-xs"
          />
        </div>
      </div>
    </div>
  );
}
