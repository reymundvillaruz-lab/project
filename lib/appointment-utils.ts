import {
  Appointment,
  AppointmentDashboardStats,
  AppointmentStatus,
} from "@/types/appointment";

export const APPOINTMENTS_STORAGE_KEY = "bhcms_appointments_v1";

export function getStoredAppointments(): Appointment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredAppointments(appointments: Appointment[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
    // Sync latest appointment to Supabase in background
    if (appointments.length > 0) {
      import("@/lib/supabase/services/appointments-service").then(({ saveAppointmentToSupabase }) => {
        appointments.forEach((apt) => {
          saveAppointmentToSupabase(apt).catch((e) =>
            console.warn("Background Supabase appointment sync error:", e)
          );
        });
      });
    }
  } catch (e) {
    console.error("Failed to save appointments to storage", e);
  }
}

export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isDateToday(dateStr: string): boolean {
  return dateStr === getTodayDateString();
}

export function isDateUpcoming(dateStr: string): boolean {
  return dateStr > getTodayDateString();
}

export function isDatePast(dateStr: string): boolean {
  return dateStr < getTodayDateString();
}

export function formatAppointmentDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    if (!year || !month || !day) return dateStr;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function formatAppointmentDateWithDay(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    if (!year || !month || !day) return dateStr;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function formatTime12h(timeStr: string): string {
  if (!timeStr) return "";
  // If already in 12h AM/PM format
  if (timeStr.includes("AM") || timeStr.includes("PM")) {
    return timeStr;
  }
  // If in HH:MM format
  const parts = timeStr.split(":");
  if (parts.length < 2) return timeStr;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  return `${hours}:${minutes} ${ampm}`;
}

export function calculateAppointmentStats(
  appointments: Appointment[]
): AppointmentDashboardStats {
  const todayStr = getTodayDateString();

  let todayCount = 0;
  let upcomingCount = 0;
  let completedCount = 0;
  let pendingConfirmation = 0;
  let cancelledNoShow = 0;

  appointments.forEach((apt) => {
    if (apt.status === "Completed") {
      completedCount++;
    }

    if (apt.status === "Cancelled" || apt.status === "No Show") {
      cancelledNoShow++;
    }

    if (apt.status === "Scheduled") {
      pendingConfirmation++;
    }

    // Active visits today (excluding cancelled)
    if (apt.date === todayStr && apt.status !== "Cancelled") {
      todayCount++;
    }

    // Upcoming future visits (excluding cancelled & completed)
    if (
      apt.date > todayStr &&
      apt.status !== "Cancelled" &&
      apt.status !== "Completed"
    ) {
      upcomingCount++;
    }
  });

  return {
    today: todayCount,
    upcoming: upcomingCount,
    completed: completedCount,
    total: appointments.length,
    pendingConfirmation,
    cancelledNoShow,
  };
}

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function getMonthDaysMatrix(year: number, month: number): CalendarDay[][] {
  const todayStr = getTodayDateString();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = lastDayOfMonth.getDate();

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const matrix: CalendarDay[][] = [];
  let currentWeek: CalendarDay[] = [];

  // Add leading days from previous month
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNumber = prevMonthLastDay - i;
    const prevMonthDate = new Date(year, month - 1, dayNumber);
    const y = prevMonthDate.getFullYear();
    const m = String(prevMonthDate.getMonth() + 1).padStart(2, "0");
    const d = String(dayNumber).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;
    currentWeek.push({
      date: dateStr,
      dayNumber,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
    });
  }

  // Add days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    const dateStr = `${year}-${m}-${d}`;

    currentWeek.push({
      date: dateStr,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
    });

    if (currentWeek.length === 7) {
      matrix.push(currentWeek);
      currentWeek = [];
    }
  }

  // Add trailing days for next month to complete the last week
  if (currentWeek.length > 0) {
    let nextMonthDay = 1;
    while (currentWeek.length < 7) {
      const nextMonthDate = new Date(year, month + 1, nextMonthDay);
      const y = nextMonthDate.getFullYear();
      const m = String(nextMonthDate.getMonth() + 1).padStart(2, "0");
      const d = String(nextMonthDay).padStart(2, "0");
      const dateStr = `${y}-${m}-${d}`;

      currentWeek.push({
        date: dateStr,
        dayNumber: nextMonthDay,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
      });
      nextMonthDay++;
    }
    matrix.push(currentWeek);
  }

  return matrix;
}

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
];

export const PURPOSE_OPTIONS = [
  "General Consultation",
  "Prenatal Checkup",
  "Postnatal Visit",
  "Immunization / Vaccine",
  "Family Planning",
  "Dental Care",
  "Tuberculosis (TB-DOTS)",
  "Non-Communicable Disease (PhilPEN)",
  "Child Growth & Nutrition",
  "Medicine Resupply",
  "Follow-up / Lab Results",
  "Other Health Center Service",
];

export const STANDARD_BHW_OPTIONS = [
  "Municipal Health Officer / Physician",
  "Public Health Nurse, RN",
  "Rural Health Midwife, RM",
  "Barangay Health Worker (BHW) On-Duty",
  "Triage & Clinical Management Station",
];

