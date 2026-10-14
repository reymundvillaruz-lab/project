import * as React from "react";

export interface SegmentItem {
  label: string;
  count: number;
  percentage: number;
  colorClass: string;
}

interface DistributionProgressBarProps {
  title?: string;
  segments: SegmentItem[];
  totalLabel?: string;
  totalValue?: number;
}

export function DistributionProgressBar({
  title,
  segments,
  totalLabel,
  totalValue,
}: DistributionProgressBarProps) {
  return (
    <div className="space-y-2.5">
      {(title || totalLabel) && (
        <div className="flex items-center justify-between text-xs">
          {title && <span className="font-semibold text-slate-700">{title}</span>}
          {totalLabel && (
            <span className="text-slate-500 font-medium">
              {totalLabel}:{" "}
              <span className="font-bold text-slate-900 font-mono">
                {totalValue?.toLocaleString()}
              </span>
            </span>
          )}
        </div>
      )}

      {/* Multi-segment Meter */}
      <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-100 p-0.5 gap-0.5">
        {totalValue && totalValue > 0 ? (
          segments.map((seg, idx) =>
            seg.percentage > 0 ? (
              <div
                key={idx}
                className={`h-full rounded-xs transition-all duration-300 ${seg.colorClass}`}
                style={{ width: `${seg.percentage}%` }}
                title={`${seg.label}: ${seg.count.toLocaleString()} (${seg.percentage}%)`}
              />
            ) : null
          )
        ) : (
          <div className="w-full h-full bg-slate-200/60 rounded-xs" />
        )}
      </div>

      {/* Accessible Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1 text-[11px] text-slate-600">
        {segments.map((seg, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${seg.colorClass}`} />
            <span className="text-slate-700 font-medium">{seg.label}</span>
            <span className="font-mono text-slate-500">
              {seg.count.toLocaleString()} ({seg.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
