import * as React from "react";
import {
  Package,
  Plus,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Tag,
  Layers,
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
import { Medicine, MedicineCategory } from "@/types/pharmacy";
import {
  MEDICINE_CATEGORIES,
  MEDICINE_UNITS,
  COMMON_DOSAGE_FORMS,
  getTodayDateString,
  computeMedicineStatus,
} from "@/lib/pharmacy-utils";

interface AddMedicineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (medicine: Medicine) => void;
  medicineToEdit?: Medicine | null;
}

export function AddMedicineDialog({
  open,
  onOpenChange,
  onSave,
  medicineToEdit,
}: AddMedicineDialogProps) {
  const isEditing = Boolean(medicineToEdit);

  // Form states
  const [name, setName] = React.useState("");
  const [brandName, setBrandName] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [availableQuantity, setAvailableQuantity] = React.useState<number | "">(0);
  const [unit, setUnit] = React.useState("Tablets");
  const [expirationDate, setExpirationDate] = React.useState("");
  const [reorderLevel, setReorderLevel] = React.useState<number | "">(20);
  const [dosageForm, setDosageForm] = React.useState("");
  const [batchNumber, setBatchNumber] = React.useState("");
  const [storageLocation, setStorageLocation] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (open) {
      if (medicineToEdit) {
        setName(medicineToEdit.name || "");
        setBrandName(medicineToEdit.brandName || "");
        setCategory(medicineToEdit.category || "");
        setAvailableQuantity(medicineToEdit.availableQuantity ?? 0);
        setUnit(medicineToEdit.unit || "Tablets");
        setExpirationDate(medicineToEdit.expirationDate || "");
        setReorderLevel(medicineToEdit.reorderLevel ?? 20);
        setDosageForm(medicineToEdit.dosageForm || "");
        setBatchNumber(medicineToEdit.batchNumber || "");
        setStorageLocation(medicineToEdit.storageLocation || "");
        setNotes(medicineToEdit.notes || "");
      } else {
        setName("");
        setBrandName("");
        setCategory("");
        setAvailableQuantity(0);
        setUnit("Tablets");
        setExpirationDate("");
        setReorderLevel(20);
        setDosageForm("");
        setBatchNumber("");
        setStorageLocation("");
        setNotes("");
      }
      setErrors({});
    }
  }, [open, medicineToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Generic / Medicine name is required";
    }
    if (!category.trim()) {
      newErrors.category = "Category is required";
    }
    if (availableQuantity === "" || Number(availableQuantity) < 0) {
      newErrors.availableQuantity = "Valid quantity is required (>= 0)";
    }
    if (!unit.trim()) {
      newErrors.unit = "Unit of measurement is required";
    }
    if (!expirationDate.trim()) {
      newErrors.expirationDate = "Expiration date is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const qty = Number(availableQuantity) || 0;
    const threshold = Number(reorderLevel) || 20;

    const payload: Medicine = {
      id: medicineToEdit ? medicineToEdit.id : `MED-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      brandName: brandName.trim() || undefined,
      category: category.trim(),
      availableQuantity: qty,
      unit: unit.trim(),
      expirationDate: expirationDate.trim(),
      status: computeMedicineStatus(qty, expirationDate.trim(), threshold),
      reorderLevel: threshold,
      dosageForm: dosageForm.trim() || undefined,
      batchNumber: batchNumber.trim() || undefined,
      storageLocation: storageLocation.trim() || undefined,
      notes: notes.trim() || undefined,
      stockHistory: medicineToEdit ? medicineToEdit.stockHistory : undefined,
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
              <Package className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>
                {isEditing ? "Edit Medicine Item" : "Add Medicine to Inventory"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? `Update pharmacy specifications for ${medicineToEdit?.name}`
                  : "Register a generic drug, formulation, or health center medical supply"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          {/* Drug Identification */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="medName" className="text-xs">
                Generic Name &amp; Strength <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="medName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amoxicillin 500mg, Paracetamol 250mg/5ml"
                className={`text-xs h-9 ${errors.name ? "border-rose-500" : ""}`}
              />
              {errors.name && (
                <p className="text-[11px] text-rose-600">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="medBrand" className="text-xs">
                  Brand Name (Optional)
                </Label>
                <Input
                  id="medBrand"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Biogesic, Himox, Alaxan"
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="medCategory" className="text-xs">
                  Category <span className="text-rose-600">*</span>
                </Label>
                <Select
                  id="medCategory"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`text-xs h-9 ${errors.category ? "border-rose-500" : ""}`}
                >
                  <option value="">-- Select Category --</option>
                  {MEDICINE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
                {errors.category && (
                  <p className="text-[11px] text-rose-600">{errors.category}</p>
                )}
              </div>
            </div>
          </div>

          {/* Stock Levels & Unit */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="medQty" className="text-xs">
                  Initial / Available Qty <span className="text-rose-600">*</span>
                </Label>
                <Input
                  id="medQty"
                  type="number"
                  min="0"
                  value={availableQuantity}
                  onChange={(e) =>
                    setAvailableQuantity(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className={`text-xs h-9 ${errors.availableQuantity ? "border-rose-500" : ""}`}
                />
                {errors.availableQuantity && (
                  <p className="text-[11px] text-rose-600">{errors.availableQuantity}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="medUnit" className="text-xs">
                  Packaging Unit <span className="text-rose-600">*</span>
                </Label>
                <Select
                  id="medUnit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="text-xs h-9"
                >
                  {MEDICINE_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="medReorder" className="text-xs">
                  Low Stock Threshold
                </Label>
                <Input
                  id="medReorder"
                  type="number"
                  min="1"
                  value={reorderLevel}
                  onChange={(e) =>
                    setReorderLevel(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="text-xs h-9"
                  placeholder="Default 20"
                />
              </div>
            </div>
          </div>

          {/* Expiration, Dosage Form & Batch */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="medExp" className="text-xs">
                  Expiration Date <span className="text-rose-600">*</span>
                </Label>
                <Input
                  id="medExp"
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className={`text-xs h-9 ${errors.expirationDate ? "border-rose-500" : ""}`}
                />
                {errors.expirationDate && (
                  <p className="text-[11px] text-rose-600">{errors.expirationDate}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="medForm" className="text-xs">
                  Dosage Form
                </Label>
                <Select
                  id="medForm"
                  value={dosageForm}
                  onChange={(e) => setDosageForm(e.target.value)}
                  className="text-xs h-9"
                >
                  <option value="">-- Optional Form --</option>
                  {COMMON_DOSAGE_FORMS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="medBatch" className="text-xs">
                  Batch / Lot No.
                </Label>
                <Input
                  id="medBatch"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  placeholder="e.g. LOT-2026-X8"
                  className="text-xs h-9 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="medStorage" className="text-xs">
                  Storage Location / Shelf
                </Label>
                <Input
                  id="medStorage"
                  value={storageLocation}
                  onChange={(e) => setStorageLocation(e.target.value)}
                  placeholder="e.g. Cabinet 2, Shelf B, Cold Storage"
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="medNotes" className="text-xs">
                  Clinical / Storage Remarks
                </Label>
                <Input
                  id="medNotes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Protect from light, DOH Buffer stock"
                  className="text-xs h-9"
                />
              </div>
            </div>
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
                  Add Medicine
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
