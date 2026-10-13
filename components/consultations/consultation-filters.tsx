"use client";

import * as React from "react";
import { Search, X, RotateCcw, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getPatientOptions, PatientOption } from "@/lib/mock-data/consultations";

export interface ConsultationFiltersState {
  search: string;
  date: string;
  status: string;
  patientId: string;
}

interface ConsultationFiltersProps {
  filters: ConsultationFiltersState;
  onFilterChange: (key: keyof ConsultationFiltersState, value: string) => void;
  onReset: () => void;
}

export function ConsultationFilters({
  filters,
  onFilterChange,
  onReset,
}: ConsultationFiltersProps) {
  const [patientOptions, setPatientOptions] = React.useState<PatientOption[]>([]);

  React.useEffect(() => {
    setPatientOptions(getPatientOptions());
  }, []);

  const hasActiveFilters =
    Boolean(filters.search.trim()) ||
    Boolean(filters.date) ||
    filters.status !== "all" ||
    filters.patientId !== "all";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search bar */}
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Search ID, patient, complaint, diagnosis..."
            className="pl-9 pr-8 text-xs bg-white h-9"
            aria-label="Search consultations by ID, patient, complaint, or diagnosis"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange("search", "")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Date Filter */}
        <div className="w-full sm:w-40">
          <Input
            type="date"
            value={filters.date}
            onChange={(e) => onFilterChange("date", e.target.value)}
            className="text-xs bg-white h-9"
            aria-label="Filter by consultation date"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-36">
          <Select
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            aria-label="Filter by consultation status"
          >
            <option value="all">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Pending">Pending</option>
          </Select>
        </div>

        {/* Patient Filter */}
        <div className="w-full sm:w-48">
          <Select
            value={filters.patientId}
            onChange={(e) => onFilterChange("patientId", e.target.value)}
            aria-label="Filter by patient"
          >
            <option value="all">All Patients</option>
            {patientOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.id})
              </option>
            ))}
          </Select>
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 text-xs text-slate-500 hover:text-slate-900 px-2.5"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
