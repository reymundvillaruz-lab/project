/**
 * Supabase Connection & Table Verification Script
 * Run with: node scripts/verify-supabase.mjs
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


const TABLES = [
  "patients",
  "philpen_assessments",
  "consultations",
  "immunizations",
  "maternal_records",
  "family_planning_records",
  "appointments",
  "medicines",
  "prescriptions",
  "station_settings",
];

async function verifyConnection() {
  console.log("=================================================");
  console.log("BHCMS - Supabase Project Verification");
  console.log(`Connecting to: ${SUPABASE_URL}`);
  console.log("=================================================");

  let allHealthy = true;

  for (const table of TABLES) {
    try {
      const { data, count, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });

      if (!error) {
        console.log(`✅ [${table.padEnd(24)}] Active (Record Count: ${count ?? 0})`);
      } else if (error.code === "42P01" || error.message.includes("does not exist")) {
        console.log(`❌ [${table.padEnd(24)}] Missing (Table does not exist yet)`);
        allHealthy = false;
      } else {
        console.log(`⚠️  [${table.padEnd(24)}] Error: ${error.message.slice(0, 100)}`);
        allHealthy = false;
      }
    } catch (err) {
      console.log(`❌ [${table.padEnd(24)}] Connection error: ${err.message}`);
      allHealthy = false;
    }
  }

  console.log("=================================================");
  if (allHealthy) {
    console.log("🎉 All 10 BHCMS tables are online, functional, and ready!");
  } else {
    console.log("⚠️  Action needed: Run the schema in your Supabase SQL Editor:");
    console.log(`👉 https://supabase.com/dashboard/project/uxuycuvdiudhryjbcnja/sql/new`);
    console.log("   Copy contents from: supabase/schema.sql and click 'Run'.");
  }
  console.log("=================================================");
}

verifyConnection();
