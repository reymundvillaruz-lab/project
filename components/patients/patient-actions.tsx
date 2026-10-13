"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, Edit3, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MockPatient } from "@/lib/mock-data/patients";

interface PatientActionsProps {
  patient: MockPatient;
}

export function PatientActions({ patient }: PatientActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Link href={`/patients/${patient.id}`}>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs text-teal-700 hover:bg-teal-50 hover:text-teal-900"
          title="View Patient Profile"
        >
          <Eye className="h-3.5 w-3.5 mr-1" />
          <span>View</span>
        </Button>
      </Link>

      <Link href={`/patients/new?edit=${patient.id}`}>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          title="Edit Patient Record"
        >
          <Edit3 className="h-3.5 w-3.5 mr-1" />
          <span>Edit</span>
        </Button>
      </Link>

      <Link href={`/consultations/new?patientId=${patient.id}`}>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs text-sky-700 hover:bg-sky-50 hover:text-sky-900"
          title="Start Consultation"
        >
          <Stethoscope className="h-3.5 w-3.5 mr-1" />
          <span>Consult</span>
        </Button>
      </Link>
    </div>
  );
}
