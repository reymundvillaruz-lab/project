import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { MaternalRecord } from "@/types/maternal-care";
import { sanitizeDate } from "@/lib/utils";

export async function fetchMaternalRecordsFromSupabase(): Promise<MaternalRecord[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from("maternal_records")
      .select("*")
      .order("record_date", { ascending: false });

    if (error) {
      console.warn("Supabase fetchMaternalRecords error:", error.message);
      return null;
    }

    if (!data || data.length === 0) return [];

    return data.map((row) => ({
      id: row.id,
      patientName: row.patient_name,
      dateOfBirth: row.date_of_birth,
      age: row.age,
      address: row.address,
      contactNumber: row.contact_number || "",
      philhealthNo: row.philhealth_no || undefined,
      recordDate: row.record_date,
      gravida: row.gravida,
      para: row.para,
      lmp: row.lmp,
      edc: row.edc,
      gestationalAgeWeeks: row.gestational_age_weeks || undefined,
      tetanusToxoidStatus: row.tetanus_toxoid_status,
      ironFolicAcidSupplementation: row.iron_folic_acid_supplementation || undefined,
      nutritionalStatus: row.nutritional_status || undefined,
      prenatalVisits: row.prenatal_visits || [],
      appointments: row.appointments || [],
      assignedBhw: row.assigned_bhw,
      status: row.status,
      generalNotes: row.general_notes || "",
    }));
  } catch (err) {
    console.error("fetchMaternalRecordsFromSupabase exception:", err);
    return null;
  }
}

export async function saveMaternalRecordToSupabase(record: Partial<MaternalRecord>): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const id = record.id || `MAT-${Date.now()}`;
    const cleanDob = sanitizeDate(record.dateOfBirth, "2000-01-01") as string;
    const cleanRecordDate = sanitizeDate(
      record.recordDate,
      new Date().toISOString().split("T")[0]
    ) as string;
    const cleanLmp = sanitizeDate(
      record.lmp,
      new Date().toISOString().split("T")[0]
    ) as string;
    const cleanEdc = sanitizeDate(
      record.edc,
      new Date().toISOString().split("T")[0]
    ) as string;

    const payload = {
      id,
      patient_name: record.patientName || "Maternal Patient",
      date_of_birth: cleanDob,
      age: record.age || 24,
      address: record.address || "Barangay Health Center",
      contact_number: record.contactNumber || null,
      philhealth_no: record.philhealthNo || null,
      record_date: cleanRecordDate,
      gravida: record.gravida || 1,
      para: record.para || 0,
      lmp: cleanLmp,
      edc: cleanEdc,
      gestational_age_weeks: record.gestationalAgeWeeks || null,
      tetanus_toxoid_status: record.tetanusToxoidStatus || "None",
      iron_folic_acid_supplementation: record.ironFolicAcidSupplementation || null,
      nutritional_status: record.nutritionalStatus || null,
      prenatal_visits: record.prenatalVisits || [],
      appointments: record.appointments || [],
      assigned_bhw: record.assignedBhw || "Assigned BHW",
      status: record.status || "Active",
      general_notes: record.generalNotes || null,
    };

    const { error } = await supabase.from("maternal_records").upsert(payload, { onConflict: "id" });
    if (error) {
      if (error.code === "23503") {
        const { error: retryError } = await supabase
          .from("maternal_records")
          .upsert({ ...payload, patient_id: null }, { onConflict: "id" });
        if (!retryError) return true;
      }
      console.error("Supabase saveMaternalRecord error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("saveMaternalRecordToSupabase exception:", err);
    return false;
  }
}


export async function deleteMaternalRecordFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from("maternal_records").delete().eq("id", id);
    if (error) {
      console.warn("Supabase deleteMaternalRecord error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("deleteMaternalRecordFromSupabase exception:", err);
    return false;
  }
}

