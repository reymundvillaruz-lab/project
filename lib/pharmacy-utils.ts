import {
  Medicine,
  MedicineStatus,
  Prescription,
  MedicineDashboardStats,
  PrescriptionDashboardStats,
} from "@/types/pharmacy";

export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function computeMedicineStatus(
  availableQuantity: number,
  expirationDate: string,
  reorderLevel: number = 20
): MedicineStatus {
  const todayStr = getTodayDateString();

  // If expired
  if (expirationDate && expirationDate < todayStr) {
    return "Expired";
  }

  // If out of stock
  if (availableQuantity <= 0) {
    return "Out of Stock";
  }

  // If low stock
  if (availableQuantity <= reorderLevel) {
    return "Low Stock";
  }

  // Available
  return "Available";
}

export function calculateMedicineStats(
  medicines: Medicine[]
): MedicineDashboardStats {
  let availableItems = 0;
  let lowStockItems = 0;
  let outOfStockItems = 0;
  let expiredItems = 0;

  medicines.forEach((med) => {
    const status = computeMedicineStatus(
      med.availableQuantity,
      med.expirationDate,
      med.reorderLevel
    );

    if (status === "Available") availableItems++;
    else if (status === "Low Stock") lowStockItems++;
    else if (status === "Out of Stock") outOfStockItems++;
    else if (status === "Expired") expiredItems++;
  });

  return {
    totalItems: medicines.length,
    availableItems,
    lowStockItems,
    outOfStockItems,
    expiredItems,
  };
}

export function calculatePrescriptionStats(
  prescriptions: Prescription[]
): PrescriptionDashboardStats {
  const todayStr = getTodayDateString();

  let activePrescriptions = 0;
  let dispensedPrescriptions = 0;
  let todayPrescriptions = 0;

  prescriptions.forEach((rx) => {
    if (rx.status === "Active") activePrescriptions++;
    if (rx.status === "Dispensed" || rx.status === "Completed") dispensedPrescriptions++;
    if (rx.date === todayStr) todayPrescriptions++;
  });

  return {
    totalPrescriptions: prescriptions.length,
    activePrescriptions,
    dispensedPrescriptions,
    todayPrescriptions,
  };
}

export const MEDICINE_CATEGORIES = [
  "Antibiotics",
  "Analgesics & Antipyretics",
  "Antihypertensives",
  "Vitamins & Supplements",
  "Antihistamines",
  "Respiratory & Cough",
  "Gastrointestinal",
  "Family Planning & Contraceptives",
  "Topical & Antiseptic",
  "Emergency & First Aid",
  "Other Medical Supplies",
];

export const MEDICINE_UNITS = [
  "Tablets",
  "Capsules",
  "Bottles (60ml)",
  "Bottles (120ml)",
  "Blister Packs",
  "Vials / Ampoules",
  "Tubes (Cream/Ointment)",
  "Sachets (Oral Rehydration)",
  "Boxes",
  "Pieces",
];

export const COMMON_DOSAGE_FORMS = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Suspension",
  "Ointment / Cream",
  "Solution",
  "Drops",
  "Injectable",
];

export const COMMON_PRESCRIPTION_UNITS = [
  "Tablet",
  "Syrup",
  "Capsule",
  "Suspension",
  "Drops",
  "Ointment",
  "Vial",
  "Sachet",
  "Bottle",
];

export const COMMON_FREQUENCIES = [
  "Once daily (OD) - Morning",
  "Once daily (OD) - Bedtime",
  "Twice daily (BID) - Every 12 hrs",
  "Three times daily (TID) - Every 8 hrs",
  "Four times daily (QID) - Every 6 hrs",
  "Every 4 to 6 hours as needed (PRN)",
  "Before meals (AC)",
  "After meals (PC)",
  "As directed by physician",
];

export const STANDARD_PRESCRIBERS = [
  "Municipal Health Officer / Physician",
  "Attending Health Center Physician",
  "Rural Health Midwife, RM",
  "Public Health Nurse, RN",
  "Barangay Health Worker (BHW) On-Duty",
];

import { PrescriptionItem } from "@/types/pharmacy";

export function getPrescriptionItems(rx: Prescription): PrescriptionItem[] {
  if (rx.items && rx.items.length > 0) {
    return rx.items;
  }
  if (rx.medicine) {
    const unitGuess =
      rx.medicine.toLowerCase().includes("syrup")
        ? "Syrup"
        : rx.medicine.toLowerCase().includes("capsule")
        ? "Capsule"
        : "Tablet";
    return [
      {
        id: "item-default",
        drug: rx.medicine,
        medicineId: rx.medicineId,
        unit: unitGuess,
        dosagePerDay:
          [rx.dosage, rx.frequency, rx.duration].filter(Boolean).join(" - ") ||
          "As directed by physician",
        quantity: rx.quantityToDispense,
      },
    ];
  }
  return [];
}

// Strictly EMPTY - Zero mock prescriptions
export const DEFAULT_INITIAL_PRESCRIPTIONS: Prescription[] = [];

