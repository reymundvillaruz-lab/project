"use client";

import * as React from "react";
import Link from "next/link";
import { Users, Eye, Edit3, Calendar, Phone, MapPin, Stethoscope } from "lucide-react";
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

interface PatientTableProps {
  patients: MockPatient[];
  onResetFilters?: () => void;
}

export function PatientTable({ patients, onResetFilters }: PatientTableProps) {
  if (patients.length === 0) {
    return (
      <div className="py-8">
        <EmptyState
          icon={Users}
          title={onResetFilters ? "No Matching Patients Found" : "No Patients Registered Yet"}
          description={
            onResetFilters
              ? "We couldn't find any patient matching your active search query and filter criteria."
              : "There are currently no patients in the barangay registry. Register a resident to begin tracking health records."
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
    <div className="space-y-2">
      {/* Desktop Table View - Scrollable with 10 rows limit (~520px) and sticky header */}
      <div className="hidden md:block rounded-md border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="max-h-[520px] overflow-y-auto overflow-x-auto relative">
          <Table>
            <TableHeader className="sticky top-0 bg-slate-100/95 backdrop-blur-xs z-10 shadow-xs">
              <TableRow className="border-b border-slate-200 hover:bg-slate-100">
                <TableHead className="w-28 font-bold text-slate-700">Patient ID</TableHead>
                <TableHead className="font-bold text-slate-700">Full Name</TableHead>
                <TableHead className="w-20 font-bold text-slate-700">Sex</TableHead>
                <TableHead className="w-16 font-bold text-slate-700">Age</TableHead>
                <TableHead className="font-bold text-slate-700">Barangay</TableHead>
                <TableHead className="font-bold text-slate-700">Contact</TableHead>
                <TableHead className="font-bold text-slate-700">Last Visit</TableHead>
                <TableHead className="w-24 font-bold text-slate-700">Status</TableHead>
                <TableHead className="w-48 text-right font-bold text-slate-700 pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* 1. Patient ID */}
                  <TableCell className="font-mono font-semibold text-slate-800">
                    <Link
                      href={`/patients/${patient.id}`}
                      className="hover:text-teal-700 hover:underline"
                    >
                      {patient.id}
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
                    {patient.contact}
                  </TableCell>

                  {/* 7. Last Visit */}
                  <TableCell className="text-slate-500 text-[11px]">
                    {patient.lastVisit}
                  </TableCell>

                  {/* 8. Status */}
                  <TableCell>{getStatusBadge(patient.status)}</TableCell>

                  {/* 9. Direct Actions (No dropdown scroll hassle) */}
                  <TableCell className="text-right pr-3">
                    <PatientActions patient={patient} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Scroll footer info */}
        <div className="p-2.5 px-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Total: <strong>{patients.length}</strong> patient{patients.length === 1 ? "" : "s"} listed
          </span>
          {patients.length > 10 && (
            <span className="text-slate-400 text-[11px]">
              Scroll table above to view all patients
            </span>
          )}
        </div>
      </div>

      {/* Mobile Card List View (Visible on mobile screens - also scrollable) */}
      <div className="md:hidden max-h-[520px] overflow-y-auto space-y-3 pr-1">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                    {patient.id}
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
                  {patient.sex} &bull; {patient.age} yrs old &bull; Born {patient.birthdate}
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
                <span className="font-mono text-[11px] truncate">{patient.contact}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-slate-400" />
                Last: {patient.lastVisit}
              </span>
              <div className="flex items-center gap-1">
                <Link href={`/patients/${patient.id}`}>
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                    <Eye className="h-3 w-3 mr-1 text-teal-700" />
                    View
                  </Button>
                </Link>
                <Link href={`/consultations/new?patientId=${patient.id}`}>
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2 text-sky-700">
                    <Stethoscope className="h-3 w-3 mr-1" />
                    Consult
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
