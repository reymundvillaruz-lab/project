import * as React from "react";
import {
  Package,
  Search,
  Filter,
  X,
  Plus,
  Eye,
  Edit3,
  ArrowUpDown,
  MoreVertical,
  Calendar,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Medicine, MedicineStatus } from "@/types/pharmacy";
import { MedicineStatusBadge } from "./medicine-status-badge";
import { MEDICINE_CATEGORIES, getTodayDateString } from "@/lib/pharmacy-utils";

interface MedicineListProps {
  medicines: Medicine[];
  onViewDetails: (medicine: Medicine) => void;
  onAdjustStock: (medicine: Medicine) => void;
  onEditMedicine: (medicine: Medicine) => void;
  onDeleteMedicine: (medicineId: string) => void;
  onNewMedicine: () => void;
}

export function MedicineList({
  medicines,
  onViewDetails,
  onAdjustStock,
  onEditMedicine,
  onDeleteMedicine,
  onNewMedicine,
}: MedicineListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");

  const todayStr = getTodayDateString();

  const filteredMedicines = React.useMemo(() => {
    return medicines.filter((med) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = med.name.toLowerCase().includes(q);
        const matchesBrand = med.brandName ? med.brandName.toLowerCase().includes(q) : false;
        const matchesCat = med.category.toLowerCase().includes(q);
        const matchesBatch = med.batchNumber ? med.batchNumber.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesBrand && !matchesCat && !matchesBatch) {
          return false;
        }
      }

      // Status
      if (statusFilter !== "all" && med.status !== statusFilter) {
        return false;
      }

      // Category
      if (categoryFilter !== "all" && med.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [medicines, searchQuery, statusFilter, categoryFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== "" || statusFilter !== "all" || categoryFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  return (
    <Card className="border border-slate-200 shadow-xs">
      <CardHeader className="p-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2.5">
            {/* Search */}
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search generic name, brand, or batch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs h-8.5"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="w-40">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs h-8.5"
              >
                <option value="all">Status: All</option>
                <option value="Available">Available</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Expired">Expired</option>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="w-48">
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs h-8.5"
              >
                <option value="all">Category: All</option>
                {MEDICINE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8.5 text-xs text-slate-500 hover:text-slate-900 px-2"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Clear
              </Button>
            )}
          </div>

          <Button
            size="sm"
            onClick={onNewMedicine}
            className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs h-8.5 gap-1.5 shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Medicine Item
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {medicines.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Package}
              title="Medicine Inventory is Empty"
              description="No medicines or medical supplies have been registered in the pharmacy inventory yet. Click below to add your first medicine stock."
              action={{
                label: "+ Add First Medicine Stock",
                onClick: onNewMedicine,
              }}
            />
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Search}
              title="No Matching Medicines Found"
              description="No inventory items match your current search and filter settings. Try adjusting or clearing your filters."
              action={{
                label: "Clear All Filters",
                onClick: clearFilters,
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="text-xs">
              <TableHeader className="bg-slate-50 border-y border-slate-200">
                <TableRow>
                  <TableHead className="w-[260px] font-semibold text-slate-700">
                    Medicine (Generic &amp; Brand)
                  </TableHead>
                  <TableHead className="w-[180px] font-semibold text-slate-700">
                    Category
                  </TableHead>
                  <TableHead className="w-[140px] font-semibold text-slate-700 text-right">
                    Available Quantity
                  </TableHead>
                  <TableHead className="w-[110px] font-semibold text-slate-700">
                    Unit
                  </TableHead>
                  <TableHead className="w-[130px] font-semibold text-slate-700">
                    Expiration Date
                  </TableHead>
                  <TableHead className="w-[130px] font-semibold text-slate-700">
                    Status
                  </TableHead>
                  <TableHead className="w-[80px] text-right font-semibold text-slate-700">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedicines.map((med) => {
                  const isExp = med.expirationDate && med.expirationDate < todayStr;

                  return (
                    <TableRow key={med.id} className="hover:bg-slate-50/70">
                      {/* Medicine */}
                      <TableCell>
                        <div className="space-y-0.5">
                          <button
                            onClick={() => onViewDetails(med)}
                            className="font-semibold text-slate-900 hover:text-teal-700 hover:underline text-left block"
                          >
                            {med.name}
                          </button>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            {med.brandName && (
                              <>
                                <span className="font-medium text-slate-700">
                                  {med.brandName}
                                </span>
                                <span>&bull;</span>
                              </>
                            )}
                            <span className="font-mono">{med.id}</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <span className="font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block">
                          {med.category}
                        </span>
                      </TableCell>

                      {/* Available Quantity */}
                      <TableCell className="text-right">
                        <span
                          className={`font-bold font-mono text-sm ${
                            med.availableQuantity <= 0
                              ? "text-rose-600"
                              : med.availableQuantity <= (med.reorderLevel || 20)
                              ? "text-amber-700"
                              : "text-slate-900"
                          }`}
                        >
                          {med.availableQuantity}
                        </span>
                      </TableCell>

                      {/* Unit */}
                      <TableCell className="text-slate-600 font-medium">
                        {med.unit}
                      </TableCell>

                      {/* Expiration Date */}
                      <TableCell>
                        <span
                          className={`font-mono font-medium ${
                            isExp ? "text-rose-700 font-bold" : "text-slate-800"
                          }`}
                        >
                          {med.expirationDate}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <MedicineStatusBadge status={med.status} />
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-slate-900"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs">
                            <DropdownMenuItem
                              onClick={() => onViewDetails(med)}
                              className="text-xs gap-1.5"
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-500" />
                              View Details &amp; History
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => onAdjustStock(med)}
                              className="text-xs gap-1.5 text-teal-800"
                            >
                              <ArrowUpDown className="h-3.5 w-3.5 text-teal-600" />
                              Adjust Stock Level
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => onEditMedicine(med)}
                              className="text-xs gap-1.5"
                            >
                              <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                              Edit Item
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => onDeleteMedicine(med.id)}
                              className="text-xs gap-1.5 text-rose-600 focus:text-rose-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Remove from Inventory
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
