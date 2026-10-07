"use client";

import * as React from "react";
import { Plus, Syringe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImmunizationStats } from "@/components/immunization/immunization-stats";
import { ImmunizationTable } from "@/components/immunization/immunization-table";
import { NipFormDialog } from "@/components/immunization/nip-form-dialog";
import { NipCardViewDialog } from "@/components/immunization/nip-card-view-dialog";
import { PatientHistoryDialog } from "@/components/immunization/patient-history-dialog";
import {
  NipPatientRecord,
  PatientImmunizationAnalyticsRow,
  PatientImmunizationStatus,
  NIP_VACCINE_LIST,
} from "@/components/immunization/types";

export default function ImmunizationPage() {
  // Pure frontend state for the current session - strictly NO mock or seed data
  const [patientRecords, setPatientRecords] = React.useState<NipPatientRecord[]>([]);

  // Dialog states
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingRecord, setEditingRecord] = React.useState<NipPatientRecord | null>(null);

  const [isViewOpen, setIsViewOpen] = React.useState(false);
  const [viewingRecord, setViewingRecord] = React.useState<NipPatientRecord | null>(null);

  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
  const [historyRecord, setHistoryRecord] = React.useState<NipPatientRecord | null>(null);

  // Derive patient immunization analytics rows (1 row per registered patient)
  const analyticsRows = React.useMemo<PatientImmunizationAnalyticsRow[]>(() => {
    return patientRecords.map((record) => {
      let completedDoses = 0;
      let dueDoses = 0;
      let overdueDoses = 0;

      let lastVaccineGiven: PatientImmunizationAnalyticsRow["lastVaccineGiven"] = null;
      let nextDueVaccine: PatientImmunizationAnalyticsRow["nextDueVaccine"] = null;

      // Scan through NIP_VACCINE_LIST in order
      NIP_VACCINE_LIST.forEach((vaccineConfig) => {
        const entry = record.vaccines?.[vaccineConfig.key];
        const isCompleted =
          entry?.status === "Completed" || Boolean(entry?.dateGiven);

        if (isCompleted) {
          completedDoses++;
          // Track most recent vaccine given
          if (
            !lastVaccineGiven ||
            (entry?.dateGiven &&
              (!lastVaccineGiven.dateGiven ||
                entry.dateGiven >= lastVaccineGiven.dateGiven))
          ) {
            lastVaccineGiven = {
              vaccineName: vaccineConfig.vaccineName,
              dose: vaccineConfig.dose,
              dateGiven: entry?.dateGiven || "Completed",
            };
          }
        } else if (entry?.status === "Overdue") {
          overdueDoses++;
          if (!nextDueVaccine) {
            nextDueVaccine = {
              vaccineName: vaccineConfig.vaccineName,
              dose: vaccineConfig.dose,
              targetSchedule: vaccineConfig.targetSchedule,
              nextDue: entry?.nextDue,
            };
          }
        } else if (entry?.status === "Due") {
          dueDoses++;
          if (!nextDueVaccine) {
            nextDueVaccine = {
              vaccineName: vaccineConfig.vaccineName,
              dose: vaccineConfig.dose,
              targetSchedule: vaccineConfig.targetSchedule,
              nextDue: entry?.nextDue,
            };
          }
        } else {
          // If not completed and no next due selected yet, pick this
          if (!nextDueVaccine) {
            nextDueVaccine = {
              vaccineName: vaccineConfig.vaccineName,
              dose: vaccineConfig.dose,
              targetSchedule: vaccineConfig.targetSchedule,
              nextDue: entry?.nextDue,
            };
          }
        }
      });

      const totalDoses = NIP_VACCINE_LIST.length;
      const completionRate = Math.round((completedDoses / totalDoses) * 100);

      let overallStatus: PatientImmunizationStatus = "Not Started";
      if (completedDoses >= totalDoses) {
        overallStatus = "Fully Immunized";
      } else if (overdueDoses > 0) {
        overallStatus = "Overdue";
      } else if (dueDoses > 0) {
        overallStatus = "Due";
      } else if (completedDoses > 0) {
        overallStatus = "Partially Immunized";
      }

      const measurements =
        record.weightKg || record.heightCm || record.temperatureC
          ? {
              weightKg: record.weightKg,
              heightCm: record.heightCm,
              temperatureC: record.temperatureC,
            }
          : null;

      return {
        id: record.id,
        recordId: record.id,
        patientName: record.patientName,
        sex: record.sex,
        phicNumber: record.phicNumber,
        birthdate: record.birthdate,
        age: record.age,
        address: record.address,
        motherName: record.motherName,
        completedDoses,
        totalDoses,
        completionRate,
        dueDoses,
        overdueDoses,
        overallStatus,
        lastVaccineGiven,
        nextDueVaccine,
        measurements,
        providerName: record.providerName,
        updatedAt: record.updatedAt || record.createdAt,
      };
    });
  }, [patientRecords]);

  // Derive dashboard statistics
  const dashboardStats = React.useMemo(() => {
    let totalImmunizedDoses = 0;
    let dueForImmunization = 0;
    let overdue = 0;
    let completedThisMonth = 0;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    analyticsRows.forEach((row) => {
      totalImmunizedDoses += row.completedDoses;
      dueForImmunization += row.dueDoses;
      overdue += row.overdueDoses;
    });

    patientRecords.forEach((record) => {
      Object.values(record.vaccines || {}).forEach((entry) => {
        if ((entry?.status === "Completed" || entry?.dateGiven) && entry?.dateGiven) {
          const d = new Date(entry.dateGiven);
          if (
            !isNaN(d.getTime()) &&
            d.getFullYear() === currentYear &&
            d.getMonth() === currentMonth
          ) {
            completedThisMonth += 1;
          }
        }
      });
    });

    return {
      totalImmunized: totalImmunizedDoses,
      dueForImmunization,
      overdue,
      completedThisMonth,
    };
  }, [analyticsRows, patientRecords]);

  // Handlers
  const handleOpenNewRecord = () => {
    setEditingRecord(null);
    setIsFormOpen(true);
  };

  const handleSaveRecord = (savedRecord: NipPatientRecord) => {
    setPatientRecords((prev) => {
      const index = prev.findIndex((r) => r.id === savedRecord.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = savedRecord;
        return updated;
      }
      return [savedRecord, ...prev];
    });
  };

  const handleViewRecord = (recordId: string) => {
    const record = patientRecords.find((r) => r.id === recordId);
    if (record) {
      setViewingRecord(record);
      setIsViewOpen(true);
    }
  };

  const handleEditRecord = (recordId: string) => {
    const record = patientRecords.find((r) => r.id === recordId);
    if (record) {
      setEditingRecord(record);
      setIsFormOpen(true);
    }
  };

  const handleViewHistory = (recordId: string) => {
    const record = patientRecords.find((r) => r.id === recordId);
    if (record) {
      setHistoryRecord(record);
      setIsHistoryOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-white shadow-xs">
              <Syringe className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              National Immunization Program (NIP)
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Child immunization registry, vaccination progress analytics, and health growth monitoring based on DOH NIP standards.
          </p>
        </div>

        <Button
          onClick={handleOpenNewRecord}
          size="sm"
          className="bg-teal-700 hover:bg-teal-800 text-white text-xs shadow-xs"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Record Immunization
        </Button>
      </div>

      {/* Dashboard KPI Cards */}
      <ImmunizationStats
        totalImmunized={dashboardStats.totalImmunized}
        dueForImmunization={dashboardStats.dueForImmunization}
        overdue={dashboardStats.overdue}
        completedThisMonth={dashboardStats.completedThisMonth}
      />

      {/* Patient-Level Immunization Analytics Table */}
      <ImmunizationTable
        rows={analyticsRows}
        patientRecords={patientRecords}
        onOpenRecordModal={handleOpenNewRecord}
        onViewRecord={handleViewRecord}
        onEditRecord={handleEditRecord}
        onViewHistory={handleViewHistory}
      />

      {/* Record / Edit Form Dialog (6 Sections NIP Form) */}
      <NipFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialRecord={editingRecord}
        onSave={handleSaveRecord}
      />

      {/* Complete NIP Card View Dialog */}
      <NipCardViewDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        record={viewingRecord}
        onEdit={(rec) => {
          setEditingRecord(rec);
          setIsFormOpen(true);
        }}
        onViewHistory={(rec) => {
          setHistoryRecord(rec);
          setIsHistoryOpen(true);
        }}
      />

      {/* Patient History Timeline Dialog */}
      <PatientHistoryDialog
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        record={historyRecord}
        onEdit={(rec) => {
          setEditingRecord(rec);
          setIsFormOpen(true);
        }}
      />
    </div>
  );
}
