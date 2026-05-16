import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";

export const badgeVariants = cva(
  "inline-flex items-center gap-1 px-3 py-1 rounded-full text-label-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary-fixed text-on-primary-fixed",
        secondary: "bg-secondary-fixed text-on-secondary-fixed",
        outline: "border border-outline text-on-surface",
        muted: "bg-surface-container text-on-surface-variant",
        success: "bg-primary-container text-on-primary-container",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
