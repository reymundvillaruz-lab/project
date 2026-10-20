import * as React from "react";
import {
  Pill,
  Printer,
  CheckCircle2,
  CheckCheck,
  XCircle,
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
import { Prescription, PrescriptionStatus } from "@/types/pharmacy";
import { PrescriptionStatusBadge } from "./prescription-status-badge";
import { PrintablePrescriptionSheet } from "./printable-prescription-sheet";

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-3xl" className="max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="border-b border-slate-100 p-5 pb-3 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700">
                <Pill className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="flex items-center gap-2 text-base">
                  <span>Prescription {prescription.id}</span>
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Official Medical Prescription Record • {prescription.date}
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <PrescriptionStatusBadge status={prescription.status} />
              <Button
                type="button"
                size="sm"
                onClick={handlePrint}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5 h-8 shadow-xs"
              >
                <Printer className="h-3.5 w-3.5" />
                Print Rx
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Prescription Sheet Display */}
        <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-5 space-y-4 bg-slate-50/50">
          <div className="flex justify-center">
            <PrintablePrescriptionSheet
              prescription={prescription}
              showPrintButton={false}
              className="w-full"
            />
          </div>

          {/* Quick Dispensation & Workflow Actions Bar */}
          <div className="rounded-lg border border-slate-200 bg-white p-3.5 space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Dispensation &amp; Pharmacy Actions
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {prescription.status !== "Dispensed" && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateStatus(prescription.id, "Dispensed")}
                  className="h-8 text-xs gap-1.5 border-teal-300 text-teal-800 hover:bg-teal-50"
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
                  className="h-8 text-xs gap-1.5 border-emerald-300 text-emerald-800 hover:bg-emerald-50"
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
                  className="h-8 text-xs gap-1.5 border-rose-300 text-rose-800 hover:bg-rose-50"
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
                  className="h-8 text-xs text-slate-600 hover:text-slate-900"
                >
                  Reset to Active
                </Button>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="px-5 py-3 border-t border-slate-100 bg-slate-50/80 shrink-0 flex items-center justify-between sm:justify-between">
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs shadow-xs gap-1.5"
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
