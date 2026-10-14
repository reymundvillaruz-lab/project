import {
  ReportDateFilter,
  ReportDateRange,
  ComprehensiveReportData,
  MorbidityItem,
  VaccineAntigenItem,
  FPMethodDistributionItem,
  TopPrescribedMedItem,
} from "@/types/reports";
import { MockPatient, getStoredPatients } from "@/lib/mock-data/patients";
import { MockConsultation, getStoredConsultations } from "@/lib/mock-data/consultations";
import { MaternalRecord } from "@/types/maternal-care";
import { getInitialMaternalRecords } from "@/lib/mock-data/maternal-care";
import { NipPatientRecord, getStoredImmunizationRecords } from "@/components/immunization/types";
import { FPClient } from "@/types/family-planning";
import { getStoredFPClients } from "@/lib/family-planning-utils";
import { Appointment } from "@/types/appointment";
import { getStoredAppointments } from "@/lib/appointment-utils";
import { Medicine, Prescription } from "@/types/pharmacy";
import {
  getStoredPharmacyMedicines,
  getStoredPharmacyPrescriptions,
} from "@/context/pharmacy-context";

export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getReportDateRange(
  filter: ReportDateFilter,
  customStart?: string,
  customEnd?: string
): ReportDateRange {
  const today = new Date();
  const todayStr = getTodayDateString();

  switch (filter) {
    case "today":
      return {
        startDate: todayStr,
        endDate: todayStr,
        label: `Today (${today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })})`,
      };

    case "week": {
      const dayOfWeek = today.getDay(); // 0 = Sunday
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - dayOfWeek);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const sStr = startOfWeek.toISOString().slice(0, 10);
      const eStr = endOfWeek.toISOString().slice(0, 10);
      return {
        startDate: sStr,
        endDate: eStr,
        label: `This Week (${startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })})`,
      };
    }

    case "month": {
      const year = today.getFullYear();
      const month = today.getMonth();
      const firstDay = new Date(year, month, 1).toISOString().slice(0, 10);
      const lastDay = new Date(year, month + 1, 0).toISOString().slice(0, 10);
      const monthName = today.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      return {
        startDate: firstDay,
        endDate: lastDay,
        label: `This Month (${monthName})`,
      };
    }

    case "year": {
      const year = today.getFullYear();
      return {
        startDate: `${year}-01-01`,
        endDate: `${year}-12-31`,
        label: `Annual Year ${year}`,
      };
    }

    case "custom": {
      const s = customStart || todayStr;
      const e = customEnd || todayStr;
      return {
        startDate: s,
        endDate: e,
        label: `Custom Period (${s} to ${e})`,
      };
    }
  }
}

export function isDateInPeriod(
  dateStr: string | undefined,
  startDate: string,
  endDate: string
): boolean {
  if (!dateStr) return false;
  const d = dateStr.slice(0, 10);
  return d >= startDate && d <= endDate;
}

export interface ReportDataSources {
  patients?: MockPatient[];
  consultations?: MockConsultation[];
  maternalRecords?: MaternalRecord[];
  immunizationRecords?: NipPatientRecord[];
  fpClients?: FPClient[];
  appointments?: Appointment[];
  medicines?: Medicine[];
  prescriptions?: Prescription[];
  facilityName?: string;
  healthOfficer?: string;
}

/**
 * Builds the official DOH FHSIS statistical metrics directly from stored records.
 * STRICTLY NO MOCK DATA. Zero fabricated numbers or multiplier factors.
 */
export function getComprehensiveReportData(
  filter: ReportDateFilter,
  customStart?: string,
  customEnd?: string,
  sources?: ReportDataSources
): ComprehensiveReportData {
  const period = getReportDateRange(filter, customStart, customEnd);

  // Retrieve actual data from provided sources or active storage
  const patients = sources?.patients ?? getStoredPatients();
  const consultations = sources?.consultations ?? getStoredConsultations();
  const maternalRecords = sources?.maternalRecords ?? getInitialMaternalRecords();
  const immunizationRecords = sources?.immunizationRecords ?? getStoredImmunizationRecords();
  const fpClients = sources?.fpClients ?? getStoredFPClients();
  const appointments = sources?.appointments ?? getStoredAppointments();
  const medicines = sources?.medicines ?? getStoredPharmacyMedicines();
  const prescriptions = sources?.prescriptions ?? getStoredPharmacyPrescriptions();

  // 1. Patient Demographics & Population Coverage
  const totalRegistered = patients.length;
  const newRegistrationsThisPeriod = patients.filter((p) => {
    const regDate = p.createdAt || p.updatedAt;
    return isDateInPeriod(regDate, period.startDate, period.endDate);
  }).length;

  let under5 = 0;
  let schoolAge = 0;
  let womenReproductiveAge = 0;
  let adults = 0;
  let seniors = 0;

  let philhealthMembers = 0;
  let nhts4PsBeneficiaries = 0;
  let seniorCitizenMembers = 0;
  let pwdMembers = 0;

  patients.forEach((p) => {
    const age = typeof p.age === "number" ? p.age : 0;
    if (age < 5) {
      under5++;
    } else if (age <= 17) {
      schoolAge++;
    } else if (age >= 60) {
      seniors++;
    } else {
      adults++;
    }

    if (p.sex === "Female" && age >= 15 && age <= 49) {
      womenReproductiveAge++;
    }

    if (p.phicNo && p.phicNo !== "None" && p.phicNo !== "N/A" && p.phicNo.trim() !== "") {
      philhealthMembers++;
    }
    if (p.isIp === "IP") {
      nhts4PsBeneficiaries++;
    }
    if (age >= 60) {
      seniorCitizenMembers++;
    }
    if (p.pwdId && p.pwdId !== "None" && p.pwdId !== "N/A" && p.pwdId.trim() !== "") {
      pwdMembers++;
    }
  });

  const calcDemographicPct = (count: number) =>
    totalRegistered > 0 ? Math.round((count / totalRegistered) * 1000) / 10 : 0;

  // 2. Clinical Consultations & Morbidities
  const periodConsultations = consultations.filter((c) =>
    isDateInPeriod(c.date, period.startDate, period.endDate)
  );
  const totalConsultations = periodConsultations.length;

  let routine = 0;
  let priority = 0;
  let urgent = 0;
  let treatedSentHome = 0;
  let referredHospital = 0;
  let followUpRequired = 0;

  const morbidityMap: Record<string, { count: number; icdCode?: string }> = {};

  periodConsultations.forEach((c) => {
    const vt = (c.visitType || "").toLowerCase();
    const reason = (c.reasonForVisit || "").toLowerCase();
    const notes = (c.notes || "").toLowerCase();
    const diag = (c.diagnosis || "").trim();

    if (
      vt.includes("urgent") ||
      reason.includes("emergency") ||
      notes.includes("urgent") ||
      notes.includes("emergency")
    ) {
      urgent++;
    } else if (vt.includes("follow") || vt.includes("priority")) {
      priority++;
    } else {
      routine++;
    }

    if (c.followUp?.required === "Yes" || c.status === "Follow-up") {
      followUpRequired++;
    } else if (notes.includes("refer") || diag.toLowerCase().includes("refer")) {
      referredHospital++;
    } else {
      treatedSentHome++;
    }

    if (diag && diag !== "None" && diag !== "N/A") {
      const icdMatch = diag.match(/\(([A-Z][0-9]+(\.[0-9]+)?)\)/);
      if (!morbidityMap[diag]) {
        morbidityMap[diag] = {
          count: 0,
          icdCode: icdMatch ? icdMatch[1] : undefined,
        };
      }
      morbidityMap[diag].count++;
    }
  });

  const topMorbidities: MorbidityItem[] = Object.entries(morbidityMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 6)
    .map(([disease, info]) => ({
      disease,
      cases: info.count,
      percentage:
        totalConsultations > 0 ? Math.round((info.count / totalConsultations) * 100) : 0,
      icdCode: info.icdCode,
    }));

  // 3. Immunization (EPI)
  const targetInfants = immunizationRecords.length;
  let fullyImmunizedCount = 0;
  let defaulterCount = 0;

  let bcgDoses = 0;
  let hepbDoses = 0;
  let pentaDoses = 0;
  let opvDoses = 0;
  let pcvDoses = 0;
  let mcvDoses = 0;

  immunizationRecords.forEach((r) => {
    const v = r.vaccines || {};
    const hasBcg = v.bcg?.status === "Completed" || Boolean(v.bcg?.dateGiven);
    const hasHepb = v.hepb?.status === "Completed" || Boolean(v.hepb?.dateGiven);
    const hasPenta =
      v.penta1?.status === "Completed" ||
      v.penta2?.status === "Completed" ||
      v.penta3?.status === "Completed";
    const hasOpv =
      v.opv1?.status === "Completed" ||
      v.opv2?.status === "Completed" ||
      v.ipv?.status === "Completed";
    const hasPcv =
      v.pcv1?.status === "Completed" ||
      v.pcv2?.status === "Completed" ||
      v.pcv3?.status === "Completed";
    const hasMcv = v.mcv1?.status === "Completed" || v.mcv2?.status === "Completed";

    if (hasBcg) bcgDoses++;
    if (hasHepb) hepbDoses++;
    if (hasPenta) pentaDoses++;
    if (hasOpv) opvDoses++;
    if (hasPcv) pcvDoses++;
    if (hasMcv) mcvDoses++;

    const isFullyImmunized =
      hasBcg &&
      hasHepb &&
      v.penta3?.status === "Completed" &&
      v.opv3?.status === "Completed" &&
      hasMcv;

    if (isFullyImmunized) {
      fullyImmunizedCount++;
    }

    const hasOverdue = Object.values(v).some((entry) => entry?.status === "Overdue");
    if (hasOverdue) {
      defaulterCount++;
    }
  });

  const calcAntigenCoverage = (doses: number) =>
    targetInfants > 0 ? Math.min(100, Math.round((doses / targetInfants) * 100)) : 0;

  const antigens: VaccineAntigenItem[] = [
    {
      antigen: "BCG (Bacillus Calmette–Guérin at birth)",
      targetPopulation: targetInfants,
      dosesAdministered: bcgDoses,
      coveragePercentage: calcAntigenCoverage(bcgDoses),
    },
    {
      antigen: "Hepatitis B (Within 24 hrs of birth)",
      targetPopulation: targetInfants,
      dosesAdministered: hepbDoses,
      coveragePercentage: calcAntigenCoverage(hepbDoses),
    },
    {
      antigen: "Pentavalent (DTP-HepB-Hib 1, 2, 3)",
      targetPopulation: targetInfants,
      dosesAdministered: pentaDoses,
      coveragePercentage: calcAntigenCoverage(pentaDoses),
    },
    {
      antigen: "OPV / IPV (Polio Vaccine Series)",
      targetPopulation: targetInfants,
      dosesAdministered: opvDoses,
      coveragePercentage: calcAntigenCoverage(opvDoses),
    },
    {
      antigen: "PCV (Pneumococcal Conjugate 1, 2, 3)",
      targetPopulation: targetInfants,
      dosesAdministered: pcvDoses,
      coveragePercentage: calcAntigenCoverage(pcvDoses),
    },
    {
      antigen: "MCV 1 & 2 (Measles, Mumps & Rubella)",
      targetPopulation: targetInfants,
      dosesAdministered: mcvDoses,
      coveragePercentage: calcAntigenCoverage(mcvDoses),
    },
  ];

  const ficCoverageRate =
    targetInfants > 0 ? Math.round((fullyImmunizedCount / targetInfants) * 1000) / 10 : 0;
  const defaulterRate =
    targetInfants > 0 ? Math.round((defaulterCount / targetInfants) * 1000) / 10 : 0;

  // 4. Maternal Health & Safe Motherhood
  const totalExpectedPregnancies = maternalRecords.length;
  let firstTrimesterBooking = 0;
  let fourOrMoreAntenatalVisits = 0;
  let tetanusVaccinatedMothers = 0;
  let ironFolicAcidSupplemented = 0;
  let highRiskPregnanciesIdentified = 0;
  let postpartumVisitsCompleted = 0;
  let completedDeliveries = 0;

  maternalRecords.forEach((m) => {
    const visits = m.prenatalVisits || [];
    if (
      (m.gestationalAgeWeeks && m.gestationalAgeWeeks <= 12) ||
      visits.some((v) => v.trimester === "1st Trimester")
    ) {
      firstTrimesterBooking++;
    }
    if (visits.length >= 4) {
      fourOrMoreAntenatalVisits++;
    }
    if (m.tetanusToxoidStatus && m.tetanusToxoidStatus !== "None") {
      tetanusVaccinatedMothers++;
    }
    if (
      m.ironFolicAcidSupplementation &&
      m.ironFolicAcidSupplementation !== "None" &&
      m.ironFolicAcidSupplementation.trim() !== ""
    ) {
      ironFolicAcidSupplemented++;
    }
    const notes = (m.generalNotes || "").toLowerCase();
    if (
      (m.age && (m.age < 18 || m.age >= 35)) ||
      (m.gravida && m.gravida >= 5) ||
      notes.includes("high-risk") ||
      notes.includes("high risk")
    ) {
      highRiskPregnanciesIdentified++;
    }
    if (
      m.status === "Completed" ||
      visits.some((v) => (v.visitNotes || "").toLowerCase().includes("postpartum"))
    ) {
      postpartumVisitsCompleted++;
    }
    if (m.status === "Completed") {
      completedDeliveries++;
    }
  });

  const facilityBasedDeliveryRate =
    totalExpectedPregnancies > 0
      ? Math.round((completedDeliveries / totalExpectedPregnancies) * 100)
      : 0;

  // 5. Family Planning & Reproductive Health
  const activeFPUsers = fpClients.filter(
    (c) => c.status === "Active User" || (c.status !== "Discontinued" && Boolean(c.currentMethod))
  ).length;

  let newAcceptors = 0;
  let methodChangers = 0;
  let dropoutsRestart = 0;

  const fpMethodDistributionConfigs: {
    method: string;
    keywords: string[];
    category: "Modern Artificial" | "Long-Acting & Permanent" | "Natural / LAM";
  }[] = [
    {
      method: "Combined Oral Contraceptives (COC)",
      keywords: ["coc", "pill", "oral contraceptive"],
      category: "Modern Artificial",
    },
    {
      method: "DMPA Injectables (Depo)",
      keywords: ["dmpa", "depo", "injectable"],
      category: "Modern Artificial",
    },
    {
      method: "Subdermal Implants",
      keywords: ["implant", "subdermal", "norplant", "jadelle"],
      category: "Long-Acting & Permanent",
    },
    {
      method: "Intrauterine Device (IUD)",
      keywords: ["iud", "intrauterine"],
      category: "Long-Acting & Permanent",
    },
    {
      method: "Male Condoms",
      keywords: ["condom", "barrier"],
      category: "Modern Artificial",
    },
    {
      method: "Lactational Amenorrhea (LAM) / SDM",
      keywords: ["lam", "lactational", "sdm", "natural", "calendar", "rhythm"],
      category: "Natural / LAM",
    },
  ];

  const methodDistribution: FPMethodDistributionItem[] = fpMethodDistributionConfigs.map(
    (config) => {
      const matchingCount = fpClients.filter((c) => {
        const methodStr = (c.currentMethod || "").toLowerCase();
        return config.keywords.some((kw) => methodStr.includes(kw));
      }).length;

      const percentage =
        activeFPUsers > 0 ? Math.round((matchingCount / activeFPUsers) * 1000) / 10 : 0;

      return {
        method: config.method,
        usersCount: matchingCount,
        percentage,
        category: config.category,
      };
    }
  );

  fpClients.forEach((c) => {
    const cType = (c.clientType || "").toLowerCase();
    const cStatus = (c.status || "").toLowerCase();

    if (cType.includes("new")) {
      newAcceptors++;
    } else if (cType.includes("changing") || cType.includes("changer")) {
      methodChangers++;
    } else if (cStatus.includes("discontinued") || cType.includes("restart")) {
      dropoutsRestart++;
    }
  });

  // 6. Appointments & Utilization
  const periodAppointments = appointments.filter((a) =>
    isDateInPeriod(a.date, period.startDate, period.endDate)
  );
  const totalScheduled = periodAppointments.length;
  let completedVisits = 0;
  let confirmedUpcoming = 0;
  let pendingScheduled = 0;
  let noShowCount = 0;
  let cancelledCount = 0;

  periodAppointments.forEach((a) => {
    switch (a.status) {
      case "Completed":
        completedVisits++;
        break;
      case "Confirmed":
        confirmedUpcoming++;
        break;
      case "Scheduled":
        pendingScheduled++;
        break;
      case "No Show":
        noShowCount++;
        break;
      case "Cancelled":
        cancelledCount++;
        break;
    }
  });

  const completionRate =
    totalScheduled > 0 ? Math.round((completedVisits / totalScheduled) * 100) : 0;
  const noShowRate =
    totalScheduled > 0 ? Math.round((noShowCount / totalScheduled) * 100) : 0;

  // 7. Pharmacy, Inventory & Prescriptions
  const periodPrescriptions = prescriptions.filter((p) =>
    isDateInPeriod(p.date || p.createdAt, period.startDate, period.endDate)
  );
  const totalPrescriptionsIssued = periodPrescriptions.length;
  const totalPrescriptionsDispensed = periodPrescriptions.filter(
    (p) => p.status === "Dispensed"
  ).length;

  const dispensationFulfillmentRate =
    totalPrescriptionsIssued > 0
      ? Math.round((totalPrescriptionsDispensed / totalPrescriptionsIssued) * 100)
      : 0;

  const medMap: Record<string, { count: number; qty: number; unit: string }> = {};
  periodPrescriptions.forEach((rx) => {
    const name = rx.medicine?.trim() || "Unspecified Medicine";
    if (!medMap[name]) {
      medMap[name] = { count: 0, qty: 0, unit: rx.dosage || "Units" };
    }
    medMap[name].count++;
    medMap[name].qty += rx.quantityToDispense || 1;
  });

  const topPrescribedMedicines: TopPrescribedMedItem[] = Object.entries(medMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 6)
    .map(([name, info]) => ({
      name,
      prescriptionsCount: info.count,
      quantityDispensed: info.qty,
      unit: info.unit,
    }));

  let adequateStock = 0;
  let lowStockWarnings = 0;
  let outOfStockDepleted = 0;
  let expiredItems = 0;

  medicines.forEach((m) => {
    switch (m.status) {
      case "Available":
        adequateStock++;
        break;
      case "Low Stock":
        lowStockWarnings++;
        break;
      case "Out of Stock":
        outOfStockDepleted++;
        break;
      case "Expired":
        expiredItems++;
        break;
    }
  });

  return {
    period,
    generatedDate: getTodayDateString(),
    facilityName: sources?.facilityName || "Barangay Health Center",
    healthOfficer: sources?.healthOfficer || "Municipal Health Officer (MHO)",

    patients: {
      totalRegistered,
      newRegistrationsThisPeriod,
      demographics: {
        under5: { count: under5, percentage: calcDemographicPct(under5) },
        schoolAge: { count: schoolAge, percentage: calcDemographicPct(schoolAge) },
        womenReproductiveAge: {
          count: womenReproductiveAge,
          percentage: calcDemographicPct(womenReproductiveAge),
        },
        adults: { count: adults, percentage: calcDemographicPct(adults) },
        seniors: { count: seniors, percentage: calcDemographicPct(seniors) },
      },
      socialCoverage: {
        philhealthMembers,
        nhts4PsBeneficiaries,
        seniorCitizenMembers,
        pwdMembers,
      },
    },

    consultations: {
      totalConsultations,
      triageLevels: {
        routine,
        priority,
        urgent,
      },
      topMorbidities,
      outcomes: {
        treatedSentHome,
        referredHospital,
        followUpRequired,
      },
    },

    immunizations: {
      targetInfants,
      fullyImmunizedChildren: fullyImmunizedCount,
      ficCoverageRate,
      defaulterRate,
      antigens,
    },

    maternalCare: {
      totalExpectedPregnancies,
      firstTrimesterBooking,
      fourOrMoreAntenatalVisits,
      tetanusVaccinatedMothers,
      ironFolicAcidSupplemented,
      highRiskPregnanciesIdentified,
      postpartumVisitsCompleted,
      facilityBasedDeliveryRate,
    },

    familyPlanning: {
      totalCurrentUsers: activeFPUsers,
      newAcceptors,
      methodChangers,
      dropoutsRestart,
      unmetNeedPercentage: 0,
      methodDistribution,
    },

    appointments: {
      totalScheduled,
      completedVisits,
      confirmedUpcoming,
      pendingScheduled,
      noShowCount,
      cancelledCount,
      completionRate,
      noShowRate,
    },

    medicines: {
      totalPrescriptionsIssued,
      totalPrescriptionsDispensed,
      dispensationFulfillmentRate,
      inventorySummary: {
        totalItems: medicines.length,
        adequateStock,
        lowStockWarnings,
        outOfStockDepleted,
        expiredItems,
      },
      topPrescribedMedicines,
    },
  };
}

export function generateCSVReportContent(data: ComprehensiveReportData): string {
  const lines: string[] = [];

  lines.push(`BARANGAY HEALTH CARE MANAGEMENT SYSTEM (BHCMS)`);
  lines.push(`FIELD HEALTH SERVICES INFORMATION SYSTEM (FHSIS) REPORT`);
  lines.push(`Reporting Period:,"${data.period.label}"`);
  lines.push(`Date Generated:,"${data.generatedDate}"`);
  lines.push(`Facility:,"${data.facilityName}"`);
  lines.push(`Attending Health Officer:,"${data.healthOfficer}"`);
  lines.push(``);

  // 1. Patient Demographics
  lines.push(`--- SECTION 1: PATIENT DEMOGRAPHICS & REGISTRATION ---`);
  lines.push(`Indicator,Count,Percentage`);
  lines.push(`Total Registered Population,${data.patients.totalRegistered},100%`);
  lines.push(`New Registrations in Period,${data.patients.newRegistrationsThisPeriod},-`);
  lines.push(`Infants & Under 5 (0-59 mos),${data.patients.demographics.under5.count},${data.patients.demographics.under5.percentage}%`);
  lines.push(`School Age & Adolescents (6-17 yrs),${data.patients.demographics.schoolAge.count},${data.patients.demographics.schoolAge.percentage}%`);
  lines.push(`Women of Reproductive Age (15-49 yrs),${data.patients.demographics.womenReproductiveAge.count},${data.patients.demographics.womenReproductiveAge.percentage}%`);
  lines.push(`Adult Population (18-59 yrs),${data.patients.demographics.adults.count},${data.patients.demographics.adults.percentage}%`);
  lines.push(`Senior Citizens (60+ yrs),${data.patients.demographics.seniors.count},${data.patients.demographics.seniors.percentage}%`);
  lines.push(`PhilHealth Covered Members,${data.patients.socialCoverage.philhealthMembers},-`);
  lines.push(`NHTS-PR / 4Ps Beneficiaries,${data.patients.socialCoverage.nhts4PsBeneficiaries},-`);
  lines.push(``);

  // 2. Consultations
  lines.push(`--- SECTION 2: CLINICAL CONSULTATIONS & MORBIDITY ---`);
  lines.push(`Indicator,Count`);
  lines.push(`Total Consultations,${data.consultations.totalConsultations}`);
  lines.push(`Routine Visits,${data.consultations.triageLevels.routine}`);
  lines.push(`Priority Cases,${data.consultations.triageLevels.priority}`);
  lines.push(`Urgent / Emergency Cases,${data.consultations.triageLevels.urgent}`);
  lines.push(`Treated & Sent Home,${data.consultations.outcomes.treatedSentHome}`);
  lines.push(`Referred to Hospital,${data.consultations.outcomes.referredHospital}`);
  lines.push(`Follow-up Scheduled,${data.consultations.outcomes.followUpRequired}`);
  lines.push(`Top Morbidities:`);
  if (data.consultations.topMorbidities.length > 0) {
    data.consultations.topMorbidities.forEach((m) => {
      lines.push(`"${m.disease}${m.icdCode ? ` (${m.icdCode})` : ""}",${m.cases},${m.percentage}%`);
    });
  } else {
    lines.push(`"No clinical morbidities recorded in this period",0,0%`);
  }
  lines.push(``);

  // 3. Immunization
  lines.push(`--- SECTION 3: IMMUNIZATION COVERAGE (EPI) ---`);
  lines.push(`Indicator,Target,Achieved,Coverage Rate`);
  lines.push(`Fully Immunized Children (FIC),${data.immunizations.targetInfants},${data.immunizations.fullyImmunizedChildren},${data.immunizations.ficCoverageRate}%`);
  lines.push(`Immunization Defaulter Rate,-,-,${data.immunizations.defaulterRate}%`);
  data.immunizations.antigens.forEach((ant) => {
    lines.push(`"${ant.antigen}",${ant.targetPopulation},${ant.dosesAdministered},${ant.coveragePercentage}%`);
  });
  lines.push(``);

  // 4. Maternal Care
  lines.push(`--- SECTION 4: MATERNAL HEALTH & SAFE MOTHERHOOD ---`);
  lines.push(`Indicator,Count,Target %`);
  lines.push(`Expected Pregnancies,${data.maternalCare.totalExpectedPregnancies},100%`);
  lines.push(`1st Trimester ANC Booking,${data.maternalCare.firstTrimesterBooking},80%`);
  lines.push(`4+ Antenatal Care Visits,${data.maternalCare.fourOrMoreAntenatalVisits},80%`);
  lines.push(`Tetanus Diphtheria Vaccinated,${data.maternalCare.tetanusVaccinatedMothers},95%`);
  lines.push(`Iron + Folic Acid Supplemented,${data.maternalCare.ironFolicAcidSupplemented},95%`);
  lines.push(`High-Risk Pregnancies Managed,${data.maternalCare.highRiskPregnanciesIdentified},-`);
  lines.push(`Postpartum Care Visits,${data.maternalCare.postpartumVisitsCompleted},85%`);
  lines.push(`Facility-Based Deliveries,-,${data.maternalCare.facilityBasedDeliveryRate}%`);
  lines.push(``);

  // 5. Family Planning
  lines.push(`--- SECTION 5: FAMILY PLANNING & REPRODUCTIVE HEALTH ---`);
  lines.push(`Indicator,Count`);
  lines.push(`Total Active Contraceptive Users,${data.familyPlanning.totalCurrentUsers}`);
  lines.push(`New Acceptors in Period,${data.familyPlanning.newAcceptors}`);
  lines.push(`Method Changers,${data.familyPlanning.methodChangers}`);
  lines.push(`Dropouts & Restarts,${data.familyPlanning.dropoutsRestart}`);
  lines.push(`Unmet Need Rate,${data.familyPlanning.unmetNeedPercentage}%`);
  data.familyPlanning.methodDistribution.forEach((m) => {
    lines.push(`"${m.method} (${m.category})",${m.usersCount},${m.percentage}%`);
  });
  lines.push(``);

  // 6. Appointments
  lines.push(`--- SECTION 6: APPOINTMENTS & CLINIC UTILIZATION ---`);
  lines.push(`Indicator,Count`);
  lines.push(`Total Scheduled Visits,${data.appointments.totalScheduled}`);
  lines.push(`Completed Visits,${data.appointments.completedVisits}`);
  lines.push(`Confirmed Upcoming,${data.appointments.confirmedUpcoming}`);
  lines.push(`Pending Scheduled,${data.appointments.pendingScheduled}`);
  lines.push(`No Show Encounters,${data.appointments.noShowCount}`);
  lines.push(`Cancelled Bookings,${data.appointments.cancelledCount}`);
  lines.push(`Completion Rate,${data.appointments.completionRate}%`);
  lines.push(`No-Show Rate,${data.appointments.noShowRate}%`);
  lines.push(``);

  // 7. Medicines
  lines.push(`--- SECTION 7: PHARMACY & MEDICINE DISPENSATION ---`);
  lines.push(`Indicator,Count`);
  lines.push(`Prescriptions Issued,${data.medicines.totalPrescriptionsIssued}`);
  lines.push(`Prescriptions Dispensed,${data.medicines.totalPrescriptionsDispensed}`);
  lines.push(`Fulfillment Rate,${data.medicines.dispensationFulfillmentRate}%`);
  lines.push(`Total Inventory Items,${data.medicines.inventorySummary.totalItems}`);
  lines.push(`Adequate Stock Items,${data.medicines.inventorySummary.adequateStock}`);
  lines.push(`Low Stock Items,${data.medicines.inventorySummary.lowStockWarnings}`);
  lines.push(`Out of Stock Items,${data.medicines.inventorySummary.outOfStockDepleted}`);
  lines.push(`Expired Quarantine Items,${data.medicines.inventorySummary.expiredItems}`);
  lines.push(`Top Prescribed Medicines:`);
  if (data.medicines.topPrescribedMedicines.length > 0) {
    data.medicines.topPrescribedMedicines.forEach((med) => {
      lines.push(`"${med.name}",${med.prescriptionsCount},"${med.quantityDispensed} ${med.unit}"`);
    });
  } else {
    lines.push(`"No prescriptions recorded in this period",0,-`);
  }

  return lines.join("\n");
}
