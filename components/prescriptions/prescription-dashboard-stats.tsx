import * as React from "react";
import {
  Pill,
  Clock,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PrescriptionDashboardStats } from "@/types/pharmacy";

interface PrescriptionDashboardStatsViewProps {
  stats: PrescriptionDashboardStats;
}

export function PrescriptionDashboardStatsView({
  stats,
}: PrescriptionDashboardStatsViewProps) {
  const cards = [
    {
      title: "Total Prescriptions",
      value: stats.totalPrescriptions,
      subtitle: "Prescriptions issued in the current session",
      icon: <Pill className="h-5 w-5 text-teal-700" />,
      bgClass: "bg-teal-50 border-teal-200",
      accentBorder: "border-l-4 border-l-teal-600",
      textColor: "text-teal-900",
    },
    {
      title: "Active Prescriptions",
      value: stats.activePrescriptions,
      subtitle: "Pending pharmacy dispensing or ongoing treatment",
      icon: <Clock className="h-5 w-5 text-sky-700" />,
      bgClass: "bg-sky-50 border-sky-200",
      accentBorder: "border-l-4 border-l-sky-600",
      textColor: "text-sky-900",
    },
    {
      title: "Dispensed Medications",
      value: stats.dispensedPrescriptions,
      subtitle: "Fitted, released, and completed drug orders",
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-700" />,
      bgClass: "bg-emerald-50 border-emerald-200",
      accentBorder: "border-l-4 border-l-emerald-600",
      textColor: "text-emerald-900",
    },
    {
      title: "Issued Today",
      value: stats.todayPrescriptions,
      subtitle: "Prescriptions written during today's clinic hours",
      icon: <Calendar className="h-5 w-5 text-indigo-700" />,
      bgClass: "bg-indigo-50 border-indigo-200",
      accentBorder: "border-l-4 border-l-indigo-600",
      textColor: "text-indigo-900",
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
