import Link from "next/link";
import { ArrowLeft, User, Calendar, MapPin, Phone, Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patient Profile | BHCMS",
  description: "Barangay Health Center Patient Profile Record",
};

interface PatientProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientProfilePage({ params }: PatientProfilePageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/patients">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Patients</span>
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Patient Record #{id}
              </h1>
              <Badge variant="outline" className="text-xs">
                Demo Record
              </Badge>
            </div>
            <p className="text-xs text-slate-500">
              Barangay Central Health Center &bull; Clinical Profile
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/consultations">
            <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-xs">
              + New Consultation
            </Button>
          </Link>
        </div>
      </div>

      {/* Patient Profile Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Col: Demographics */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-800 font-bold text-sm">
                ID
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">Patient Demographics</CardTitle>
                <CardDescription>ID: {id}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="rounded-md bg-slate-50 p-3 space-y-2 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">PhilHealth:</span>
                <span className="font-medium text-slate-800">Unassigned</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Purok:</span>
                <span className="font-medium text-slate-800">Purok 1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <Badge variant="success" indicatorColor="green" className="text-[10px]">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Col: Consultation & Medical History (Empty State) */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">
                Medical &amp; Consultation History
              </CardTitle>
              <CardDescription>
                Chronological clinical visits, vital signs, and diagnoses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={FileText}
                title="No Consultation History Found"
                description="This patient does not have any recorded consultations or vital signs logged yet."
                action={{
                  label: "Record Consultation",
                  href: "/consultations",
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
