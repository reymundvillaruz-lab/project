import { supabase } from "@/lib/supabase/client";
import { Medicine, Prescription } from "@/types/pharmacy";

export async function fetchMedicinesFromSupabase(): Promise<Medicine[] | null> {
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
  try {
    const id = medicine.id || `MED-${Date.now()}`;
    const payload = {
      id,
      name: medicine.name || "Unnamed Medicine",
      brand_name: medicine.brandName || null,
      category: medicine.category || "General Supplies",
      available_quantity: medicine.availableQuantity || 0,
      unit: medicine.unit || "Tablets",
      expiration_date: medicine.expirationDate || new Date().toISOString().split("T")[0],
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
