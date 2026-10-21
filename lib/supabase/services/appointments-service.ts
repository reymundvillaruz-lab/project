import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Appointment } from "@/types/appointment";
import { sanitizeDate } from "@/lib/utils";

export async function fetchAppointmentsFromSupabase(): Promise<Appointment[] | null> {
  if (!isSupabaseConfigured) return null;
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
  if (!isSupabaseConfigured) return false;
  try {
    const id = appointment.id || `APT-${Date.now()}`;
    const cleanDate = sanitizeDate(
      appointment.date,
      new Date().toISOString().split("T")[0]
    ) as string;

    const payload = {
      id,
      patient_id: appointment.patientId || null,
      patient_name: appointment.patientName || "Walk-in Patient",
      patient_contact: appointment.patientContact || null,
      date: cleanDate,
      time: appointment.time || "09:00 AM",
      purpose: appointment.purpose || "General Consultation",
      assigned_bhw: appointment.assignedBHW || "Duty Health Worker",
      status: appointment.status || "Scheduled",
      notes: appointment.notes || null,
    };

    const { error } = await supabase.from("appointments").upsert(payload, { onConflict: "id" });

    if (error) {
      // If foreign key constraint on patient_id fails, retry with patient_id = null
      if (error.code === "23503") {
        const { error: retryError } = await supabase
          .from("appointments")
          .upsert({ ...payload, patient_id: null }, { onConflict: "id" });
        if (!retryError) return true;
      }
      console.error("Supabase saveAppointment error:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("saveAppointmentToSupabase exception:", err);
    return false;
  }
}

export async function deleteAppointmentFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (error) {
      console.warn("Supabase deleteAppointment error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("deleteAppointmentFromSupabase exception:", err);
    return false;
  }
}


