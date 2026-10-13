"use client";

import * as React from "react";
import { Plus, HeartPulse, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MaternalRecord,
  PrenatalVisit,
  MaternalAppointment,
} from "@/types/maternal-care";
import {
  getInitialMaternalRecords,
  saveMaternalRecords,
} from "@/lib/mock-data/maternal-care";
import { MaternalDashboardStats } from "./maternal-dashboard-stats";
import { MaternalPatientList } from "./maternal-patient-list";
import { MaternalRecordDetail } from "./maternal-record-detail";
import { NewMaternalRecordDialog } from "./new-maternal-record-dialog";
import { AddPrenatalVisitDialog } from "./add-prenatal-visit-dialog";
import { ScheduleAppointmentDialog } from "./schedule-appointment-dialog";

export function MaternalCareView() {
  const [records, setRecords] = React.useState<MaternalRecord[]>([]);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Selected Record for Detail View
  const [selectedRecordId, setSelectedRecordId] = React.useState<string | null>(null);
  const [detailInitialTab, setDetailInitialTab] = React.useState("overview");

  // Dialog States
  const [recordDialogOpen, setRecordDialogOpen] = React.useState(false);
  const [recordToEdit, setRecordToEdit] = React.useState<MaternalRecord | null>(null);

  const [visitDialogOpen, setVisitDialogOpen] = React.useState(false);
  const [visitRecordTarget, setVisitRecordTarget] = React.useState<MaternalRecord | null>(null);

  const [appointmentDialogOpen, setAppointmentDialogOpen] = React.useState(false);
  const [appointmentRecordTarget, setAppointmentRecordTarget] = React.useState<MaternalRecord | null>(null);
  const [appointmentToEdit, setAppointmentToEdit] = React.useState<MaternalAppointment | null>(null);

  // User session alert
  const [sessionToast, setSessionToast] = React.useState<string | null>(null);

  // Hydrate on mount
  React.useEffect(() => {
    const initial = getInitialMaternalRecords();
    setRecords(initial);
    setIsHydrated(true);
  }, []);

  const showToast = (message: string) => {
    setSessionToast(message);
    setTimeout(() => {
      setSessionToast(null);
    }, 4000);
  };

  // Get currently selected record object
  const selectedRecord = React.useMemo(() => {
    if (!selectedRecordId) return null;
    return records.find((r) => r.id === selectedRecordId) || null;
  }, [records, selectedRecordId]);

  // Handlers
  const handleOpenNewRecordDialog = () => {
    setRecordToEdit(null);
    setRecordDialogOpen(true);
  };

  const handleOpenEditRecordDialog = (record: MaternalRecord) => {
    setRecordToEdit(record);
    setRecordDialogOpen(true);
  };

  const handleSaveRecord = (savedRecord: MaternalRecord) => {
    setRecords((prev) => {
      const idx = prev.findIndex((r) => r.id === savedRecord.id);
      let nextRecords: MaternalRecord[];
      if (idx >= 0) {
        nextRecords = [...prev];
        nextRecords[idx] = savedRecord;
      } else {
        nextRecords = [savedRecord, ...prev];
      }
      saveMaternalRecords(nextRecords);
      return nextRecords;
    });

    showToast(
      recordToEdit
        ? `Maternal record for ${savedRecord.patientName} (${savedRecord.id}) successfully updated.`
        : `New maternal record for ${savedRecord.patientName} (${savedRecord.id}) successfully enrolled.`
    );
  };

  const handleViewRecord = (record: MaternalRecord) => {
    setSelectedRecordId(record.id);
    setDetailInitialTab("overview");
  };

  const handleViewPrenatalHistory = (record: MaternalRecord) => {
    setSelectedRecordId(record.id);
    setDetailInitialTab("history");
  };

  const handleOpenAddVisitDialog = (record: MaternalRecord) => {
    setVisitRecordTarget(record);
    setVisitDialogOpen(true);
  };

  const handleSaveVisit = (newVisit: PrenatalVisit) => {
    if (!visitRecordTarget) return;

    setRecords((prev) => {
      const nextRecords = prev.map((rec) => {
        if (rec.id === visitRecordTarget.id) {
          const updatedVisits = [newVisit, ...rec.prenatalVisits];
          const sorted = [...updatedVisits].sort((a, b) => b.visitDate.localeCompare(a.visitDate));
          return {
            ...rec,
            prenatalVisits: updatedVisits,
            lastPrenatalVisit: sorted[0]?.visitDate,
          };
        }
        return rec;
      });
      saveMaternalRecords(nextRecords);
      return nextRecords;
    });

    showToast(
      `Prenatal visit recorded on ${newVisit.visitDate} for ${visitRecordTarget.patientName}.`
    );
  };

  const handleOpenScheduleAppointmentDialog = (
    record: MaternalRecord,
    appointment?: MaternalAppointment
  ) => {
    setAppointmentRecordTarget(record);
    setAppointmentToEdit(appointment || null);
    setAppointmentDialogOpen(true);
  };

  const handleSaveAppointment = (appointment: MaternalAppointment) => {
    if (!appointmentRecordTarget) return;

    setRecords((prev) => {
      const nextRecords = prev.map((rec) => {
        if (rec.id === appointmentRecordTarget.id) {
          let updatedAppointments = [...rec.appointments];
          const existIdx = updatedAppointments.findIndex((a) => a.id === appointment.id);
          if (existIdx >= 0) {
            updatedAppointments[existIdx] = appointment;
          } else {
            updatedAppointments = [appointment, ...updatedAppointments];
          }

          const upcoming = updatedAppointments
            .filter((a) => a.status === "Scheduled" || a.status === "Follow-up Due")
            .sort((a, b) => a.appointmentDate.localeCompare(b.appointmentDate));

          return {
            ...rec,
            appointments: updatedAppointments,
            nextAppointmentDate: upcoming[0]?.appointmentDate,
            // If appointment is marked follow-up due, update patient status if active
            status:
              appointment.status === "Follow-up Due" && rec.status === "Active"
                ? "Follow-up Due"
                : rec.status,
          };
        }
        return rec;
      });
      saveMaternalRecords(nextRecords);
      return nextRecords;
    });

    showToast(
      `Appointment/Follow-up on ${appointment.appointmentDate} for ${appointmentRecordTarget.patientName} saved.`
    );
  };

  if (!isHydrated) {
    return (
      <div className="py-12 text-center text-slate-500 text-xs">
        Loading Maternal Care Module...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Notification Banner */}
      {sessionToast && (
        <div className="flex items-center justify-between gap-2 rounded-lg bg-teal-50 border border-teal-200 px-4 py-2.5 text-xs text-teal-900 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-teal-700 shrink-0" />
            <span>{sessionToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSessionToast(null)}
            className="text-xs text-teal-700 hover:text-teal-900 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main View Switcher: Detail View OR Dashboard + List View */}
      {selectedRecord ? (
        <MaternalRecordDetail
          record={selectedRecord}
          initialTab={detailInitialTab}
          onBack={() => setSelectedRecordId(null)}
          onEditRecord={handleOpenEditRecordDialog}
          onAddPrenatalVisit={handleOpenAddVisitDialog}
          onScheduleFollowUp={handleOpenScheduleAppointmentDialog}
        />
      ) : (
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Maternal Care Module
                </h1>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-teal-100 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
                  BNC Form 1-G-a
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Client List for Pregnant Women: prenatal checkups, EDD monitoring, tetanus toxoid, and follow-up tracking.
              </p>
            </div>

            {/* Primary Action Button */}
            <Button
              size="sm"
              onClick={handleOpenNewRecordDialog}
              className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              New Maternal Record
            </Button>
          </div>

          {/* Section 4: Maternal Care Dashboard Summary Cards */}
          <MaternalDashboardStats records={records} />

          {/* Section 5: Maternal Patient List */}
          <MaternalPatientList
            records={records}
            onViewRecord={handleViewRecord}
            onEditRecord={handleOpenEditRecordDialog}
            onViewPrenatalHistory={handleViewPrenatalHistory}
            onNewRecord={handleOpenNewRecordDialog}
          />
        </div>
      )}

      {/* Modals & Dialogs */}
      <NewMaternalRecordDialog
        open={recordDialogOpen}
        onOpenChange={setRecordDialogOpen}
        onSave={handleSaveRecord}
        initialData={recordToEdit}
      />

      <AddPrenatalVisitDialog
        open={visitDialogOpen}
        onOpenChange={setVisitDialogOpen}
        record={visitRecordTarget}
        onAddVisit={handleSaveVisit}
      />

      <ScheduleAppointmentDialog
        open={appointmentDialogOpen}
        onOpenChange={setAppointmentDialogOpen}
        record={appointmentRecordTarget}
        appointmentToEdit={appointmentToEdit}
        onSaveAppointment={handleSaveAppointment}
      />
    </div>
  );
}
