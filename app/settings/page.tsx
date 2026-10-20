import { Metadata } from "next";
import { SettingsView } from "@/components/settings/settings-view";
import { requireAdmin } from "@/lib/auth/roles";

export const metadata: Metadata = {
  title: "Settings | BHCMS",
  description: "Barangay Health Care Management System Settings",
};

export default async function SettingsPage() {
  await requireAdmin();
  return <SettingsView />;
}

