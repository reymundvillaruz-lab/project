"use client";

import * as React from "react";
import {
  MockPatient,
  getStoredPatients,
  saveStoredPatients,
} from "@/lib/mock-data/patients";
import { fetchPatientsFromSupabase } from "@/lib/supabase/services/patients-service";

/**
 * Global function to fetch patients from Supabase, update local storage cache,
 * and notify all active modules of the updated registry.
 */
export async function syncPatientsFromSupabase(): Promise<MockPatient[]> {
  try {
    const sbPatients = await fetchPatientsFromSupabase();
    if (sbPatients && sbPatients.length > 0) {
      saveStoredPatients(sbPatients);
      return sbPatients;
    }
  } catch (err) {
    console.warn("Could not sync patients from Supabase, using local cache:", err);
  }
  return getStoredPatients();
}

/**
 * Universal React Hook for sharing patient registry data across all modules
 * (Appointments, Consultations, Family Planning, Immunization, Maternal Care, Prescriptions, etc.)
 */
export function useSharedPatients() {
  const [patients, setPatients] = React.useState<MockPatient[]>(() => {
    return getStoredPatients();
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [hasSynced, setHasSynced] = React.useState<boolean>(false);

  // Sync on mount and subscribe to updates
  React.useEffect(() => {
    let isMounted = true;

    // Background fetch from Supabase to ensure fresh cloud data
    async function loadCloudPatients() {

      setIsLoading(true);
      try {
        const sbPatients = await fetchPatientsFromSupabase();
        if (isMounted && sbPatients !== null && sbPatients.length > 0) {
          setPatients(sbPatients);
          saveStoredPatients(sbPatients);
        }
      } catch (e) {
        console.warn("Error fetching Supabase patients in useSharedPatients:", e);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setHasSynced(true);
        }
      }
    }

    loadCloudPatients();

    // Listen for patient updates dispatched by other components (e.g. PhilPEN registration)
    const handlePatientsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<MockPatient[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setPatients(customEvent.detail);
      } else {
        setPatients(getStoredPatients());
      }
    };

    // Listen for storage events from other browser tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "bhcms_patient_registry_v2" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setPatients(parsed);
          }
        } catch {}
      }
    };

    window.addEventListener("bhcms:patients-updated", handlePatientsUpdate);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      isMounted = false;
      window.removeEventListener("bhcms:patients-updated", handlePatientsUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  /**
   * Helper: check if a patient name or ID exists in the patient registry
   */
  const findPatientInRegistry = React.useCallback(
    (identifier: string): MockPatient | undefined => {
      if (!identifier || !identifier.trim()) return undefined;
      const clean = identifier.trim().toLowerCase();

      return patients.find((p) => {
        const idMatch = p.id.toLowerCase() === clean;
        const idNumMatch = p.patientIdNumber && p.patientIdNumber.toLowerCase() === clean;
        const nameMatch = p.fullName && p.fullName.toLowerCase() === clean;
        const firstLastMatch =
          `${p.firstName} ${p.lastName}`.toLowerCase() === clean;
        const phicMatch = p.phicNo && p.phicNo.toLowerCase() === clean;
        return idMatch || idNumMatch || nameMatch || firstLastMatch || phicMatch;
      });
    },
    [patients]
  );

  const isPatientRegistered = React.useCallback(
    (identifier: string): boolean => {
      return Boolean(findPatientInRegistry(identifier));
    },
    [findPatientInRegistry]
  );

  return {
    patients,
    isLoading,
    hasSynced,
    findPatientInRegistry,
    isPatientRegistered,
    refreshPatients: syncPatientsFromSupabase,
  };
}
