import * as React from "react";
import {
  Pill,
  User,
  Calendar,
  Stethoscope,
  Clock,
  CheckCircle2,
  Plus,
  FileText,
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
  PrescriptionStatus,
  Medicine,
} from "@/types/pharmacy";
import {
  getTodayDateString,
  COMMON_FREQUENCIES,
  STANDARD_PRESCRIBERS,
} from "@/lib/pharmacy-utils";

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

  // Form state
  const [patientName, setPatientName] = React.useState("");
  const [patientId, setPatientId] = React.useState("");
  const [patientContact, setPatientContact] = React.useState("");
  const [date, setDate] = React.useState(getTodayDateString());
  const [prescriber, setPrescriber] = React.useState("");
  const [selectedMedicineId, setSelectedMedicineId] = React.useState("");
  const [customMedicineName, setCustomMedicineName] = React.useState("");
  const [dosage, setDosage] = React.useState("");
  const [frequency, setFrequency] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [quantityToDispense, setQuantityToDispense] = React.useState<number | "">(21);
  const [status, setStatus] = React.useState<PrescriptionStatus>("Active");
  const [notes, setNotes] = React.useState("");

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (open) {
      if (prescriptionToEdit) {
        setPatientName(prescriptionToEdit.patientName || "");
        setPatientId(prescriptionToEdit.patientId || "");
        setPatientContact(prescriptionToEdit.patientContact || "");
        setDate(prescriptionToEdit.date || getTodayDateString());
        setPrescriber(prescriptionToEdit.prescriber || "");
        setSelectedMedicineId(prescriptionToEdit.medicineId || "");
        setCustomMedicineName(prescriptionToEdit.medicine || "");
        setDosage(prescriptionToEdit.dosage || "");
        setFrequency(prescriptionToEdit.frequency || "");
        setDuration(prescriptionToEdit.duration || "");
        setQuantityToDispense(prescriptionToEdit.quantityToDispense ?? 21);
        setStatus(prescriptionToEdit.status || "Active");
        setNotes(prescriptionToEdit.notes || "");
      } else {
        setPatientName("");
        setPatientId("");
        setPatientContact("");
        setDate(getTodayDateString());
        setPrescriber("");
        setSelectedMedicineId("");
        setCustomMedicineName("");
        setDosage("500 mg");
        setFrequency("Three times daily (TID) - Every 8 hrs");
        setDuration("7 days");
        setQuantityToDispense(21);
        setStatus("Active");
        setNotes("");
      }
      setErrors({});
    }
  }, [open, prescriptionToEdit]);

  // When picking a medicine from inventory
  const handleMedicineSelect = (medId: string) => {
    setSelectedMedicineId(medId);
    if (medId === "custom" || !medId) {
      return;
    }
    const found = availableMedicines.find((m) => m.id === medId);
    if (found) {
      setCustomMedicineName(found.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!patientName.trim()) {
      newErrors.patientName = "Patient name is required";
    }
    if (!date.trim()) {
      newErrors.date = "Prescription date is required";
    }
    if (!prescriber.trim()) {
      newErrors.prescriber = "Prescriber is required";
    }

    const finalMedicine = customMedicineName.trim();
    if (!finalMedicine) {
      newErrors.medicine = "Medicine name is required";
    }
    if (!dosage.trim()) {
      newErrors.dosage = "Dosage is required (e.g. 500 mg)";
    }
    if (!frequency.trim()) {
      newErrors.frequency = "Frequency is required (e.g. TID after meals)";
    }
    if (!duration.trim()) {
      newErrors.duration = "Duration is required (e.g. 7 days)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: Prescription = {
      id: prescriptionToEdit ? prescriptionToEdit.id : `RX-${Date.now().toString().slice(-6)}`,
      patientName: patientName.trim(),
      patientId: patientId.trim() || undefined,
      patientContact: patientContact.trim() || undefined,
      date: date.trim(),
      prescriber: prescriber.trim(),
      medicine: finalMedicine,
      medicineId: selectedMedicineId && selectedMedicineId !== "custom" ? selectedMedicineId : undefined,
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      duration: duration.trim(),
      quantityToDispense: quantityToDispense !== "" ? Number(quantityToDispense) : undefined,
      status,
      notes: notes.trim() || undefined,
      createdAt: prescriptionToEdit ? prescriptionToEdit.createdAt : getTodayDateString(),
    };

    onSave(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-xl">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 border border-teal-200 text-teal-700">
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>
                {isEditing ? "Edit Prescription" : "Issue New Prescription"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? `Update drug orders for ${prescriptionToEdit?.patientName}`
                  : "Prescribe medicines and specify dosage, frequency, and duration"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          {/* Patient Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-teal-700" />
              Patient &amp; Prescriber Information
            </h4>

            <div className="space-y-1">
              <Label htmlFor="rxPatient" className="text-xs">
                Patient Full Name <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="rxPatient"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Maria Santos"
                className={`text-xs h-9 ${errors.patientName ? "border-rose-500" : ""}`}
              />
              {errors.patientName && (
                <p className="text-[11px] text-rose-600">{errors.patientName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="rxPatientId" className="text-xs">
                  Patient ID (Optional)
                </Label>
                <Input
                  id="rxPatientId"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="e.g. PAT-2026-001"
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="rxDate" className="text-xs">
                  Prescription Date <span className="text-rose-600">*</span>
                </Label>
                <Input
                  id="rxDate"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`text-xs h-9 ${errors.date ? "border-rose-500" : ""}`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="rxPrescriber" className="text-xs">
                Attending Prescriber / Health Worker <span className="text-rose-600">*</span>
              </Label>
              <Select
                id="rxPrescriber"
                value={prescriber}
                onChange={(e) => setPrescriber(e.target.value)}
                className={`text-xs h-9 ${errors.prescriber ? "border-rose-500" : ""}`}
              >
                <option value="">-- Select Prescriber --</option>
                {STANDARD_PRESCRIBERS.map((doc) => (
                  <option key={doc} value={doc}>
                    {doc}
                  </option>
                ))}
              </Select>
              {errors.prescriber && (
                <p className="text-[11px] text-rose-600">{errors.prescriber}</p>
              )}
            </div>
          </div>

          {/* Medication & Regimen */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Pill className="h-3.5 w-3.5 text-teal-700" />
              Medication &amp; Instructions
            </h4>

            {/* Inventory Selector if medicines exist */}
            {availableMedicines.length > 0 && (
              <div className="space-y-1">
                <Label htmlFor="rxInventorySelect" className="text-xs">
                  Pick from Registered Pharmacy Inventory
                </Label>
                <Select
                  id="rxInventorySelect"
                  value={selectedMedicineId}
                  onChange={(e) => handleMedicineSelect(e.target.value)}
                  className="text-xs h-9"
                >
                  <option value="">-- Choose from available inventory --</option>
                  {availableMedicines.map((med) => (
                    <option key={med.id} value={med.id}>
                      {med.name} ({med.availableQuantity} {med.unit} available)
                    </option>
                  ))}
                  <option value="custom">-- Enter custom drug name below --</option>
                </Select>
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="rxMedName" className="text-xs">
                Medicine Name &amp; Strength <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="rxMedName"
                value={customMedicineName}
                onChange={(e) => setCustomMedicineName(e.target.value)}
                placeholder="e.g. Amoxicillin 500mg Capsule, Paracetamol 500mg Tablet"
                className={`text-xs h-9 ${errors.medicine ? "border-rose-500" : ""}`}
              />
              {errors.medicine && (
                <p className="text-[11px] text-rose-600">{errors.medicine}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="rxDosage" className="text-xs">
                  Dosage <span className="text-rose-600">*</span>
                </Label>
                <Input
                  id="rxDosage"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g. 500 mg, 10 ml"
                  className={`text-xs h-9 ${errors.dosage ? "border-rose-500" : ""}`}
                />
                {errors.dosage && (
                  <p className="text-[11px] text-rose-600">{errors.dosage}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="rxDuration" className="text-xs">
                  Duration <span className="text-rose-600">*</span>
                </Label>
                <Input
                  id="rxDuration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 7 days, 14 days"
                  className={`text-xs h-9 ${errors.duration ? "border-rose-500" : ""}`}
                />
                {errors.duration && (
                  <p className="text-[11px] text-rose-600">{errors.duration}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="rxQty" className="text-xs">
                  Quantity
                </Label>
                <Input
                  id="rxQty"
                  type="number"
                  min="1"
                  value={quantityToDispense}
                  onChange={(e) =>
                    setQuantityToDispense(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="e.g. 21"
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="rxFreq" className="text-xs">
                Frequency &amp; Schedule <span className="text-rose-600">*</span>
              </Label>
              <Select
                id="rxFreq"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className={`text-xs h-9 ${errors.frequency ? "border-rose-500" : ""}`}
              >
                <option value="">-- Select Frequency --</option>
                {COMMON_FREQUENCIES.map((freq) => (
                  <option key={freq} value={freq}>
                    {freq}
                  </option>
                ))}
              </Select>
              {errors.frequency && (
                <p className="text-[11px] text-rose-600">{errors.frequency}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="rxStatus" className="text-xs">
                Prescription Status
              </Label>
              <Select
                id="rxStatus"
                value={status}
                onChange={(e) => setStatus(e.target.value as PrescriptionStatus)}
                className="text-xs h-9"
              >
                <option value="Active">Active (Pending Dispense)</option>
                <option value="Dispensed">Dispensed (Released to Patient)</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <Label htmlFor="rxNotes" className="text-xs">
              Special Instructions / Warnings (Optional)
            </Label>
            <Textarea
              id="rxNotes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Complete full antibiotic course; drink plenty of water; avoid taking with antacids"
              className="text-xs"
            />
          </div>

          <DialogFooter className="pt-2 border-t border-slate-100">
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
              className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs"
            >
              {isEditing ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Issue Prescription
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
