import * as React from "react";

export interface BarChartItem {
  label: string;
  value: number;
  subLabel?: string;
  percentage?: number;
  colorClass?: string;
  barColor?: string;
}

interface AccessibleBarChartProps {
  title?: string;
  items: BarChartItem[];
  maxValue?: number;
  valueSuffix?: string;
}

export function AccessibleBarChart({
  title,
  items,
  maxValue,
  valueSuffix = "",
}: AccessibleBarChartProps) {
  if (items.length === 0) {
    return (
      <div className="space-y-2" role="region" aria-label={title || "Bar chart data"}>
        {title && <h4 className="text-xs font-semibold text-slate-700">{title}</h4>}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
          No records logged for this period.
        </div>
      </div>
    );
  }

  const calculatedMax =
    maxValue || Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="space-y-3" role="region" aria-label={title || "Bar chart data"}>
      {title && (
        <h4 className="text-xs font-semibold text-slate-700">{title}</h4>
      )}

      <div className="space-y-2.5">
        {items.map((item, idx) => {
          const percentage = Math.min(
            100,
            Math.round((item.value / calculatedMax) * 100)
          );

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 min-w-0 pr-2">
                  <span className="font-medium text-slate-700 truncate" title={item.label}>
                    {item.label}
                  </span>
                  {item.subLabel && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      ({item.subLabel})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0 text-slate-900 font-semibold font-mono">
                  <span>
                    {item.value.toLocaleString()} {valueSuffix}
                  </span>
                  {item.percentage !== undefined && (
                    <span className="text-[11px] text-slate-500 font-normal">
                      ({item.percentage}%)
                    </span>
                  )}
                </div>
              </div>

              {/* Accessible Bar Track */}
              <div
                className="h-2 w-full rounded-full bg-slate-100 overflow-hidden"
                role="progressbar"
                aria-valuenow={item.value}
                aria-valuemin={0}
                aria-valuemax={calculatedMax}
                aria-label={`${item.label}: ${item.value}`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.barColor || item.colorClass || "bg-teal-600"
                  }`}
                  style={{ width: `${item.value > 0 ? Math.max(percentage, 2) : 0}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
