import * as React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MedicineStatus } from "@/types/pharmacy";

interface MedicineStatusBadgeProps {
  status: MedicineStatus;
  className?: string;
}

export function MedicineStatusBadge({
  status,
  className,
}: MedicineStatusBadgeProps) {
  switch (status) {
    case "Available":
      return (
        <Badge
          variant="success"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 ${className || ""}`}
          title="Status: Sufficient stock available"
        >
          <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>Available</span>
        </Badge>
      );

    case "Low Stock":
      return (
        <Badge
          variant="warning"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 border border-amber-300 text-amber-900 bg-amber-50 ${className || ""}`}
          title="Status: Stock is below reorder threshold"
        >
          <AlertTriangle className="h-3 w-3 shrink-0 text-amber-700" aria-hidden="true" />
          <span>Low Stock</span>
        </Badge>
      );

    case "Out of Stock":
      return (
        <Badge
          variant="destructive"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 ${className || ""}`}
          title="Status: Zero stock available"
        >
          <XCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>Out of Stock</span>
        </Badge>
      );

    case "Expired":
      return (
        <Badge
          variant="outline"
          className={`inline-flex items-center gap-1 font-medium text-[11px] px-2 py-0.5 border border-purple-300 text-purple-900 bg-purple-50 ${className || ""}`}
          title="Status: Past expiration date"
        >
          <Clock className="h-3 w-3 shrink-0 text-purple-700" aria-hidden="true" />
          <span>Expired</span>
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
