"use client";

import * as React from "react";
import { Printer, Download, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Prescription } from "@/types/pharmacy";
import { getPrescriptionItems } from "@/lib/pharmacy-utils";

interface PrintablePrescriptionSheetProps {
  prescription: Prescription;
  showPrintButton?: boolean;
  className?: string;
}

export function PrintablePrescriptionSheet({
  prescription,
  showPrintButton = true,
  className = "",
}: PrintablePrescriptionSheetProps) {
  const items = getPrescriptionItems(prescription);

  // Reference template has at least 5 rows in the medication table
  const totalRows = Math.max(5, items.length);
  const emptyRowsCount = Math.max(0, 5 - items.length);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* On-Screen Print Action Bar (Hidden in @media print) */}
      {showPrintButton && (
        <div className="w-full max-w-2xl flex items-center justify-between pb-3 mb-2 print:hidden">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span className="font-medium text-slate-700">Official Pharmaceutical Prescription Method</span>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handlePrint}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5 shadow-sm h-8"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Prescription
          </Button>
        </div>
      )}

      {/* Printable Sheet Pad Container */}
      <div
        id="printable-prescription-sheet"
        className="w-full max-w-2xl bg-white text-slate-800 rounded-xl shadow-lg border border-slate-200 p-8 sm:p-10 relative overflow-hidden print:shadow-none print:border-none print:m-0 print:p-6 print:max-w-none print:w-full"
        style={{
          minHeight: "750px",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {/* Top Header Background Waves (SVG replicating reference design) */}
        <div className="absolute top-0 right-0 left-0 h-44 pointer-events-none opacity-80 z-0">
          <svg
            viewBox="0 0 700 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full object-cover"
            preserveAspectRatio="none"
          >
            <path
              d="M0 0H700V70C580 120 460 30 320 80C180 130 90 90 0 130V0Z"
              fill="#EEF2FF"
            />
            <path
              d="M0 0H700V40C620 90 490 20 370 60C240 100 130 65 0 95V0Z"
              fill="#E0E7FF"
              fillOpacity="0.7"
            />
            <path
              d="M0 0H700V25C540 65 420 15 280 45C160 75 70 45 0 70V0Z"
              fill="#C7D2FE"
              fillOpacity="0.4"
            />
          </svg>
        </div>

        {/* Decorative Circles on Upper Left (matching reference image) */}
        <div className="absolute top-9 left-5 flex flex-col gap-1.5 z-10 opacity-70">
          <div className="w-2.5 h-2.5 rounded-full border-2 border-indigo-600 bg-transparent" />
          <div className="w-2.5 h-2.5 rounded-full border-2 border-indigo-600 bg-transparent" />
          <div className="w-2.5 h-2.5 rounded-full border-2 border-indigo-600 bg-transparent" />
        </div>

        {/* Decorative Circles on Upper Right (matching reference image) */}
        <div className="absolute top-9 right-8 flex flex-col gap-1.5 z-10 opacity-70">
          <div className="w-2.5 h-2.5 rounded-full border-2 border-indigo-600 bg-transparent" />
          <div className="w-2.5 h-2.5 rounded-full border-2 border-indigo-600 bg-transparent" />
          <div className="w-2.5 h-2.5 rounded-full border-2 border-indigo-600 bg-transparent" />
        </div>

        {/* Decorative Mid-Page Circles */}
        <div className="absolute left-6 top-[370px] flex flex-col gap-1.5 z-10 opacity-40">
          <div className="w-2 h-2 rounded-full border-2 border-indigo-400 bg-transparent" />
          <div className="w-2 h-2 rounded-full border-2 border-indigo-400 bg-transparent" />
          <div className="w-2 h-2 rounded-full border-2 border-indigo-400 bg-transparent" />
        </div>

        {/* Prescription Header Content */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pt-1 mb-7">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight leading-none">
              Medical<br />Prescription
            </h1>
            <p className="text-[11px] text-slate-500 max-w-sm pt-1 leading-relaxed">
              Barangay Health Center Primary Care Facility • Dedicated to community wellness and safe pharmaceutical dispensation.
            </p>
          </div>

          {/* Date Box (matching reference image) */}
          <div className="sm:self-end">
            <div className="inline-flex items-center gap-2 border-2 border-indigo-300 rounded-lg px-4 py-1.5 bg-white/90 shadow-2xs">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Date:</span>
              <span className="text-xs font-bold text-slate-900 font-mono">
                {prescription.date || new Date().toISOString().split("T")[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Patient Information Section (Exact fields from reference template) */}
        <div className="relative z-10 space-y-2.5 mb-7 text-xs text-slate-700 bg-white/60 backdrop-blur-2xs rounded-lg p-1">
          {/* Patient's Name */}
          <div className="flex items-baseline gap-2 border-b border-dotted border-slate-300 pb-1">
            <span className="font-semibold text-slate-600 min-w-[100px]">Patient&apos;s Name:</span>
            <span className="font-bold text-slate-900 text-sm tracking-wide">
              {prescription.patientName}
            </span>
            {prescription.patientContact && (
              <span className="text-slate-500 font-normal ml-auto text-[11px]">
                Tel: {prescription.patientContact}
              </span>
            )}
          </div>

          {/* Date of Birth, Age, Sex, Occupation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-dotted border-slate-300 pb-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-slate-600">Date of Birth:</span>
              <span className="font-medium text-slate-900">
                {prescription.dateOfBirth || "N/A"}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-slate-600">Age:</span>
              <span className="font-medium text-slate-900">
                {prescription.age !== undefined && prescription.age !== null ? `${prescription.age}` : "N/A"}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-slate-600">Sex:</span>
              <span className="font-medium text-slate-900">
                {prescription.sex || "N/A"}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 truncate">
              <span className="font-semibold text-slate-600">Occupation:</span>
              <span className="font-medium text-slate-900 truncate">
                {prescription.occupation || "N/A"}
              </span>
            </div>
          </div>

          {/* Health Insurance Number, Health Care Provider */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-b border-dotted border-slate-300 pb-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-slate-600">Health Insurance Number:</span>
              <span className="font-mono font-medium text-slate-900">
                {prescription.healthInsuranceNumber || "None / Direct Patient"}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-slate-600">Health Care Provider:</span>
              <span className="font-medium text-slate-900 truncate">
                {prescription.healthCareProvider || prescription.prescriber || "Barangay Health Center"}
              </span>
            </div>
          </div>

          {/* Health Card Number, Patient ID Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-b border-dotted border-slate-300 pb-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-slate-600">Health Card Number:</span>
              <span className="font-mono font-medium text-slate-900">
                {prescription.healthCardNumber || "N/A"}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-slate-600">Patient ID Number:</span>
              <span className="font-mono font-bold text-indigo-900">
                {prescription.patientIdNumber || prescription.patientId || prescription.id}
              </span>
            </div>
          </div>
        </div>

        {/* Prescription Table: Drugs | Unit (Tablet/Syrup) | Dosage (Per Day) */}
        {/* Exact 3-column table with rounded corners from the reference image */}
        <div className="relative z-10 mb-8">
          <div className="rounded-xl border-2 border-indigo-300 overflow-hidden bg-white shadow-2xs">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-indigo-300 bg-indigo-50/70 text-indigo-900 text-xs font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-4 w-[48%] border-r-2 border-indigo-300 text-left">
                    Drugs
                  </th>
                  <th className="py-2.5 px-3 w-[24%] border-r-2 border-indigo-300 text-center">
                    Unit (Tablet/Syrup)
                  </th>
                  <th className="py-2.5 px-4 w-[28%] text-left">
                    Dosage (Per Day)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-200/80 text-xs text-slate-800">
                {items.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-indigo-50/20 transition-colors">
                    <td className="py-3 px-4 border-r-2 border-indigo-200 align-top">
                      <div className="font-bold text-slate-900 text-[13px]">{item.drug}</div>
                      {item.quantity && (
                        <span className="inline-block mt-0.5 text-[10px] text-slate-500 font-medium">
                          Dispense: {item.quantity} units
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 border-r-2 border-indigo-200 text-center font-medium text-slate-700 align-top">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                        {item.unit || "Tablet"}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 align-top leading-relaxed">
                      {item.dosagePerDay}
                    </td>
                  </tr>
                ))}

                {/* Empty Rows to match the printable pad template aesthetics */}
                {Array.from({ length: emptyRowsCount }).map((_, i) => (
                  <tr key={`empty-${i}`} className="h-10">
                    <td className="py-3 px-4 border-r-2 border-indigo-200">&nbsp;</td>
                    <td className="py-3 px-3 border-r-2 border-indigo-200">&nbsp;</td>
                    <td className="py-3 px-4">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Special Instructions / Notes section */}
        {prescription.notes && (
          <div className="relative z-10 mb-8 p-3 rounded-lg border border-indigo-100 bg-indigo-50/30 text-xs">
            <span className="font-semibold text-indigo-900 block mb-0.5">Special Instructions / Precautions:</span>
            <p className="text-slate-700 italic leading-relaxed">{prescription.notes}</p>
          </div>
        )}

        {/* Bottom Section: Doctor's Signature (Matching reference image bottom right) */}
        <div className="relative z-10 flex flex-col sm:flex-row items-end justify-between pt-6 mt-auto">
          {/* Prescription Status & ID stamp */}
          <div className="text-[11px] text-slate-400 font-mono mb-4 sm:mb-0 space-y-0.5">
            <div>Rx Reference ID: <span className="font-semibold text-slate-600">{prescription.id}</span></div>
            <div>Facility: Barangay Health Center Primary Care Station</div>
            {prescription.status === "Dispensed" && (
              <div className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1">
                <CheckCircle2 className="h-3 w-3" />
                Dispensed on {prescription.dispensedDate || prescription.date}
              </div>
            )}
          </div>

          {/* Doctor's Signature block */}
          <div className="flex flex-col items-center text-center min-w-[220px]">
            {/* Signature line */}
            <div className="w-56 border-b-2 border-indigo-300 pb-1 mb-1" />
            <span className="text-xs font-semibold text-slate-700 tracking-wide">
              Doctor&apos;s Signature
            </span>
            <span className="text-xs font-bold text-indigo-950 mt-0.5">
              {prescription.prescriber || "Attending Health Center Physician"}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {prescription.doctorLicenseNumber || "Lic. No. PRC-0089241"}
              {prescription.doctorPtrNumber ? ` • PTR: ${prescription.doctorPtrNumber}` : ""}
            </span>
          </div>
        </div>

        {/* Bottom Wave Background (reproducing bottom curves from reference image) */}
        <div className="absolute bottom-0 right-0 left-0 h-28 pointer-events-none opacity-80 z-0">
          <svg
            viewBox="0 0 700 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full object-cover"
            preserveAspectRatio="none"
          >
            <path
              d="M0 60C140 20 280 80 440 40C560 10 640 50 700 30V120H0V60Z"
              fill="#EEF2FF"
            />
            <path
              d="M0 80C160 40 300 95 460 60C580 30 650 70 700 50V120H0V80Z"
              fill="#E0E7FF"
              fillOpacity="0.7"
            />
          </svg>
        </div>

        {/* Bottom decorative dots */}
        <div className="absolute bottom-4 right-6 flex flex-col gap-1.5 z-10 opacity-50">
          <div className="w-2 h-2 rounded-full border-2 border-indigo-500 bg-transparent" />
          <div className="w-2 h-2 rounded-full border-2 border-indigo-500 bg-transparent" />
          <div className="w-2 h-2 rounded-full border-2 border-indigo-500 bg-transparent" />
        </div>
      </div>

      {/* Embedded Print CSS to guarantee clean 1:1 printing */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-prescription-sheet,
          #printable-prescription-sheet * {
            visibility: visible;
          }
          #printable-prescription-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4 portrait;
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
}
