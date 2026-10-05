import { getDashboardData } from "@/features/dashboard/services/dashboard-service";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | BHCMS",
  description: "Barangay Health Care Management System Dashboard",
};

export default async function DashboardPage() {
  const data = await getDashboardData();

  return <DashboardView initialData={data} />;
}
