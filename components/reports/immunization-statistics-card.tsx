import * as React from "react";
import { Syringe, ShieldCheck, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImmunizationReportData } from "@/types/reports";
import { AccessibleBarChart, BarChartItem } from "./accessible-bar-chart";

interface ImmunizationStatisticsCardProps {
  data: ImmunizationReportData;
}

export function ImmunizationStatisticsCard({ data }: ImmunizationStatisticsCardProps) {
  const antigenChartItems: BarChartItem[] = data.antigens.map((a) => ({
    label: a.antigen,
    value: a.dosesAdministered,
    subLabel: `Target: ${a.targetPopulation}`,
    percentage: a.coveragePercentage,
    barColor: a.coveragePercentage >= 95 ? "bg-emerald-600" : "bg-teal-600",
  }));

  return (
    <Card className="border border-slate-200 shadow-xs bg-white">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Syringe className="h-4 w-4 text-teal-700" />
            Expanded Program on Immunization (EPI) Coverage
          </CardTitle>
          <CardDescription className="text-xs">
            Antigen delivery tracking, Fully Immunized Children (FIC), and defaulter rate
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 text-xs font-semibold">
            FIC Rate: {data.ficCoverageRate}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Core Indicators Grid */}
        <div className="grid grid-cols-4 gap-3 text-center p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div>
            <span className="text-[11px] text-slate-500 block">Target Infants (0-11m)</span>
            <span className="text-lg font-bold text-slate-900 font-mono">
              {data.targetInfants}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block">Fully Immunized (FIC)</span>
            <span className="text-lg font-bold text-emerald-800 font-mono">
              {data.fullyImmunizedChildren}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block">DOH FIC Target</span>
            <span className="text-lg font-bold text-teal-800 font-mono">
              &ge; 95.0%
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block">Defaulter Rate</span>
            <span className="text-lg font-bold text-slate-800 font-mono">
              {data.defaulterRate}%
              <span className="text-[10px] text-emerald-600 font-normal ml-1">(&lt;5% Target)</span>
            </span>
          </div>
        </div>

        {/* Antigen Delivery Progress */}
        <div className="pt-1">
          <AccessibleBarChart
            title="Vaccine Antigen Coverage (% of Target Infants Vaccinated)"
            items={antigenChartItems}
            maxValue={data.targetInfants}
            valueSuffix="doses"
          />
        </div>
      </CardContent>
    </Card>
  );
}
