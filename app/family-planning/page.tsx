import { UserCheck, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Family Planning | BHCMS",
  description: "Barangay Health Center Responsible Parenthood and Family Planning",
};

export default function FamilyPlanningPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Responsible Parenthood &amp; Family Planning
          </h1>
          <p className="text-xs text-slate-500">
            Client counseling, contraceptive method tracking (Pills, Injectables, IUD, Implants, Condoms), and drop-out monitoring.
          </p>
        </div>
        <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-xs">
          <Plus className="h-3.5 w-3.5 mr-1" />
          Enroll FP Client
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search FP client by name or method..."
                className="pl-9 text-xs"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={UserCheck}
            title="No Family Planning Clients Enrolled"
            description="The family planning registry has no enrolled clients recorded yet. Enroll clients to log method distribution and follow-up schedules."
            action={{
              label: "+ Enroll First Client",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
