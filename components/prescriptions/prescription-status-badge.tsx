import * as React from "react";
import {
  Clock,
  CheckCircle2,
  CheckCheck,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PrescriptionStatus } from "@/types/pharmacy";

interface PrescriptionStatusBadgeProps {
  status: PrescriptionStatus;
  className?: string;
}

export function PrescriptionStatusBadge({
  status,
  className,
}: PrescriptionStatusBadgeProps) {
  switch (status) {
    case "Active":
      return (
        <Badge
          variant="outline"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 bg-sky-50 text-sky-800 border-sky-300 ${className || ""}`}
          title="Status: Active prescription pending dispensation"
        >
          <Clock className="h-3 w-3 shrink-0 text-sky-600" aria-hidden="true" />
          <span>Active</span>
        </Badge>
      );

    case "Dispensed":
      return (
        <Badge
          variant="outline"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 bg-teal-50 text-teal-800 border-teal-300 ${className || ""}`}
          title="Status: Medication dispensed to patient"
        >
          <CheckCircle2 className="h-3 w-3 shrink-0 text-teal-600" aria-hidden="true" />
          <span>Dispensed</span>
        </Badge>
      );

    case "Completed":
      return (
        <Badge
          variant="success"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 ${className || ""}`}
          title="Status: Prescription regimen completed"
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
          title="Status: Prescription discontinued or cancelled"
        >
          <XCircle className="h-3 w-3 shrink-0 text-rose-600" aria-hidden="true" />
          <span>Cancelled</span>
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
