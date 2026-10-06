import { Metadata } from "next";
import { Suspense } from "react";
import { ConsultationForm } from "@/components/consultations/consultation-form";

export const metadata: Metadata = {
  title: "New Consultation | BHCMS",
  description: "Record a new patient clinical consultation at the Barangay Health Center.",
};

export default function NewConsultationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading consultation form...</div>}>
      <ConsultationForm />
    </Suspense>
  );
}
