import * as React from "react";
import {
  FileBarChart,
  Calendar,
  Download,
  Printer,
  Eye,
  Filter,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ReportDateFilter, ReportDateRange } from "@/types/reports";

interface ReportHeaderProps {
  currentFilter: ReportDateFilter;
  onFilterChange: (filter: ReportDateFilter) => void;
  customStartDate: string;
  customEndDate: string;
  onCustomStartChange: (date: string) => void;
  onCustomEndChange: (date: string) => void;
  period: ReportDateRange;
  onViewReport: () => void;
  onExportReport: () => void;
  onPrintReport: () => void;
}

export function ReportHeader({
  currentFilter,
  onFilterChange,
  customStartDate,
  customEndDate,
  onCustomStartChange,
  onCustomEndChange,
  period,
  onViewReport,
  onExportReport,
  onPrintReport,
}: ReportHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Title & Action Buttons Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl flex items-center gap-2">
            <FileBarChart className="h-6 w-6 text-teal-700" />
            Health Reports &amp; Public Health Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Field Health Services Information System (FHSIS) &bull; Demographic coverage, morbidity, and primary care indicators.
          </p>
        </div>

        {/* Action Buttons: View Report, Export, Print */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewReport}
            className="h-8.5 text-xs gap-1.5 text-slate-700 hover:text-slate-900"
          >
            <Eye className="h-3.5 w-3.5 text-teal-700" />
            View Report
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onExportReport}
            className="h-8.5 text-xs gap-1.5 text-slate-700 hover:text-slate-900"
          >
            <Download className="h-3.5 w-3.5 text-teal-700" />
            Export
          </Button>

          <Button
            size="sm"
            onClick={onPrintReport}
            className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs h-8.5 gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            Print
          </Button>
        </div>
      </div>

      {/* Date Filters Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1 shrink-0">
            <Filter className="h-3.5 w-3.5" />
            Period:
          </span>

          <Button
            variant={currentFilter === "today" ? "default" : "ghost"}
            size="sm"
            onClick={() => onFilterChange("today")}
            className={`text-xs h-7.5 px-3 ${
              currentFilter === "today"
                ? "bg-teal-700 text-white shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Today
          </Button>

          <Button
            variant={currentFilter === "week" ? "default" : "ghost"}
            size="sm"
            onClick={() => onFilterChange("week")}
            className={`text-xs h-7.5 px-3 ${
              currentFilter === "week"
                ? "bg-teal-700 text-white shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            This Week
          </Button>

          <Button
            variant={currentFilter === "month" ? "default" : "ghost"}
            size="sm"
            onClick={() => onFilterChange("month")}
            className={`text-xs h-7.5 px-3 ${
              currentFilter === "month"
                ? "bg-teal-700 text-white shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            This Month
          </Button>

          <Button
            variant={currentFilter === "year" ? "default" : "ghost"}
            size="sm"
            onClick={() => onFilterChange("year")}
            className={`text-xs h-7.5 px-3 ${
              currentFilter === "year"
                ? "bg-teal-700 text-white shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            This Year
          </Button>

          <Button
            variant={currentFilter === "custom" ? "default" : "ghost"}
            size="sm"
            onClick={() => onFilterChange("custom")}
            className={`text-xs h-7.5 px-3 ${
              currentFilter === "custom"
                ? "bg-teal-700 text-white shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Custom Range
          </Button>
        </div>

        {/* Custom Range Date Pickers */}
        {currentFilter === "custom" ? (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">From</span>
            <Input
              type="date"
              value={customStartDate}
              onChange={(e) => onCustomStartChange(e.target.value)}
              className="text-xs h-7.5 w-36"
            />
            <span className="text-slate-400">To</span>
            <Input
              type="date"
              value={customEndDate}
              onChange={(e) => onCustomEndChange(e.target.value)}
              className="text-xs h-7.5 w-36"
            />
          </div>
        ) : (
          <Badge
            variant="outline"
            className="text-xs font-mono text-teal-800 bg-teal-50 border-teal-200"
          >
            {period.label}
          </Badge>
        )}
      </div>
    </div>
  );
}
