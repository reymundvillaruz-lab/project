"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PhilpenStep {
  id: number;
  title: string;
  shortTitle: string;
}

export const PHILPEN_STEPS: PhilpenStep[] = [
  { id: 1, title: "Patient Information", shortTitle: "Information" },
  { id: 2, title: "Assess for Red Flags", shortTitle: "Red Flags" },
  { id: 3, title: "Past Medical History", shortTitle: "Medical History" },
  { id: 4, title: "Family History", shortTitle: "Family History" },
  { id: 5, title: "NCD Risk Factors", shortTitle: "Risk Factors" },
  { id: 6, title: "Risk Screening", shortTitle: "Screening" },
  { id: 7, title: "Management", shortTitle: "Management" },
];

interface PhilpenProgressProps {
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export function PhilpenProgress({ currentStep, onStepClick }: PhilpenProgressProps) {
  return (
    <div className="w-full space-y-3">
      {/* Step Numbers & Labels */}
      <nav aria-label="PHILPEN Assessment Progress" className="overflow-x-auto pb-1">
        <ol className="flex items-center justify-between min-w-[620px] gap-2">
          {PHILPEN_STEPS.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <li key={step.id} className="flex-1 flex flex-col items-center text-center">
                <button
                  type="button"
                  onClick={() => onStepClick(step.id)}
                  className={cn(
                    "group flex flex-col items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-lg p-1 transition-all w-full",
                    isCurrent && "font-semibold"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <div className="flex items-center w-full">
                    {/* Circle Indicator */}
                    <div
                      className={cn(
                        "mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all",
                        isCompleted
                          ? "bg-teal-700 text-white"
                          : isCurrent
                          ? "border-2 border-teal-700 bg-white text-teal-800 ring-4 ring-teal-50"
                          : "border border-slate-300 bg-white text-slate-500"
                      )}
                    >
                      {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : step.id}
                    </div>
                  </div>

                  <span
                    className={cn(
                      "mt-1.5 text-[11px] truncate max-w-[90px] block transition-colors leading-tight",
                      isCurrent
                        ? "text-teal-900 font-bold"
                        : isCompleted
                        ? "text-slate-700 font-medium"
                        : "text-slate-400"
                    )}
                  >
                    {step.shortTitle}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Visual Progress Bar */}
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-700 transition-all duration-300 ease-out"
          style={{ width: `${((currentStep - 1) / (PHILPEN_STEPS.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
