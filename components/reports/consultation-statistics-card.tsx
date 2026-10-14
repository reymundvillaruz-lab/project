import * as React from "react";
import { Stethoscope, Activity, AlertCircle, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConsultationReportData } from "@/types/reports";
import { AccessibleBarChart, BarChartItem } from "./accessible-bar-chart";
import { DistributionProgressBar, SegmentItem } from "./distribution-progress-bar";

interface ConsultationStatisticsCardProps {
  data: ConsultationReportData;
}

export function ConsultationStatisticsCard({ data }: ConsultationStatisticsCardProps) {
  const morbidityChartItems: BarChartItem[] = data.topMorbidities.map((m) => ({
    label: m.disease,
    value: m.cases,
    subLabel: m.icdCode,
    percentage: m.percentage,
    barColor: "bg-teal-600",
  }));

  const total = data.totalConsultations;
  const calcConsultationPct = (count: number) =>
    total > 0 ? Math.round((count / total) * 100) : 0;

  const triageSegments: SegmentItem[] = [
    {
      label: "Routine Non-Urgent",
      count: data.triageLevels.routine,
      percentage: calcConsultationPct(data.triageLevels.routine),
      colorClass: "bg-emerald-500",
    },
    {
      label: "Priority Care",
      count: data.triageLevels.priority,
      percentage: calcConsultationPct(data.triageLevels.priority),
      colorClass: "bg-amber-500",
    },
    {
      label: "Urgent / Emergency",
      count: data.triageLevels.urgent,
      percentage: calcConsultationPct(data.triageLevels.urgent),
      colorClass: "bg-rose-500",
    },
  ];

  return (
    <Card className="border border-slate-200 shadow-xs bg-white">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-teal-700" />
            Clinical Consultations &amp; Leading Causes of Morbidity
          </CardTitle>
          <CardDescription className="text-xs">
            Primary care consultations, triage stratification, and ICD-10 conditions
          </CardDescription>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-slate-500 block">Total Consultations</span>
          <span className="text-base font-bold text-teal-900 font-mono">
            {data.totalConsultations.toLocaleString()}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-5">
        {/* Triage Stratification Meter */}
        <DistributionProgressBar
          title="Triage &amp; Clinical Urgency Levels"
          segments={triageSegments}
          totalLabel="Total Encounters"
          totalValue={data.totalConsultations}
        />

        {/* Top Morbidity Bar Chart */}
        <div className="pt-2 border-t border-slate-100">
          <AccessibleBarChart
            title="Top Primary Care Morbidities (FHSIS M1 Form)"
            items={morbidityChartItems}
            valueSuffix="cases"
          />
        </div>

        {/* Patient Outcomes / Disposition */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Treated &amp; Sent Home</span>
            <span className="font-bold text-emerald-800 text-sm font-mono">
              {data.outcomes.treatedSentHome} ({calcConsultationPct(data.outcomes.treatedSentHome)}%)
            </span>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Hospital Referrals</span>
            <span className="font-bold text-amber-800 text-sm font-mono">
              {data.outcomes.referredHospital} ({calcConsultationPct(data.outcomes.referredHospital)}%)
            </span>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Scheduled Follow-up</span>
            <span className="font-bold text-teal-800 text-sm font-mono">
              {data.outcomes.followUpRequired} ({calcConsultationPct(data.outcomes.followUpRequired)}%)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
