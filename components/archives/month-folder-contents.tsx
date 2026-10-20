"use client";

import * as React from "react";
import {
  ArchiveMonthFolder,
  exportArchiveAsJson,
  restoreArchiveToActive,
} from "@/lib/services/archive-service";
import { MockPatient } from "@/lib/mock-data/patients";
import { ArchivedPatientDialog } from "./archived-patient-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Download,
  RotateCcw,
  Search,
  Users,
  Stethoscope,
  CalendarClock,
  Pill,
  HeartPulse,
  UserCheck,
  Syringe,
  Eye,
  Calendar,
  Building2,
  FileCheck2,
  Printer,
  CheckCircle2,
  FolderOpen,
} from "lucide-react";

interface MonthFolderContentsProps {
  folder: ArchiveMonthFolder;
  onBack: () => void;
  onRestoreSuccess?: () => void;
}

export function MonthFolderContents({
  folder,
  onBack,
  onRestoreSuccess,
}: MonthFolderContentsProps) {
  const [activeTab, setActiveTab] = React.useState<string>("patients");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedPatient, setSelectedPatient] = React.useState<MockPatient | null>(null);
  const [showPatientDialog, setShowPatientDialog] = React.useState<boolean>(false);
  const [restoreFeedback, setRestoreFeedback] = React.useState<string | null>(null);

  // Filter patients by search query
  const filteredPatients = React.useMemo(() => {
    const list = folder.data.patients || [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.phicNo && p.phicNo.toLowerCase().includes(q)) ||
        (p.address && p.address.toLowerCase().includes(q))
    );
  }, [folder.data.patients, searchQuery]);

  // Filter consultations by search query
  const filteredConsultations = React.useMemo(() => {
    const list = folder.data.consultations || [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (c) =>
        (c.patientName && c.patientName.toLowerCase().includes(q)) ||
        (c.diagnosis && c.diagnosis.toLowerCase().includes(q)) ||
        (c.reasonForVisit && c.reasonForVisit.toLowerCase().includes(q))
    );
  }, [folder.data.consultations, searchQuery]);

  // Filter appointments
  const filteredAppointments = React.useMemo(() => {
    const list = folder.data.appointments || [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (a) =>
        (a.patientName && a.patientName.toLowerCase().includes(q)) ||
        (a.purpose && a.purpose.toLowerCase().includes(q))
    );
  }, [folder.data.appointments, searchQuery]);

  // Filter prescriptions
  const filteredPrescriptions = React.useMemo(() => {
    const list = folder.data.prescriptions || [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (rx) =>
        (rx.patientName && rx.patientName.toLowerCase().includes(q)) ||
        (rx.prescriber && rx.prescriber.toLowerCase().includes(q)) ||
        (rx.medicine && rx.medicine.toLowerCase().includes(q)) ||
        (rx.items && rx.items.some((i) => i.drug?.toLowerCase().includes(q)))
    );
  }, [folder.data.prescriptions, searchQuery]);

  const handleExport = () => {
    exportArchiveAsJson(folder);
  };

  const handleRestore = () => {
    if (
      window.confirm(
        `Are you sure you want to load records from ${folder.monthName} ${folder.year} back into the active workspace? This will replace or supplement your active records.`
      )
    ) {
      restoreArchiveToActive(folder.folderKey, "replace");
      setRestoreFeedback(
        `Restored ${folder.monthName} ${folder.year} records to active workspace successfully!`
      );
      setTimeout(() => setRestoreFeedback(null), 4000);
      if (onRestoreSuccess) onRestoreSuccess();
    }
  };

  const handleViewPatient = (patient: MockPatient) => {
    setSelectedPatient(patient);
    setShowPatientDialog(true);
  };

  return (
    <div className="space-y-5">
      {/* 1. Folder Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-linear-to-r from-teal-50 via-emerald-50/40 to-white p-4.5 rounded-xl border border-teal-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="h-9 w-9 p-0 bg-white border-teal-200 text-teal-800 hover:bg-teal-100"
            title="Back to all month folders"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-teal-700" />
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Archive Folder: {folder.monthName} {folder.year}
              </h2>
              <Badge variant="outline" className="text-xs bg-teal-100 text-teal-900 border-teal-300 font-semibold">
                {folder.counts.totalRecords} Records Saved
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-teal-700" />
                Archived: {new Date(folder.archivedAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-teal-700" />
                By: {folder.archivedBy}
              </span>
              {folder.notes && (
                <span className="italic text-slate-600">
                  &bull; &quot;{folder.notes}&quot;
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Folder Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="text-xs text-slate-700 hover:bg-slate-100 border-slate-200"
            title="Download complete month archive JSON file"
          >
            <Download className="h-3.5 w-3.5 mr-1 text-teal-700" />
            Download Folder (.json)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRestore}
            className="text-xs text-teal-800 bg-teal-50/50 hover:bg-teal-100 border-teal-200"
            title="Restore this month's data into active workspace"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Restore to Active
          </Button>
        </div>
      </div>

      {restoreFeedback && (
        <div className="p-3 rounded-lg border border-teal-200 bg-teal-50 text-teal-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
          <span>{restoreFeedback}</span>
        </div>
      )}

      {/* 2. Search Bar within this month */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder={`Search within ${folder.monthName} ${folder.year} by patient name, ID, condition, or diagnosis...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9 text-xs bg-white border-slate-200 shadow-2xs"
        />
      </div>

      {/* 3. Module Category Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex flex-wrap gap-1 w-full sm:w-auto h-auto">
          <TabsTrigger
            value="patients"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-teal-900 shadow-2xs"
          >
            <Users className="h-3.5 w-3.5 mr-1.5 text-teal-700" />
            Patients &amp; PhilPEN ({folder.counts.patients})
          </TabsTrigger>

          <TabsTrigger
            value="consultations"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-sky-900 shadow-2xs"
          >
            <Stethoscope className="h-3.5 w-3.5 mr-1.5 text-sky-700" />
            Consultations ({folder.counts.consultations})
          </TabsTrigger>

          <TabsTrigger
            value="appointments"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-indigo-900 shadow-2xs"
          >
            <CalendarClock className="h-3.5 w-3.5 mr-1.5 text-indigo-700" />
            Appointments ({folder.counts.appointments})
          </TabsTrigger>

          <TabsTrigger
            value="prescriptions"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-amber-900 shadow-2xs"
          >
            <Pill className="h-3.5 w-3.5 mr-1.5 text-amber-700" />
            Prescriptions ({folder.counts.prescriptions})
          </TabsTrigger>

          <TabsTrigger
            value="maternal"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-rose-900 shadow-2xs"
          >
            <HeartPulse className="h-3.5 w-3.5 mr-1.5 text-rose-700" />
            Maternal Care ({folder.counts.maternalRecords})
          </TabsTrigger>

          <TabsTrigger
            value="fp"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-purple-900 shadow-2xs"
          >
            <UserCheck className="h-3.5 w-3.5 mr-1.5 text-purple-700" />
            Family Planning ({folder.counts.familyPlanningRecords})
          </TabsTrigger>

          <TabsTrigger
            value="immunizations"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-emerald-900 shadow-2xs"
          >
            <Syringe className="h-3.5 w-3.5 mr-1.5 text-emerald-700" />
            Immunization ({folder.counts.immunizations})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: PATIENTS & PHILPEN */}
        <TabsContent value="patients" className="mt-4">
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="py-3 px-5 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-teal-900">
                  Archived Patients &amp; PhilPEN Risk Assessments ({filteredPatients.length})
                </CardTitle>
                <span className="text-[11px] text-slate-500">
                  Full clinical and PhilPEN forms preserved
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredPatients.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400">
                  No patients found in this archive folder matching your search.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                      <tr>
                        <th className="p-3">Patient ID</th>
                        <th className="p-3">Full Name</th>
                        <th className="p-3">Age / Sex</th>
                        <th className="p-3">PHILPEN Risk Status</th>
                        <th className="p-3">Blood Pressure</th>
                        <th className="p-3">PhilHealth No.</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPatients.map((p) => {
                        const hasRedFlag = p.philpenRecord?.redFlags
                          ? Object.values(p.philpenRecord.redFlags).some((v) => v === "Yes")
                          : false;

                        const bp = p.philpenRecord?.ncdRiskFactors?.bloodPressureSystolic &&
                          p.philpenRecord?.ncdRiskFactors?.bloodPressureDiastolic
                            ? `${p.philpenRecord.ncdRiskFactors.bloodPressureSystolic}/${p.philpenRecord.ncdRiskFactors.bloodPressureDiastolic}`
                            : p.healthInfo?.lastBp || "120/80";

                        return (
                          <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-mono font-semibold text-teal-800">
                              {p.patientIdNumber || p.id}
                            </td>
                            <td className="p-3 font-medium text-slate-900">
                              {p.fullName}
                            </td>
                            <td className="p-3 text-slate-600">
                              {p.age} yrs &bull; {p.sex}
                            </td>
                            <td className="p-3">
                              <Badge
                                variant={hasRedFlag || p.healthInfo?.philpenStatus === "High Risk" ? "destructive" : "success"}
                                className="text-[10px]"
                              >
                                {hasRedFlag ? "High Risk (Red Flag)" : p.healthInfo?.philpenStatus || "Completed"}
                              </Badge>
                            </td>
                            <td className="p-3 font-mono text-slate-700">
                              {bp} mmHg
                            </td>
                            <td className="p-3 font-mono text-slate-500">
                              {p.phicNo || "Unassigned"}
                            </td>
                            <td className="p-3 text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewPatient(p)}
                                className="h-7 text-xs text-teal-800 hover:bg-teal-50 border-teal-200"
                              >
                                <Eye className="h-3.5 w-3.5 mr-1" />
                                View PhilPEN Record
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: CONSULTATIONS */}
        <TabsContent value="consultations" className="mt-4">
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="py-3 px-5 border-b border-slate-100 bg-slate-50/60">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Archived Consultations ({filteredConsultations.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredConsultations.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400">
                  No consultations recorded in this month archive.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                      <tr>
                        <th className="p-3">Consult ID</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Patient Name</th>
                        <th className="p-3">Chief Complaint</th>
                        <th className="p-3">Diagnosis</th>
                        <th className="p-3">Attending</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredConsultations.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/80">
                          <td className="p-3 font-mono font-semibold text-slate-800">{c.id}</td>
                          <td className="p-3 font-mono text-slate-600">{c.date}</td>
                          <td className="p-3 font-medium text-slate-900">{c.patientName}</td>
                          <td className="p-3 text-slate-700">{c.reasonForVisit}</td>
                          <td className="p-3 font-semibold text-teal-900">{c.diagnosis}</td>
                          <td className="p-3 text-slate-600">{c.provider}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: APPOINTMENTS */}
        <TabsContent value="appointments" className="mt-4">
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="py-3 px-5 border-b border-slate-100 bg-slate-50/60">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Archived Appointments ({filteredAppointments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredAppointments.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400">
                  No appointments recorded in this month archive.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                      <tr>
                        <th className="p-3">Appt ID</th>
                        <th className="p-3">Date &amp; Time</th>
                        <th className="p-3">Patient Name</th>
                        <th className="p-3">Purpose</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAppointments.map((a) => (
                        <tr key={a.id} className="hover:bg-slate-50/80">
                          <td className="p-3 font-mono text-slate-800">{a.id}</td>
                          <td className="p-3 font-mono text-slate-600">
                            {a.date} &bull; {a.time}
                          </td>
                          <td className="p-3 font-medium text-slate-900">{a.patientName}</td>
                          <td className="p-3 text-slate-700">{a.purpose}</td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-[10px]">
                              {a.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: PRESCRIPTIONS */}
        <TabsContent value="prescriptions" className="mt-4">
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="py-3 px-5 border-b border-slate-100 bg-slate-50/60">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Archived Prescriptions ({filteredPrescriptions.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredPrescriptions.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400">
                  No prescriptions recorded in this month archive.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                      <tr>
                        <th className="p-3">Rx Number</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Patient</th>
                        <th className="p-3">Medicines Prescribed</th>
                        <th className="p-3">Physician</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPrescriptions.map((rx) => (
                        <tr key={rx.id} className="hover:bg-slate-50/80">
                          <td className="p-3 font-mono font-semibold text-slate-800">{rx.id}</td>
                          <td className="p-3 font-mono text-slate-600">{rx.date}</td>
                          <td className="p-3 font-medium text-slate-900">{rx.patientName}</td>
                          <td className="p-3 text-slate-700">
                            {rx.items && rx.items.length > 0
                              ? rx.items.map((i) => `${i.drug} (${i.quantity || 1})`).join(", ")
                              : rx.medicine || "Prescribed Medicine"}
                          </td>
                          <td className="p-3 text-slate-600">{rx.prescriber}</td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-[10px]">
                              {rx.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: MATERNAL CARE */}
        <TabsContent value="maternal" className="mt-4">
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="py-3 px-5 border-b border-slate-100 bg-slate-50/60">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Archived Maternal Care Records ({folder.data.maternalRecords?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 text-xs">
              {(folder.data.maternalRecords || []).length === 0 ? (
                <p className="text-center text-slate-400 py-6">No maternal care records filed for this month.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {folder.data.maternalRecords.map((m) => (
                    <div key={m.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{m.patientName}</span>
                        <span className="text-slate-500 block text-[11px]">
                          Age: {m.age} &bull; EDC: {m.edc || "N/A"} &bull; Gravida: {m.gravida || 1} Para: {m.para || 0}
                        </span>
                      </div>
                      <Badge variant={m.status === "Completed" ? "success" : "outline"} className="text-[10px]">
                        {m.status || "Active"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 6: FAMILY PLANNING */}
        <TabsContent value="fp" className="mt-4">
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="py-3 px-5 border-b border-slate-100 bg-slate-50/60">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Archived Family Planning Clients ({folder.data.familyPlanningRecords?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 text-xs">
              {(folder.data.familyPlanningRecords || []).length === 0 ? (
                <p className="text-center text-slate-400 py-6">No family planning records filed for this month.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {folder.data.familyPlanningRecords.map((fp) => (
                    <div key={fp.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{fp.fullName}</span>
                        <span className="text-slate-500 block text-[11px]">
                          Method: {fp.currentMethod} &bull; Type: {fp.clientType} &bull; Children: {fp.livingChildrenTotal || 0}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {fp.currentMethod}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 7: IMMUNIZATIONS */}
        <TabsContent value="immunizations" className="mt-4">
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="py-3 px-5 border-b border-slate-100 bg-slate-50/60">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Archived Immunization Records ({folder.data.immunizations?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 text-xs">
              {(folder.data.immunizations || []).length === 0 ? (
                <p className="text-center text-slate-400 py-6">No immunization records filed for this month.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {folder.data.immunizations.map((imm) => (
                    <div key={imm.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{imm.patientName}</span>
                        <span className="text-slate-500 block text-[11px]">
                          Mother: {imm.motherName} &bull; Recorded Vaccines: {Object.keys(imm.vaccines || {}).length} doses
                        </span>
                      </div>
                      <span className="font-mono text-slate-600 text-[11px]">{imm.id}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Archived Patient Details & PhilPEN Modal */}
      <ArchivedPatientDialog
        patient={selectedPatient}
        open={showPatientDialog}
        onOpenChange={setShowPatientDialog}
        folderMonthName={folder.monthName}
        folderYear={folder.year}
      />
    </div>
  );
}
