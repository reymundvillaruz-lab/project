import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Medicine, Prescription } from "@/types/pharmacy";
import { sanitizeDate } from "@/lib/utils";

export async function fetchMedicinesFromSupabase(): Promise<Medicine[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from("medicines")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.warn("Supabase fetchMedicines error:", error.message);
      return null;
    }

    if (!data || data.length === 0) return [];

    return data.map((row) => ({
      id: row.id,
      name: row.name,
      brandName: row.brand_name || undefined,
      category: row.category,
      availableQuantity: row.available_quantity,
      unit: row.unit,
      expirationDate: row.expiration_date,
      status: row.status,
      reorderLevel: row.reorder_level,
      dosageForm: row.dosage_form || undefined,
      batchNumber: row.batch_number || undefined,
      manufacturer: row.manufacturer || undefined,
      storageLocation: row.storage_location || undefined,
      notes: row.notes || undefined,
      stockHistory: row.stock_history || [],
    }));
  } catch (err) {
    console.error("fetchMedicinesFromSupabase exception:", err);
    return null;
  }
}

export async function saveMedicineToSupabase(medicine: Partial<Medicine>): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const id = medicine.id || `MED-${Date.now()}`;
    const cleanExpirationDate = sanitizeDate(
      medicine.expirationDate,
      new Date().toISOString().split("T")[0]
    ) as string;

    const payload = {
      id,
      name: medicine.name || "Unnamed Medicine",
      brand_name: medicine.brandName || null,
      category: medicine.category || "General Supplies",
      available_quantity: medicine.availableQuantity || 0,
      unit: medicine.unit || "Tablets",
      expiration_date: cleanExpirationDate,
      status: medicine.status || "Available",
      reorder_level: medicine.reorderLevel || 20,
      dosage_form: medicine.dosageForm || null,
      batch_number: medicine.batchNumber || null,
      manufacturer: medicine.manufacturer || null,
      storage_location: medicine.storageLocation || null,
      notes: medicine.notes || null,
      stock_history: medicine.stockHistory || [],
    };

    const { error } = await supabase.from("medicines").upsert(payload, { onConflict: "id" });
    if (error) {
      console.error("Supabase saveMedicine error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("saveMedicineToSupabase exception:", err);
    return false;
  }
}

export async function fetchPrescriptionsFromSupabase(): Promise<Prescription[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from("prescriptions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetchPrescriptions error:", error.message);
      return null;
    }

    if (!data || data.length === 0) return [];

    return data.map((row) => ({
      id: row.id,
      patientName: row.patient_name,
      patientId: row.patient_id || undefined,
      patientContact: row.patient_contact || undefined,
      date: row.date,
      prescriber: row.prescriber,
      medicine: row.medicine,
      medicineId: row.medicine_id || undefined,
      dosage: row.dosage,
      frequency: row.frequency,
      duration: row.duration,
      quantityToDispense: row.quantity_to_dispense || undefined,
      status: row.status,
      notes: row.notes || undefined,
      dispensedDate: row.dispensed_date || undefined,
      dispensedBy: row.dispensed_by || undefined,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error("fetchPrescriptionsFromSupabase exception:", err);
    return null;
  }
}

export async function savePrescriptionToSupabase(prescription: Partial<Prescription>): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const id = prescription.id || `RX-${Date.now()}`;
    const cleanDate = sanitizeDate(
      prescription.date,
      new Date().toISOString().split("T")[0]
    ) as string;
    const cleanDispensedDate = sanitizeDate(prescription.dispensedDate);

    const payload = {
      id,
      patient_id: prescription.patientId || null,
      patient_name: prescription.patientName || "Prescription Patient",
      patient_contact: prescription.patientContact || null,
      date: cleanDate,
      prescriber: prescription.prescriber || "Duty Physician",
      medicine: prescription.medicine || "Unspecified Medicine",
      medicine_id: prescription.medicineId || null,
      dosage: prescription.dosage || "1 tablet",
      frequency: prescription.frequency || "Once daily",
      duration: prescription.duration || "7 days",
      quantity_to_dispense: prescription.quantityToDispense || null,
      status: prescription.status || "Active",
      notes: prescription.notes || null,
      dispensed_date: cleanDispensedDate,
      dispensed_by: prescription.dispensedBy || null,
    };

    const { error } = await supabase.from("prescriptions").upsert(payload, { onConflict: "id" });

    if (error) {
      if (error.code === "23503") {
        const { error: retryErr } = await supabase
          .from("prescriptions")
          .upsert({ ...payload, patient_id: null, medicine_id: null }, { onConflict: "id" });
        if (!retryErr) return true;
      }
      console.error("Supabase savePrescription error:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("savePrescriptionToSupabase exception:", err);
    return false;
  }
}


