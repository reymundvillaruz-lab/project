import { supabase } from "@/lib/supabase/client";
import { Appointment } from "@/types/appointment";

export async function fetchAppointmentsFromSupabase(): Promise<Appointment[] | null> {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.warn("Supabase fetchAppointments error (fallback to local):", error.message);
      return null;
    }

    if (!data || data.length === 0) return [];

    return data.map((row) => ({
      id: row.id,
      patientId: row.patient_id || undefined,
      patientName: row.patient_name,
      patientContact: row.patient_contact || undefined,
      date: row.date,
      time: row.time,
      purpose: row.purpose,
      assignedBHW: row.assigned_bhw,
      status: row.status,
      notes: row.notes || undefined,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error("fetchAppointmentsFromSupabase exception:", err);
    return null;
  }
}

export async function saveAppointmentToSupabase(appointment: Partial<Appointment>): Promise<boolean> {
  try {
    const id = appointment.id || `APT-${Date.now()}`;
    const payload = {
      id,
      patient_id: appointment.patientId || null,
      patient_name: appointment.patientName || "Walk-in Patient",
      patient_contact: appointment.patientContact || null,
      date: appointment.date || new Date().toISOString().split("T")[0],
      time: appointment.time || "09:00 AM",
      purpose: appointment.purpose || "General Consultation",
      assigned_bhw: appointment.assignedBHW || "Duty Health Worker",
      status: appointment.status || "Scheduled",
      notes: appointment.notes || null,
    };

    const { error } = await supabase.from("appointments").upsert(payload, { onConflict: "id" });

    if (error) {
      console.error("Supabase saveAppointment error:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("saveAppointmentToSupabase exception:", err);
    return false;
  }
}
