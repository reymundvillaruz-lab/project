"use client";

import * as React from "react";
import {
  Medicine,
  Prescription,
  StockAdjustmentRecord,
  PrescriptionStatus,
} from "@/types/pharmacy";
import { computeMedicineStatus, getTodayDateString } from "@/lib/pharmacy-utils";

interface PharmacyContextType {
  medicines: Medicine[];
  prescriptions: Prescription[];
  addMedicine: (medicine: Medicine) => void;
  updateMedicine: (medicine: Medicine) => void;
  adjustStock: (
    medicineId: string,
    adjustment: Omit<StockAdjustmentRecord, "id" | "previousQuantity" | "newQuantity">
  ) => void;
  deleteMedicine: (medicineId: string) => void;
  addPrescription: (prescription: Prescription) => void;
  updatePrescriptionStatus: (
    prescriptionId: string,
    status: PrescriptionStatus
  ) => void;
  deletePrescription: (prescriptionId: string) => void;
}

export const PHARMACY_MEDS_STORAGE_KEY = "bhcms_pharmacy_medicines_v1";
export const PHARMACY_RX_STORAGE_KEY = "bhcms_pharmacy_prescriptions_v1";

export function getStoredPharmacyMedicines(): Medicine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PHARMACY_MEDS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredPharmacyMedicines(medicines: Medicine[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PHARMACY_MEDS_STORAGE_KEY, JSON.stringify(medicines));
  } catch (e) {
    console.error("Failed to save pharmacy medicines to storage", e);
  }
}

export function getStoredPharmacyPrescriptions(): Prescription[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PHARMACY_RX_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredPharmacyPrescriptions(prescriptions: Prescription[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PHARMACY_RX_STORAGE_KEY, JSON.stringify(prescriptions));
  } catch (e) {
    console.error("Failed to save pharmacy prescriptions to storage", e);
  }
}

const PharmacyContext = React.createContext<PharmacyContextType | undefined>(
  undefined
);

export function PharmacyProvider({ children }: { children: React.ReactNode }) {
  const [medicines, setMedicines] = React.useState<Medicine[]>([]);
  const [prescriptions, setPrescriptions] = React.useState<Prescription[]>([]);
  const isHydratedRef = React.useRef(false);

  // Hydrate from storage on mount
  React.useEffect(() => {
    setMedicines(getStoredPharmacyMedicines());
    setPrescriptions(getStoredPharmacyPrescriptions());
    isHydratedRef.current = true;
  }, []);

  // Persist medicines
  React.useEffect(() => {
    if (isHydratedRef.current) {
      saveStoredPharmacyMedicines(medicines);
    }
  }, [medicines]);

  // Persist prescriptions
  React.useEffect(() => {
    if (isHydratedRef.current) {
      saveStoredPharmacyPrescriptions(prescriptions);
    }
  }, [prescriptions]);

  // ---------------------------------------------------------------------------
  // MEDICINES OPERATIONS
  // ---------------------------------------------------------------------------
  const addMedicine = React.useCallback((newMed: Medicine) => {
    const computedStatus = computeMedicineStatus(
      newMed.availableQuantity,
      newMed.expirationDate,
      newMed.reorderLevel
    );

    setMedicines((prev) => [
      {
        ...newMed,
        status: computedStatus,
        stockHistory: newMed.stockHistory || [
          {
            id: `ADJ-${Date.now()}`,
            date: getTodayDateString(),
            type: "Stock In",
            quantity: newMed.availableQuantity,
            reason: "Initial inventory registration",
            adjustedBy: "Barangay Health Center Staff",
            previousQuantity: 0,
            newQuantity: newMed.availableQuantity,
          },
        ],
      },
      ...prev,
    ]);
  }, []);

  const updateMedicine = React.useCallback((updatedMed: Medicine) => {
    const computedStatus = computeMedicineStatus(
      updatedMed.availableQuantity,
      updatedMed.expirationDate,
      updatedMed.reorderLevel
    );

    setMedicines((prev) =>
      prev.map((med) =>
        med.id === updatedMed.id
          ? {
              ...updatedMed,
              status: computedStatus,
            }
          : med
      )
    );
  }, []);

  const adjustStock = React.useCallback(
    (
      medicineId: string,
      adjustment: Omit<StockAdjustmentRecord, "id" | "previousQuantity" | "newQuantity">
    ) => {
      setMedicines((prev) =>
        prev.map((med) => {
          if (med.id !== medicineId) return med;

          const prevQty = med.availableQuantity;
          let newQty = prevQty;

          if (adjustment.type === "Stock In") {
            newQty = prevQty + adjustment.quantity;
          } else if (adjustment.type === "Stock Out") {
            newQty = Math.max(0, prevQty - adjustment.quantity);
          } else {
            // Adjustment directly to specified quantity
            newQty = Math.max(0, adjustment.quantity);
          }

          const record: StockAdjustmentRecord = {
            id: `ADJ-${Date.now()}`,
            date: adjustment.date || getTodayDateString(),
            type: adjustment.type,
            quantity: adjustment.quantity,
            reason: adjustment.reason,
            adjustedBy: adjustment.adjustedBy,
            previousQuantity: prevQty,
            newQuantity: newQty,
          };

          const newStatus = computeMedicineStatus(
            newQty,
            med.expirationDate,
            med.reorderLevel
          );

          return {
            ...med,
            availableQuantity: newQty,
            status: newStatus,
            stockHistory: [record, ...(med.stockHistory || [])],
          };
        })
      );
    },
    []
  );

  const deleteMedicine = React.useCallback((medicineId: string) => {
    setMedicines((prev) => prev.filter((med) => med.id !== medicineId));
  }, []);

  // ---------------------------------------------------------------------------
  // PRESCRIPTIONS OPERATIONS
  // ---------------------------------------------------------------------------
  const addPrescription = React.useCallback((newRx: Prescription) => {
    setPrescriptions((prev) => [newRx, ...prev]);

    // Optional stock sync: if prescription specifies medicineId or quantityToDispense and is dispensed
    if (newRx.status === "Dispensed" && newRx.medicineId && newRx.quantityToDispense) {
      adjustStock(newRx.medicineId, {
        date: newRx.date,
        type: "Stock Out",
        quantity: newRx.quantityToDispense,
        reason: `Dispensed for prescription ${newRx.id} (${newRx.patientName})`,
        adjustedBy: newRx.dispensedBy || newRx.prescriber,
      });
    }
  }, [adjustStock]);

  const updatePrescriptionStatus = React.useCallback(
    (prescriptionId: string, status: PrescriptionStatus) => {
      setPrescriptions((prev) =>
        prev.map((rx) => {
          if (rx.id !== prescriptionId) return rx;

          const updated: Prescription = {
            ...rx,
            status,
            dispensedDate:
              status === "Dispensed" || status === "Completed"
                ? rx.dispensedDate || getTodayDateString()
                : rx.dispensedDate,
          };

          return updated;
        })
      );
    },
    []
  );

  const deletePrescription = React.useCallback((prescriptionId: string) => {
    setPrescriptions((prev) => prev.filter((rx) => rx.id !== prescriptionId));
  }, []);

  const value = React.useMemo(
    () => ({
      medicines,
      prescriptions,
      addMedicine,
      updateMedicine,
      adjustStock,
      deleteMedicine,
      addPrescription,
      updatePrescriptionStatus,
      deletePrescription,
    }),
    [
      medicines,
      prescriptions,
      addMedicine,
      updateMedicine,
      adjustStock,
      deleteMedicine,
      addPrescription,
      updatePrescriptionStatus,
      deletePrescription,
    ]
  );

  return (
    <PharmacyContext.Provider value={value}>
      {children}
    </PharmacyContext.Provider>
  );
}

export function usePharmacy() {
  const context = React.useContext(PharmacyContext);
  if (!context) {
    throw new Error("usePharmacy must be used within a PharmacyProvider");
  }
  return context;
}
