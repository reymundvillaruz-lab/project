import * as React from "react";
import { HeartHandshake, Users, CheckCircle2, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FamilyPlanningReportData } from "@/types/reports";
import { AccessibleBarChart, BarChartItem } from "./accessible-bar-chart";

interface FamilyPlanningStatisticsCardProps {
  data: FamilyPlanningReportData;
}

export function FamilyPlanningStatisticsCard({ data }: FamilyPlanningStatisticsCardProps) {
  const methodChartItems: BarChartItem[] = data.methodDistribution.map((m) => ({
    label: m.method,
    value: m.usersCount,
    subLabel: m.category,
    percentage: m.percentage,
    barColor:
      m.category === "Long-Acting & Permanent"
        ? "bg-emerald-600"
        : m.category === "Natural / LAM"
        ? "bg-sky-600"
        : "bg-teal-600",
  }));

  return (
    <Card className="border border-slate-200 shadow-xs bg-white">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <HeartHandshake className="h-4 w-4 text-teal-700" />
            Family Planning &amp; Reproductive Health (DOH Form 1)
          </CardTitle>
          <CardDescription className="text-xs">
            Modern contraceptive prevalence, method mix, and acceptor classification
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-100 text-xs font-semibold">
            Active Users: {data.totalCurrentUsers}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Core Indicators */}
        <div className="grid grid-cols-4 gap-3 text-center p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div>
            <span className="text-[11px] text-slate-500 block">Total Active Users</span>
            <span className="text-lg font-bold text-teal-900 font-mono">
              {data.totalCurrentUsers}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block">New Acceptors (NA)</span>
            <span className="text-lg font-bold text-emerald-800 font-mono">
              +{data.newAcceptors}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block">Changing Method (CM)</span>
            <span className="text-lg font-bold text-slate-800 font-mono">
              {data.methodChangers}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block">Unmet Need Rate</span>
            <span className="text-lg font-bold text-slate-800 font-mono">
              {data.unmetNeedPercentage}%
            </span>
          </div>
        </div>

        {/* Method Mix Chart */}
        <div className="pt-1">
          <AccessibleBarChart
            title="Contraceptive Method Distribution (Modern Method Mix)"
            items={methodChartItems}
            valueSuffix="clients"
          />
        </div>
      </CardContent>
    </Card>
  );
}
