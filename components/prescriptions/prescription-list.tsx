import * as React from "react";
import {
  Pill,
  Search,
  Filter,
  X,
  Plus,
  Eye,
  Edit3,
  CheckCircle2,
  CheckCheck,
  XCircle,
  MoreVertical,
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
        const matchesMed = rx.medicine.toLowerCase().includes(q);
        const matchesDoc = rx.prescriber.toLowerCase().includes(q);
        if (!matchesPatient && !matchesId && !matchesMed && !matchesDoc) {
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
                  <TableHead className="w-[120px] font-semibold text-slate-700">
                    Prescription ID
                  </TableHead>
                  <TableHead className="w-[180px] font-semibold text-slate-700">
                    Patient
                  </TableHead>
                  <TableHead className="w-[110px] font-semibold text-slate-700">
                    Date
                  </TableHead>
                  <TableHead className="w-[160px] font-semibold text-slate-700">
                    Prescriber / BHW
                  </TableHead>
                  <TableHead className="min-w-[180px] font-semibold text-slate-700">
                    Medicine
                  </TableHead>
                  <TableHead className="w-[100px] font-semibold text-slate-700">
                    Dosage
                  </TableHead>
                  <TableHead className="w-[160px] font-semibold text-slate-700">
                    Frequency
                  </TableHead>
                  <TableHead className="w-[90px] font-semibold text-slate-700">
                    Duration
                  </TableHead>
                  <TableHead className="w-[110px] font-semibold text-slate-700">
                    Status
                  </TableHead>
                  <TableHead className="w-[80px] text-right font-semibold text-slate-700">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrescriptions.map((rx) => (
                  <TableRow key={rx.id} className="hover:bg-slate-50/70">
                    {/* Prescription ID */}
                    <TableCell className="font-mono font-semibold text-slate-900">
                      {rx.id}
                    </TableCell>

                    {/* Patient */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <button
                          onClick={() => onViewDetails(rx)}
                          className="font-semibold text-slate-900 hover:text-teal-700 hover:underline text-left block"
                        >
                          {rx.patientName}
                        </button>
                        {rx.patientId && (
                          <span className="font-mono text-[11px] text-slate-500 block">
                            {rx.patientId}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="font-mono text-slate-700">
                      {rx.date}
                    </TableCell>

                    {/* Prescriber */}
                    <TableCell className="text-slate-700 font-medium">
                      {rx.prescriber}
                    </TableCell>

                    {/* Medicine */}
                    <TableCell>
                      <span className="font-semibold text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/50 inline-block">
                        {rx.medicine}
                      </span>
                    </TableCell>

                    {/* Dosage */}
                    <TableCell className="font-medium text-slate-800">
                      {rx.dosage}
                    </TableCell>

                    {/* Frequency */}
                    <TableCell className="text-slate-600 truncate max-w-xs">
                      {rx.frequency}
                    </TableCell>

                    {/* Duration */}
                    <TableCell className="font-medium text-slate-700 font-mono">
                      {rx.duration}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <PrescriptionStatusBadge status={rx.status} />
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-slate-900"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-xs">
                          <DropdownMenuItem
                            onClick={() => onViewDetails(rx)}
                            className="text-xs gap-1.5"
                          >
                            <Eye className="h-3.5 w-3.5 text-slate-500" />
                            View Prescription Slip
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => onEditPrescription(rx)}
                            className="text-xs gap-1.5"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                            Edit Prescription
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="text-[10px] text-slate-400 font-semibold uppercase">
                            Dispense Status
                          </DropdownMenuLabel>

                          {rx.status !== "Dispensed" && (
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus(rx.id, "Dispensed")}
                              className="text-xs gap-1.5 text-teal-800"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                              Mark as Dispensed
                            </DropdownMenuItem>
                          )}

                          {rx.status !== "Completed" && (
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus(rx.id, "Completed")}
                              className="text-xs gap-1.5 text-emerald-800"
                            >
                              <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
                              Mark as Completed
                            </DropdownMenuItem>
                          )}

                          {rx.status !== "Cancelled" && (
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus(rx.id, "Cancelled")}
                              className="text-xs gap-1.5 text-rose-800"
                            >
                              <XCircle className="h-3.5 w-3.5 text-rose-600" />
                              Cancel Order
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => onDeletePrescription(rx.id)}
                            className="text-xs gap-1.5 text-rose-600 focus:text-rose-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete Record
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
