"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MockConsultation } from "@/lib/mock-data/consultations";

interface ConsultationActionsProps {
  consultation: MockConsultation;
}

export function ConsultationActions({ consultation }: ConsultationActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Link href={`/consultations/${consultation.id}`}>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs text-teal-700 hover:bg-teal-50 hover:text-teal-900"
          title="View Consultation Details"
        >
          <Eye className="h-3.5 w-3.5 mr-1" />
          <span>View</span>
        </Button>
      </Link>

      <Link href={`/consultations/new?edit=${consultation.id}`}>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          title="Edit Consultation"
        >
          <Edit3 className="h-3.5 w-3.5 mr-1" />
          <span>Edit</span>
        </Button>
      </Link>
    </div>
  );
}
