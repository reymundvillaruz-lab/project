"use client";

import * as React from "react";
import Link from "next/link";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function PatientRegistrationForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Patient registration form submitted. (Phase 2 will persist to Supabase).");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Personal Information
          </CardTitle>
          <CardDescription>
            Basic resident identification and biographical data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-slate-700">First Name *</label>
              <Input placeholder="e.g. Maria" className="mt-1 text-xs" required />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Middle Name</label>
              <Input placeholder="e.g. Santos" className="mt-1 text-xs" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Last Name *</label>
              <Input placeholder="e.g. Dela Cruz" className="mt-1 text-xs" required />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label className="text-xs font-medium text-slate-700">Suffix</label>
              <Input placeholder="Jr., III (optional)" className="mt-1 text-xs" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Date of Birth *</label>
              <Input type="date" className="mt-1 text-xs" required />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Gender *</label>
              <select className="mt-1 flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
                <option value="">Select Gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Civil Status</label>
              <select className="mt-1 flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Solo Parent">Solo Parent</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address and Contact Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Barangay Address &amp; Contact
          </CardTitle>
          <CardDescription>
            Local residence and emergency contact details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-slate-700">Purok / Zone / Street *</label>
              <Input placeholder="e.g. Purok 4, Mabini St." className="mt-1 text-xs" required />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Barangay</label>
              <Input defaultValue="Barangay Central" className="mt-1 text-xs bg-slate-50" readOnly />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Mobile / Contact Number</label>
              <Input placeholder="09XX-XXX-XXXX" className="mt-1 text-xs" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-700">Emergency Contact Person</label>
              <Input placeholder="Full Name of relative or guardian" className="mt-1 text-xs" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Emergency Contact Number</label>
              <Input placeholder="09XX-XXX-XXXX" className="mt-1 text-xs" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Program Beneficiary Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Government Health Programs &amp; Classifications
          </CardTitle>
          <CardDescription>
            PhilHealth, 4Ps / NHTS, and social welfare programs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-700">PhilHealth Identification Number (PIN)</label>
              <Input placeholder="XX-XXXXXXXXX-X" className="mt-1 text-xs" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Blood Type</label>
              <select className="mt-1 flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
                <option value="">Unknown / Not Tested</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
              <span>4Ps / NHTS-PR Beneficiary</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
              <span>Senior Citizen (60+ yrs)</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
              <span>Person with Disability (PWD)</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link href="/patients">
          <Button type="button" variant="outline" size="sm" className="text-xs">
            Cancel
          </Button>
        </Link>
        <Button type="submit" size="sm" className="bg-teal-700 hover:bg-teal-800 text-xs">
          <Save className="h-3.5 w-3.5 mr-1" />
          Save Patient Record
        </Button>
      </div>
    </form>
  );
}
