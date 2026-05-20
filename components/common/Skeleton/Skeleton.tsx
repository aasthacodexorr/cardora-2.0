/* =========================
   Skeleton Component
   Reusable skeleton loader component
   for displaying loading states.
   Provides consistent skeleton styling.
========================= */

import { cn } from "@/lib/utils";

/* ── Types ──────────────────────────────────────────────────── */
interface SkeletonProps {
  className?: string;
  variant?: "default" | "text" | "circular" | "rounded";
}

/* ── Component ─────────────────────────────────────────────── */
const Skeleton = ({
  className,
  variant = "default",
}: SkeletonProps) => {
  const variantClasses = {
    default: "rounded-md",
    text: "rounded h-4",
    circular: "rounded-full",
    rounded: "rounded-lg",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-muted",
        variantClasses[variant],
        className
      )}
    />
  );
};

export default Skeleton;
