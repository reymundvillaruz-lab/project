import { Metadata } from "next";
import { PatientRegistryView } from "@/components/patients/patient-registry-view";

export const metadata: Metadata = {
  title: "Patient Registry | BHCMS",
  description: "Manage and view registered patients in the Barangay Health Center.",
};

export default function PatientsPage() {
  return <PatientRegistryView />;
}
