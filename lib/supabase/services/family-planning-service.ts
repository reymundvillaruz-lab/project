import { supabase } from "@/lib/supabase/client";
import { FPServiceRecord, FPFollowUp } from "@/types/family-planning";

export interface FamilyPlanningClientRow {
  id: string;
  clientId?: string;
  clientName: string;
  dateOfBirth?: string;
  age?: number;
  address?: string;
  contactNumber?: string;
  clientType: string;
  method: string;
  registrationDate: string;
  provider: string;
  status: string;
  suppliesGiven?: string;
  serviceRecords: FPServiceRecord[];
  followUps: FPFollowUp[];
  notes?: string;
}

export async function fetchFamilyPlanningFromSupabase(): Promise<FamilyPlanningClientRow[] | null> {
  try {
    const { data, error } = await supabase
      .from("family_planning_records")
      .select("*")
      .order("registration_date", { ascending: false });

    if (error) {
      console.warn("Supabase fetchFamilyPlanning error:", error.message);
      return null;
    }

    if (!data || data.length === 0) return [];

    return data.map((row) => ({
      id: row.id,
      clientId: row.client_id || undefined,
      clientName: row.client_name,
      dateOfBirth: row.date_of_birth || undefined,
      age: row.age || undefined,
      address: row.address || undefined,
      contactNumber: row.contact_number || undefined,
      clientType: row.client_type,
      method: row.method,
      registrationDate: row.registration_date,
      provider: row.provider,
      status: row.status,
      suppliesGiven: row.supplies_given || undefined,
      serviceRecords: row.service_records || [],
      followUps: row.follow_ups || [],
      notes: row.notes || undefined,
    }));
  } catch (err) {
    console.error("fetchFamilyPlanningFromSupabase exception:", err);
    return null;
  }
}

export async function saveFamilyPlanningToSupabase(record: Partial<FamilyPlanningClientRow>): Promise<boolean> {
  try {
    const id = record.id || `FP-${Date.now()}`;
    const payload = {
      id,
      client_id: record.clientId || null,
      client_name: record.clientName || "FP Client",
      date_of_birth: record.dateOfBirth || null,
      age: record.age || null,
      address: record.address || null,
      contact_number: record.contactNumber || null,
      client_type: record.clientType || "New Acceptor",
      method: record.method || "Oral Contraceptive Pills (COC)",
      registration_date: record.registrationDate || new Date().toISOString().split("T")[0],
      provider: record.provider || "Family Planning Midwife",
      status: record.status || "Active User",
      supplies_given: record.suppliesGiven || null,
      service_records: record.serviceRecords || [],
      follow_ups: record.followUps || [],
      notes: record.notes || null,
    };

    const { error } = await supabase.from("family_planning_records").upsert(payload, { onConflict: "id" });
    if (error) {
      console.error("Supabase saveFamilyPlanning error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("saveFamilyPlanningToSupabase exception:", err);
    return false;
  }
}

export async function deleteFPClientFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("family_planning_records").delete().eq("id", id);
    if (error) {
      console.warn("Supabase deleteFPClient error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("deleteFPClientFromSupabase exception:", err);
    return false;
  }
}
