import { supabase } from "@/lib/supabase/client";
import { MockConsultation } from "@/lib/mock-data/consultations";

export async function fetchConsultationsFromSupabase(): Promise<MockConsultation[] | null> {
  try {
    const { data, error } = await supabase
      .from("consultations")
      .select("*")
      .order("consultation_date", { ascending: false });

    if (error) {
      console.warn("Supabase fetchConsultations error (fallback to local):", error.message);
      return null;
    }

    if (!data || data.length === 0) return [];

    return data.map((row) => ({
      id: row.id,
      patientId: row.patient_id || "",
      patientName: row.patient_name,
      patientAge: row.patient_age || 0,
      patientSex: row.patient_sex || "Male",
      patientContact: row.patient_contact || "",
      date: row.consultation_date,
      visitType: row.visit_type,
      provider: row.provider,
      reasonForVisit: row.reason_for_visit,
      diagnosis: row.diagnosis,
      vitalSigns: row.vital_signs || {
        temperature: "",
        bloodPressureSystolic: "",
        bloodPressureDiastolic: "",
        pulseRate: "",
        respiratoryRate: "",
        weightKg: "",
        heightCm: "",
        bmi: "",
      },
      notes: row.notes || "",
      followUp: {
        required: row.follow_up_required || "No",
        date: row.follow_up_date || undefined,
        instructions: row.follow_up_instructions || undefined,
      },
      status: row.status,
    }));
  } catch (err) {
    console.error("fetchConsultationsFromSupabase exception:", err);
    return null;
  }
}

export async function saveConsultationToSupabase(consultation: Partial<MockConsultation>): Promise<boolean> {
  try {
    const id = consultation.id || `CNS-${Date.now()}`;
    const payload = {
      id,
      patient_id: consultation.patientId || null,
      patient_name: consultation.patientName || "Walk-in Patient",
      patient_age: consultation.patientAge || 0,
      patient_sex: consultation.patientSex || "Male",
      patient_contact: consultation.patientContact || null,
      consultation_date: consultation.date || new Date().toISOString().split("T")[0],
      visit_type: consultation.visitType || "General Consultation",
      provider: consultation.provider || "Barangay Health Worker",
      reason_for_visit: consultation.reasonForVisit || "Routine Examination",
      diagnosis: consultation.diagnosis || "Under Observation",
      vital_signs: consultation.vitalSigns || {},
      notes: consultation.notes || null,
      follow_up_required: consultation.followUp?.required || "No",
      follow_up_date: consultation.followUp?.date || null,
      follow_up_instructions: consultation.followUp?.instructions || null,
      status: consultation.status || "Completed",
    };

    const { error } = await supabase.from("consultations").upsert(payload, { onConflict: "id" });

    if (error) {
      console.error("Supabase saveConsultation error:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("saveConsultationToSupabase exception:", err);
    return false;
  }
}
