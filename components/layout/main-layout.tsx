"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { TopHeader } from "./top-header";
import { MobileNav } from "./mobile-nav";
import { cn } from "@/lib/utils";
import { PharmacyProvider } from "@/context/pharmacy-context";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  const toggleSidebarCollapse = React.useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  return (
    <PharmacyProvider>
      <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        {/* Desktop Persistent Sidebar */}
        <div
          className={cn(
            "hidden lg:flex lg:shrink-0 lg:fixed lg:inset-y-0 lg:z-40 transition-all duration-300 ease-in-out",
            isSidebarCollapsed ? "lg:w-[72px]" : "lg:w-64"
          )}
        >
          <Sidebar
            className="w-full"
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={toggleSidebarCollapse}
          />
        </div>

        {/* Mobile Responsive Navigation Drawer (Sheet) */}
        <MobileNav
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Main Layout Area: Header + Content + Footer */}
        <div
          className={cn(
            "flex flex-1 flex-col min-w-0 transition-all duration-300 ease-in-out",
            isSidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-64"
          )}
        >
          {/* Top Header */}
          <TopHeader
            onMobileMenuOpen={() => setMobileMenuOpen(true)}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebarCollapse={toggleSidebarCollapse}
          />

          {/* Dynamic Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>

        {/* Professional Healthcare Footer */}
        <footer className="border-t border-slate-200 bg-white px-4 py-3 text-center text-xs text-slate-500">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row">
            <span>
              Barangay Health Care Management System (BHCMS) &bull; Republic of the Philippines
            </span>
            <span className="text-[11px] text-slate-400">
              Department of Health Primary Care Standards &bull; Confidential Patient Records
            </span>
          </div>
        </footer>
      </div>
    </div>
  </PharmacyProvider>
);
}
