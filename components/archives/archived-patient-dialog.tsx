"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MockPatient } from "@/lib/mock-data/patients";
import { PhilpenAssessmentTab } from "@/components/patients/philpen-assessment-tab";
import { User, HeartPulse, Stethoscope, Clock } from "lucide-react";

interface ArchivedPatientDialogProps {
  patient: MockPatient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderMonthName?: string;
  folderYear?: number;
}

export function ArchivedPatientDialog({
  patient,
  open,
  onOpenChange,
  folderMonthName,
  folderYear,
}: ArchivedPatientDialogProps) {
  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-teal-700 text-white font-bold flex items-center justify-center text-sm">
                {patient.firstName[0]}
                {patient.lastName[0]}
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-900">
                  {patient.fullName}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Patient ID: <span className="font-mono text-slate-700 font-semibold">{patient.id}</span> &bull; {patient.sex}, {patient.age} yrs old
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {folderMonthName && folderYear && (
                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-800 border-amber-200">
                  <Clock className="h-3 w-3 mr-1" />
                  Archived: {folderMonthName} {folderYear}
                </Badge>
              )}
              <Badge
                variant={patient.healthInfo?.philpenStatus === "High Risk" ? "destructive" : "success"}
                className="text-xs"
              >
                {patient.healthInfo?.philpenStatus || "Completed"}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2">
          {/* Complete PhilPEN Risk Assessment Form Viewer */}
          <PhilpenAssessmentTab patient={patient} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
