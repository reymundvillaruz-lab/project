export type MedicineStatus =
  | "Available"
  | "Low Stock"
  | "Out of Stock"
  | "Expired";

export type MedicineCategory =
  | "Antibiotics"
  | "Analgesics & Antipyretics"
  | "Antihypertensives"
  | "Vitamins & Supplements"
  | "Antihistamines"
  | "Respiratory & Cough"
  | "Gastrointestinal"
  | "Family Planning & Contraceptives"
  | "Topical & Antiseptic"
  | "Emergency & First Aid"
  | "Other Medical Supplies";

export interface StockAdjustmentRecord {
  id: string;
  date: string; // YYYY-MM-DD
  type: "Stock In" | "Stock Out" | "Adjustment";
  quantity: number;
  reason: string;
  adjustedBy: string;
  previousQuantity: number;
  newQuantity: number;
}

export interface Medicine {
  id: string; // e.g. "MED-2026-001"
  name: string; // Generic / Full Name (e.g. "Paracetamol 500mg Tablet")
  brandName?: string; // Brand name (e.g. "Biogesic")
  category: MedicineCategory | string;
  availableQuantity: number;
  unit: string; // e.g. "Tablets", "Capsules", "Bottles", "Blister Packs", "Vials", "Tubes"
  expirationDate: string; // YYYY-MM-DD
  status: MedicineStatus;
  reorderLevel?: number; // threshold for Low Stock, defaults to 20
  dosageForm?: string; // e.g. "Tablet", "Capsule", "Syrup (60ml)", "Ointment"
  batchNumber?: string;
  manufacturer?: string;
  storageLocation?: string; // e.g. "Cabinet A - Shelf 2"
  notes?: string;
  stockHistory?: StockAdjustmentRecord[];
}

export type PrescriptionStatus =
  | "Active"
  | "Dispensed"
  | "Completed"
  | "Cancelled";

export interface Prescription {
  id: string; // e.g. "RX-2026-001"
  patientName: string;
  patientId?: string;
  patientContact?: string;
  date: string; // YYYY-MM-DD
  prescriber: string; // Doctor or BHW/Nurse
  medicine: string; // Generic name / formulation
  medicineId?: string;
  dosage: string; // e.g. "500 mg"
  frequency: string; // e.g. "3x a day after meals"
  duration: string; // e.g. "7 days"
  quantityToDispense?: number;
  status: PrescriptionStatus;
  notes?: string;
  dispensedDate?: string;
  dispensedBy?: string;
  createdAt: string;
}

export interface MedicineDashboardStats {
  totalItems: number;
  availableItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  expiredItems: number;
}

export interface PrescriptionDashboardStats {
  totalPrescriptions: number;
  activePrescriptions: number;
  dispensedPrescriptions: number;
  todayPrescriptions: number;
}
