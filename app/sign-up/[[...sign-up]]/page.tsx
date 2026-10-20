import { SignUp } from "@clerk/nextjs";
import { Activity, ShieldCheck, Building2 } from "lucide-react";

export default function SignUpPage() {
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

      {/* Main Centered Authentication Section */}
      <div className="my-auto py-8 flex flex-col items-center justify-center">
        <div className="text-center mb-6 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-900/40 border border-teal-600/40 text-teal-300 text-xs font-medium mb-3">
            <Building2 className="h-3.5 w-3.5" />
            <span>Health Staff Registration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create an Account
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Register your healthcare staff or administrator account to access BHCMS.
          </p>
        </div>

        {/* Clerk Sign-up Component */}
        <div className="w-full flex justify-center">
          <SignUp
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
              },
            }}
          />
        </div>
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
