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
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  NIP_VACCINE_LIST,
  NipPatientRecord,
} from "./types";
import { ImmunizationStatusBadge } from "./status-badge";
import {
  History,
  Calendar,
  Syringe,
  User,
  MapPin,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface PatientHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: NipPatientRecord | null;
  onEdit?: (record: NipPatientRecord) => void;
}

export function PatientHistoryDialog({
  open,
  onOpenChange,
  record,
  onEdit,
}: PatientHistoryDialogProps) {
  if (!record) return null;

  // Extract recorded vaccinations for timeline
  const timelineItems = NIP_VACCINE_LIST.map((vConfig) => {
    const entry = record.vaccines?.[vConfig.key];
    if (!entry || (!entry.dateGiven && !entry.nextDue && !entry.status)) {
      return null;
    }
    return {
      config: vConfig,
      entry,
    };
  }).filter(Boolean) as {
    config: (typeof NIP_VACCINE_LIST)[number];
    entry: { dateGiven: string; nextDue: string; status: any };
  }[];

  // Sort timeline items: items with dateGiven sorted chronologically, then by target schedule
  timelineItems.sort((a, b) => {
    if (a.entry.dateGiven && b.entry.dateGiven) {
      return new Date(a.entry.dateGiven).getTime() - new Date(b.entry.dateGiven).getTime();
    }
    if (a.entry.dateGiven) return -1;
    if (b.entry.dateGiven) return 1;
    return 0;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-2xl" className="h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-slate-200 bg-slate-50/75">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700 text-white">
              <History className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-slate-900">
                Patient Immunization History
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Vaccination timeline and administration audit
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Patient Overview Card */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <User className="h-4 w-4 text-teal-700" />
                  {record.patientName}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-1 flex-wrap">
                  {record.age && <span>Age: <strong className="text-slate-800">{record.age}</strong></span>}
                  {record.birthdate && (
                    <>
                      <span>•</span>
                      <span>Born: <strong className="text-slate-800">{record.birthdate}</strong></span>
                    </>
                  )}
                  {record.sex && (
                    <>
                      <span>•</span>
                      <span>Sex: <strong className="text-slate-800">{record.sex}</strong></span>
                    </>
                  )}
                </div>
              </div>
              {record.phicNumber && (
                <Badge variant="outline" className="font-mono text-xs">
                  PHIC: {record.phicNumber}
                </Badge>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-start gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  Address: <strong className="text-slate-800">{record.address || "Not specified"}</strong>
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  Provider/BHW: <strong className="text-slate-800">{record.providerName || "Not assigned"}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Vaccination Timeline ({timelineItems.length} Records)
              </h4>
              <span className="text-[11px] text-slate-400">
                National Immunization Program (NIP)
              </span>
            </div>

            {timelineItems.length === 0 ? (
              <EmptyState
                icon={Syringe}
                title="No immunization history available."
                description="This patient does not have any recorded vaccination doses or schedule entries yet."
              />
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {timelineItems.map((item, idx) => {
                  const isCompleted = item.entry.status === "Completed";
                  const isOverdue = item.entry.status === "Overdue";
                  const isDue = item.entry.status === "Due";

                  return (
                    <div key={item.config.key} className="relative group">
                      {/* Timeline dot */}
                      <div
                        className={`absolute -left-6 top-1.5 h-3.5 w-3.5 rounded-full border-2 bg-white transition-transform group-hover:scale-125 ${
                          isCompleted
                            ? "border-emerald-600 bg-emerald-500"
                            : isOverdue
                            ? "border-rose-600 bg-rose-500"
                            : isDue
                            ? "border-amber-500 bg-amber-400"
                            : "border-sky-500 bg-sky-400"
                        }`}
                      />

                      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs hover:border-slate-300 transition-colors">
                        <div className="flex items-start justify-between flex-wrap gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900">
                                {item.config.vaccineName}
                              </span>
                              <Badge variant="outline" className="text-[11px]">
                                Dose: {item.config.dose}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {item.config.description}
                            </p>
                          </div>
                          {item.entry.status && (
                            <ImmunizationStatusBadge status={item.entry.status} />
                          )}
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-slate-400 block text-[11px]">Target Schedule</span>
                            <span className="text-slate-700 font-medium">
                              {item.config.targetSchedule}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Date Given</span>
                            <span className="text-slate-900 font-mono font-medium">
                              {item.entry.dateGiven || "—"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Next Due Date</span>
                            <span className="text-slate-900 font-mono font-medium">
                              {item.entry.nextDue || "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          {onEdit && (
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onEdit(record);
              }}
              className="bg-teal-700 hover:bg-teal-800 text-white"
            >
              Edit Patient Records
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
