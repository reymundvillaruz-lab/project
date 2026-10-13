import * as React from "react";
import { CalendarClock, CheckCircle2 } from "lucide-react";
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
import { FPClient, FPFollowUp, FPFollowUpStatus } from "@/types/family-planning";
import { computeFollowUpStatus, getTodayDateString } from "@/lib/family-planning-utils";

interface ScheduleFPFollowUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: FPClient | null;
  followUpToEdit?: FPFollowUp | null;
  onSaveFollowUp: (followUp: FPFollowUp) => void;
}

export function ScheduleFPFollowUpDialog({
  open,
  onOpenChange,
  client,
  followUpToEdit,
  onSaveFollowUp,
}: ScheduleFPFollowUpDialogProps) {
  const isEditing = Boolean(followUpToEdit);

  const [nextServiceDate, setNextServiceDate] = React.useState("");
  const [method, setMethod] = React.useState("");
  const [provider, setProvider] = React.useState("");
  const [status, setStatus] = React.useState<FPFollowUpStatus>("Scheduled");
  const [notes, setNotes] = React.useState("");

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (open) {
      if (followUpToEdit) {
        setNextServiceDate(followUpToEdit.nextServiceDate);
        setMethod(followUpToEdit.method);
        setProvider(followUpToEdit.provider);
        setStatus(followUpToEdit.status);
        setNotes(followUpToEdit.notes || "");
      } else {
        setNextServiceDate("");
        setMethod(client?.currentMethod || "");
        setProvider(client?.provider || "");
        setStatus("Scheduled");
        setNotes("");
      }
      setErrors({});
    }
  }, [open, followUpToEdit, client]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNextServiceDate(val);
    // Auto-update status if not explicitly Completed or Cancelled
    if (status !== "Completed" && status !== "Cancelled") {
      setStatus(computeFollowUpStatus(val));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!nextServiceDate && status !== "Cancelled" && status !== "Completed") {
      errs.nextServiceDate = "Follow-up date is required";
    }
    if (!method.trim()) errs.method = "Method is required";
    if (!provider.trim()) errs.provider = "Provider is required";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // Determine final status
    const finalStatus =
      status === "Completed" || status === "Cancelled"
        ? status
        : computeFollowUpStatus(nextServiceDate);

    const payload: FPFollowUp = {
      id: followUpToEdit?.id || `FU-${Date.now()}`,
      clientId: client?.id || "FP-000",
      clientName: client?.fullName || "Client",
      method: method.trim(),
      lastServiceDate: client?.lastServiceDate || getTodayDateString(),
      nextServiceDate,
      provider: provider.trim(),
      status: finalStatus,
      notes: notes.trim() || undefined,
    };

    onSaveFollowUp(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-lg">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 border border-teal-200 text-teal-700">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>
                {isEditing ? "Update Follow-up Schedule" : "Schedule Client Follow-up"}
              </DialogTitle>
              <DialogDescription>
                {client?.fullName} ({client?.id})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="fuDate" className="text-xs">
                Next Follow-up Date <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="fuDate"
                type="date"
                value={nextServiceDate}
                onChange={handleDateChange}
                className={`text-xs h-9 ${errors.nextServiceDate ? "border-rose-500" : ""}`}
              />
              {errors.nextServiceDate && (
                <p className="text-[10px] text-rose-600">{errors.nextServiceDate}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="fuStatus" className="text-xs">
                Status
              </Label>
              <Select
                id="fuStatus"
                value={status}
                onChange={(e) => setStatus(e.target.value as FPFollowUpStatus)}
                className="text-xs h-9"
              >
                <option value="Scheduled">Scheduled (Future date)</option>
                <option value="Due">Due (Today)</option>
                <option value="Overdue">Overdue (Past date)</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Not Scheduled">Not Scheduled</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="fuMethod" className="text-xs">
                Method / Service <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="fuMethod"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                placeholder="e.g. Oral Contraceptive Pills (COC)"
                className={`text-xs h-9 ${errors.method ? "border-rose-500" : ""}`}
              />
              {errors.method && <p className="text-[10px] text-rose-600">{errors.method}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="fuProvider" className="text-xs">
                Assigned Provider <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="fuProvider"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="e.g. Midwife Carmen Bautista"
                className={`text-xs h-9 ${errors.provider ? "border-rose-500" : ""}`}
              />
              {errors.provider && <p className="text-[10px] text-rose-600">{errors.provider}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="fuNotes" className="text-xs">
              Follow-up Purpose / Reminder Notes
            </Label>
            <Textarea
              id="fuNotes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Method resupply (3 packs), blood pressure monitoring, check for side effects..."
              className="text-xs"
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
              className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              {isEditing ? "Save Changes" : "Save Follow-up Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
