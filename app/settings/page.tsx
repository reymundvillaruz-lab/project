import { Metadata } from "next";
import { SettingsView } from "@/components/settings/settings-view";

export const metadata: Metadata = {
  title: "Settings | BHCMS",
  description: "Barangay Health Care Management System Settings",
};

export default function SettingsPage() {
  return <SettingsView />;
}

