import * as React from "react";
import { HeartPulse, CalendarCheck2, CalendarClock, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MaternalRecord } from "@/types/maternal-care";
import { calculateMaternalStats } from "@/lib/mock-data/maternal-care";

interface MaternalDashboardStatsProps {
  records: MaternalRecord[];
}

export function MaternalDashboardStats({ records }: MaternalDashboardStatsProps) {
  // Dynamically calculate statistics from current frontend records
  const stats = React.useMemo(() => {
    return calculateMaternalStats(records);
  }, [records]);

  const cards = [
    {
      title: "Active Maternal Cases",
      value: stats.activeCases,
      subtitle: "Currently enrolled expectant mothers",
      icon: <HeartPulse className="h-5 w-5 text-teal-700" />,
      bgClass: "bg-teal-50 border-teal-200",
      accentBorder: "border-l-4 border-l-teal-600",
    },
    {
      title: "Prenatal Visits This Month",
      value: stats.visitsThisMonth,
      subtitle: "Checkups logged for this calendar month",
      icon: <CalendarCheck2 className="h-5 w-5 text-emerald-700" />,
      bgClass: "bg-emerald-50 border-emerald-200",
      accentBorder: "border-l-4 border-l-emerald-600",
    },
    {
      title: "Upcoming Prenatal Appointments",
      value: stats.upcomingAppointments,
      subtitle: "Scheduled clinic and RHU visits",
      icon: <CalendarClock className="h-5 w-5 text-sky-700" />,
      bgClass: "bg-sky-50 border-sky-200",
      accentBorder: "border-l-4 border-l-sky-600",
    },
    {
      title: "Follow-ups Due",
      value: stats.followUpsDue,
      subtitle: "Cases requiring home visit or urgent check",
      icon: <AlertTriangle className="h-5 w-5 text-amber-700" />,
      bgClass: "bg-amber-50 border-amber-200",
      accentBorder: "border-l-4 border-l-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className={`transition-all hover:shadow-sm border-slate-200 bg-white ${card.accentBorder}`}
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </p>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  {card.value}
                </div>
              </div>
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${card.bgClass}`}
                aria-hidden="true"
              >
                {card.icon}
              </div>
            </div>
            <p className="mt-2 text-[11px] text-slate-500 line-clamp-1">{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
