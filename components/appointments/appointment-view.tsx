"use client";

import * as React from "react";
import {
  CalendarClock,
  Calendar as CalendarIcon,
  List,
  Plus,
  Clock,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Appointment,
  AppointmentStatus,
  AppointmentDashboardStats,
} from "@/types/appointment";
import {
  calculateAppointmentStats,
  getTodayDateString,
  getStoredAppointments,
  saveStoredAppointments,
} from "@/lib/appointment-utils";
import { AppointmentDashboardStatsView } from "./appointment-dashboard-stats";
import { AppointmentList } from "./appointment-list";
import { AppointmentCalendarView } from "./appointment-calendar-view";
import { NewAppointmentDialog } from "./new-appointment-dialog";
import { AppointmentDetailDialog } from "./appointment-detail-dialog";

export function AppointmentView() {
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);

  // Hydrate from storage on mount and sync from Supabase
  React.useEffect(() => {
    setAppointments(getStoredAppointments());

    import("@/lib/supabase/services/appointments-service").then(
      async ({ fetchAppointmentsFromSupabase }) => {
        try {
          const sbApts = await fetchAppointmentsFromSupabase();
          if (sbApts && sbApts.length > 0) {
            setAppointments(sbApts);
            saveStoredAppointments(sbApts);
          }
        } catch (e) {
          console.warn("Could not fetch appointments from Supabase:", e);
        }
      }
    );
  }, []);

  // Navigation / View modes
  const [viewMode, setViewMode] = React.useState<"list" | "calendar">("list");
  const [activeTimeframe, setActiveTimeframe] = React.useState<
    "all" | "today" | "upcoming" | "completed"
  >("all");

  // Dialog states
  const [isNewDialogOpen, setIsNewDialogOpen] = React.useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = React.useState<Appointment | null>(null);
  const [initialDateForNew, setInitialDateForNew] = React.useState<string | undefined>(undefined);

  const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = React.useState<string | null>(null);

  // Dynamic Dashboard statistics calculated from session appointments
  const dashboardStats = React.useMemo(() => {
    return calculateAppointmentStats(appointments);
  }, [appointments]);

  // Active selected appointment for details
  const activeSelectedAppointment = React.useMemo(() => {
    if (!selectedAppointmentId) return null;
    return appointments.find((apt) => apt.id === selectedAppointmentId) || null;
  }, [appointments, selectedAppointmentId]);

  // ---------------------------------------------------------------------------
  // APPOINTMENT HANDLERS
  // ---------------------------------------------------------------------------
  const handleOpenNewAppointment = (specificDate?: string) => {
    setAppointmentToEdit(null);
    setInitialDateForNew(specificDate || getTodayDateString());
    setIsNewDialogOpen(true);
  };

  const handleOpenEditAppointment = (appointment: Appointment) => {
    setAppointmentToEdit(appointment);
    setInitialDateForNew(undefined);
    setIsNewDialogOpen(true);
  };

  const handleSaveAppointment = (savedApt: Appointment) => {
    setAppointments((prev) => {
      const existsIndex = prev.findIndex((apt) => apt.id === savedApt.id);
      let updated: Appointment[];
      if (existsIndex >= 0) {
        updated = [...prev];
        updated[existsIndex] = savedApt;
      } else {
        updated = [savedApt, ...prev];
      }
      saveStoredAppointments(updated);
      return updated;
    });
  };

  const handleUpdateStatus = (appointmentId: string, status: AppointmentStatus) => {
    setAppointments((prev) => {
      const updated = prev.map((apt) => {
        if (apt.id === appointmentId) {
          return {
            ...apt,
            status,
          };
        }
        return apt;
      });
      saveStoredAppointments(updated);
      return updated;
    });
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    setAppointments((prev) => {
      const updated = prev.filter((apt) => apt.id !== appointmentId);
      saveStoredAppointments(updated);
      return updated;
    });

    // Delete from Supabase in background
    import("@/lib/supabase/client").then(({ supabase }) => {
      supabase.from("appointments").delete().eq("id", appointmentId).then();
    });

    setIsDetailDialogOpen(false);
    setSelectedAppointmentId(null);
  };

  const handleOpenDetails = (appointment: Appointment) => {
    setSelectedAppointmentId(appointment.id);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header & View Mode Switcher */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl flex items-center gap-2">
            <CalendarClock className="h-6 w-6 text-teal-700" />
            Appointment Scheduling &amp; Calendar
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Book patient visits, schedule health worker consultations, and manage daily health station rounds.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle: List vs Calendar */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={`h-8 text-xs gap-1.5 ${
                viewMode === "list"
                  ? "bg-teal-700 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              List View
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className={`h-8 text-xs gap-1.5 ${
                viewMode === "calendar"
                  ? "bg-teal-700 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              Calendar View
            </Button>
          </div>

          <Button
            size="sm"
            onClick={() => handleOpenNewAppointment()}
            className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs h-9 gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Schedule Appointment
          </Button>
        </div>
      </div>

      {/* Appointment Dashboard Summary Cards */}
      <AppointmentDashboardStatsView stats={dashboardStats} />

      {/* Main Content: List or Calendar View */}
      {viewMode === "list" ? (
        <AppointmentList
          appointments={appointments}
          activeTimeframe={activeTimeframe}
          onTimeframeChange={setActiveTimeframe}
          onViewDetails={handleOpenDetails}
          onEditAppointment={handleOpenEditAppointment}
          onUpdateStatus={handleUpdateStatus}
          onDeleteAppointment={handleDeleteAppointment}
          onNewAppointment={() => handleOpenNewAppointment()}
        />
      ) : (
        <AppointmentCalendarView
          appointments={appointments}
          onSelectAppointment={handleOpenDetails}
          onScheduleDate={(dateStr) => handleOpenNewAppointment(dateStr)}
          onNewAppointment={() => handleOpenNewAppointment()}
        />
      )}

      {/* Dialog: New / Edit Appointment */}
      <NewAppointmentDialog
        open={isNewDialogOpen}
        onOpenChange={setIsNewDialogOpen}
        onSave={handleSaveAppointment}
        appointmentToEdit={appointmentToEdit}
        initialDate={initialDateForNew}
      />

      {/* Dialog: Appointment Detail */}
      <AppointmentDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        appointment={activeSelectedAppointment}
        onEdit={handleOpenEditAppointment}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteAppointment}
      />
    </div>
  );
}
