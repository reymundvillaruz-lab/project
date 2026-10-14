"use client";

import * as React from "react";
import { Users, UserCheck, UserPlus } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { MockPatient } from "@/lib/mock-data/patients";

interface PatientSummaryProps {
  patients: MockPatient[];
}

export function PatientSummary({ patients }: PatientSummaryProps) {
  const total = patients.length;
  const active = patients.filter((p) => p.status === "Active").length;
  
  // Calculate new enrollments this month
  const now = new Date();
  const curMonth = String(now.getMonth() + 1).padStart(2, "0");
  const curYear = String(now.getFullYear());
  const curPrefix = `${curYear}-${curMonth}`;
  const newThisMonth = patients.filter((p) => (p.createdAt || p.lastVisit || "").startsWith(curPrefix)).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
    </div>
  );
}
