import * as React from "react";
import { Bell, Volume2, Pill, HeartPulse, CalendarClock, Syringe, FileText, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function NotificationsSection() {
  const [consultationChime, setConsultationChime] = React.useState(true);
  const [lowStockAlerts, setLowStockAlerts] = React.useState(true);
  const [highRiskMaternal, setHighRiskMaternal] = React.useState(true);
  const [followUpDue, setFollowUpDue] = React.useState(true);
  const [immunizationDefaulter, setImmunizationDefaulter] = React.useState(true);
  const [dailyDigest, setDailyDigest] = React.useState(false);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback("Notification preferences updated successfully.");
    setTimeout(() => setFeedback(null), 3500);
  };

  const notificationItems = [
    {
      title: "Consultation Queue Audio Chime",
      desc: "Play an audible alert chime at the triage station when a new patient enters the queue",
      checked: consultationChime,
      setter: setConsultationChime,
      icon: <Volume2 className="h-4 w-4 text-teal-700 mt-0.5 shrink-0" />,
    },
    {
      title: "Pharmacy Critical & Low Stock Warnings",
      desc: "Display banner warning when essential medicines fall below the reorder threshold (<= 20 units)",
      checked: lowStockAlerts,
      setter: setLowStockAlerts,
      icon: <Pill className="h-4 w-4 text-amber-700 mt-0.5 shrink-0" />,
    },
    {
      title: "High-Risk Pregnancy Flag Alerts",
      desc: "Immediately flag teenage, hypertensive, or grand-multipara mothers during antenatal triage",
      checked: highRiskMaternal,
      setter: setHighRiskMaternal,
      icon: <HeartPulse className="h-4 w-4 text-rose-700 mt-0.5 shrink-0" />,
    },
    {
      title: "Family Planning & Clinical Follow-up Reminders",
      desc: "Highlight clients due or overdue for contraceptive resupply and routine checkups",
      checked: followUpDue,
      setter: setFollowUpDue,
      icon: <CalendarClock className="h-4 w-4 text-sky-700 mt-0.5 shrink-0" />,
    },
    {
      title: "Immunization Defaulter Drop-out Notification",
      desc: "Alert health workers when infants miss their scheduled Pentavalent, OPV, or Measles doses",
      checked: immunizationDefaulter,
      setter: setImmunizationDefaulter,
      icon: <Syringe className="h-4 w-4 text-emerald-700 mt-0.5 shrink-0" />,
    },
    {
      title: "Daily Morning Census Digest",
      desc: "Show a summary digest of scheduled visits, expected deliveries, and pending tasks every morning",
      checked: dailyDigest,
      setter: setDailyDigest,
      icon: <FileText className="h-4 w-4 text-indigo-700 mt-0.5 shrink-0" />,
    },
  ];

  return (
    <Card className="border border-slate-200 shadow-xs bg-white">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Bell className="h-4 w-4 text-teal-700" />
          Notification &amp; Clinical Alert Preferences
        </CardTitle>
        <CardDescription className="text-xs">
          Configure real-time station alerts, audio prompts, and priority patient notifications
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {feedback && (
            <div className="p-3 rounded-lg border border-teal-200 bg-teal-50 text-teal-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          <div className="space-y-2.5">
            {notificationItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {item.icon}
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-900 block">{item.title}</span>
                    <span className="text-[11px] text-slate-500 block">{item.desc}</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => item.setter(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer mt-1"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <Button
              type="submit"
              size="sm"
              className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs h-8.5 gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Save Notification Preferences
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
