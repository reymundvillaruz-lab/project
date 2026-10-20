import { Metadata } from "next";
import { Suspense } from "react";
import { PhilpenForm } from "@/components/philpen/philpen-form";

export const metadata: Metadata = {
  title: "Patient Registration & Risk Assessment | BHCMS",
  description: "Register resident patient record via DOH PHILPEN Risk Assessment (Revised 2022)",
};

export default function NewPatientPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-slate-500">
          Loading PHILPEN assessment & registration module...
        </div>
      }
    >
      <PhilpenForm />
    </Suspense>
  );
}

