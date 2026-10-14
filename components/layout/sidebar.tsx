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
  LogOut,
  Activity,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MAIN_NAV_ITEMS } from "@/lib/navigation";
import { DEFAULT_USER_PROFILE } from "@/lib/data/empty-data";

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
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  // In mobile drawer, never show collapsed state
  const effectiveCollapsed = isMobileDrawer ? false : isCollapsed;

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    alert("Signed out successfully. (In Phase 2, this will redirect to Clerk sign-in).");
  };

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

        {MAIN_NAV_ITEMS.map((item) => {
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

      {/* User Info & Logout Area */}
      <div className="border-t border-slate-800 bg-slate-950/40 p-3">
        {!effectiveCollapsed ? (
          <div>
            <div className="flex items-center gap-2.5 rounded-md p-2 bg-slate-800/40">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-800 text-teal-100 text-xs font-bold border border-teal-700/60">
                AD
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="truncate text-xs font-semibold text-slate-200">
                  {DEFAULT_USER_PROFILE.name}
                </span>
                <span className="truncate text-[10px] text-slate-400">
                  {DEFAULT_USER_PROFILE.healthCenter}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogoutClick}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              aria-label="Logout of BHCMS"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-800 text-teal-100 text-xs font-bold border border-teal-700/60"
              title={`${DEFAULT_USER_PROFILE.name} - ${DEFAULT_USER_PROFILE.healthCenter}`}
            >
              AD
            </div>
            <button
              type="button"
              onClick={handleLogoutClick}
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-rose-950/50 hover:text-rose-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              title="Logout"
              aria-label="Logout of BHCMS"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Logout Confirmation Dialog Modal */}
      {showLogoutConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sidebar-logout-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-sm rounded-lg border border-slate-700 bg-slate-900 p-5 shadow-xl text-slate-100">
            <h3 id="sidebar-logout-title" className="text-base font-semibold text-white">
              Confirm Sign Out
            </h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Are you sure you want to sign out of the Barangay Health Care Management System?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
