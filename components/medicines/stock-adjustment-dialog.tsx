import * as React from "react";
import {
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Calendar,
  AlertTriangle,
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
import { Medicine } from "@/types/pharmacy";
import { getTodayDateString } from "@/lib/pharmacy-utils";

interface StockAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicine: Medicine | null;
  onAdjustStock: (
    medicineId: string,
    adjustment: {
      date: string;
      type: "Stock In" | "Stock Out" | "Adjustment";
      quantity: number;
      reason: string;
      adjustedBy: string;
    }
  ) => void;
}

export function StockAdjustmentDialog({
  open,
  onOpenChange,
  medicine,
  onAdjustStock,
}: StockAdjustmentDialogProps) {
  const [type, setType] = React.useState<"Stock In" | "Stock Out">("Stock In");
  const [quantity, setQuantity] = React.useState<number | "">(10);
  const [reason, setReason] = React.useState("");
  const [adjustedBy, setAdjustedBy] = React.useState("Barangay Health Center Staff");
  const [date, setDate] = React.useState(getTodayDateString());
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setType("Stock In");
      setQuantity(10);
      setReason("Regular LGU/DOH Buffer Resupply");
      setAdjustedBy("Barangay Health Center Staff");
      setDate(getTodayDateString());
      setError("");
    }
  }, [open]);

  if (!medicine) return null;

  const currentQty = medicine.availableQuantity;
  const numQty = Number(quantity) || 0;
  const projectedQty =
    type === "Stock In" ? currentQty + numQty : Math.max(0, currentQty - numQty);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!quantity || numQty <= 0) {
      setError("Please enter a valid positive quantity to adjust");
      return;
    }
    if (!reason.trim()) {
      setError("Please provide a reason for this stock adjustment");
      return;
    }
    if (!adjustedBy.trim()) {
      setError("Please specify the staff member recording this adjustment");
      return;
    }

    if (type === "Stock Out" && numQty > currentQty) {
      setError(
        `Cannot remove ${numQty} ${medicine.unit}. Available stock is only ${currentQty} ${medicine.unit}.`
      );
      return;
    }

    onAdjustStock(medicine.id, {
      date,
      type,
      quantity: numQty,
      reason: reason.trim(),
      adjustedBy: adjustedBy.trim(),
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-md">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 border border-teal-200 text-teal-700">
              <ArrowUpDown className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>Adjust Medicine Inventory Stock</DialogTitle>
              <DialogDescription>
                {medicine.name} ({medicine.availableQuantity} {medicine.unit})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          {/* Stock Level Preview Card */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Current Stock</span>
              <span className="font-bold text-slate-800 text-sm">
                {currentQty} {medicine.unit}
              </span>
            </div>
            <div className="flex items-center justify-center">
              {type === "Stock In" ? (
                <span className="text-emerald-700 font-bold text-xs flex items-center gap-0.5">
                  <TrendingUp className="h-3.5 w-3.5" />+{numQty}
                </span>
              ) : (
                <span className="text-rose-700 font-bold text-xs flex items-center gap-0.5">
                  <TrendingDown className="h-3.5 w-3.5" />-{numQty}
                </span>
              )}
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">New Projected</span>
              <span className="font-bold text-teal-900 text-sm">
                {projectedQty} {medicine.unit}
              </span>
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded border border-rose-200 bg-rose-50 text-rose-700 text-xs flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Adjustment Type & Quantity */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="adjType" className="text-xs">
                Adjustment Type
              </Label>
              <Select
                id="adjType"
                value={type}
                onChange={(e) => setType(e.target.value as "Stock In" | "Stock Out")}
                className="text-xs h-9"
              >
                <option value="Stock In">Stock In (Delivery/Restock)</option>
                <option value="Stock Out">Stock Out (Dispense/Loss/Expired)</option>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="adjQty" className="text-xs">
                Quantity ({medicine.unit})
              </Label>
              <Input
                id="adjQty"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="text-xs h-9"
              />
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-1">
            <Label htmlFor="adjReason" className="text-xs">
              Reason / Remarks <span className="text-rose-600">*</span>
            </Label>
            <Input
              id="adjReason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Monthly DOH allocation, Damaged during transit, Inventory count"
              className="text-xs h-9"
            />
          </div>

          {/* Staff & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="adjStaff" className="text-xs">
                Staff / Health Worker
              </Label>
              <Input
                id="adjStaff"
                value={adjustedBy}
                onChange={(e) => setAdjustedBy(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="adjDate" className="text-xs">
                Adjustment Date
              </Label>
              <Input
                id="adjDate"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-xs h-9"
              />
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
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              Confirm Stock Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
