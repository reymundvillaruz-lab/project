import * as React from "react";
import {
  CalendarClock,
  Clock,
  User,
  Phone,
  Stethoscope,
  Users,
  FileText,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Calendar,
  AlertTriangle,
  UserX,
  CheckCheck,
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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Appointment, AppointmentStatus } from "@/types/appointment";
import { AppointmentStatusBadge } from "./appointment-status-badge";
import {
  formatAppointmentDateWithDay,
  formatTime12h,
  isDateToday,
  isDateUpcoming,
  isDatePast,
} from "@/lib/appointment-utils";

interface AppointmentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
  onEdit: (appointment: Appointment) => void;
  onUpdateStatus: (appointmentId: string, newStatus: AppointmentStatus) => void;
  onDelete: (appointmentId: string) => void;
}

export function AppointmentDetailDialog({
  open,
  onOpenChange,
  appointment,
  onEdit,
  onUpdateStatus,
  onDelete,
}: AppointmentDetailDialogProps) {
  if (!appointment) return null;

  const isToday = isDateToday(appointment.date);
  const isUpcoming = isDateUpcoming(appointment.date);
  const isPast = isDatePast(appointment.date);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-lg">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 border border-teal-200 text-teal-700">
                <CalendarClock className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <span>{appointment.patientName}</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-normal">
                    {appointment.id}
                  </span>
                </DialogTitle>
                <DialogDescription>
                  Health Center Appointment Record
                </DialogDescription>
              </div>
            </div>
            <AppointmentStatusBadge status={appointment.status} />
          </div>
        </DialogHeader>

        <div className="px-5 py-4 space-y-4 text-xs">
          {/* Date & Time Highlight Card */}
          <div className="rounded-lg border border-teal-200 bg-teal-50/60 p-3.5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-teal-700" />
                Schedule
              </span>
              <p className="text-sm font-bold text-slate-900">
                {formatAppointmentDateWithDay(appointment.date)}
              </p>
              <p className="text-xs font-semibold text-teal-800 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime12h(appointment.time)}
              </p>
            </div>

            <div>
              {isToday && (
                <Badge className="bg-teal-700 text-white hover:bg-teal-700 text-[11px] font-semibold">
                  Today&apos;s Appointment
                </Badge>
              )}
              {isUpcoming && (
                <Badge variant="outline" className="bg-sky-50 text-sky-800 border-sky-300 text-[11px]">
                  Upcoming Visit
                </Badge>
              )}
              {isPast && !isToday && appointment.status !== "Completed" && (
                <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 text-[11px]">
                  Past Date
                </Badge>
              )}
              {appointment.status === "Completed" && (
                <Badge variant="success" className="text-[11px]">
                  Visit Completed
                </Badge>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-2.5">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5 text-slate-400" />
                Purpose / Service
              </span>
              <span className="font-semibold text-slate-900">
                {appointment.purpose}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                Assigned BHW / Provider
              </span>
              <span className="font-semibold text-teal-900">
                {appointment.assignedBHW}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-400" />
                Patient ID
              </span>
              <span className="font-mono text-slate-800">
                {appointment.patientId || "Not registered in patient database"}
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                Contact Telephone
              </span>
              <span className="font-medium text-slate-800">
                {appointment.patientContact || "None provided"}
              </span>
            </div>
          </div>

          {/* Clinical Notes & Instructions */}
          <div className="space-y-1">
            <span className="text-slate-500 font-semibold flex items-center gap-1.5 text-[11px]">
              <FileText className="h-3.5 w-3.5 text-slate-400" />
              Notes &amp; Clinical Instructions
            </span>
            <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 text-slate-700 min-h-[60px] whitespace-pre-wrap">
              {appointment.notes || (
                <span className="text-slate-400 italic">
                  No additional notes or instructions provided for this appointment.
                </span>
              )}
            </div>
          </div>

          {/* Quick Status Change Actions */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
              Quick Status Actions
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {appointment.status !== "Confirmed" && appointment.status !== "Completed" && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateStatus(appointment.id, "Confirmed")}
                  className="h-7 text-xs gap-1 border-teal-300 text-teal-800 hover:bg-teal-50"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                  Confirm Visit
                </Button>
              )}

              {appointment.status !== "Completed" && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateStatus(appointment.id, "Completed")}
                  className="h-7 text-xs gap-1 border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                >
                  <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Mark Completed
                </Button>
              )}

              {appointment.status !== "No Show" && appointment.status !== "Completed" && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateStatus(appointment.id, "No Show")}
                  className="h-7 text-xs gap-1 border-amber-300 text-amber-900 hover:bg-amber-50"
                >
                  <UserX className="h-3.5 w-3.5 text-amber-700" />
                  Mark No Show
                </Button>
              )}

              {appointment.status !== "Cancelled" && appointment.status !== "Completed" && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateStatus(appointment.id, "Cancelled")}
                  className="h-7 text-xs gap-1 border-rose-300 text-rose-800 hover:bg-rose-50"
                >
                  <XCircle className="h-3.5 w-3.5 text-rose-600" />
                  Cancel Appointment
                </Button>
              )}

              {appointment.status !== "Scheduled" && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => onUpdateStatus(appointment.id, "Scheduled")}
                  className="h-7 text-xs text-slate-500 hover:text-slate-800"
                >
                  Reset to Scheduled
                </Button>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="px-5 py-3 border-t border-slate-100 flex items-center justify-between sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDelete(appointment.id)}
            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Record
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
                onEdit(appointment);
              }}
              className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs gap-1.5"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit Details
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
