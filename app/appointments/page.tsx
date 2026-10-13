import { Metadata } from "next";
import { AppointmentView } from "@/components/appointments/appointment-view";

export const metadata: Metadata = {
  title: "Appointments | BHCMS",
  description:
    "Barangay Health Center Appointment Scheduling, Queue Management, and Calendar View",
};

export default function AppointmentsPage() {
  return <AppointmentView />;
}
