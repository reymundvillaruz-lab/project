import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PatientRegistrationForm } from "@/features/patients/components/patient-registration-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register New Patient | BHCMS",
  description: "Register a new resident in the Barangay Health Care Management System",
};

export default function NewPatientPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link href="/patients">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Patients</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Register New Patient
          </h1>
          <p className="text-xs text-slate-500">
            Enroll a barangay resident into the primary health care registry.
          </p>
        </div>
      </div>

      <PatientRegistrationForm />
    </div>
  );
}
