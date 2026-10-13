import { Metadata } from "next";
import { MaternalCareView } from "@/components/maternal-care/maternal-care-view";

export const metadata: Metadata = {
  title: "Maternal Care | BHCMS",
  description: "Barangay Health Center Maternal Care Register & Target Client List (BNC Form 1-G-a)",
};

export default function MaternalCarePage() {
  return <MaternalCareView />;
}
