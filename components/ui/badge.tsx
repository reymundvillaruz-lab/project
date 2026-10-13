import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-teal-100 text-teal-800 border border-teal-200",
        secondary:
          "border-transparent bg-slate-100 text-slate-700 border border-slate-200",
        destructive:
          "border-transparent bg-rose-50 text-rose-700 border border-rose-200",
        warning:
          "border-transparent bg-amber-50 text-amber-800 border border-amber-200",
        success:
          "border-transparent bg-emerald-50 text-emerald-800 border border-emerald-200",
        info:
          "border-transparent bg-sky-50 text-sky-800 border border-sky-200",
        outline:
          "text-slate-800 border border-slate-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  indicatorColor?: "green" | "yellow" | "red" | "blue" | "gray";
}

function Badge({ className, variant, indicatorColor, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {indicatorColor && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", {
            "bg-emerald-500": indicatorColor === "green",
            "bg-amber-500": indicatorColor === "yellow",
            "bg-rose-500": indicatorColor === "red",
            "bg-sky-500": indicatorColor === "blue",
            "bg-slate-400": indicatorColor === "gray",
          })}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
