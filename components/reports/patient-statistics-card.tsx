import * as React from "react";
import { Users, ShieldCheck, HeartHandshake, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PatientReportData } from "@/types/reports";
import { DistributionProgressBar, SegmentItem } from "./distribution-progress-bar";

interface PatientStatisticsCardProps {
  data: PatientReportData;
}

export function PatientStatisticsCard({ data }: PatientStatisticsCardProps) {
  const ageSegments: SegmentItem[] = [
    { label: "Under 5 yrs", count: data.demographics.under5.count, percentage: data.demographics.under5.percentage, colorClass: "bg-emerald-500" },
    { label: "School Age (6-17)", count: data.demographics.schoolAge.count, percentage: data.demographics.schoolAge.percentage, colorClass: "bg-sky-500" },
    { label: "WRA (15-49 yrs)", count: data.demographics.womenReproductiveAge.count, percentage: data.demographics.womenReproductiveAge.percentage, colorClass: "bg-rose-500" },
    { label: "Adults (18-59)", count: data.demographics.adults.count, percentage: data.demographics.adults.percentage, colorClass: "bg-indigo-500" },
    { label: "Seniors (60+ yrs)", count: data.demographics.seniors.count, percentage: data.demographics.seniors.percentage, colorClass: "bg-amber-500" },
  ];

  return (
    <Card className="border border-slate-200 shadow-xs bg-white">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-teal-700" />
            Patient Demographics &amp; Population Coverage
          </CardTitle>
          <CardDescription className="text-xs">
            Barangay catchment population distribution &amp; social insurance
          </CardDescription>
        </div>
        <Badge variant="outline" className="text-teal-800 bg-teal-50 border-teal-200 font-mono text-xs">
          +{data.newRegistrationsThisPeriod} New in Period
        </Badge>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Top Summary Metrics */}
        <div className="grid grid-cols-4 gap-3 text-center p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div>
            <span className="text-[11px] text-slate-500 block">Total Registered</span>
            <span className="text-lg font-bold text-slate-900 font-mono">
              {data.totalRegistered.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block">PhilHealth Konsulta</span>
            <span className="text-lg font-bold text-teal-800 font-mono">
              {data.socialCoverage.philhealthMembers.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block">4Ps Beneficiaries</span>
            <span className="text-lg font-bold text-emerald-800 font-mono">
              {data.socialCoverage.nhts4PsBeneficiaries.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block">Senior Citizens</span>
            <span className="text-lg font-bold text-amber-800 font-mono">
              {data.socialCoverage.seniorCitizenMembers.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Population Age Segments Distribution */}
        <div className="pt-1">
          <DistributionProgressBar
            title="Population Age Cohort Breakdown"
            segments={ageSegments}
            totalLabel="Total Registered"
            totalValue={data.totalRegistered}
          />
        </div>
      </CardContent>
    </Card>
  );
}
