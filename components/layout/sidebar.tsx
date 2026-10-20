"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Syringe,
  HeartPulse,
  UserCheck,
  CalendarClock,
  Pill,
  FileBarChart,
  Settings,
  FolderArchive,
  Activity,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MAIN_NAV_ITEMS } from "@/lib/navigation";
import { DEFAULT_USER_PROFILE } from "@/lib/data/empty-data";
import { useUser } from "@clerk/nextjs";

// Map icon strings to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  Stethoscope,
  Syringe,
  HeartPulse,
  UserCheck,
  CalendarClock,
  Pill,
  FileBarChart,
  FolderArchive,
  Settings,
};

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onItemClick?: () => void;
  isMobileDrawer?: boolean;
}

export function Sidebar({
  className,
  isCollapsed = false,
  onToggleCollapse,
  onItemClick,
  isMobileDrawer = false,
}: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();

  // In mobile drawer, never show collapsed state
  const effectiveCollapsed = isMobileDrawer ? false : isCollapsed;

  const rawRole = (user?.publicMetadata?.role as string)?.toUpperCase();
  const userRole: "ADMINISTRATOR" | "BHW" =
    rawRole === "BHW" ? "BHW" : "ADMINISTRATOR";

  const displayName =
    user?.fullName ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress ||
    DEFAULT_USER_PROFILE.name;
  const displaySub =
    user?.primaryEmailAddress?.emailAddress || DEFAULT_USER_PROFILE.healthCenter;
  const initials =
    displayName
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AD";

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-slate-900 text-slate-100 border-r border-slate-800 select-none transition-all duration-300 ease-in-out",
        effectiveCollapsed ? "w-[72px]" : "w-64",
        className
      )}
      aria-label="Main Navigation"
    >
      {/* Brand & Health Center Header */}
      <div className="flex flex-col border-b border-slate-800/80 bg-slate-950/40 p-4">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            onClick={onItemClick}
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-md"
            title="BHCMS Dashboard"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white font-bold shadow-xs">
              <Activity className="h-5 w-5" />
            </div>
            {!effectiveCollapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold tracking-tight text-white">BHCMS</span>
                  <span className="rounded bg-teal-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-teal-300">
                    Health
                  </span>
                </div>
                <span className="text-xs text-slate-400 truncate">
                  Barangay Health Center
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Station Indicator (Shown when expanded) */}
        {!effectiveCollapsed && (
          <div className="mt-3 flex items-center justify-between rounded-md bg-slate-800/60 px-2.5 py-1.5 text-[11px] text-slate-300">
            <span className="truncate font-medium">{DEFAULT_USER_PROFILE.healthCenter}</span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-1">
        {!effectiveCollapsed && (
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Health Center Modules
          </div>
        )}

        {MAIN_NAV_ITEMS.filter((item) => {
          if (item.allowedRoles && !item.allowedRoles.includes(userRole)) {
            return false;
          }
          return true;
        }).map((item) => {
          const Icon = iconMap[item.iconName] || LayoutDashboard;
          const isActive =
            pathname === item.href ||
            (item.href === "/dashboard" && pathname === "/") ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href)) ||
            (item.href === "/prescriptions" && pathname.startsWith("/medicines"));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              title={effectiveCollapsed ? item.title : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-md text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500",
                effectiveCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2",
                isActive
                  ? "bg-teal-700 text-white font-semibold shadow-xs"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <span
                  className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r bg-teal-300",
                    effectiveCollapsed ? "h-6" : "h-5"
                  )}
                  aria-hidden="true"
                />
              )}

              <Icon
                className={cn(
                  "shrink-0 transition-colors",
                  effectiveCollapsed ? "h-5 w-5" : "h-4 w-4",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                )}
              />

              {!effectiveCollapsed && (
                <>
                  <span className="flex-1 truncate">{item.title}</span>
                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        "ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                        isActive
                          ? "bg-teal-800 text-teal-100"
                          : "bg-slate-800 text-slate-300"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info Area */}
      <div className="border-t border-slate-800 bg-slate-950/40 p-3">
        {!effectiveCollapsed ? (
          <div className="flex items-center gap-2.5 rounded-md p-2 bg-slate-800/40">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={displayName}
                className="h-8 w-8 shrink-0 rounded-full object-cover border border-teal-600/50"
              />
            ) : (
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-800 text-teal-100 text-xs font-bold border border-teal-700/60"
                title={`${displayName} - ${displaySub}`}
              >
                {initials}
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-xs font-semibold text-slate-200">
                  {displayName}
                </span>
                <span
                  className={cn(
                    "text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 uppercase tracking-wider",
                    userRole === "ADMINISTRATOR"
                      ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  )}
                >
                  {userRole}
                </span>
              </div>
              <span className="truncate text-[10px] text-slate-400">
                {displaySub}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={displayName}
                className="h-8 w-8 shrink-0 rounded-full object-cover border border-teal-600/50"
                title={`${displayName} - ${displaySub}`}
              />
            ) : (
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-800 text-teal-100 text-xs font-bold border border-teal-700/60"
                title={`${displayName} - ${displaySub}`}
              >
                {initials}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
