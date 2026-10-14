import * as React from "react";
import { HeartPulse, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MaternalCareReportData } from "@/types/reports";
import { AccessibleBarChart, BarChartItem } from "./accessible-bar-chart";

interface MaternalCareStatisticsCardProps {
  data: MaternalCareReportData;
}

export function MaternalCareStatisticsCard({ data }: MaternalCareStatisticsCardProps) {
  const total = data.totalExpectedPregnancies;
  const calcPct = (value: number) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

  const ancChartItems: BarChartItem[] = [
    {
      label: "1st Trimester Antenatal Care (ANC) Booking",
      value: data.firstTrimesterBooking,
      percentage: calcPct(data.firstTrimesterBooking),
      barColor: "bg-teal-600",
    },
    {
      label: "4 or More Antenatal Visits (ANC4+ Completed)",
      value: data.fourOrMoreAntenatalVisits,
      percentage: calcPct(data.fourOrMoreAntenatalVisits),
      barColor: "bg-emerald-600",
    },
    {
      label: "Tetanus Diphtheria (Td) Vaccinated Mothers",
      value: data.tetanusVaccinatedMothers,
      percentage: calcPct(data.tetanusVaccinatedMothers),
      barColor: "bg-sky-600",
    },
    {
      label: "Iron & Folic Acid Micronutrient Supplemented",
      value: data.ironFolicAcidSupplemented,
      percentage: calcPct(data.ironFolicAcidSupplemented),
      barColor: "bg-indigo-600",
    },
    {
      label: "Postpartum Care Visits Completed (At least 2 visits)",
      value: data.postpartumVisitsCompleted,
      percentage: calcPct(data.postpartumVisitsCompleted),
      barColor: "bg-amber-600",
    },
  ];

  return (
    <Card className="border border-slate-200 shadow-xs bg-white">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-teal-700" />
            Maternal Health &amp; Safe Motherhood Indicators
          </CardTitle>
          <CardDescription className="text-xs">
            Antenatal consultations, micronutrient supplementation, and pregnancy tracking
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-100 text-xs font-semibold">
            Facility Delivery: {data.facilityBasedDeliveryRate}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Core Indicators */}
        <div className="grid grid-cols-4 gap-3 text-center p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div>
            <span className="text-[11px] text-slate-500 block">Expected Pregnancies</span>
            <span className="text-lg font-bold text-slate-900 font-mono">
              {data.totalExpectedPregnancies}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block">ANC4+ Compliant</span>
            <span className="text-lg font-bold text-emerald-800 font-mono">
              {data.fourOrMoreAntenatalVisits} ({calcPct(data.fourOrMoreAntenatalVisits)}%)
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block">High-Risk Pregnancies</span>
            <span className="text-lg font-bold text-rose-800 font-mono">
              {data.highRiskPregnanciesIdentified}
              <span className="text-[10px] text-slate-500 font-normal ml-1">Monitored</span>
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block">Postpartum Visits</span>
            <span className="text-lg font-bold text-teal-800 font-mono">
              {data.postpartumVisitsCompleted}
            </span>
          </div>
        </div>

        {/* Antenatal Progress Chart */}
        <div className="pt-1">
          <AccessibleBarChart
            title="Antenatal &amp; Postnatal Performance Benchmark"
            items={ancChartItems}
            maxValue={data.totalExpectedPregnancies}
            valueSuffix="mothers"
          />
        </div>
      </CardContent>
    </Card>
  );
}
