import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitizes any date input to valid YYYY-MM-DD format for PostgreSQL DATE columns,
 * preventing 'invalid input syntax for type date' on empty strings or malformed dates.
 */
export function sanitizeDate(d?: string | null, fallback?: string): string | null {
  if (!d || typeof d !== "string" || !d.trim()) {
    return fallback || null;
  }
  const clean = d.trim().split("T")[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    return clean;
  }
  const parsed = new Date(d);
  if (isNaN(parsed.getTime())) {
    return fallback || null;
  }
  return parsed.toISOString().split("T")[0];
}

