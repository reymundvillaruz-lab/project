"use client";

import * as React from "react";
import { Users, UserCheck, UserPlus, CalendarClock } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { MockPatient } from "@/lib/mock-data/patients";

interface PatientSummaryProps {
  patients: MockPatient[];
}

export function PatientSummary({ patients }: PatientSummaryProps) {
  const total = patients.length;
  const active = patients.filter((p) => p.status === "Active").length;
  // Fictional metrics based on patient records
  const newThisMonth = Math.max(1, Math.round(total * 0.35));
  const upcomingAppointments = patients.filter((p) => p.appointments && p.appointments.length > 0).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Patients"
        value={total.toLocaleString()}
        subtitle="Registered barangay residents"
        icon={<Users className="h-5 w-5 text-teal-700" />}
        variant="default"
      />
      <StatCard
        title="Active Patients"
        value={active}
        subtitle="Active registry status"
        icon={<UserCheck className="h-5 w-5 text-emerald-700" />}
        variant="success"
      />
      <StatCard
        title="New This Month"
        value={newThisMonth}
        subtitle="Enrolled in current period"
        icon={<UserPlus className="h-5 w-5 text-sky-700" />}
        variant="info"
      />
      <StatCard
        title="Upcoming Appointments"
        value={upcomingAppointments}
        subtitle="Patients queued for visits"
        icon={<CalendarClock className="h-5 w-5 text-amber-700" />}
        variant="warning"
      />
    </div>
  );
}
