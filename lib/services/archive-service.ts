"use client";

import { MockPatient, getStoredPatients, saveStoredPatients } from "@/lib/mock-data/patients";
import { MockConsultation, getStoredConsultations, saveStoredConsultations } from "@/lib/mock-data/consultations";
import { Appointment } from "@/types/appointment";
import { getStoredAppointments, saveStoredAppointments } from "@/lib/appointment-utils";
import { MaternalRecord } from "@/types/maternal-care";
import { getInitialMaternalRecords, saveMaternalRecords } from "@/lib/mock-data/maternal-care";
import { FPClient } from "@/types/family-planning";
import { getStoredFPClients, saveStoredFPClients } from "@/lib/family-planning-utils";
import { Prescription } from "@/types/pharmacy";
import { getStoredPharmacyPrescriptions, saveStoredPharmacyPrescriptions } from "@/context/pharmacy-context";
import { NipPatientRecord, getStoredImmunizationRecords, saveStoredImmunizationRecords } from "@/components/immunization/types";

export const ARCHIVE_STORAGE_KEY = "bhcms_monthly_archives_v1";

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export type MonthName = (typeof MONTH_NAMES)[number];

export interface ArchiveRecordCounts {
  patients: number;
  consultations: number;
  appointments: number;
  prescriptions: number;
  maternalRecords: number;
  familyPlanningRecords: number;
  immunizations: number;
  totalRecords: number;
}

export interface ArchiveMonthFolder {
  id: string; // e.g. "ARCH-2026-10"
  folderKey: string; // "2026-10"
  year: number;
  month: number; // 1 to 12
  monthName: MonthName;
  archivedAt: string; // ISO date string
  archivedBy: string;
  notes?: string;
  healthFacilityName: string;
  counts: ArchiveRecordCounts;
  data: {
    patients: MockPatient[];
    consultations: MockConsultation[];
    appointments: Appointment[];
    prescriptions: Prescription[];
    maternalRecords: MaternalRecord[];
    familyPlanningRecords: FPClient[];
    immunizations: NipPatientRecord[];
  };
}

export type MonthlyArchivesMap = Record<string, ArchiveMonthFolder>;

/**
 * Retrieve all monthly archives stored in localStorage
 */
export function getMonthlyArchives(): MonthlyArchivesMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(ARCHIVE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch (err) {
    console.error("Failed to parse monthly archives from localStorage:", err);
    return {};
  }
}

/**
 * Save monthly archives to localStorage and dispatch update event
 */
export function saveMonthlyArchives(archives: MonthlyArchivesMap): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(archives));
    window.dispatchEvent(new CustomEvent("bhcms:archives-updated", { detail: archives }));
  } catch (err) {
    console.error("Failed to save monthly archives to localStorage:", err);
  }
}

/**
 * Get archive for a specific year and month (1-12)
 */
export function getArchiveByFolder(year: number, month: number): ArchiveMonthFolder | null {
  const archives = getMonthlyArchives();
  const folderKey = `${year}-${month.toString().padStart(2, "0")}`;
  return archives[folderKey] || null;
}

/**
 * Inspect the current active workspace counts across all 7 clinical modules
 */
export function getActiveWorkspaceCounts(): ArchiveRecordCounts {
  const patients = getStoredPatients();
  const consultations = getStoredConsultations();
  const appointments = getStoredAppointments();
  const prescriptions = getStoredPharmacyPrescriptions();
  const maternalRecords = getInitialMaternalRecords();
  const familyPlanningRecords = getStoredFPClients();
  const immunizations = getStoredImmunizationRecords();

  const totalRecords =
    patients.length +
    consultations.length +
    appointments.length +
    prescriptions.length +
    maternalRecords.length +
    familyPlanningRecords.length +
    immunizations.length;

  return {
    patients: patients.length,
    consultations: consultations.length,
    appointments: appointments.length,
    prescriptions: prescriptions.length,
    maternalRecords: maternalRecords.length,
    familyPlanningRecords: familyPlanningRecords.length,
    immunizations: immunizations.length,
    totalRecords,
  };
}

/**
 * ARCHIVE AND RESET MONTH:
 * 1. Bundles all active records from every module into a structured month archive folder.
 * 2. Saves the archive folder permanently under `bhcms_monthly_archives_v1`.
 * 3. Resets all active system tables to empty (`[]`) for a clean start in the new month.
 * 4. Dispatches synchronization events across the app.
 */
export function archiveAndResetMonth(options: {
  year: number;
  month: number;
  staffName?: string;
  notes?: string;
  facilityName?: string;
}): ArchiveMonthFolder {
  const { year, month, staffName = "Health Center Staff", notes = "", facilityName = "Barangay Health Center" } = options;

  const monthIndex = month - 1;
  const monthName = MONTH_NAMES[monthIndex] || "January";
  const folderKey = `${year}-${month.toString().padStart(2, "0")}`;
  const archiveId = `ARCH-${folderKey}`;

  // 1. Snapshot all active data
  const patients = getStoredPatients();
  const consultations = getStoredConsultations();
  const appointments = getStoredAppointments();
  const prescriptions = getStoredPharmacyPrescriptions();
  const maternalRecords = getInitialMaternalRecords();
  const familyPlanningRecords = getStoredFPClients();
  const immunizations = getStoredImmunizationRecords();

  const counts: ArchiveRecordCounts = {
    patients: patients.length,
    consultations: consultations.length,
    appointments: appointments.length,
    prescriptions: prescriptions.length,
    maternalRecords: maternalRecords.length,
    familyPlanningRecords: familyPlanningRecords.length,
    immunizations: immunizations.length,
    totalRecords:
      patients.length +
      consultations.length +
      appointments.length +
      prescriptions.length +
      maternalRecords.length +
      familyPlanningRecords.length +
      immunizations.length,
  };

  const newFolder: ArchiveMonthFolder = {
    id: archiveId,
    folderKey,
    year,
    month,
    monthName,
    archivedAt: new Date().toISOString(),
    archivedBy: staffName,
    notes,
    healthFacilityName: facilityName,
    counts,
    data: {
      patients,
      consultations,
      appointments,
      prescriptions,
      maternalRecords,
      familyPlanningRecords,
      immunizations,
    },
  };

  // 2. Persist to monthly archives map (if folder already exists, merge records)
  const currentArchives = getMonthlyArchives();
  const existingFolder = currentArchives[folderKey];

  if (existingFolder) {
    // Merge existing with new if re-archiving
    const mergedPatients = [...existingFolder.data.patients];
    patients.forEach((p) => {
      if (!mergedPatients.some((ep) => ep.id === p.id)) mergedPatients.push(p);
    });

    const mergedConsultations = [...existingFolder.data.consultations];
    consultations.forEach((c) => {
      if (!mergedConsultations.some((ec) => ec.id === c.id)) mergedConsultations.push(c);
    });

    const mergedAppointments = [...existingFolder.data.appointments];
    appointments.forEach((a) => {
      if (!mergedAppointments.some((ea) => ea.id === a.id)) mergedAppointments.push(a);
    });

    const mergedPrescriptions = [...existingFolder.data.prescriptions];
    prescriptions.forEach((rx) => {
      if (!mergedPrescriptions.some((erx) => erx.id === rx.id)) mergedPrescriptions.push(rx);
    });

    const mergedMaternal = [...existingFolder.data.maternalRecords];
    maternalRecords.forEach((m) => {
      if (!mergedMaternal.some((em) => em.id === m.id)) mergedMaternal.push(m);
    });

    const mergedFp = [...existingFolder.data.familyPlanningRecords];
    familyPlanningRecords.forEach((fp) => {
      if (!mergedFp.some((efp) => efp.id === fp.id)) mergedFp.push(fp);
    });

    const mergedImm = [...existingFolder.data.immunizations];
    immunizations.forEach((imm) => {
      if (!mergedImm.some((eimm) => eimm.id === imm.id)) mergedImm.push(imm);
    });

    newFolder.data = {
      patients: mergedPatients,
      consultations: mergedConsultations,
      appointments: mergedAppointments,
      prescriptions: mergedPrescriptions,
      maternalRecords: mergedMaternal,
      familyPlanningRecords: mergedFp,
      immunizations: mergedImm,
    };

    newFolder.counts = {
      patients: mergedPatients.length,
      consultations: mergedConsultations.length,
      appointments: mergedAppointments.length,
      prescriptions: mergedPrescriptions.length,
      maternalRecords: mergedMaternal.length,
      familyPlanningRecords: mergedFp.length,
      immunizations: mergedImm.length,
      totalRecords:
        mergedPatients.length +
        mergedConsultations.length +
        mergedAppointments.length +
        mergedPrescriptions.length +
        mergedMaternal.length +
        mergedFp.length +
        mergedImm.length,
    };
  }

  currentArchives[folderKey] = newFolder;
  saveMonthlyArchives(currentArchives);

  // 3. RESET ALL ACTIVE SYSTEM TABLES TO EMPTY
  saveStoredPatients([]);
  saveStoredConsultations([]);
  saveStoredAppointments([]);
  saveStoredPharmacyPrescriptions([]);
  saveMaternalRecords([]);
  saveStoredFPClients([]);
  saveStoredImmunizationRecords([]);

  // 4. Emit events so all active pages clear immediately
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("bhcms:patients-updated", { detail: [] }));
    window.dispatchEvent(new CustomEvent("bhcms:consultations-updated", { detail: [] }));
    window.dispatchEvent(new CustomEvent("bhcms:appointments-updated", { detail: [] }));
    window.dispatchEvent(new CustomEvent("bhcms:prescriptions-updated", { detail: [] }));
    window.dispatchEvent(new CustomEvent("bhcms:maternal-updated", { detail: [] }));
    window.dispatchEvent(new CustomEvent("bhcms:fp-updated", { detail: [] }));
    window.dispatchEvent(new CustomEvent("bhcms:immunization-updated", { detail: [] }));
  }

  return newFolder;
}

/**
 * RESTORE ARCHIVE TO ACTIVE SYSTEM:
 * Allows health center staff to load a past month's folder back into active tables
 */
export function restoreArchiveToActive(folderKey: string, mode: "replace" | "append" = "replace"): boolean {
  const archives = getMonthlyArchives();
  const folder = archives[folderKey];
  if (!folder) return false;

  if (mode === "replace") {
    saveStoredPatients(folder.data.patients || []);
    saveStoredConsultations(folder.data.consultations || []);
    saveStoredAppointments(folder.data.appointments || []);
    saveStoredPharmacyPrescriptions(folder.data.prescriptions || []);
    saveMaternalRecords(folder.data.maternalRecords || []);
    saveStoredFPClients(folder.data.familyPlanningRecords || []);
    saveStoredImmunizationRecords(folder.data.immunizations || []);
  } else {
    // Append mode
    const currentPatients = getStoredPatients();
    const currentConsultations = getStoredConsultations();
    const currentAppointments = getStoredAppointments();
    const currentPrescriptions = getStoredPharmacyPrescriptions();
    const currentMaternal = getInitialMaternalRecords();
    const currentFp = getStoredFPClients();
    const currentImm = getStoredImmunizationRecords();

    const mergedPatients = [...currentPatients];
    (folder.data.patients || []).forEach((p) => {
      if (!mergedPatients.some((cp) => cp.id === p.id)) mergedPatients.push(p);
    });

    const mergedConsultations = [...currentConsultations];
    (folder.data.consultations || []).forEach((c) => {
      if (!mergedConsultations.some((cc) => cc.id === c.id)) mergedConsultations.push(c);
    });

    const mergedAppointments = [...currentAppointments];
    (folder.data.appointments || []).forEach((a) => {
      if (!mergedAppointments.some((ca) => ca.id === a.id)) mergedAppointments.push(a);
    });

    const mergedPrescriptions = [...currentPrescriptions];
    (folder.data.prescriptions || []).forEach((rx) => {
      if (!mergedPrescriptions.some((crx) => crx.id === rx.id)) mergedPrescriptions.push(rx);
    });

    const mergedMaternal = [...currentMaternal];
    (folder.data.maternalRecords || []).forEach((m) => {
      if (!mergedMaternal.some((cm) => cm.id === m.id)) mergedMaternal.push(m);
    });

    const mergedFp = [...currentFp];
    (folder.data.familyPlanningRecords || []).forEach((fp) => {
      if (!mergedFp.some((cfp) => cfp.id === fp.id)) mergedFp.push(fp);
    });

    const mergedImm = [...currentImm];
    (folder.data.immunizations || []).forEach((imm) => {
      if (!mergedImm.some((cimm) => cimm.id === imm.id)) mergedImm.push(imm);
    });

    saveStoredPatients(mergedPatients);
    saveStoredConsultations(mergedConsultations);
    saveStoredAppointments(mergedAppointments);
    saveStoredPharmacyPrescriptions(mergedPrescriptions);
    saveMaternalRecords(mergedMaternal);
    saveStoredFPClients(mergedFp);
    saveStoredImmunizationRecords(mergedImm);
  }

  return true;
}

/**
 * EXPORT ARCHIVE AS JSON FILE:
 * Downloads the complete month's archive as a formatted JSON file to local computer / USB
 */
export function exportArchiveAsJson(folder: ArchiveMonthFolder): void {
  if (typeof window === "undefined") return;

  const fileName = `BHCMS_Archive_${folder.year}_${folder.monthName}.json`;
  const jsonContent = JSON.stringify(folder, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * EXPORT ALL ARCHIVES AS MASTER BACKUP:
 * Downloads entire archive database as a single file
 */
export function exportAllArchivesMasterBackup(): void {
  if (typeof window === "undefined") return;

  const archives = getMonthlyArchives();
  const fileName = `BHCMS_Master_Archives_Backup_${new Date().toISOString().split("T")[0]}.json`;
  const jsonContent = JSON.stringify(archives, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Delete an archive folder
 */
export function deleteArchiveFolder(folderKey: string): void {
  const archives = getMonthlyArchives();
  if (archives[folderKey]) {
    delete archives[folderKey];
    saveMonthlyArchives(archives);
  }
}
