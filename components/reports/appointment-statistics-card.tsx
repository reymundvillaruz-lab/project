import * as React from "react";
import { CalendarClock, CheckCheck, UserX, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppointmentReportData } from "@/types/reports";
import { DistributionProgressBar, SegmentItem } from "./distribution-progress-bar";

interface AppointmentStatisticsCardProps {
  data: AppointmentReportData;
}

export function AppointmentStatisticsCard({ data }: AppointmentStatisticsCardProps) {
  const total = data.totalScheduled || 1;

  const appointmentSegments: SegmentItem[] = [
    {
      label: "Completed Visits",
      count: data.completedVisits,
      percentage: Math.round((data.completedVisits / total) * 100),
      colorClass: "bg-emerald-500",
    },
    {
      label: "Confirmed Upcoming",
      count: data.confirmedUpcoming,
      percentage: Math.round((data.confirmedUpcoming / total) * 100),
      colorClass: "bg-teal-500",
    },
    {
      label: "Pending Scheduled",
      count: data.pendingScheduled,
      percentage: Math.round((data.pendingScheduled / total) * 100),
      colorClass: "bg-sky-500",
    },
    {
      label: "No Show",
      count: data.noShowCount,
      percentage: Math.round((data.noShowCount / total) * 100),
      colorClass: "bg-amber-500",
    },
    {
      label: "Cancelled",
      count: data.cancelledCount,
      percentage: Math.round((data.cancelledCount / total) * 100),
      colorClass: "bg-rose-400",
    },
  ];

  return (
    <Card className="border border-slate-200 shadow-xs bg-white">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-teal-700" />
            Appointment Scheduling &amp; Clinic Utilization
          </CardTitle>
          <CardDescription className="text-xs">
            Patient attendance rates, completed consultations, and no-show monitoring
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 text-xs font-semibold">
            Completion Rate: {data.completionRate}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Core Indicators */}
        <div className="grid grid-cols-4 gap-3 text-center p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div>
            <span className="text-[11px] text-slate-500 block">Total Booked</span>
            <span className="text-lg font-bold text-slate-900 font-mono">
              {data.totalScheduled.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block">Completed Visits</span>
            <span className="text-lg font-bold text-emerald-800 font-mono">
              {data.completedVisits.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block">No Show Rate</span>
            <span className="text-lg font-bold text-amber-800 font-mono">
              {data.noShowRate}%
              <span className="text-[10px] text-slate-400 font-normal ml-1">({data.noShowCount})</span>
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block">Cancelled Bookings</span>
            <span className="text-lg font-bold text-rose-800 font-mono">
              {data.cancelledCount}
            </span>
          </div>
        </div>

        {/* Appointment Status Proportion Meter */}
        <div className="pt-1">
          <DistributionProgressBar
            title="Appointment Fulfillment Breakdown"
            segments={appointmentSegments}
            totalLabel="Total Bookings"
            totalValue={data.totalScheduled}
          />
        </div>
      </CardContent>
    </Card>
  );
}
