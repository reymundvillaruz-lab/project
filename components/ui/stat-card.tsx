import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./card";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: "default" | "success" | "warning" | "destructive" | "info";
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  variant = "default",
  className,
}: StatCardProps) {
  const iconBgClasses = {
    default: "bg-teal-50 text-teal-700 border-teal-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    destructive: "bg-rose-50 text-rose-700 border-rose-200",
    info: "bg-sky-50 text-sky-700 border-sky-200",
  };

  return (
    <Card className={cn("transition-all hover:border-slate-300", className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg border",
              iconBgClasses[variant]
            )}
            aria-hidden="true"
          >
            {icon}
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900" aria-label={`${title}: ${value}`}>
            {value}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 font-normal">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
