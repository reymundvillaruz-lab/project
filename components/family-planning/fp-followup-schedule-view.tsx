"use client";

import * as React from "react";
import {
  CalendarClock,
  Search,
  Filter,
  X,
  Calendar,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Eye,
  Plus,
  Clock,
  AlertCircle,
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  FPClient,
  FPFollowUp,
  FPFollowUpStatus,
} from "@/types/family-planning";
import { FPFollowUpStatusBadge } from "./fp-status-badge";
import { computeFollowUpStatus, getTodayDateString } from "@/lib/family-planning-utils";

interface FollowUpRowItem {
  followUp: FPFollowUp;
  client: FPClient;
  computedStatus: FPFollowUpStatus;
}

interface FPFollowUpScheduleViewProps {
  clients: FPClient[];
  onViewClient: (client: FPClient, defaultTab?: string) => void;
  onReschedule: (client: FPClient, followUp: FPFollowUp) => void;
  onUpdateStatus: (
    client: FPClient,
    followUpId: string,
    status: FPFollowUpStatus
  ) => void;
  onScheduleNew: () => void;
}

export function FPFollowUpScheduleView({
  clients,
  onViewClient,
  onReschedule,
  onUpdateStatus,
  onScheduleNew,
}: FPFollowUpScheduleViewProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const PAGE_SIZE = 10;

  // Flatten all follow-ups across clients
  const allFollowUps = React.useMemo<FollowUpRowItem[]>(() => {
    const list: FollowUpRowItem[] = [];

    clients.forEach((client) => {
      // 1. Follow-ups array
      (client.followUps || []).forEach((fu) => {
        const computedStatus = computeFollowUpStatus(fu.nextServiceDate, fu.status);
        list.push({
          followUp: fu,
          client,
          computedStatus,
        });
      });

      // 2. Fallback: if client has nextFollowUpDate but empty followUps array
      if (
        client.nextFollowUpDate &&
        (!client.followUps || client.followUps.length === 0)
      ) {
        const fallbackFu: FPFollowUp = {
          id: `FU-${client.id}-initial`,
          clientId: client.id,
          clientName: client.fullName,
          method: client.currentMethod,
          lastServiceDate: client.lastServiceDate || client.registrationDate,
          nextServiceDate: client.nextFollowUpDate,
          provider: client.provider,
          status: client.followUpStatus || "Scheduled",
          notes: "Initial registration follow-up",
        };
        const computedStatus = computeFollowUpStatus(
          fallbackFu.nextServiceDate,
          fallbackFu.status
        );
        list.push({
          followUp: fallbackFu,
          client,
          computedStatus,
        });
      }
    });

    // Sort by nextServiceDate ascending (closest upcoming / overdue first)
    return list.sort((a, b) =>
      a.followUp.nextServiceDate.localeCompare(b.followUp.nextServiceDate)
    );
  }, [clients]);

  // Filtering
  const filteredFollowUps = React.useMemo(() => {
    return allFollowUps.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.client.fullName.toLowerCase().includes(q);
        const matchesId = item.client.id.toLowerCase().includes(q);
        const matchesMethod = item.followUp.method.toLowerCase().includes(q);
        const matchesProvider = item.followUp.provider.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesMethod && !matchesProvider) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== "all") {
        if (statusFilter === "Due" && item.computedStatus !== "Due") return false;
        if (statusFilter === "Scheduled" && item.computedStatus !== "Scheduled") return false;
        if (statusFilter === "Overdue" && item.computedStatus !== "Overdue") return false;
        if (statusFilter === "Completed" && item.computedStatus !== "Completed") return false;
        if (statusFilter === "Cancelled" && item.computedStatus !== "Cancelled") return false;
      }

      return true;
    });
  }, [allFollowUps, searchQuery, statusFilter]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredFollowUps.length]);

  const totalPages = Math.max(1, Math.ceil(filteredFollowUps.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedFollowUps = React.useMemo(() => {
    const startIndex = (safePage - 1) * PAGE_SIZE;
    return filteredFollowUps.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredFollowUps, safePage]);

  const hasActiveFilters = searchQuery.trim() !== "" || statusFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  // Status counts for badge tabs
  const counts = React.useMemo(() => {
    let due = 0;
    let scheduled = 0;
    let overdue = 0;
    let completed = 0;

    allFollowUps.forEach((item) => {
      if (item.computedStatus === "Due") due++;
      if (item.computedStatus === "Scheduled") scheduled++;
      if (item.computedStatus === "Overdue") overdue++;
      if (item.computedStatus === "Completed") completed++;
    });

    return { total: allFollowUps.length, due, scheduled, overdue, completed };
  }, [allFollowUps]);

  return (
    <div className="space-y-4">
      {/* Search, Filter buttons and Schedule Action */}
      <Card className="border border-slate-200 shadow-xs">
        <CardHeader className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search by client name, ID, or provider..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs h-9"
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

              {/* Status Pills */}
              <div className="flex items-center gap-1.5 text-xs">
                <Button
                  variant={statusFilter === "all" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                  className="h-8 text-xs px-2.5"
                >
                  All ({counts.total})
                </Button>

                <Button
                  variant={statusFilter === "Due" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter("Due")}
                  className="h-8 text-xs px-2.5 text-amber-700 hover:text-amber-800"
                >
                  Due Today ({counts.due})
                </Button>

                <Button
                  variant={statusFilter === "Scheduled" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter("Scheduled")}
                  className="h-8 text-xs px-2.5 text-blue-700 hover:text-blue-800"
                >
                  Upcoming ({counts.scheduled})
                </Button>

                <Button
                  variant={statusFilter === "Overdue" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter("Overdue")}
                  className="h-8 text-xs px-2.5 text-rose-700 hover:text-rose-800"
                >
                  Overdue ({counts.overdue})
                </Button>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8 text-xs text-slate-500 hover:text-slate-900"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            <Button
              size="sm"
              onClick={onScheduleNew}
              className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs h-9 gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Schedule Follow-up
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {allFollowUps.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={CalendarClock}
                title="No Follow-up Appointments Scheduled"
                description="The follow-up schedule is currently empty. Follow-ups are automatically tracked when family planning clients are enrolled or service visits are logged."
                action={{
                  label: "+ Schedule Follow-up",
                  onClick: onScheduleNew,
                }}
              />
            </div>
          ) : filteredFollowUps.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={Search}
                title="No Matching Follow-ups Found"
                description="No follow-up entries match your current search and filter criteria. Try adjusting or clearing your filters."
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
                    <TableHead className="w-[200px] font-semibold text-slate-700">
                      Client
                    </TableHead>
                    <TableHead className="w-[160px] font-semibold text-slate-700">
                      Method / Service
                    </TableHead>
                    <TableHead className="w-[120px] font-semibold text-slate-700">
                      Last Service Date
                    </TableHead>
                    <TableHead className="w-[120px] font-semibold text-slate-700">
                      Next Service Date
                    </TableHead>
                    <TableHead className="w-[140px] font-semibold text-slate-700">
                      Provider
                    </TableHead>
                    <TableHead className="w-[140px] font-semibold text-slate-700">
                      Status
                    </TableHead>
                    <TableHead className="w-[90px] text-right font-semibold text-slate-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedFollowUps.map(({ followUp, client, computedStatus }) => (
                    <TableRow key={followUp.id} className="hover:bg-slate-50/70">
                      {/* Client Column */}
                      <TableCell>
                        <div className="space-y-0.5">
                          <button
                            onClick={() => onViewClient(client, "overview")}
                            className="font-semibold text-slate-900 hover:text-teal-700 hover:underline text-left block"
                          >
                            {client.fullName}
                          </button>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                            <span>{client.id}</span>
                            <span>&bull;</span>
                            <span>{client.contactNumber}</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Method / Service */}
                      <TableCell>
                        <span className="font-medium text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/50">
                          {followUp.method}
                        </span>
                      </TableCell>

                      {/* Last Service Date */}
                      <TableCell className="text-slate-600 font-mono">
                        {followUp.lastServiceDate || "-"}
                      </TableCell>

                      {/* Next Service Date */}
                      <TableCell className="font-semibold text-slate-900 font-mono">
                        {followUp.nextServiceDate}
                      </TableCell>

                      {/* Provider */}
                      <TableCell className="text-slate-700">
                        {followUp.provider}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <FPFollowUpStatusBadge
                          status={computedStatus}
                          date={followUp.nextServiceDate}
                        />
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
                              onClick={() => onViewClient(client, "follow-ups")}
                              className="text-xs gap-1.5"
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-500" />
                              View Client Follow-ups
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => onReschedule(client, followUp)}
                              className="text-xs gap-1.5"
                            >
                              <Calendar className="h-3.5 w-3.5 text-slate-500" />
                              Reschedule Follow-up
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() =>
                                onUpdateStatus(client, followUp.id, "Completed")
                              }
                              className="text-xs gap-1.5 text-emerald-700 focus:text-emerald-700"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Mark as Completed
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                onUpdateStatus(client, followUp.id, "Cancelled")
                              }
                              className="text-xs gap-1.5 text-rose-700 focus:text-rose-700"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Cancel Follow-up
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* 10-Item Follow-up Pagination Bar */}
            <Pagination
              currentPage={safePage}
              totalItems={filteredFollowUps.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
              itemName="follow-up visits"
            />
          </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
