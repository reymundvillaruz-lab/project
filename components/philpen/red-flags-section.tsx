"use client";

import * as React from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { YesNoRadio } from "./yes-no-radio";
import { PhilpenRedFlags } from "@/lib/mock-data/philpen";

interface RedFlagsSectionProps {
  data: PhilpenRedFlags;
  onChange: (field: keyof PhilpenRedFlags, value: "Yes" | "No") => void;
}

const RED_FLAGS_ITEMS: Array<{
  id: keyof PhilpenRedFlags;
  label: string;
  description: string;
}> = [
  {
    id: "chestPain",
    label: "Chest Pain",
    description: "Crushing, squeezing substernal pain or chest pressure radiating to arm, neck, or jaw",
  },
  {
    id: "difficultyBreathing",
    label: "Difficulty of Breathing",
    description: "Acute shortness of breath, dyspnea, or severe respiratory distress",
  },
  {
    id: "lossOfConsciousness",
    label: "Loss of Consciousness",
    description: "Syncope, fainting, unresponsive state, or sudden collapse",
  },
  {
    id: "slurredSpeech",
    label: "Slurred Speech",
    description: "Acute onset dysarthria, difficulty speaking, or garbled words",
  },
  {
    id: "facialAsymmetry",
    label: "Facial Asymmetry",
    description: "Sudden facial drooping or weakness on one side of the face (FAST sign)",
  },
  {
    id: "weaknessNumbness",
    label: "Weakness / Numbness on arm or one side of the body",
    description: "Hemiparesis, sudden unilateral motor or sensory loss",
  },
  {
    id: "disoriented",
    label: "Disoriented as to time, place and person",
    description: "Acute confusion, delirium, or altered mental status",
  },
  {
    id: "chestRetractions",
    label: "Chest Retractions",
    description: "Intercostal, subcostal, or supraclavicular retractions during respiration",
  },
  {
    id: "seizureConvulsion",
    label: "Seizure or Convulsion",
    description: "Active fitting, tonic-clonic movements, or recent unprovoked seizure",
  },
  {
    id: "selfHarmSuicide",
    label: "Act of self-harm or suicide",
    description: "Expressed suicidal ideation, intent, or self-inflicted injuries",
  },
  {
    id: "agitatedBehavior",
    label: "Agitated and/or aggressive behavior",
    description: "Violent outbursts, extreme psychomotor agitation, or danger to self/others",
  },
  {
    id: "eyeInjuryForeignBody",
    label: "Eye Injury / Foreign Body on the eye",
    description: "Chemical exposure, penetrating trauma, sudden vision loss, or embedded particle",
  },
  {
    id: "severeInjuries",
    label: "Severe Injuries",
    description: "Major trauma, extensive burns, severe bleeding, or suspected fractures",
  },
];

export function RedFlagsSection({ data, onChange }: RedFlagsSectionProps) {
  // Check if ANY red flag is marked "Yes"
  const hasAnyRedFlag = React.useMemo(() => {
    return Object.values(data).some((val) => val === "Yes");
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Prominent Warning Banner if ANY Red Flag is Yes */}
      {hasAnyRedFlag && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-lg border-2 border-rose-500 bg-rose-50 p-4 text-rose-950 shadow-sm animate-in fade-in-50 duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-rose-600 p-1 text-white shrink-0 mt-0.5">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold tracking-tight text-rose-950 uppercase flex items-center gap-1.5">
                Immediate Physician Referral Required
              </h4>
              <p className="text-xs text-rose-800 leading-relaxed">
                One or more acute clinical red flags are present. Patient requires immediate stabilization and urgent evaluation by the municipal health officer or nearest hospital emergency facility.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section Instruction */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="h-4 w-4 text-rose-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs">
            <p className="font-semibold text-slate-800">
              PHILPEN Red Flags Assessment Protocol
            </p>
            <p className="text-slate-500 leading-relaxed">
              Screen for urgent clinical symptoms and acute danger signs. Any positive finding prompts an immediate referral flag.
            </p>
          </div>
        </div>
      </div>

      {/* Red Flags Questions List */}
      <div className="space-y-2">
        {RED_FLAGS_ITEMS.map((item) => (
          <YesNoRadio
            key={item.id}
            name={item.id}
            value={data[item.id]}
            onChange={(val) => onChange(item.id, val)}
            label={item.label}
            description={item.description}
            isRedFlag={true}
          />
        ))}
      </div>
    </div>
  );
}
