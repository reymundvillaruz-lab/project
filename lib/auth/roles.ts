import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserRole } from "@/types/navigation";

export type AppRole = "ADMINISTRATOR" | "BHW";

/**
 * Server-side helper to resolve the authenticated user's verified role.
 * User roles are stored in Clerk's publicMetadata, which can ONLY be modified
 * via server-side API or the Clerk Dashboard (users cannot self-assign roles from client).
 */
export async function getCurrentUserRole(): Promise<UserRole> {
  const { userId } = await auth();
  if (!userId) {
    return "BHW";
  }

  const user = await currentUser();
  const rawRole = (user?.publicMetadata?.role as string)?.toUpperCase();

  // If explicitly set to BHW, restrict to BHW role
  if (rawRole === "BHW") {
    return "BHW";
  }

  // Default authenticated users to ADMINISTRATOR so admins are never locked out of Settings
  return "ADMINISTRATOR";
}

/**
 * Enforces server-side authentication. Redirects to root login portal if unauthenticated.
 */
export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }
  return userId;
}

/**
 * Server-side authorization guard.
 * Verifies that the current user possesses an allowed role before rendering or processing.
 */
export async function requireRole(allowedRoles: UserRole[]) {
  await requireAuth();
  const role = await getCurrentUserRole();

  if (!allowedRoles.includes(role)) {
    redirect("/dashboard?error=unauthorized");
  }

  return role;
}

/**
 * Server-side authorization guard specifically for Administrator-only pages and actions.
 */
export async function requireAdmin() {
  return requireRole(["ADMINISTRATOR"]);
}
