"use client";

import * as React from "react";
import Link from "next/link";
import {
  UserPlus,
  RefreshCw,
  Database,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PatientSummary } from "./patient-summary";
import { PatientSearch } from "./patient-search";
import { PatientFilters, PatientFiltersState } from "./patient-filters";
import { PatientTable } from "./patient-table";
import {
  MockPatient,
  INITIAL_MOCK_PATIENTS,
  getStoredPatients,
  saveStoredPatients,
  deleteStoredPatient,
} from "@/lib/mock-data/patients";
import {
  fetchPatientsFromSupabase,
  deletePatientFromSupabase,
} from "@/lib/supabase/services/patients-service";

export function PatientRegistryView() {
  const [patients, setPatients] = React.useState<MockPatient[]>(INITIAL_MOCK_PATIENTS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [dbStatus, setDbStatus] = React.useState<"connected" | "cached" | "error">("connected");
  const [feedbackMessage, setFeedbackMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [filters, setFilters] = React.useState<PatientFiltersState>({
    sex: "all",
    ageGroup: "all",
    barangay: "all",
    status: "all",
  });

  // Load patients from Supabase with fallback to local cache
  const loadPatients = React.useCallback(async (showRefreshingSpinner = false) => {
    if (showRefreshingSpinner) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const sbPatients = await fetchPatientsFromSupabase();
      if (sbPatients !== null) {
        setPatients(sbPatients);
        saveStoredPatients(sbPatients);
        setDbStatus("connected");
      } else {
        const cached = getStoredPatients();
        setPatients(cached);
        setDbStatus("cached");
      }
    } catch (e) {
      console.warn("Could not load from Supabase, using local cache:", e);
      setPatients(getStoredPatients());
      setDbStatus("cached");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  // Handle Delete Patient directly in Supabase
  const handleDeletePatient = async (id: string, name: string) => {
    try {
      const result = await deletePatientFromSupabase(id);
      if (result.success) {
        setPatients((prev) => prev.filter((p) => p.id !== id));
        deleteStoredPatient(id);
        setFeedbackMessage({
          type: "success",
          text: `Patient record for "${name}" (${id}) successfully deleted from Supabase.`,
        });
      } else {
        setFeedbackMessage({
          type: "error",
          text: `Failed to delete patient: ${result.error || "Unknown database error"}`,
        });
      }
    } catch (err: any) {
      setFeedbackMessage({
        type: "error",
        text: `Error deleting patient from Supabase: ${err.message || "Network error"}`,
      });
    }

    // Auto-dismiss message after 5 seconds
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 5000);
  };

  const handleFilterChange = (key: keyof PatientFiltersState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setFilters({
      sex: "all",
      ageGroup: "all",
      barangay: "all",
      status: "all",
    });
  };

  // Client-side filtering logic
  const filteredPatients = React.useMemo(() => {
    return patients.filter((patient) => {
      // 1. Search query: Patient ID, First Name, Last Name, Contact
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesId = patient.id.toLowerCase().includes(query) || (patient.patientIdNumber && patient.patientIdNumber.toLowerCase().includes(query));
        const matchesFirstName = patient.firstName.toLowerCase().includes(query);
        const matchesLastName = patient.lastName.toLowerCase().includes(query);
        const matchesFullName = patient.fullName.toLowerCase().includes(query);
        const matchesContact = patient.contact.toLowerCase().includes(query);

        if (!matchesId && !matchesFirstName && !matchesLastName && !matchesFullName && !matchesContact) {
          return false;
        }
      }

      // 2. Sex filter
      if (filters.sex !== "all" && patient.sex !== filters.sex) {
        return false;
      }

      // 3. Age Group filter
      if (filters.ageGroup !== "all") {
        if (filters.ageGroup === "20-39" && (patient.age < 20 || patient.age > 39)) {
          return false;
        }
        if (filters.ageGroup === "40-59" && (patient.age < 40 || patient.age > 59)) {
          return false;
        }
        if (filters.ageGroup === "60+" && patient.age < 60) {
          return false;
        }
      }

      // 4. Barangay filter
      if (filters.barangay !== "all" && patient.barangay !== filters.barangay) {
        return false;
      }

      // 5. Status filter
      if (filters.status !== "all" && patient.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [patients, searchQuery, filters]);

  return (
    <div className="space-y-6">
      {/* Top Header Bar with Live Database Status & Primary Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Patient Registry
            </h1>
            {dbStatus === "connected" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Supabase Live
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
                <Database className="h-3 w-3 text-amber-600" />
                Local Cache
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Master patient index &bull; Real-time synchronization with Supabase Cloud Postgres
          </p>
        </div>

        {/* Action Buttons: Refresh + Register Patient */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadPatients(true)}
            disabled={isRefreshing || isLoading}
            className="text-xs text-slate-700 hover:text-slate-900"
            title="Refresh database records"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 mr-1.5 ${isRefreshing ? "animate-spin text-teal-600" : ""}`}
            />
            {isRefreshing ? "Syncing..." : "Refresh"}
          </Button>

          <Link href="/patients/new">
            <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs text-white">
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
              Register Patient
            </Button>
          </Link>
        </div>
      </div>

      {/* Dynamic Feedback Message (Success or Error notification) */}
      {feedbackMessage && (
        <div
          className={`flex items-center justify-between rounded-lg p-3 text-xs border ${
            feedbackMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          } animate-in fade-in duration-200`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-slate-400 hover:text-slate-700 ml-3 text-sm font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <PatientSummary patients={patients} />

      {/* Main Registry Card with Search, Filters, and Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <PatientSearch
              value={searchQuery}
              onChange={setSearchQuery}
            />

            {/* Filter Controls */}
            <PatientFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-800">{filteredPatients.length}</strong> of{" "}
              <strong className="text-slate-800">{patients.length}</strong> registered patient{patients.length === 1 ? "" : "s"} in Supabase
            </span>
            {isLoading && (
              <span className="flex items-center gap-1.5 text-teal-700 font-medium">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Querying database...
              </span>
            )}
          </div>

          {/* Patient Table with Direct Supabase Delete Handler */}
          <PatientTable
            patients={filteredPatients}
            onResetFilters={handleResetFilters}
            onDelete={handleDeletePatient}
          />
        </CardContent>
      </Card>
    </div>
  );
}
