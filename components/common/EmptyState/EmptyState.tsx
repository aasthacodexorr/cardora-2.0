/* =========================
   EmptyState Component
   Reusable empty state component for
   displaying when no content is available.
   Provides consistent empty state styling.
========================= */

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/* ── Types ──────────────────────────────────────────────────── */
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/* ── Component ─────────────────────────────────────────────── */
const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
  size = "md",
}: EmptyStateProps) => {
  const sizeClasses = {
    sm: "py-8 px-4",
    md: "py-12 px-6",
    lg: "py-16 px-8",
  };

  const iconSizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        sizeClasses[size],
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            "text-muted-foreground mb-4",
            iconSizeClasses[size]
          )}
        >
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4 max-w-md">
          {description}
        </p>
      )}
      {action}
    </div>
  );
};

export default EmptyState;
