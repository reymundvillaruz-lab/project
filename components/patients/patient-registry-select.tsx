"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  UserCheck,
  CheckCircle2,
  ExternalLink,
  X,
  UserPlus,
  AlertCircle,
  Database,
  MapPin,
  Phone,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { MockPatient } from "@/lib/mock-data/patients";
import { useSharedPatients } from "@/lib/patient-sync";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export interface PatientRegistrySelectProps {
  onSelectPatient: (patient: MockPatient) => void;
  selectedPatient?: MockPatient | null;
  onClearSelection?: () => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}

export function PatientRegistrySelect({
  onSelectPatient,
  selectedPatient,
  onClearSelection,
  label = "Select Registered Patient from Registry",
  placeholder = "Search patient by full name, Patient ID, PhilHealth no., contact...",
  helperText = "Select an existing resident already filled up in the Patient Registry to auto-populate information.",
  required = false,
  className = "",
}: PatientRegistrySelectProps) {
  const { patients, isLoading } = useSharedPatients();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter patients based on search input
  const filteredPatients = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return patients.slice(0, 8); // Show recent 8 patients by default
    }
    const q = searchTerm.toLowerCase().trim();
    return patients
      .filter((p) => {
        const nameMatch = p.fullName.toLowerCase().includes(q);
        const idMatch = p.id.toLowerCase().includes(q);
        const idNumMatch = p.patientIdNumber && p.patientIdNumber.toLowerCase().includes(q);
        const contactMatch = p.contact && p.contact.toLowerCase().includes(q);
        const phicMatch = p.phicNo && p.phicNo.toLowerCase().includes(q);
        const brgyMatch = p.barangay && p.barangay.toLowerCase().includes(q);
        return nameMatch || idMatch || idNumMatch || contactMatch || phicMatch || brgyMatch;
      })
      .slice(0, 10);
  }, [patients, searchTerm]);

  const handleSelect = (patient: MockPatient) => {
    onSelectPatient(patient);
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div className={`space-y-2 ${className}`} ref={containerRef}>
      {/* Label and Helper Header */}
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
        <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
          <Database className="h-3.5 w-3.5 text-teal-700" />
          <span>{label}</span>
          {required && <span className="text-rose-500">*</span>}
        </label>
        <span className="text-[11px] text-teal-800 font-medium">
          {patients.length} patient{patients.length === 1 ? "" : "s"} available in Registry
        </span>
      </div>

      {/* If a patient is selected, show Verified Patient Card */}
      {selectedPatient ? (
        <div className="rounded-lg border-2 border-emerald-300 bg-emerald-50/70 p-3.5 shadow-2xs transition-all">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified: Registered in Patient Registry
                </span>
                <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  {selectedPatient.patientIdNumber || selectedPatient.id}
                </span>
                {selectedPatient.healthInfo?.philpenStatus && (
                  <Badge variant="outline" className="text-[10px] bg-white border-teal-300 text-teal-800">
                    PHILPEN: {selectedPatient.healthInfo.philpenStatus}
                  </Badge>
                )}
              </div>

              <h4 className="text-sm font-bold text-slate-900 mt-1">
                {selectedPatient.fullName}
              </h4>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                <span>
                  {selectedPatient.sex} &bull; {selectedPatient.age} yrs old
                </span>
                {selectedPatient.birthdate && (
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    Born: {selectedPatient.birthdate}
                  </span>
                )}
                {selectedPatient.barangay && (
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    {selectedPatient.barangay}
                  </span>
                )}
                {selectedPatient.contact && (
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Phone className="h-3 w-3 text-slate-400" />
                    {selectedPatient.contact}
                  </span>
                )}
              </div>
            </div>

            {/* Actions for Selected Patient */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/patients/${selectedPatient.id}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-900 bg-white px-2 py-1 rounded border border-teal-200 hover:bg-teal-50"
                title="View complete clinical and registration profile in new tab"
              >
                <ExternalLink className="h-3 w-3" />
                <span className="hidden sm:inline">View Profile</span>
              </Link>
              {onClearSelection && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onClearSelection}
                  className="h-7 px-2 text-xs text-slate-600 hover:text-rose-700 hover:bg-rose-50"
                  title="Clear selection to pick another patient or enter manually"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Change
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Search & Dropdown Picker */
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder}
              className="pl-9 pr-8 text-xs h-9 bg-white border-slate-300 focus:border-teal-500 focus:ring-teal-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Helper caption */}
          {helperText && (
            <p className="text-[11px] text-slate-500 mt-1">{helperText}</p>
          )}

          {/* Search Results Dropdown */}
          {isOpen && (
            <div className="absolute z-50 left-0 right-0 mt-1 max-h-72 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg animate-in fade-in-50 duration-150">
              <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">
                  {searchTerm.trim() ? "Search Results" : "Recent Registered Patients"}
                </span>
                <span>Click a resident to select</span>
              </div>

              {filteredPatients.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {filteredPatients.map((patient) => (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => handleSelect(patient)}
                      className="w-full text-left p-2.5 hover:bg-teal-50/80 transition-colors flex items-start justify-between gap-3 group"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 group-hover:text-teal-900">
                            {patient.fullName}
                          </span>
                          <span className="font-mono text-[10px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                            {patient.patientIdNumber || patient.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span>
                            {patient.sex} &bull; {patient.age}y
                          </span>
                          {patient.barangay && <span>&bull; {patient.barangay}</span>}
                          {patient.contact && (
                            <span className="font-mono">&bull; {patient.contact}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                          In Registry
                        </span>
                        {patient.phicNo && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            PHIC: {patient.phicNo}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-500 space-y-2">
                  <AlertCircle className="h-5 w-5 text-amber-500 mx-auto" />
                  <p>
                    No matching patient registered with &ldquo;
                    <strong className="text-slate-800">{searchTerm}</strong>&rdquo;.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    If this is a new resident, please register them in the Patient Registry first so all modules can access their records.
                  </p>
                  <Link
                    href="/patients/new"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 hover:underline pt-1"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    + Register New Patient in Registry
                  </Link>
                </div>
              )}

              {/* Bottom footer bar */}
              <div className="p-2 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-[11px]">
                <Link
                  href="/patients"
                  target="_blank"
                  className="text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-1 font-medium"
                >
                  <Database className="h-3 w-3" />
                  View Patient Registry
                </Link>
                <Link
                  href="/patients/new"
                  target="_blank"
                  className="text-slate-600 hover:text-teal-800 hover:underline flex items-center gap-1"
                >
                  <UserPlus className="h-3 w-3" />
                  + Register New Patient
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
