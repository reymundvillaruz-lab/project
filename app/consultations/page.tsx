import { Stethoscope, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consultations | BHCMS",
  description: "Barangay Health Center Daily Consultations and Clinical Triage",
};

export default function ConsultationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Consultations &amp; Clinical Triage
          </h1>
          <p className="text-xs text-slate-500">
            Daily patient consultations, vital signs recording, triage queue, and physician referrals.
          </p>
        </div>
        <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-xs">
          <Plus className="h-3.5 w-3.5 mr-1" />
          New Consultation
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search consultations by patient name..."
                className="pl-9 text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                <Filter className="h-3.5 w-3.5 mr-1" />
                Filter by Status
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Stethoscope}
            title="No Consultations Recorded"
            description="There are no consultations or triage records recorded for today. When a patient arrives, start a consultation to record vital signs and treatment plans."
            action={{
              label: "+ Start First Consultation",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
