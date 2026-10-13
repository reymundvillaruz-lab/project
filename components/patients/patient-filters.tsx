"use client";

import * as React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export interface PatientFiltersState {
  sex: string;
  ageGroup: string;
  barangay: string;
  status: string;
}

interface PatientFiltersProps {
  filters: PatientFiltersState;
  onFilterChange: (key: keyof PatientFiltersState, value: string) => void;
  onReset: () => void;
}

export function PatientFilters({
  filters,
  onFilterChange,
  onReset,
}: PatientFiltersProps) {
  const hasActiveFilters =
    filters.sex !== "all" ||
    filters.ageGroup !== "all" ||
    filters.barangay !== "all" ||
    filters.status !== "all";

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mr-1">
        <Filter className="h-3.5 w-3.5 text-teal-700" />
        <span>Filters:</span>
      </div>

      {/* Sex Filter */}
      <div className="w-32">
        <Select
          value={filters.sex}
          onChange={(e) => onFilterChange("sex", e.target.value)}
          aria-label="Filter by Sex"
        >
          <option value="all">All Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </Select>
      </div>

      {/* Age Group Filter */}
      <div className="w-32">
        <Select
          value={filters.ageGroup}
          onChange={(e) => onFilterChange("ageGroup", e.target.value)}
          aria-label="Filter by Age Group"
        >
          <option value="all">All Ages</option>
          <option value="20-39">20–39 yrs</option>
          <option value="40-59">40–59 yrs</option>
          <option value="60+">60+ yrs</option>
        </Select>
      </div>

      {/* Barangay Filter */}
      <div className="w-36">
        <Select
          value={filters.barangay}
          onChange={(e) => onFilterChange("barangay", e.target.value)}
          aria-label="Filter by Barangay"
        >
          <option value="all">All Barangays</option>
          <option value="Barangay Central">Barangay Central</option>
          <option value="San Jose">San Jose</option>
          <option value="Poblacion">Poblacion</option>
        </Select>
      </div>

      {/* Status Filter */}
      <div className="w-36">
        <Select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          aria-label="Filter by Status"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Follow-up Needed">Follow-up Needed</option>
        </Select>
      </div>

      {/* Reset button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-9 text-xs text-slate-500 hover:text-slate-900 px-2"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset
        </Button>
      )}
    </div>
  );
}
