"use client";

import * as React from "react";
import {
  MONTH_NAMES,
  MonthName,
  ArchiveMonthFolder,
  MonthlyArchivesMap,
  getMonthlyArchives,
  getActiveWorkspaceCounts,
  exportAllArchivesMasterBackup,
  exportArchiveAsJson,
} from "@/lib/services/archive-service";
import { MonthFolderContents } from "./month-folder-contents";
import { ArchiveResetDialog } from "./archive-reset-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  FolderArchive,
  Folder,
  FolderOpen,
  Calendar,
  Search,
  Download,
  Archive,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Database,
  FileCheck2,
} from "lucide-react";

export function MonthlyArchivesView() {
  const now = new Date();
  const currentMonthNum = now.getMonth() + 1; // 1-12
  const currentYearNum = now.getFullYear();

  const [selectedYear, setSelectedYear] = React.useState<number>(currentYearNum);
  const [archives, setArchives] = React.useState<MonthlyArchivesMap>({});
  const [activeCounts, setActiveCounts] = React.useState(getActiveWorkspaceCounts());
  const [selectedFolder, setSelectedFolder] = React.useState<ArchiveMonthFolder | null>(null);
  const [showResetDialog, setShowResetDialog] = React.useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = React.useState<string>("");
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const loadData = React.useCallback(() => {
    setArchives(getMonthlyArchives());
    setActiveCounts(getActiveWorkspaceCounts());
  }, []);

  React.useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener("bhcms:archives-updated", handleUpdate);
    window.addEventListener("bhcms:patients-updated", handleUpdate);
    window.addEventListener("bhcms:consultations-updated", handleUpdate);
    window.addEventListener("bhcms:appointments-updated", handleUpdate);

    return () => {
      window.removeEventListener("bhcms:archives-updated", handleUpdate);
      window.removeEventListener("bhcms:patients-updated", handleUpdate);
      window.removeEventListener("bhcms:consultations-updated", handleUpdate);
      window.removeEventListener("bhcms:appointments-updated", handleUpdate);
    };
  }, [loadData]);

  const handleArchiveSuccess = (folder: ArchiveMonthFolder) => {
    loadData();
    setSelectedFolder(folder);
    setFeedback(
      `All active records successfully archived into ${folder.monthName} ${folder.year}! Active system is reset for new operations.`
    );
    setTimeout(() => setFeedback(null), 5000);
  };

  const currentMonthName = MONTH_NAMES[currentMonthNum - 1] || "Current Month";

  // Years with archives or current year
  const availableYears = React.useMemo(() => {
    const years = new Set<number>([currentYearNum, currentYearNum - 1]);
    Object.values(archives).forEach((a) => {
      if (a.year) years.add(a.year);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [archives, currentYearNum]);

  // Global search results across all archives
  const globalSearchResults = React.useMemo(() => {
    if (!globalSearchQuery.trim()) return [];
    const q = globalSearchQuery.toLowerCase();
    const results: Array<{
      folder: ArchiveMonthFolder;
      type: "Patient" | "Consultation" | "Appointment";
      title: string;
      subtitle: string;
      id: string;
    }> = [];

    Object.values(archives).forEach((folder) => {
      (folder.data.patients || []).forEach((p) => {
        if (
          p.fullName.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          (p.phicNo && p.phicNo.toLowerCase().includes(q))
        ) {
          results.push({
            folder,
            type: "Patient",
            title: p.fullName,
            subtitle: `ID: ${p.id} • ${p.sex}, ${p.age}y • PhilPEN: ${p.healthInfo?.philpenStatus || "Completed"}`,
            id: p.id,
          });
        }
      });

      (folder.data.consultations || []).forEach((c) => {
        if (
          (c.patientName && c.patientName.toLowerCase().includes(q)) ||
          (c.diagnosis && c.diagnosis.toLowerCase().includes(q))
        ) {
          results.push({
            folder,
            type: "Consultation",
            title: `${c.patientName} (${c.diagnosis})`,
            subtitle: `Date: ${c.date} • Attending: ${c.provider}`,
            id: c.id,
          });
        }
      });
    });

    return results;
  }, [archives, globalSearchQuery]);

  // If a specific folder is open, render its file explorer view
  if (selectedFolder) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto pb-10">
        <MonthFolderContents
          folder={selectedFolder}
          onBack={() => {
            setSelectedFolder(null);
            loadData();
          }}
          onRestoreSuccess={() => {
            loadData();
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
              <FolderArchive className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Monthly Records Archive
              </h1>
              <p className="text-xs text-slate-500">
                System records categorized by Month (January – December). Historical files remain safe, searchable, and exportable.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportAllArchivesMasterBackup}
            className="text-xs text-slate-700 hover:bg-slate-100 border-slate-200 shadow-2xs"
            title="Export all month archives into a master JSON backup file"
          >
            <Download className="h-3.5 w-3.5 mr-1.5 text-teal-700" />
            Master Backup (.json)
          </Button>

          <Button
            size="sm"
            onClick={() => setShowResetDialog(true)}
            className="bg-teal-700 hover:bg-teal-800 text-white text-xs gap-1.5 shadow-xs"
          >
            <Archive className="h-3.5 w-3.5" />
            Archive &amp; Reset Active Month
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-lg border border-teal-200 bg-teal-50 text-teal-900 text-xs flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 2. Active Month Operating Card */}
      <div className="rounded-xl border border-teal-200 bg-linear-to-r from-teal-50/70 via-emerald-50/40 to-white p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-teal-950 uppercase tracking-wide">
                Current Active Workspace &bull; {currentMonthName} {currentYearNum}
              </span>
              <Badge variant="outline" className="text-[10px] bg-white text-teal-800 border-teal-300">
                Live System
              </Badge>
            </div>
            <p className="text-xs text-slate-600">
              Active operating tables contain{" "}
              <strong className="text-slate-900">{activeCounts.totalRecords} total records</strong> (
              {activeCounts.patients} patients with PhilPEN, {activeCounts.consultations} consults, {activeCounts.appointments} appts, {activeCounts.prescriptions} prescriptions).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowResetDialog(true)}
              className="text-xs bg-white text-teal-800 border-teal-300 hover:bg-teal-50 shadow-2xs"
            >
              <FolderArchive className="h-3.5 w-3.5 mr-1.5 text-teal-700" />
              Archive {currentMonthName} &amp; Clear Slate
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Global Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Global Archive Search: Search across all months by patient name, ID, or clinical diagnosis..."
          value={globalSearchQuery}
          onChange={(e) => setGlobalSearchQuery(e.target.value)}
          className="pl-9 h-9 text-xs bg-white border-slate-200 shadow-2xs"
        />
      </div>

      {/* Global Search Results Dropdown/Box if query entered */}
      {globalSearchQuery.trim() && (
        <Card className="border-teal-200 shadow-sm bg-white">
          <CardContent className="p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between text-xs font-bold text-teal-900 border-b pb-2">
              <span>Search Results across all monthly archives:</span>
              <span>{globalSearchResults.length} matches found</span>
            </div>
            {globalSearchResults.length === 0 ? (
              <p className="text-slate-400 py-3 text-center">No historical records match &quot;{globalSearchQuery}&quot;.</p>
            ) : (
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {globalSearchResults.map((res, idx) => (
                  <div
                    key={`${res.id}-${idx}`}
                    onClick={() => {
                      setSelectedFolder(res.folder);
                      setGlobalSearchQuery("");
                    }}
                    className="py-2.5 flex items-center justify-between hover:bg-teal-50/60 p-2 rounded cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{res.title}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {res.type}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-slate-500">{res.subtitle}</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-teal-800 font-medium">
                      <span>📁 {res.folder.monthName} {res.folder.year}</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 4. Year Selector Navigation */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Year:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            {availableYears.map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1 text-xs rounded-md font-semibold transition-all ${
                  selectedYear === yr
                    ? "bg-white text-teal-900 shadow-2xs border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Showing 12 Month Folders for <strong className="text-slate-800">{selectedYear}</strong>
        </div>
      </div>

      {/* 5. 12 Month Folders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {MONTH_NAMES.map((monthName, idx) => {
          const monthNum = idx + 1;
          const folderKey = `${selectedYear}-${monthNum.toString().padStart(2, "0")}`;
          const folder = archives[folderKey];
          const isCurrentMonth = selectedYear === currentYearNum && monthNum === currentMonthNum;
          const hasArchive = Boolean(folder && folder.counts.totalRecords > 0);

          return (
            <div
              key={monthName}
              onClick={() => {
                if (folder) {
                  setSelectedFolder(folder);
                } else if (isCurrentMonth) {
                  setShowResetDialog(true);
                }
              }}
              className={`group relative flex flex-col justify-between p-4.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                hasArchive
                  ? "border-teal-200 bg-white hover:border-teal-400 hover:shadow-md"
                  : isCurrentMonth
                  ? "border-sky-300 bg-linear-to-b from-sky-50/60 to-white hover:border-sky-400 hover:shadow-sm"
                  : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300"
              }`}
            >
              {/* Folder Top Visual */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 ${
                      hasArchive
                        ? "bg-teal-100 text-teal-800"
                        : isCurrentMonth
                        ? "bg-sky-100 text-sky-800"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {hasArchive ? (
                      <FolderArchive className="h-5 w-5" />
                    ) : (
                      <Folder className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-900 transition-colors">
                      {monthName}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      {selectedYear}
                    </span>
                  </div>
                </div>

                {/* Status Badges */}
                <div>
                  {hasArchive ? (
                    <Badge variant="outline" className="text-[10px] bg-teal-50 text-teal-800 border-teal-200 font-semibold">
                      {folder.counts.totalRecords} Records
                    </Badge>
                  ) : isCurrentMonth ? (
                    <Badge variant="outline" className="text-[10px] bg-sky-50 text-sky-800 border-sky-200 font-semibold">
                      Current Month
                    </Badge>
                  ) : (
                    <span className="text-[10px] text-slate-400">Empty</span>
                  )}
                </div>
              </div>

              {/* Folder Details / Metrics */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-1">
                {hasArchive ? (
                  <>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>Patients &amp; PhilPEN:</span>
                      <strong className="text-slate-900">{folder.counts.patients}</strong>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>Consultations:</span>
                      <strong className="text-slate-900">{folder.counts.consultations}</strong>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>Appts &amp; Prescriptions:</span>
                      <strong className="text-slate-900">
                        {folder.counts.appointments + folder.counts.prescriptions}
                      </strong>
                    </div>
                    <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-teal-700">
                      <span>Open Folder</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </>
                ) : isCurrentMonth ? (
                  <>
                    <p className="text-[11px] text-sky-700 leading-tight">
                      Active operations month. {activeCounts.totalRecords} unarchived records.
                    </p>
                    <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-sky-700">
                      <span>Archive &amp; Reset</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </>
                ) : (
                  <p className="text-[11px] text-slate-400 italic py-1">
                    No records archived for this month.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Archive and Reset Dialog */}
      <ArchiveResetDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        onSuccess={handleArchiveSuccess}
        defaultMonth={currentMonthNum}
        defaultYear={currentYearNum}
      />
    </div>
  );
}
