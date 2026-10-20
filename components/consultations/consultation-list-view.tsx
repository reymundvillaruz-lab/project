"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ConsultationFilters, ConsultationFiltersState } from "./consultation-filters";
import { ConsultationTable } from "./consultation-table";
import {
  MockConsultation,
  INITIAL_MOCK_CONSULTATIONS,
  getStoredConsultations,
} from "@/lib/mock-data/consultations";

export function ConsultationListView() {
  const [consultations, setConsultations] = React.useState<MockConsultation[]>(INITIAL_MOCK_CONSULTATIONS);
  const [filters, setFilters] = React.useState<ConsultationFiltersState>({
    search: "",
    date: "",
    status: "all",
    patientId: "all",
  });

  // Hydrate from Supabase with localStorage fallback
  React.useEffect(() => {
    setConsultations(getStoredConsultations());

    import("@/lib/supabase/services/consultations-service").then(
      async ({ fetchConsultationsFromSupabase }) => {
        try {
          const sbData = await fetchConsultationsFromSupabase();
          if (sbData && sbData.length > 0) {
            setConsultations(sbData);
          }
        } catch (e) {
          console.warn("Could not fetch consultations from Supabase:", e);
        }
      }
    );
  }, []);

  const handleFilterChange = (key: keyof ConsultationFiltersState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      date: "",
      status: "all",
      patientId: "all",
    });
  };

  // Client-side filtering logic
  const filteredConsultations = React.useMemo(() => {
    return consultations.filter((item) => {
      // 1. Search: ID, Patient name, Reason for visit, Diagnosis
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesId = item.id.toLowerCase().includes(query);
        const matchesPatient = item.patientName.toLowerCase().includes(query);
        const matchesReason = item.reasonForVisit.toLowerCase().includes(query);
        const matchesDiagnosis = item.diagnosis.toLowerCase().includes(query);

        if (!matchesId && !matchesPatient && !matchesReason && !matchesDiagnosis) {
          return false;
        }
      }

      // 2. Date filter
      if (filters.date) {
        // Compare date substrings or formats
        const filterDateFormatted = new Date(filters.date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
        if (!item.date.includes(filters.date) && item.date !== filterDateFormatted) {
          return false;
        }
      }

      // 3. Status filter
      if (filters.status !== "all" && item.status !== filters.status) {
        return false;
      }

      // 4. Patient filter
      if (filters.patientId !== "all" && item.patientId !== filters.patientId) {
        return false;
      }

      return true;
    });
  }, [consultations, filters]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Consultations
          </h1>
          <p className="text-xs text-slate-500">
            Manage and review patient consultations.
          </p>
        </div>

        {/* Primary Action Button */}
        <Link href="/consultations/new">
          <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs">
            <Plus className="h-3.5 w-3.5 mr-1" />
            New Consultation
          </Button>
        </Link>
      </div>

      {/* Main Consultations Card with Filters & Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <ConsultationFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-800">{filteredConsultations.length}</strong> of{" "}
              <strong className="text-slate-800">{consultations.length}</strong> consultations
            </span>
          </div>

          {/* Consultation Table */}
          <ConsultationTable
            consultations={filteredConsultations}
            onResetFilters={handleResetFilters}
          />
        </CardContent>
      </Card>
    </div>
  );
}
