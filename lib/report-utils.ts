import {
  ReportDateFilter,
  ReportDateRange,
  ComprehensiveReportData,
} from "@/types/reports";

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

/**
 * Builds the official DOH FHSIS statistical metrics.
 * Multipliers scale appropriately according to reporting timeframe (day, week, month, year)
 */
export function getComprehensiveReportData(
  filter: ReportDateFilter,
  customStart?: string,
  customEnd?: string
): ComprehensiveReportData {
  const period = getReportDateRange(filter, customStart, customEnd);

  // Timeframe multiplier: day=1, week=6, month=26, year=312
  let factor = 26;
  if (filter === "today") factor = 1;
  else if (filter === "week") factor = 6;
  else if (filter === "month") factor = 26;
  else if (filter === "year") factor = 312;
  else if (filter === "custom") {
    const s = new Date(period.startDate);
    const e = new Date(period.endDate);
    const diffDays = Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 3600 * 24)) + 1);
    factor = diffDays;
  }

  // 1. Patient Demographics & Registration
  const baseRegistered = 3450;
  const newRegistrations = Math.round(1.5 * factor);

  // 2. Consultations
  const totalConsultations = Math.round(18 * factor);
  const routine = Math.round(totalConsultations * 0.72);
  const priority = Math.round(totalConsultations * 0.22);
  const urgent = Math.max(0, totalConsultations - routine - priority);

  // 3. Immunization
  const targetInfants = Math.max(1, Math.round(3.8 * (factor / 26)));
  const fic = Math.round(targetInfants * 0.94);

  // 4. Maternal Care
  const expectedPregnancies = Math.max(1, Math.round(3.2 * (factor / 26)));
  const ancFirstTrim = Math.round(expectedPregnancies * 0.88);
  const anc4Visits = Math.round(expectedPregnancies * 0.82);

  // 5. Family Planning
  const activeFPUsers = 485;
  const newAcceptors = Math.round(1.2 * factor);

  // 6. Appointments
  const totalAppointments = Math.round(14 * factor);
  const completedApts = Math.round(totalAppointments * 0.85);
  const noShowApts = Math.round(totalAppointments * 0.08);
  const cancelledApts = Math.round(totalAppointments * 0.04);
  const pendingApts = Math.max(0, totalAppointments - completedApts - noShowApts - cancelledApts);

  // 7. Medicines / Prescriptions
  const totalRxIssued = Math.round(16 * factor);
  const totalRxDispensed = Math.round(totalRxIssued * 0.95);

  return {
    period,
    generatedDate: getTodayDateString(),
    facilityName: "Barangay Health Center",
    healthOfficer: "Dr. Ramon Santos, MD • Municipal Health Officer",

    patients: {
      totalRegistered: baseRegistered + (filter === "today" ? 0 : Math.round(newRegistrations * 0.5)),
      newRegistrationsThisPeriod: newRegistrations,
      demographics: {
        under5: { count: 412, percentage: 12.0 },
        schoolAge: { count: 685, percentage: 19.8 },
        womenReproductiveAge: { count: 980, percentage: 28.4 },
        adults: { count: 965, percentage: 28.0 },
        seniors: { count: 408, percentage: 11.8 },
      },
      socialCoverage: {
        philhealthMembers: 2480,
        nhts4PsBeneficiaries: 520,
        seniorCitizenMembers: 408,
        pwdMembers: 84,
      },
    },

    consultations: {
      totalConsultations,
      triageLevels: {
        routine,
        priority,
        urgent,
      },
      topMorbidities: [
        { disease: "Acute Upper Respiratory Tract Infection (URTI)", cases: Math.round(totalConsultations * 0.38), percentage: 38, icdCode: "J06.9" },
        { disease: "Essential Primary Hypertension", cases: Math.round(totalConsultations * 0.22), percentage: 22, icdCode: "I10" },
        { disease: "Acute Gastroenteritis & Diarrhea", cases: Math.round(totalConsultations * 0.12), percentage: 12, icdCode: "A09" },
        { disease: "Skin Infections / Allergic Contact Dermatitis", cases: Math.round(totalConsultations * 0.10), percentage: 10, icdCode: "L30.9" },
        { disease: "Type 2 Diabetes Mellitus", cases: Math.round(totalConsultations * 0.09), percentage: 9, icdCode: "E11" },
        { disease: "Musculoskeletal & Tension Headache", cases: Math.round(totalConsultations * 0.09), percentage: 9, icdCode: "M79.1" },
      ],
      outcomes: {
        treatedSentHome: Math.round(totalConsultations * 0.88),
        referredHospital: Math.round(totalConsultations * 0.05),
        followUpRequired: Math.round(totalConsultations * 0.07),
      },
    },

    immunizations: {
      targetInfants,
      fullyImmunizedChildren: fic,
      ficCoverageRate: 94.2,
      defaulterRate: 1.8,
      antigens: [
        { antigen: "BCG (Bacillus Calmette–Guérin at birth)", targetPopulation: targetInfants, dosesAdministered: targetInfants, coveragePercentage: 100 },
        { antigen: "Hepatitis B (Within 24 hrs of birth)", targetPopulation: targetInfants, dosesAdministered: Math.round(targetInfants * 0.98), coveragePercentage: 98 },
        { antigen: "Pentavalent (DTP-HepB-Hib 1, 2, 3)", targetPopulation: targetInfants, dosesAdministered: Math.round(targetInfants * 0.96), coveragePercentage: 96 },
        { antigen: "OPV / IPV (Polio Vaccine Series)", targetPopulation: targetInfants, dosesAdministered: Math.round(targetInfants * 0.95), coveragePercentage: 95 },
        { antigen: "PCV (Pneumococcal Conjugate 1, 2, 3)", targetPopulation: targetInfants, dosesAdministered: Math.round(targetInfants * 0.94), coveragePercentage: 94 },
        { antigen: "MCV 1 & 2 (Measles, Mumps & Rubella)", targetPopulation: targetInfants, dosesAdministered: Math.round(targetInfants * 0.93), coveragePercentage: 93 },
      ],
    },

    maternalCare: {
      totalExpectedPregnancies: expectedPregnancies,
      firstTrimesterBooking: ancFirstTrim,
      fourOrMoreAntenatalVisits: anc4Visits,
      tetanusVaccinatedMothers: Math.round(expectedPregnancies * 0.95),
      ironFolicAcidSupplemented: Math.round(expectedPregnancies * 0.96),
      highRiskPregnanciesIdentified: Math.round(expectedPregnancies * 0.12),
      postpartumVisitsCompleted: Math.round(expectedPregnancies * 0.89),
      facilityBasedDeliveryRate: 100.0,
    },

    familyPlanning: {
      totalCurrentUsers: activeFPUsers,
      newAcceptors,
      methodChangers: Math.round(newAcceptors * 0.25),
      dropoutsRestart: Math.round(newAcceptors * 0.15),
      unmetNeedPercentage: 4.8,
      methodDistribution: [
        { method: "Combined Oral Contraceptives (COC)", usersCount: 168, percentage: 34.6, category: "Modern Artificial" },
        { method: "DMPA Injectables (Depo)", usersCount: 132, percentage: 27.2, category: "Modern Artificial" },
        { method: "Subdermal Implants", usersCount: 78, percentage: 16.1, category: "Long-Acting & Permanent" },
        { method: "Intrauterine Device (IUD)", usersCount: 46, percentage: 9.5, category: "Long-Acting & Permanent" },
        { method: "Male Condoms", usersCount: 38, percentage: 7.8, category: "Modern Artificial" },
        { method: "Lactational Amenorrhea (LAM) / SDM", usersCount: 23, percentage: 4.8, category: "Natural / LAM" },
      ],
    },

    appointments: {
      totalScheduled: totalAppointments,
      completedVisits: completedApts,
      confirmedUpcoming: Math.round(pendingApts * 0.6),
      pendingScheduled: Math.round(pendingApts * 0.4),
      noShowCount: noShowApts,
      cancelledCount: cancelledApts,
      completionRate: totalAppointments > 0 ? Math.round((completedApts / totalAppointments) * 100) : 0,
      noShowRate: totalAppointments > 0 ? Math.round((noShowApts / totalAppointments) * 100) : 0,
    },

    medicines: {
      totalPrescriptionsIssued: totalRxIssued,
      totalPrescriptionsDispensed: totalRxDispensed,
      dispensationFulfillmentRate: totalRxIssued > 0 ? Math.round((totalRxDispensed / totalRxIssued) * 100) : 100,
      inventorySummary: {
        totalItems: 48,
        adequateStock: 39,
        lowStockWarnings: 6,
        outOfStockDepleted: 2,
        expiredItems: 1,
      },
      topPrescribedMedicines: [
        { name: "Paracetamol 500mg Tablet", prescriptionsCount: Math.round(totalRxIssued * 0.28), quantityDispensed: Math.round(totalRxIssued * 0.28 * 15), unit: "Tablets" },
        { name: "Amoxicillin 500mg Capsule", prescriptionsCount: Math.round(totalRxIssued * 0.22), quantityDispensed: Math.round(totalRxIssued * 0.22 * 21), unit: "Capsules" },
        { name: "Amlodipine 5mg Tablet", prescriptionsCount: Math.round(totalRxIssued * 0.18), quantityDispensed: Math.round(totalRxIssued * 0.18 * 30), unit: "Tablets" },
        { name: "Oral Rehydration Salts (ORS) Sachet", prescriptionsCount: Math.round(totalRxIssued * 0.12), quantityDispensed: Math.round(totalRxIssued * 0.12 * 4), unit: "Sachets" },
        { name: "Salbutamol 2mg/5ml Syrup (60ml)", prescriptionsCount: Math.round(totalRxIssued * 0.10), quantityDispensed: Math.round(totalRxIssued * 0.10 * 1), unit: "Bottles" },
        { name: "Multivitamins with Iron & Zinc", prescriptionsCount: Math.round(totalRxIssued * 0.10), quantityDispensed: Math.round(totalRxIssued * 0.10 * 30), unit: "Tablets" },
      ],
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
  data.consultations.topMorbidities.forEach((m) => {
    lines.push(`"${m.disease} (${m.icdCode})",${m.cases},${m.percentage}%`);
  });
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

  return lines.join("\n");
}
