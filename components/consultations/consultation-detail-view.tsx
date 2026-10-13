"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Edit3,
  User,
  Calendar,
  Activity,
  FileText,
  ClipboardCheck,
  CalendarClock,
  Phone,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  MockConsultation,
  INITIAL_MOCK_CONSULTATIONS,
  getConsultationById,
} from "@/lib/mock-data/consultations";

interface ConsultationDetailViewProps {
  consultationId: string;
}

export function ConsultationDetailView({ consultationId }: ConsultationDetailViewProps) {
  const [consultation, setConsultation] = React.useState<MockConsultation | null>(() => {
    return (
      INITIAL_MOCK_CONSULTATIONS.find(
        (c) => c.id.toLowerCase() === consultationId.toLowerCase()
      ) || null
    );
  });

  React.useEffect(() => {
    const found = getConsultationById(consultationId);
    if (found) {
      setConsultation(found);
    }
  }, [consultationId]);

  if (!consultation) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto py-8">
        <Link href="/consultations">
          <Button variant="outline" size="sm" className="text-xs">
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Back to Consultations
          </Button>
        </Link>
        <EmptyState
          icon={Stethoscope}
          title={`Consultation Not Found (${consultationId})`}
          description="The requested consultation record was not found in the local database."
          action={{
            label: "Return to Consultations",
            href: "/consultations",
          }}
        />
      </div>
    );
  }

  const getStatusBadge = (status: MockConsultation["status"]) => {
    switch (status) {
      case "Completed":
        return <Badge variant="success" className="text-xs">Completed</Badge>;
      case "Follow-up":
        return <Badge variant="warning" className="text-xs">Follow-up</Badge>;
      case "Pending":
      default:
        return <Badge variant="secondary" className="text-xs">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Header with Back button and Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/consultations">
            <Button variant="outline" size="sm" className="h-9 w-9 p-0" aria-label="Back to Consultations">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Consultation #{consultation.id}
              </h1>
              {getStatusBadge(consultation.status)}
            </div>
            <p className="text-xs text-slate-500">
              {consultation.date} &bull; Attended by {consultation.provider}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/consultations/new?edit=${consultation.id}`}>
            <Button variant="outline" size="sm" className="text-xs">
              <Edit3 className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Button>
          </Link>
          <Link href="/consultations">
            <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-xs">
              Back to Consultations
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Patient Information */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-teal-700" />
            <CardTitle className="text-sm font-semibold">Patient Information</CardTitle>
          </div>
          <CardDescription>Demographic and contact records of the patient</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Patient ID</span>
              <span className="font-mono font-bold text-teal-800">{consultation.patientId}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Full Name</span>
              <span className="font-bold text-slate-900">{consultation.patientName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Age &amp; Sex</span>
              <span className="font-medium text-slate-700">
                {consultation.patientAge} years old &bull; {consultation.patientSex}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Contact Number</span>
              <span className="font-mono font-medium text-slate-700">{consultation.patientContact}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Visit Information */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-teal-700" />
            <CardTitle className="text-sm font-semibold">Visit Information</CardTitle>
          </div>
          <CardDescription>Clinical visit log details and attending personnel</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Consultation ID</span>
              <span className="font-mono font-bold text-slate-800">{consultation.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Consultation Date</span>
              <span className="font-semibold text-slate-900">{consultation.date}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Visit Type</span>
              <Badge variant="outline" className="text-[11px] font-medium mt-0.5">
                {consultation.visitType}
              </Badge>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">BHW / Provider</span>
              <span className="font-semibold text-slate-900">{consultation.provider}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Vital Signs */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-teal-700" />
            <CardTitle className="text-sm font-semibold">Vital Signs</CardTitle>
          </div>
          <CardDescription>Triage measurements and baseline physiological parameters</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="rounded-md bg-slate-50 p-3 border border-slate-100 text-center">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Temperature</span>
              <span className="font-mono font-bold text-slate-900 text-base">
                {consultation.vitalSigns.temperature ? `${consultation.vitalSigns.temperature} °C` : "—"}
              </span>
            </div>

            <div className="rounded-md bg-slate-50 p-3 border border-slate-100 text-center">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Blood Pressure</span>
              <span className="font-mono font-bold text-teal-800 text-base">
                {consultation.vitalSigns.bloodPressureSystolic && consultation.vitalSigns.bloodPressureDiastolic
                  ? `${consultation.vitalSigns.bloodPressureSystolic}/${consultation.vitalSigns.bloodPressureDiastolic} mmHg`
                  : "—"}
              </span>
            </div>

            <div className="rounded-md bg-slate-50 p-3 border border-slate-100 text-center">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Pulse Rate</span>
              <span className="font-mono font-bold text-slate-900 text-base">
                {consultation.vitalSigns.pulseRate ? `${consultation.vitalSigns.pulseRate} bpm` : "—"}
              </span>
            </div>

            <div className="rounded-md bg-slate-50 p-3 border border-slate-100 text-center">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Respiratory Rate</span>
              <span className="font-mono font-bold text-slate-900 text-base">
                {consultation.vitalSigns.respiratoryRate ? `${consultation.vitalSigns.respiratoryRate} cpm` : "—"}
              </span>
            </div>

            <div className="rounded-md bg-slate-50 p-3 border border-slate-100 text-center">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Weight</span>
              <span className="font-mono font-bold text-slate-900 text-base">
                {consultation.vitalSigns.weightKg ? `${consultation.vitalSigns.weightKg} kg` : "—"}
              </span>
            </div>

            <div className="rounded-md bg-slate-50 p-3 border border-slate-100 text-center">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Height</span>
              <span className="font-mono font-bold text-slate-900 text-base">
                {consultation.vitalSigns.heightCm ? `${consultation.vitalSigns.heightCm} cm` : "—"}
              </span>
            </div>

            <div className="rounded-md bg-slate-50 p-3 border border-slate-100 text-center sm:col-span-2">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Body Mass Index (BMI)</span>
              <span className="font-mono font-bold text-slate-900 text-base">
                {consultation.vitalSigns.bmi ? `${consultation.vitalSigns.bmi} kg/m²` : "—"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Assessment */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-teal-700" />
            <CardTitle className="text-sm font-semibold">Assessment &amp; Complaint</CardTitle>
          </div>
          <CardDescription>Primary complaint and diagnostic assessment</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">
              Chief Complaint / Reason for Visit
            </span>
            <p className="font-medium text-slate-900 bg-slate-50 p-3 rounded-md border border-slate-100">
              {consultation.reasonForVisit}
            </p>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">
              Diagnosis / Clinical Assessment
            </span>
            <p className="font-semibold text-slate-900 bg-teal-50/50 p-3 rounded-md border border-teal-100">
              {consultation.diagnosis}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 6. Notes */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-teal-700" />
            <CardTitle className="text-sm font-semibold">Consultation Notes</CardTitle>
          </div>
          <CardDescription>Clinical guidance and instructions documented during the visit</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 text-xs">
          <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
            {consultation.notes || "No additional notes recorded."}
          </p>
        </CardContent>
      </Card>

      {/* 7. Follow-up */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-teal-700" />
            <CardTitle className="text-sm font-semibold">Follow-up Plan</CardTitle>
          </div>
          <CardDescription>Follow-up schedule and patient reminders</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 text-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Follow-up Required:</span>
            <Badge
              variant={consultation.followUp.required === "Yes" ? "warning" : "secondary"}
              className="text-xs"
            >
              {consultation.followUp.required}
            </Badge>
          </div>

          {consultation.followUp.required === "Yes" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-0.5">
                  Follow-up Date
                </span>
                <span className="font-semibold text-slate-900">
                  {consultation.followUp.date || "Not specified"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-0.5">
                  Follow-up Instructions
                </span>
                <span className="font-medium text-slate-800">
                  {consultation.followUp.instructions || "Standard follow-up instructions"}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer Back button */}
      <div className="flex items-center justify-between pt-2">
        <Link href="/consultations">
          <Button variant="outline" size="sm" className="text-xs">
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Back to Consultations
          </Button>
        </Link>
        <Link href={`/consultations/new?edit=${consultation.id}`}>
          <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-xs">
            <Edit3 className="h-3.5 w-3.5 mr-1.5" />
            Edit Consultation
          </Button>
        </Link>
      </div>
    </div>
  );
}
