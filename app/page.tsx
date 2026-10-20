import { auth, currentUser } from "@clerk/nextjs/server";
import { SignIn, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  Activity,
  ShieldCheck,
  Building2,
  ArrowRight,
  LogOut,
  UserCheck,
  CheckCircle2,
} from "lucide-react";

export default async function HomePage() {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Top Bar Branding */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white font-bold shadow-lg shadow-teal-900/40">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">BHCMS</span>
            <p className="text-xs text-slate-400">Barangay Health Care Management System</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 border border-slate-700/60 px-3 py-1.5 rounded-full">
          <ShieldCheck className="h-4 w-4 text-teal-400" />
          <span>DOH Primary Health Care Standards</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="my-auto py-8 flex flex-col items-center justify-center">
        {userId && user ? (
          /* When Already Authenticated: Show Administrator Account Gate */
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-900/50 border border-teal-500/40 text-teal-300 text-xs font-semibold mb-3">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" />
                <span>Account Verified</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Health Center Portal
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                You are currently authenticated with administrative access.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/95 backdrop-blur-md p-6 text-slate-100 shadow-2xl">
              {/* User Account Info */}
              <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-800">
                {user.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || "User Avatar"}
                    className="h-14 w-14 rounded-full ring-2 ring-teal-500/50 object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-700 text-white font-bold text-xl ring-2 ring-teal-500/50">
                    <UserCheck className="h-7 w-7" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-base truncate">
                      {user.fullName || user.username || "Authorized User"}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      Admin
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {user.emailAddresses?.[0]?.emailAddress}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] text-teal-400">
                    <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse"></span>
                    <span>Ready to access clinic operations</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 shadow-lg shadow-teal-900/40 transition-all text-sm group"
                >
                  <span>Proceed to Dashboard</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <div className="pt-2 text-center">
                  <SignOutButton redirectUrl="/">
                    <button className="text-xs text-slate-400 hover:text-red-400 transition-colors py-2 px-3 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-800/40 w-full flex items-center justify-center gap-2">
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out / Switch Account</span>
                    </button>
                  </SignOutButton>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* When Not Authenticated: Render Login Form Directly */
          <div className="w-full flex flex-col items-center">
            <div className="text-center mb-6 max-w-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-900/40 border border-teal-600/40 text-teal-300 text-xs font-medium mb-3">
                <Building2 className="h-3.5 w-3.5" />
                <span>Health Center Administration</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Sign In to BHCMS
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                Access confidential patient records, consultations, immunization schedules, and inventory.
              </p>
            </div>

            {/* Clerk Sign-in Component */}
            <div className="w-full flex justify-center">
              <SignIn
                routing="hash"
                forceRedirectUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: "w-full max-w-md",
                    card: "shadow-2xl rounded-2xl border border-slate-700/80 bg-slate-900/95 backdrop-blur-md text-slate-100",
                    headerTitle: "text-white font-bold",
                    headerSubtitle: "text-slate-400 text-sm",
                    socialButtonsBlockButton: "border-slate-700 text-slate-200 hover:bg-slate-800",
                    formButtonPrimary: "bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-colors",
                    formFieldLabel: "text-slate-300",
                    formFieldInput: "bg-slate-800 border-slate-700 text-white focus:border-teal-500 focus:ring-teal-500",
                    footerActionText: "text-slate-400",
                    footerActionLink: "text-teal-400 hover:text-teal-300",
                    identityPreviewText: "text-slate-200",
                    identityPreviewEditButtonIcon: "text-teal-400",
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Security & Regulatory Footer */}
      <footer className="w-full max-w-4xl mx-auto text-center py-4 text-xs text-slate-400 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Republic of the Philippines &bull; Department of Health Primary Care</span>
          <span>Confidential Clinical System &bull; RA 10173 Data Privacy Act</span>
        </div>
      </footer>
    </div>
  );
}
