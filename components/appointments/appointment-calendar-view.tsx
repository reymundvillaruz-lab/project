import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  User,
  CheckCircle2,
  CalendarClock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Appointment } from "@/types/appointment";
import {
  getMonthDaysMatrix,
  MONTH_NAMES,
  formatTime12h,
  getTodayDateString,
  CalendarDay,
} from "@/lib/appointment-utils";

interface AppointmentCalendarViewProps {
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
  onScheduleDate: (dateStr: string) => void;
  onNewAppointment: () => void;
}

export function AppointmentCalendarView({
  appointments,
  onSelectAppointment,
  onScheduleDate,
  onNewAppointment,
}: AppointmentCalendarViewProps) {
  // Calendar current view state (defaults to today's month & year)
  const today = new Date();
  const [currentYear, setCurrentYear] = React.useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = React.useState(today.getMonth());

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleGoToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  // Matrix of days (7 columns x N weeks)
  const weeksMatrix = React.useMemo(() => {
    return getMonthDaysMatrix(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  // Group appointments by date string
  const appointmentsByDate = React.useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    appointments.forEach((apt) => {
      if (!map[apt.date]) {
        map[apt.date] = [];
      }
      map[apt.date].push(apt);
    });

    // Sort each day's appointments by time
    Object.keys(map).forEach((dateKey) => {
      map[dateKey].sort((a, b) => a.time.localeCompare(b.time));
    });

    return map;
  }, [appointments]);

  // Count appointments in current visible month
  const currentMonthAppointmentsCount = React.useMemo(() => {
    const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;
    return appointments.filter((apt) => apt.date.startsWith(monthPrefix)).length;
  }, [appointments, currentYear, currentMonth]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-teal-100 text-teal-900 border-teal-300 hover:bg-teal-200";
      case "Completed":
        return "bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200";
      case "Cancelled":
        return "bg-rose-100 text-rose-900 border-rose-300 hover:bg-rose-200 line-through opacity-75";
      case "No Show":
        return "bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200";
      default: // Scheduled
        return "bg-sky-100 text-sky-900 border-sky-300 hover:bg-sky-200";
    }
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header Navigation */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevMonth}
              className="h-8 w-8 text-slate-600 hover:text-slate-900"
              title="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              className="h-8 w-8 text-slate-600 hover:text-slate-900"
              title="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </h2>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoToToday}
            className="h-8 text-xs text-teal-700 hover:text-teal-800 hover:bg-teal-50"
          >
            Today
          </Button>

          <Badge variant="outline" className="text-slate-500 font-normal text-xs ml-2">
            {currentMonthAppointmentsCount} visits this month
          </Badge>
        </div>

        {/* Legend & Action */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              Scheduled
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              Confirmed
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Completed
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              No Show
            </span>
          </div>

          <Button
            size="sm"
            onClick={onNewAppointment}
            className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs h-8 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Desktop Calendar Grid */}
      <Card className="border border-slate-200 shadow-xs overflow-hidden bg-white">
        <CardContent className="p-0">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-semibold text-slate-600">
            {daysOfWeek.map((day, idx) => (
              <div
                key={day}
                className={`py-2.5 border-r border-slate-200 last:border-r-0 ${
                  idx === 0 || idx === 6 ? "text-slate-400 bg-slate-100/50" : ""
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Weeks Rows */}
          <div className="divide-y divide-slate-200">
            {weeksMatrix.map((week, weekIdx) => (
              <div key={weekIdx} className="grid grid-cols-7 divide-x divide-slate-200 min-h-[110px]">
                {week.map((dayCell) => {
                  const dayAppointments = appointmentsByDate[dayCell.date] || [];

                  return (
                    <div
                      key={dayCell.date}
                      onClick={() => onScheduleDate(dayCell.date)}
                      className={`group relative p-2 transition-colors flex flex-col justify-between cursor-pointer ${
                        !dayCell.isCurrentMonth
                          ? "bg-slate-50/70 text-slate-400"
                          : dayCell.isToday
                          ? "bg-teal-50/30"
                          : "hover:bg-slate-50/80"
                      }`}
                    >
                      {/* Top Day Number Row */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-xs font-semibold rounded-full h-6 w-6 flex items-center justify-center ${
                            dayCell.isToday
                              ? "bg-teal-700 text-white shadow-xs font-bold"
                              : dayCell.isCurrentMonth
                              ? "text-slate-800"
                              : "text-slate-400"
                          }`}
                        >
                          {dayCell.dayNumber}
                        </span>

                        {/* Hover + button to schedule on this date */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onScheduleDate(dayCell.date);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded text-slate-400 hover:text-teal-700 hover:bg-slate-200"
                          title={`Schedule visit on ${dayCell.date}`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Day's Appointments Chips List */}
                      <div className="flex-1 space-y-1 overflow-y-auto max-h-[85px]">
                        {dayAppointments.slice(0, 3).map((apt) => (
                          <div
                            key={apt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectAppointment(apt);
                            }}
                            className={`px-1.5 py-0.5 rounded text-[11px] font-medium border truncate transition-all cursor-pointer shadow-2xs ${getStatusColor(
                              apt.status
                            )}`}
                            title={`${formatTime12h(apt.time)} - ${apt.patientName} (${apt.purpose}) - Status: ${apt.status}`}
                          >
                            <span className="font-semibold mr-1">
                              {formatTime12h(apt.time)}
                            </span>
                            <span>{apt.patientName}</span>
                          </div>
                        ))}

                        {dayAppointments.length > 3 && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              onScheduleDate(dayCell.date);
                            }}
                            className="text-[10px] text-teal-700 font-semibold px-1 hover:underline cursor-pointer"
                          >
                            +{dayAppointments.length - 3} more visits
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
