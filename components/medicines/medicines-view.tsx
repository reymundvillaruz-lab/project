"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package,
  Pill,
  Plus,
  ArrowRight,
  Boxes,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Medicine } from "@/types/pharmacy";
import { calculateMedicineStats } from "@/lib/pharmacy-utils";
import { usePharmacy } from "@/context/pharmacy-context";
import { MedicineDashboardStatsView } from "./medicine-dashboard-stats";
import { MedicineList } from "./medicine-list";
import { AddMedicineDialog } from "./add-medicine-dialog";
import { StockAdjustmentDialog } from "./stock-adjustment-dialog";
import { MedicineDetailDialog } from "./medicine-detail-dialog";

export function MedicinesView() {
  const {
    medicines,
    addMedicine,
    updateMedicine,
    adjustStock,
    deleteMedicine,
  } = usePharmacy();

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [medicineToEdit, setMedicineToEdit] = React.useState<Medicine | null>(null);

  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = React.useState(false);
  const [medicineToAdjust, setMedicineToAdjust] = React.useState<Medicine | null>(null);

  const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false);
  const [selectedMedicineId, setSelectedMedicineId] = React.useState<string | null>(null);

  // Dynamic statistics from current session inventory
  const stats = React.useMemo(() => {
    return calculateMedicineStats(medicines);
  }, [medicines]);

  const selectedMedicine = React.useMemo(() => {
    if (!selectedMedicineId) return null;
    return medicines.find((m) => m.id === selectedMedicineId) || null;
  }, [medicines, selectedMedicineId]);

  // Handlers
  const handleOpenAdd = () => {
    setMedicineToEdit(null);
    setIsAddDialogOpen(true);
  };

  const handleOpenEdit = (medicine: Medicine) => {
    setMedicineToEdit(medicine);
    setIsAddDialogOpen(true);
  };

  const handleOpenAdjust = (medicine: Medicine) => {
    setMedicineToAdjust(medicine);
    setIsAdjustDialogOpen(true);
  };

  const handleOpenDetail = (medicine: Medicine) => {
    setSelectedMedicineId(medicine.id);
    setIsDetailDialogOpen(true);
  };

  const handleSaveMedicine = (medicine: Medicine) => {
    if (medicineToEdit) {
      updateMedicine(medicine);
    } else {
      addMedicine(medicine);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-navigation */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl flex items-center gap-2">
            <Package className="h-6 w-6 text-teal-700" />
            Medicines &amp; Pharmacy Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage Barangay Health Station drug stocks, monitor batch expiration dates, and reconcile inventory levels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/prescriptions">
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs gap-1.5 text-slate-700 hover:text-slate-900"
            >
              <Pill className="h-3.5 w-3.5 text-teal-700" />
              View Prescriptions
              <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
            </Button>
          </Link>

          <Button
            size="sm"
            onClick={handleOpenAdd}
            className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs h-9 gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add Medicine Item
          </Button>
        </div>
      </div>

      {/* Dynamic Summary Cards */}
      <MedicineDashboardStatsView stats={stats} />

      {/* Main Inventory List */}
      <MedicineList
        medicines={medicines}
        onViewDetails={handleOpenDetail}
        onAdjustStock={handleOpenAdjust}
        onEditMedicine={handleOpenEdit}
        onDeleteMedicine={deleteMedicine}
        onNewMedicine={handleOpenAdd}
      />

      {/* Dialog: Add / Edit Medicine */}
      <AddMedicineDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleSaveMedicine}
        medicineToEdit={medicineToEdit}
      />

      {/* Dialog: Stock Adjustment */}
      <StockAdjustmentDialog
        open={isAdjustDialogOpen}
        onOpenChange={setIsAdjustDialogOpen}
        medicine={medicineToAdjust}
        onAdjustStock={adjustStock}
      />

      {/* Dialog: Medicine Detail */}
      <MedicineDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        medicine={selectedMedicine}
        onOpenAdjustStock={handleOpenAdjust}
        onOpenEdit={handleOpenEdit}
        onDelete={deleteMedicine}
      />
    </div>
  );
}
