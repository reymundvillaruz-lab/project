import * as React from "react";
import {
  Pill,
  Search,
  Filter,
  X,
  Plus,
  Eye,
  Printer,
  Edit3,
  CheckCircle2,
  CheckCheck,
  XCircle,
  Calendar,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Prescription, PrescriptionStatus } from "@/types/pharmacy";
import { PrescriptionStatusBadge } from "./prescription-status-badge";
import { Pagination } from "@/components/ui/pagination";
import { useSharedPatients } from "@/lib/patient-sync";
import { getPrescriptionItems } from "@/lib/pharmacy-utils";

interface PrescriptionListProps {
  prescriptions: Prescription[];
  onViewDetails: (prescription: Prescription) => void;
  onEditPrescription: (prescription: Prescription) => void;
  onUpdateStatus: (prescriptionId: string, status: PrescriptionStatus) => void;
  onDeletePrescription: (prescriptionId: string) => void;
  onNewPrescription: () => void;
}

export function PrescriptionList({
  prescriptions,
  onViewDetails,
  onEditPrescription,
  onUpdateStatus,
  onDeletePrescription,
  onNewPrescription,
}: PrescriptionListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filteredPrescriptions = React.useMemo(() => {
    return prescriptions.filter((rx) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesPatient = rx.patientName.toLowerCase().includes(q);
        const matchesId = rx.id.toLowerCase().includes(q);
        const matchesMed = (rx.medicine || "").toLowerCase().includes(q);
        const matchesDoc = rx.prescriber.toLowerCase().includes(q);
        const matchesItem = (rx.items || []).some((item) =>
          item.drug.toLowerCase().includes(q)
        );
        if (!matchesPatient && !matchesId && !matchesMed && !matchesDoc && !matchesItem) {
          return false;
        }
      }

      // Status
      if (statusFilter !== "all" && rx.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [prescriptions, searchQuery, statusFilter]);

  const { patients: registryPatients } = useSharedPatients();
  const registeredPatientKeys = React.useMemo(() => {
    const set = new Set<string>();
    registryPatients.forEach((p) => {
      set.add(p.id.toLowerCase().trim());
      set.add(`${p.firstName} ${p.lastName}`.toLowerCase().trim());
    });
    return set;
  }, [registryPatients]);

  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredPrescriptions.length / PAGE_SIZE) || 1;
  const paginatedPrescriptions = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredPrescriptions.slice(start, start + PAGE_SIZE);
  }, [filteredPrescriptions, currentPage]);

  const hasActiveFilters = searchQuery.trim() !== "" || statusFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  return (
    <Card className="border border-slate-200 shadow-xs">
      <CardHeader className="p-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2.5">
            {/* Search */}
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search patient, prescription ID, medicine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs h-8.5"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="w-48">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs h-8.5"
              >
                <option value="all">Status: All</option>
                <option value="Active">Active (Pending)</option>
                <option value="Dispensed">Dispensed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </Select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8.5 text-xs text-slate-500 hover:text-slate-900 px-2"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {prescriptions.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Pill}
              title="No Prescriptions Issued"
              description="No prescriptions or dispensed medicines have been recorded. When a doctor or health worker issues medication, record it here."
              action={{
                label: "+ Issue First Prescription",
                onClick: onNewPrescription,
              }}
            />
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Search}
              title="No Matching Prescriptions Found"
              description="No prescriptions match your current filter settings. Try adjusting or clearing your search criteria."
              action={{
                label: "Clear All Filters",
                onClick: clearFilters,
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="text-xs">
              <TableHeader className="bg-slate-50 border-y border-slate-200">
                <TableRow>
                  <TableHead className="w-[110px] font-semibold text-slate-700">
                    Rx ID
                  </TableHead>
                  <TableHead className="min-w-[170px] font-semibold text-slate-700">
                    Patient &amp; Demographics
                  </TableHead>
                  <TableHead className="w-[95px] font-semibold text-slate-700">
                    Date
                  </TableHead>
                  <TableHead className="w-[160px] font-semibold text-slate-700">
                    Doctor / Prescriber
                  </TableHead>
                  <TableHead className="w-[110px] font-semibold text-slate-700">
                    Status
                  </TableHead>
                  <TableHead className="min-w-[190px] text-right font-semibold text-slate-700">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPrescriptions.map((rx) => {
                  const isRegistered =
                    (rx.patientId && registeredPatientKeys.has(rx.patientId.toLowerCase().trim())) ||
                    registeredPatientKeys.has(rx.patientName.toLowerCase().trim());
                  const items = getPrescriptionItems(rx);

                  return (
                    <TableRow key={rx.id} className="hover:bg-slate-50/70">
                      {/* Prescription ID */}
                      <TableCell className="font-mono font-semibold text-indigo-900 align-middle py-3">
                        {rx.id}
                      </TableCell>

                      {/* Patient */}
                      <TableCell className="align-middle py-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => onViewDetails(rx)}
                              className="font-semibold text-slate-900 hover:text-indigo-700 hover:underline text-left block"
                            >
                              {rx.patientName}
                            </button>
                            {isRegistered && (
                              <span
                                className="inline-flex items-center text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full"
                                title="Verified in Patient Registry"
                              >
                                ✓ In Registry
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono space-x-1.5">
                            {rx.patientIdNumber && <span>{rx.patientIdNumber}</span>}
                            {rx.age !== undefined && rx.sex && (
                              <span>• {rx.age}yo {rx.sex}</span>
                            )}
                            {rx.occupation && <span>• {rx.occupation}</span>}
                          </div>
                          {items.length > 0 && (
                            <div className="pt-0.5">
                              <span
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-700 bg-indigo-50/80 border border-indigo-100 rounded px-1.5 py-0.5 max-w-[240px] truncate"
                                title={items.map((i) => `${i.drug} (${i.unit || "Tablet"}) - ${i.dosagePerDay}`).join("; ")}
                              >
                                💊 {items.map((i) => i.drug).join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="font-mono text-slate-700 align-middle py-3 whitespace-nowrap">
                        {rx.date}
                      </TableCell>

                      {/* Prescriber */}
                      <TableCell className="text-slate-700 font-medium align-middle py-3">
                        <div>{rx.prescriber}</div>
                        {rx.doctorLicenseNumber && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            {rx.doctorLicenseNumber}
                          </div>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="align-middle py-3">
                        <PrescriptionStatusBadge status={rx.status} />
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right align-middle py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => onViewDetails(rx)}
                            className="h-7 px-2 text-xs text-teal-700 hover:bg-teal-50 hover:text-teal-900"
                            title="View Prescription"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            <span>View</span>
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => onEditPrescription(rx)}
                            className="h-7 px-2 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            title="Edit Prescription"
                          >
                            <Edit3 className="h-3.5 w-3.5 mr-1" />
                            <span>Edit</span>
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => onDeletePrescription(rx.id)}
                            className="h-7 px-2 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                            title="Delete Prescription"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            <span>Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-100">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredPrescriptions.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
