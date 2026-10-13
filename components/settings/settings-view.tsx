"use client";

import * as React from "react";
import {
  User,
  Building,
  Sliders,
  Bell,
  ShieldCheck,
  Users,
  Settings,
  Shield,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfileSection } from "./profile-section";
import { HealthCenterSection } from "./health-center-section";
import { SystemPreferencesSection } from "./system-preferences-section";
import { NotificationsSection } from "./notifications-section";
import { SecuritySection } from "./security-section";
import { UserManagementSection } from "./user-management-section";
import { Badge } from "@/components/ui/badge";

export function SettingsView() {
  const [activeTab, setActiveTab] = React.useState("profile");

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Station &amp; System Settings
              </h1>
              <p className="text-xs text-slate-500">
                Barangay Health Center configuration, staff credentials, notification rules, and access control.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-teal-800 bg-teal-50/60 border-teal-200 text-xs py-1 px-2.5 font-medium"
          >
            <Shield className="h-3 w-3 mr-1 text-teal-600" />
            Barangay San Jose Health Station
          </Badge>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
            DOH-NHFR-035412
          </span>
        </div>
      </div>

      {/* Clean Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
        <TabsList className="bg-slate-100/90 p-1 rounded-lg border border-slate-200 flex flex-wrap gap-1 w-full sm:w-auto h-auto">
          <TabsTrigger
            value="profile"
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-md data-[state=active]:bg-white data-[state=active]:text-teal-900 data-[state=active]:shadow-xs transition-all"
          >
            <User className="h-3.5 w-3.5 text-teal-700" />
            <span>Profile</span>
          </TabsTrigger>

          <TabsTrigger
            value="health-center"
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-md data-[state=active]:bg-white data-[state=active]:text-teal-900 data-[state=active]:shadow-xs transition-all"
          >
            <Building className="h-3.5 w-3.5 text-teal-700" />
            <span>Health Center Information</span>
          </TabsTrigger>

          <TabsTrigger
            value="system"
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-md data-[state=active]:bg-white data-[state=active]:text-teal-900 data-[state=active]:shadow-xs transition-all"
          >
            <Sliders className="h-3.5 w-3.5 text-teal-700" />
            <span>System Preferences</span>
          </TabsTrigger>

          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-md data-[state=active]:bg-white data-[state=active]:text-teal-900 data-[state=active]:shadow-xs transition-all"
          >
            <Bell className="h-3.5 w-3.5 text-teal-700" />
            <span>Notification Preferences</span>
          </TabsTrigger>

          <TabsTrigger
            value="security"
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-md data-[state=active]:bg-white data-[state=active]:text-teal-900 data-[state=active]:shadow-xs transition-all"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-teal-700" />
            <span>Security</span>
          </TabsTrigger>

          <TabsTrigger
            value="users"
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-md data-[state=active]:bg-white data-[state=active]:text-teal-900 data-[state=active]:shadow-xs transition-all"
          >
            <Users className="h-3.5 w-3.5 text-teal-700" />
            <span>User Management</span>
            <span className="ml-1 text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded-full font-semibold">
              Admin &amp; BHW
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Section 1: Profile */}
        <TabsContent value="profile" className="mt-0">
          <ProfileSection />
        </TabsContent>

        {/* Section 2: Health Center Information */}
        <TabsContent value="health-center" className="mt-0">
          <HealthCenterSection />
        </TabsContent>

        {/* Section 3: System Preferences */}
        <TabsContent value="system" className="mt-0">
          <SystemPreferencesSection />
        </TabsContent>

        {/* Section 4: Notification Preferences */}
        <TabsContent value="notifications" className="mt-0">
          <NotificationsSection />
        </TabsContent>

        {/* Section 5: Security */}
        <TabsContent value="security" className="mt-0">
          <SecuritySection />
        </TabsContent>

        {/* Section 6: User Management */}
        <TabsContent value="users" className="mt-0">
          <UserManagementSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
