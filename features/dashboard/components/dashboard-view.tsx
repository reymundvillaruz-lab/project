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
  HeartPulse,
  HeartHandshake,
  Pill,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardData } from "@/types/dashboard";
import { DEFAULT_USER_PROFILE } from "@/lib/data/empty-data";
import { getStoredPatients, MockPatient } from "@/lib/mock-data/patients";
import { getStoredConsultations, MockConsultation } from "@/lib/mock-data/consultations";
import { getStoredAppointments } from "@/lib/appointment-utils";
import { getStoredImmunizationRecords, NipPatientRecord } from "@/components/immunization/types";
import { getInitialMaternalRecords } from "@/lib/mock-data/maternal-care";
import { getStoredPharmacyMedicines } from "@/context/pharmacy-context";
import { getStoredFPClients } from "@/lib/family-planning-utils";
import { AccessibleBarChart, BarChartItem } from "@/components/reports/accessible-bar-chart";
import { DistributionProgressBar, SegmentItem } from "@/components/reports/distribution-progress-bar";
import { Appointment } from "@/types/appointment";
import { MaternalRecord } from "@/types/maternal-care";
import { Medicine } from "@/types/pharmacy";
import { FPClient } from "@/types/family-planning";

interface DashboardViewProps {
  initialData: DashboardData;
}

export function DashboardView({ initialData }: DashboardViewProps) {
  const [patients, setPatients] = React.useState<MockPatient[]>([]);
  const [consultations, setConsultations] = React.useState<MockConsultation[]>([]);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [immunizations, setImmunizations] = React.useState<NipPatientRecord[]>([]);
  const [maternalRecords, setMaternalRecords] = React.useState<MaternalRecord[]>([]);
  const [medicines, setMedicines] = React.useState<Medicine[]>([]);
  const [fpClients, setFpClients] = React.useState<FPClient[]>([]);

  // Hydrate from stored data on client mount and sync with Supabase
  React.useEffect(() => {
    setPatients(getStoredPatients());
    setConsultations(getStoredConsultations());
    setAppointments(getStoredAppointments());
    setImmunizations(getStoredImmunizationRecords());
    setMaternalRecords(getInitialMaternalRecords());
    setMedicines(getStoredPharmacyMedicines());
    setFpClients(getStoredFPClients());

    // Fetch live patients from Supabase
    import("@/lib/supabase/services/patients-service").then(({ fetchPatientsFromSupabase }) => {
      fetchPatientsFromSupabase()
        .then((sbPatients) => {
          if (sbPatients !== null) {
            setPatients(sbPatients);
          }
        })
        .catch(() => {});
    });
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

  // 1. Core KPIs
  const totalPatients = patients.length;
  const totalConsultations = consultations.length;
  const totalAppointments = appointments.length;

  const totalVaccinesGiven = React.useMemo(() => {
    let count = 0;
    immunizations.forEach((rec) => {
      Object.values(rec.vaccines || {}).forEach((v) => {
        if (v?.dateGiven || v?.status === "Completed") {
          count++;
        }
      });
    });
    return count;
  }, [immunizations]);

  // 2. Consultation Morbidity & Visit Category Distribution
  const consultationCategoryData = React.useMemo<BarChartItem[]>(() => {
    const total = consultations.length;
    let genMed = 0;
    let followUp = 0;
    let healthCheck = 0;
    let other = 0;

    consultations.forEach((c) => {
      if (c.visitType === "General Consultation") genMed++;
      else if (c.visitType === "Follow-up") followUp++;
      else if (c.visitType === "Health Check") healthCheck++;
      else other++;
    });

    const calcPct = (cnt: number) => (total > 0 ? Math.round((cnt / total) * 100) : 0);

    return [
      {
        label: "General Consultation",
        value: genMed,
        subLabel: "Primary triage & acute care",
        percentage: calcPct(genMed),
        barColor: "bg-teal-600",
      },
      {
        label: "Clinical Follow-up",
        value: followUp,
        subLabel: "Chronic disease management",
        percentage: calcPct(followUp),
        barColor: "bg-sky-600",
      },
      {
        label: "Routine Health Check",
        value: healthCheck,
        subLabel: "NCD screening & wellness",
        percentage: calcPct(healthCheck),
        barColor: "bg-emerald-600",
      },
      {
        label: "Specialized / Other",
        value: other,
        subLabel: "Immunization / Maternal referral",
        percentage: calcPct(other),
        barColor: "bg-amber-600",
      },
    ];
  }, [consultations]);

  // 3. Consultation Resolution & Triage Status Breakdown
  const consultationStatusSegments = React.useMemo<SegmentItem[]>(() => {
    const total = consultations.length;
    let completed = 0;
    let pending = 0;
    let followUp = 0;

    consultations.forEach((c) => {
      if (c.status === "Completed") completed++;
      else if (c.status === "Pending") pending++;
      else followUp++;
    });

    const calcPct = (cnt: number) => (total > 0 ? Math.round((cnt / total) * 100) : 0);

    return [
      {
        label: "Completed Cases",
        count: completed,
        percentage: calcPct(completed),
        colorClass: "bg-emerald-500",
      },
      {
        label: "In Triage / Pending",
        count: pending,
        percentage: calcPct(pending),
        colorClass: "bg-sky-500",
      },
      {
        label: "Follow-up Scheduled",
        count: followUp,
        percentage: calcPct(followUp),
        colorClass: "bg-amber-500",
      },
    ];
  }, [consultations]);

  // 4. Primary Healthcare Program Performance Coverage Metrics
  const programPerformance = React.useMemo(() => {
    const totalMaternal = maternalRecords.length;
    const activeMaternal = maternalRecords.filter((m) => m.status === "Active").length;
    const maternalRate = totalMaternal > 0 ? Math.round((activeMaternal / totalMaternal) * 100) : 0;

    const totalImmPatients = immunizations.length;
    const fullyImmCount = immunizations.filter((rec) => {
      const dosesGiven = Object.values(rec.vaccines || {}).filter(
        (v) => v?.dateGiven || v?.status === "Completed"
      ).length;
      return dosesGiven >= 5;
    }).length;
    const immRate = totalImmPatients > 0 ? Math.round((fullyImmCount / totalImmPatients) * 100) : 0;

    const totalFp = fpClients.length;
    const activeFp = fpClients.filter((fp) => fp.status === "Active User").length;
    const fpRate = totalFp > 0 ? Math.round((activeFp / totalFp) * 100) : 0;

    const totalMeds = medicines.length;
    const availableMeds = medicines.filter((m) => m.availableQuantity > 0).length;
    const medRate = totalMeds > 0 ? Math.round((availableMeds / totalMeds) * 100) : 0;

    return {
      activeMaternal,
      totalMaternal,
      maternalRate,
      fullyImmCount,
      totalImmPatients,
      immRate,
      activeFp,
      totalFp,
      fpRate,
      availableMeds,
      totalMeds,
      medRate,
    };
  }, [maternalRecords, immunizations, fpClients, medicines]);

  // 5. Demographic Segments & Social Coverage
  const patientStatistics = React.useMemo(() => {
    const total = patients.length;
    let under5 = 0;
    let schoolAge = 0;
    let womenReproductive = 0;
    let adults = 0;
    let seniors = 0;
    let pwd = 0;
    let indigent = 0;
    let konsulta = 0;

    patients.forEach((p) => {
      if (p.age < 5) under5++;
      if (p.age >= 5 && p.age < 18) schoolAge++;
      if (p.sex === "Female" && p.age >= 15 && p.age <= 49) womenReproductive++;
      if (p.age >= 18 && p.age < 60) adults++;
      if (p.age >= 60) seniors++;
      if (p.pwdId && p.pwdId !== "N/A" && p.pwdId !== "None") pwd++;
      if (p.phicNo) konsulta++;
      if (p.isIp === "IP" || p.status === "Active") indigent++;
    });

    const calcPct = (count: number) => (total > 0 ? Math.round((count / total) * 100) : 0);

    const segments: SegmentItem[] = [
      { label: "Infants & Under 5", count: under5, percentage: calcPct(under5), colorClass: "bg-emerald-500" },
      { label: "School Age (5-17)", count: schoolAge, percentage: calcPct(schoolAge), colorClass: "bg-sky-500" },
      { label: "WRA (15-49 yrs)", count: womenReproductive, percentage: calcPct(womenReproductive), colorClass: "bg-rose-500" },
      { label: "Adults (18-59 yrs)", count: adults, percentage: calcPct(adults), colorClass: "bg-indigo-500" },
      { label: "Seniors (60+ yrs)", count: seniors, percentage: calcPct(seniors), colorClass: "bg-amber-500" },
    ];

    return {
      total,
      segments,
      groups: [
        { label: "Women of Reproductive Age (15–49)", count: womenReproductive, percentage: calcPct(womenReproductive), colorClass: "bg-rose-500" },
        { label: "Senior Citizens (60+ yrs)", count: seniors, percentage: calcPct(seniors), colorClass: "bg-teal-600" },
        { label: "Adult Population (18–59 yrs)", count: adults, percentage: calcPct(adults), colorClass: "bg-sky-500" },
        { label: "Children & Under 5 (0–5 yrs)", count: under5, percentage: calcPct(under5), colorClass: "bg-emerald-500" },
        { label: "Persons with Disability (PWD)", count: pwd, percentage: calcPct(pwd), colorClass: "bg-amber-500" },
      ],
      coverage: {
        philHealthIndigent: indigent,
        philHealthKonsulta: konsulta,
        seniorCitizenMembers: seniors,
        pwdMembers: pwd,
      },
    };
  }, [patients]);

  // 6. Monthly Consultation Trends (Last 6 Months Activity)
  const monthlyInflowData = React.useMemo<BarChartItem[]>(() => {
    const monthNames = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
    const now = new Date();
    const curYear = now.getFullYear();

    return monthNames.map((mName, idx) => {
      const monthNumber = 5 + idx; // May = 5 to Oct = 10
      const monthPrefix = `${curYear}-${String(monthNumber).padStart(2, "0")}`;

      const count = consultations.filter((c) => (c.date || "").startsWith(monthPrefix)).length;

      return {
        label: `${mName} ${curYear}`,
        value: count,
        subLabel: "Clinical triage logs",
        barColor: "bg-teal-600",
      };
    });
  }, [consultations]);

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* 1. Welcome & Facility Header */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs md:flex-row md:items-center md:justify-between min-w-0">
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl truncate">
              Barangay Health Center Dashboard
            </h1>
            <Badge variant="outline" className="border-teal-300 bg-teal-50 text-teal-800 text-[11px] shrink-0">
              Primary Care Facility
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            {DEFAULT_USER_PROFILE.healthCenter} &bull; Republic of the Philippines &bull; Health Station Analytics
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{currentDateFormatted}</span>
            </div>
            <span className="text-slate-300 hidden sm:inline">&bull;</span>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>Operating Hours: 8:00 AM – 5:00 PM</span>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link href="/patients/new">
            <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs h-9">
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
              Register Patient
            </Button>
          </Link>
          <Link href="/consultations/new">
            <Button size="sm" variant="outline" className="text-xs shadow-xs h-9">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Consultation
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Primary KPI Stat Cards (4-column responsive grid) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 min-w-0">
        <StatCard
          title="Total Registered Patients"
          value={totalPatients.toLocaleString()}
          subtitle="Resident master health records"
          icon={<Users className="h-5 w-5 text-teal-700" />}
          variant="default"
        />

        <StatCard
          title="Total Consultations"
          value={totalConsultations.toLocaleString()}
          subtitle="Clinical triage visits recorded"
          icon={<Stethoscope className="h-5 w-5 text-sky-700" />}
          variant="info"
        />

        <StatCard
          title="Clinic Appointments"
          value={totalAppointments.toLocaleString()}
          subtitle="Scheduled resident appointments"
          icon={<CalendarClock className="h-5 w-5 text-amber-700" />}
          variant="warning"
        />

        <StatCard
          title="Vaccines Administered"
          value={totalVaccinesGiven.toLocaleString()}
          subtitle="EPI infant vaccination doses"
          icon={<Syringe className="h-5 w-5 text-emerald-700" />}
          variant="success"
        />
      </div>

      {/* 3. Analytics & Statistics Row 1: Morbidity / Consultation Analytics & Program Performance */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 min-w-0">
        {/* CARD 1: Clinical Consultations & Morbidity Distribution Analytics */}
        <Card className="flex flex-col border border-slate-200 bg-white shadow-2xs overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-teal-700" />
                <CardTitle className="text-sm font-bold text-slate-900">
                  Consultation Morbidity &amp; Triage Distribution
                </CardTitle>
              </div>
              <CardDescription>
                Primary care visit classifications, chief reasons for consultation, and triage resolution
              </CardDescription>
            </div>
            <Link
              href="/consultations"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1 shrink-0"
            >
              All Records
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-5 space-y-6 flex-1">
            {/* Multi-segment Resolution Meter */}
            <DistributionProgressBar
              title="Triage Resolution Status"
              totalLabel="Total Consultations"
              totalValue={totalConsultations}
              segments={consultationStatusSegments}
            />

            {/* Visit Category Accessible Bar Chart */}
            <div className="pt-2 border-t border-slate-100">
              <AccessibleBarChart
                title="Primary Consultation Categories"
                items={consultationCategoryData}
                valueSuffix="cases"
              />
            </div>
          </CardContent>
        </Card>

        {/* CARD 2: Primary Care Program Performance & Coverage Rates */}
        <Card className="flex flex-col border border-slate-200 bg-white shadow-2xs overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-700" />
                <CardTitle className="text-sm font-bold text-slate-900">
                  Primary Healthcare Program Performance
                </CardTitle>
              </div>
              <CardDescription>
                DOH Target Client List enrollment rates, immunization progress, and supply availability
              </CardDescription>
            </div>
            <Link
              href="/reports"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1 shrink-0"
            >
              FHSIS Reports
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-5 space-y-4 flex-1">
            {/* 4 Program Indicator Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Immunization Coverage */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <Syringe className="h-4 w-4 text-emerald-600" />
                    <span>NIP Immunization</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-700 text-sm">
                    {programPerformance.immRate}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all"
                    style={{ width: `${programPerformance.immRate}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>{programPerformance.fullyImmCount} complete</span>
                  <span>{programPerformance.totalImmPatients} registered</span>
                </div>
              </div>

              {/* Maternal Health Enrollment */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <HeartPulse className="h-4 w-4 text-rose-600" />
                    <span>Maternal Care</span>
                  </div>
                  <span className="font-mono font-bold text-rose-700 text-sm">
                    {programPerformance.maternalRate}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-600 rounded-full transition-all"
                    style={{ width: `${programPerformance.maternalRate}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>{programPerformance.activeMaternal} active cases</span>
                  <span>{programPerformance.totalMaternal} enrolled</span>
                </div>
              </div>

              {/* Family Planning Usage */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <HeartHandshake className="h-4 w-4 text-teal-600" />
                    <span>Family Planning</span>
                  </div>
                  <span className="font-mono font-bold text-teal-700 text-sm">
                    {programPerformance.fpRate}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-600 rounded-full transition-all"
                    style={{ width: `${programPerformance.fpRate}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>{programPerformance.activeFp} active users</span>
                  <span>{programPerformance.totalFp} clients</span>
                </div>
              </div>

              {/* Pharmacy Medicines In-Stock */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <Pill className="h-4 w-4 text-sky-600" />
                    <span>Medicines Stock</span>
                  </div>
                  <span className="font-mono font-bold text-sky-700 text-sm">
                    {programPerformance.medRate}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-600 rounded-full transition-all"
                    style={{ width: `${programPerformance.medRate}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>{programPerformance.availableMeds} available</span>
                  <span>{programPerformance.totalMeds} items</span>
                </div>
              </div>
            </div>

            {/* Quick Cross-Navigation Links */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-500 font-medium">Primary Care Registries:</span>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/immunization" className="text-teal-700 hover:underline font-semibold">
                  EPI Cards &rarr;
                </Link>
                <Link href="/maternal-care" className="text-teal-700 hover:underline font-semibold">
                  Maternal TCL &rarr;
                </Link>
                <Link href="/family-planning" className="text-teal-700 hover:underline font-semibold">
                  FP Form 1 &rarr;
                </Link>
                <Link href="/medicines" className="text-teal-700 hover:underline font-semibold">
                  Pharmacy &rarr;
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Analytics & Statistics Row 2: Demographic Breakdown & Monthly Activity Trends */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 min-w-0">
        {/* CARD 3: Demographic Population Coverage */}
        <Card className="flex flex-col border border-slate-200 bg-white shadow-2xs overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-teal-700" />
                <CardTitle className="text-sm font-bold text-slate-900">
                  Demographic Distribution &amp; Vulnerable Groups
                </CardTitle>
              </div>
              <CardDescription>
                Barangay resident population segment coverage and healthcare social protection enrollment
              </CardDescription>
            </div>
            <Link
              href="/patients"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1 shrink-0"
            >
              Master Registry
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-5 space-y-5 flex-1">
            {/* Multi-segment Population Bar */}
            <DistributionProgressBar
              title="Population Segment Breakdown"
              totalLabel="Total Registered Residents"
              totalValue={patientStatistics.total}
              segments={patientStatistics.segments}
            />

            {/* Individual Progress Bars */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              {patientStatistics.groups.map((group) => (
                <div key={group.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 truncate pr-2">{group.label}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-slate-500 font-mono">{group.count} pts</span>
                      <span className="text-[11px] font-semibold text-slate-800 w-8 text-right font-mono">
                        {group.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${group.colorClass}`}
                      style={{ width: `${group.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Social Protection & Insurance Coverage Badges */}
            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
                Social Protection &amp; PhilHealth Coverage
              </h4>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-center">
                  <span className="block text-base font-bold text-slate-900 font-mono">
                    {patientStatistics.coverage.philHealthIndigent}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    PhilHealth / 4Ps
                  </span>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-center">
                  <span className="block text-base font-bold text-teal-800 font-mono">
                    {patientStatistics.coverage.philHealthKonsulta}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Konsulta Enrolled
                  </span>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-center">
                  <span className="block text-base font-bold text-slate-900 font-mono">
                    {patientStatistics.coverage.seniorCitizenMembers}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Senior Citizens
                  </span>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-center">
                  <span className="block text-base font-bold text-amber-700 font-mono">
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

        {/* CARD 4: Monthly Healthcare Activity Trends & Station Productivity */}
        <Card className="flex flex-col border border-slate-200 bg-white shadow-2xs overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-teal-700" />
                <CardTitle className="text-sm font-bold text-slate-900">
                  Monthly Healthcare Inflow &amp; Trends
                </CardTitle>
              </div>
              <CardDescription>
                Chronological monthly consultation activity and primary health station readiness index
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] text-teal-800 bg-teal-50 border-teal-200 shrink-0">
              6-Month Period
            </Badge>
          </CardHeader>
          <CardContent className="p-5 space-y-6 flex-1">
            {/* Monthly Trend Bar Chart */}
            <AccessibleBarChart
              title="Monthly Clinical Consultations Volume"
              items={monthlyInflowData}
              valueSuffix="consultations"
            />

            {/* Health Center Station Operational Readiness Standards */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Facility Operational Readiness
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50/60">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">DOH Clinical Standards</span>
                    <span className="text-[11px] text-slate-500">
                      Standardized vital sign thresholds, SOAP notes, and NCD risk protocols active.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50/60">
                  <ShieldCheck className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Confidentiality Compliance</span>
                    <span className="text-[11px] text-slate-500">
                      Republic Act 10173 data privacy protocols and confidential patient indexing.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
