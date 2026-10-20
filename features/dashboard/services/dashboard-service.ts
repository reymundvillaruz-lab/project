import { DashboardData } from "@/types/dashboard";
import { INITIAL_DASHBOARD_DATA } from "@/lib/data/empty-data";
import { createServerClient } from "@/lib/supabase/server";

/**
 * Dashboard Service
 * 
 * Queries live operational metrics from Supabase tables with safe fallback.
 */
export async function getDashboardData(): Promise<DashboardData> {
  try {
    const supabase = await createServerClient();

    const [
      { count: patientCount },
      { count: consultationCount },
      { count: appointmentCount },
      { count: maternalCount },
      { count: lowStockMedCount },
    ] = await Promise.all([
      supabase.from("patients").select("*", { count: "exact", head: true }),
      supabase.from("consultations").select("*", { count: "exact", head: true }),
      supabase.from("appointments").select("*", { count: "exact", head: true }),
      supabase.from("maternal_records").select("*", { count: "exact", head: true }),
      supabase.from("medicines").select("*", { count: "exact", head: true }).eq("status", "Low Stock"),
    ]);

    return {
      ...INITIAL_DASHBOARD_DATA,
      metrics: {
        ...INITIAL_DASHBOARD_DATA.metrics,
        totalRegisteredPatients: patientCount ?? INITIAL_DASHBOARD_DATA.metrics.totalRegisteredPatients,
        totalPatients: patientCount ?? INITIAL_DASHBOARD_DATA.metrics.totalPatients,
        todayConsultations: consultationCount ?? INITIAL_DASHBOARD_DATA.metrics.todayConsultations,
        pendingAppointments: appointmentCount ?? INITIAL_DASHBOARD_DATA.metrics.pendingAppointments,
        activeMaternalCases: maternalCount ?? INITIAL_DASHBOARD_DATA.metrics.activeMaternalCases,
        lowStockMedicines: lowStockMedCount ?? INITIAL_DASHBOARD_DATA.metrics.lowStockMedicines,
      },
    };
  } catch (e) {
    console.warn("Could not query Supabase for dashboard data, using fallback:", e);
    return INITIAL_DASHBOARD_DATA;
  }
}
