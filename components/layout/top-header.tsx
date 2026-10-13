"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  User,
  Settings as SettingsIcon,
  LogOut,
  ChevronDown,
  Building,
  ShieldCheck,
  CheckCircle2,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { DEFAULT_USER_PROFILE } from "@/lib/data/empty-data";

interface TopHeaderProps {
  onMobileMenuOpen: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebarCollapse?: () => void;
  title?: string;
  breadcrumbItems?: Array<{ label: string; href?: string }>;
}

export function TopHeader({
  onMobileMenuOpen,
  isSidebarCollapsed = false,
  onToggleSidebarCollapse,
  title,
  breadcrumbItems,
}: TopHeaderProps) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  // Route-to-metadata resolution
  const routeInfo = React.useMemo(() => {
    if (pathname === "/" || pathname === "/dashboard") {
      return {
        title: "Dashboard",
        breadcrumbs: [{ label: "Dashboard" }],
      };
    }
    if (pathname === "/patients") {
      return {
        title: "Patient Registry",
        breadcrumbs: [{ label: "Dashboard", href: "/dashboard" }, { label: "Patient Registry" }],
      };
    }
    if (pathname === "/patients/new") {
      return {
        title: "PHILPEN Risk Assessment",
        breadcrumbs: [
          { label: "Dashboard", href: "/dashboard" },
          { label: "Patient Registry", href: "/patients" },
          { label: "PHILPEN Assessment" },
        ],
      };
    }
    if (pathname.startsWith("/patients/")) {
      return {
        title: "Patient Details",
        breadcrumbs: [
          { label: "Dashboard", href: "/dashboard" },
          { label: "Patient Registry", href: "/patients" },
          { label: "Patient Details" },
        ],
      };
    }
    if (pathname === "/consultations") {
      return {
        title: "Consultations",
        breadcrumbs: [{ label: "Dashboard", href: "/dashboard" }, { label: "Consultations" }],
      };
    }
    if (pathname === "/consultations/new") {
      return {
        title: "New Consultation",
        breadcrumbs: [
          { label: "Dashboard", href: "/dashboard" },
          { label: "Consultations", href: "/consultations" },
          { label: "New Consultation" },
        ],
      };
    }
    if (pathname.startsWith("/consultations/")) {
      return {
        title: "Consultation Details",
        breadcrumbs: [
          { label: "Dashboard", href: "/dashboard" },
          { label: "Consultations", href: "/consultations" },
          { label: "Consultation Details" },
        ],
      };
    }
    if (pathname.startsWith("/immunization")) {
      return {
        title: "Immunization",
        breadcrumbs: [{ label: "Dashboard", href: "/dashboard" }, { label: "Immunization" }],
      };
    }
    if (pathname.startsWith("/maternal-care")) {
      return {
        title: "Maternal Care",
        breadcrumbs: [{ label: "Dashboard", href: "/dashboard" }, { label: "Maternal Care" }],
      };
    }
    if (pathname.startsWith("/family-planning")) {
      return {
        title: "Family Planning",
        breadcrumbs: [{ label: "Dashboard", href: "/dashboard" }, { label: "Family Planning" }],
      };
    }
    if (pathname.startsWith("/appointments")) {
      return {
        title: "Appointments",
        breadcrumbs: [{ label: "Dashboard", href: "/dashboard" }, { label: "Appointments" }],
      };
    }
    if (pathname.startsWith("/prescriptions")) {
      return {
        title: "Prescriptions & Medicines",
        breadcrumbs: [{ label: "Dashboard", href: "/dashboard" }, { label: "Prescriptions & Medicines" }],
      };
    }
    if (pathname.startsWith("/medicines")) {
      return {
        title: "Prescriptions & Medicines",
        breadcrumbs: [
          { label: "Dashboard", href: "/dashboard" },
          { label: "Prescriptions & Medicines", href: "/prescriptions" },
          { label: "Pharmacy Inventory" },
        ],
      };
    }
    if (pathname.startsWith("/reports")) {
      return {
        title: "Reports",
        breadcrumbs: [{ label: "Dashboard", href: "/dashboard" }, { label: "Reports" }],
      };
    }
    if (pathname.startsWith("/settings")) {
      return {
        title: "Settings",
        breadcrumbs: [{ label: "Dashboard", href: "/dashboard" }, { label: "Settings" }],
      };
    }
    return {
      title: "Health Center System",
      breadcrumbs: [{ label: "Dashboard", href: "/dashboard" }],
    };
  }, [pathname]);

  const displayTitle = title || routeInfo.title;
  const displayBreadcrumbs = breadcrumbItems || routeInfo.breadcrumbs;

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    alert("Signed out successfully. (In Phase 2, this will redirect to Clerk sign-in).");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 shadow-2xs">
      {/* Left: Mobile Toggle, Desktop Collapse, Breadcrumb & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMobileMenuOpen}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 lg:hidden"
          aria-label="Open mobile navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop Sidebar Collapse Toggle */}
        {onToggleSidebarCollapse && (
          <button
            type="button"
            onClick={onToggleSidebarCollapse}
            className="hidden lg:inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 transition-colors"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Breadcrumb & Title Area */}
        <div className="flex flex-col min-w-0">
          {/* Breadcrumbs */}
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList>
              {displayBreadcrumbs.map((crumb, idx) => {
                const isLast = idx === displayBreadcrumbs.length - 1;
                return (
                  <React.Fragment key={crumb.label}>
                    <BreadcrumbItem>
                      {isLast || !crumb.href ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>

          {/* Current Page Title */}
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 truncate">
            {displayTitle}
          </h1>
        </div>
      </div>

      {/* Right Area: Station Badge, Notifications & User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Barangay Health Center Badge */}
        <div className="hidden xl:flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
          <Building className="h-3.5 w-3.5 text-teal-600" />
          <span className="font-medium text-slate-700">{DEFAULT_USER_PROFILE.healthCenter}</span>
        </div>

        {/* Notification Button & Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            aria-label="View notifications"
            aria-expanded={showNotifications}
          >
            <Bell className="h-4 w-4" />
            <span
              className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-teal-600 ring-2 ring-white"
              aria-hidden="true"
            />
          </button>

          {showNotifications && (
            <div
              className="absolute right-0 mt-2 w-80 rounded-lg border border-slate-200 bg-white p-3 shadow-lg z-50 text-slate-800 animate-in fade-in-50 zoom-in-95"
              role="dialog"
              aria-label="Health Center notifications"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-semibold text-slate-900">Notifications</span>
                <span className="text-[10px] text-teal-700 font-medium">BHCMS System</span>
              </div>
              <div className="py-5 text-center text-slate-500">
                <CheckCircle2 className="mx-auto h-7 w-7 text-teal-600/70 mb-2 stroke-[1.5]" />
                <p className="text-xs font-medium text-slate-700">All caught up</p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  New clinical alerts, immunization schedules, and DOH advisories will appear here.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* User / Profile Area with Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-teal-600">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-700 text-white text-xs font-semibold shadow-2xs">
              AD
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 leading-tight">
                {DEFAULT_USER_PROFILE.name}
              </span>
              <span className="text-[10px] text-slate-500 font-medium leading-tight">
                {DEFAULT_USER_PROFILE.healthCenter}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-0.5">
                <p className="text-xs font-semibold text-slate-900">{DEFAULT_USER_PROFILE.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{DEFAULT_USER_PROFILE.email}</p>
                <p className="text-[10px] text-teal-700 font-medium">{DEFAULT_USER_PROFILE.healthCenter}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Profile item */}
            <DropdownMenuItem onClick={() => setShowProfileModal(true)}>
              <User className="h-3.5 w-3.5 text-slate-500" />
              <span>Profile</span>
            </DropdownMenuItem>

            {/* Settings item */}
            <Link href="/settings" className="w-full">
              <DropdownMenuItem>
                <SettingsIcon className="h-3.5 w-3.5 text-slate-500" />
                <span>Settings</span>
              </DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator />

            {/* Logout item */}
            <DropdownMenuItem
              onClick={() => setShowLogoutConfirm(true)}
              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 focus:bg-rose-50 focus:text-rose-700"
            >
              <LogOut className="h-3.5 w-3.5 text-rose-600" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* User Profile Details Modal (Frontend-only) */}
      {showProfileModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-teal-700" />
                <h3 id="profile-modal-title" className="text-sm font-bold text-slate-900">
                  User Profile Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-700 text-white font-bold text-sm">
                  AD
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">{DEFAULT_USER_PROFILE.name}</h4>
                  <p className="text-xs text-teal-700 font-medium">{DEFAULT_USER_PROFILE.roleTitle}</p>
                  <p className="text-[11px] text-slate-500">{DEFAULT_USER_PROFILE.email}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Role:</span>
                  <span className="font-medium text-slate-800">Administrator</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Health Station:</span>
                  <span className="font-medium text-slate-800">{DEFAULT_USER_PROFILE.healthCenter}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Assigned Unit:</span>
                  <span className="font-medium text-slate-800">{DEFAULT_USER_PROFILE.assignedStation}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Authentication:</span>
                  <span className="font-medium text-teal-700">Frontend Mock (Clerk pending)</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog Modal */}
      {showLogoutConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="header-logout-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-5 shadow-xl text-slate-900">
            <h3 id="header-logout-title" className="text-base font-semibold text-slate-900">
              Confirm Sign Out
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Are you sure you want to sign out of the Barangay Health Care Management System?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
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
    </header>
  );
}
