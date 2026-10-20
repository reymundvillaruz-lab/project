import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uxuycuvdiudhryjbcnja.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

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
