import * as React from "react";
import { CalendarCheck, Plus, CheckCircle2 } from "lucide-react";
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
import { PrenatalVisit, Trimester, MaternalRecord } from "@/types/maternal-care";

interface AddPrenatalVisitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: MaternalRecord | null;
  onAddVisit: (visit: PrenatalVisit) => void;
}

export function AddPrenatalVisitDialog({
  open,
  onOpenChange,
  record,
  onAddVisit,
}: AddPrenatalVisitDialogProps) {
  const [visitDate, setVisitDate] = React.useState("");
  const [trimester, setTrimester] = React.useState<Trimester>("2nd Trimester");
  const [assignedProvider, setAssignedProvider] = React.useState("");
  const [visitNotes, setVisitNotes] = React.useState("");
  const [followUpDate, setFollowUpDate] = React.useState("");
  const [weightKg, setWeightKg] = React.useState("");
  const [bloodPressure, setBloodPressure] = React.useState("");

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  React.useEffect(() => {
    if (open) {
      const todayStr = new Date().toISOString().split("T")[0];
      setVisitDate(todayStr);
      setTrimester("2nd Trimester");
      setAssignedProvider(record?.assignedBhw || "");
      setVisitNotes("");
      setFollowUpDate("");
      setWeightKg("");
      setBloodPressure("");
      setErrors({});
    }
  }, [open, record]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { [key: string]: string } = {};

    if (!visitDate) errs.visitDate = "Visit date is required";
    if (!assignedProvider.trim()) errs.assignedProvider = "Provider/BHW is required";
    if (!visitNotes.trim()) errs.visitNotes = "Visit notes/observations are required";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const newVisit: PrenatalVisit = {
      id: `VIS-${Date.now()}`,
      visitDate,
      trimester,
      assignedProvider: assignedProvider.trim(),
      visitNotes: visitNotes.trim(),
      followUpDate: followUpDate || undefined,
      weightKg: weightKg ? parseFloat(weightKg) : undefined,
      bloodPressure: bloodPressure.trim() || undefined,
    };

    onAddVisit(newVisit);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-lg">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>Add Prenatal Visit</DialogTitle>
              <DialogDescription>
                Record maternal checkup for {record?.patientName || "Patient"} ({record?.id})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="visitDate" className="text-xs">
                Visit Date <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="visitDate"
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className={`text-xs h-9 ${errors.visitDate ? "border-rose-500" : ""}`}
              />
              {errors.visitDate && (
                <p className="text-[10px] text-rose-600">{errors.visitDate}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="trimester" className="text-xs">
                Trimester <span className="text-rose-600">*</span>
              </Label>
              <Select
                id="trimester"
                value={trimester}
                onChange={(e) => setTrimester(e.target.value as Trimester)}
                className="text-xs h-9"
              >
                <option value="1st Trimester">1st Trimester</option>
                <option value="2nd Trimester">2nd Trimester</option>
                <option value="3rd Trimester">3rd Trimester</option>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="assignedProvider" className="text-xs">
              Attending Provider / BHW <span className="text-rose-600">*</span>
            </Label>
            <Input
              id="assignedProvider"
              value={assignedProvider}
              onChange={(e) => setAssignedProvider(e.target.value)}
              placeholder="e.g. BHW Elena Gomez / Midwife"
              className={`text-xs h-9 ${errors.assignedProvider ? "border-rose-500" : ""}`}
            />
            {errors.assignedProvider && (
              <p className="text-[10px] text-rose-600">{errors.assignedProvider}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="weightKg" className="text-xs">
                Weight (kg) (Optional)
              </Label>
              <Input
                id="weightKg"
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="e.g. 54.5"
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="bloodPressure" className="text-xs">
                Blood Pressure (Optional)
              </Label>
              <Input
                id="bloodPressure"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                placeholder="e.g. 110/70"
                className="text-xs h-9"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="visitNotes" className="text-xs">
              Visit Information &amp; Clinical Notes <span className="text-rose-600">*</span>
            </Label>
            <Textarea
              id="visitNotes"
              rows={3}
              value={visitNotes}
              onChange={(e) => setVisitNotes(e.target.value)}
              placeholder="Fetal heartbeat, fundic height, complaints, micronutrients administered, advice given..."
              className={`text-xs ${errors.visitNotes ? "border-rose-500" : ""}`}
            />
            {errors.visitNotes && (
              <p className="text-[10px] text-rose-600">{errors.visitNotes}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="followUpDate" className="text-xs">
              Recommended Follow-up Date (Optional)
            </Label>
            <Input
              id="followUpDate"
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <DialogFooter className="pt-2">
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
              className="bg-teal-700 hover:bg-teal-800 text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Prenatal Visit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
