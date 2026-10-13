"use client";

import * as React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ImmunizationStatusBadge } from "./status-badge";
import {
  PatientImmunizationAnalyticsRow,
  NipPatientRecord,
} from "./types";
import {
  Search,
  Eye,
  Syringe,
  History,
  Filter,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ImmunizationTableProps {
  rows: PatientImmunizationAnalyticsRow[];
  patientRecords: NipPatientRecord[];
  onOpenRecordModal: () => void;
  onViewRecord: (recordId: string) => void;
  onEditRecord: (recordId: string) => void;
  onViewHistory: (recordId: string) => void;
}

export function ImmunizationTable({
  rows,
  patientRecords,
  onOpenRecordModal,
  onViewRecord,
  onEditRecord,
  onViewHistory,
}: ImmunizationTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [completionFilter, setCompletionFilter] = React.useState("ALL");
  const [addressFilter, setAddressFilter] = React.useState("ALL");

  // Derive unique addresses / puroks for filter
  const uniqueAddresses = React.useMemo(() => {
    const addresses = new Set<string>();
    rows.forEach((r) => {
      if (r.address) addresses.add(r.address);
    });
    return Array.from(addresses).sort();
  }, [rows]);

  // Filtering logic
  const filteredRows = React.useMemo(() => {
    return rows.filter((row) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = row.patientName.toLowerCase().includes(query);
        const matchesPhic = row.phicNumber.toLowerCase().includes(query);
        const matchesAddress = row.address.toLowerCase().includes(query);
        const matchesMother = row.motherName?.toLowerCase().includes(query);
        if (!matchesName && !matchesPhic && !matchesAddress && !matchesMother) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== "ALL") {
        if (row.overallStatus !== statusFilter) {
          return false;
        }
      }

      // 3. Completion Progress Filter
      if (completionFilter !== "ALL") {
        if (completionFilter === "COMPLETE" && row.completionRate < 100) return false;
        if (
          completionFilter === "IN_PROGRESS" &&
          (row.completionRate === 0 || row.completionRate === 100)
        )
          return false;
        if (completionFilter === "UNIMMUNIZED" && row.completionRate > 0) return false;
      }

      // 4. Address Filter
      if (addressFilter !== "ALL") {
        if (row.address !== addressFilter) {
          return false;
        }
      }

      return true;
    });
  }, [rows, searchQuery, statusFilter, completionFilter, addressFilter]);

  const hasActiveFilters =
    Boolean(searchQuery) ||
    statusFilter !== "ALL" ||
    completionFilter !== "ALL" ||
    addressFilter !== "ALL";

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setCompletionFilter("ALL");
    setAddressFilter("ALL");
  };

  return (
    <Card className="border-slate-200 shadow-xs">
      <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
        <div className="flex flex-col gap-3">
          {/* Top row: Search & Filter indicators */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by patient name, PHIC #, address/purok..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs h-9 bg-slate-50/50"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Filter row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100">
            {/* Immunization Status Filter */}
            <div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 text-xs bg-white"
              >
                <option value="ALL">All Immunization Statuses</option>
                <option value="Fully Immunized">Fully Immunized (FIC)</option>
                <option value="Partially Immunized">Partially Immunized</option>
                <option value="Due">Has Due Vaccines</option>
                <option value="Overdue">Has Overdue Vaccines</option>
                <option value="Not Started">Not Started</option>
              </Select>
            </div>

            {/* Completion Progress Filter */}
            <div>
              <Select
                value={completionFilter}
                onChange={(e) => setCompletionFilter(e.target.value)}
                className="h-8 text-xs bg-white"
              >
                <option value="ALL">All Progress Levels</option>
                <option value="COMPLETE">Fully Completed (100%)</option>
                <option value="IN_PROGRESS">In Progress (1% – 99%)</option>
                <option value="UNIMMUNIZED">Unimmunized (0%)</option>
              </Select>
            </div>

            {/* Address / Purok Filter */}
            <div>
              <Select
                value={addressFilter}
                onChange={(e) => setAddressFilter(e.target.value)}
                className="h-8 text-xs bg-white"
                disabled={uniqueAddresses.length === 0}
              >
                <option value="ALL">All Puroks / Addresses</option>
                {uniqueAddresses.map((addr) => (
                  <option key={addr} value={addr}>
                    {addr}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* If no registered patients at all in the system */}
        {rows.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Syringe}
              title="No immunization records yet."
              description="Record an immunization to get started. Track infant vaccines, schedules, and health measurements following DOH NIP guidelines."
              action={{
                label: "Record Immunization",
                onClick: onOpenRecordModal,
              }}
            />
          </div>
        ) : filteredRows.length === 0 ? (
          /* If records exist but filters matched 0 */
          <div className="p-8">
            <EmptyState
              icon={Filter}
              title="No matching immunization records found."
              description="No patient records matched your search query or selected filters. Try resetting the filters."
              action={{
                label: "Reset Filters",
                onClick: handleResetFilters,
              }}
            />
          </div>
        ) : (
          /* Scrollable Patient Analytics Table with 10-item limit view */
          <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-slate-100/95 backdrop-blur-xs z-10 border-b border-slate-200">
                <TableRow>
                  <TableHead className="w-[220px]">Patient</TableHead>
                  <TableHead className="w-[110px]">Age / Sex</TableHead>
                  <TableHead className="w-[230px]">Immunization Progress</TableHead>
                  <TableHead className="w-[170px]">Last Administered</TableHead>
                  <TableHead className="w-[180px]">Next Due Schedule</TableHead>
                  <TableHead className="w-[130px]">Growth / Vitals</TableHead>
                  <TableHead className="w-[180px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Patient Name & Details */}
                    <TableCell>
                      <div>
                        <span
                          className="font-semibold text-slate-900 block hover:text-teal-700 cursor-pointer"
                          onClick={() => onViewRecord(row.recordId)}
                          title="Click to view NIP immunization card"
                        >
                          {row.patientName}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                          {row.phicNumber && <span>PHIC: {row.phicNumber}</span>}
                          {row.phicNumber && row.address && <span>•</span>}
                          {row.address && <span className="truncate max-w-[130px]">{row.address}</span>}
                        </div>
                      </div>
                    </TableCell>

                    {/* Age & Sex */}
                    <TableCell className="whitespace-nowrap">
                      <div className="text-slate-800 font-medium text-xs">
                        {row.age || "—"}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {row.sex ? `${row.sex}` : ""}
                        {row.sex && row.birthdate ? " • " : ""}
                        {row.birthdate || ""}
                      </div>
                    </TableCell>

                    {/* Immunization Analytics Progress */}
                    <TableCell>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800">
                            {row.completedDoses} / {row.totalDoses} Doses
                          </span>
                          <span className="font-mono text-[11px] font-medium text-slate-500">
                            {row.completionRate}%
                          </span>
                        </div>

                        {/* Visual Progress Bar */}
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={cn(
                              "h-2 rounded-full transition-all duration-300",
                              row.completionRate === 100
                                ? "bg-emerald-600"
                                : row.completionRate >= 50
                                ? "bg-teal-600"
                                : row.completionRate > 0
                                ? "bg-sky-500"
                                : "bg-slate-300"
                            )}
                            style={{
                              width: `${row.completionRate > 0 ? Math.max(row.completionRate, 5) : 0}%`,
                            }}
                          />
                        </div>

                        {/* Status Badges */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                          <ImmunizationStatusBadge status={row.overallStatus} />
                          {row.overdueDoses > 0 && (
                            <Badge className="bg-rose-50 text-rose-700 border-rose-300 text-[10px] px-1.5 py-0">
                              <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                              {row.overdueDoses} Overdue
                            </Badge>
                          )}
                          {row.dueDoses > 0 && (
                            <Badge className="bg-amber-50 text-amber-700 border-amber-300 text-[10px] px-1.5 py-0">
                              <Clock className="h-2.5 w-2.5 mr-0.5" />
                              {row.dueDoses} Due
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Last Vaccine Administered */}
                    <TableCell>
                      {row.lastVaccineGiven ? (
                        <div className="text-xs">
                          <div className="font-medium text-slate-900 flex items-center gap-1">
                            <span>{row.lastVaccineGiven.vaccineName}</span>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              {row.lastVaccineGiven.dose}
                            </Badge>
                          </div>
                          <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                            {row.lastVaccineGiven.dateGiven}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No doses given yet</span>
                      )}
                    </TableCell>

                    {/* Next Due Vaccine Schedule */}
                    <TableCell>
                      {row.overallStatus === "Fully Immunized" ? (
                        <div className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>All Doses Complete</span>
                        </div>
                      ) : row.nextDueVaccine ? (
                        <div className="text-xs">
                          <div className="font-medium text-slate-900 flex items-center gap-1">
                            <span>{row.nextDueVaccine.vaccineName}</span>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-slate-300">
                              {row.nextDueVaccine.dose}
                            </Badge>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {row.nextDueVaccine.nextDue ? (
                              <span className="font-mono text-amber-700 font-medium">
                                Due: {row.nextDueVaccine.nextDue}
                              </span>
                            ) : (
                              <span>Target: {row.nextDueVaccine.targetSchedule}</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </TableCell>

                    {/* Growth / Health Measurements */}
                    <TableCell className="text-xs text-slate-600 whitespace-nowrap">
                      {row.measurements ? (
                        <div className="space-y-0.5">
                          {row.measurements.weightKg && (
                            <div>
                              <span className="text-slate-400">Wt:</span>{" "}
                              <span className="font-medium text-slate-800">{row.measurements.weightKg} kg</span>
                            </div>
                          )}
                          {row.measurements.heightCm && (
                            <div>
                              <span className="text-slate-400">Ht:</span>{" "}
                              <span className="font-medium text-slate-800">{row.measurements.heightCm} cm</span>
                            </div>
                          )}
                          {!row.measurements.weightKg && !row.measurements.heightCm && (
                            <span className="text-slate-400 italic">—</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </TableCell>

                    {/* Action Buttons: Direct inline buttons, NO dropdown scroll hassle */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewRecord(row.recordId)}
                          className="h-7 px-2 text-xs font-medium text-teal-700 border-teal-200 hover:bg-teal-50 hover:text-teal-800"
                          title="View NIP Immunization Card"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Card
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditRecord(row.recordId)}
                          className="h-7 px-2 text-xs font-medium text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                          title="Record / Update Vaccines"
                        >
                          <Syringe className="h-3.5 w-3.5 mr-1 text-teal-600" />
                          Log Dose
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewHistory(row.recordId)}
                          className="h-7 px-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                          title="View Patient History Timeline"
                        >
                          <History className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Footer info */}
        {rows.length > 0 && (
          <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              Showing <strong>{filteredRows.length}</strong> of <strong>{rows.length}</strong> registered patients (10 visible limit with scroll)
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-teal-700 hover:underline font-medium"
              >
                Clear active filters
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
