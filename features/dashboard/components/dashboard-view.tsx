"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Stethoscope,
  CalendarClock,
  Syringe,
  Plus,
  UserPlus,
  ArrowRight,
  Clock,
  Calendar,
  MapPin,
  HeartPulse,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Activity,
  Building,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { DashboardData, TodayConsultationSummary } from "@/types/dashboard";
import { DEFAULT_USER_PROFILE, INITIAL_UPCOMING_ACTIVITIES } from "@/lib/data/empty-data";
import { getStoredPatients, MockPatient } from "@/lib/mock-data/patients";
import { getStoredConsultations, MockConsultation } from "@/lib/mock-data/consultations";

interface DashboardViewProps {
  initialData: DashboardData;
}

export function DashboardView({ initialData }: DashboardViewProps) {
  const [patients, setPatients] = React.useState<MockPatient[]>([]);
  const [consultations, setConsultations] = React.useState<MockConsultation[]>([]);

  // Hydrate from stored data on client mount
  React.useEffect(() => {
    setPatients(getStoredPatients());
    setConsultations(getStoredConsultations());
  }, []);

  // Formatted date string for Philippine context
  const currentDateFormatted = React.useMemo(() => {
    const now = new Date();
    return new Intl.DateTimeFormat("en-PH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(now);
  }, []);

  // Derive metrics
  const totalPatients = patients.length;
  const todayConsultationsCount = consultations.length;
  const todayAppointmentsCount = 0; // Empty
  const immunizationsThisMonth = 0;

  // Derive demographic statistics from actual patient records
  const patientStatistics = React.useMemo(() => {
    const total = patients.length;
    let womenReproductive = 0;
    let seniors = 0;
    let adults = 0;
    let children = 0;
    let pwd = 0;
    let indigent = 0;
    let konsulta = 0;

    patients.forEach((p) => {
      if (p.sex === "Female" && p.age >= 15 && p.age <= 49) womenReproductive++;
      if (p.age >= 60) seniors++;
      if (p.age >= 18 && p.age < 60) adults++;
      if (p.age < 18) children++;
      if (p.pwdId && p.pwdId !== "N/A" && p.pwdId !== "None") pwd++;
      if (p.phicNo) konsulta++;
      if (p.isIp === "IP" || p.status === "Active") indigent++;
    });

    const calcPct = (count: number) => (total > 0 ? Math.round((count / total) * 100) : 0);

    return {
      totalPatients: total,
      groups: [
        {
          label: "Women of Reproductive Age (15–49)",
          count: womenReproductive,
          percentage: calcPct(womenReproductive),
          colorClass: "bg-rose-500",
        },
        {
          label: "Senior Citizens (60+ yrs)",
          count: seniors,
          percentage: calcPct(seniors),
          colorClass: "bg-teal-600",
        },
        {
          label: "Adult Population (18–59 yrs)",
          count: adults,
          percentage: calcPct(adults),
          colorClass: "bg-sky-500",
        },
        {
          label: "Children & Adolescents (<18 yrs)",
          count: children,
          percentage: calcPct(children),
          colorClass: "bg-emerald-500",
        },
        {
          label: "Persons with Disability (PWD)",
          count: pwd,
          percentage: calcPct(pwd),
          colorClass: "bg-amber-500",
        },
      ],
      coverage: {
        philHealthIndigent: indigent,
        philHealthKonsulta: konsulta,
        seniorCitizenMembers: seniors,
        pwdMembers: pwd,
      },
    };
  }, [patients]);

  // Derive Recent Consultations from actual stored consultations
  const recentConsultations: TodayConsultationSummary[] = React.useMemo(() => {
    return consultations.slice(0, 5).map((con, idx) => ({
      id: con.id,
      queueNumber: `Q-${String(idx + 1).padStart(2, "0")}`,
      patientId: con.patientId,
      patientName: con.patientName,
      age: con.patientAge,
      gender: con.patientSex,
      purpose: con.reasonForVisit,
      vitals: con.vitalSigns
        ? `BP: ${con.vitalSigns.bloodPressureSystolic || "—"}/${con.vitalSigns.bloodPressureDiastolic || "—"} • Temp: ${con.vitalSigns.temperature || "—"}°C`
        : "",
      attendingStaff: con.provider,
      status: con.status === "Completed" ? "COMPLETED" : con.status === "Pending" ? "WAITING" : "IN_PROGRESS",
      timeIn: con.date || "Today",
    }));
  }, [consultations]);

  return (
    <div className="space-y-6">
      {/* 1. Welcome & Operational Status Banner */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-2xs md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Barangay Health Center Dashboard
            </h1>
            <Badge variant="outline" className="border-teal-300 bg-teal-50 text-teal-800 text-[11px]">
              Primary Care Facility
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            {DEFAULT_USER_PROFILE.healthCenter} &bull; Republic of the Philippines
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>{currentDateFormatted}</span>
            </div>
            <span className="text-slate-300 hidden sm:inline">&bull;</span>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>Operating Hours: 8:00 AM – 5:00 PM</span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/patients/new">
            <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs">
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
              Register Patient
            </Button>
          </Link>
          <Link href="/consultations/new">
            <Button size="sm" variant="outline" className="text-xs shadow-xs">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Consultation
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Primary KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Patients */}
        <StatCard
          title="Total Patients"
          value={totalPatients.toLocaleString()}
          subtitle="Registered barangay residents"
          icon={<Users className="h-5 w-5 text-teal-700" />}
          variant="default"
        />

        {/* Today's Consultations */}
        <StatCard
          title="Today's Consultations"
          value={todayConsultationsCount}
          subtitle="Clinical consultations recorded"
          icon={<Stethoscope className="h-5 w-5 text-sky-700" />}
          variant="info"
        />

        {/* Today's Appointments */}
        <StatCard
          title="Today's Appointments"
          value={todayAppointmentsCount}
          subtitle="Scheduled visits for today"
          icon={<CalendarClock className="h-5 w-5 text-amber-700" />}
          variant="warning"
        />

        {/* Immunizations This Month */}
        <StatCard
          title="Immunizations This Month"
          value={immunizationsThisMonth}
          subtitle="Infants & children under EPI"
          icon={<Syringe className="h-5 w-5 text-emerald-700" />}
          variant="success"
        />
      </div>

      {/* 3. Operational Sections Row 1: Today's Appointments & Recent Consultations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* SECTION 1: TODAY'S APPOINTMENTS */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-bold text-slate-900">
                  Today&apos;s Appointments
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-medium text-slate-600">
                  0 Booked
                </Badge>
              </div>
              <CardDescription>
                Scheduled patient visits, checkups, and program appointments
              </CardDescription>
            </div>
            <Link
              href="/appointments"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1"
            >
              Manage
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="flex-1">
            <EmptyState
              icon={CalendarClock}
              title="No Appointments Scheduled Today"
              description="There are currently no patient visits or medical checkups booked for today."
              action={{
                label: "+ Schedule Appointment",
                href: "/appointments",
              }}
            />
          </CardContent>
        </Card>

        {/* SECTION 2: RECENT CONSULTATIONS */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-bold text-slate-900">
                  Recent Consultations
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-medium text-slate-600">
                  {recentConsultations.length} in Queue
                </Badge>
              </div>
              <CardDescription>
                Clinical triage queue, recorded vital signs, and diagnostic summaries
              </CardDescription>
            </div>
            <Link
              href="/consultations"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1"
            >
              All Records
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="flex-1">
            {recentConsultations.length === 0 ? (
              <EmptyState
                icon={Stethoscope}
                title="No Consultations Recorded"
                description="The clinical queue is currently empty. Record vital signs and chief complaints to begin triage."
                action={{
                  label: "+ Start New Consultation",
                  href: "/consultations/new",
                }}
              />
            ) : (
              <div className="divide-y divide-slate-100">
                {recentConsultations.map((con) => (
                  <div
                    key={con.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-teal-50 px-1.5 py-0.5 text-[10px] font-bold text-teal-800 border border-teal-200">
                          {con.queueNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {con.patientName}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({con.age}y/{con.gender === "Male" ? "M" : "F"})
                        </span>
                        <Badge
                          variant={
                            con.status === "COMPLETED"
                              ? "success"
                              : con.status === "IN_PROGRESS"
                              ? "default"
                              : "secondary"
                          }
                          className="text-[10px] px-1.5 py-0"
                        >
                          {con.status.replace("_", " ")}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-600 font-medium">
                        {con.purpose}
                      </p>

                      {con.vitals && (
                        <p className="text-[11px] text-slate-500 font-mono">
                          {con.vitals}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">{con.timeIn}</span>
                        <span className="text-[11px] text-slate-600 font-medium">
                          {con.attendingStaff}
                        </span>
                      </div>
                      <Link href={`/consultations/${con.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-teal-700 px-2">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 4. Operational Sections Row 2: Patient Statistics & Upcoming Activities */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* SECTION 3: PATIENT STATISTICS */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Patient Statistics
              </CardTitle>
              <CardDescription>
                Barangay demographic distribution &amp; primary healthcare program enrollment
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] text-teal-800 bg-teal-50 border-teal-200">
              Barangay Registry
            </Badge>
          </CardHeader>
          <CardContent className="space-y-5 flex-1">
            {/* Demographic Category Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Demographic Segments
              </h4>
              <div className="space-y-2.5">
                {patientStatistics.groups.map((group) => (
                  <div key={group.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{group.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-mono">{group.count} pts</span>
                        <span className="text-[11px] font-semibold text-slate-800 w-8 text-right">
                          {group.percentage}%
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${group.colorClass}`}
                        style={{ width: `${group.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Healthcare Coverage & Enrollment Highlights */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
                Healthcare Coverage Status
              </h4>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-center">
                  <span className="block text-base font-bold text-slate-900">
                    {patientStatistics.coverage.philHealthIndigent}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    PhilHealth / 4Ps
                  </span>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-center">
                  <span className="block text-base font-bold text-teal-800">
                    {patientStatistics.coverage.philHealthKonsulta}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Konsulta Enrolled
                  </span>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-center">
                  <span className="block text-base font-bold text-slate-900">
                    {patientStatistics.coverage.seniorCitizenMembers}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Senior Citizens
                  </span>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-center">
                  <span className="block text-base font-bold text-amber-700">
                    {patientStatistics.coverage.pwdMembers}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    PWD Registry
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 4: UPCOMING ACTIVITIES */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Upcoming Activities
              </CardTitle>
              <CardDescription>
                Public health missions, immunization days, and health educational classes
              </CardDescription>
            </div>
            <Link
              href="/reports"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1"
            >
              Reports
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="flex-1">
            {INITIAL_UPCOMING_ACTIVITIES.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No Activities Scheduled"
                description="There are currently no community health events or medical outreach missions scheduled."
              />
            ) : (
              <div className="divide-y divide-slate-100">
                {INITIAL_UPCOMING_ACTIVITIES.map((act) => (
                  <div key={act.id} className="py-3 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">
                            {act.title}
                          </span>
                          <Badge variant="outline" className="text-[10px] bg-slate-50 border-slate-200">
                            {act.badgeLabel}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1 text-slate-700 font-medium">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            {act.date}
                          </span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-400" />
                            {act.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                      <span>{act.location}</span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-slate-500 truncate">{act.targetGroup}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
