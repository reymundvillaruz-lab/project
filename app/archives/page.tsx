import { Metadata } from "next";
import { MonthlyArchivesView } from "@/components/archives/monthly-archives-view";

export const metadata: Metadata = {
  title: "Monthly Records Archive | BHCMS",
  description: "Barangay Health Center Monthly Records Archive & System Reset Explorer",
};

export default function ArchivesPage() {
  return <MonthlyArchivesView />;
}
