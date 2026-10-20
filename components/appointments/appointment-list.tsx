import * as React from "react";
import {
  CalendarClock,
  Search,
  Filter,
  X,
  Plus,
  Eye,
  Edit3,
  CheckCircle2,
  CheckCheck,
  XCircle,
  UserX,
  Trash2,
  Calendar,
  Clock,
  User,
  Stethoscope,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Appointment,
  AppointmentStatus,
  AppointmentFiltersState,
} from "@/types/appointment";
import { AppointmentStatusBadge } from "./appointment-status-badge";
import { Pagination } from "@/components/ui/pagination";
import { useSharedPatients } from "@/lib/patient-sync";
import {
  formatAppointmentDate,
  formatTime12h,
  isDateToday,
  isDateUpcoming,
  PURPOSE_OPTIONS,
  STANDARD_BHW_OPTIONS,
} from "@/lib/appointment-utils";

interface AppointmentListProps {
  appointments: Appointment[];
  activeTimeframe: "all" | "today" | "upcoming" | "completed";
  onTimeframeChange: (timeframe: "all" | "today" | "upcoming" | "completed") => void;
  onViewDetails: (appointment: Appointment) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onUpdateStatus: (appointmentId: string, status: AppointmentStatus) => void;
  onDeleteAppointment: (appointmentId: string) => void;
  onNewAppointment: () => void;
}

export function AppointmentList({
  appointments,
  activeTimeframe,
  onTimeframeChange,
  onViewDetails,
  onEditAppointment,
  onUpdateStatus,
  onDeleteAppointment,
  onNewAppointment,
}: AppointmentListProps) {
  const { isPatientRegistered } = useSharedPatients();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [purposeFilter, setPurposeFilter] = React.useState<string>("all");
  const [bhwFilter, setBhwFilter] = React.useState<string>("all");
  const [dateFilter, setDateFilter] = React.useState<string>("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [appointmentToDelete, setAppointmentToDelete] = React.useState<Appointment | null>(null);
  const PAGE_SIZE = 10;

  // Filter appointments
  const filteredAppointments = React.useMemo(() => {
    return appointments.filter((apt) => {
      // 1. Timeframe filter (Today, Upcoming, Completed, All)
      if (activeTimeframe === "today") {
        if (!isDateToday(apt.date) || apt.status === "Cancelled") return false;
      } else if (activeTimeframe === "upcoming") {
        if (!isDateUpcoming(apt.date) || apt.status === "Cancelled" || apt.status === "Completed") {
          return false;
        }
      } else if (activeTimeframe === "completed") {
        if (apt.status !== "Completed") return false;
      }

      // 2. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = apt.patientName.toLowerCase().includes(q);
        const matchesId = apt.patientId ? apt.patientId.toLowerCase().includes(q) : false;
        const matchesContact = apt.patientContact ? apt.patientContact.includes(q) : false;
        const matchesPurpose = apt.purpose.toLowerCase().includes(q);
        const matchesBHW = apt.assignedBHW.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesContact && !matchesPurpose && !matchesBHW) {
          return false;
        }
      }

      // 3. Status filter
      if (statusFilter !== "all" && apt.status !== statusFilter) {
        return false;
      }

      // 4. Purpose filter
      if (purposeFilter !== "all" && apt.purpose !== purposeFilter) {
        return false;
      }

      // 5. BHW filter
      if (bhwFilter !== "all" && apt.assignedBHW !== bhwFilter) {
        return false;
      }

      // 6. Specific Date filter
      if (dateFilter && apt.date !== dateFilter) {
        return false;
      }

      return true;
    });
  }, [
    appointments,
    activeTimeframe,
    searchQuery,
    statusFilter,
    purposeFilter,
    bhwFilter,
    dateFilter,
  ]);

  // Sort chronologically (date ascending, then time ascending)
  const sortedAppointments = React.useMemo(() => {
    return [...filteredAppointments].sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.time.localeCompare(b.time);
    });
  }, [filteredAppointments]);

  // Reset to first page whenever filters or timeframe change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredAppointments.length, activeTimeframe]);

  const totalPages = Math.max(1, Math.ceil(sortedAppointments.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedAppointments = React.useMemo(() => {
    const startIndex = (safePage - 1) * PAGE_SIZE;
    return sortedAppointments.slice(startIndex, startIndex + PAGE_SIZE);
  }, [sortedAppointments, safePage]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    purposeFilter !== "all" ||
    bhwFilter !== "all" ||
    dateFilter !== "";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPurposeFilter("all");
    setBhwFilter("all");
    setDateFilter("");
  };

  // Counts for tabs
  const timeframeCounts = React.useMemo(() => {
    let today = 0;
    let upcoming = 0;
    let completed = 0;

    appointments.forEach((apt) => {
      if (isDateToday(apt.date) && apt.status !== "Cancelled") today++;
      if (isDateUpcoming(apt.date) && apt.status !== "Cancelled" && apt.status !== "Completed") {
        upcoming++;
      }
      if (apt.status === "Completed") completed++;
    });

    return { all: appointments.length, today, upcoming, completed };
  }, [appointments]);

  return (
    <div className="space-y-4">
      {/* Timeframe Quick Filters Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
          <Button
            variant={activeTimeframe === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTimeframeChange("all")}
            className={`text-xs h-8 ${activeTimeframe === "all" ? "bg-teal-700 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            All Appointments ({timeframeCounts.all})
          </Button>

          <Button
            variant={activeTimeframe === "today" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTimeframeChange("today")}
            className={`text-xs h-8 ${activeTimeframe === "today" ? "bg-teal-700 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            Today ({timeframeCounts.today})
          </Button>

          <Button
            variant={activeTimeframe === "upcoming" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTimeframeChange("upcoming")}
            className={`text-xs h-8 ${activeTimeframe === "upcoming" ? "bg-teal-700 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            Upcoming ({timeframeCounts.upcoming})
          </Button>

          <Button
            variant={activeTimeframe === "completed" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTimeframeChange("completed")}
            className={`text-xs h-8 ${activeTimeframe === "completed" ? "bg-teal-700 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            Completed ({timeframeCounts.completed})
          </Button>
        </div>
      </div>

      {/* Filter Card */}
      <Card className="border border-slate-200 shadow-xs">
        <CardHeader className="p-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 items-center">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search patient name, ID, or purpose..."
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
            <div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs h-8.5"
              >
                <option value="all">Status: All</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="No Show">No Show</option>
              </Select>
            </div>

            {/* Purpose Filter */}
            <div>
              <Select
                value={purposeFilter}
                onChange={(e) => setPurposeFilter(e.target.value)}
                className="text-xs h-8.5"
              >
                <option value="all">Purpose: All</option>
                {PURPOSE_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
            </div>

            {/* Clear / Date Filter */}
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="text-xs h-8.5"
                title="Filter by exact date"
              />
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8.5 text-xs text-slate-500 hover:text-slate-900 shrink-0 px-2"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {appointments.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={CalendarClock}
                title="No Appointments Scheduled"
                description="The appointment list is currently empty. Book a consultation, immunization, or follow-up visit to start tracking clinic appointments."
                action={{
                  label: "+ Schedule First Appointment",
                  onClick: onNewAppointment,
                }}
              />
            </div>
          ) : sortedAppointments.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={Search}
                title="No Matching Appointments Found"
                description="No appointments match your active filter and search terms. Adjust or reset your filters to view scheduled visits."
                action={{
                  label: "Clear All Filters",
                  onClick: clearFilters,
                }}
              />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
              <Table className="text-xs">
                <TableHeader className="bg-slate-50 border-y border-slate-200">
                  <TableRow>
                    <TableHead className="w-[150px] font-semibold text-slate-700">
                      Date &amp; Time
                    </TableHead>
                    <TableHead className="w-[200px] font-semibold text-slate-700">
                      Patient
                    </TableHead>
                    <TableHead className="w-[180px] font-semibold text-slate-700">
                      Purpose / Service
                    </TableHead>
                    <TableHead className="w-[160px] font-semibold text-slate-700">
                      Assigned BHW
                    </TableHead>
                    <TableHead className="w-[120px] font-semibold text-slate-700">
                      Status
                    </TableHead>
                    <TableHead className="min-w-[150px] font-semibold text-slate-700">
                      Notes
                    </TableHead>
                    <TableHead className="min-w-[190px] text-right font-semibold text-slate-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAppointments.map((apt) => {
                    const inRegistry = isPatientRegistered(apt.patientId || apt.patientName);
                    return (
                      <TableRow key={apt.id} className="hover:bg-slate-50/70">
                        {/* Date & Time */}
                        <TableCell>
                          <div className="space-y-0.5">
                            <span className="font-semibold text-slate-900 block font-mono">
                              {apt.date}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                              <Clock className="h-3 w-3 text-slate-400" />
                              {formatTime12h(apt.time)}
                            </span>
                          </div>
                        </TableCell>

                        {/* Patient */}
                        <TableCell>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <button
                                onClick={() => onViewDetails(apt)}
                                className="font-semibold text-slate-900 hover:text-teal-700 hover:underline text-left block"
                              >
                                {apt.patientName}
                              </button>
                              {inRegistry && (
                                <span
                                  className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200"
                                  title="Verified: Patient record exists in Patient Registry"
                                >
                                  <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                                  In Registry
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                              <span>{apt.patientId || apt.id}</span>
                              {apt.patientContact && (
                                <>
                                  <span>&bull;</span>
                                  <span>{apt.patientContact}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </TableCell>

                      {/* Purpose */}
                      <TableCell>
                        <span className="font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block">
                          {apt.purpose}
                        </span>
                      </TableCell>

                      {/* Assigned BHW */}
                      <TableCell className="text-slate-700 font-medium">
                        {apt.assignedBHW}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <AppointmentStatusBadge status={apt.status} />
                      </TableCell>

                      {/* Notes */}
                      <TableCell className="text-slate-500 max-w-xs truncate">
                        {apt.notes || <span className="text-slate-300">-</span>}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right py-2 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => onViewDetails(apt)}
                            className="h-7 px-2 text-xs text-teal-700 hover:bg-teal-50 hover:text-teal-900"
                            title="View Details"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            <span>View</span>
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => onEditAppointment(apt)}
                            className="h-7 px-2 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            title="Edit Appointment"
                          >
                            <Edit3 className="h-3.5 w-3.5 mr-1" />
                            <span>Edit</span>
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setAppointmentToDelete(apt)}
                            className="h-7 px-2 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                            title="Delete Appointment"
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
            </div>

            {/* 10-Appointment Pagination Bar */}
            <Pagination
              currentPage={safePage}
              totalItems={sortedAppointments.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
              itemName="appointments"
            />
          </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!appointmentToDelete}
        onOpenChange={(open) => {
          if (!open) setAppointmentToDelete(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-rose-700 flex items-center gap-2 text-base">
              <Trash2 className="h-5 w-5 text-rose-600" />
              Delete Appointment
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 pt-1 leading-relaxed">
              Are you sure you want to permanently delete the appointment for{" "}
              <strong className="text-slate-900">{appointmentToDelete?.patientName}</strong> on{" "}
              <strong>{appointmentToDelete?.date}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAppointmentToDelete(null)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                if (appointmentToDelete) {
                  onDeleteAppointment(appointmentToDelete.id);
                  setAppointmentToDelete(null);
                }
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
