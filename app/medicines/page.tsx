import { Metadata } from "next";
import { MedicinesView } from "@/components/medicines/medicines-view";

export const metadata: Metadata = {
  title: "Medicine Inventory | BHCMS",
  description:
    "Barangay Health Center Medicine and Supply Inventory Management",
};

export default function MedicinesPage() {
  return <MedicinesView />;
}
