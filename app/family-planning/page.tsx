import { Metadata } from "next";
import { FamilyPlanningView } from "@/components/family-planning/family-planning-view";

export const metadata: Metadata = {
  title: "Family Planning | BHCMS",
  description:
    "Barangay Health Center Responsible Parenthood and Family Planning (DOH FP Form 1 ITR)",
};

export default function FamilyPlanningPage() {
  return <FamilyPlanningView />;
}
