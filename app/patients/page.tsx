import Link from "next/link";
import { Users, UserPlus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patient Registry | BHCMS",
  description: "Barangay Health Center Patient Registry",
};

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Patient Registry
          </h1>
          <p className="text-xs text-slate-500">
            Master directory of registered residents, PhilHealth members, and patient records.
          </p>
        </div>
        <Link href="/patients/new">
          <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-xs">
            <UserPlus className="h-3.5 w-3.5 mr-1" />
            Register New Patient
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by name, PhilHealth ID, Purok..."
                className="pl-9 text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                <Filter className="h-3.5 w-3.5 mr-1" />
                Filter by Purok
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Users}
            title="Patient Registry is Empty"
            description="No barangay residents are registered in the system yet. Click below to begin enrolling patients into the registry."
            action={{
              label: "+ Register First Patient",
              href: "/patients/new",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
