import Link from "next/link";
import { Package, Plus, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medicine Inventory | BHCMS",
  description: "Barangay Health Center Medicine and Supply Inventory",
};

export default function MedicinesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/prescriptions">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Prescriptions</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Medicines &amp; Pharmacy Inventory
            </h1>
            <p className="text-xs text-slate-500">
              Manage stock levels, batch expiry dates, and supply requests for the barangay health station.
            </p>
          </div>
        </div>
        <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-xs">
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Medicine Item
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search inventory by brand or generic name..."
                className="pl-9 text-xs"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Package}
            title="Medicine Inventory is Empty"
            description="No medicines or medical supplies have been registered in the pharmacy inventory yet."
            action={{
              label: "+ Add First Medicine Stock",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
