import type { ReactNode } from "react";
import { cn } from "./cn";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center gap-sm py-xl px-md",
        className,
      )}
    >
      {icon && <div className="text-on-surface-variant">{icon}</div>}
      <h3 className="font-serif text-headline-sm text-on-surface">{title}</h3>
      {description && (
        <p className="text-body-md text-on-surface-variant max-w-md">{description}</p>
      )}
      {action}
    </div>
  );
}
