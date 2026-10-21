import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { MockPatient } from "@/lib/mock-data/patients";

const VALID_GENDERS = ["Male", "Female", "Other"] as const;
const VALID_CIVIL_STATUSES = [
  "Single",
  "Married",
  "Widowed",
  "Separated",
  "Solo Parent",
  "Cohabiting",
] as const;
const VALID_STATUSES = ["Active", "Inactive", "Follow-up Needed"] as const;

/**
 * Sanitizes date string to YYYY-MM-DD or returns fallback / null
 * Prevents PostgreSQL date parse error on empty string `""`
 */
function sanitizeDate(d?: string | null, fallback?: string): string | null {
  if (!d || typeof d !== "string" || !d.trim()) {
    return fallback || null;
  }
  const clean = d.trim().split("T")[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    return clean;
  }
  const parsed = new Date(d);
  if (isNaN(parsed.getTime())) {
    return fallback || null;
  }
  return parsed.toISOString().split("T")[0];
}

/**
 * Transforms a raw Supabase database row from `public.patients` into a `MockPatient` domain object.
 */
export function mapRowToPatient(row: any): MockPatient {
  const streetPart = row.purok_or_street ? `${row.purok_or_street}, ` : "";
  const brgyPart = row.barangay || "";
  const cityPart = row.city_or_municipality ? `, ${row.city_or_municipality}` : "";
  const formattedAddress = row.address || `${streetPart}${brgyPart}${cityPart}`.trim();

  const fullName = `${row.first_name || ""} ${row.middle_name ? row.middle_name + " " : ""}${row.last_name || ""}${row.suffix ? " " + row.suffix : ""}`.trim();

  return {
    id: row.id,
    patientIdNumber: row.patient_id_number || row.id,
    firstName: row.first_name || "",
    middleName: row.middle_name || "",
    lastName: row.last_name || "",
    suffix: row.suffix || "",
    fullName: fullName || "Unnamed Patient",
    sex: row.gender === "Male" ? "Male" : "Female",
    age: row.age ?? 0,
    birthdate: row.date_of_birth ? String(row.date_of_birth).split("T")[0] : "",
    barangay: row.barangay || "Barangay Central",
    address: formattedAddress || "Barangay Central",
    purokOrStreet: row.purok_or_street || "",
    cityOrMunicipality: row.city_or_municipality || "City of Care",
    province: row.province || "Province of Health",
    postalCode: row.postal_code || "",
    contact: row.contact_number || "",
    lastVisit: row.last_visit_date
      ? String(row.last_visit_date).split("T")[0]
      : row.registered_date
      ? String(row.registered_date).split("T")[0]
      : "",
    registeredDate: row.registered_date ? String(row.registered_date).split("T")[0] : "",
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || "",
    status: (row.status as MockPatient["status"]) || "Active",
    phicNo: row.philhealth_number || "",
    civilStatus: row.civil_status || "Single",
    religion: row.religion || "",
    bloodType: row.blood_type || row.health_info?.bloodType || "",
    pwdId: row.pwd_id_no || "",
    employmentStatus: row.employment_status || "",
    isIp: row.is_ip || "Non-IP",
    ethnicity: row.ethnicity || "",
    isNhtsBeneficiary: Boolean(row.is_nhts_beneficiary),
    isSeniorCitizen: Boolean(row.is_senior_citizen),
    isPwd: Boolean(row.is_pwd),
    emergencyContact: {
      name: row.emergency_contact_name || "",
      relationship: row.emergency_contact_relationship || "",
      contact: row.emergency_contact_number || "",
    },
    healthInfo: {
      bloodType: row.blood_type || row.health_info?.bloodType || "Unassigned",
      allergies: Array.isArray(row.health_info?.allergies) ? row.health_info.allergies : [],
      chronicConditions: Array.isArray(row.health_info?.chronicConditions)
        ? row.health_info.chronicConditions
        : [],
      philpenStatus: row.health_info?.philpenStatus || "Pending",
      lastBp: row.health_info?.lastBp || "120/80",
      lastBmi: row.health_info?.lastBmi || "22.5",
    },
    consultations: [],
    immunizations: [],
    appointments: [],
    prescriptions: [],
    philpenRecord: row.health_info?.philpenRecord || undefined,
  };
}

/**
 * Transforms a MockPatient object or partial update into a database payload matching `public.patients`.
 * Strictly sanitizes all fields to adhere to Postgres NOT NULL, CHECK, and UNIQUE constraints.
 */
export function mapPatientToRow(patient: Partial<MockPatient>, isNew: boolean = false) {
  const payload: Record<string, any> = {};

  if (patient.id) payload.id = patient.id;

  // 1. Patient ID Number (TEXT UNIQUE NOT NULL)
  if (patient.patientIdNumber && patient.patientIdNumber.trim()) {
    payload.patient_id_number = patient.patientIdNumber.trim();
  } else if (isNew) {
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    payload.patient_id_number = `BHC-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}-${randomHex}`;
  }

  // 2. Names (first_name, last_name: NOT NULL)
  if (patient.firstName !== undefined || isNew) {
    payload.first_name = (patient.firstName || "").trim() || "Resident";
  }
  if (patient.middleName !== undefined) {
    payload.middle_name = (patient.middleName || "").trim() || null;
  }
  if (patient.lastName !== undefined || isNew) {
    payload.last_name = (patient.lastName || "").trim() || "Patient";
  }
  if (patient.suffix !== undefined) {
    payload.suffix = (patient.suffix || "").trim() || null;
  }

  // 3. Date of Birth (date_of_birth: DATE NOT NULL)
  if (patient.birthdate !== undefined || isNew) {
    let fallbackDate = "2000-01-01";
    if (patient.age && typeof patient.age === "number" && patient.age > 0) {
      const birthYear = new Date().getFullYear() - patient.age;
      fallbackDate = `${birthYear}-01-01`;
    }
    payload.date_of_birth = sanitizeDate(patient.birthdate, fallbackDate);
  }

  // 4. Age (INTEGER NULLABLE)
  if (patient.age !== undefined) {
    const ageNum = parseInt(String(patient.age), 10);
    payload.age = isNaN(ageNum) ? null : Math.max(0, ageNum);
  }

  // 5. Gender (CHECK IN ('Male', 'Female', 'Other'))
  if (patient.sex !== undefined || isNew) {
    payload.gender = VALID_GENDERS.includes(patient.sex as any) ? patient.sex : "Female";
  }

  // 6. Civil Status (CHECK IN ('Single', 'Married', 'Widowed', 'Separated', 'Solo Parent', 'Cohabiting'))
  if (patient.civilStatus !== undefined) {
    payload.civil_status = VALID_CIVIL_STATUSES.includes(patient.civilStatus as any)
      ? patient.civilStatus
      : null;
  }

  if (patient.religion !== undefined) {
    payload.religion = (patient.religion || "").trim() || null;
  }

  const bloodTypeVal = (patient.bloodType || patient.healthInfo?.bloodType || "").trim();
  if (bloodTypeVal) {
    payload.blood_type = bloodTypeVal;
  }

  // 7. Contact & Address (barangay, city, province: NOT NULL)
  if (patient.contact !== undefined) {
    payload.contact_number = (patient.contact || "").trim() || null;
  }
  if (patient.purokOrStreet !== undefined) {
    payload.purok_or_street = (patient.purokOrStreet || "").trim() || null;
  }
  if (patient.barangay !== undefined || isNew) {
    payload.barangay = (patient.barangay || "").trim() || "Barangay Central";
  }
  if (patient.cityOrMunicipality !== undefined || isNew) {
    payload.city_or_municipality = (patient.cityOrMunicipality || "").trim() || "City of Care";
  }
  if (patient.province !== undefined || isNew) {
    payload.province = (patient.province || "").trim() || "Province of Health";
  }
  if (patient.postalCode !== undefined) {
    payload.postal_code = (patient.postalCode || "").trim() || null;
  }

  // 8. Social Welfare & Identifiers
  if (patient.phicNo !== undefined) {
    payload.philhealth_number = (patient.phicNo || "").trim() || null;
  }
  if (patient.pwdId !== undefined) {
    const cleanPwd = (patient.pwdId || "").trim();
    payload.pwd_id_no = cleanPwd === "N/A" ? null : cleanPwd || null;
  }
  if (patient.employmentStatus !== undefined) {
    payload.employment_status = (patient.employmentStatus || "").trim() || null;
  }
  if (patient.isIp !== undefined) {
    payload.is_ip = patient.isIp === "IP" ? "IP" : patient.isIp === "Non-IP" ? "Non-IP" : null;
  }
  if (patient.ethnicity !== undefined) {
    payload.ethnicity = (patient.ethnicity || "").trim() || null;
  }

  if (patient.isNhtsBeneficiary !== undefined) {
    payload.is_nhts_beneficiary = Boolean(patient.isNhtsBeneficiary);
  }
  if (patient.isSeniorCitizen !== undefined) {
    payload.is_senior_citizen = Boolean(patient.isSeniorCitizen);
  }
  if (patient.isPwd !== undefined) {
    payload.is_pwd = Boolean(patient.isPwd);
  }

  // 9. Emergency Contact
  if (patient.emergencyContact) {
    if (patient.emergencyContact.name !== undefined) {
      payload.emergency_contact_name = (patient.emergencyContact.name || "").trim() || null;
    }
    if (patient.emergencyContact.relationship !== undefined) {
      payload.emergency_contact_relationship =
        (patient.emergencyContact.relationship || "").trim() || null;
    }
    if (patient.emergencyContact.contact !== undefined) {
      payload.emergency_contact_number = (patient.emergencyContact.contact || "").trim() || null;
    }
  }

  // 10. Status (CHECK IN ('Active', 'Inactive', 'Follow-up Needed'))
  if (patient.status !== undefined) {
    payload.status = VALID_STATUSES.includes(patient.status as any) ? patient.status : "Active";
  }

  if (patient.healthInfo !== undefined || patient.philpenRecord !== undefined) {
    payload.health_info = {
      ...(patient.healthInfo || {}),
      ...(patient.philpenRecord ? { philpenRecord: patient.philpenRecord } : {}),
    };
  }

  if (patient.lastVisit !== undefined) {
    payload.last_visit_date = sanitizeDate(patient.lastVisit);
  }

  if (isNew) {
    payload.registered_date = sanitizeDate(
      patient.registeredDate,
      new Date().toISOString().split("T")[0]
    );
    if (!payload.last_visit_date) {
      payload.last_visit_date = payload.registered_date;
    }
  }

  return payload;
}

// ==============================================================================
// CRUD METHOD 1: READ (Fetch All Patients)
// ==============================================================================
export async function fetchPatientsFromSupabase(): Promise<MockPatient[] | null> {
  if (!isSupabaseConfigured) {
    return null;
  }
  try {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetchPatients error (falling back to storage):", error.message);
      return null;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(mapRowToPatient);
  } catch (err) {
    console.error("fetchPatientsFromSupabase exception:", err);
    return null;
  }
}

// ==============================================================================
// CRUD METHOD 2: READ (Fetch Single Patient By ID with related clinical records)
// ==============================================================================
export async function getPatientByIdFromSupabase(id: string): Promise<MockPatient | null> {
  if (!isSupabaseConfigured) {
    return null;
  }
  try {
    // 1. Fetch patient basic info
    const { data: patientRow, error: patientError } = await supabase
      .from("patients")
      .select("*")
      .or(`id.eq.${id},patient_id_number.eq.${id}`)
      .maybeSingle();

    if (patientError || !patientRow) {
      console.warn(`Patient not found in Supabase for ID: ${id}`, patientError?.message);
      return null;
    }

    const patient = mapRowToPatient(patientRow);

    // 2. Fetch associated clinical consultations
    const { data: consultations } = await supabase
      .from("consultations")
      .select("*")
      .eq("patient_id", patient.id)
      .order("consultation_date", { ascending: false });

    if (consultations && consultations.length > 0) {
      patient.consultations = consultations.map((c) => ({
        id: c.id,
        date: c.consultation_date,
        purpose: c.chief_complaint || c.visit_type || "Clinical Consultation",
        physician: c.attending_healthcare_provider || "Attending Physician",
        diagnosis: c.assessment_diagnosis || "Primary Care Assessment",
      }));
    }

    // 3. Fetch associated appointments
    const { data: appointments } = await supabase
      .from("appointments")
      .select("*")
      .eq("patient_id", patient.id)
      .order("scheduled_date", { ascending: false });

    if (appointments && appointments.length > 0) {
      patient.appointments = appointments.map((a) => ({
        id: a.id,
        date: a.scheduled_date,
        time: a.scheduled_time || "08:30 AM",
        purpose: a.appointment_type || a.notes || "Follow-up",
        status: a.status || "Scheduled",
      }));
    }

    // 4. Fetch associated prescriptions
    const { data: prescriptions } = await supabase
      .from("prescriptions")
      .select("*")
      .eq("patient_id", patient.id)
      .order("prescribed_date", { ascending: false });

    if (prescriptions && prescriptions.length > 0) {
      patient.prescriptions = prescriptions.map((p) => ({
        id: p.id,
        medicine: p.medicine_name,
        dosage: p.dosage || "",
        frequency: p.frequency || "",
        duration: p.duration || "",
      }));
    }

    // 5. Fetch associated PhilPEN Assessment record
    try {
      const { data: philpenData } = await supabase
        .from("philpen_assessments")
        .select("*")
        .eq("patient_id", patient.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (philpenData) {
        patient.philpenRecord = {
          patientInfo: {
            healthFacilityName: philpenData.health_facility_name || "Barangay Health Center",
            assessmentDate: philpenData.assessment_date || patient.registeredDate || patient.lastVisit,
            surname: patient.lastName,
            givenName: patient.firstName,
            middleName: patient.middleName,
            age: patient.age,
            sex: patient.sex,
            birthdate: patient.birthdate,
            phicNo: patient.phicNo,
            civilStatus: (patient.civilStatus as any) || "Single",
            religion: patient.religion,
            contactNo: patient.contact,
            address: patient.address,
            pwdIdNo: patient.pwdId === "N/A" ? "" : patient.pwdId,
            employmentStatus: (patient.employmentStatus as any) || "Employed",
            isIp: (patient.isIp as any) || "Non-IP",
            ethnicity: patient.ethnicity || "Tagalog",
            ...(patient.philpenRecord?.patientInfo || {}),
          },
          redFlags: {
            ...(patient.philpenRecord?.redFlags || {}),
            ...(philpenData.red_flags || {}),
          },
          medicalHistory: {
            ...(patient.philpenRecord?.medicalHistory || {}),
            ...(philpenData.medical_history || {}),
          },
          familyHistory: {
            ...(patient.philpenRecord?.familyHistory || {}),
            ...(philpenData.family_history || {}),
          },
          ncdRiskFactors: {
            ...(patient.philpenRecord?.ncdRiskFactors || {}),
            ...(philpenData.lifestyle_risk_factors || {}),
          },
          riskScreening: {
            ...(patient.philpenRecord?.riskScreening || {}),
            ...(philpenData.physical_measurements || {}),
          },
          management: {
            ...(patient.philpenRecord?.management || {}),
            ...(philpenData.risk_assessment_result || {}),
          },
        };
      }
    } catch (penErr) {
      console.warn("Could not query philpen_assessments from Supabase:", penErr);
    }

    return patient;
  } catch (err) {
    console.error("getPatientByIdFromSupabase exception:", err);
    return null;
  }
}

// ==============================================================================
// CRUD METHOD 3: CREATE (Register New Patient)
// ==============================================================================
export async function createPatientInSupabase(patient: Partial<MockPatient>): Promise<{
  success: boolean;
  data?: MockPatient;
  error?: string;
}> {
  if (!isSupabaseConfigured) {
    return { success: false, error: "Supabase is not configured." };
  }
  try {
    const id = patient.id || `PAT-${Date.now().toString().slice(-6)}`;
    const fullPatient: Partial<MockPatient> = {
      ...patient,
      id,
    };

    const row = mapPatientToRow(fullPatient, true);

    const { data, error } = await supabase
      .from("patients")
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error("Supabase createPatient error:", error.message, error.details);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: mapRowToPatient(data),
    };
  } catch (err: any) {
    console.error("createPatientInSupabase exception:", err);
    return { success: false, error: err.message || "Failed to create patient" };
  }
}

// ==============================================================================
// CRUD METHOD 4: UPDATE (Edit Patient Information)
// ==============================================================================
export async function updatePatientInSupabase(
  id: string,
  updates: Partial<MockPatient>
): Promise<{
  success: boolean;
  data?: MockPatient;
  error?: string;
}> {
  if (!isSupabaseConfigured) {
    return { success: false, error: "Supabase is not configured." };
  }
  try {
    const row = mapPatientToRow(updates, false);
    // Never overwrite primary key
    delete row.id;
    // Never overwrite patient_id_number unless explicitly provided
    if (!updates.patientIdNumber) {
      delete row.patient_id_number;
    }

    const { data, error } = await supabase
      .from("patients")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Supabase updatePatient error for ID ${id}:`, error.message, error.details);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: mapRowToPatient(data),
    };
  } catch (err: any) {
    console.error("updatePatientInSupabase exception:", err);
    return { success: false, error: err.message || "Failed to update patient" };
  }
}

// ==============================================================================
// CRUD METHOD 5: DELETE (Remove Patient Record)
// ==============================================================================
export async function deletePatientFromSupabase(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!isSupabaseConfigured) {
    return { success: false, error: "Supabase is not configured." };
  }
  try {
    const { error } = await supabase
      .from("patients")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Supabase deletePatient error for ID ${id}:`, error.message, error.details);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("deletePatientFromSupabase exception:", err);
    return { success: false, error: err.message || "Failed to delete patient" };
  }
}

// ==============================================================================
// UPSERT / SAVE (Smart check: UPDATE if exists, INSERT if new)
// ==============================================================================
export async function savePatientToSupabase(patient: Partial<MockPatient>): Promise<boolean> {
  if (!isSupabaseConfigured) {
    return false;
  }
  try {
    const id = patient.id || `PAT-${Date.now().toString().slice(-6)}`;

    // Check if patient already exists in Supabase
    const { data: existing } = await supabase
      .from("patients")
      .select("id, patient_id_number")
      .eq("id", id)
      .maybeSingle();

    if (existing) {
      // Record exists: perform UPDATE without violating NOT NULL or UNIQUE on patient_id_number
      const updateRow = mapPatientToRow(patient, false);
      delete updateRow.id;
      if (!patient.patientIdNumber) {
        delete updateRow.patient_id_number;
      }

      const { error } = await supabase
        .from("patients")
        .update(updateRow)
        .eq("id", id);

      if (error) {
        console.error(`Supabase update error for patient ${id}:`, error.message, error.details);
        return false;
      }
      return true;
    } else {
      // New record: perform INSERT with all required fields guaranteed
      const insertRow = mapPatientToRow({ ...patient, id }, true);
      const { error } = await supabase
        .from("patients")
        .insert(insertRow);

      if (error) {
        console.error(`Supabase insert error for patient ${id}:`, error.message, error.details);
        return false;
      }
      return true;
    }
  } catch (err) {
    console.error("savePatientToSupabase exception:", err);
    return false;
  }
}
