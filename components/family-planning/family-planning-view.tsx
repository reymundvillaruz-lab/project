"use client";

import * as React from "react";
import {
  Users,
  CalendarClock,
  Plus,
  HeartHandshake,
  ArrowLeft,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  FPClient,
  FPServiceRecord,
  FPFollowUp,
  FPFollowUpStatus,
} from "@/types/family-planning";
import {
  calculateFPDashboardStats,
  computeFollowUpStatus,
  getStoredFPClients,
  saveStoredFPClients,
} from "@/lib/family-planning-utils";
import { FPDashboardStatsView } from "./fp-dashboard-stats";
import { FPClientList } from "./fp-client-list";
import { FPClientDetail } from "./fp-client-detail";
import { FPFollowUpScheduleView } from "./fp-followup-schedule-view";
import { NewFPRecordDialog } from "./new-fp-record-dialog";
import { AddFPServiceDialog } from "./add-fp-service-dialog";
import { ScheduleFPFollowUpDialog } from "./schedule-fp-followup-dialog";

export function FamilyPlanningView() {
  const [clients, setClients] = React.useState<FPClient[]>([]);
  const isHydratedRef = React.useRef(false);

  // Hydrate from storage on mount
  React.useEffect(() => {
    setClients(getStoredFPClients());
    isHydratedRef.current = true;
  }, []);

  // Persist to storage on change
  React.useEffect(() => {
    if (isHydratedRef.current) {
      saveStoredFPClients(clients);
    }
  }, [clients]);

  // Navigation / View state
  const [activeMainTab, setActiveMainTab] = React.useState<"registry" | "followups">("registry");
  const [selectedClientId, setSelectedClientId] = React.useState<string | null>(null);
  const [clientDetailTab, setClientDetailTab] = React.useState<string>("overview");

  // Dialog states
  const [isRecordDialogOpen, setIsRecordDialogOpen] = React.useState(false);
  const [clientToEdit, setClientToEdit] = React.useState<FPClient | null>(null);

  const [isServiceDialogOpen, setIsServiceDialogOpen] = React.useState(false);
  const [serviceClient, setServiceClient] = React.useState<FPClient | null>(null);
  const [serviceToEdit, setServiceToEdit] = React.useState<FPServiceRecord | null>(null);

  const [isFollowUpDialogOpen, setIsFollowUpDialogOpen] = React.useState(false);
  const [followUpClient, setFollowUpClient] = React.useState<FPClient | null>(null);
  const [followUpToEdit, setFollowUpToEdit] = React.useState<FPFollowUp | null>(null);

  // Dynamically calculate dashboard statistics from active session records
  const dashboardStats = React.useMemo(() => {
    return calculateFPDashboardStats(clients);
  }, [clients]);

  // Find currently selected client if in detail view
  const currentSelectedClient = React.useMemo(() => {
    if (!selectedClientId) return null;
    return clients.find((c) => c.id === selectedClientId) || null;
  }, [clients, selectedClientId]);

  // ---------------------------------------------------------------------------
  // CLIENT RECORD HANDLERS
  // ---------------------------------------------------------------------------
  const handleOpenNewClientDialog = () => {
    setClientToEdit(null);
    setIsRecordDialogOpen(true);
  };

  const handleOpenEditClientDialog = (client: FPClient) => {
    setClientToEdit(client);
    setIsRecordDialogOpen(true);
  };

  const handleSaveClientRecord = (savedClient: FPClient) => {
    setClients((prev) => {
      const existsIndex = prev.findIndex((c) => c.id === savedClient.id);
      if (existsIndex >= 0) {
        // Update existing record
        const updated = [...prev];
        updated[existsIndex] = savedClient;
        return updated;
      } else {
        // Add new record
        return [savedClient, ...prev];
      }
    });

    // If client had nextFollowUpDate set upon creation, ensure a follow-up item exists
    if (savedClient.nextFollowUpDate && savedClient.followUps.length === 0) {
      const initialFollowUp: FPFollowUp = {
        id: `FU-${savedClient.id}-1`,
        clientId: savedClient.id,
        clientName: savedClient.fullName,
        method: savedClient.currentMethod,
        lastServiceDate: savedClient.registrationDate,
        nextServiceDate: savedClient.nextFollowUpDate,
        provider: savedClient.provider,
        status: computeFollowUpStatus(savedClient.nextFollowUpDate),
        notes: "Next scheduled contraceptive counseling and supply visit",
      };
      savedClient.followUps = [initialFollowUp];
    }
  };

  // ---------------------------------------------------------------------------
  // SERVICE RECORD HANDLERS
  // ---------------------------------------------------------------------------
  const handleOpenAddService = (client: FPClient) => {
    setServiceClient(client);
    setServiceToEdit(null);
    setIsServiceDialogOpen(true);
  };

  const handleOpenEditService = (client: FPClient, service: FPServiceRecord) => {
    setServiceClient(client);
    setServiceToEdit(service);
    setIsServiceDialogOpen(true);
  };

  const handleSaveServiceRecord = (savedService: FPServiceRecord) => {
    if (!serviceClient) return;

    setClients((prev) => {
      return prev.map((c) => {
        if (c.id !== serviceClient.id) return c;

        const existingServices = c.services || [];
        const existsIndex = existingServices.findIndex((s) => s.id === savedService.id);
        let updatedServices: FPServiceRecord[];

        if (existsIndex >= 0) {
          updatedServices = [...existingServices];
          updatedServices[existsIndex] = savedService;
        } else {
          updatedServices = [savedService, ...existingServices];
        }

        // Update latest service date and next follow-up date
        const updatedClient: FPClient = {
          ...c,
          services: updatedServices,
          lastServiceDate: savedService.serviceDate,
          currentMethod: savedService.method || c.currentMethod,
        };

        // If nextServiceDate is provided, create/update followUp entry
        if (savedService.nextServiceDate) {
          updatedClient.nextFollowUpDate = savedService.nextServiceDate;
          updatedClient.followUpStatus = computeFollowUpStatus(savedService.nextServiceDate);

          const existingFollowUps = c.followUps || [];
          const newFollowUp: FPFollowUp = {
            id: `FU-${c.id}-${Date.now()}`,
            clientId: c.id,
            clientName: c.fullName,
            method: savedService.method,
            lastServiceDate: savedService.serviceDate,
            nextServiceDate: savedService.nextServiceDate,
            provider: savedService.provider,
            status: computeFollowUpStatus(savedService.nextServiceDate),
            notes: `Follow-up after ${savedService.method} visit`,
          };

          updatedClient.followUps = [newFollowUp, ...existingFollowUps];
        }

        return updatedClient;
      });
    });
  };

  const handleDeleteServiceRecord = (client: FPClient, serviceId: string) => {
    setClients((prev) => {
      return prev.map((c) => {
        if (c.id !== client.id) return c;
        const filtered = (c.services || []).filter((s) => s.id !== serviceId);
        return {
          ...c,
          services: filtered,
        };
      });
    });
  };

  // ---------------------------------------------------------------------------
  // FOLLOW-UP HANDLERS
  // ---------------------------------------------------------------------------
  const handleOpenScheduleFollowUp = (
    client: FPClient,
    followUp?: FPFollowUp | null
  ) => {
    setFollowUpClient(client);
    setFollowUpToEdit(followUp || null);
    setIsFollowUpDialogOpen(true);
  };

  const handleSaveFollowUp = (savedFollowUp: FPFollowUp) => {
    setClients((prev) => {
      return prev.map((c) => {
        if (c.id !== savedFollowUp.clientId) return c;

        const existingFollowUps = c.followUps || [];
        const existsIndex = existingFollowUps.findIndex((f) => f.id === savedFollowUp.id);
        let updatedFollowUps: FPFollowUp[];

        if (existsIndex >= 0) {
          updatedFollowUps = [...existingFollowUps];
          updatedFollowUps[existsIndex] = savedFollowUp;
        } else {
          updatedFollowUps = [savedFollowUp, ...existingFollowUps];
        }

        return {
          ...c,
          followUps: updatedFollowUps,
          nextFollowUpDate: savedFollowUp.nextServiceDate,
          followUpStatus: savedFollowUp.status,
        };
      });
    });
  };

  const handleUpdateFollowUpStatus = (
    client: FPClient,
    followUpId: string,
    status: FPFollowUpStatus
  ) => {
    setClients((prev) => {
      return prev.map((c) => {
        if (c.id !== client.id) return c;

        const updatedFollowUps = (c.followUps || []).map((fu) => {
          if (fu.id === followUpId) {
            return {
              ...fu,
              status,
            };
          }
          return fu;
        });

        return {
          ...c,
          followUps: updatedFollowUps,
          followUpStatus: status,
        };
      });
    });
  };

  const handleUpdateClientNotes = (client: FPClient, notes: string) => {
    setClients((prev) => {
      return prev.map((c) => {
        if (c.id !== client.id) return c;
        return {
          ...c,
          generalNotes: notes,
        };
      });
    });
  };

  // ---------------------------------------------------------------------------
  // NAVIGATION HANDLERS
  // ---------------------------------------------------------------------------
  const handleViewClientDetails = (client: FPClient, defaultTab = "overview") => {
    setSelectedClientId(client.id);
    setClientDetailTab(defaultTab);
  };

  const handleBackToRegistry = () => {
    setSelectedClientId(null);
  };

  return (
    <div className="space-y-6">
      {/* Detail View Mode */}
      {currentSelectedClient ? (
        <FPClientDetail
          client={currentSelectedClient}
          onBack={handleBackToRegistry}
          onEditClient={handleOpenEditClientDialog}
          onAddService={handleOpenAddService}
          onEditService={handleOpenEditService}
          onDeleteService={handleDeleteServiceRecord}
          onScheduleFollowUp={handleOpenScheduleFollowUp}
          onUpdateFollowUpStatus={handleUpdateFollowUpStatus}
          onUpdateNotes={handleUpdateClientNotes}
          defaultTab={clientDetailTab}
        />
      ) : (
        /* Registry & Schedule Master View */
        <div className="space-y-6">
          {/* Header Title & Top Action */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl flex items-center gap-2">
                <HeartHandshake className="h-6 w-6 text-teal-700" />
                Responsible Parenthood &amp; Family Planning
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Individual Treatment Record (DOH FP Form 1) &bull; Clinical assessment, contraceptive tracking, and follow-up management.
              </p>
            </div>

            <Button
              onClick={handleOpenNewClientDialog}
              className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs h-9 gap-1.5"
            >
              <Plus className="h-4 w-4" />
              New Family Planning Record
            </Button>
          </div>

          {/* Dynamic Summary Cards calculated from user session records */}
          <FPDashboardStatsView stats={dashboardStats} />

          {/* Module Navigation Tabs */}
          <Tabs
            value={activeMainTab}
            onValueChange={(val) => setActiveMainTab(val as "registry" | "followups")}
            className="w-full"
          >
            <div className="flex items-center justify-between border-b border-slate-200">
              <TabsList className="bg-transparent p-0 h-auto gap-4">
                <TabsTrigger
                  value="registry"
                  className="rounded-none border-b-2 border-transparent px-3 pb-2.5 pt-1 text-xs font-medium text-slate-500 data-[state=active]:border-teal-700 data-[state=active]:text-teal-900 data-[state=active]:bg-transparent shadow-none"
                >
                  <Users className="h-4 w-4 mr-1.5" />
                  Family Planning Client Registry ({clients.length})
                </TabsTrigger>
                <TabsTrigger
                  value="followups"
                  className="rounded-none border-b-2 border-transparent px-3 pb-2.5 pt-1 text-xs font-medium text-slate-500 data-[state=active]:border-teal-700 data-[state=active]:text-teal-900 data-[state=active]:bg-transparent shadow-none"
                >
                  <CalendarClock className="h-4 w-4 mr-1.5" />
                  Follow-up Schedule
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB: Client Registry */}
            <TabsContent value="registry" className="pt-4">
              <FPClientList
                clients={clients}
                onViewDetails={(c) => handleViewClientDetails(c, "overview")}
                onEditClient={handleOpenEditClientDialog}
                onViewServiceHistory={(c) => handleViewClientDetails(c, "service-history")}
                onScheduleFollowUp={(c) => handleOpenScheduleFollowUp(c, null)}
                onNewClient={handleOpenNewClientDialog}
              />
            </TabsContent>

            {/* TAB: Follow-up Schedule */}
            <TabsContent value="followups" className="pt-4">
              <FPFollowUpScheduleView
                clients={clients}
                onViewClient={(c, tab) => handleViewClientDetails(c, tab || "follow-ups")}
                onReschedule={(c, fu) => handleOpenScheduleFollowUp(c, fu)}
                onUpdateStatus={handleUpdateFollowUpStatus}
                onScheduleNew={() => {
                  if (clients.length === 0) {
                    handleOpenNewClientDialog();
                  } else {
                    handleOpenScheduleFollowUp(clients[0], null);
                  }
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Dialog: New / Edit FP Record (DOH Form 1) */}
      <NewFPRecordDialog
        open={isRecordDialogOpen}
        onOpenChange={setIsRecordDialogOpen}
        onSave={handleSaveClientRecord}
        initialData={clientToEdit}
      />

      {/* Dialog: Add / Edit Service Record */}
      <AddFPServiceDialog
        open={isServiceDialogOpen}
        onOpenChange={setIsServiceDialogOpen}
        client={serviceClient}
        serviceToEdit={serviceToEdit}
        onSaveService={handleSaveServiceRecord}
      />

      {/* Dialog: Schedule / Reschedule Follow-up */}
      <ScheduleFPFollowUpDialog
        open={isFollowUpDialogOpen}
        onOpenChange={setIsFollowUpDialogOpen}
        client={followUpClient}
        followUpToEdit={followUpToEdit}
        onSaveFollowUp={handleSaveFollowUp}
      />
    </div>
  );
}
