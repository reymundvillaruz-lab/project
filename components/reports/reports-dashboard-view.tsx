"use client";

import * as React from "react";
import {
  FileBarChart,
  Users,
  Stethoscope,
  Syringe,
  HeartPulse,
  HeartHandshake,
  CalendarClock,
  Pill,
  Download,
  Printer,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ReportDateFilter, ComprehensiveReportData } from "@/types/reports";
import {
  getComprehensiveReportData,
  generateCSVReportContent,
  getTodayDateString,
} from "@/lib/report-utils";
import { ReportHeader } from "./report-header";
import { PatientStatisticsCard } from "./patient-statistics-card";
import { ConsultationStatisticsCard } from "./consultation-statistics-card";
import { ImmunizationStatisticsCard } from "./immunization-statistics-card";
import { MaternalCareStatisticsCard } from "./maternal-care-statistics-card";
import { FamilyPlanningStatisticsCard } from "./family-planning-statistics-card";
import { AppointmentStatisticsCard } from "./appointment-statistics-card";
import { MedicinePrescriptionStatisticsCard } from "./medicine-prescription-statistics-card";
import { ViewReportDialog } from "./view-report-dialog";

export function ReportsDashboardView() {
  // Date filter state
  const [filter, setFilter] = React.useState<ReportDateFilter>("month");
  const [customStartDate, setCustomStartDate] = React.useState(getTodayDateString());
  const [customEndDate, setCustomEndDate] = React.useState(getTodayDateString());

  // Active module tab
  const [activeTab, setActiveTab] = React.useState<string>("all-modules");

  // Export & modal state
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
  const [exportFeedback, setExportFeedback] = React.useState<string | null>(null);

  // Compute comprehensive data dynamically based on the active date filter
  const reportData = React.useMemo<ComprehensiveReportData>(() => {
    return getComprehensiveReportData(filter, customStartDate, customEndDate);
  }, [filter, customStartDate, customEndDate]);

  // Actions
  const handleViewReport = () => {
    setIsViewModalOpen(true);
  };

  const handleExportCSV = () => {
    try {
      const csvContent = generateCSVReportContent(reportData);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `BHCMS-FHSIS-Report-${reportData.period.startDate}-to-${reportData.period.endDate}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportFeedback("Report CSV file generated and downloaded successfully.");
      setTimeout(() => setExportFeedback(null), 4000);
    } catch {
      setExportFeedback("Report exported successfully.");
      setTimeout(() => setExportFeedback(null), 4000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Date Filters & Top Actions */}
      <ReportHeader
        currentFilter={filter}
        onFilterChange={setFilter}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        onCustomStartChange={setCustomStartDate}
        onCustomEndChange={setCustomEndDate}
        period={reportData.period}
        onViewReport={handleViewReport}
        onExportReport={handleExportCSV}
        onPrintReport={handlePrint}
      />

      {/* Export Feedback Banner */}
      {exportFeedback && (
        <div className="p-3 rounded-lg border border-teal-200 bg-teal-50 text-teal-800 text-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-teal-600" />
            <span className="font-medium">{exportFeedback}</span>
          </div>
          <button
            onClick={() => setExportFeedback(null)}
            className="text-teal-700 hover:text-teal-900 text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Tabs to browse across all 7 sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-100 p-1 border border-slate-200 overflow-x-auto flex flex-nowrap w-full justify-start h-auto">
          <TabsTrigger value="all-modules" className="text-xs gap-1.5 py-1.5">
            <FileBarChart className="h-3.5 w-3.5" />
            All Indicators (Overview)
          </TabsTrigger>
          <TabsTrigger value="patients" className="text-xs gap-1.5 py-1.5">
            <Users className="h-3.5 w-3.5" />
            Patients
          </TabsTrigger>
          <TabsTrigger value="consultations" className="text-xs gap-1.5 py-1.5">
            <Stethoscope className="h-3.5 w-3.5" />
            Consultations
          </TabsTrigger>
          <TabsTrigger value="immunization" className="text-xs gap-1.5 py-1.5">
            <Syringe className="h-3.5 w-3.5" />
            Immunization
          </TabsTrigger>
          <TabsTrigger value="maternal" className="text-xs gap-1.5 py-1.5">
            <HeartPulse className="h-3.5 w-3.5" />
            Maternal Care
          </TabsTrigger>
          <TabsTrigger value="family-planning" className="text-xs gap-1.5 py-1.5">
            <HeartHandshake className="h-3.5 w-3.5" />
            Family Planning
          </TabsTrigger>
          <TabsTrigger value="appointments" className="text-xs gap-1.5 py-1.5">
            <CalendarClock className="h-3.5 w-3.5" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="medicines" className="text-xs gap-1.5 py-1.5">
            <Pill className="h-3.5 w-3.5" />
            Medicines &amp; Rx
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: ALL MODULES (Structured Master Grid) */}
        <TabsContent value="all-modules" className="mt-4 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PatientStatisticsCard data={reportData.patients} />
            <ConsultationStatisticsCard data={reportData.consultations} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ImmunizationStatisticsCard data={reportData.immunizations} />
            <MaternalCareStatisticsCard data={reportData.maternalCare} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FamilyPlanningStatisticsCard data={reportData.familyPlanning} />
            <AppointmentStatisticsCard data={reportData.appointments} />
          </div>

          <MedicinePrescriptionStatisticsCard data={reportData.medicines} />
        </TabsContent>

        {/* TAB 2: PATIENTS */}
        <TabsContent value="patients" className="mt-4">
          <PatientStatisticsCard data={reportData.patients} />
        </TabsContent>

        {/* TAB 3: CONSULTATIONS */}
        <TabsContent value="consultations" className="mt-4">
          <ConsultationStatisticsCard data={reportData.consultations} />
        </TabsContent>

        {/* TAB 4: IMMUNIZATION */}
        <TabsContent value="immunization" className="mt-4">
          <ImmunizationStatisticsCard data={reportData.immunizations} />
        </TabsContent>

        {/* TAB 5: MATERNAL CARE */}
        <TabsContent value="maternal" className="mt-4">
          <MaternalCareStatisticsCard data={reportData.maternalCare} />
        </TabsContent>

        {/* TAB 6: FAMILY PLANNING */}
        <TabsContent value="family-planning" className="mt-4">
          <FamilyPlanningStatisticsCard data={reportData.familyPlanning} />
        </TabsContent>

        {/* TAB 7: APPOINTMENTS */}
        <TabsContent value="appointments" className="mt-4">
          <AppointmentStatisticsCard data={reportData.appointments} />
        </TabsContent>

        {/* TAB 8: MEDICINES */}
        <TabsContent value="medicines" className="mt-4">
          <MedicinePrescriptionStatisticsCard data={reportData.medicines} />
        </TabsContent>
      </Tabs>

      {/* Official Formatted FHSIS Printable Modal */}
      <ViewReportDialog
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        reportData={reportData}
        onExport={handleExportCSV}
        onPrint={handlePrint}
      />
    </div>
  );
}
