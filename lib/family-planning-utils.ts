import {
  FPClient,
  FPFollowUpStatus,
  FPDashboardStats,
} from "@/types/family-planning";

export const FP_STORAGE_KEY = "bhcms_family_planning_v1";

export function getStoredFPClients(): FPClient[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FP_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredFPClients(clients: FPClient[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FP_STORAGE_KEY, JSON.stringify(clients));
    // Sync to Supabase in background
    if (clients.length > 0) {
      import("@/lib/supabase/services/family-planning-service").then(({ saveFamilyPlanningToSupabase }) => {
        clients.forEach((client) => {
          saveFamilyPlanningToSupabase(client).catch((e) =>
            console.warn("Background Supabase FP sync error:", e)
          );
        });
      });
    }
  } catch (e) {
    console.error("Failed to save FP clients to storage", e);
  }
}

export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function computeFollowUpStatus(
  nextServiceDate?: string,
  explicitStatus?: FPFollowUpStatus
): FPFollowUpStatus {
  // If explicitly completed or cancelled, always respect that; never classify as overdue
  if (explicitStatus === "Completed" || explicitStatus === "Cancelled") {
    return explicitStatus;
  }

  if (!nextServiceDate || !nextServiceDate.trim()) {
    return "Not Scheduled";
  }

  const todayStr = getTodayDateString();

  if (nextServiceDate === todayStr) {
    return "Due";
  } else if (nextServiceDate < todayStr) {
    return "Overdue";
  } else {
    return "Scheduled";
  }
}

export function calculateFPDashboardStats(clients: FPClient[]): FPDashboardStats {
  const totalRegisteredClients = clients.length;

  // Current Family Planning Users
  const currentFPUsers = clients.filter(
    (c) => c.status === "Active User" || (c.status !== "Discontinued" && Boolean(c.currentMethod))
  ).length;

  let upcomingFollowUps = 0;
  let followUpsDue = 0;

  clients.forEach((client) => {
    // Check all follow-ups for this client
    (client.followUps || []).forEach((fu) => {
      // Completed and Cancelled are never overdue or upcoming
      if (fu.status === "Completed" || fu.status === "Cancelled") {
        return;
      }

      const status = computeFollowUpStatus(fu.nextServiceDate, fu.status);

      if (status === "Scheduled") {
        upcomingFollowUps++;
      } else if (status === "Due" || status === "Overdue") {
        followUpsDue++;
      }
    });

    // Also check if client has a nextFollowUpDate on record without a duplicate followUp item
    if (client.nextFollowUpDate && (!client.followUps || client.followUps.length === 0)) {
      const status = computeFollowUpStatus(client.nextFollowUpDate);
      if (status === "Scheduled") {
        upcomingFollowUps++;
      } else if (status === "Due" || status === "Overdue") {
        followUpsDue++;
      }
    }
  });

  return {
    totalRegisteredClients,
    currentFPUsers,
    upcomingFollowUps,
    followUpsDue,
  };
}
