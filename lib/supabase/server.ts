import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uxuycuvdiudhryjbcnja.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

/**
 * Creates a server-side Supabase client for Server Components, Route Handlers,
 * and Server Actions. Automatically injects the active Clerk session JWT so that
 * Supabase Row Level Security (RLS) policies can identify the caller.
 */
export async function createServerClient() {
  const { getToken } = await auth();

  let token: string | null = null;
  try {
    // Looks for a Clerk JWT template named "supabase" if configured
    token = await getToken({ template: "supabase" });
  } catch {
    // Fallback to standard session token
    token = await getToken();
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Server-only Admin Client using the Supabase service_role key.
 * CAUTION: Bypasses Row Level Security (RLS). Use ONLY for server-side maintenance,
 * automated cron routines, or background migrations. NEVER expose to the browser.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables."
    );
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Convenience alias matching the standard Supabase Next.js convention.
 */
export const createClient = createServerClient;

