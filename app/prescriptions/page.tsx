import { Metadata } from "next";
import { PrescriptionsView } from "@/components/prescriptions/prescriptions-view";

export const metadata: Metadata = {
  title: "Prescriptions | BHCMS",
  description:
    "Barangay Health Center Prescriptions, Drug Orders, and Medicine Dispensation Logs",
};

export default function PrescriptionsPage() {
  return <PrescriptionsView />;
}
