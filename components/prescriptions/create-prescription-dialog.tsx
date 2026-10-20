import * as React from "react";
import {
  Pill,
  User,
  Calendar,
  Stethoscope,
  Plus,
  Trash2,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Prescription,
  PrescriptionItem,
  PrescriptionStatus,
  Medicine,
} from "@/types/pharmacy";
import {
  getTodayDateString,
  COMMON_FREQUENCIES,
  COMMON_PRESCRIPTION_UNITS,
  STANDARD_PRESCRIBERS,
  getPrescriptionItems,
} from "@/lib/pharmacy-utils";
import { PatientRegistrySelect } from "@/components/patients/patient-registry-select";
import { MockPatient } from "@/lib/mock-data/patients";

interface CreatePrescriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (prescription: Prescription) => void;
  availableMedicines: Medicine[];
  prescriptionToEdit?: Prescription | null;
}

export function CreatePrescriptionDialog({
  open,
  onOpenChange,
  onSave,
  availableMedicines,
  prescriptionToEdit,
}: CreatePrescriptionDialogProps) {
  const isEditing = Boolean(prescriptionToEdit);

  // Patient Registry Integration
  const [selectedRegistryPatient, setSelectedRegistryPatient] =
    React.useState<MockPatient | null>(null);

  // Patient fields (matching the printable pharmaceutical prescription template)
  const [patientName, setPatientName] = React.useState("");
  const [patientId, setPatientId] = React.useState("");
  const [patientIdNumber, setPatientIdNumber] = React.useState("");
  const [patientContact, setPatientContact] = React.useState("");
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [age, setAge] = React.useState<number | "">("");
  const [sex, setSex] = React.useState<string>("Male");
  const [occupation, setOccupation] = React.useState("");
  const [healthInsuranceNumber, setHealthInsuranceNumber] = React.useState("");
  const [healthCareProvider, setHealthCareProvider] = React.useState(
    "Barangay Health Center Primary Care Facility"
  );
  const [healthCardNumber, setHealthCardNumber] = React.useState("");

  // Prescription Meta
  const [date, setDate] = React.useState(getTodayDateString());
  const [prescriber, setPrescriber] = React.useState(
    "Dr. Maria Santos, MD"
  );
  const [doctorLicenseNumber, setDoctorLicenseNumber] =
    React.useState("PRC No. 0089241");
  const [status, setStatus] = React.useState<PrescriptionStatus>("Active");
  const [notes, setNotes] = React.useState("");

  // Prescription Items (Drugs, Unit (Tablet/Syrup), Dosage (Per Day))
  const [items, setItems] = React.useState<PrescriptionItem[]>([
    {
      id: "item-1",
      drug: "",
      unit: "Tablet",
      dosagePerDay: "1 tablet 3x a day (every 8 hrs) after meals",
      quantity: 21,
    },
  ]);

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Auto-fill from Patient Registry
  const handleSelectRegistryPatient = (p: MockPatient | null) => {
    setSelectedRegistryPatient(p);
    if (p) {
      setPatientName(
        `${p.firstName} ${p.middleName ? p.middleName + " " : ""}${p.lastName}`.trim()
      );
      setPatientId(p.id);
      setPatientIdNumber(p.patientIdNumber || p.id);
      const contactVal = p.contactNumber || p.contact;
      if (contactVal) setPatientContact(contactVal);
      if (p.birthdate) setDateOfBirth(p.birthdate);
      if (p.age !== undefined && p.age !== null) setAge(p.age);
      if (p.sex) setSex(p.sex);
      if (p.employmentStatus) setOccupation(p.employmentStatus);
      const philhealth = p.phicNo || p.philhealthNumber;
      if (philhealth) setHealthInsuranceNumber(philhealth);
      if (p.pwdId) setHealthCardNumber(p.pwdId);
    }
  };

  React.useEffect(() => {
    if (open) {
      if (prescriptionToEdit) {
        setPatientName(prescriptionToEdit.patientName || "");
        setPatientId(prescriptionToEdit.patientId || "");
        setPatientIdNumber(prescriptionToEdit.patientIdNumber || prescriptionToEdit.patientId || "");
        setPatientContact(prescriptionToEdit.patientContact || "");
        setDateOfBirth(prescriptionToEdit.dateOfBirth || "");
        setAge(
          prescriptionToEdit.age !== undefined && prescriptionToEdit.age !== null
            ? Number(prescriptionToEdit.age)
            : ""
        );
        setSex(prescriptionToEdit.sex || "Male");
        setOccupation(prescriptionToEdit.occupation || "");
        setHealthInsuranceNumber(prescriptionToEdit.healthInsuranceNumber || "");
        setHealthCareProvider(
          prescriptionToEdit.healthCareProvider ||
            "Barangay Health Center Primary Care Facility"
        );
        setHealthCardNumber(prescriptionToEdit.healthCardNumber || "");
        setDate(prescriptionToEdit.date || getTodayDateString());
        setPrescriber(prescriptionToEdit.prescriber || "Dr. Maria Santos, MD");
        setDoctorLicenseNumber(prescriptionToEdit.doctorLicenseNumber || "PRC No. 0089241");
        setStatus(prescriptionToEdit.status || "Active");
        setNotes(prescriptionToEdit.notes || "");

        const existingItems = getPrescriptionItems(prescriptionToEdit);
        setItems(
          existingItems.length > 0
            ? existingItems
            : [
                {
                  id: "item-1",
                  drug: prescriptionToEdit.medicine || "",
                  unit: "Tablet",
                  dosagePerDay: prescriptionToEdit.dosage || "",
                  quantity: prescriptionToEdit.quantityToDispense || 21,
                },
              ]
        );
      } else {
        setPatientName("");
        setPatientId("");
        setPatientIdNumber("");
        setPatientContact("");
        setDateOfBirth("");
        setAge("");
        setSex("Male");
        setOccupation("");
        setHealthInsuranceNumber("");
        setHealthCareProvider("Barangay Health Center Primary Care Facility");
        setHealthCardNumber("");
        setDate(getTodayDateString());
        setPrescriber("Dr. Maria Santos, MD");
        setDoctorLicenseNumber("PRC No. 0089241");
        setStatus("Active");
        setNotes("");
        setItems([
          {
            id: `item-${Date.now()}-1`,
            drug: "",
            unit: "Tablet",
            dosagePerDay: "1 tablet 3x a day (every 8 hrs) after meals",
            quantity: 21,
          },
        ]);
        setSelectedRegistryPatient(null);
      }
      setErrors({});
    }
  }, [open, prescriptionToEdit]);

  // Items manipulation
  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}-${prev.length + 1}`,
        drug: "",
        unit: "Tablet",
        dosagePerDay: "1 tablet twice daily after meals",
        quantity: 14,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof PrescriptionItem,
    value: any
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // Inventory Quick-Select into an item
  const handleSelectInventoryMed = (index: number, medicineId: string) => {
    if (!medicineId) return;
    const med = availableMedicines.find((m) => m.id === medicineId);
    if (!med) return;

    let guessedUnit = "Tablet";
    if (med.dosageForm) {
      guessedUnit = med.dosageForm;
    } else if (med.unit?.toLowerCase().includes("syrup") || med.name?.toLowerCase().includes("syrup")) {
      guessedUnit = "Syrup";
    } else if (med.unit?.toLowerCase().includes("capsule") || med.name?.toLowerCase().includes("capsule")) {
      guessedUnit = "Capsule";
    }

    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              drug: med.brandName ? `${med.brandName} (${med.name})` : med.name,
              medicineId: med.id,
              unit: guessedUnit,
            }
          : item
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!patientName.trim()) {
      newErrors.patientName = "Patient's name is required";
    }
    if (!date.trim()) {
      newErrors.date = "Date is required";
    }
    if (!prescriber.trim()) {
      newErrors.prescriber = "Doctor / Prescriber is required";
    }

    const validItems = items.filter((item) => item.drug.trim());
    if (validItems.length === 0) {
      newErrors.items = "Please enter at least one prescribed drug";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const primaryDrug = validItems[0];
    const totalQty = validItems.reduce((acc, it) => acc + (it.quantity || 0), 0);

    const payload: Prescription = {
      id: prescriptionToEdit
        ? prescriptionToEdit.id
        : `RX-${Date.now().toString().slice(-6)}`,
      date: date.trim(),

      // Patient information (matching reference image)
      patientName: patientName.trim(),
      patientId: patientId.trim() || undefined,
      patientIdNumber: patientIdNumber.trim() || undefined,
      patientContact: patientContact.trim() || undefined,
      dateOfBirth: dateOfBirth.trim() || undefined,
      age: age !== "" ? Number(age) : undefined,
      sex: sex.trim() || undefined,
      occupation: occupation.trim() || undefined,
      healthInsuranceNumber: healthInsuranceNumber.trim() || undefined,
      healthCareProvider: healthCareProvider.trim() || undefined,
      healthCardNumber: healthCardNumber.trim() || undefined,

      // Doctor Information
      prescriber: prescriber.trim(),
      doctorLicenseNumber: doctorLicenseNumber.trim() || undefined,
      doctorSignatureTitle: "Doctor's Signature",

      // Prescribed Drugs Table
      items: validItems,

      // Legacy fallback fields for backward compatibility
      medicine: validItems.map((i) => i.drug).join(", "),
      medicineId: primaryDrug?.medicineId,
      dosage: primaryDrug?.dosagePerDay || "",
      frequency: primaryDrug?.dosagePerDay || "",
      duration: "As indicated",
      quantityToDispense: totalQty || undefined,

      status,
      notes: notes.trim() || undefined,
      createdAt: prescriptionToEdit
        ? prescriptionToEdit.createdAt
        : new Date().toISOString(),
    };

    onSave(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-3xl" className="max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="border-b border-slate-100 p-5 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700">
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base text-slate-900">
                {isEditing ? "Revise Medical Prescription" : "Issue Medical Prescription"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Official Pharmaceutical Prescription Form • Standard 3-Column Medication Table
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Patient Registry Quick Lookup */}
          <div className="rounded-xl bg-indigo-50/50 border border-indigo-100 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                Select Existing Patient from Registry
              </span>
              <span className="text-[11px] text-indigo-700">Auto-fills demographic &amp; health ID numbers</span>
            </div>
            <PatientRegistrySelect
              selectedPatient={selectedRegistryPatient}
              onSelectPatient={handleSelectRegistryPatient}
            />
          </div>

          {/* Patient Information Section (Directly maps to the reference template) */}
          <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <User className="h-3.5 w-3.5 text-indigo-600" />
              Patient Details &amp; Identification
            </h4>

            {/* Row 1: Patient Name & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <Label htmlFor="patientName" className="text-xs font-medium">
                  Patient&apos;s Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="patientName"
                  placeholder="e.g. Juan Dela Cruz"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className={`text-xs h-9 ${errors.patientName ? "border-rose-500" : ""}`}
                />
                {errors.patientName && (
                  <p className="text-[11px] text-rose-600">{errors.patientName}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="rxDate" className="text-xs font-medium">
                  Prescription Date <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="rxDate"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="text-xs h-9"
                />
              </div>
            </div>

            {/* Row 2: DOB, Age, Sex, Occupation */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label htmlFor="dateOfBirth" className="text-xs font-medium">
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="age" className="text-xs font-medium">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Age"
                  value={age}
                  onChange={(e) =>
                    setAge(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="sex" className="text-xs font-medium">
                  Sex
                </Label>
                <Select
                  id="sex"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  className="text-xs h-9"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="occupation" className="text-xs font-medium">
                  Occupation
                </Label>
                <Input
                  id="occupation"
                  placeholder="e.g. Teacher, Farmer"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="text-xs h-9"
                />
              </div>
            </div>

            {/* Row 3: Health Insurance Number, Health Care Provider */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="healthInsuranceNumber" className="text-xs font-medium">
                  Health Insurance Number (PhilHealth)
                </Label>
                <Input
                  id="healthInsuranceNumber"
                  placeholder="e.g. 12-345678901-2"
                  value={healthInsuranceNumber}
                  onChange={(e) => setHealthInsuranceNumber(e.target.value)}
                  className="text-xs h-9 font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="healthCareProvider" className="text-xs font-medium">
                  Health Care Provider
                </Label>
                <Input
                  id="healthCareProvider"
                  placeholder="e.g. Barangay Health Center Primary Care Facility"
                  value={healthCareProvider}
                  onChange={(e) => setHealthCareProvider(e.target.value)}
                  className="text-xs h-9"
                />
              </div>
            </div>

            {/* Row 4: Health Card Number, Patient ID Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="healthCardNumber" className="text-xs font-medium">
                  Health Card Number (Senior / PWD / Local)
                </Label>
                <Input
                  id="healthCardNumber"
                  placeholder="e.g. BHC-HC-88421"
                  value={healthCardNumber}
                  onChange={(e) => setHealthCardNumber(e.target.value)}
                  className="text-xs h-9 font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="patientIdNumber" className="text-xs font-medium">
                  Patient ID Number
                </Label>
                <Input
                  id="patientIdNumber"
                  placeholder="e.g. BHC-2026-0001"
                  value={patientIdNumber}
                  onChange={(e) => setPatientIdNumber(e.target.value)}
                  className="text-xs h-9 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Drugs Table Section (Exact layout from the reference image) */}
          <div className="space-y-3 rounded-lg border-2 border-indigo-200 bg-white p-4">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-2.5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                  <Pill className="h-3.5 w-3.5 text-indigo-600" />
                  Prescribed Medication Table
                </h4>
                <p className="text-[11px] text-slate-500">
                  Matches the 3-column Pharmaceutical Prescription Pad: Drugs, Unit, Dosage Per Day
                </p>
              </div>

              <Button
                type="button"
                size="sm"
                onClick={handleAddItem}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1 h-7.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Drug
              </Button>
            </div>

            {errors.items && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded border border-rose-200">
                {errors.items}
              </p>
            )}

            {/* Prescribed Drugs Rows */}
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900">
                      Drug Item #{idx + 1}
                    </span>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(idx)}
                        className="h-6 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-[11px] gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* Quick-fill from Inventory */}
                  {availableMedicines.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                        From Stock:
                      </span>
                      <Select
                        value={item.medicineId || ""}
                        onChange={(e) => handleSelectInventoryMed(idx, e.target.value)}
                        className="text-xs h-7.5 bg-white"
                      >
                        <option value="">-- Choose from Pharmacy Inventory (Optional) --</option>
                        {availableMedicines.map((med) => (
                          <option key={med.id} value={med.id}>
                            {med.name} ({med.availableQuantity} {med.unit} available)
                          </option>
                        ))}
                      </Select>
                    </div>
                  )}

                  {/* 3 Main Columns: Drugs | Unit (Tablet/Syrup) | Dosage (Per Day) */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                    {/* Column 1: Drugs */}
                    <div className="sm:col-span-5 space-y-1">
                      <Label className="text-[11px] font-semibold text-slate-700">
                        Drugs (Name &amp; Strength) <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        placeholder="e.g. Amoxicillin 500mg"
                        value={item.drug}
                        onChange={(e) => handleItemChange(idx, "drug", e.target.value)}
                        className="text-xs h-8.5 bg-white"
                      />
                    </div>

                    {/* Column 2: Unit (Tablet/Syrup) */}
                    <div className="sm:col-span-3 space-y-1">
                      <Label className="text-[11px] font-semibold text-slate-700">
                        Unit (Tablet/Syrup)
                      </Label>
                      <Select
                        value={item.unit}
                        onChange={(e) => handleItemChange(idx, "unit", e.target.value)}
                        className="text-xs h-8.5 bg-white"
                      >
                        {COMMON_PRESCRIPTION_UNITS.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </Select>
                    </div>

                    {/* Column 3: Dosage (Per Day) */}
                    <div className="sm:col-span-4 space-y-1">
                      <Label className="text-[11px] font-semibold text-slate-700">
                        Dosage (Per Day)
                      </Label>
                      <Input
                        placeholder="e.g. 1 tab 3x daily PC"
                        value={item.dosagePerDay}
                        onChange={(e) =>
                          handleItemChange(idx, "dosagePerDay", e.target.value)
                        }
                        className="text-xs h-8.5 bg-white"
                      />
                    </div>
                  </div>

                  {/* Extra Dispense Quantity & Frequency presets */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">Qty to Dispense:</span>
                      <Input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.quantity ?? ""}
                        onChange={(e) =>
                          handleItemChange(
                            idx,
                            "quantity",
                            e.target.value === "" ? undefined : Number(e.target.value)
                          )
                        }
                        className="w-18 h-7 text-xs bg-white"
                      />
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <span>Presets:</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleItemChange(idx, "dosagePerDay", "1 tab 3x a day (every 8 hrs)")
                        }
                        className="px-1.5 py-0.5 rounded bg-slate-200/80 hover:bg-slate-300 text-slate-700"
                      >
                        TID (q8h)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleItemChange(idx, "dosagePerDay", "1 tab twice daily (every 12 hrs)")
                        }
                        className="px-1.5 py-0.5 rounded bg-slate-200/80 hover:bg-slate-300 text-slate-700"
                      >
                        BID (q12h)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleItemChange(idx, "dosagePerDay", "1 tab once daily in morning")
                        }
                        className="px-1.5 py-0.5 rounded bg-slate-200/80 hover:bg-slate-300 text-slate-700"
                      >
                        OD (q24h)
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor / Prescriber Information (Matching bottom signature line) */}
          <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Stethoscope className="h-3.5 w-3.5 text-indigo-600" />
              Doctor&apos;s Signature &amp; Prescriber Authorization
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="prescriber" className="text-xs font-medium">
                  Doctor / Prescriber Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="prescriber"
                  value={prescriber}
                  onChange={(e) => setPrescriber(e.target.value)}
                  className={`text-xs h-9 ${errors.prescriber ? "border-rose-500" : ""}`}
                />
                {errors.prescriber && (
                  <p className="text-[11px] text-rose-600">{errors.prescriber}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="doctorLicenseNumber" className="text-xs font-medium">
                  PRC License / PTR Number
                </Label>
                <Input
                  id="doctorLicenseNumber"
                  value={doctorLicenseNumber}
                  onChange={(e) => setDoctorLicenseNumber(e.target.value)}
                  className="text-xs h-9 font-mono"
                />
              </div>
            </div>

            {/* Status selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <Label htmlFor="rxStatus" className="text-xs font-medium">
                  Prescription Status
                </Label>
                <Select
                  id="rxStatus"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PrescriptionStatus)}
                  className="text-xs h-9"
                >
                  <option value="Active">Active (Ready for dispensing)</option>
                  <option value="Dispensed">Dispensed (Deduct from inventory)</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="patientContact" className="text-xs font-medium">
                  Patient Contact Phone
                </Label>
                <Input
                  id="patientContact"
                  placeholder="0917-000-0000"
                  value={patientContact}
                  onChange={(e) => setPatientContact(e.target.value)}
                  className="text-xs h-9"
                />
              </div>
            </div>
          </div>

          {/* Special Instructions & Clinical Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-medium">
              Special Instructions, Diet Warnings &amp; Precautions
            </Label>
            <Textarea
              id="notes"
              rows={2}
              placeholder="e.g. Take full course of antibiotics with plenty of water. Avoid taking on an empty stomach."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-xs"
            />
          </div>

          </div>

          <DialogFooter className="shrink-0 border-t border-slate-100 bg-slate-50/80 px-5 py-3 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs shadow-xs"
            >
              {isEditing ? "Save Revisions" : "Issue Printable Prescription"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
