/**
 * Supabase Clean State / Verification Script for BHCMS
 * Run with: node scripts/seed-supabase.mjs
 */

import { createClient } from "@supabase/supabase-js";

// Auto-load .env.local if available locally
try {
  if (typeof process.loadEnvFile === "function") {
    process.loadEnvFile(".env.local");
  }
} catch {
  // Ignore if .env.local does not exist
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uxuycuvdiudhryjbcnja.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

if (!SUPABASE_KEY) {
  console.log("=================================================");
  console.log("⚠️  Supabase Anon/Service Key Missing in .env.local");
  console.log("Please define NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.");
  console.log("Get your key from: https://supabase.com/dashboard/project/uxuycuvdiudhryjbcnja/settings/api");
  console.log("=================================================");
  process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});


async function runSeed() {
  console.log("=================================================");
  console.log("BHCMS Database State Verification");
  console.log(`Target: ${SUPABASE_URL}`);
  console.log("=================================================");
  console.log("ℹ️  Mock data seeding is disabled. Live data is maintained directly by BHCMS operators.");

  // Check existing patient count
  const { count, error } = await supabase
    .from("patients")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error(`Database query error: ${error.message}`);
  } else {
    console.log(`✅ Supabase [patients] table active. Total registered patients: ${count ?? 0}`);
  }

  console.log("=================================================");
}

runSeed();
