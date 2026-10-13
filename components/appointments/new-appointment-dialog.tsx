import * as React from "react";
import {
  CalendarClock,
  User,
  Clock,
  Calendar as CalendarIcon,
  Stethoscope,
  Users,
  CheckCircle2,
  FileText,
  Plus,
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
  Appointment,
  AppointmentStatus,
  AppointmentPurpose,
} from "@/types/appointment";
import {
  getTodayDateString,
  PURPOSE_OPTIONS,
  STANDARD_BHW_OPTIONS,
} from "@/lib/appointment-utils";

interface NewAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (appointment: Appointment) => void;
  appointmentToEdit?: Appointment | null;
  initialDate?: string;
}

export function NewAppointmentDialog({
  open,
  onOpenChange,
  onSave,
  appointmentToEdit,
  initialDate,
}: NewAppointmentDialogProps) {
  const isEditing = Boolean(appointmentToEdit);

  // Form states
  const [patientName, setPatientName] = React.useState("");
  const [patientId, setPatientId] = React.useState("");
  const [patientContact, setPatientContact] = React.useState("");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [purpose, setPurpose] = React.useState("");
  const [assignedBHW, setAssignedBHW] = React.useState("");
  const [status, setStatus] = React.useState<AppointmentStatus>("Scheduled");
  const [notes, setNotes] = React.useState("");

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Reset or load initial data
  React.useEffect(() => {
    if (open) {
      if (appointmentToEdit) {
        setPatientName(appointmentToEdit.patientName || "");
        setPatientId(appointmentToEdit.patientId || "");
        setPatientContact(appointmentToEdit.patientContact || "");
        setDate(appointmentToEdit.date || "");
        setTime(appointmentToEdit.time || "");
        setPurpose(appointmentToEdit.purpose || "");
        setAssignedBHW(appointmentToEdit.assignedBHW || "");
        setStatus(appointmentToEdit.status || "Scheduled");
        setNotes(appointmentToEdit.notes || "");
      } else {
        setPatientName("");
        setPatientId("");
        setPatientContact("");
        setDate(initialDate || getTodayDateString());
        setTime("09:00");
        setPurpose("");
        setAssignedBHW("");
        setStatus("Scheduled");
        setNotes("");
      }
      setErrors({});
    }
  }, [open, appointmentToEdit, initialDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!patientName.trim()) {
      newErrors.patientName = "Patient name is required";
    }
    if (!date.trim()) {
      newErrors.date = "Appointment date is required";
    }
    if (!time.trim()) {
      newErrors.time = "Appointment time is required";
    }
    if (!purpose.trim()) {
      newErrors.purpose = "Purpose is required";
    }
    if (!assignedBHW.trim()) {
      newErrors.assignedBHW = "Assigned health worker is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: Appointment = {
      id: appointmentToEdit ? appointmentToEdit.id : `APT-${Date.now().toString().slice(-6)}`,
      patientName: patientName.trim(),
      patientId: patientId.trim() || undefined,
      patientContact: patientContact.trim() || undefined,
      date: date.trim(),
      time: time.trim(),
      purpose: purpose.trim(),
      assignedBHW: assignedBHW.trim(),
      status,
      notes: notes.trim() || undefined,
      createdAt: appointmentToEdit ? appointmentToEdit.createdAt : getTodayDateString(),
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
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>
                {isEditing ? "Edit Appointment" : "New Appointment"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? `Update appointment details for ${appointmentToEdit?.patientName}`
                  : "Schedule a patient visit, consultation, or follow-up at the Barangay Health Center"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          {/* Patient Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-teal-700" />
              Patient Information
            </h4>

            <div className="space-y-1">
              <Label htmlFor="patientName" className="text-xs">
                Patient Full Name <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="patientName"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Juan dela Cruz"
                className={`text-xs h-9 ${errors.patientName ? "border-rose-500" : ""}`}
              />
              {errors.patientName && (
                <p className="text-[11px] text-rose-600">{errors.patientName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="patientId" className="text-xs">
                  Patient ID (Optional)
                </Label>
                <Input
                  id="patientId"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="e.g. PAT-2026-001"
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="patientContact" className="text-xs">
                  Contact Number (Optional)
                </Label>
                <Input
                  id="patientContact"
                  value={patientContact}
                  onChange={(e) => setPatientContact(e.target.value)}
                  placeholder="e.g. 09171234567"
                  className="text-xs h-9"
                />
              </div>
            </div>
          </div>

          {/* Schedule Date & Time */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5 text-teal-700" />
              Schedule &amp; Time
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="aptDate" className="text-xs">
                  Date <span className="text-rose-600">*</span>
                </Label>
                <Input
                  id="aptDate"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`text-xs h-9 ${errors.date ? "border-rose-500" : ""}`}
                />
                {errors.date && (
                  <p className="text-[11px] text-rose-600">{errors.date}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="aptTime" className="text-xs">
                  Time <span className="text-rose-600">*</span>
                </Label>
                <Input
                  id="aptTime"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={`text-xs h-9 ${errors.time ? "border-rose-500" : ""}`}
                />
                {errors.time && (
                  <p className="text-[11px] text-rose-600">{errors.time}</p>
                )}
              </div>
            </div>
          </div>

          {/* Purpose & Health Worker */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Stethoscope className="h-3.5 w-3.5 text-teal-700" />
              Service &amp; Assignment
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="aptPurpose" className="text-xs">
                  Purpose / Service <span className="text-rose-600">*</span>
                </Label>
                <Select
                  id="aptPurpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className={`text-xs h-9 ${errors.purpose ? "border-rose-500" : ""}`}
                >
                  <option value="">-- Select Purpose --</option>
                  {PURPOSE_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
                {errors.purpose && (
                  <p className="text-[11px] text-rose-600">{errors.purpose}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="aptBHW" className="text-xs">
                  Assigned BHW / Provider <span className="text-rose-600">*</span>
                </Label>
                <Select
                  id="aptBHW"
                  value={assignedBHW}
                  onChange={(e) => setAssignedBHW(e.target.value)}
                  className={`text-xs h-9 ${errors.assignedBHW ? "border-rose-500" : ""}`}
                >
                  <option value="">-- Select Assigned Staff --</option>
                  {STANDARD_BHW_OPTIONS.map((bhw) => (
                    <option key={bhw} value={bhw}>
                      {bhw}
                    </option>
                  ))}
                </Select>
                {errors.assignedBHW && (
                  <p className="text-[11px] text-rose-600">{errors.assignedBHW}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="aptStatus" className="text-xs">
                Appointment Status
              </Label>
              <Select
                id="aptStatus"
                value={status}
                onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
                className="text-xs h-9"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="No Show">No Show</option>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <Label htmlFor="aptNotes" className="text-xs">
              Notes &amp; Instructions (Optional)
            </Label>
            <Textarea
              id="aptNotes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Fasting required for blood test, bring child immunization card, etc."
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
                  Schedule Appointment
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
