import * as React from "react";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  CalendarClock,
  CalendarCheck2,
  CalendarX,
  HelpCircle,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  FPClientStatus,
  FPFollowUpStatus,
  FPClientType,
} from "@/types/family-planning";

interface FPClientStatusBadgeProps {
  status: FPClientStatus;
  className?: string;
}

export function FPClientStatusBadge({ status, className }: FPClientStatusBadgeProps) {
  switch (status) {
    case "Active User":
      return (
        <Badge
          variant="success"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 ${className || ""}`}
          title="Status: Active Family Planning User"
        >
          <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>Active User</span>
        </Badge>
      );
    case "Follow-up Due":
      return (
        <Badge
          variant="warning"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 border border-amber-300 text-amber-900 bg-amber-50 ${className || ""}`}
          title="Status: Follow-up Due or Overdue"
        >
          <AlertCircle className="h-3 w-3 shrink-0 text-amber-700" aria-hidden="true" />
          <span>Follow-up Due</span>
        </Badge>
      );
    case "Discontinued":
      return (
        <Badge
          variant="secondary"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 border border-slate-300 text-slate-700 bg-slate-100 ${className || ""}`}
          title="Status: Discontinued / Dropped out"
        >
          <XCircle className="h-3 w-3 shrink-0 text-slate-500" aria-hidden="true" />
          <span>Discontinued</span>
        </Badge>
      );
    case "Referred":
      return (
        <Badge
          variant="info"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 border border-sky-300 text-sky-900 bg-sky-50 ${className || ""}`}
          title="Status: Referred to Higher Facility"
        >
          <CheckCircle className="h-3 w-3 shrink-0 text-sky-700" aria-hidden="true" />
          <span>Referred</span>
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

interface FPFollowUpStatusBadgeProps {
  status: FPFollowUpStatus;
  date?: string;
  className?: string;
}

export function FPFollowUpStatusBadge({ status, date, className }: FPFollowUpStatusBadgeProps) {
  switch (status) {
    case "Scheduled":
      return (
        <Badge
          variant="default"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 bg-teal-50 text-teal-800 border border-teal-200 ${className || ""}`}
          title="Status: Scheduled for future date"
        >
          <CalendarClock className="h-3 w-3 shrink-0 text-teal-600" aria-hidden="true" />
          <span>Scheduled</span>
        </Badge>
      );
    case "Due":
      return (
        <Badge
          variant="warning"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 border border-amber-300 text-amber-900 bg-amber-50 ${className || ""}`}
          title="Status: Due today"
        >
          <AlertTriangle className="h-3 w-3 shrink-0 text-amber-700" aria-hidden="true" />
          <span>Due Today</span>
        </Badge>
      );
    case "Overdue":
      return (
        <Badge
          variant="destructive"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 border border-rose-300 text-rose-900 bg-rose-50 ${className || ""}`}
          title="Status: Overdue follow-up"
        >
          <AlertCircle className="h-3 w-3 shrink-0 text-rose-700" aria-hidden="true" />
          <span>Overdue</span>
        </Badge>
      );
    case "Completed":
      return (
        <Badge
          variant="success"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 ${className || ""}`}
          title="Status: Completed follow-up"
        >
          <CalendarCheck2 className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>Completed</span>
        </Badge>
      );
    case "Cancelled":
      return (
        <Badge
          variant="secondary"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 border border-slate-300 text-slate-600 bg-slate-100 ${className || ""}`}
          title="Status: Cancelled follow-up"
        >
          <CalendarX className="h-3 w-3 shrink-0 text-slate-500" aria-hidden="true" />
          <span>Cancelled</span>
        </Badge>
      );
    case "Not Scheduled":
    default:
      return (
        <Badge
          variant="outline"
          className={`inline-flex items-center gap-1 font-normal text-[11px] px-2 py-0.5 text-slate-400 border-dashed border-slate-300 ${className || ""}`}
          title="Status: Not Scheduled"
        >
          <Clock className="h-3 w-3 shrink-0 text-slate-400" aria-hidden="true" />
          <span>Not Scheduled</span>
        </Badge>
      );
  }
}

interface FPClientTypeBadgeProps {
  type: FPClientType;
  className?: string;
}

export function FPClientTypeBadge({ type, className }: FPClientTypeBadgeProps) {
  const colorMap: Record<FPClientType, string> = {
    "New Acceptor": "bg-emerald-50 text-emerald-800 border-emerald-200",
    "Current User": "bg-teal-50 text-teal-800 border-teal-200",
    "Changing Method": "bg-purple-50 text-purple-800 border-purple-200",
    "Changing Clinic": "bg-blue-50 text-blue-800 border-blue-200",
    "Dropout/Restart": "bg-amber-50 text-amber-800 border-amber-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold border ${colorMap[type] || "bg-slate-50 text-slate-700 border-slate-200"} ${className || ""}`}
    >
      {type}
    </span>
  );
}
