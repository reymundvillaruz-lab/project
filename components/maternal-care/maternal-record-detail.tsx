import * as React from "react";
import {
  ArrowLeft,
  Edit3,
  Plus,
  CalendarCheck,
  CalendarClock,
  History,
  User,
  Heart,
  Phone,
  MapPin,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  Activity,
  FileText,
  BadgeAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/ui/empty-state";
import {
  MaternalRecord,
  PrenatalVisit,
  MaternalAppointment,
} from "@/types/maternal-care";
import { MaternalStatusBadge, AppointmentStatusBadge } from "./maternal-status-badge";

interface MaternalRecordDetailProps {
  record: MaternalRecord;
  initialTab?: string;
  onBack: () => void;
  onEditRecord: (record: MaternalRecord) => void;
  onAddPrenatalVisit: (record: MaternalRecord) => void;
  onScheduleFollowUp: (record: MaternalRecord, appointment?: MaternalAppointment) => void;
}

export function MaternalRecordDetail({
  record,
  initialTab = "overview",
  onBack,
  onEditRecord,
  onAddPrenatalVisit,
  onScheduleFollowUp,
}: MaternalRecordDetailProps) {
  const [activeTab, setActiveTab] = React.useState(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Sort visits chronologically (most recent or chronological)
  const sortedVisits = React.useMemo(() => {
    return [...record.prenatalVisits].sort((a, b) =>
      a.visitDate.localeCompare(b.visitDate)
    );
  }, [record.prenatalVisits]);

  // Sort appointments
  const sortedAppointments = React.useMemo(() => {
    return [...record.appointments].sort((a, b) =>
      b.appointmentDate.localeCompare(a.appointmentDate)
    );
  }, [record.appointments]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Header with Back button and Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="h-9 w-9 p-0 shrink-0"
            aria-label="Back to Maternal Patient List"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {record.patientName}
              </h1>
              <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {record.id}
              </span>
              <MaternalStatusBadge status={record.status} />
            </div>
            <p className="text-xs text-slate-500">
              {record.address} &bull; Assigned: <strong>{record.assignedBhw}</strong> &bull; Registered {record.recordDate}
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditRecord(record)}
            className="text-xs"
          >
            <Edit3 className="h-3.5 w-3.5 mr-1 text-slate-600" />
            Edit Record
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("history")}
            className="text-xs text-amber-700 hover:text-amber-800"
          >
            <History className="h-3.5 w-3.5 mr-1" />
            View Visit History
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onScheduleFollowUp(record)}
            className="text-xs text-sky-700 hover:text-sky-800"
          >
            <CalendarClock className="h-3.5 w-3.5 mr-1" />
            Schedule Follow-up
          </Button>

          <Button
            size="sm"
            onClick={() => onAddPrenatalVisit(record)}
            className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Prenatal Visit
          </Button>
        </div>
      </div>

      {/* 2. Patient & Pregnancy Overview Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        {/* Patient Profile */}
        <div className="flex items-center gap-3 md:col-span-2">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-700 text-white font-bold text-lg shadow-xs">
            {record.patientName.charAt(0)}
          </div>
          <div className="space-y-0.5 min-w-0">
            <h2 className="text-sm font-bold text-slate-900 truncate">{record.patientName}</h2>
            <p className="text-xs text-slate-600">
              {record.age} years old &bull; Born {record.dateOfBirth}
            </p>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
              <Phone className="h-3 w-3 text-slate-400 shrink-0" />
              <span>{record.contactNumber}</span>
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              PhilHealth: <span className="font-mono text-slate-600">{record.philhealthNo || "Unassigned"}</span>
            </p>
          </div>
        </div>

        {/* Obstetric Profile (BNC Form 1-G-a) */}
        <div className="space-y-1 text-xs border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
          <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider">
            Obstetric Baseline
          </span>
          <p className="font-medium text-slate-800">
            Gravida / Para: <span className="font-semibold text-teal-800 font-mono">G{record.gravida} P{record.para}</span>
          </p>
          <p className="text-slate-600">
            LMP: <span className="font-medium text-slate-800 font-mono">{record.lmp}</span>
          </p>
          <p className="text-slate-600">
            EDC / EDD: <span className="font-medium text-teal-800 font-mono">{record.edc}</span>
          </p>
          {record.gestationalAgeWeeks && (
            <p className="text-[11px] text-slate-500">
              Gestational Age: ~{record.gestationalAgeWeeks} weeks
            </p>
          )}
        </div>

        {/* Protection & Supplementation */}
        <div className="space-y-1 text-xs border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
          <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider">
            Immunization &amp; Nutrition
          </span>
          <p className="font-medium text-slate-800">
            Tetanus Toxoid: <span className="font-semibold text-teal-800">{record.tetanusToxoidStatus}</span>
          </p>
          <p className="text-slate-600">
            Nutritional Status: <span className="font-medium text-slate-800">{record.nutritionalStatus || "Normal"}</span>
          </p>
          <p className="text-[11px] text-slate-500 truncate" title={record.ironFolicAcidSupplementation}>
            Iron/Folic: {record.ironFolicAcidSupplementation || "None noted"}
          </p>
        </div>
      </div>

      {/* 3. Detailed Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="overview">
            <User className="h-3.5 w-3.5 mr-1.5" />
            Record Overview
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-3.5 w-3.5 mr-1.5" />
            Prenatal Visit History ({record.prenatalVisits.length})
          </TabsTrigger>
          <TabsTrigger value="appointments">
            <CalendarClock className="h-3.5 w-3.5 mr-1.5" />
            Appointments &amp; Follow-ups ({record.appointments.length})
          </TabsTrigger>
          <TabsTrigger value="notes">
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            General Notes
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW */}
        <TabsContent value="overview" className="space-y-5 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Section A: Patient Information */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-teal-700" />
                  <CardTitle className="text-sm">A. Patient Identification &amp; Contact</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Personal records verified according to BNC Form 1-G-a
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Patient Full Name</span>
                    <span className="font-semibold text-slate-900 text-sm">{record.patientName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Date of Birth</span>
                    <span className="font-medium text-slate-800">{record.dateOfBirth} ({record.age} years)</span>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Contact Number</span>
                    <span className="font-medium font-mono text-slate-800">{record.contactNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">PhilHealth Number</span>
                    <span className="font-medium font-mono text-slate-800">{record.philhealthNo || "None"}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <span className="text-slate-400 block text-[11px]">Address (Barangay / Purok)</span>
                  <span className="font-medium text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {record.address}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Section B: Pregnancy Information */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-600" />
                  <CardTitle className="text-sm">B. Pregnancy Registration &amp; Obstetric Data</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Clinical parameters from BNC Form 1-G-a maternal register
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Record Date</span>
                    <span className="font-medium text-slate-800">{record.recordDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Gravida (G)</span>
                    <span className="font-bold text-slate-900">{record.gravida}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Para (P)</span>
                    <span className="font-bold text-slate-900">{record.para}</span>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Last Menstrual Period (LMP)</span>
                    <span className="font-medium text-slate-800 font-mono">{record.lmp}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Estimated Date of Confinement (EDC)</span>
                    <span className="font-medium text-teal-800 font-mono">{record.edc}</span>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tetanus Toxoid Status</span>
                    <span className="font-medium text-slate-800">{record.tetanusToxoidStatus}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Nutritional Status</span>
                    <span className="font-medium text-slate-800">{record.nutritionalStatus || "Normal"}</span>
                  </div>
                </div>

                {record.ironFolicAcidSupplementation && (
                  <div>
                    <span className="text-slate-400 block text-[11px]">Iron with Folic Acid Supplementation</span>
                    <span className="font-medium text-slate-800">{record.ironFolicAcidSupplementation}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Snapshot of Next Appointment & Latest Visit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-teal-100 bg-teal-50/30">
              <CardContent className="p-4 text-xs flex items-center justify-between">
                <div>
                  <span className="text-teal-800 font-semibold block text-[11px] uppercase tracking-wider">
                    Next Scheduled Appointment
                  </span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {record.nextAppointmentDate ? (
                      <span className="flex items-center gap-1.5 font-mono">
                        <CalendarClock className="h-4 w-4 text-teal-700" />
                        {record.nextAppointmentDate}
                      </span>
                    ) : (
                      "No upcoming appointment scheduled"
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onScheduleFollowUp(record)}
                  className="text-xs bg-white hover:bg-teal-50 text-teal-800 border-teal-200"
                >
                  Schedule
                </Button>
              </CardContent>
            </Card>

            <Card className="border-emerald-100 bg-emerald-50/30">
              <CardContent className="p-4 text-xs flex items-center justify-between">
                <div>
                  <span className="text-emerald-800 font-semibold block text-[11px] uppercase tracking-wider">
                    Last Prenatal Visit
                  </span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {record.lastPrenatalVisit ? (
                      <span className="flex items-center gap-1.5 font-mono">
                        <CalendarCheck className="h-4 w-4 text-emerald-700" />
                        {record.lastPrenatalVisit}
                      </span>
                    ) : (
                      "No prenatal checkup logged yet"
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAddPrenatalVisit(record)}
                  className="text-xs bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-200"
                >
                  + Add Visit
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: PRENATAL VISIT HISTORY (Requirement 8) */}
        <TabsContent value="history" className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Prenatal Checkup History</h3>
              <p className="text-xs text-slate-500">
                Chronological record of clinical checkups according to BNC Form 1-G-a
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => onAddPrenatalVisit(record)}
              className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Prenatal Visit
            </Button>
          </div>

          {sortedVisits.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <EmptyState
                  icon={CalendarCheck}
                  title="No Prenatal Visits Recorded"
                  description="There are currently no prenatal visits recorded for this patient. Click below to log the mother's first prenatal checkup."
                  action={{
                    label: "+ Log First Prenatal Visit",
                    onClick: () => onAddPrenatalVisit(record),
                  }}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {sortedVisits.map((visit, index) => (
                <Card
                  key={visit.id}
                  className="border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-800 text-xs font-bold font-mono">
                          {index + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-slate-900 font-mono">
                              {visit.visitDate}
                            </span>
                            <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200">
                              {visit.trimester}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Attending Provider: <strong>{visit.assignedProvider}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Optional clinical metrics */}
                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        {visit.bloodPressure && (
                          <span className="font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            BP: {visit.bloodPressure}
                          </span>
                        )}
                        {visit.weightKg && (
                          <span className="font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            Weight: {visit.weightKg} kg
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                          Visit Information &amp; Observations
                        </span>
                        <p className="text-slate-800 text-xs leading-relaxed mt-0.5">
                          {visit.visitNotes}
                        </p>
                      </div>

                      {visit.followUpDate && (
                        <div className="flex items-center gap-1.5 text-xs text-teal-800 font-medium pt-1">
                          <CalendarClock className="h-3.5 w-3.5 text-teal-600" />
                          <span>Recommended Follow-up: {visit.followUpDate}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 3: APPOINTMENTS & FOLLOW-UPS (Requirement 9) */}
        <TabsContent value="appointments" className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Appointments &amp; Follow-up Management</h3>
              <p className="text-xs text-slate-500">
                Track scheduled, completed, and overdue follow-up dates
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => onScheduleFollowUp(record)}
              className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Schedule Follow-up
            </Button>
          </div>

          {sortedAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <EmptyState
                  icon={CalendarClock}
                  title="No Appointments Scheduled"
                  description="There are currently no scheduled appointments or follow-ups for this patient."
                  action={{
                    label: "+ Schedule Follow-up",
                    onClick: () => onScheduleFollowUp(record),
                  }}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {sortedAppointments.map((apt) => (
                <Card
                  key={apt.id}
                  className={`transition-colors ${
                    apt.status === "Follow-up Due"
                      ? "border-amber-300 bg-amber-50/20"
                      : "border-slate-200"
                  }`}
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 font-mono">
                            {apt.appointmentDate}
                          </span>
                          <AppointmentStatusBadge status={apt.status} />
                        </div>
                        <p className="font-semibold text-xs text-slate-800 mt-1">
                          {apt.purpose}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onScheduleFollowUp(record, apt)}
                          className="h-8 text-xs text-slate-600 hover:text-slate-900"
                        >
                          <Edit3 className="h-3 w-3 mr-1" />
                          Update / Reschedule
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-slate-600">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Assigned Provider/BHW</span>
                        <span className="font-medium text-slate-800">{apt.assignedProvider}</span>
                      </div>
                      {apt.notes && (
                        <div>
                          <span className="text-[10px] text-slate-400 block">Appointment Notes</span>
                          <span className="text-slate-700">{apt.notes}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 4: GENERAL NOTES */}
        <TabsContent value="notes" className="space-y-4 pt-2">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-700" />
                  <CardTitle className="text-sm">Administrative &amp; General Notes</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditRecord(record)}
                  className="text-xs h-8"
                >
                  <Edit3 className="h-3 w-3 mr-1" />
                  Edit Notes
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {record.generalNotes || "No general administrative notes recorded."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block">Assigned Health Worker</span>
                  <span className="font-semibold text-slate-800">{record.assignedBhw}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Current Case Status</span>
                  <div className="mt-0.5">
                    <MaternalStatusBadge status={record.status} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
