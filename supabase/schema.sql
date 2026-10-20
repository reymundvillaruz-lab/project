-- ==============================================================================
-- BARANGAY HEALTH CARE MANAGEMENT SYSTEM (BHCMS) - SUPABASE MASTER SCHEMA
-- Project: uxuycuvdiudhryjbcnja
-- Exact 1:1 schema mapping for all 10 BHCMS clinical & operational modules
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 1. PATIENTS REGISTRY (Master Patient Index)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.patients (
    id TEXT PRIMARY KEY,
    patient_id_number TEXT UNIQUE NOT NULL,
    philhealth_number TEXT,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    suffix TEXT,
    date_of_birth DATE NOT NULL,
    age INTEGER,
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    civil_status TEXT CHECK (civil_status IN ('Single', 'Married', 'Widowed', 'Separated', 'Solo Parent', 'Cohabiting')),
    religion TEXT,
    blood_type TEXT,
    contact_number TEXT,
    purok_or_street TEXT,
    barangay TEXT NOT NULL,
    city_or_municipality TEXT NOT NULL,
    province TEXT NOT NULL,
    postal_code TEXT,
    emergency_contact_name TEXT,
    emergency_contact_relationship TEXT,
    emergency_contact_number TEXT,
    is_nhts_beneficiary BOOLEAN DEFAULT FALSE,
    is_senior_citizen BOOLEAN DEFAULT FALSE,
    is_pwd BOOLEAN DEFAULT FALSE,
    pwd_id_no TEXT,
    employment_status TEXT,
    is_ip TEXT CHECK (is_ip IN ('IP', 'Non-IP', '')),
    ethnicity TEXT,
    registered_date DATE DEFAULT CURRENT_DATE,
    last_visit_date DATE,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Follow-up Needed')),
    health_info JSONB DEFAULT '{"bloodType":"","allergies":[],"chronicConditions":[],"philpenStatus":"Pending","lastBp":"","lastBmi":""}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 2. PHILPEN ASSESSMENTS (DOH NCD Risk Assessment)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.philpen_assessments (
    id TEXT PRIMARY KEY,
    patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    health_facility_name TEXT,
    red_flags JSONB DEFAULT '{}'::jsonb,
    medical_history JSONB DEFAULT '{}'::jsonb,
    family_history JSONB DEFAULT '{}'::jsonb,
    lifestyle_risk_factors JSONB DEFAULT '{}'::jsonb,
    physical_measurements JSONB DEFAULT '{}'::jsonb,
    risk_assessment_result JSONB DEFAULT '{}'::jsonb,
    assessed_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_philpen_updated_at BEFORE UPDATE ON public.philpen_assessments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 3. CONSULTATIONS (Daily Clinical Consultations & Triage)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.consultations (
    id TEXT PRIMARY KEY,
    patient_id TEXT REFERENCES public.patients(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    patient_age INTEGER,
    patient_sex TEXT CHECK (patient_sex IN ('Male', 'Female')),
    patient_contact TEXT,
    consultation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    visit_type TEXT NOT NULL CHECK (visit_type IN ('General Consultation', 'Follow-up', 'Health Check', 'Other')),
    provider TEXT NOT NULL,
    reason_for_visit TEXT NOT NULL,
    diagnosis TEXT NOT NULL,
    vital_signs JSONB NOT NULL DEFAULT '{"temperature":"","bloodPressureSystolic":"","bloodPressureDiastolic":"","pulseRate":"","respiratoryRate":"","weightKg":"","heightCm":"","bmi":""}'::jsonb,
    notes TEXT,
    follow_up_required TEXT DEFAULT 'No' CHECK (follow_up_required IN ('No', 'Yes')),
    follow_up_date DATE,
    follow_up_instructions TEXT,
    status TEXT NOT NULL DEFAULT 'Completed' CHECK (status IN ('Completed', 'Follow-up', 'Pending')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON public.consultations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 4. IMMUNIZATIONS (National Immunization Program - NIP Infant Cards)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.immunizations (
    id TEXT PRIMARY KEY,
    patient_id TEXT REFERENCES public.patients(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    sex TEXT CHECK (sex IN ('Male', 'Female', '')),
    phic_number TEXT,
    birthdate DATE NOT NULL,
    age TEXT,
    nhts TEXT,
    birthplace TEXT,
    mother_name TEXT,
    father_name TEXT,
    family_serial_no TEXT,
    address TEXT NOT NULL,
    date_registered DATE DEFAULT CURRENT_DATE,
    measurement_date DATE,
    height_cm TEXT,
    weight_kg TEXT,
    temperature_c TEXT,
    remarks TEXT,
    vaccines JSONB NOT NULL DEFAULT '{}'::jsonb,
    provider_name TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_immunizations_updated_at BEFORE UPDATE ON public.immunizations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 5. MATERNAL CARE RECORDS (BNC Form 1-G-a Maternal & Prenatal Tracking)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.maternal_records (
    id TEXT PRIMARY KEY,
    patient_id TEXT REFERENCES public.patients(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    age INTEGER,
    address TEXT NOT NULL,
    contact_number TEXT,
    philhealth_no TEXT,
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    gravida INTEGER NOT NULL DEFAULT 1,
    para INTEGER NOT NULL DEFAULT 0,
    lmp DATE NOT NULL,
    edc DATE NOT NULL,
    gestational_age_weeks INTEGER,
    tetanus_toxoid_status TEXT NOT NULL DEFAULT 'None' CHECK (tetanus_toxoid_status IN ('None', 'TT1', 'TT2', 'TT3', 'TT4', 'TT5')),
    iron_folic_acid_supplementation TEXT,
    nutritional_status TEXT,
    prenatal_visits JSONB NOT NULL DEFAULT '[]'::jsonb,
    appointments JSONB NOT NULL DEFAULT '[]'::jsonb,
    assigned_bhw TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Follow-up Due', 'Completed')),
    general_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_maternal_updated_at BEFORE UPDATE ON public.maternal_records
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 6. FAMILY PLANNING RECORDS (Reproductive Health & Contraceptive Registry)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.family_planning_records (
    id TEXT PRIMARY KEY,
    client_id TEXT,
    client_name TEXT NOT NULL,
    date_of_birth DATE,
    age INTEGER,
    address TEXT,
    contact_number TEXT,
    client_type TEXT NOT NULL CHECK (client_type IN ('New Acceptor', 'Current User', 'Changing Method', 'Changing Clinic', 'Dropout/Restart')),
    method TEXT NOT NULL,
    registration_date DATE DEFAULT CURRENT_DATE,
    provider TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active User' CHECK (status IN ('Active User', 'Follow-up Due', 'Discontinued', 'Referred')),
    supplies_given TEXT,
    service_records JSONB NOT NULL DEFAULT '[]'::jsonb,
    follow_ups JSONB NOT NULL DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_family_planning_updated_at BEFORE UPDATE ON public.family_planning_records
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 7. APPOINTMENTS (Clinic Visit Scheduling & Calendar)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.appointments (
    id TEXT PRIMARY KEY,
    patient_id TEXT REFERENCES public.patients(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    patient_contact TEXT,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    purpose TEXT NOT NULL,
    assigned_bhw TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No Show')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 8. MEDICINES (Pharmacy Inventory & Stock Tracking)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.medicines (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand_name TEXT,
    category TEXT NOT NULL,
    available_quantity INTEGER NOT NULL DEFAULT 0,
    unit TEXT NOT NULL DEFAULT 'Tablets',
    expiration_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Low Stock', 'Out of Stock', 'Expired')),
    reorder_level INTEGER NOT NULL DEFAULT 20,
    dosage_form TEXT,
    batch_number TEXT,
    manufacturer TEXT,
    storage_location TEXT,
    notes TEXT,
    stock_history JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_medicines_updated_at BEFORE UPDATE ON public.medicines
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 9. PRESCRIPTIONS (Dispensing Logs & Medication Orders)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id TEXT PRIMARY KEY,
    patient_id TEXT REFERENCES public.patients(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    patient_contact TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    prescriber TEXT NOT NULL,
    medicine TEXT NOT NULL,
    medicine_id TEXT REFERENCES public.medicines(id) ON DELETE SET NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    duration TEXT NOT NULL,
    quantity_to_dispense INTEGER,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Dispensed', 'Completed', 'Cancelled')),
    notes TEXT,
    dispensed_date DATE,
    dispensed_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON public.prescriptions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 10. STATION SETTINGS (Barangay Health Center Configuration)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.station_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary_station',
    health_center_name TEXT NOT NULL DEFAULT 'Barangay Health Center',
    barangay TEXT NOT NULL DEFAULT 'Poblacion',
    city_or_municipality TEXT NOT NULL DEFAULT 'City of Health',
    province TEXT NOT NULL DEFAULT 'Province of Health',
    region TEXT NOT NULL DEFAULT 'Region XIII (Caraga)',
    station_code TEXT DEFAULT 'BHC-MAIN',
    contact_number TEXT DEFAULT '(085) 123-4567',
    email TEXT DEFAULT 'healthcenter@barangay.gov.ph',
    operating_hours TEXT DEFAULT '8:00 AM - 5:00 PM (Monday to Friday)',
    municipal_health_officer TEXT DEFAULT 'Dr. Maria Santos, MD',
    public_health_nurse TEXT DEFAULT 'Nurse Juan Dela Cruz, RN',
    rural_health_midwife TEXT DEFAULT 'Midwife Elena Reyes, RM',
    system_preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.station_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures data can be read, created, updated, and accessed across all BHCMS modules
-- ==============================================================================

-- Enable RLS on all 10 tables
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.philpen_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.immunizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maternal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_planning_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.station_settings ENABLE ROW LEVEL SECURITY;

-- Allow full access for authenticated system users (or anon with valid key during initial development)
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN (
            'patients', 'philpen_assessments', 'consultations', 'immunizations',
            'maternal_records', 'family_planning_records', 'appointments', 
            'medicines', 'prescriptions', 'station_settings'
        )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "bhcms_full_access_%I" ON public.%I;', t, t);
        EXECUTE format('CREATE POLICY "bhcms_full_access_%I" ON public.%I FOR ALL USING (true) WITH CHECK (true);', t, t);
    END LOOP;
END;
$$;

-- Pre-populate default station profile if missing
INSERT INTO public.station_settings (id, health_center_name, barangay, city_or_municipality, province)
VALUES ('primary_station', 'Barangay Health Center', 'Barangay Health Station', 'City of Care', 'Province of Health')
ON CONFLICT (id) DO NOTHING;
