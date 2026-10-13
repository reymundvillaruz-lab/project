import * as React from "react";
import { CheckCircle2, Clock, AlertCircle, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VaccineStatus } from "./types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: VaccineStatus | string;
  className?: string;
  showIcon?: boolean;
}

export function ImmunizationStatusBadge({
  status,
  className,
  showIcon = true,
}: StatusBadgeProps) {
  switch (status) {
    case "Fully Immunized":
    case "Completed":
      return (
        <Badge
          className={cn(
            "bg-emerald-50 text-emerald-800 border-emerald-300 font-medium px-2 py-0.5",
            className
          )}
          aria-label={status === "Fully Immunized" ? "Status: Fully Immunized (FIC)" : "Status: Completed"}
        >
          {showIcon && <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" aria-hidden="true" />}
          <span>{status === "Fully Immunized" ? "Fully Immunized (FIC)" : "Completed"}</span>
        </Badge>
      );
    case "Partially Immunized":
      return (
        <Badge
          className={cn(
            "bg-sky-50 text-sky-800 border-sky-300 font-medium px-2 py-0.5",
            className
          )}
          aria-label="Status: Partially Immunized"
        >
          {showIcon && <Clock className="h-3 w-3 text-sky-600 shrink-0" aria-hidden="true" />}
          <span>Partially Immunized</span>
        </Badge>
      );
    case "Due":
      return (
        <Badge
          className={cn(
            "bg-amber-50 text-amber-800 border-amber-300 font-medium px-2 py-0.5",
            className
          )}
          aria-label="Status: Due"
        >
          {showIcon && <Clock className="h-3 w-3 text-amber-600 shrink-0" aria-hidden="true" />}
          <span>Due</span>
        </Badge>
      );
    case "Overdue":
      return (
        <Badge
          className={cn(
            "bg-rose-50 text-rose-800 border-rose-300 font-semibold px-2 py-0.5",
            className
          )}
          aria-label="Status: Overdue"
        >
          {showIcon && <AlertCircle className="h-3 w-3 text-rose-600 shrink-0" aria-hidden="true" />}
          <span>Overdue</span>
        </Badge>
      );
    case "Scheduled":
      return (
        <Badge
          className={cn(
            "bg-indigo-50 text-indigo-800 border-indigo-300 font-medium px-2 py-0.5",
            className
          )}
          aria-label="Status: Scheduled"
        >
          {showIcon && <CalendarClock className="h-3 w-3 text-indigo-600 shrink-0" aria-hidden="true" />}
          <span>Scheduled</span>
        </Badge>
      );
    case "Not Started":
      return (
        <Badge
          variant="secondary"
          className={cn(
            "bg-slate-100 text-slate-700 border-slate-300 font-medium px-2 py-0.5",
            className
          )}
          aria-label="Status: Not Started"
        >
          {showIcon && <Clock className="h-3 w-3 text-slate-500 shrink-0" aria-hidden="true" />}
          <span>Not Started</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className={cn("px-2 py-0.5", className)}>
          <span>{status || "Pending"}</span>
        </Badge>
      );
  }
}
