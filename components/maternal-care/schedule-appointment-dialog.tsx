import * as React from "react";
import { CalendarClock, Plus, CheckCircle2 } from "lucide-react";
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
import { MaternalAppointment, AppointmentStatus, MaternalRecord } from "@/types/maternal-care";

interface ScheduleAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: MaternalRecord | null;
  appointmentToEdit?: MaternalAppointment | null;
  onSaveAppointment: (appointment: MaternalAppointment) => void;
}

export function ScheduleAppointmentDialog({
  open,
  onOpenChange,
  record,
  appointmentToEdit,
  onSaveAppointment,
}: ScheduleAppointmentDialogProps) {
  const isEditing = Boolean(appointmentToEdit);

  const [appointmentDate, setAppointmentDate] = React.useState("");
  const [purpose, setPurpose] = React.useState("");
  const [assignedProvider, setAssignedProvider] = React.useState("");
  const [status, setStatus] = React.useState<AppointmentStatus>("Scheduled");
  const [notes, setNotes] = React.useState("");

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  React.useEffect(() => {
    if (open) {
      if (appointmentToEdit) {
        setAppointmentDate(appointmentToEdit.appointmentDate);
        setPurpose(appointmentToEdit.purpose);
        setAssignedProvider(appointmentToEdit.assignedProvider);
        setStatus(appointmentToEdit.status);
        setNotes(appointmentToEdit.notes || "");
      } else {
        const today = new Date();
        today.setDate(today.getDate() + 14); // Default to +2 weeks
        setAppointmentDate(today.toISOString().split("T")[0]);
        setPurpose("");
        setAssignedProvider(record?.assignedBhw || "");
        setStatus("Scheduled");
        setNotes("");
      }
      setErrors({});
    }
  }, [open, appointmentToEdit, record]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { [key: string]: string } = {};

    if (!appointmentDate) errs.appointmentDate = "Appointment date is required";
    if (!purpose.trim()) errs.purpose = "Appointment purpose is required";
    if (!assignedProvider.trim()) errs.assignedProvider = "Provider/BHW is required";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload: MaternalAppointment = {
      id: appointmentToEdit?.id || `APT-${Date.now()}`,
      patientId: record?.id || "MAT-000",
      patientName: record?.patientName || "Patient",
      appointmentDate,
      purpose: purpose.trim(),
      assignedProvider: assignedProvider.trim(),
      status,
      notes: notes.trim() || undefined,
    };

    onSaveAppointment(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-lg">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 border border-sky-200 text-sky-700">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>
                {isEditing ? "Edit Appointment / Follow-up" : "Schedule Appointment & Follow-up"}
              </DialogTitle>
              <DialogDescription>
                {record?.patientName} ({record?.id})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="appointmentDate" className="text-xs">
              Appointment / Follow-up Date <span className="text-rose-600">*</span>
            </Label>
            <Input
              id="appointmentDate"
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className={`text-xs h-9 ${errors.appointmentDate ? "border-rose-500" : ""}`}
            />
            {errors.appointmentDate && (
              <p className="text-[10px] text-rose-600">{errors.appointmentDate}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="purpose" className="text-xs">
              Appointment Purpose <span className="text-rose-600">*</span>
            </Label>
            <Input
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. 2nd Trimester Routine Follow-up, TT booster, Lab Review"
              className={`text-xs h-9 ${errors.purpose ? "border-rose-500" : ""}`}
            />
            {errors.purpose && <p className="text-[10px] text-rose-600">{errors.purpose}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="assignedProvider" className="text-xs">
                Assigned Provider/BHW <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="assignedProvider"
                value={assignedProvider}
                onChange={(e) => setAssignedProvider(e.target.value)}
                placeholder="e.g. BHW Elena Gomez"
                className={`text-xs h-9 ${errors.assignedProvider ? "border-rose-500" : ""}`}
              />
              {errors.assignedProvider && (
                <p className="text-[10px] text-rose-600">{errors.assignedProvider}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="status" className="text-xs">
                Status <span className="text-rose-600">*</span>
              </Label>
              <Select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
                className="text-xs h-9"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Follow-up Due">Follow-up Due</option>
                <option value="Cancelled">Cancelled</option>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="notes" className="text-xs">
              Notes &amp; Reminders (Optional)
            </Label>
            <Textarea
              id="notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special instructions, items to bring, or reason for follow-up..."
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
              {isEditing ? "Save Changes" : "Save Appointment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
