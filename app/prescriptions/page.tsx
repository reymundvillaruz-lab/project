import Link from "next/link";
import { Pill, Plus, Search, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prescriptions | BHCMS",
  description: "Barangay Health Center Prescriptions and Medicine Dispensation",
};

export default function PrescriptionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Prescriptions &amp; Dispensed Medicines
          </h1>
          <p className="text-xs text-slate-500">
            Log patient prescriptions, track dispensed medicines, and monitor inventory releases.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/medicines">
            <Button variant="outline" size="sm" className="text-xs">
              <Package className="h-3.5 w-3.5 mr-1" />
              Manage Inventory
            </Button>
          </Link>
          <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" />
            Issue Prescription
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search prescription by patient or doctor..."
                className="pl-9 text-xs"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Pill}
            title="No Prescriptions Issued"
            description="No prescriptions or dispensed medicines have been recorded. When a doctor or BHW issues medication, record it here."
            action={{
              label: "+ Issue First Prescription",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
