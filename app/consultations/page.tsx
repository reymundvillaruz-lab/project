import { Metadata } from "next";
import { ConsultationListView } from "@/components/consultations/consultation-list-view";

export const metadata: Metadata = {
  title: "Consultations | BHCMS",
  description: "Manage and review patient consultations.",
};

export default function ConsultationsPage() {
  return <ConsultationListView />;
}
