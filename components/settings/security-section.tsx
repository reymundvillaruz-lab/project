"use client";

import * as React from "react";
import {
  ShieldCheck,
  Key,
  Lock,
  Smartphone,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Info,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSettings } from "@/context/settings-context";

export function SecuritySection() {
  const {
    securitySettings,
    updateSecurityPassword,
    toggleTwoFactor,
    terminateOtherSessions,
    terminateSession,
  } = useSettings();

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [feedback, setFeedback] = React.useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setFeedback({ type: "error", msg: "Please enter your current password." });
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setFeedback({
        type: "error",
        msg: "New password must be at least 8 characters long.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedback({ type: "error", msg: "New passwords do not match." });
      return;
    }

    const result = updateSecurityPassword(currentPassword, newPassword);
    if (!result.success) {
      setFeedback({ type: "error", msg: result.message });
      return;
    }

    setFeedback({
      type: "success",
      msg: result.message,
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleToggle2FA = () => {
    const isNowEnabled = toggleTwoFactor();
    setFeedback({
      type: "success",
      msg: isNowEnabled
        ? "Two-Factor Authentication (2FA) is now enabled for your account."
        : "Two-Factor Authentication (2FA) has been disabled.",
    });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleTerminateOthers = () => {
    terminateOtherSessions();
    setFeedback({
      type: "success",
      msg: "All other active device sessions have been signed out.",
    });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleDisconnect = (id: string) => {
    terminateSession(id);
    setFeedback({
      type: "success",
      msg: "Remote session terminated.",
    });
    setTimeout(() => setFeedback(null), 3000);
  };

  const nonCurrentSessions = securitySettings.activeSessions.filter(
    (s) => !s.isCurrent
  );

  return (
    <Card className="border border-slate-200 shadow-xs bg-white">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-teal-700" />
          Security &amp; Account Protection
        </CardTitle>
        <CardDescription className="text-xs">
          Password credentials, multi-factor authentication, and active station sessions
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 space-y-6 text-xs">
        {feedback && (
          <div
            className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
              feedback.type === "success"
                ? "border-teal-200 bg-teal-50 text-teal-800"
                : "border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.msg}</span>
          </div>
        )}

        {/* Change Password Form */}
        <form onSubmit={handlePasswordUpdate} className="space-y-3">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-teal-700" />
              <h4 className="font-semibold text-slate-800">Change Account Password</h4>
            </div>
            <span className="text-[11px] text-slate-400">
              Default password: <code className="font-mono bg-slate-100 px-1 rounded text-slate-600">admin1234</code>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="currPass" className="text-xs">
                Current Password <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="currPass"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className="text-xs h-9 font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="newPass" className="text-xs">
                New Password (Min. 8 chars) <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="newPass"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="text-xs h-9 font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="confPass" className="text-xs">
                Confirm New Password <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="confPass"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="text-xs h-9 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              size="sm"
              variant="outline"
              className="text-xs h-8 text-teal-800 border-teal-300 hover:bg-teal-50"
            >
              Update Password
            </Button>
          </div>
        </form>

        {/* Two-Factor Authentication */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-slate-50/60">
            <div className="flex items-start gap-3">
              <Smartphone className="h-5 w-5 text-teal-700 mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">
                    Two-Factor Authentication (2FA)
                  </span>
                  <Badge
                    variant={securitySettings.twoFactorEnabled ? "success" : "outline"}
                    className="text-[10px]"
                  >
                    {securitySettings.twoFactorEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500">
                  Protect patient records by requiring an SMS or authenticator code upon login.
                </p>
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleToggle2FA}
              className={`text-xs h-8 shrink-0 ${
                securitySettings.twoFactorEnabled
                  ? "border-rose-200 text-rose-700 hover:bg-rose-50"
                  : "border-teal-300 text-teal-800 hover:bg-teal-50"
              }`}
            >
              {securitySettings.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
            </Button>
          </div>
        </div>

        {/* Active Workstation Sessions */}
        <div className="pt-3 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Laptop className="h-3.5 w-3.5 text-teal-700" />
              Active Login Sessions ({securitySettings.activeSessions.length})
            </span>
            {nonCurrentSessions.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleTerminateOthers}
                className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              >
                <LogOut className="h-3.5 w-3.5 mr-1" />
                Sign out all other devices
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {securitySettings.activeSessions.map((session) => (
              <div
                key={session.id}
                className={`p-3 rounded-lg border flex items-center justify-between ${
                  session.isCurrent
                    ? "border-teal-200 bg-teal-50/40"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">
                      {session.device}
                    </span>
                    {session.isCurrent && (
                      <Badge variant="default" className="text-[10px] bg-teal-700">
                        Current Device
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    IP: {session.ip} &bull; {session.location} &bull; {session.lastActive}
                  </p>
                </div>
                {session.isCurrent ? (
                  <span className="text-emerald-700 font-semibold text-[11px]">Online</span>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDisconnect(session.id)}
                    className="h-6 text-[11px] text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                  >
                    Disconnect
                  </Button>
                )}
              </div>
            ))}

            {nonCurrentSessions.length === 0 && (
              <p className="text-[11px] text-slate-400 italic flex items-center gap-1 pt-1">
                <Info className="h-3.5 w-3.5 text-slate-400" />
                No other active sessions. This current workstation is the only authenticated device.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
