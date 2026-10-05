import { Syringe, Plus, Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expanded Immunization Program | BHCMS",
  description: "Barangay Health Center Expanded Program on Immunization (EPI)",
};

export default function ImmunizationPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Expanded Program on Immunization (EPI)
          </h1>
          <p className="text-xs text-slate-500">
            Infant vaccine schedules (BCG, Pentavalent, OPV, IPV, Measles-Rubella), booster tracking, and stock management.
          </p>
        </div>
        <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-xs">
          <Plus className="h-3.5 w-3.5 mr-1" />
          Log Vaccination
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search infant/child by mother's or child's name..."
                className="pl-9 text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                This Week&apos;s Due
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Syringe}
            title="No Immunization Records Found"
            description="No child vaccination records or EPI cards have been recorded yet. Click below to log a child's vaccination visit."
            action={{
              label: "+ Log First Vaccination",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
