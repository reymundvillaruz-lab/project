"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface YesNoRadioProps {
  name: string;
  value: "Yes" | "No" | "";
  onChange: (value: "Yes" | "No") => void;
  label?: string;
  description?: string;
  isRedFlag?: boolean;
}

export function YesNoRadio({
  name,
  value,
  onChange,
  label,
  description,
  isRedFlag = false,
}: YesNoRadioProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 px-3 rounded-md border border-slate-100 bg-white hover:bg-slate-50/70 transition-colors gap-2">
      <div className="flex-1 pr-2">
        {label && (
          <span className="text-xs font-medium text-slate-800 block">
            {label}
          </span>
        )}
        {description && (
          <span className="text-[11px] text-slate-400 block mt-0.5">
            {description}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Yes Option */}
        <button
          type="button"
          role="radio"
          aria-checked={value === "Yes"}
          onClick={() => onChange("Yes")}
          className={cn(
            "h-7 px-3 rounded text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 select-none",
            value === "Yes"
              ? isRedFlag
                ? "bg-rose-600 text-white shadow-xs focus-visible:ring-rose-500"
                : "bg-teal-700 text-white shadow-xs focus-visible:ring-teal-500"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400"
          )}
        >
          Yes
        </button>

        {/* No Option */}
        <button
          type="button"
          role="radio"
          aria-checked={value === "No"}
          onClick={() => onChange("No")}
          className={cn(
            "h-7 px-3 rounded text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 select-none",
            value === "No"
              ? "bg-slate-700 text-white shadow-xs focus-visible:ring-slate-500"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400"
          )}
        >
          No
        </button>
      </div>
    </div>
  );
}
