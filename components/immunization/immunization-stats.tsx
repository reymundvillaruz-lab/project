"use client";

import * as React from "react";
import { CheckCircle2, Clock, AlertTriangle, CalendarCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ImmunizationStatsProps {
  totalImmunized: number;
  dueForImmunization: number;
  overdue: number;
  completedThisMonth: number;
}

export function ImmunizationStats({
  totalImmunized,
  dueForImmunization,
  overdue,
  completedThisMonth,
}: ImmunizationStatsProps) {
  const stats = [
    {
      title: "Total Immunized",
      value: totalImmunized,
      description: "Completed vaccine doses",
      icon: CheckCircle2,
      iconClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      accent: "text-emerald-700",
    },
    {
      title: "Due for Immunization",
      value: dueForImmunization,
      description: "Vaccines ready to administer",
      icon: Clock,
      iconClass: "bg-amber-50 text-amber-700 border-amber-200",
      accent: "text-amber-700",
    },
    {
      title: "Overdue",
      value: overdue,
      description: "Missed target schedule",
      icon: AlertTriangle,
      iconClass: "bg-rose-50 text-rose-700 border-rose-200",
      accent: "text-rose-700",
    },
    {
      title: "Completed This Month",
      value: completedThisMonth,
      description: "Administered in current month",
      icon: CalendarCheck,
      iconClass: "bg-teal-50 text-teal-700 border-teal-200",
      accent: "text-teal-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="transition-all hover:border-slate-300">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  {stat.title}
                </p>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border ${stat.iconClass}`}
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div
                  className="text-2xl font-bold tracking-tight text-slate-900"
                  aria-label={`${stat.title}: ${stat.value}`}
                >
                  {stat.value}
                </div>
                <p className="mt-1 text-xs text-slate-500 font-normal">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
