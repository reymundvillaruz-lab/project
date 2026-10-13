import { DashboardData } from "@/types/dashboard";
import { INITIAL_DASHBOARD_DATA } from "@/lib/data/empty-data";

/**
 * Dashboard Service
 * 
 * Provides initial frontend operational datasets for the BHCMS Dashboard.
 * In future phases, this will query Supabase tables and Clerk user session context.
 */
export async function getDashboardData(): Promise<DashboardData> {
  return Promise.resolve(INITIAL_DASHBOARD_DATA);
}
