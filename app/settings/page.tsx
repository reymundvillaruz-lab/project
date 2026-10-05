import { Settings, Building, Shield, Bell, HardDrive, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_USER_PROFILE } from "@/lib/data/empty-data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | BHCMS",
  description: "Barangay Health Care Management System Settings",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          System &amp; Station Settings
        </h1>
        <p className="text-xs text-slate-500">
          Barangay Health Center configuration, station details, and primary care settings.
        </p>
      </div>

      {/* Health Center Profile */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-teal-700" />
            <CardTitle className="text-sm font-semibold">Health Station Profile</CardTitle>
          </div>
          <CardDescription>
            Official details of this local government primary care facility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-700">Health Center Name</label>
              <Input defaultValue={DEFAULT_USER_PROFILE.healthCenter} className="mt-1 text-xs" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Barangay Jurisdiction</label>
              <Input defaultValue={DEFAULT_USER_PROFILE.barangay} className="mt-1 text-xs" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Assigned Station / Section</label>
              <Input defaultValue={DEFAULT_USER_PROFILE.assignedStation} className="mt-1 text-xs" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Facility Code (DOH NHFR)</label>
              <Input placeholder="DOH-NHFR-XXXX" className="mt-1 text-xs" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-xs">
              Save Station Info
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Architecture & Phase 1 Environment Details */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-teal-700" />
            <CardTitle className="text-sm font-semibold">System Architecture &amp; Status</CardTitle>
          </div>
          <CardDescription>
            Current deployment phase and technical stack specification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">System Phase:</span>
              <Badge variant="default" className="text-[11px]">
                Phase 1: Frontend Architecture
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Framework:</span>
              <span className="font-semibold text-slate-800">Next.js 16 (Turbopack, App Router)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Styling &amp; Components:</span>
              <span className="font-semibold text-slate-800">Tailwind CSS + shadcn/ui design tokens</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Data Strategy:</span>
              <span className="font-semibold text-slate-800">Empty State Architecture (Zero mock records)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Future Backend Target:</span>
              <span className="text-slate-600">Supabase + Next.js Server Actions + Clerk Auth</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
