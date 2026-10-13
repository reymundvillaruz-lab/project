import * as React from "react";
import {
  Package,
  Calendar,
  AlertTriangle,
  ArrowUpDown,
  Edit3,
  Trash2,
  Tag,
  MapPin,
  Clock,
  Layers,
  History,
  CheckCircle2,
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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Medicine } from "@/types/pharmacy";
import { MedicineStatusBadge } from "./medicine-status-badge";
import { getTodayDateString } from "@/lib/pharmacy-utils";

interface MedicineDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicine: Medicine | null;
  onOpenAdjustStock: (medicine: Medicine) => void;
  onOpenEdit: (medicine: Medicine) => void;
  onDelete: (medicineId: string) => void;
}

export function MedicineDetailDialog({
  open,
  onOpenChange,
  medicine,
  onOpenAdjustStock,
  onOpenEdit,
  onDelete,
}: MedicineDetailDialogProps) {
  if (!medicine) return null;

  const todayStr = getTodayDateString();
  const isExpired = medicine.expirationDate && medicine.expirationDate < todayStr;
  const isLowStock =
    medicine.availableQuantity > 0 &&
    medicine.availableQuantity <= (medicine.reorderLevel || 20);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-2xl">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 border border-teal-200 text-teal-700">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <span>{medicine.name}</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-normal">
                    {medicine.id}
                  </span>
                </DialogTitle>
                <DialogDescription>
                  {medicine.brandName ? `Brand: ${medicine.brandName} • ` : ""}
                  {medicine.category}
                </DialogDescription>
              </div>
            </div>
            <MedicineStatusBadge status={medicine.status} />
          </div>
        </DialogHeader>

        <div className="px-5 py-4 space-y-4 text-xs">
          {/* Stock Metrics Card */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3.5 grid grid-cols-4 gap-3 text-center">
            <div>
              <span className="text-[11px] text-slate-500 block">Available Stock</span>
              <p className="text-xl font-bold text-slate-900 mt-0.5">
                {medicine.availableQuantity}
              </p>
              <span className="text-[11px] text-slate-500">{medicine.unit}</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 block">Expiration Date</span>
              <p
                className={`text-sm font-semibold mt-1.5 font-mono ${
                  isExpired ? "text-rose-700 font-bold" : "text-slate-800"
                }`}
              >
                {medicine.expirationDate}
              </p>
              <span className="text-[10px] text-slate-400">
                {isExpired ? "EXPIRED" : "Valid shelf life"}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 block">Reorder Threshold</span>
              <p className="text-sm font-bold text-slate-800 mt-1.5">
                {medicine.reorderLevel || 20} {medicine.unit}
              </p>
              <span className="text-[10px] text-slate-400">Min. safety level</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 block">Storage Location</span>
              <p className="text-xs font-semibold text-teal-900 mt-1.5 truncate">
                {medicine.storageLocation || "General Pharmacy Shelf"}
              </p>
              <span className="text-[10px] text-slate-400">Station Cabinet</span>
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-2">
            <div className="grid grid-cols-2 gap-3 pb-2 border-b border-slate-100">
              <div>
                <span className="text-slate-500 block text-[11px]">Category</span>
                <span className="font-semibold text-slate-800">{medicine.category}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Dosage Form</span>
                <span className="font-semibold text-slate-800">
                  {medicine.dosageForm || "Standard solid/liquid formulation"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-2 border-b border-slate-100">
              <div>
                <span className="text-slate-500 block text-[11px]">Batch / Lot Number</span>
                <span className="font-mono font-medium text-slate-800">
                  {medicine.batchNumber || "Not recorded"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Storage / Remarks</span>
                <span className="text-slate-700">
                  {medicine.notes || "Standard room temperature storage."}
                </span>
              </div>
            </div>
          </div>

          {/* Stock Adjustment History Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5 text-xs">
                <History className="h-3.5 w-3.5 text-teal-700" />
                Stock Log &amp; Inventory History ({medicine.stockHistory?.length || 0})
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenAdjustStock(medicine)}
                className="h-7 text-xs gap-1 border-teal-300 text-teal-800 hover:bg-teal-50"
              >
                <ArrowUpDown className="h-3 w-3" />
                Adjust Stock
              </Button>
            </div>

            {(!medicine.stockHistory || medicine.stockHistory.length === 0) ? (
              <div className="py-4 text-center text-slate-400 border rounded-lg bg-slate-50/50">
                No stock adjustments logged yet.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-md overflow-hidden max-h-[160px] overflow-y-auto">
                <Table className="text-xs">
                  <TableHeader className="bg-slate-50 sticky top-0">
                    <TableRow>
                      <TableHead className="w-[85px]">Date</TableHead>
                      <TableHead className="w-[80px]">Type</TableHead>
                      <TableHead className="w-[70px]">Qty</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead className="w-[110px]">Staff</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicine.stockHistory.map((adj) => (
                      <TableRow key={adj.id}>
                        <TableCell className="font-mono">{adj.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant={adj.type === "Stock In" ? "success" : "secondary"}
                            className="text-[10px] px-1.5 py-0"
                          >
                            {adj.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold font-mono">
                          {adj.type === "Stock In" ? `+${adj.quantity}` : `-${adj.quantity}`}
                        </TableCell>
                        <TableCell className="text-slate-600 truncate max-w-xs">
                          {adj.reason}
                        </TableCell>
                        <TableCell className="text-slate-500 truncate">
                          {adj.adjustedBy}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-5 py-3 border-t border-slate-100 flex items-center justify-between sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onDelete(medicine.id);
              onOpenChange(false);
            }}
            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Item
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Close
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onOpenEdit(medicine);
              }}
              className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs gap-1.5"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit Medicine
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
