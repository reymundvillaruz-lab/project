import * as React from "react";
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MedicineDashboardStats } from "@/types/pharmacy";

interface MedicineDashboardStatsViewProps {
  stats: MedicineDashboardStats;
}

export function MedicineDashboardStatsView({
  stats,
}: MedicineDashboardStatsViewProps) {
  const cards = [
    {
      title: "Total Inventory Items",
      value: stats.totalItems,
      subtitle: "Registered generic medicines and medical supplies",
      icon: <Package className="h-5 w-5 text-teal-700" />,
      bgClass: "bg-teal-50 border-teal-200",
      accentBorder: "border-l-4 border-l-teal-600",
      textColor: "text-teal-900",
    },
    {
      title: "Adequate Stock",
      value: stats.availableItems,
      subtitle: "Items with sufficient stock levels",
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-700" />,
      bgClass: "bg-emerald-50 border-emerald-200",
      accentBorder: "border-l-4 border-l-emerald-600",
      textColor: "text-emerald-900",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockItems,
      subtitle: "Medicines below minimum reorder threshold",
      icon: <AlertTriangle className="h-5 w-5 text-amber-700" />,
      bgClass: "bg-amber-50 border-amber-200",
      accentBorder: "border-l-4 border-l-amber-600",
      textColor: "text-amber-900",
    },
    {
      title: "Critical (Out / Expired)",
      value: stats.outOfStockItems + stats.expiredItems,
      subtitle: `${stats.outOfStockItems} depleted • ${stats.expiredItems} expired`,
      icon: <AlertOctagon className="h-5 w-5 text-rose-700" />,
      bgClass: "bg-rose-50 border-rose-200",
      accentBorder: "border-l-4 border-l-rose-600",
      textColor: "text-rose-900",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => (
        <Card
          key={idx}
          className={`overflow-hidden border shadow-xs transition-shadow hover:shadow-md ${card.accentBorder}`}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500">{card.title}</p>
                <p className={`text-2xl font-bold tracking-tight ${card.textColor}`}>
                  {card.value}
                </p>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {card.subtitle}
                </p>
              </div>
              <div className={`rounded-lg p-2.5 border ${card.bgClass}`}>
                {card.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
