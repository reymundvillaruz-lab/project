"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  Building,
  CheckCircle2,
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
  const [showNotifications, setShowNotifications] = React.useState(false);

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

      </div>
    </header>
  );
}
