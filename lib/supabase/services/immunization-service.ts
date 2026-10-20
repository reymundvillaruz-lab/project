import { supabase } from "@/lib/supabase/client";
import { NipPatientRecord } from "@/components/immunization/types";

export async function fetchImmunizationsFromSupabase(): Promise<NipPatientRecord[] | null> {
  try {
    const { data, error } = await supabase
      .from("immunizations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetchImmunizations error:", error.message);
      return null;
    }

    if (!data || data.length === 0) return [];

    return data.map((row) => ({
      id: row.id,
      patientName: row.patient_name,
      sex: row.sex || "",
      phicNumber: row.phic_number || "",
      birthdate: row.birthdate,
      age: row.age || "",
      nhts: row.nhts || "",
      birthplace: row.birthplace || "",
      motherName: row.mother_name || "",
      fatherName: row.father_name || "",
      familySerialNo: row.family_serial_no || "",
      address: row.address,
      dateRegistered: row.date_registered || "",
      measurementDate: row.measurement_date || "",
      heightCm: row.height_cm || "",
      weightKg: row.weight_kg || "",
      temperatureC: row.temperature_c || "",
      remarks: row.remarks || "",
      vaccines: row.vaccines || {},
      providerName: row.provider_name || "",
      notes: row.notes || "",
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (err) {
    console.error("fetchImmunizationsFromSupabase exception:", err);
    return null;
  }
}

export async function saveImmunizationToSupabase(record: Partial<NipPatientRecord>): Promise<boolean> {
  try {
    const id = record.id || `NIP-${Date.now()}`;
    const payload = {
      id,
      patient_name: record.patientName || "Child Patient",
      sex: record.sex || "",
      phic_number: record.phicNumber || null,
      birthdate: record.birthdate || new Date().toISOString().split("T")[0],
      age: record.age || null,
      nhts: record.nhts || null,
      birthplace: record.birthplace || null,
      mother_name: record.motherName || null,
      father_name: record.fatherName || null,
      family_serial_no: record.familySerialNo || null,
      address: record.address || "Barangay Health Center",
      date_registered: record.dateRegistered || new Date().toISOString().split("T")[0],
      measurement_date: record.measurementDate || null,
      height_cm: record.heightCm || null,
      weight_kg: record.weightKg || null,
      temperature_c: record.temperatureC || null,
      remarks: record.remarks || null,
      vaccines: record.vaccines || {},
      provider_name: record.providerName || "Health Center Staff",
      notes: record.notes || null,
    };

    const { error } = await supabase.from("immunizations").upsert(payload, { onConflict: "id" });
    if (error) {
      console.error("Supabase saveImmunization error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("saveImmunizationToSupabase exception:", err);
    return false;
  }
}
