import { Metadata } from "next";
import { Suspense } from "react";
import { PhilpenForm } from "@/components/philpen/philpen-form";

export const metadata: Metadata = {
  title: "PHILPEN Risk Assessment | BHCMS",
  description: "PHILPEN Risk Assessment Form (Revised 2022) for adults 20 years old and above",
};

export default function NewPatientPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading PHILPEN form...</div>}>
      <PhilpenForm />
    </Suspense>
  );
}
