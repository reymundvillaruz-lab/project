import type { Metadata } from "next";
import "./globals.css";
import { MainLayout } from "@/components/layout/main-layout";

export const metadata: Metadata = {
  title: "BHCMS - Barangay Health Care Management System",
  description:
    "Barangay Health Care Management System (BHCMS) for primary health centers, patient registry, consultations, maternal care, and immunization tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
