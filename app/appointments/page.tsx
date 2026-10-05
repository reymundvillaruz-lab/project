import { CalendarClock, Plus, Search, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Appointments | BHCMS",
  description: "Barangay Health Center Appointment Scheduling and Queue",
};

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Appointment Scheduling &amp; Calendar
          </h1>
          <p className="text-xs text-slate-500">
            Book patient appointments, organize health worker rounds, and manage doctor consultation days.
          </p>
        </div>
        <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-xs">
          <Plus className="h-3.5 w-3.5 mr-1" />
          Schedule Appointment
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search appointment by patient name..."
                className="pl-9 text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                Select Date
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={CalendarClock}
            title="No Appointments Scheduled"
            description="There are currently no patient visits or medical checkups booked. Click below to schedule an appointment."
            action={{
              label: "+ Schedule First Appointment",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
