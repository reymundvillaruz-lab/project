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
import {
  NIP_VACCINE_LIST,
  NipPatientRecord,
} from "./types";
import { ImmunizationStatusBadge } from "./status-badge";
import {
  FileText,
  Edit,
  History,
  Calendar,
  User,
  Home,
  Activity,
  UserCheck,
} from "lucide-react";

interface NipCardViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: NipPatientRecord | null;
  onEdit: (record: NipPatientRecord) => void;
  onViewHistory: (record: NipPatientRecord) => void;
}

export function NipCardViewDialog({
  open,
  onOpenChange,
  record,
  onEdit,
  onViewHistory,
}: NipCardViewDialogProps) {
  if (!record) return null;

  // Count summary
  const vaccineEntries = Object.entries(record.vaccines || {});
  const completedCount = vaccineEntries.filter(([, v]) => v.status === "Completed").length;
  const dueCount = vaccineEntries.filter(([, v]) => v.status === "Due").length;
  const overdueCount = vaccineEntries.filter(([, v]) => v.status === "Overdue").length;
  const scheduledCount = vaccineEntries.filter(([, v]) => v.status === "Scheduled").length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-4xl" className="h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-slate-200 bg-slate-50/75">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700 text-white">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900">
                  National Immunization Program (NIP) Form
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Child Immunization &amp; Health Record • DOH Reference Form
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300">
                {completedCount} Completed
              </Badge>
              {dueCount > 0 && (
                <Badge className="bg-amber-50 text-amber-800 border-amber-300">
                  {dueCount} Due
                </Badge>
              )}
              {overdueCount > 0 && (
                <Badge className="bg-rose-50 text-rose-800 border-rose-300">
                  {overdueCount} Overdue
                </Badge>
              )}
              {scheduledCount > 0 && (
                <Badge className="bg-sky-50 text-sky-800 border-sky-300">
                  {scheduledCount} Scheduled
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
          {/* Section 1 & 2: Personal & Family Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SECTION 1 */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
                <User className="h-4 w-4 text-teal-700" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Section 1: Personal Information
                </h4>
              </div>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                <div className="col-span-2">
                  <dt className="text-slate-400 font-medium">Patient Name:</dt>
                  <dd className="font-bold text-slate-900 text-sm">{record.patientName || "—"}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Sex:</dt>
                  <dd className="font-semibold text-slate-800">{record.sex || "—"}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">PHIC #:</dt>
                  <dd className="font-mono text-slate-800">{record.phicNumber || "—"}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Birthdate:</dt>
                  <dd className="text-slate-800">{record.birthdate || "—"}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Age:</dt>
                  <dd className="text-slate-800">{record.age || "—"}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">NHTS Member:</dt>
                  <dd className="text-slate-800">{record.nhts || "—"}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Birthplace:</dt>
                  <dd className="text-slate-800">{record.birthplace || "—"}</dd>
                </div>
              </dl>
            </div>

            {/* SECTION 2 & 3 */}
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
                  <Home className="h-4 w-4 text-teal-700" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Section 2: Family Information
                  </h4>
                </div>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                  <div>
                    <dt className="text-slate-400 font-medium">Mother:</dt>
                    <dd className="font-medium text-slate-800">{record.motherName || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400 font-medium">Father:</dt>
                    <dd className="font-medium text-slate-800">{record.fatherName || "—"}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-slate-400 font-medium">Family Serial #:</dt>
                    <dd className="font-mono text-slate-800">{record.familySerialNo || "—"}</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
                  <Home className="h-4 w-4 text-teal-700" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Section 3: Address &amp; Registration
                  </h4>
                </div>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                  <div className="col-span-2">
                    <dt className="text-slate-400 font-medium">Address:</dt>
                    <dd className="font-medium text-slate-800">{record.address || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400 font-medium">Date Registered:</dt>
                    <dd className="text-slate-800">{record.dateRegistered || "—"}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* SECTION 4: Health Measurements */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
              <Activity className="h-4 w-4 text-teal-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Section 4: Health Measurements
              </h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Measurement Date</span>
                <span className="font-semibold text-slate-800">{record.measurementDate || "—"}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Height / Length</span>
                <span className="font-semibold text-slate-800">
                  {record.heightCm ? `${record.heightCm} cm` : "—"}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Weight</span>
                <span className="font-semibold text-slate-800">
                  {record.weightKg ? `${record.weightKg} kg` : "—"}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Temperature</span>
                <span className="font-semibold text-slate-800">
                  {record.temperatureC ? `${record.temperatureC} °C` : "—"}
                </span>
              </div>
            </div>
            {record.remarks && (
              <div className="mt-3 text-xs bg-slate-50 p-2.5 rounded border border-slate-100">
                <span className="text-slate-400 font-medium block text-[11px]">Remarks:</span>
                <p className="text-slate-700 mt-0.5">{record.remarks}</p>
              </div>
            )}
          </div>

          {/* SECTION 5: Immunization Record Grid */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-teal-700" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Section 5: Immunization Record Grid
                </h4>
              </div>
              <span className="text-xs text-slate-500">All 16 NIP Antigens</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[650px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Vaccine</th>
                    <th className="py-2.5 px-2">Dose</th>
                    <th className="py-2.5 px-2">Schedule</th>
                    <th className="py-2.5 px-3">Date Given</th>
                    <th className="py-2.5 px-3">Next Due</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {NIP_VACCINE_LIST.map((item) => {
                    const entry = record.vaccines?.[item.key];
                    const hasStatus = Boolean(entry?.status);
                    const hasDate = Boolean(entry?.dateGiven);

                    return (
                      <tr
                        key={item.key}
                        className={
                          hasStatus || hasDate ? "bg-teal-50/20" : "hover:bg-slate-50/40"
                        }
                      >
                        <td className="py-2 px-3 font-semibold text-slate-900">
                          {item.vaccineName}
                        </td>
                        <td className="py-2 px-2">
                          <Badge variant="outline" className="text-[11px] font-normal">
                            {item.dose}
                          </Badge>
                        </td>
                        <td className="py-2 px-2 text-slate-500">{item.targetSchedule}</td>
                        <td className="py-2 px-3 font-mono text-slate-800">
                          {entry?.dateGiven || "—"}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-800">
                          {entry?.nextDue || "—"}
                        </td>
                        <td className="py-2 px-3">
                          {entry?.status ? (
                            <ImmunizationStatusBadge status={entry.status} />
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 6: Provider Information */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
              <UserCheck className="h-4 w-4 text-teal-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Section 6: Provider Information
              </h4>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <dt className="text-slate-400 font-medium">Provider / BHW:</dt>
                <dd className="font-semibold text-slate-900 mt-0.5">
                  {record.providerName || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400 font-medium">Notes:</dt>
                <dd className="text-slate-700 mt-0.5">{record.notes || "—"}</dd>
              </div>
            </dl>
          </div>
        </div>

        <DialogFooter className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onOpenChange(false);
              onViewHistory(record);
            }}
            className="text-xs"
          >
            <History className="h-3.5 w-3.5 mr-1 text-teal-700" />
            View History Timeline
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onEdit(record);
              }}
              className="bg-teal-700 hover:bg-teal-800 text-white"
            >
              <Edit className="h-3.5 w-3.5 mr-1" />
              Edit Record
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
