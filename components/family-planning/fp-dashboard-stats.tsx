import * as React from "react";
import { Users, UserCheck, CalendarClock, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FPClient, FPDashboardStats } from "@/types/family-planning";
import { calculateFPDashboardStats } from "@/lib/family-planning-utils";

interface FPDashboardStatsProps {
  clients?: FPClient[];
  stats?: FPDashboardStats;
}

export function FPDashboardStatsView({ clients = [], stats: providedStats }: FPDashboardStatsProps) {
  // Dynamically calculate statistics from current session records if not directly provided
  const stats = React.useMemo(() => {
    if (providedStats) return providedStats;
    return calculateFPDashboardStats(clients);
  }, [clients, providedStats]);

  const cards = [
    {
      title: "Total Registered Clients",
      value: stats.totalRegisteredClients,
      subtitle: "Clients enrolled in FP register (ITR Form 1)",
      icon: <Users className="h-5 w-5 text-teal-700" />,
      bgClass: "bg-teal-50 border-teal-200",
      accentBorder: "border-l-4 border-l-teal-600",
    },
    {
      title: "Current Family Planning Users",
      value: stats.currentFPUsers,
      subtitle: "Active users with ongoing contraceptive method",
      icon: <UserCheck className="h-5 w-5 text-emerald-700" />,
      bgClass: "bg-emerald-50 border-emerald-200",
      accentBorder: "border-l-4 border-l-emerald-600",
    },
    {
      title: "Upcoming Follow-ups",
      value: stats.upcomingFollowUps,
      subtitle: "Scheduled resupply, checkup, and clinic dates",
      icon: <CalendarClock className="h-5 w-5 text-sky-700" />,
      bgClass: "bg-sky-50 border-sky-200",
      accentBorder: "border-l-4 border-l-sky-600",
    },
    {
      title: "Follow-ups Due",
      value: stats.followUpsDue,
      subtitle: "Clients due today or overdue for resupply/checkup",
      icon: <AlertTriangle className="h-5 w-5 text-amber-700" />,
      bgClass: "bg-amber-50 border-amber-200",
      accentBorder: "border-l-4 border-l-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className={`transition-all hover:shadow-xs border-slate-200 bg-white ${card.accentBorder}`}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </p>
                <div className="text-3xl font-bold tracking-tight text-slate-900">
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
