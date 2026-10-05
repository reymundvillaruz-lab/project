import { FileBarChart, Download, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health Reports | BHCMS",
  description: "Barangay Health Center FHSIS and Demographic Health Reports",
};

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Health Reports &amp; Analytics
          </h1>
          <p className="text-xs text-slate-500">
            Generate Field Health Services Information System (FHSIS) summaries, morbidity data, and demographic reports.
          </p>
        </div>
        <Button size="sm" variant="outline" className="text-xs">
          <Download className="h-3.5 w-3.5 mr-1" />
          Export FHSIS Report
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <h3 className="text-xs font-semibold text-slate-800">Morbidity Monthly Report (M1)</h3>
          <p className="mt-1 text-[11px] text-slate-500">Standard DOH FHSIS Monthly Form 1</p>
          <Button size="sm" variant="outline" className="mt-3 w-full text-xs">
            Generate Report
          </Button>
        </Card>
        <Card className="p-4">
          <h3 className="text-xs font-semibold text-slate-800">Child Immunization Coverage</h3>
          <p className="mt-1 text-[11px] text-slate-500">Fully Immunized Children (FIC) Tracking</p>
          <Button size="sm" variant="outline" className="mt-3 w-full text-xs">
            Generate Report
          </Button>
        </Card>
        <Card className="p-4">
          <h3 className="text-xs font-semibold text-slate-800">Maternal &amp; Prenatal Care</h3>
          <p className="mt-1 text-[11px] text-slate-500">Quarterly maternal and pregnancy outcomes</p>
          <Button size="sm" variant="outline" className="mt-3 w-full text-xs">
            Generate Report
          </Button>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Generated Report Logs
          </CardTitle>
          <CardDescription>
            Historical reports submitted to City Health Office or DOH
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={FileBarChart}
            title="No Generated Reports Yet"
            description="No monthly or quarterly health reports have been compiled or archived yet."
          />
        </CardContent>
      </Card>
    </div>
  );
}
