import { MaternalRecord } from "@/types/maternal-care";

// Strictly EMPTY - No mock maternal records as requested
export const INITIAL_MOCK_MATERNAL_RECORDS: MaternalRecord[] = [];

const LOCAL_STORAGE_KEY = "bhcms_maternal_care_records_v2";

export function getInitialMaternalRecords(): MaternalRecord[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMaternalRecords(records: MaternalRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error("Failed to save maternal records to storage", e);
  }
}

export function calculateMaternalStats(records: MaternalRecord[]) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  // Active cases: records with status "Active"
  const activeCases = records.filter((r) => r.status === "Active").length;

  // Prenatal visits this month: all visits across records where date is in this month/year
  let visitsThisMonth = 0;
  records.forEach((record) => {
    (record.prenatalVisits || []).forEach((visit) => {
      const visitDate = new Date(visit.visitDate);
      if (
        !isNaN(visitDate.getTime()) &&
        visitDate.getFullYear() === currentYear &&
        visitDate.getMonth() === currentMonth
      ) {
        visitsThisMonth++;
      }
    });
  });

  // Upcoming appointments: status === "Scheduled" and date >= today (or within this month/future)
  let upcomingAppointments = 0;
  const todayStr = now.toISOString().split("T")[0];
  records.forEach((record) => {
    (record.appointments || []).forEach((apt) => {
      if (apt.status === "Scheduled" && apt.appointmentDate >= todayStr) {
        upcomingAppointments++;
      }
    });
  });

  // Follow-ups due: records with status "Follow-up Due"
  const followUpDueRecords = records.filter((r) => r.status === "Follow-up Due").length;

  return {
    activeCases,
    visitsThisMonth,
    upcomingAppointments,
    followUpsDue: followUpDueRecords,
  };
}
