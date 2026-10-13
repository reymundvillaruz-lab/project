import * as React from "react";
import { Pill, Package, AlertTriangle, AlertOctagon, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MedicineReportData } from "@/types/reports";
import { AccessibleBarChart, BarChartItem } from "./accessible-bar-chart";

interface MedicinePrescriptionStatisticsCardProps {
  data: MedicineReportData;
}

export function MedicinePrescriptionStatisticsCard({ data }: MedicinePrescriptionStatisticsCardProps) {
  const topMedsItems: BarChartItem[] = data.topPrescribedMedicines.map((m) => ({
    label: m.name,
    value: m.prescriptionsCount,
    subLabel: `${m.quantityDispensed.toLocaleString()} ${m.unit} dispensed`,
    barColor: "bg-teal-600",
  }));

  return (
    <Card className="border border-slate-200 shadow-xs bg-white">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Pill className="h-4 w-4 text-teal-700" />
            Medicines, Pharmacy Inventory &amp; Prescriptions
          </CardTitle>
          <CardDescription className="text-xs">
            Prescription fulfillment, top dispensed drugs, and inventory stock safety levels
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-100 text-xs font-semibold">
            Dispensation Rate: {data.dispensationFulfillmentRate}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Core Indicators */}
        <div className="grid grid-cols-4 gap-3 text-center p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div>
            <span className="text-[11px] text-slate-500 block">Prescriptions Issued</span>
            <span className="text-lg font-bold text-slate-900 font-mono">
              {data.totalPrescriptionsIssued.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block">Dispensed &amp; Released</span>
            <span className="text-lg font-bold text-teal-800 font-mono">
              {data.totalPrescriptionsDispensed.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block">Adequate Inventory</span>
            <span className="text-lg font-bold text-emerald-800 font-mono">
              {data.inventorySummary.adequateStock} / {data.inventorySummary.totalItems}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block">Low / Depleted Stock</span>
            <span className="text-lg font-bold text-amber-800 font-mono">
              {data.inventorySummary.lowStockWarnings + data.inventorySummary.outOfStockDepleted}
              <span className="text-[10px] text-rose-600 font-normal ml-1">
                ({data.inventorySummary.outOfStockDepleted} out)
              </span>
            </span>
          </div>
        </div>

        {/* Top Prescribed Drugs Chart */}
        <div className="pt-1">
          <AccessibleBarChart
            title="Most Frequently Prescribed Generic Drugs"
            items={topMedsItems}
            valueSuffix="orders"
          />
        </div>
      </CardContent>
    </Card>
  );
}
