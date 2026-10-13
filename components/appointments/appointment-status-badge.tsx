import * as React from "react";
import {
  CalendarClock,
  CheckCircle2,
  CheckCheck,
  XCircle,
  UserX,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AppointmentStatus } from "@/types/appointment";

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
  className?: string;
}

export function AppointmentStatusBadge({
  status,
  className,
}: AppointmentStatusBadgeProps) {
  switch (status) {
    case "Scheduled":
      return (
        <Badge
          variant="outline"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 bg-sky-50 text-sky-800 border-sky-200 ${className || ""}`}
          title="Status: Scheduled visit"
        >
          <CalendarClock className="h-3 w-3 shrink-0 text-sky-600" aria-hidden="true" />
          <span>Scheduled</span>
        </Badge>
      );

    case "Confirmed":
      return (
        <Badge
          variant="outline"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 bg-teal-50 text-teal-800 border-teal-300 ${className || ""}`}
          title="Status: Confirmed by patient/clinic"
        >
          <CheckCircle2 className="h-3 w-3 shrink-0 text-teal-600" aria-hidden="true" />
          <span>Confirmed</span>
        </Badge>
      );

    case "Completed":
      return (
        <Badge
          variant="success"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 ${className || ""}`}
          title="Status: Visit completed"
        >
          <CheckCheck className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>Completed</span>
        </Badge>
      );

    case "Cancelled":
      return (
        <Badge
          variant="destructive"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-50 ${className || ""}`}
          title="Status: Appointment cancelled"
        >
          <XCircle className="h-3 w-3 shrink-0 text-rose-600" aria-hidden="true" />
          <span>Cancelled</span>
        </Badge>
      );

    case "No Show":
      return (
        <Badge
          variant="outline"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 bg-amber-50 text-amber-900 border-amber-300 ${className || ""}`}
          title="Status: Patient did not attend"
        >
          <UserX className="h-3 w-3 shrink-0 text-amber-700" aria-hidden="true" />
          <span>No Show</span>
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
