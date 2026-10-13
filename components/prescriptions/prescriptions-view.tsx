"use client";

import * as React from "react";
import Link from "next/link";
import {
  Pill,
  Package,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Prescription } from "@/types/pharmacy";
import { calculatePrescriptionStats } from "@/lib/pharmacy-utils";
import { usePharmacy } from "@/context/pharmacy-context";
import { PrescriptionDashboardStatsView } from "./prescription-dashboard-stats";
import { PrescriptionList } from "./prescription-list";
import { CreatePrescriptionDialog } from "./create-prescription-dialog";
import { PrescriptionDetailDialog } from "./prescription-detail-dialog";

export function PrescriptionsView() {
  const {
    prescriptions,
    medicines,
    addPrescription,
    updatePrescriptionStatus,
    deletePrescription,
  } = usePharmacy();

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [prescriptionToEdit, setPrescriptionToEdit] = React.useState<Prescription | null>(null);

  const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = React.useState<string | null>(null);

  // Dynamic statistics from current session prescriptions
  const stats = React.useMemo(() => {
    return calculatePrescriptionStats(prescriptions);
  }, [prescriptions]);

  const selectedPrescription = React.useMemo(() => {
    if (!selectedPrescriptionId) return null;
    return prescriptions.find((rx) => rx.id === selectedPrescriptionId) || null;
  }, [prescriptions, selectedPrescriptionId]);

  // Handlers
  const handleOpenCreate = () => {
    setPrescriptionToEdit(null);
    setIsCreateDialogOpen(true);
  };

  const handleOpenEdit = (rx: Prescription) => {
    setPrescriptionToEdit(rx);
    setIsCreateDialogOpen(true);
  };

  const handleOpenDetail = (rx: Prescription) => {
    setSelectedPrescriptionId(rx.id);
    setIsDetailDialogOpen(true);
  };

  const handleSavePrescription = (savedRx: Prescription) => {
    addPrescription(savedRx);
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-navigation */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl flex items-center gap-2">
            <Pill className="h-6 w-6 text-teal-700" />
            Prescriptions &amp; Dispensed Medicines
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log patient prescriptions, track dispensed pharmacy orders, and review healthcare worker directions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/medicines">
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs gap-1.5 text-slate-700 hover:text-slate-900"
            >
              <Package className="h-3.5 w-3.5 text-teal-700" />
              Manage Inventory
              <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
            </Button>
          </Link>

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs h-9 gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Issue Prescription
          </Button>
        </div>
      </div>

      {/* Dynamic Summary Cards */}
      <PrescriptionDashboardStatsView stats={stats} />

      {/* Main Prescription List */}
      <PrescriptionList
        prescriptions={prescriptions}
        onViewDetails={handleOpenDetail}
        onEditPrescription={handleOpenEdit}
        onUpdateStatus={updatePrescriptionStatus}
        onDeletePrescription={deletePrescription}
        onNewPrescription={handleOpenCreate}
      />

      {/* Dialog: Create / Edit Prescription */}
      <CreatePrescriptionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSave={handleSavePrescription}
        availableMedicines={medicines}
        prescriptionToEdit={prescriptionToEdit}
      />

      {/* Dialog: Prescription Detail */}
      <PrescriptionDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        prescription={selectedPrescription}
        onUpdateStatus={updatePrescriptionStatus}
        onEdit={handleOpenEdit}
        onDelete={deletePrescription}
      />
    </div>
  );
}
