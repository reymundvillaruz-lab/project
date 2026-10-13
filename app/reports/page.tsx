import { Metadata } from "next";
import { ReportsDashboardView } from "@/components/reports/reports-dashboard-view";

export const metadata: Metadata = {
  title: "Reports & Analytics | BHCMS",
  description:
    "Barangay Health Center Field Health Services Information System (FHSIS) and Health Statistics",
};

export default function ReportsPage() {
  return <ReportsDashboardView />;
}
