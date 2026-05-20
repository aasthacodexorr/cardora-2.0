/* =========================
   Badge Component
   Reusable badge component for displaying
   status, labels, or small information.
   Provides consistent badge styling.
========================= */

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/* ── Types ──────────────────────────────────────────────────── */
interface BadgeProps {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
}

/* ── Component ─────────────────────────────────────────────── */
const Badge = ({
  variant = "default",
  size = "md",
  className,
  children,
}: BadgeProps) => {
  const variantClasses = {
    default: "bg-muted text-foreground border border-border",
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    success: "bg-brand-green text-white",
    warning: "bg-yellow-500 text-white",
    danger: "bg-destructive text-destructive-foreground",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
