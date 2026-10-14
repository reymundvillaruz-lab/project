import * as React from "react";
import {
  FileText,
  Printer,
  Download,
  X,
  Building,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ComprehensiveReportData } from "@/types/reports";

interface ViewReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportData: ComprehensiveReportData;
  onExport: () => void;
  onPrint: () => void;
}

export function ViewReportDialog({
  open,
  onOpenChange,
  reportData,
  onExport,
  onPrint,
}: ViewReportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-4xl">
        <DialogHeader className="border-b border-slate-200 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 border border-teal-200 text-teal-700">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle>
                  Official Health Summary Report (DOH FHSIS Format)
                </DialogTitle>
                <DialogDescription>
                  {reportData.facilityName} &bull; Reporting Period: {reportData.period.label}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="h-8 text-xs gap-1.5"
              >
                <Download className="h-3.5 w-3.5 text-teal-700" />
                Export CSV
              </Button>
              <Button
                size="sm"
                onClick={onPrint}
                className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs h-8 gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Printable Official Document Content */}
        <div className="px-6 py-5 space-y-6 max-h-[72vh] overflow-y-auto text-xs bg-white text-slate-800 font-sans print:p-0 print:max-h-none">
          {/* Official Letterhead */}
          <div className="text-center space-y-1 pb-4 border-b-2 border-slate-900">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
              Republic of the Philippines &bull; Department of Health
            </p>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">
              Barangay Health Care Management System (BHCMS)
            </h2>
            <p className="text-xs font-medium text-teal-900">
              Primary Care Public Health Summary &bull; Field Health Services Information System (FHSIS)
            </p>
            <div className="flex justify-center items-center gap-6 pt-2 text-[11px] text-slate-500 font-mono">
              <span>Period: <strong>{reportData.period.label}</strong></span>
              <span>&bull;</span>
              <span>Generated: <strong>{reportData.generatedDate}</strong></span>
              <span>&bull;</span>
              <span>Facility: <strong>{reportData.facilityName}</strong></span>
            </div>
          </div>

          {/* Section 1: Demographics & Consultations */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-bold uppercase tracking-wider text-[11px] text-teal-900 border-b border-teal-200 pb-1">
                1. Patient Demographics &amp; Coverage
              </h3>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-slate-100 py-1">
                    <td className="py-1 text-slate-600">Total Registered Catchment</td>
                    <td className="py-1 text-right font-bold">{reportData.patients.totalRegistered.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b border-slate-100 py-1">
                    <td className="py-1 text-slate-600">Under 5 Years Old (0-59m)</td>
                    <td className="py-1 text-right font-mono">{reportData.patients.demographics.under5.count} ({reportData.patients.demographics.under5.percentage}%)</td>
                  </tr>
                  <tr className="border-b border-slate-100 py-1">
                    <td className="py-1 text-slate-600">Women of Reproductive Age (15-49)</td>
                    <td className="py-1 text-right font-mono">{reportData.patients.demographics.womenReproductiveAge.count} ({reportData.patients.demographics.womenReproductiveAge.percentage}%)</td>
                  </tr>
                  <tr className="border-b border-slate-100 py-1">
                    <td className="py-1 text-slate-600">Senior Citizens (60+ yrs)</td>
                    <td className="py-1 text-right font-mono">{reportData.patients.demographics.seniors.count} ({reportData.patients.demographics.seniors.percentage}%)</td>
                  </tr>
                  <tr className="py-1">
                    <td className="py-1 text-slate-600">PhilHealth Covered Members</td>
                    <td className="py-1 text-right font-bold text-teal-800">{reportData.patients.socialCoverage.philhealthMembers.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold uppercase tracking-wider text-[11px] text-teal-900 border-b border-teal-200 pb-1">
                2. Clinical Consultations &amp; Triage
              </h3>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-slate-100 py-1">
                    <td className="py-1 text-slate-600">Total Encounters in Period</td>
                    <td className="py-1 text-right font-bold">{reportData.consultations.totalConsultations.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b border-slate-100 py-1">
                    <td className="py-1 text-slate-600">Routine Visits</td>
                    <td className="py-1 text-right font-mono">{reportData.consultations.triageLevels.routine.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b border-slate-100 py-1">
                    <td className="py-1 text-slate-600">Priority Cases</td>
                    <td className="py-1 text-right font-mono">{reportData.consultations.triageLevels.priority.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b border-slate-100 py-1">
                    <td className="py-1 text-slate-600">Urgent / Emergency</td>
                    <td className="py-1 text-right font-mono text-rose-700 font-bold">{reportData.consultations.triageLevels.urgent}</td>
                  </tr>
                  <tr className="py-1">
                    <td className="py-1 text-slate-600">Hospital Referrals</td>
                    <td className="py-1 text-right font-mono">{reportData.consultations.outcomes.referredHospital}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Immunization & Maternal Care */}
          <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-200">
            <div className="space-y-2">
              <h3 className="font-bold uppercase tracking-wider text-[11px] text-teal-900 border-b border-teal-200 pb-1">
                3. Immunization (EPI) Coverage
              </h3>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-slate-100 py-1">
                    <td className="py-1 text-slate-600">Target Infant Population</td>
                    <td className="py-1 text-right font-bold">{reportData.immunizations.targetInfants}</td>
                  </tr>
                  <tr className="border-b border-slate-100 py-1">
                    <td className="py-1 text-slate-600">Fully Immunized Children (FIC)</td>
                    <td className="py-1 text-right font-bold text-emerald-800">{reportData.immunizations.fullyImmunizedChildren} ({reportData.immunizations.ficCoverageRate}%)</td>
                  </tr>
                  <tr className="border-b border-slate-100 py-1">
                    <td className="py-1 text-slate-600">BCG Vaccination Rate</td>
                    <td className="py-1 text-right font-mono">
                      {reportData.immunizations.antigens.find((a) =>
                        a.antigen.includes("BCG")
                      )?.coveragePercentage ?? 0}%
                    </td>
                  </tr>
                  <tr className="py-1">
                    <td className="py-1 text-slate-600">Defaulter / Dropout Rate</td>
                    <td className="py-1 text-right font-mono text-slate-700">{reportData.immunizations.defaulterRate}% (&lt;5% Target)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold uppercase tracking-wider text-[11px] text-teal-900 border-b border-teal-200 pb-1">
                4. Maternal Health &amp; Safe Motherhood
              </h3>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-slate-100 py-1">
                    <td className="py-1 text-slate-600">Expected Pregnancies</td>
                    <td className="py-1 text-right font-bold">{reportData.maternalCare.totalExpectedPregnancies}</td>
                  </tr>
                  <tr className="border-b border-slate-100 py-1">
                    <td className="py-1 text-slate-600">ANC 4+ Visits Completed</td>
                    <td className="py-1 text-right font-bold text-emerald-800">{reportData.maternalCare.fourOrMoreAntenatalVisits}</td>
                  </tr>
                  <tr className="border-b border-slate-100 py-1">
                    <td className="py-1 text-slate-600">High-Risk Pregnancies Managed</td>
                    <td className="py-1 text-right font-mono text-rose-700 font-bold">{reportData.maternalCare.highRiskPregnanciesIdentified}</td>
                  </tr>
                  <tr className="py-1">
                    <td className="py-1 text-slate-600">Facility-Based Delivery Rate</td>
                    <td className="py-1 text-right font-bold text-teal-800">{reportData.maternalCare.facilityBasedDeliveryRate}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Family Planning, Appointments & Pharmacy */}
          <div className="grid grid-cols-3 gap-6 pt-2 border-t border-slate-200">
            <div className="space-y-2">
              <h3 className="font-bold uppercase tracking-wider text-[11px] text-teal-900 border-b border-teal-200 pb-1">
                5. Family Planning
              </h3>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-slate-100 py-1">
                    <td className="py-1 text-slate-600">Active Users</td>
                    <td className="py-1 text-right font-bold">{reportData.familyPlanning.totalCurrentUsers}</td>
                  </tr>
                  <tr className="border-b border-slate-100 py-1">
                    <td className="py-1 text-slate-600">New Acceptors</td>
                    <td className="py-1 text-right font-mono text-emerald-700">+{reportData.familyPlanning.newAcceptors}</td>
                  </tr>
                  <tr className="py-1">
                    <td className="py-1 text-slate-600">Unmet Need</td>
                    <td className="py-1 text-right font-mono">{reportData.familyPlanning.unmetNeedPercentage}%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold uppercase tracking-wider text-[11px] text-teal-900 border-b border-teal-200 pb-1">
                6. Appointments
              </h3>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-slate-100 py-1">
                    <td className="py-1 text-slate-600">Total Booked</td>
                    <td className="py-1 text-right font-bold">{reportData.appointments.totalScheduled}</td>
                  </tr>
                  <tr className="border-b border-slate-100 py-1">
                    <td className="py-1 text-slate-600">Completed Visits</td>
                    <td className="py-1 text-right font-bold text-emerald-800">{reportData.appointments.completedVisits}</td>
                  </tr>
                  <tr className="py-1">
                    <td className="py-1 text-slate-600">Completion Rate</td>
                    <td className="py-1 text-right font-mono">{reportData.appointments.completionRate}%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold uppercase tracking-wider text-[11px] text-teal-900 border-b border-teal-200 pb-1">
                7. Pharmacy &amp; Medicines
              </h3>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-slate-100 py-1">
                    <td className="py-1 text-slate-600">Prescriptions Issued</td>
                    <td className="py-1 text-right font-bold">{reportData.medicines.totalPrescriptionsIssued}</td>
                  </tr>
                  <tr className="border-b border-slate-100 py-1">
                    <td className="py-1 text-slate-600">Dispensed &amp; Released</td>
                    <td className="py-1 text-right font-bold text-teal-800">{reportData.medicines.totalPrescriptionsDispensed}</td>
                  </tr>
                  <tr className="py-1">
                    <td className="py-1 text-slate-600">Fulfillment Rate</td>
                    <td className="py-1 text-right font-mono">{reportData.medicines.dispensationFulfillmentRate}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Official Sign-off Certification */}
          <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-12 text-center text-xs">
            <div className="space-y-1">
              <div className="border-b border-slate-800 pb-1 font-semibold text-slate-900">
                Public Health Nurse (PHN)
              </div>
              <p className="text-[11px] text-slate-500">Clinic Coordinator / Field Health Services</p>
            </div>
            <div className="space-y-1">
              <div className="border-b border-slate-800 pb-1 font-semibold text-slate-900">
                {reportData.healthOfficer}
              </div>
              <p className="text-[11px] text-slate-500">Attending Health Officer &bull; Primary Health Care</p>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Close
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onPrint}
            className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
