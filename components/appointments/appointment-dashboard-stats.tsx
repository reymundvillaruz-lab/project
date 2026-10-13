import * as React from "react";
import {
  Calendar,
  CalendarClock,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AppointmentDashboardStats } from "@/types/appointment";

interface AppointmentDashboardStatsViewProps {
  stats: AppointmentDashboardStats;
}

export function AppointmentDashboardStatsView({
  stats,
}: AppointmentDashboardStatsViewProps) {
  const cards = [
    {
      title: "Today's Appointments",
      value: stats.today,
      subtitle: "Patients scheduled for health center visit today",
      icon: <Calendar className="h-5 w-5 text-teal-700" />,
      bgClass: "bg-teal-50 border-teal-200",
      accentBorder: "border-l-4 border-l-teal-600",
      textColor: "text-teal-900",
    },
    {
      title: "Upcoming Appointments",
      value: stats.upcoming,
      subtitle: "Future scheduled consultations and checkups",
      icon: <CalendarClock className="h-5 w-5 text-sky-700" />,
      bgClass: "bg-sky-50 border-sky-200",
      accentBorder: "border-l-4 border-l-sky-600",
      textColor: "text-sky-900",
    },
    {
      title: "Completed Visits",
      value: stats.completed,
      subtitle: "Finished consultations & attended rounds",
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-700" />,
      bgClass: "bg-emerald-50 border-emerald-200",
      accentBorder: "border-l-4 border-l-emerald-600",
      textColor: "text-emerald-900",
    },
    {
      title: "Total Booked in Session",
      value: stats.total,
      subtitle: "Cumulative appointments logged this session",
      icon: <Layers className="h-5 w-5 text-slate-700" />,
      bgClass: "bg-slate-50 border-slate-200",
      accentBorder: "border-l-4 border-l-slate-600",
      textColor: "text-slate-900",
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
