"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  Building,
  CheckCircle2,
  Pill,
  Calendar,
  HeartPulse,
  Syringe,
  Settings as SettingsIcon,
  CheckCheck,
  X,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DEFAULT_USER_PROFILE } from "@/lib/data/empty-data";
import { UserButton } from "@clerk/nextjs";
import { useSettings } from "@/context/settings-context";
import { getStoredPharmacyMedicines } from "@/context/pharmacy-context";
import { getStoredAppointments } from "@/lib/appointment-utils";
import { getInitialMaternalRecords } from "@/lib/mock-data/maternal-care";
import { getStoredImmunizationRecords } from "@/components/immunization/types";

interface TopHeaderProps {
  onMobileMenuOpen: () => void;
  title?: string;
  breadcrumbItems?: Array<{ label: string; href?: string }>;
}

export function TopHeader({
  onMobileMenuOpen,
  title,
  breadcrumbItems,
}: TopHeaderProps) {
  const pathname = usePathname();
  const { healthCenter, notificationSettings } = useSettings();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [dismissedIds, setDismissedIds] = React.useState<string[]>([]);
  const popoverRef = React.useRef<HTMLDivElement | null>(null);

  // Close notifications popover on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  // Compute live functional notifications based on user's notificationSettings
  const notifications = React.useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      description: string;
      href: string;
      badgeText: string;
      category: "pharmacy" | "appointments" | "maternal" | "immunization";
    }> = [];

    // 1. Pharmacy Low Stock Alert
    if (notificationSettings.lowStockPharmacyAlerts) {
      const meds = getStoredPharmacyMedicines();
      const lowStock = meds.filter(
        (m) => m.availableQuantity <= (m.reorderLevel || 20) || m.status === "Low Stock"
      );
      if (lowStock.length > 0) {
        list.push({
          id: "alert-low-stock",
          title: "Low Medicine Stock",
          description: `${lowStock.length} pharmaceutical item(s) are at or below reorder threshold.`,
          href: "/medicines",
          badgeText: "Stock Alert",
          category: "pharmacy",
        });
      }
    }

    // 2. Appointments / Follow-ups Scheduled Today
    if (notificationSettings.followUpDueAlerts) {
      const apts = getStoredAppointments();
      const today = new Date().toISOString().split("T")[0];
      const todayApts = apts.filter(
        (a) => a.date === today && a.status !== "Cancelled" && a.status !== "Completed"
      );
      if (todayApts.length > 0) {
        list.push({
          id: "alert-today-apts",
          title: "Appointments Scheduled Today",
          description: `${todayApts.length} patient visit(s) scheduled for consultation today.`,
          href: "/appointments",
          badgeText: "Due Today",
          category: "appointments",
        });
      }
    }

    // 3. High Risk Maternal Follow-ups
    if (notificationSettings.highRiskMaternalAlerts) {
      const maternalRecords = getInitialMaternalRecords();
      const highRisk = maternalRecords.filter(
        (r) => r.status === "Follow-up Due" || (r.age !== undefined && (r.age < 18 || r.age >= 35))
      );
      if (highRisk.length > 0) {
        list.push({
          id: "alert-maternal",
          title: "Maternal Care Attention",
          description: `${highRisk.length} active prenatal patient(s) have visits due or high-risk flags.`,
          href: "/maternal-care",
          badgeText: "Follow-up Due",
          category: "maternal",
        });
      }
    }

    // 4. Immunization Defaulters / Overdue Vaccines
    if (notificationSettings.immunizationDefaulterAlerts) {
      const nipRecords = getStoredImmunizationRecords();
      const overdue = nipRecords.filter((r) =>
        Object.values(r.vaccines || {}).some((v) => v?.status === "Overdue")
      );
      if (overdue.length > 0) {
        list.push({
          id: "alert-nip-overdue",
          title: "Immunization Overdue",
          description: `${overdue.length} infant/child patient(s) have overdue NIP vaccine schedules.`,
          href: "/immunization",
          badgeText: "Overdue",
          category: "immunization",
        });
      }
    }

    return list.filter((n) => !dismissedIds.includes(n.id));
  }, [notificationSettings, dismissedIds]);

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
          <span className="font-medium text-slate-700">{healthCenter.name}</span>
        </div>

        {/* Notification Button & Popover */}
        <div className="relative" ref={popoverRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            aria-label="View notifications"
            aria-expanded={showNotifications}
          >
            <Bell className="h-4 w-4" />
            {notifications.length > 0 && (
              <span
                className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white shadow-xs animate-in zoom-in"
                aria-hidden="true"
              >
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white shadow-xl z-50 text-slate-800 animate-in fade-in-50 zoom-in-95 overflow-hidden"
              role="dialog"
              aria-label="Health Center notifications"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  {notifications.length > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 font-bold">
                      {notifications.length} new
                    </span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setDismissedIds((prev) => [...prev, ...notifications.map((n) => n.id)])}
                    className="text-[11px] text-slate-500 hover:text-teal-800 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="h-3 w-3" />
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100">
                {notifications.length > 0 ? (
                  notifications.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setShowNotifications(false)}
                      className="p-3.5 flex items-start gap-3 hover:bg-slate-50/80 transition-colors block text-left"
                    >
                      <div
                        className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          item.category === "pharmacy"
                            ? "bg-amber-100 text-amber-800"
                            : item.category === "appointments"
                            ? "bg-teal-100 text-teal-800"
                            : item.category === "maternal"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-indigo-100 text-indigo-800"
                        }`}
                      >
                        {item.category === "pharmacy" ? (
                          <Pill className="h-4 w-4" />
                        ) : item.category === "appointments" ? (
                          <Calendar className="h-4 w-4" />
                        ) : item.category === "maternal" ? (
                          <HeartPulse className="h-4 w-4" />
                        ) : (
                          <Syringe className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-xs text-slate-900 truncate">
                            {item.title}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 shrink-0">
                            {item.badgeText}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="py-7 px-4 text-center text-slate-500">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-teal-600/70 mb-2 stroke-[1.5]" />
                    <p className="text-xs font-semibold text-slate-800">All caught up!</p>
                    <p className="mt-1 text-[11px] text-slate-400 max-w-[240px] mx-auto">
                      No pending critical alerts for today. Alert channels can be customized in settings.
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 bg-slate-50 px-3 py-2 flex items-center justify-between">
                <Link
                  href="/settings"
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] text-teal-700 hover:text-teal-900 font-medium flex items-center gap-1.5"
                >
                  <SettingsIcon className="h-3 w-3" />
                  Notification Preferences
                </Link>
                <span className="text-[10px] font-mono text-slate-400">Station Alert Engine</span>
              </div>
            </div>
          )}
        </div>

        {/* User Account Profile */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-2 sm:pl-3 ml-1">
          <UserButton />
        </div>

      </div>
    </header>
  );
}
