import * as React from "react";
import {
  Pill,
  User,
  Calendar,
  Stethoscope,
  Clock,
  CheckCircle2,
  CheckCheck,
  XCircle,
  FileText,
  Trash2,
  Edit3,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Prescription, PrescriptionStatus } from "@/types/pharmacy";
import { PrescriptionStatusBadge } from "./prescription-status-badge";

interface PrescriptionDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prescription: Prescription | null;
  onUpdateStatus: (prescriptionId: string, status: PrescriptionStatus) => void;
  onEdit: (prescription: Prescription) => void;
  onDelete: (prescriptionId: string) => void;
}

export function PrescriptionDetailDialog({
  open,
  onOpenChange,
  prescription,
  onUpdateStatus,
  onEdit,
  onDelete,
}: PrescriptionDetailDialogProps) {
  if (!prescription) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-lg">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 border border-teal-200 text-teal-700">
                <Pill className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <span>Prescription {prescription.id}</span>
                </DialogTitle>
                <DialogDescription>
                  Issued on {prescription.date} by {prescription.prescriber}
                </DialogDescription>
              </div>
            </div>
            <PrescriptionStatusBadge status={prescription.status} />
          </div>
        </DialogHeader>

        <div className="px-5 py-4 space-y-4 text-xs">
          {/* Patient Header Card */}
          <div className="rounded-lg border border-teal-200 bg-teal-50/60 p-3.5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-800">
                Patient
              </span>
              <p className="text-base font-bold text-slate-900">
                {prescription.patientName}
              </p>
              <p className="text-[11px] text-slate-600 font-mono">
                {prescription.patientId || "No patient ID"}
                {prescription.patientContact ? ` • ${prescription.patientContact}` : ""}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-teal-800 font-semibold block">Date Issued</span>
              <p className="font-mono font-medium text-slate-900 text-xs">{prescription.date}</p>
            </div>
          </div>

          {/* Rx Medication Order Card */}
          <div className="rounded-lg border border-slate-200 bg-white p-3.5 space-y-3">
            <div className="border-b border-slate-100 pb-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Prescribed Drug &amp; Formulation
              </span>
              <p className="text-sm font-bold text-teal-900 mt-0.5">
                {prescription.medicine}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 py-1">
              <div>
                <span className="text-slate-500 block text-[11px]">Dosage</span>
                <span className="font-semibold text-slate-900">{prescription.dosage}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Duration</span>
                <span className="font-semibold text-slate-900">{prescription.duration}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Dispense Quantity</span>
                <span className="font-semibold text-slate-900">
                  {prescription.quantityToDispense ? `${prescription.quantityToDispense} units` : "As directed"}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-500 block text-[11px]">Frequency &amp; Schedule</span>
              <p className="font-semibold text-slate-800 bg-slate-50 p-2 rounded border border-slate-100 mt-0.5">
                {prescription.frequency}
              </p>
            </div>
          </div>

          {/* Clinical Instructions / Notes */}
          <div className="space-y-1">
            <span className="text-slate-500 font-semibold flex items-center gap-1.5 text-[11px]">
              <FileText className="h-3.5 w-3.5 text-slate-400" />
              Special Instructions &amp; Warnings
            </span>
            <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 text-slate-700 min-h-[50px] whitespace-pre-wrap">
              {prescription.notes || (
                <span className="text-slate-400 italic">
                  No special precautions or dietary instructions noted.
                </span>
              )}
            </div>
          </div>

          {/* Quick Status Update Actions */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
              Dispensation &amp; Workflow Actions
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {prescription.status !== "Dispensed" && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateStatus(prescription.id, "Dispensed")}
                  className="h-7 text-xs gap-1 border-teal-300 text-teal-800 hover:bg-teal-50"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                  Mark as Dispensed
                </Button>
              )}

              {prescription.status !== "Completed" && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateStatus(prescription.id, "Completed")}
                  className="h-7 text-xs gap-1 border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                >
                  <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Mark as Completed
                </Button>
              )}

              {prescription.status !== "Cancelled" && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateStatus(prescription.id, "Cancelled")}
                  className="h-7 text-xs gap-1 border-rose-300 text-rose-800 hover:bg-rose-50"
                >
                  <XCircle className="h-3.5 w-3.5 text-rose-600" />
                  Cancel Prescription
                </Button>
              )}

              {prescription.status !== "Active" && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => onUpdateStatus(prescription.id, "Active")}
                  className="h-7 text-xs text-slate-500 hover:text-slate-800"
                >
                  Reset to Active
                </Button>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="px-5 py-3 border-t border-slate-100 flex items-center justify-between sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onDelete(prescription.id);
              onOpenChange(false);
            }}
            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Record
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Close
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onEdit(prescription);
              }}
              className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs gap-1.5"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit Prescription
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
