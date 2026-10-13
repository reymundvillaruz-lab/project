"use client";

import * as React from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
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
} from "@/lib/mock-data/patients";

export function PatientRegistryView() {
  const [patients, setPatients] = React.useState<MockPatient[]>(INITIAL_MOCK_PATIENTS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filters, setFilters] = React.useState<PatientFiltersState>({
    sex: "all",
    ageGroup: "all",
    barangay: "all",
    status: "all",
  });

  // Hydrate from localStorage on client mount if available
  React.useEffect(() => {
    setPatients(getStoredPatients());
  }, []);

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
        const matchesId = patient.id.toLowerCase().includes(query);
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
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Patient Registry
          </h1>
          <p className="text-xs text-slate-500">
            Manage and view registered patients.
          </p>
        </div>

        {/* Primary Action Button */}
        <Link href="/patients/new">
          <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs">
            <UserPlus className="h-3.5 w-3.5 mr-1.5" />
            Register Patient
          </Button>
        </Link>
      </div>

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
              <strong className="text-slate-800">{patients.length}</strong> patients
            </span>
          </div>

          {/* Patient Table */}
          <PatientTable
            patients={filteredPatients}
            onResetFilters={handleResetFilters}
          />
        </CardContent>
      </Card>
    </div>
  );
}
