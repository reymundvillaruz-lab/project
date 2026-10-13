import * as React from "react";
import { CheckCircle2, AlertCircle, CheckCircle, Clock, CalendarX, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MaternalStatus, AppointmentStatus } from "@/types/maternal-care";

interface MaternalStatusBadgeProps {
  status: MaternalStatus;
  className?: string;
}

export function MaternalStatusBadge({ status, className }: MaternalStatusBadgeProps) {
  switch (status) {
    case "Active":
      return (
        <Badge
          variant="success"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 ${className || ""}`}
          title="Status: Active Maternal Case"
        >
          <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>Active</span>
        </Badge>
      );
    case "Follow-up Due":
      return (
        <Badge
          variant="warning"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 border border-amber-300 text-amber-900 bg-amber-50 ${className || ""}`}
          title="Status: Follow-up Due / Overdue"
        >
          <AlertCircle className="h-3 w-3 shrink-0 text-amber-700" aria-hidden="true" />
          <span>Follow-up Due</span>
        </Badge>
      );
    case "Completed":
      return (
        <Badge
          variant="secondary"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 border border-slate-300 text-slate-700 bg-slate-100 ${className || ""}`}
          title="Status: Completed Case"
        >
          <CheckCircle className="h-3 w-3 shrink-0 text-slate-500" aria-hidden="true" />
          <span>Completed</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className={`text-[11px] ${className || ""}`}>
          {status}
        </Badge>
      );
  }
}

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
  className?: string;
}

export function AppointmentStatusBadge({ status, className }: AppointmentStatusBadgeProps) {
  switch (status) {
    case "Scheduled":
      return (
        <Badge
          variant="default"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 bg-teal-50 text-teal-800 border border-teal-200 ${className || ""}`}
          title="Status: Scheduled"
        >
          <CalendarClock className="h-3 w-3 shrink-0 text-teal-600" aria-hidden="true" />
          <span>Scheduled</span>
        </Badge>
      );
    case "Completed":
      return (
        <Badge
          variant="success"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 ${className || ""}`}
          title="Status: Completed"
        >
          <CheckCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>Completed</span>
        </Badge>
      );
    case "Follow-up Due":
      return (
        <Badge
          variant="warning"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 border border-amber-300 text-amber-900 bg-amber-50 ${className || ""}`}
          title="Status: Follow-up Due"
        >
          <AlertCircle className="h-3 w-3 shrink-0 text-amber-700" aria-hidden="true" />
          <span>Follow-up Due</span>
        </Badge>
      );
    case "Cancelled":
      return (
        <Badge
          variant="destructive"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 ${className || ""}`}
          title="Status: Cancelled"
        >
          <CalendarX className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>Cancelled</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className={`text-[11px] ${className || ""}`}>
          <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
          {status}
        </Badge>
      );
  }
}
