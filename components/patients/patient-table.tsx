"use client";

import * as React from "react";
import Link from "next/link";
import { Users, Eye, Edit3, Calendar, Phone, MapPin, Stethoscope, Trash2 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PatientActions } from "./patient-actions";
import { MockPatient } from "@/lib/mock-data/patients";

import { Pagination } from "@/components/ui/pagination";

interface PatientTableProps {
  patients: MockPatient[];
  onResetFilters?: () => void;
  onDelete?: (id: string, name: string) => Promise<void> | void;
}

const PAGE_SIZE = 10;

export function PatientTable({ patients, onResetFilters, onDelete }: PatientTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1);

  // Reset to first page whenever the patient list is filtered or changed
  React.useEffect(() => {
    setCurrentPage(1);
  }, [patients.length]);

  const totalPages = Math.max(1, Math.ceil(patients.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedPatients = React.useMemo(() => {
    const startIndex = (safePage - 1) * PAGE_SIZE;
    return patients.slice(startIndex, startIndex + PAGE_SIZE);
  }, [patients, safePage]);

  if (patients.length === 0) {
    return (
      <div className="py-8">
        <EmptyState
          icon={Users}
          title={onResetFilters ? "No Matching Patients Found" : "No Patients Registered Yet"}
          description={
            onResetFilters
              ? "We couldn't find any patient matching your active search query and filter criteria."
              : "There are currently no patients in the barangay registry. Register a resident to begin tracking health records in Supabase."
          }
          action={
            onResetFilters
              ? {
                  label: "Clear All Filters",
                  onClick: onResetFilters,
                }
              : {
                  label: "+ Register First Patient",
                  href: "/patients/new",
                }
          }
        />
      </div>
    );
  }

  const getStatusBadge = (status: MockPatient["status"]) => {
    switch (status) {
      case "Active":
        return <Badge variant="success" className="text-[10px]">Active</Badge>;
      case "Follow-up Needed":
        return <Badge variant="warning" className="text-[10px]">Follow-up</Badge>;
      case "Inactive":
      default:
        return <Badge variant="secondary" className="text-[10px]">Inactive</Badge>;
    }
  };

  return (
    <div className="space-y-3">
      {/* Desktop Table View - Limited to 10 rows per page */}
      <div className="hidden md:block rounded-md border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto relative">
          <Table>
            <TableHeader className="bg-slate-100/95 backdrop-blur-xs shadow-xs">
              <TableRow className="border-b border-slate-200 hover:bg-slate-100">
                <TableHead className="w-28 font-bold text-slate-700">Patient ID</TableHead>
                <TableHead className="font-bold text-slate-700">Full Name</TableHead>
                <TableHead className="w-20 font-bold text-slate-700">Sex</TableHead>
                <TableHead className="w-16 font-bold text-slate-700">Age</TableHead>
                <TableHead className="font-bold text-slate-700">Barangay</TableHead>
                <TableHead className="font-bold text-slate-700">Contact</TableHead>
                <TableHead className="font-bold text-slate-700">Last Visit</TableHead>
                <TableHead className="w-24 font-bold text-slate-700">Status</TableHead>
                <TableHead className="w-56 text-right font-bold text-slate-700 pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPatients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* 1. Patient ID */}
                  <TableCell className="font-mono font-semibold text-slate-800">
                    <Link
                      href={`/patients/${patient.id}`}
                      className="hover:text-teal-700 hover:underline"
                    >
                      {patient.patientIdNumber || patient.id}
                    </Link>
                  </TableCell>

                  {/* 2. Full Name */}
                  <TableCell>
                    <div className="flex flex-col">
                      <Link
                        href={`/patients/${patient.id}`}
                        className="font-semibold text-slate-900 hover:text-teal-700 hover:underline"
                      >
                        {patient.fullName}
                      </Link>
                      <span className="text-[11px] text-slate-400">
                        PHIC: {patient.phicNo || "None"}
                      </span>
                    </div>
                  </TableCell>

                  {/* 3. Sex */}
                  <TableCell className="text-slate-600">{patient.sex}</TableCell>

                  {/* 4. Age */}
                  <TableCell className="text-slate-600 font-mono">{patient.age}y</TableCell>

                  {/* 5. Barangay */}
                  <TableCell className="text-slate-600">{patient.barangay}</TableCell>

                  {/* 6. Contact */}
                  <TableCell className="text-slate-600 font-mono text-[11px]">
                    {patient.contact || "None"}
                  </TableCell>

                  {/* 7. Last Visit */}
                  <TableCell className="text-slate-500 text-[11px]">
                    {patient.lastVisit || "N/A"}
                  </TableCell>

                  {/* 8. Status */}
                  <TableCell>{getStatusBadge(patient.status)}</TableCell>

                  {/* 9. Direct Actions */}
                  <TableCell className="text-right pr-3">
                    <PatientActions patient={patient} onDelete={onDelete} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 10-Item Pagination Bar */}
        <Pagination
          currentPage={safePage}
          totalItems={patients.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
          itemName="patients"
        />
      </div>

      {/* Mobile Card List View (Visible on mobile screens) */}
      <div className="md:hidden space-y-3">
        {paginatedPatients.map((patient) => (
          <div
            key={patient.id}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                    {patient.patientIdNumber || patient.id}
                  </span>
                  {getStatusBadge(patient.status)}
                </div>
                <Link
                  href={`/patients/${patient.id}`}
                  className="mt-1 block font-semibold text-sm text-slate-900 hover:text-teal-700"
                >
                  {patient.fullName}
                </Link>
                <p className="text-[11px] text-slate-400">
                  {patient.sex} &bull; {patient.age} yrs old &bull; Born {patient.birthdate || "N/A"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{patient.barangay}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="font-mono text-[11px] truncate">{patient.contact || "None"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-slate-400" />
                Last: {patient.lastVisit || "N/A"}
              </span>
              <PatientActions patient={patient} onDelete={onDelete} />
            </div>
          </div>
        ))}

        {/* 10-Item Pagination Bar for Mobile */}
        <Pagination
          currentPage={safePage}
          totalItems={patients.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
          itemName="patients"
        />
      </div>
    </div>
  );
}
