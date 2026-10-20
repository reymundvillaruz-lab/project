"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Sidebar } from "./sidebar";
import { TopHeader } from "./top-header";
import { MobileNav } from "./mobile-nav";
import { cn } from "@/lib/utils";
import { PharmacyProvider } from "@/context/pharmacy-context";
import { SettingsProvider } from "@/context/settings-context";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isAuthPage =
    pathname === "/" ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up");

  // Automatically redirect unauthenticated users away from the dashboard to the login portal
  React.useEffect(() => {
    if (isLoaded && !isSignedIn && !isAuthPage) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, isAuthPage, router]);

  // Auth pages render standalone without dashboard shell
  if (isAuthPage) {
    return <main className="min-h-screen">{children}</main>;
  }

  // Loading state while checking authentication
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
          <p className="text-xs text-slate-400 font-medium">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <SettingsProvider>
      <PharmacyProvider>
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
          {/* Desktop Persistent Sidebar */}
          <div className="hidden lg:flex lg:shrink-0 lg:fixed lg:inset-y-0 lg:z-40 lg:w-64">
            <Sidebar className="w-full" />
          </div>

          {/* Mobile Responsive Navigation Drawer (Sheet) */}
          <MobileNav
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />

          {/* Main Layout Area: Header + Content + Footer */}
          <div className="flex flex-1 flex-col min-w-0 lg:pl-64">
            {/* Top Header */}
            <TopHeader onMobileMenuOpen={() => setMobileMenuOpen(true)} />

            {/* Dynamic Page Content */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              <div className="mx-auto max-w-7xl">{children}</div>
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
    </SettingsProvider>
  );
}
