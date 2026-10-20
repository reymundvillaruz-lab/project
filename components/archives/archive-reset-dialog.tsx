"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Archive,
  AlertTriangle,
  FolderDown,
  CheckCircle2,
  Users,
  Stethoscope,
  CalendarClock,
  Pill,
  HeartPulse,
  UserCheck,
  Syringe,
  Sparkles,
} from "lucide-react";
import {
  MONTH_NAMES,
  getActiveWorkspaceCounts,
  archiveAndResetMonth,
  ArchiveMonthFolder,
} from "@/lib/services/archive-service";

interface ArchiveResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (folder: ArchiveMonthFolder) => void;
  defaultMonth?: number;
  defaultYear?: number;
}

export function ArchiveResetDialog({
  open,
  onOpenChange,
  onSuccess,
  defaultMonth,
  defaultYear,
}: ArchiveResetDialogProps) {
  const now = new Date();
  const currentMonthNum = defaultMonth || now.getMonth() + 1;
  const currentYearNum = defaultYear || now.getFullYear();

  const [selectedYear, setSelectedYear] = React.useState<number>(currentYearNum);
  const [selectedMonth, setSelectedMonth] = React.useState<number>(currentMonthNum);
  const [staffName, setStaffName] = React.useState<string>("Barangay Health Center Staff");
  const [notes, setNotes] = React.useState<string>("");
  const [isProcessing, setIsProcessing] = React.useState(false);

  const counts = React.useMemo(() => {
    if (!open) return { patients: 0, consultations: 0, appointments: 0, prescriptions: 0, maternalRecords: 0, familyPlanningRecords: 0, immunizations: 0, totalRecords: 0 };
    return getActiveWorkspaceCounts();
  }, [open]);

  const handleConfirm = () => {
    setIsProcessing(true);
    try {
      const folder = archiveAndResetMonth({
        year: selectedYear,
        month: selectedMonth,
        staffName,
        notes,
      });

      setIsProcessing(false);
      onOpenChange(false);
      if (onSuccess) {
        onSuccess(folder);
      }
    } catch (err) {
      console.error("Archive & reset error:", err);
      setIsProcessing(false);
    }
  };

  const selectedMonthName = MONTH_NAMES[selectedMonth - 1] || "Selected Month";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-teal-100 text-teal-800 border border-teal-200">
              <FolderDown className="h-5 w-5 text-teal-700" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Monthly System Archive &amp; Clean Reset
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Package current active records into a safe monthly folder and prepare a fresh slate.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Safe Assurance Banner */}
          <div className="rounded-lg border border-teal-200 bg-teal-50/70 p-3.5 text-teal-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-teal-800 text-xs">
              <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
              <span>Zero Data Loss Guaranteed</span>
            </div>
            <p className="text-[11px] text-teal-700 leading-relaxed">
              All current records, including <strong>PhilPEN forms, vitals, consultations, and prescriptions</strong>, will be saved into the{" "}
              <strong>{selectedMonthName} {selectedYear}</strong> archive folder. You can browse, search, and export them at any time.
            </p>
          </div>

          {/* Month & Year Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="archiveMonth" className="text-xs font-semibold">
                Target Archive Month
              </Label>
              <Select
                id="archiveMonth"
                value={String(selectedMonth)}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                className="h-9 text-xs"
              >
                {MONTH_NAMES.map((name, index) => (
                  <option key={name} value={String(index + 1)}>
                    {name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="archiveYear" className="text-xs font-semibold">
                Target Archive Year
              </Label>
              <Select
                id="archiveYear"
                value={String(selectedYear)}
                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                className="h-9 text-xs"
              >
                <option value={String(currentYearNum)}>{currentYearNum}</option>
                <option value={String(currentYearNum - 1)}>{currentYearNum - 1}</option>
                <option value={String(currentYearNum + 1)}>{currentYearNum + 1}</option>
              </Select>
            </div>
          </div>

          {/* Active Data to be Archived */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Records Being Bundled into Folder:</span>
              <Badge variant="outline" className="text-[11px] font-mono bg-white">
                {counts.totalRecords} Active Records
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 p-1.5 rounded bg-white border border-slate-200">
                <Users className="h-3.5 w-3.5 text-teal-700" />
                <span className="text-slate-600">Patients:</span>
                <strong className="text-slate-900 ml-auto">{counts.patients}</strong>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 rounded bg-white border border-slate-200">
                <Stethoscope className="h-3.5 w-3.5 text-sky-700" />
                <span className="text-slate-600">Consults:</span>
                <strong className="text-slate-900 ml-auto">{counts.consultations}</strong>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 rounded bg-white border border-slate-200">
                <CalendarClock className="h-3.5 w-3.5 text-indigo-700" />
                <span className="text-slate-600">Appts:</span>
                <strong className="text-slate-900 ml-auto">{counts.appointments}</strong>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 rounded bg-white border border-slate-200">
                <Pill className="h-3.5 w-3.5 text-amber-700" />
                <span className="text-slate-600">Rx/Meds:</span>
                <strong className="text-slate-900 ml-auto">{counts.prescriptions}</strong>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 rounded bg-white border border-slate-200">
                <HeartPulse className="h-3.5 w-3.5 text-rose-700" />
                <span className="text-slate-600">Maternal:</span>
                <strong className="text-slate-900 ml-auto">{counts.maternalRecords}</strong>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 rounded bg-white border border-slate-200">
                <UserCheck className="h-3.5 w-3.5 text-purple-700" />
                <span className="text-slate-600">FP Clients:</span>
                <strong className="text-slate-900 ml-auto">{counts.familyPlanningRecords}</strong>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 rounded bg-white border border-slate-200 sm:col-span-2">
                <Syringe className="h-3.5 w-3.5 text-emerald-700" />
                <span className="text-slate-600">Immunization:</span>
                <strong className="text-slate-900 ml-auto">{counts.immunizations}</strong>
              </div>
            </div>
          </div>

          {/* Staff & Notes */}
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="archiveStaff" className="text-xs">
                Archived By (Health Worker / Administrator)
              </Label>
              <Input
                id="archiveStaff"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                className="h-8.5 text-xs"
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="archiveNotes" className="text-xs">
                Archive Notes / Monthly Remarks (Optional)
              </Label>
              <Input
                id="archiveNotes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-8.5 text-xs"
                placeholder="e.g. End of October Monthly Operations Closing"
              />
            </div>
          </div>

          {/* Reset Warning */}
          <div className="rounded-lg border border-amber-300 bg-amber-50/70 p-3 text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Active Workspace Reset:</strong> Once archived, the active patient and consultation tables will be cleared (0 records) ready for the next month. You can restore this data back to the active workspace at any time from the Archives Explorer.
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleConfirm}
            disabled={isProcessing}
            className="bg-teal-700 hover:bg-teal-800 text-white text-xs gap-1.5 shadow-xs"
          >
            <Archive className="h-3.5 w-3.5" />
            {isProcessing ? "Archiving & Resetting..." : `Archive & Start ${selectedMonthName} Fresh`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
