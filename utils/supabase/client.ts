export {
  supabase,
  createAuthenticatedBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

import { supabase } from "@/lib/supabase/client";
export const createClient = () => supabase;

