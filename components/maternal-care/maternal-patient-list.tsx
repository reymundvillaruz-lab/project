import * as React from "react";
import {
  Search,
  Filter,
  X,
  Eye,
  Edit3,
  Trash2,
  History,
  Calendar,
  UserCheck,
  CalendarClock,
  HeartPulse,
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
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
import { MaternalRecord, MaternalFiltersState, MaternalStatus } from "@/types/maternal-care";
import { MaternalStatusBadge } from "./maternal-status-badge";
import { Pagination } from "@/components/ui/pagination";
import { useSharedPatients } from "@/lib/patient-sync";

interface MaternalPatientListProps {
  records: MaternalRecord[];
  onViewRecord: (record: MaternalRecord) => void;
  onEditRecord: (record: MaternalRecord) => void;
  onViewPrenatalHistory: (record: MaternalRecord) => void;
  onDeleteRecord?: (recordId: string) => void;
  onNewRecord: () => void;
}

export function MaternalPatientList({
  records,
  onViewRecord,
  onEditRecord,
  onViewPrenatalHistory,
  onDeleteRecord,
  onNewRecord,
}: MaternalPatientListProps) {
  const [recordToDelete, setRecordToDelete] = React.useState<MaternalRecord | null>(null);
  const [filters, setFilters] = React.useState<MaternalFiltersState>({
    searchQuery: "",
    status: "all",
    appointmentFilter: "all",
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, status: e.target.value as MaternalFiltersState["status"] }));
  };

  const handleAppointmentFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      appointmentFilter: e.target.value as MaternalFiltersState["appointmentFilter"],
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      searchQuery: "",
      status: "all",
      appointmentFilter: "all",
    });
  };

  const isFiltered =
    filters.searchQuery.trim() !== "" ||
    filters.status !== "all" ||
    filters.appointmentFilter !== "all";

  // Filter logic
  const filteredRecords = React.useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    // Helper for this week
    const dayOfWeek = today.getDay(); // 0 is Sunday
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - dayOfWeek));
    const startOfWeekStr = startOfWeek.toISOString().split("T")[0];
    const endOfWeekStr = endOfWeek.toISOString().split("T")[0];

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    return records.filter((rec) => {
      // 1. Search by patient name (case-insensitive)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesName = rec.patientName.toLowerCase().includes(query);
        const matchesId = rec.id.toLowerCase().includes(query);
        const matchesBhw = rec.assignedBhw.toLowerCase().includes(query);
        const matchesAddress = rec.address.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesBhw && !matchesAddress) {
          return false;
        }
      }

      // 2. Filter by status
      if (filters.status !== "all" && rec.status !== filters.status) {
        return false;
      }

      // 3. Filter by appointment date
      if (filters.appointmentFilter !== "all") {
        const aptDate = rec.nextAppointmentDate;
        if (!aptDate) {
          return false;
        }

        if (filters.appointmentFilter === "today") {
          if (aptDate !== todayStr) return false;
        } else if (filters.appointmentFilter === "this_week") {
          if (aptDate < startOfWeekStr || aptDate > endOfWeekStr) return false;
        } else if (filters.appointmentFilter === "this_month") {
          const d = new Date(aptDate);
          if (
            isNaN(d.getTime()) ||
            d.getFullYear() !== currentYear ||
            d.getMonth() !== currentMonth
          ) {
            return false;
          }
        } else if (filters.appointmentFilter === "upcoming") {
          if (aptDate < todayStr) return false;
        } else if (filters.appointmentFilter === "overdue") {
          // Overdue if appointment date is in past and status is Follow-up Due or appointment not completed
          const isOverdue =
            aptDate < todayStr && (rec.status === "Follow-up Due" || rec.status === "Active");
          if (!isOverdue) return false;
        }
      }

      return true;
    });
  }, [records, filters]);

  const { patients: registryPatients } = useSharedPatients();
  const registeredPatientNames = React.useMemo(() => {
    return new Set(
      registryPatients.map((p) => `${p.firstName} ${p.lastName}`.toLowerCase().trim())
    );
  }, [registryPatients]);

  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const totalPages = Math.ceil(filteredRecords.length / PAGE_SIZE) || 1;
  const paginatedRecords = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRecords.slice(start, start + PAGE_SIZE);
  }, [filteredRecords, currentPage]);

  return (
    <Card className="border-slate-200 shadow-xs">
      <CardHeader className="p-4 sm:p-5 pb-3 border-b border-slate-100">
        <div className="flex flex-col gap-3">
          {/* Header Controls: Search + Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                id="maternalSearchQuery"
                name="maternalSearchQuery"
                value={filters.searchQuery}
                onChange={handleSearchChange}
                placeholder="Search patient name, ID, or BHW..."
                className="pl-9 text-xs h-9 bg-white"
                aria-label="Search maternal patients by name"
              />
              {filters.searchQuery && (
                <button
                  type="button"
                  onClick={() => setFilters((p) => ({ ...p, searchQuery: "" }))}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns & Clear Button */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <div className="w-36 sm:w-40">
                <Select
                  id="maternalStatusFilter"
                  name="maternalStatusFilter"
                  value={filters.status}
                  onChange={handleStatusChange}
                  className="h-9 text-xs"
                  aria-label="Filter by maternal case status"
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Follow-up Due">Follow-up Due</option>
                  <option value="Completed">Completed</option>
                </Select>
              </div>

              {/* Appointment Date Filter */}
              <div className="w-44 sm:w-48">
                <Select
                  id="maternalAppointmentFilter"
                  name="maternalAppointmentFilter"
                  value={filters.appointmentFilter}
                  onChange={handleAppointmentFilterChange}
                  className="h-9 text-xs"
                  aria-label="Filter by appointment date"
                >
                  <option value="all">All Appointment Dates</option>
                  <option value="today">Today</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="overdue">Overdue / Follow-up Due</option>
                </Select>
              </div>

              {/* Clear Filters Button */}
              {isFiltered && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-9 text-xs text-slate-600 hover:text-slate-900 border-dashed"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Result Count Tracker */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>
              Showing <strong className="text-slate-800">{filteredRecords.length}</strong> of{" "}
              <strong className="text-slate-800">{records.length}</strong> maternal patient record
              {records.length === 1 ? "" : "s"}
            </span>
            {isFiltered && (
              <span className="text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Active Filter Applied
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 sm:p-5 sm:pt-0">
        {filteredRecords.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={HeartPulse}
              title={isFiltered ? "No Matching Maternal Patients" : "No Maternal Records Registered"}
              description={
                isFiltered
                  ? "We couldn't find any patient matching your search query or filter criteria. Try resetting your filters."
                  : "There are currently no expectant mothers enrolled in the maternal care register. Click below to create a new maternal record."
              }
              action={
                isFiltered
                  ? {
                      label: "Clear All Filters",
                      onClick: handleClearFilters,
                    }
                  : {
                      label: "+ New Maternal Record",
                      onClick: onNewRecord,
                    }
              }
            />
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block rounded-md border border-slate-200 bg-white overflow-hidden shadow-2xs">
              <div className="max-h-[540px] overflow-y-auto overflow-x-auto relative">
                <Table>
                  <TableHeader className="sticky top-0 bg-slate-100/95 backdrop-blur-xs z-10 shadow-2xs">
                    <TableRow className="border-b border-slate-200 hover:bg-slate-100">
                      <TableHead className="font-bold text-slate-700 py-3">Patient Name</TableHead>
                      <TableHead className="w-16 font-bold text-slate-700">Age</TableHead>
                      <TableHead className="w-32 font-bold text-slate-700">Pregnancy/Record Date</TableHead>
                      <TableHead className="w-32 font-bold text-slate-700">Last Prenatal Visit</TableHead>
                      <TableHead className="w-36 font-bold text-slate-700">Next Appointment</TableHead>
                      <TableHead className="w-36 font-bold text-slate-700">Assigned BHW</TableHead>
                      <TableHead className="w-32 font-bold text-slate-700">Status</TableHead>
                      <TableHead className="min-w-[190px] text-right font-bold text-slate-700 pr-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRecords.map((record) => {
                      const isRegistered = registeredPatientNames.has(record.patientName.toLowerCase().trim());
                      return (
                        <TableRow
                          key={record.id}
                          className="hover:bg-slate-50/80 transition-colors border-b border-slate-100"
                        >
                          {/* 1. Patient Name */}
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => onViewRecord(record)}
                                  className="text-left font-semibold text-slate-900 hover:text-teal-700 hover:underline cursor-pointer"
                                >
                                  {record.patientName}
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
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                <span className="font-mono text-teal-800 font-medium">{record.id}</span>
                                <span>&bull;</span>
                                <span>EDC: {record.edc || "TBD"}</span>
                              </div>
                            </div>
                          </TableCell>

                        {/* 2. Age */}
                        <TableCell className="text-slate-600 font-mono text-xs">
                          {record.age}y
                        </TableCell>

                        {/* 3. Pregnancy/Record Date */}
                        <TableCell className="text-slate-600 text-xs">
                          <div className="flex flex-col">
                            <span>{record.recordDate}</span>
                            <span className="text-[10px] text-slate-400">
                              G{record.gravida} P{record.para}
                            </span>
                          </div>
                        </TableCell>

                        {/* 4. Last Prenatal Visit */}
                        <TableCell className="text-slate-600 text-xs">
                          {record.lastPrenatalVisit ? (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                              <span>{record.lastPrenatalVisit}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px] italic">No visit yet</span>
                          )}
                        </TableCell>

                        {/* 5. Next Appointment */}
                        <TableCell className="text-slate-600 text-xs">
                          {record.nextAppointmentDate ? (
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1 font-medium text-slate-800">
                                <CalendarClock className="h-3 w-3 text-teal-600 shrink-0" />
                                <span>{record.nextAppointmentDate}</span>
                              </div>
                              {record.status === "Follow-up Due" && (
                                <span className="text-[10px] text-amber-700 font-medium">
                                  Attention required
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px] italic">None scheduled</span>
                          )}
                        </TableCell>

                        {/* 6. Assigned BHW */}
                        <TableCell className="text-slate-700 text-xs">
                          <div className="flex items-center gap-1">
                            <UserCheck className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[130px]" title={record.assignedBhw}>
                              {record.assignedBhw}
                            </span>
                          </div>
                        </TableCell>

                        {/* 7. Status */}
                        <TableCell>
                          <MaternalStatusBadge status={record.status} />
                        </TableCell>

                        {/* 8. Actions */}
                        <TableCell className="text-right pr-3 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => onViewRecord(record)}
                              className="h-7 px-2 text-xs text-teal-700 hover:bg-teal-50 hover:text-teal-900"
                              title="View Record"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              <span>View</span>
                            </Button>

                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => onEditRecord(record)}
                              className="h-7 px-2 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                              title="Edit Record"
                            >
                              <Edit3 className="h-3.5 w-3.5 mr-1" />
                              <span>Edit</span>
                            </Button>

                            {onDeleteRecord && (
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => setRecordToDelete(record)}
                                className="h-7 px-2 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                title="Delete Record"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                <span>Delete</span>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden space-y-3 p-3 pt-0">
              {paginatedRecords.map((record) => {
                const isRegistered = registeredPatientNames.has(record.patientName.toLowerCase().trim());
                return (
                  <div
                    key={record.id}
                    className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                            {record.id}
                          </span>
                          <MaternalStatusBadge status={record.status} />
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap mt-1">
                          <button
                            type="button"
                            onClick={() => onViewRecord(record)}
                            className="block text-left font-semibold text-sm text-slate-900 hover:text-teal-700"
                          >
                            {record.patientName}
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
                        <p className="text-[11px] text-slate-400">
                          {record.age} yrs old &bull; G{record.gravida} P{record.para} &bull; EDC: {record.edc}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Last Visit</span>
                        <span className="font-medium text-slate-800">
                          {record.lastPrenatalVisit || "None recorded"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Next Appointment</span>
                        <span className="font-medium text-teal-800">
                          {record.nextAppointmentDate || "None scheduled"}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="truncate text-[11px]">BHW: {record.assignedBhw}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewRecord(record)}
                          className="h-7 text-xs px-2"
                        >
                          <Eye className="h-3 w-3 mr-1 text-teal-700" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditRecord(record)}
                          className="h-7 text-xs px-2 text-sky-700"
                        >
                          <Edit3 className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        {onDeleteRecord && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setRecordToDelete(record)}
                            className="h-7 text-xs px-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-slate-100">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredRecords.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!recordToDelete}
        onOpenChange={(open) => {
          if (!open) setRecordToDelete(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-rose-700 flex items-center gap-2 text-base">
              <Trash2 className="h-5 w-5 text-rose-600" />
              Delete Maternal Record
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 pt-1 leading-relaxed">
              Are you sure you want to permanently delete the maternal health record for{" "}
              <strong className="text-slate-900">{recordToDelete?.patientName}</strong> (
              <span className="font-mono">{recordToDelete?.id}</span>)? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRecordToDelete(null)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                if (recordToDelete && onDeleteRecord) {
                  onDeleteRecord(recordToDelete.id);
                  setRecordToDelete(null);
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
    </Card>
  );
}
