"use client";

import * as React from "react";
import {
  ArrowLeft,
  Calendar,
  CalendarClock,
  Clock,
  Edit3,
  FileText,
  HeartHandshake,
  History,
  Info,
  Layers,
  MapPin,
  MoreVertical,
  Phone,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  Trash2,
  User,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { Textarea } from "@/components/ui/textarea";
import {
  FPClient,
  FPServiceRecord,
  FPFollowUp,
  FPFollowUpStatus,
} from "@/types/family-planning";
import {
  FPClientStatusBadge,
  FPClientTypeBadge,
  FPFollowUpStatusBadge,
} from "./fp-status-badge";
import { computeFollowUpStatus } from "@/lib/family-planning-utils";

interface FPClientDetailProps {
  client: FPClient;
  onBack: () => void;
  onEditClient: (client: FPClient) => void;
  onAddService: (client: FPClient) => void;
  onEditService: (client: FPClient, service: FPServiceRecord) => void;
  onDeleteService: (client: FPClient, serviceId: string) => void;
  onScheduleFollowUp: (client: FPClient, followUpToEdit?: FPFollowUp | null) => void;
  onUpdateFollowUpStatus: (
    client: FPClient,
    followUpId: string,
    status: FPFollowUpStatus
  ) => void;
  onUpdateNotes: (client: FPClient, notes: string) => void;
  defaultTab?: string;
}

export function FPClientDetail({
  client,
  onBack,
  onEditClient,
  onAddService,
  onEditService,
  onDeleteService,
  onScheduleFollowUp,
  onUpdateFollowUpStatus,
  onUpdateNotes,
  defaultTab = "overview",
}: FPClientDetailProps) {
  const [activeTab, setActiveTab] = React.useState(defaultTab);
  const [editableNotes, setEditableNotes] = React.useState(client.generalNotes || "");
  const [isEditingNotes, setIsEditingNotes] = React.useState(false);

  React.useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  React.useEffect(() => {
    setEditableNotes(client.generalNotes || "");
    setIsEditingNotes(false);
  }, [client.generalNotes]);

  const handleSaveNotes = () => {
    onUpdateNotes(client, editableNotes);
    setIsEditingNotes(false);
  };

  // Sort services chronologically descending (newest first)
  const sortedServices = [...(client.services || [])].sort((a, b) =>
    b.serviceDate.localeCompare(a.serviceDate)
  );

  // Compute status for all follow ups
  const computedFollowUps = (client.followUps || []).map((fu) => ({
    ...fu,
    status: computeFollowUpStatus(fu.nextServiceDate, fu.status),
  }));

  const overallFollowUpStatus = computeFollowUpStatus(
    client.nextFollowUpDate,
    client.followUpStatus
  );

  return (
    <div className="space-y-6">
      {/* Top Navigation & Actions Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="h-8 gap-1.5 text-xs text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Client Registry
          </Button>
          <span className="text-slate-300">|</span>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span>{client.fullName}</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-normal">
                {client.id}
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Registered on {client.registrationDate} &bull; Facility: {client.facility}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditClient(client)}
            className="h-8 text-xs gap-1.5"
          >
            <Edit3 className="h-3.5 w-3.5 text-slate-600" />
            Edit Client Record
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onScheduleFollowUp(client, null)}
            className="h-8 text-xs gap-1.5"
          >
            <CalendarClock className="h-3.5 w-3.5 text-teal-700" />
            Schedule Follow-up
          </Button>

          <Button
            size="sm"
            onClick={() => onAddService(client)}
            className="h-8 bg-teal-700 hover:bg-teal-800 text-xs gap-1.5 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Service Entry
          </Button>
        </div>
      </div>

      {/* Client Quick Overview Header Card */}
      <Card className="border border-slate-200 shadow-xs bg-white">
        <CardContent className="p-4">
          <div className="grid grid-cols-5 gap-4 divide-x divide-slate-100">
            {/* Status & Method */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Client Status
              </span>
              <div>
                <FPClientStatusBadge status={client.status} />
              </div>
              <div className="pt-1">
                <FPClientTypeBadge type={client.clientType} />
              </div>
            </div>

            {/* Current Method */}
            <div className="pl-4 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Current Method
              </span>
              <p className="text-sm font-semibold text-slate-900">
                {client.currentMethod || "No method selected"}
              </p>
              <p className="text-xs text-slate-500">
                Reason: {client.reasonForFP || "Spacing"}
              </p>
            </div>

            {/* Demographics */}
            <div className="pl-4 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Demographics
              </span>
              <p className="text-xs text-slate-700">
                Age: <span className="font-semibold text-slate-900">{client.age} yrs</span> ({client.birthdate})
              </p>
              <p className="text-xs text-slate-500">
                Civil Status: {client.civilStatus} &bull; {client.religion}
              </p>
            </div>

            {/* Children & Plans */}
            <div className="pl-4 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Living Children
              </span>
              <p className="text-sm font-semibold text-slate-900">
                {client.livingChildrenTotal} Total
                <span className="text-xs font-normal text-slate-500 ml-1">
                  ({client.livingChildrenFemale} F / {client.livingChildrenMale} M)
                </span>
              </p>
              <p className="text-xs text-slate-500">
                More children: {client.plansForMoreChildren}
              </p>
            </div>

            {/* Next Follow-up */}
            <div className="pl-4 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Next Follow-up
              </span>
              <div>
                <FPFollowUpStatusBadge
                  status={overallFollowUpStatus}
                  date={client.nextFollowUpDate}
                />
              </div>
              <p className="text-xs text-slate-500 pt-0.5">
                Provider: {client.provider}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Desktop Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-100/90 p-1 border border-slate-200">
          <TabsTrigger value="overview" className="text-xs gap-1.5">
            <Info className="h-3.5 w-3.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="client-info" className="text-xs gap-1.5">
            <User className="h-3.5 w-3.5" />
            Client Information
          </TabsTrigger>
          <TabsTrigger value="fp-info" className="text-xs gap-1.5">
            <HeartHandshake className="h-3.5 w-3.5" />
            Family Planning Information
          </TabsTrigger>
          <TabsTrigger value="assessment" className="text-xs gap-1.5">
            <Stethoscope className="h-3.5 w-3.5" />
            Assessment &amp; History
          </TabsTrigger>
          <TabsTrigger value="service-history" className="text-xs gap-1.5">
            <History className="h-3.5 w-3.5" />
            Method / Service History ({sortedServices.length})
          </TabsTrigger>
          <TabsTrigger value="follow-ups" className="text-xs gap-1.5">
            <CalendarClock className="h-3.5 w-3.5" />
            Follow-up Schedule ({computedFollowUps.length})
          </TabsTrigger>
          <TabsTrigger value="notes" className="text-xs gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            Notes &amp; Consent
          </TabsTrigger>
        </TabsList>

        {/* =========================================================================
            TAB 1: OVERVIEW
        ========================================================================= */}
        <TabsContent value="overview" className="mt-4 space-y-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Quick Demographics & Address */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-teal-700" />
                  Client Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 text-xs space-y-2.5">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">PhilHealth No.</span>
                  <span className="font-mono font-medium text-slate-800">
                    {client.philhealthNo || "None / Not Specified"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">NHTS-PR / 4Ps Beneficiary</span>
                  <span className="font-medium text-slate-800">
                    {client.nhts4PsStatus === "Yes" ? (
                      <span className="text-emerald-700 font-semibold">Yes (4Ps Registered)</span>
                    ) : (
                      "No"
                    )}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Contact Number</span>
                  <span className="font-medium text-slate-800">{client.contactNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Education</span>
                  <span className="font-medium text-slate-800">{client.education}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Occupation</span>
                  <span className="font-medium text-slate-800">{client.occupation}</span>
                </div>
                <div className="py-1">
                  <span className="text-slate-500 block mb-0.5">Barangay Address</span>
                  <span className="font-medium text-slate-800 flex items-start gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                    {client.address}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Contraceptive Method & Plan */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4 text-teal-700" />
                  Contraceptive Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 text-xs space-y-2.5">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Accepted Method</span>
                  <span className="font-semibold text-teal-900">{client.currentMethod}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Client Type</span>
                  <span className="font-medium text-slate-800">{client.clientType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">FP Intention</span>
                  <span className="font-medium text-slate-800">{client.reasonForFP}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Previous Method</span>
                  <span className="font-medium text-slate-800">
                    {client.previousMethod || "None"}
                  </span>
                </div>
                {client.reasonForChangingMethod && (
                  <div className="py-1 border-b border-slate-50">
                    <span className="text-slate-500 block mb-0.5">Reason for Changing</span>
                    <span className="text-slate-700 italic">
                      {client.reasonForChangingMethod}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Monthly Family Income</span>
                  <span className="font-medium text-slate-800">
                    {client.monthlyFamilyIncome || "Not reported"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Follow-up & Provider Status */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-teal-700" />
                  Next Service / Follow-up
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onScheduleFollowUp(client, null)}
                  className="h-7 text-[11px] text-teal-700 hover:text-teal-800 hover:bg-teal-50"
                >
                  Manage
                </Button>
              </CardHeader>
              <CardContent className="pt-3 text-xs space-y-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Scheduled Date:</span>
                    <span className="font-semibold text-slate-900">
                      {client.nextFollowUpDate || "No scheduled follow-up"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Status:</span>
                    <FPFollowUpStatusBadge status={overallFollowUpStatus} />
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">Last Service:</span>
                    <span className="text-slate-700 font-medium">
                      {client.lastServiceDate || "Initial enrollment"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-slate-500 block text-[11px]">Attending Health Worker</span>
                  <p className="font-medium text-slate-800">{client.provider}</p>
                  <p className="text-[11px] text-slate-500">{client.facility}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Service History Preview */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <History className="h-4 w-4 text-teal-700" />
                  Recent Service Records
                </CardTitle>
                <CardDescription className="text-xs">
                  Chronological record of contraceptive resupply, examinations, and counseling.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("service-history")}
                  className="h-8 text-xs"
                >
                  View Full History ({sortedServices.length})
                </Button>
                <Button
                  size="sm"
                  onClick={() => onAddService(client)}
                  className="h-8 bg-teal-700 hover:bg-teal-800 text-xs shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Service Record
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {sortedServices.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  <p>No service records logged yet for this client.</p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => onAddService(client)}
                    className="text-teal-700 text-xs mt-1"
                  >
                    + Record First Contraceptive Service Visit
                  </Button>
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <Table className="text-xs">
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="w-[110px]">Service Date</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Supplies Given</TableHead>
                        <TableHead>Services Rendered</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead className="w-[110px]">Next Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedServices.slice(0, 3).map((srv) => (
                        <TableRow key={srv.id}>
                          <TableCell className="font-medium text-slate-900">
                            {srv.serviceDate}
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-slate-800">{srv.method}</span>
                          </TableCell>
                          <TableCell className="text-slate-600">{srv.suppliesGiven}</TableCell>
                          <TableCell className="text-slate-600 max-w-xs truncate">
                            {srv.servicesRendered}
                          </TableCell>
                          <TableCell className="text-slate-600">{srv.provider}</TableCell>
                          <TableCell className="text-slate-600 font-mono">
                            {srv.nextServiceDate || "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* =========================================================================
            TAB 2: CLIENT INFORMATION
        ========================================================================= */}
        <TabsContent value="client-info" className="mt-4 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Client Personal Information */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4 text-teal-700" />
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Demographic background and identification
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditClient(client)}
                  className="h-7 text-xs"
                >
                  <Edit3 className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent className="pt-4 text-xs space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Client ID</span>
                    <span className="font-mono font-semibold text-slate-900">{client.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">PhilHealth Identification</span>
                    <span className="font-mono text-slate-900 font-medium">
                      {client.philhealthNo || "Not Enrolled / None"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-50">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Full Name</span>
                    <span className="font-semibold text-slate-900">{client.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">NHTS / 4Ps Status</span>
                    <span className="font-medium text-slate-800">
                      {client.nhts4PsStatus === "Yes" ? (
                        <span className="text-emerald-700 font-semibold">Yes (Beneficiary)</span>
                      ) : (
                        "Non-4Ps"
                      )}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-50">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Birthdate &amp; Age</span>
                    <span className="font-medium text-slate-900">
                      {client.birthdate} ({client.age} years old)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Civil Status</span>
                    <span className="font-medium text-slate-900">{client.civilStatus}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-50">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Religion</span>
                    <span className="font-medium text-slate-900">{client.religion}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Educational Attainment</span>
                    <span className="font-medium text-slate-900">{client.education}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-50">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Occupation</span>
                    <span className="font-medium text-slate-900">{client.occupation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Contact Telephone/Mobile</span>
                    <span className="font-medium text-slate-900">{client.contactNumber}</span>
                  </div>
                </div>

                <div className="pt-1 border-t border-slate-50">
                  <span className="text-slate-500 block text-[11px]">Complete Residential Address</span>
                  <span className="font-medium text-slate-900">{client.address}</span>
                </div>
              </CardContent>
            </Card>

            {/* Spouse Information (Optional) */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-teal-700" />
                    Spouse Information
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Partner details per DOH FP Form 1 (Optional)
                  </CardDescription>
                </div>
                {client.hasSpouse && (
                  <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50 text-[10px]">
                    Recorded
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="pt-4 text-xs">
                {!client.hasSpouse || !client.spouseName ? (
                  <div className="py-8 text-center text-slate-500">
                    <p className="font-medium text-slate-700">No spouse information recorded</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Spouse information is optional when client is single or not applicable.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditClient(client)}
                      className="mt-3 text-xs"
                    >
                      + Add Spouse Information
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Spouse Full Name</span>
                      <span className="font-semibold text-slate-900">{client.spouseName}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-50">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Spouse Birthdate</span>
                        <span className="font-medium text-slate-900">
                          {client.spouseBirthdate || "Not recorded"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Spouse Age</span>
                        <span className="font-medium text-slate-900">
                          {client.spouseAge ? `${client.spouseAge} yrs old` : "Not recorded"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-50">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Educational Attainment</span>
                        <span className="font-medium text-slate-900">
                          {client.spouseEducation || "Not recorded"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Occupation</span>
                        <span className="font-medium text-slate-900">
                          {client.spouseOccupation || "Not recorded"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* =========================================================================
            TAB 3: FAMILY PLANNING INFORMATION
        ========================================================================= */}
        <TabsContent value="fp-info" className="mt-4 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Living Children & Reproductive Plan */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4 text-teal-700" />
                  Reproductive Intentions &amp; Children
                </CardTitle>
                <CardDescription className="text-xs">
                  Family planning motivation and childbearing status
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 text-xs space-y-3">
                <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-teal-50/50 border border-teal-100 text-center">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Total Living</span>
                    <span className="text-lg font-bold text-teal-900">
                      {client.livingChildrenTotal}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Female Daughters</span>
                    <span className="text-lg font-bold text-teal-800">
                      {client.livingChildrenFemale}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Male Sons</span>
                    <span className="text-lg font-bold text-teal-800">
                      {client.livingChildrenMale}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Plans for More Children</span>
                  <span className="font-semibold text-slate-900">
                    {client.plansForMoreChildren}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Reason for Family Planning</span>
                  <span className="font-medium text-slate-900">
                    {client.reasonForFP}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Monthly Family Income</span>
                  <span className="font-medium text-slate-900">
                    {client.monthlyFamilyIncome || "Not specified"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Contraceptive Method History */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Layers className="h-4 w-4 text-teal-700" />
                  Method History &amp; Status
                </CardTitle>
                <CardDescription className="text-xs">
                  Current accepted method and transition details
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 text-xs space-y-3">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Client Type</span>
                  <FPClientTypeBadge type={client.clientType} />
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Current / Accepted Method</span>
                  <span className="font-bold text-teal-900 text-sm">
                    {client.currentMethod}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Previous Method Used</span>
                  <span className="font-medium text-slate-800">
                    {client.previousMethod || "None reported"}
                  </span>
                </div>

                <div className="py-1">
                  <span className="text-slate-500 block mb-1">Reason for Changing Method</span>
                  <p className="text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                    {client.reasonForChangingMethod || "None / First time method acceptor"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* =========================================================================
            TAB 4: ASSESSMENT & HISTORY (DOH FP Form 1)
            *Kept confidential in detail tab, not in general summaries*
        ========================================================================= */}
        <TabsContent value="assessment" className="mt-4 space-y-6">
          <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 flex items-start gap-2.5 text-xs text-amber-900">
            <ShieldAlert className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold">Confidential Clinical Assessment</span>
              <p className="text-amber-800 text-[11px] mt-0.5">
                The assessment information below is derived from DOH Family Planning Form 1 (ITR) and is strictly preserved for healthcare worker evaluation. Sensitive details are shielded from general summary counters.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Medical History */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-teal-700" />
                  Medical History &amp; Contraindications
                </CardTitle>
                <CardDescription className="text-xs">
                  Conditions affecting contraceptive eligibility
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-3 text-xs space-y-2">
                {[
                  { label: "Severe headache / Migraine", val: client.medicalHistory?.severeHeadache },
                  { label: "History of stroke / heart attack", val: client.medicalHistory?.historyOfStrokeHeartAttack },
                  { label: "Hypertension / High blood pressure", val: client.medicalHistory?.hypertension },
                  { label: "Blood coagulation / clotting disorder", val: client.medicalHistory?.coagulationDisorder },
                  { label: "Breast cancer / Breast mass", val: client.medicalHistory?.breastCancerLump },
                  { label: "Severe chest pain", val: client.medicalHistory?.severeChestPain },
                  { label: "Unexplained vaginal bleeding", val: client.medicalHistory?.unexplainedVaginalBleeding },
                  { label: "Abnormal vaginal discharge / infection", val: client.medicalHistory?.vaginalDischargeInfection },
                  { label: "Jaundice / Liver disease", val: client.medicalHistory?.jaundiceLiverDisease },
                  { label: "Smoking habit", val: client.medicalHistory?.smokingHabit },
                  { label: "Taking Anti-seizure or Anti-TB drugs", val: client.medicalHistory?.takingAntiSeizureOrAntiTB },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600">{item.label}</span>
                    {item.val ? (
                      <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 text-[10px] font-semibold">
                        Yes
                      </Badge>
                    ) : (
                      <span className="text-slate-400 text-[11px]">No</span>
                    )}
                  </div>
                ))}

                {client.medicalHistory?.otherMedicalConditions && (
                  <div className="pt-2 text-[11px]">
                    <span className="text-slate-500 font-semibold block">Other Conditions:</span>
                    <p className="text-slate-700 mt-0.5">
                      {client.medicalHistory.otherMedicalConditions}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Obstetrical & Gynecological History */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4 text-teal-700" />
                  Obstetrical &amp; Gynecological History
                </CardTitle>
                <CardDescription className="text-xs">
                  G-P-T-P-A-L obstetric record and menstrual history
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-3 text-xs space-y-3">
                {/* GTPAL Table */}
                <div className="grid grid-cols-6 gap-2 text-center p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500">Gravida</span>
                    <p className="text-sm font-bold text-slate-900">{client.obGynHistory?.gravida ?? 0}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500">Para</span>
                    <p className="text-sm font-bold text-slate-900">{client.obGynHistory?.para ?? 0}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500">Full Term</span>
                    <p className="text-sm font-bold text-slate-900">{client.obGynHistory?.fullTerm ?? 0}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500">Premature</span>
                    <p className="text-sm font-bold text-slate-900">{client.obGynHistory?.premature ?? 0}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500">Abortion</span>
                    <p className="text-sm font-bold text-slate-900">{client.obGynHistory?.abortion ?? 0}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500">Living</span>
                    <p className="text-sm font-bold text-slate-900">{client.obGynHistory?.livingChildren ?? 0}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Date of Last Delivery</span>
                    <span className="font-medium text-slate-800">
                      {client.obGynHistory?.dateOfLastDelivery || "Not applicable"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Type of Last Delivery</span>
                    <span className="font-medium text-slate-800">
                      {client.obGynHistory?.typeOfLastDelivery || "None / N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Last Menstrual Period (LMP)</span>
                    <span className="font-semibold text-teal-900">
                      {client.obGynHistory?.lmp || "Not recorded"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Previous Menstrual Period (PMP)</span>
                    <span className="font-medium text-slate-800">
                      {client.obGynHistory?.pmp || "Not recorded"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Menstrual Flow</span>
                    <span className="font-medium text-slate-800">
                      {client.obGynHistory?.menstrualFlow || "Moderate"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Dysmenorrhea</span>
                    <span className="font-medium text-slate-800">
                      {client.obGynHistory?.dysmenorrhea ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">History of Hydatidiform Mole</span>
                    <span className="font-medium text-slate-800">
                      {client.obGynHistory?.hydatidiformMoleHistory ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">History of Ectopic Pregnancy</span>
                    <span className="font-medium text-slate-800">
                      {client.obGynHistory?.ectopicPregnancyHistory ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* STI Risk & VAW Assessment */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-teal-700" />
                  STI &amp; VAW Assessment
                </CardTitle>
                <CardDescription className="text-xs">
                  Sexually transmitted infections &amp; Violence Against Women screening
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-3 text-xs space-y-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    STI Risk Symptoms
                  </span>
                  {[
                    { label: "Abnormal vaginal discharge", val: client.stiRiskAssessment?.abnormalVaginalDischarge },
                    { label: "Genital sores / ulcers", val: client.stiRiskAssessment?.genitalSoresUlcers },
                    { label: "Pain or burning sensation on urination", val: client.stiRiskAssessment?.painBurningUrination },
                    { label: "History of treated STI", val: client.stiRiskAssessment?.historyTreatedSTI },
                    { label: "Partner with STI symptoms", val: client.stiRiskAssessment?.partnerWithSTISymptoms },
                    { label: "Multiple sexual partners", val: client.stiRiskAssessment?.multipleSexualPartners },
                  ].map((s, idx) => (
                    <div key={idx} className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-600">{s.label}</span>
                      <span className={s.val ? "text-rose-600 font-semibold" : "text-slate-400"}>
                        {s.val ? "Yes" : "No"}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    VAW Screening
                  </span>
                  {[
                    { label: "Unpleasant relationship with partner", val: client.vawAssessment?.unpleasantRelationship },
                    { label: "Partner disapproves of family planning", val: client.vawAssessment?.partnerDisapprovesFP },
                    { label: "History of domestic violence / abuse", val: client.vawAssessment?.domesticViolenceHistory },
                    { label: "Referred to Barangay VAW Desk", val: client.vawAssessment?.referredToVAWDesk },
                  ].map((v, idx) => (
                    <div key={idx} className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-600">{v.label}</span>
                      <span className={v.val ? "text-rose-600 font-semibold" : "text-slate-400"}>
                        {v.val ? "Yes" : "No"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Physical Examination Findings */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-teal-700" />
                  Physical Examination
                </CardTitle>
                <CardDescription className="text-xs">
                  Baseline physical measurements and systemic examination
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-3 text-xs space-y-2.5">
                <div className="grid grid-cols-4 gap-2 text-center p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-500">Weight</span>
                    <p className="text-xs font-bold text-slate-900">
                      {client.physicalExam?.weightKg ? `${client.physicalExam.weightKg} kg` : "-"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Height</span>
                    <p className="text-xs font-bold text-slate-900">
                      {client.physicalExam?.heightCm ? `${client.physicalExam.heightCm} cm` : "-"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Blood Pressure</span>
                    <p className="text-xs font-bold text-teal-800">
                      {client.physicalExam?.bloodPressure || "-"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Pulse Rate</span>
                    <p className="text-xs font-bold text-slate-900">
                      {client.physicalExam?.pulseRate ? `${client.physicalExam.pulseRate} bpm` : "-"}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Conjunctiva</span>
                    <span className="font-medium text-slate-800">{client.physicalExam?.conjunctiva || "Normal"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Neck / Thyroid</span>
                    <span className="font-medium text-slate-800">{client.physicalExam?.neckThyroid || "Normal"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Breast Exam</span>
                    <span className="font-medium text-slate-800">{client.physicalExam?.breast || "Normal"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Abdomen</span>
                    <span className="font-medium text-slate-800">{client.physicalExam?.abdomen || "Normal"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Extremities</span>
                    <span className="font-medium text-slate-800">{client.physicalExam?.extremities || "Normal"}</span>
                  </div>
                  {client.physicalExam?.pelvicExamFindings && (
                    <div className="py-1">
                      <span className="text-slate-500 block text-[11px] mb-0.5">Pelvic Exam Findings</span>
                      <p className="text-slate-700 bg-slate-50 p-1.5 rounded border border-slate-100">
                        {client.physicalExam.pelvicExamFindings}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* =========================================================================
            TAB 5: METHOD / SERVICE HISTORY
            Desktop Table columns required:
            Service Date, Method, Supplies Given, Observations/Complaints,
            Services Rendered, Laboratory/Referral Notes, Provider, Next Service Date, Actions
        ========================================================================= */}
        <TabsContent value="service-history" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <History className="h-4 w-4 text-teal-700" />
                  Family Planning Service Records
                </CardTitle>
                <CardDescription className="text-xs">
                  Complete chronological history of contraceptive visits, resupply, and procedures.
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => onAddService(client)}
                className="h-8 bg-teal-700 hover:bg-teal-800 text-xs shadow-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Service Entry
              </Button>
            </CardHeader>
            <CardContent>
              {sortedServices.length === 0 ? (
                <EmptyState
                  icon={History}
                  title="No Service Records Recorded"
                  description="This client has no recorded service visits or contraceptive resupplies yet. Add a service record to document visits."
                  action={{
                    label: "+ Add Service Entry",
                    onClick: () => onAddService(client),
                  }}
                />
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-x-auto">
                  <Table className="text-xs">
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="w-[100px] font-semibold text-slate-700">
                          Service Date
                        </TableHead>
                        <TableHead className="w-[140px] font-semibold text-slate-700">
                          Method
                        </TableHead>
                        <TableHead className="w-[140px] font-semibold text-slate-700">
                          Supplies Given
                        </TableHead>
                        <TableHead className="min-w-[160px] font-semibold text-slate-700">
                          Observations / Complaints
                        </TableHead>
                        <TableHead className="min-w-[180px] font-semibold text-slate-700">
                          Services Rendered
                        </TableHead>
                        <TableHead className="w-[140px] font-semibold text-slate-700">
                          Laboratory / Referral Notes
                        </TableHead>
                        <TableHead className="w-[120px] font-semibold text-slate-700">
                          Provider
                        </TableHead>
                        <TableHead className="w-[105px] font-semibold text-slate-700">
                          Next Service Date
                        </TableHead>
                        <TableHead className="w-[80px] text-right font-semibold text-slate-700">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedServices.map((srv) => (
                        <TableRow key={srv.id} className="hover:bg-slate-50/70">
                          <TableCell className="font-semibold text-slate-900 whitespace-nowrap">
                            {srv.serviceDate}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/50">
                              {srv.method}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-700">
                            {srv.suppliesGiven}
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {srv.observationsComplaints}
                          </TableCell>
                          <TableCell className="text-slate-700 font-medium">
                            {srv.servicesRendered}
                          </TableCell>
                          <TableCell className="text-slate-500">
                            {srv.laboratoryReferralNotes || <span className="text-slate-300">-</span>}
                          </TableCell>
                          <TableCell className="text-slate-700">
                            {srv.provider}
                          </TableCell>
                          <TableCell className="text-slate-800 font-mono">
                            {srv.nextServiceDate || <span className="text-slate-300">-</span>}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-slate-500 hover:text-slate-900"
                                >
                                  <MoreVertical className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="text-xs">
                                <DropdownMenuItem
                                  onClick={() => onEditService(client, srv)}
                                  className="text-xs gap-1.5"
                                >
                                  <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                                  Edit Service Record
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => onDeleteService(client, srv.id)}
                                  className="text-xs gap-1.5 text-rose-600 focus:text-rose-600"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Remove Record
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* =========================================================================
            TAB 6: FOLLOW-UP SCHEDULE (CLIENT-SPECIFIC)
        ========================================================================= */}
        <TabsContent value="follow-ups" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-teal-700" />
                  Follow-up Appointments for {client.fullName}
                </CardTitle>
                <CardDescription className="text-xs">
                  Scheduled clinic appointments and resupply visits
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => onScheduleFollowUp(client, null)}
                className="h-8 bg-teal-700 hover:bg-teal-800 text-xs shadow-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Schedule Follow-up
              </Button>
            </CardHeader>
            <CardContent>
              {computedFollowUps.length === 0 ? (
                <EmptyState
                  icon={CalendarClock}
                  title="No Follow-ups Scheduled"
                  description="There are currently no follow-up appointments scheduled for this client."
                  action={{
                    label: "+ Schedule Follow-up",
                    onClick: () => onScheduleFollowUp(client, null),
                  }}
                />
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-x-auto">
                  <Table className="text-xs">
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="font-semibold text-slate-700">Method / Service</TableHead>
                        <TableHead className="w-[120px] font-semibold text-slate-700">Last Service Date</TableHead>
                        <TableHead className="w-[120px] font-semibold text-slate-700">Next Service Date</TableHead>
                        <TableHead className="w-[140px] font-semibold text-slate-700">Provider</TableHead>
                        <TableHead className="w-[130px] font-semibold text-slate-700">Status</TableHead>
                        <TableHead className="min-w-[150px] font-semibold text-slate-700">Notes</TableHead>
                        <TableHead className="w-[100px] text-right font-semibold text-slate-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {computedFollowUps.map((fu) => (
                        <TableRow key={fu.id} className="hover:bg-slate-50/70">
                          <TableCell className="font-semibold text-slate-900">
                            {fu.method}
                          </TableCell>
                          <TableCell className="text-slate-600 font-mono">
                            {fu.lastServiceDate || "-"}
                          </TableCell>
                          <TableCell className="text-slate-900 font-semibold font-mono">
                            {fu.nextServiceDate}
                          </TableCell>
                          <TableCell className="text-slate-700">
                            {fu.provider}
                          </TableCell>
                          <TableCell>
                            <FPFollowUpStatusBadge status={fu.status} />
                          </TableCell>
                          <TableCell className="text-slate-500">
                            {fu.notes || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-slate-500 hover:text-slate-900"
                                >
                                  <MoreVertical className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="text-xs">
                                <DropdownMenuItem
                                  onClick={() => onScheduleFollowUp(client, fu)}
                                  className="text-xs gap-1.5"
                                >
                                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                                  Reschedule / Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onUpdateFollowUpStatus(client, fu.id, "Completed")}
                                  className="text-xs gap-1.5 text-emerald-700"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Mark as Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onUpdateFollowUpStatus(client, fu.id, "Cancelled")}
                                  className="text-xs gap-1.5 text-rose-700"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                  Cancel Follow-up
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* =========================================================================
            TAB 7: NOTES & CONSENT
        ========================================================================= */}
        <TabsContent value="notes" className="mt-4 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Informed Consent & Acknowledgment */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  Consent &amp; Acknowledgment
                </CardTitle>
                <CardDescription className="text-xs">
                  Informed voluntary choice affirmation per DOH guidelines
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 text-xs space-y-3">
                <div className="rounded-lg bg-emerald-50/70 border border-emerald-200 p-3 space-y-2 text-emerald-900">
                  <div className="flex items-center gap-2 font-semibold text-xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    Informed Consent Affirmed &amp; Signed
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Client voluntarily chose {client.currentMethod} after comprehensive counseling on all modern family planning options, potential side effects, and risks.
                  </p>
                  <p className="text-[10px] text-emerald-700 font-mono pt-1">
                    Date of Affirmation: {client.consentDate || client.registrationDate}
                  </p>
                </div>

                <div className="pt-2 space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Attending Health Worker</span>
                    <span className="font-semibold text-slate-800">{client.provider}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Health Care Facility</span>
                    <span className="font-semibold text-slate-800">{client.facility}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Initial Registration</span>
                    <span className="font-mono text-slate-700">{client.registrationDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Provider Case Notes */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-teal-700" />
                    Provider &amp; Clinic Notes
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Clinical remarks and observations
                  </CardDescription>
                </div>
                {!isEditingNotes && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingNotes(true)}
                    className="h-7 text-xs"
                  >
                    <Edit3 className="h-3 w-3 mr-1" />
                    Edit Notes
                  </Button>
                )}
              </CardHeader>
              <CardContent className="pt-4 text-xs">
                {isEditingNotes ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editableNotes}
                      onChange={(e) => setEditableNotes(e.target.value)}
                      rows={5}
                      className="text-xs"
                      placeholder="Add clinical observations, partner involvement notes, or follow-up instructions..."
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditableNotes(client.generalNotes || "");
                          setIsEditingNotes(false);
                        }}
                        className="text-xs h-7"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleSaveNotes}
                        className="bg-teal-700 hover:bg-teal-800 text-xs h-7 shadow-xs"
                      >
                        Save Notes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-slate-50 border border-slate-100 p-3 min-h-[120px] text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {client.generalNotes || (
                      <span className="text-slate-400 italic">
                        No additional clinical notes recorded. Click &quot;Edit Notes&quot; to add observations.
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
