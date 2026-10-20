"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  HeartHandshake,
  HeartPulse,
  Stethoscope,
  Syringe,
  CalendarClock,
  Pill,
  Edit3,
  Calendar,
  ShieldCheck,
  Activity,
  AlertCircle,
  FileText,
  FileCheck2,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  MockPatient,
  INITIAL_MOCK_PATIENTS,
  getPatientById,
  deleteStoredPatient,
} from "@/lib/mock-data/patients";
import {
  getPatientByIdFromSupabase,
  deletePatientFromSupabase,
} from "@/lib/supabase/services/patients-service";
import { PhilpenAssessmentTab } from "./philpen-assessment-tab";

interface PatientDetailsViewProps {
  patientId: string;
}

export function PatientDetailsView({ patientId }: PatientDetailsViewProps) {
  const router = useRouter();
  const [patient, setPatient] = React.useState<MockPatient | null>(() => {
    return INITIAL_MOCK_PATIENTS.find((p) => p.id.toLowerCase() === patientId.toLowerCase()) || null;
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const sbPatient = await getPatientByIdFromSupabase(patientId);
        const localPatient = getPatientById(patientId);

        if (isMounted) {
          if (sbPatient) {
            // If Supabase patient has no philpenRecord, but local has one, merge it
            if (!sbPatient.philpenRecord && localPatient?.philpenRecord) {
              sbPatient.philpenRecord = localPatient.philpenRecord;
            }
            setPatient(sbPatient);
            setIsLoading(false);
            return;
          }

          if (localPatient) {
            setPatient(localPatient);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Could not load patient from Supabase:", err);
      }

      if (isMounted) {
        const found = getPatientById(patientId);
        if (found) {
          setPatient(found);
        }
        setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [patientId]);

  const handleDelete = async () => {
    if (!patient) return;
    setIsDeleting(true);
    try {
      const result = await deletePatientFromSupabase(patient.id);
      if (result.success) {
        deleteStoredPatient(patient.id);
        router.push("/patients");
      } else {
        alert(`Failed to delete patient: ${result.error || "Unknown error"}`);
      }
    } catch (e: any) {
      alert(`Error deleting patient: ${e.message}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto py-16 text-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          <p className="text-xs text-slate-500 font-medium">
            Fetching patient record from Supabase...
          </p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto py-8">
        <Link href="/patients">
          <Button variant="outline" size="sm" className="text-xs">
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Back to Patient Registry
          </Button>
        </Link>
        <EmptyState
          icon={User}
          title={`Patient Record Not Found (${patientId})`}
          description="The requested patient ID was not found in the Supabase database or local registry."
          action={{
            label: "Return to Patient Registry",
            href: "/patients",
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Header with Back button and Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/patients">
            <Button variant="outline" size="sm" className="h-9 w-9 p-0" aria-label="Back to Patients">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {patient.fullName}
              </h1>
              <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {patient.patientIdNumber || patient.id}
              </span>
              <Badge
                variant={patient.status === "Active" ? "success" : "warning"}
                className="text-xs"
              >
                {patient.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500">
              {patient.barangay} &bull; Registered Barangay Resident &bull; Supabase Synchronized
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/patients/new?edit=${patient.id}`}>
            <Button variant="outline" size="sm" className="text-xs">
              <Edit3 className="h-3.5 w-3.5 mr-1.5" />
              Edit Profile
            </Button>
          </Link>
          <Link href={`/consultations/new?patientId=${patient.id}`}>
            <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-xs text-white">
              <Stethoscope className="h-3.5 w-3.5 mr-1.5" />
              New Consultation
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-800 border-rose-200"
            title="Delete Patient Record"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-rose-700 flex items-center gap-2 text-base">
              <Trash2 className="h-5 w-5 text-rose-600" />
              Delete Patient Record
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 pt-1 leading-relaxed">
              Are you sure you want to permanently delete the patient record for{" "}
              <strong className="text-slate-900">{patient.fullName}</strong> (
              <span className="font-mono text-slate-800">{patient.id}</span>)?
              <br />
              <span className="text-rose-600 font-medium mt-1 block">
                This record and any dependent records will be permanently removed from Supabase.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => setShowDeleteConfirm(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              onClick={handleDelete}
              className="text-xs bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                  Deleting from Supabase...
                </>
              ) : (
                "Confirm Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Patient Overview Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex items-center gap-3 md:col-span-2">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-700 text-white font-bold text-lg shadow-xs">
            {patient.firstName[0]}
            {patient.lastName[0]}
          </div>
          <div className="space-y-0.5 min-w-0">
            <h2 className="text-sm font-bold text-slate-900 truncate">{patient.fullName}</h2>
            <p className="text-xs text-slate-600">
              {patient.sex} &bull; {patient.age} yrs old &bull; Born {patient.birthdate}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              PhilHealth: <span className="font-mono text-slate-600">{patient.phicNo || "Unassigned"}</span>
            </p>
          </div>
        </div>

        <div className="space-y-1 text-xs border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
          <span className="text-slate-400 block text-[10px] font-semibold uppercase">Clinical Baseline</span>
          <p className="font-medium text-slate-800">
            Last BP:{" "}
            <span className="font-mono text-teal-800">
              {patient.philpenRecord?.ncdRiskFactors?.bloodPressureSystolic &&
              patient.philpenRecord?.ncdRiskFactors?.bloodPressureDiastolic
                ? `${patient.philpenRecord.ncdRiskFactors.bloodPressureSystolic}/${patient.philpenRecord.ncdRiskFactors.bloodPressureDiastolic} mmHg`
                : patient.healthInfo?.lastBp || "120/80"}
            </span>
          </p>
          <p className="font-medium text-slate-800">
            Last BMI:{" "}
            <span className="font-mono text-slate-700">
              {patient.philpenRecord?.ncdRiskFactors?.bmi
                ? `${patient.philpenRecord.ncdRiskFactors.bmi} kg/m²`
                : patient.healthInfo?.lastBmi || "22.5"}
            </span>
          </p>
          <p className="text-[11px] text-slate-500">Blood Type: {patient.healthInfo?.bloodType || "O+"}</p>
        </div>

        <div className="space-y-1 text-xs border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
          <span className="text-slate-400 block text-[10px] font-semibold uppercase">PHILPEN Status</span>
          <Badge
            variant={
              (patient.philpenRecord?.redFlags &&
                Object.values(patient.philpenRecord.redFlags).some((v) => v === "Yes")) ||
              patient.healthInfo?.philpenStatus === "High Risk"
                ? "destructive"
                : "success"
            }
            className="text-[11px]"
          >
            {patient.philpenRecord?.redFlags &&
            Object.values(patient.philpenRecord.redFlags).some((v) => v === "Yes")
              ? "High Risk"
              : patient.healthInfo?.philpenStatus || "Completed"}
          </Badge>
          <p className="text-[11px] text-slate-500 pt-1">
            Last Visit: <span className="font-medium text-slate-700">{patient.lastVisit || "Recent"}</span>
          </p>
        </div>
      </div>

      {/* 3. Detailed Tabs Section */}
      <Tabs defaultValue="philpen-form">
        <TabsList className="w-full flex-wrap h-auto gap-1 bg-slate-100 p-1.5 rounded-lg">
          <TabsTrigger
            value="philpen-form"
            className="text-xs font-semibold data-[state=active]:bg-teal-700 data-[state=active]:text-white shadow-2xs"
          >
            <FileCheck2 className="h-3.5 w-3.5 mr-1" />
            PHILPEN Risk Assessment Record
          </TabsTrigger>
          <TabsTrigger value="patient-info" className="text-xs">
            <User className="h-3.5 w-3.5 mr-1" />
            Patient Information
          </TabsTrigger>
          <TabsTrigger value="contact-info" className="text-xs">
            <Phone className="h-3.5 w-3.5 mr-1" />
            Contact Information
          </TabsTrigger>
          <TabsTrigger value="address" className="text-xs">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            Address
          </TabsTrigger>
          <TabsTrigger value="emergency" className="text-xs">
            <HeartHandshake className="h-3.5 w-3.5 mr-1" />
            Emergency Contact
          </TabsTrigger>
          <TabsTrigger value="health-info" className="text-xs">
            <HeartPulse className="h-3.5 w-3.5 mr-1" />
            Health Information
          </TabsTrigger>
          <TabsTrigger value="consultations" className="text-xs">
            <Stethoscope className="h-3.5 w-3.5 mr-1" />
            Recent Consultations
          </TabsTrigger>
          <TabsTrigger value="immunization" className="text-xs">
            <Syringe className="h-3.5 w-3.5 mr-1" />
            Immunization History
          </TabsTrigger>
          <TabsTrigger value="appointments" className="text-xs">
            <CalendarClock className="h-3.5 w-3.5 mr-1" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="prescriptions" className="text-xs">
            <Pill className="h-3.5 w-3.5 mr-1" />
            Prescriptions
          </TabsTrigger>
        </TabsList>

        {/* TAB: PHILPEN RISK ASSESSMENT RECORD */}
        <TabsContent value="philpen-form">
          <PhilpenAssessmentTab patient={patient} />
        </TabsContent>

        {/* TAB 1: PATIENT INFORMATION */}
        <TabsContent value="patient-info">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold">Patient Information (PHILPEN Standard)</CardTitle>
              <CardDescription>Primary demographic identifiers of the registered patient</CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Surname</span>
                  <span className="font-semibold text-slate-800 text-sm">{patient.lastName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Given Name</span>
                  <span className="font-semibold text-slate-800 text-sm">{patient.firstName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Middle Name</span>
                  <span className="font-semibold text-slate-800 text-sm">{patient.middleName || "—"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Age (Calculated)</span>
                  <span className="font-medium text-slate-800">{patient.age} years old</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Sex</span>
                  <span className="font-medium text-slate-800">{patient.sex}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Date of Birth</span>
                  <span className="font-medium text-slate-800">{patient.birthdate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">PhilHealth Identification No. (PHIC)</span>
                  <span className="font-mono font-medium text-slate-800">{patient.phicNo || "None"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Civil Status</span>
                  <span className="font-medium text-slate-800">{patient.civilStatus}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Religion</span>
                  <span className="font-medium text-slate-800">{patient.religion}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">PWD ID Card No.</span>
                  <span className="font-medium text-slate-800">{patient.pwdId || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Employment Status</span>
                  <span className="font-medium text-slate-800">{patient.employmentStatus}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Indigenous People (IP / Non-IP)</span>
                  <span className="font-medium text-slate-800">{patient.isIp}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Ethnicity</span>
                  <span className="font-medium text-slate-800">{patient.ethnicity}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: CONTACT INFORMATION */}
        <TabsContent value="contact-info">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold">Contact Information</CardTitle>
              <CardDescription>Phone, telecommunications, and notification reachability</CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Primary Contact Number</span>
                  <span className="font-mono font-semibold text-slate-900 text-sm">{patient.contact}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Alternate Contact Number</span>
                  <span className="font-mono text-slate-600">None registered</span>
                </div>
                <div>
                  <span className="text-slate-400 block">SMS Notification Consent</span>
                  <Badge variant="outline" className="text-[10px] text-teal-800 bg-teal-50">
                    Consent Given
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: ADDRESS */}
        <TabsContent value="address">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold">Residential Address</CardTitle>
              <CardDescription>Barangay catchment and household location details</CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block">Complete Address</span>
                  <span className="font-medium text-slate-900">{patient.address}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Barangay</span>
                  <span className="font-medium text-slate-900">{patient.barangay}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Health Station Zone</span>
                  <span className="font-medium text-slate-700">Cluster A &bull; Station 1</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Catchment Status</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-800 bg-emerald-50">
                    Within Catchment Area
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: EMERGENCY CONTACT */}
        <TabsContent value="emergency">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold">Emergency Contact Person</CardTitle>
              <CardDescription>Next-of-kin or authorized contact during emergencies</CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Contact Person Name</span>
                  <span className="font-semibold text-slate-900 text-sm">
                    {patient.emergencyContact?.name || "Not specified"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Relationship to Patient</span>
                  <span className="font-medium text-slate-800">
                    {patient.emergencyContact?.relationship || "Not specified"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Emergency Phone Number</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {patient.emergencyContact?.contact || "Not specified"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: HEALTH INFORMATION */}
        <TabsContent value="health-info">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold">Health Information &amp; PHILPEN Summary</CardTitle>
              <CardDescription>Clinical profile, blood type, known allergies, and risk category</CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Blood Group</span>
                  <span className="font-bold text-slate-900 text-base">{patient.healthInfo.bloodType || "O+"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Latest Blood Pressure</span>
                  <span className="font-mono font-bold text-teal-800 text-base">
                    {patient.philpenRecord?.ncdRiskFactors?.bloodPressureSystolic &&
                    patient.philpenRecord?.ncdRiskFactors?.bloodPressureDiastolic
                      ? `${patient.philpenRecord.ncdRiskFactors.bloodPressureSystolic}/${patient.philpenRecord.ncdRiskFactors.bloodPressureDiastolic} mmHg`
                      : patient.healthInfo.lastBp}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Latest Body Mass Index</span>
                  <span className="font-mono font-bold text-slate-800 text-base">
                    {patient.philpenRecord?.ncdRiskFactors?.bmi
                      ? `${patient.philpenRecord.ncdRiskFactors.bmi} kg/m²`
                      : patient.healthInfo.lastBmi}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">PHILPEN NCD Risk</span>
                  <Badge
                    variant={
                      (patient.philpenRecord?.redFlags &&
                        Object.values(patient.philpenRecord.redFlags).some((v) => v === "Yes")) ||
                      patient.healthInfo.philpenStatus === "High Risk"
                        ? "destructive"
                        : "success"
                    }
                    className="text-xs mt-1"
                  >
                    {patient.philpenRecord?.redFlags &&
                    Object.values(patient.philpenRecord.redFlags).some((v) => v === "Yes")
                      ? "High Risk (Red Flag)"
                      : patient.healthInfo.philpenStatus}
                  </Badge>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Known Allergies</span>
                  <div className="flex flex-wrap gap-1.5">
                    {patient.healthInfo.allergies.map((allergy) => (
                      <Badge key={allergy} variant="outline" className="text-[10px] text-rose-800 bg-rose-50 border-rose-200">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Chronic Medical Conditions</span>
                  <div className="flex flex-wrap gap-1.5">
                    {patient.healthInfo.chronicConditions.map((condition) => (
                      <Badge key={condition} variant="outline" className="text-[10px] text-slate-800 bg-slate-100">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 6: RECENT CONSULTATIONS */}
        <TabsContent value="consultations">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold">Consultation &amp; Clinical Records</CardTitle>
              <CardDescription>Chronological medical consults, vital signs assessment, and diagnoses</CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              {patient.consultations.length === 0 ? (
                <EmptyState
                  icon={Stethoscope}
                  title="No Consultations Recorded"
                  description="This patient has not logged any clinical consultations yet."
                  action={{
                    label: "+ Record Consultation",
                    href: "/consultations",
                  }}
                />
              ) : (
                <div className="divide-y divide-slate-100">
                  {patient.consultations.map((con) => (
                    <div key={con.id} className="py-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-900">{con.purpose}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{con.date}</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        <strong className="text-slate-700">Diagnosis:</strong> {con.diagnosis}
                      </p>
                      <p className="text-[11px] text-teal-800 font-medium">Attending: {con.physician}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 7: IMMUNIZATION HISTORY */}
        <TabsContent value="immunization">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold">Immunization History</CardTitle>
              <CardDescription>Adult vaccines, booster doses, and pneumonia/flu tracking</CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              {patient.immunizations.length === 0 ? (
                <EmptyState
                  icon={Syringe}
                  title="No Immunization Records Found"
                  description="No adult vaccine doses or booster records have been recorded for this patient."
                  action={{
                    label: "+ Record Vaccine",
                    href: "/immunization",
                  }}
                />
              ) : (
                <div className="divide-y divide-slate-100">
                  {patient.immunizations.map((imm, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-900 block">{imm.vaccine}</span>
                        <span className="text-[11px] text-slate-500">
                          Batch: {imm.batchNo} &bull; Administered by: {imm.administeredBy}
                        </span>
                      </div>
                      <span className="font-mono text-slate-500 text-[11px]">{imm.dateGiven}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 8: APPOINTMENTS */}
        <TabsContent value="appointments">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold">Patient Appointments</CardTitle>
              <CardDescription>Scheduled consultations, follow-ups, and community rounds</CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              {patient.appointments.length === 0 ? (
                <EmptyState
                  icon={CalendarClock}
                  title="No Upcoming Appointments"
                  description="There are currently no scheduled appointments for this patient."
                  action={{
                    label: "+ Schedule Visit",
                    href: "/appointments",
                  }}
                />
              ) : (
                <div className="divide-y divide-slate-100">
                  {patient.appointments.map((apt) => (
                    <div key={apt.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-900 block">{apt.purpose}</span>
                        <span className="text-[11px] text-slate-500">
                          {apt.date} at {apt.time}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[10px] bg-slate-50">
                        {apt.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 9: PRESCRIPTIONS */}
        <TabsContent value="prescriptions">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold">Prescriptions &amp; Medications</CardTitle>
              <CardDescription>Active prescribed drugs, dosages, and pharmacy release logs</CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              {patient.prescriptions.length === 0 ? (
                <EmptyState
                  icon={Pill}
                  title="No Prescriptions Issued"
                  description="There are no active or historical prescriptions logged for this patient."
                  action={{
                    label: "+ Issue Prescription",
                    href: "/prescriptions",
                  }}
                />
              ) : (
                <div className="divide-y divide-slate-100">
                  {patient.prescriptions.map((rx) => (
                    <div key={rx.id} className="py-3 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{rx.medicine}</span>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {rx.dosage}
                        </Badge>
                      </div>
                      <p className="text-slate-600">
                        <span className="text-slate-400">Instructions:</span> {rx.frequency} &bull; Duration: {rx.duration}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
