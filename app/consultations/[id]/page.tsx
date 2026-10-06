import { Metadata } from "next";
import { ConsultationDetailView } from "@/components/consultations/consultation-detail-view";

export const metadata: Metadata = {
  title: "Consultation Details | BHCMS",
  description: "View patient consultation details, vitals, and care plan.",
};

interface ConsultationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ConsultationDetailPage({ params }: ConsultationDetailPageProps) {
  const { id } = await params;
  return <ConsultationDetailView consultationId={id} />;
}
