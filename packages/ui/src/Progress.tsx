import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number; // 0–100
  label?: string;
}

export function Progress({ value, label, className, ...props }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      {label && (
        <div className="flex justify-between text-label-sm text-on-surface-variant">
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full rounded-full bg-surface-container overflow-hidden"
      >
        <div
          className="h-full bg-secondary-container transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
