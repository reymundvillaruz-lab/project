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

export interface PrescriptionItem {
  id: string;
  drug: string; // Drugs column (e.g. "Amoxicillin Trihydrate 500mg Capsule")
  medicineId?: string; // Linked inventory item if selected
  unit: string; // Unit (Tablet/Syrup) column e.g. "Tablet", "Syrup", "Capsule", "Suspension"
  dosagePerDay: string; // Dosage (Per Day) column e.g. "1 tab 3x a day after meals"
  quantity?: number; // Total quantity to dispense e.g. 21
}

export interface Prescription {
  id: string; // e.g. "RX-2026-001"
  date: string; // YYYY-MM-DD

  // Printable Pharmaceutical Prescription Patient Information
  patientName: string;
  patientId?: string;
  patientIdNumber?: string; // Patient ID Number
  patientContact?: string;
  dateOfBirth?: string; // Date of Birth YYYY-MM-DD
  age?: number | string; // Age
  sex?: "Male" | "Female" | string; // Sex
  occupation?: string; // Occupation (e.g. Teacher, Farmer, Merchant)
  healthInsuranceNumber?: string; // Health Insurance Number (PhilHealth)
  healthCareProvider?: string; // Health Care Provider (Clinic / Hospital / Doctor)
  healthCardNumber?: string; // Health Card Number (Senior / PWD / Local card)

  // Prescriber / Doctor Information
  prescriber: string; // Prescriber / Doctor Name
  doctorLicenseNumber?: string; // PRC / License No.
  doctorPtrNumber?: string; // PTR No.
  doctorSignatureTitle?: string; // e.g. "Doctor's Signature"

  // Prescription Items (Drugs, Unit, Dosage Per Day)
  items?: PrescriptionItem[];

  // Legacy fields preserved for backward compatibility
  medicine: string; // Generic / brand name summary
  medicineId?: string;
  dosage: string;
  frequency: string;
  duration: string;
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
