import * as React from "react";
import { Sliders, Sun, Moon, Laptop, CheckCircle2, Globe, Clock, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function SystemPreferencesSection() {
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">("light");
  const [defaultRoute, setDefaultRoute] = React.useState("/dashboard");
  const [language, setLanguage] = React.useState("en");
  const [dateFormat, setDateFormat] = React.useState("YYYY-MM-DD");
  const [timeFormat, setTimeFormat] = React.useState<"12h" | "24h">("12h");
  const [autoSaveDrafts, setAutoSaveDrafts] = React.useState(true);
  const [offlineCache, setOfflineCache] = React.useState(true);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback("System preferences saved successfully.");
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <Card className="border border-slate-200 shadow-xs bg-white">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Sliders className="h-4 w-4 text-teal-700" />
          System &amp; Workstation Preferences
        </CardTitle>
        <CardDescription className="text-xs">
          Interface customization, regional formatting, and local client behavior
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <form onSubmit={handleSave} className="space-y-5 text-xs">
          {feedback && (
            <div className="p-3 rounded-lg border border-teal-200 bg-teal-50 text-teal-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Theme Mode Selector */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-800">
              Color Theme &amp; Contrast
            </Label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`p-3 rounded-lg border text-left transition-all flex items-center gap-2.5 ${
                  theme === "light"
                    ? "border-teal-600 bg-teal-50/60 text-teal-900 font-semibold ring-1 ring-teal-600"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Sun className="h-4 w-4 text-amber-500" />
                <div>
                  <span className="block text-xs">Light (Standard)</span>
                  <span className="text-[10px] text-slate-400 block font-normal">
                    High contrast daylight
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`p-3 rounded-lg border text-left transition-all flex items-center gap-2.5 ${
                  theme === "dark"
                    ? "border-teal-600 bg-teal-50/60 text-teal-900 font-semibold ring-1 ring-teal-600"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Moon className="h-4 w-4 text-indigo-500" />
                <div>
                  <span className="block text-xs">Sleek Dark Mode</span>
                  <span className="text-[10px] text-slate-400 block font-normal">
                    Reduced night glare
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`p-3 rounded-lg border text-left transition-all flex items-center gap-2.5 ${
                  theme === "system"
                    ? "border-teal-600 bg-teal-50/60 text-teal-900 font-semibold ring-1 ring-teal-600"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Laptop className="h-4 w-4 text-slate-500" />
                <div>
                  <span className="block text-xs">System Match</span>
                  <span className="text-[10px] text-slate-400 block font-normal">
                    Sync with OS settings
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Regional Formats & Routing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="space-y-1">
              <Label htmlFor="prefRoute" className="text-xs">
                Default Station Landing Page
              </Label>
              <Select
                id="prefRoute"
                value={defaultRoute}
                onChange={(e) => setDefaultRoute(e.target.value)}
                className="text-xs h-9"
              >
                <option value="/dashboard">Dashboard (Overview)</option>
                <option value="/patients">Patient Registry</option>
                <option value="/consultations">Daily Consultation Queue</option>
                <option value="/appointments">Appointments &amp; Scheduling</option>
                <option value="/prescriptions">Pharmacy &amp; Prescriptions</option>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="prefLang" className="text-xs">
                Interface Language / Dialect
              </Label>
              <Select
                id="prefLang"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-xs h-9"
              >
                <option value="en">English (Official DOH Standard)</option>
                <option value="fil">Filipino / Tagalog</option>
                <option value="ceb">Cebuano / Bisaya</option>
                <option value="ilo">Ilocano</option>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="prefDateFormat" className="text-xs">
                Date Notation Format
              </Label>
              <Select
                id="prefDateFormat"
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="text-xs h-9"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601 • e.g. 2026-10-13)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 10/13/2026)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 13/10/2026)</option>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="prefTimeFormat" className="text-xs">
                Time Display
              </Label>
              <Select
                id="prefTimeFormat"
                value={timeFormat}
                onChange={(e) => setTimeFormat(e.target.value as "12h" | "24h")}
                className="text-xs h-9"
              >
                <option value="12h">12-Hour AM/PM (e.g. 09:30 AM)</option>
                <option value="24h">24-Hour Military (e.g. 09:30)</option>
              </Select>
            </div>
          </div>

          {/* Form Automation & Offline Flags */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50">
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-900 block">
                  Auto-Save Clinical Form Drafts
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Automatically preserve unsubmitted consultation and patient input in session memory
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoSaveDrafts}
                onChange={(e) => setAutoSaveDrafts(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50">
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-900 block">
                  Offline Readiness &amp; Cache Mode
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Permit station health workers to input consultations without active internet connectivity
                </span>
              </div>
              <input
                type="checkbox"
                checked={offlineCache}
                onChange={(e) => setOfflineCache(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <Button
              type="submit"
              size="sm"
              className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs h-8.5 gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Save System Preferences
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
