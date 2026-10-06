import { Metadata } from "next";
import { PatientDetailsView } from "@/components/patients/patient-details-view";

export const metadata: Metadata = {
  title: "Patient Profile | BHCMS",
  description: "Barangay Health Center Patient Profile and Health Record",
};

interface PatientProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientProfilePage({ params }: PatientProfilePageProps) {
  const { id } = await params;
  return <PatientDetailsView patientId={id} />;
}
