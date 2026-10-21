import { createClient } from "@supabase/supabase-js";

export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uxuycuvdiudhryjbcnja.supabase.co";

const rawSupabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

/**
 * Returns true if real Supabase credentials have been configured in environment variables.
 */
export const isSupabaseConfigured = Boolean(
  rawSupabaseAnonKey &&
    rawSupabaseAnonKey.trim() !== "" &&
    !rawSupabaseAnonKey.startsWith("placeholder")
);

// Fallback dummy key to prevent createClient from throwing 'supabaseKey is required' during module evaluation
const supabaseAnonKey = isSupabaseConfigured
  ? rawSupabaseAnonKey
  : "placeholder-anon-key-needed-in-env-local";

/**
 * Standard browser-side Supabase client for client components.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Creates an authenticated browser Supabase client forwarding Clerk JWT.
 * @param clerkToken - JWT token retrieved via useAuth().getToken({ template: 'supabase' })
 */
export function createAuthenticatedBrowserClient(clerkToken?: string | null) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: clerkToken
        ? {
            Authorization: `Bearer ${clerkToken}`,
          }
        : {},
    },
  });
}

