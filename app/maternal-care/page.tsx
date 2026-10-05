import { HeartPulse, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maternal Care | BHCMS",
  description: "Barangay Health Center Maternal and Child Health Tracking",
};

export default function MaternalCarePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Maternal &amp; Child Health Care
          </h1>
          <p className="text-xs text-slate-500">
            Prenatal visits, estimated delivery date (EDD) monitoring, high-risk pregnancy screening, and postpartum visits.
          </p>
        </div>
        <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-xs">
          <Plus className="h-3.5 w-3.5 mr-1" />
          Enroll Expectant Mother
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search mother by name, EDC, or Purok..."
                className="pl-9 text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                <Filter className="h-3.5 w-3.5 mr-1" />
                Trimester Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={HeartPulse}
            title="No Active Maternal Records"
            description="There are currently no pregnant or postpartum mothers enrolled in the maternal care register. Click below to enroll an expectant mother."
            action={{
              label: "+ Enroll Expectant Mother",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
