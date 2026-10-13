import * as React from "react";
import {
  Search,
  Filter,
  X,
  Eye,
  Edit3,
  History,
  MoreVertical,
  Calendar,
  CalendarClock,
  UserCheck,
  Plus,
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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  FPClient,
  FPFiltersState,
  FPClientType,
  FPMethod,
  FPClientStatus,
} from "@/types/family-planning";
import {
  FPClientStatusBadge,
  FPClientTypeBadge,
  FPFollowUpStatusBadge,
} from "./fp-status-badge";
import { computeFollowUpStatus, getTodayDateString } from "@/lib/family-planning-utils";

interface FPClientListProps {
  clients: FPClient[];
  onViewDetails: (client: FPClient) => void;
  onEditClient: (client: FPClient) => void;
  onViewServiceHistory: (client: FPClient) => void;
  onScheduleFollowUp: (client: FPClient) => void;
  onNewClient: () => void;
}

export function FPClientList({
  clients,
  onViewDetails,
  onEditClient,
  onViewServiceHistory,
  onScheduleFollowUp,
  onNewClient,
}: FPClientListProps) {
  const [filters, setFilters] = React.useState<FPFiltersState>({
    searchQuery: "",
    clientType: "all",
    method: "all",
    status: "all",
    followUpDateFilter: "all",
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, clientType: e.target.value as FPFiltersState["clientType"] }));
  };

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, method: e.target.value as FPFiltersState["method"] }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, status: e.target.value as FPFiltersState["status"] }));
  };

  const handleFollowUpDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      followUpDateFilter: e.target.value as FPFiltersState["followUpDateFilter"],
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      searchQuery: "",
      clientType: "all",
      method: "all",
      status: "all",
      followUpDateFilter: "all",
    });
  };

  const isFiltered =
    filters.searchQuery.trim() !== "" ||
    filters.clientType !== "all" ||
    filters.method !== "all" ||
    filters.status !== "all" ||
    filters.followUpDateFilter !== "all";

  // Filtering logic
  const filteredClients = React.useMemo(() => {
    const today = new Date();
    const todayStr = getTodayDateString();

    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - dayOfWeek));
    const startOfWeekStr = startOfWeek.toISOString().split("T")[0];
    const endOfWeekStr = endOfWeek.toISOString().split("T")[0];

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    return clients.filter((client) => {
      // 1. Search query: Name or ID
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesName = client.fullName.toLowerCase().includes(query);
        const matchesId = client.id.toLowerCase().includes(query);
        const matchesPhilhealth = client.philhealthNo?.toLowerCase().includes(query);
        const matchesAddress = client.address.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesPhilhealth && !matchesAddress) {
          return false;
        }
      }

      // 2. Filter by Client Type
      if (filters.clientType !== "all" && client.clientType !== filters.clientType) {
        return false;
      }

      // 3. Filter by Method
      if (filters.method !== "all" && client.currentMethod !== filters.method) {
        return false;
      }

      // 4. Filter by Status
      if (filters.status !== "all" && client.status !== filters.status) {
        return false;
      }

      // 5. Filter by Follow-up Date
      if (filters.followUpDateFilter !== "all") {
        const date = client.nextFollowUpDate;
        if (!date) return false;

        if (filters.followUpDateFilter === "today") {
          if (date !== todayStr) return false;
        } else if (filters.followUpDateFilter === "this_week") {
          if (date < startOfWeekStr || date > endOfWeekStr) return false;
        } else if (filters.followUpDateFilter === "this_month") {
          const d = new Date(date);
          if (
            isNaN(d.getTime()) ||
            d.getFullYear() !== currentYear ||
            d.getMonth() !== currentMonth
          ) {
            return false;
          }
        } else if (filters.followUpDateFilter === "upcoming") {
          if (date <= todayStr) return false;
        } else if (filters.followUpDateFilter === "overdue") {
          if (date >= todayStr) return false;
        }
      }

      return true;
    });
  }, [clients, filters]);

  return (
    <Card className="border-slate-200 shadow-xs">
      <CardHeader className="p-5 pb-3 border-b border-slate-100">
        <div className="flex flex-col gap-3">
          {/* Header Controls: Search + Filters + New Client Button */}
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full xl:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                id="fpSearchQuery"
                name="fpSearchQuery"
                value={filters.searchQuery}
                onChange={handleSearchChange}
                placeholder="Search client name or Client ID..."
                className="pl-9 text-xs h-9 bg-white"
                aria-label="Search family planning clients by name or ID"
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
              {/* Client Type Filter */}
              <div className="w-40">
                <Select
                  id="fpClientTypeFilter"
                  name="fpClientTypeFilter"
                  value={filters.clientType}
                  onChange={handleTypeChange}
                  className="h-9 text-xs"
                  aria-label="Filter by client type"
                >
                  <option value="all">All Client Types</option>
                  <option value="New Acceptor">New Acceptor</option>
                  <option value="Current User">Current User</option>
                  <option value="Changing Method">Changing Method</option>
                  <option value="Changing Clinic">Changing Clinic</option>
                  <option value="Dropout/Restart">Dropout/Restart</option>
                </Select>
              </div>

              {/* Method Filter */}
              <div className="w-48">
                <Select
                  id="fpMethodFilter"
                  name="fpMethodFilter"
                  value={filters.method}
                  onChange={handleMethodChange}
                  className="h-9 text-xs"
                  aria-label="Filter by contraceptive method"
                >
                  <option value="all">All FP Methods</option>
                  <option value="Subdermal Implant">Subdermal Implant</option>
                  <option value="Interval IUD">Interval IUD</option>
                  <option value="Postpartum IUD">Postpartum IUD</option>
                  <option value="Injectable (DMPA)">Injectable (DMPA)</option>
                  <option value="Oral Contraceptive Pills (COC)">Pills (COC)</option>
                  <option value="Oral Contraceptive Pills (POP)">Pills (POP)</option>
                  <option value="Male Condom">Male Condom</option>
                  <option value="LAM (Lactational Amenorrhea)">LAM</option>
                  <option value="Standard Days Method (SDM)">SDM (CycleBeads)</option>
                  <option value="Bilateral Tubal Ligation (BTL)">BTL (Ligation)</option>
                  <option value="No-Scalpel Vasectomy (NSV)">NSV (Vasectomy)</option>
                  <option value="Other Method">Other Method</option>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="w-36">
                <Select
                  id="fpStatusFilter"
                  name="fpStatusFilter"
                  value={filters.status}
                  onChange={handleStatusChange}
                  className="h-9 text-xs"
                  aria-label="Filter by client status"
                >
                  <option value="all">All Statuses</option>
                  <option value="Active User">Active User</option>
                  <option value="Follow-up Due">Follow-up Due</option>
                  <option value="Discontinued">Discontinued</option>
                  <option value="Referred">Referred</option>
                </Select>
              </div>

              {/* Follow-up Date Filter */}
              <div className="w-44">
                <Select
                  id="fpFollowUpFilter"
                  name="fpFollowUpFilter"
                  value={filters.followUpDateFilter}
                  onChange={handleFollowUpDateChange}
                  className="h-9 text-xs"
                  aria-label="Filter by follow-up schedule"
                >
                  <option value="all">All Follow-ups</option>
                  <option value="today">Due Today</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="overdue">Overdue</option>
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

              {/* New Record Button */}
              <Button
                size="sm"
                onClick={onNewClient}
                className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs h-9 ml-auto"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                New Family Planning Record
              </Button>
            </div>
          </div>

          {/* Result Count Tracker */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>
              Showing <strong className="text-slate-800">{filteredClients.length}</strong> of{" "}
              <strong className="text-slate-800">{clients.length}</strong> registered FP client
              {clients.length === 1 ? "" : "s"}
            </span>
            {isFiltered && (
              <span className="text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Active Filter Applied
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0">
        {filteredClients.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={UserCheck}
              title={isFiltered ? "No Matching FP Clients Found" : "No Family Planning Clients Enrolled"}
              description={
                isFiltered
                  ? "We couldn't find any family planning client matching your active filters. Try clearing your search or filter options."
                  : "The family planning registry is currently empty for this session. Click below to enroll a client using DOH FP Form 1."
              }
              action={
                isFiltered
                  ? {
                      label: "Clear All Filters",
                      onClick: handleClearFilters,
                    }
                  : {
                      label: "+ New Family Planning Record",
                      onClick: onNewClient,
                    }
              }
            />
          </div>
        ) : (
          <div className="rounded-md border border-slate-200 bg-white overflow-hidden shadow-2xs">
            <div className="max-h-[560px] overflow-y-auto overflow-x-auto relative">
              <Table>
                <TableHeader className="sticky top-0 bg-slate-100/95 backdrop-blur-xs z-10 shadow-2xs">
                  <TableRow className="border-b border-slate-200 hover:bg-slate-100">
                    <TableHead className="w-28 font-bold text-slate-700 py-3">Client ID</TableHead>
                    <TableHead className="font-bold text-slate-700">Client Name</TableHead>
                    <TableHead className="w-16 font-bold text-slate-700">Age</TableHead>
                    <TableHead className="w-36 font-bold text-slate-700">Client Type</TableHead>
                    <TableHead className="w-44 font-bold text-slate-700">Current/Accepted Method</TableHead>
                    <TableHead className="w-32 font-bold text-slate-700">Last Service Date</TableHead>
                    <TableHead className="w-36 font-bold text-slate-700">Next Follow-up</TableHead>
                    <TableHead className="w-28 font-bold text-slate-700">Status</TableHead>
                    <TableHead className="w-24 text-right font-bold text-slate-700 pr-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => {
                    const followUpStatus = computeFollowUpStatus(
                      client.nextFollowUpDate,
                      client.followUpStatus
                    );

                    return (
                      <TableRow
                        key={client.id}
                        className="hover:bg-slate-50/80 transition-colors border-b border-slate-100"
                      >
                        {/* 1. Client ID */}
                        <TableCell className="font-mono text-xs font-semibold text-slate-800">
                          <button
                            type="button"
                            onClick={() => onViewDetails(client)}
                            className="hover:text-teal-700 hover:underline cursor-pointer"
                          >
                            {client.id}
                          </button>
                        </TableCell>

                        {/* 2. Client Name */}
                        <TableCell>
                          <div className="flex flex-col">
                            <button
                              type="button"
                              onClick={() => onViewDetails(client)}
                              className="text-left font-semibold text-xs text-slate-900 hover:text-teal-700 hover:underline cursor-pointer"
                            >
                              {client.fullName}
                            </button>
                            <span className="text-[11px] text-slate-400">
                              {client.address || "Barangay resident"}
                            </span>
                          </div>
                        </TableCell>

                        {/* 3. Age */}
                        <TableCell className="text-slate-600 font-mono text-xs">
                          {client.age}y
                        </TableCell>

                        {/* 4. Client Type */}
                        <TableCell>
                          <FPClientTypeBadge type={client.clientType} />
                        </TableCell>

                        {/* 5. Current/Accepted Method */}
                        <TableCell className="text-xs text-slate-800 font-medium">
                          <span className="truncate max-w-[170px] block" title={client.currentMethod}>
                            {client.currentMethod || "No method selected"}
                          </span>
                        </TableCell>

                        {/* 6. Last Service Date */}
                        <TableCell className="text-slate-600 text-xs">
                          {client.lastServiceDate ? (
                            <div className="flex items-center gap-1 font-mono">
                              <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                              <span>{client.lastServiceDate}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px] italic">No service yet</span>
                          )}
                        </TableCell>

                        {/* 7. Next Follow-up */}
                        <TableCell className="text-xs">
                          {client.nextFollowUpDate ? (
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1 font-mono font-medium text-slate-800">
                                <CalendarClock className="h-3 w-3 text-teal-600 shrink-0" />
                                <span>{client.nextFollowUpDate}</span>
                              </div>
                              <div className="mt-0.5">
                                <FPFollowUpStatusBadge status={followUpStatus} />
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px] italic">Not scheduled</span>
                          )}
                        </TableCell>

                        {/* 8. Status */}
                        <TableCell>
                          <FPClientStatusBadge status={client.status} />
                        </TableCell>

                        {/* 9. Actions */}
                        <TableCell className="text-right pr-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors">
                              <MoreVertical className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 text-xs">
                              <DropdownMenuLabel>Client Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => onViewDetails(client)}
                                className="cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5 mr-2 text-teal-700" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onEditClient(client)}
                                className="cursor-pointer"
                              >
                                <Edit3 className="h-3.5 w-3.5 mr-2 text-sky-700" />
                                Edit Record
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => onViewServiceHistory(client)}
                                className="cursor-pointer"
                              >
                                <History className="h-3.5 w-3.5 mr-2 text-amber-700" />
                                Service History
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onScheduleFollowUp(client)}
                                className="cursor-pointer"
                              >
                                <CalendarClock className="h-3.5 w-3.5 mr-2 text-teal-700" />
                                Schedule Follow-up
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
