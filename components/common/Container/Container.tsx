/* =========================
   Container Component
   Reusable container component for consistent
   layout and spacing across the application.
   Provides centered layout with max-width
   consistency and responsive padding.
========================= */

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/* ── Types ──────────────────────────────────────────────────── */
interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: boolean;
}

/* ── Component ─────────────────────────────────────────────── */
const Container = ({
  children,
  className,
  size = "xl",
  padding = true,
}: ContainerProps) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-[1280px]",
    "2xl": "max-w-[1400px]",
    full: "max-w-full",
    custom: "max-w-[1600px]",
  };

  const paddingClasses = padding ? "px-5 md:px-6 lg:px-8" : "";

  return (
    <div
      className={cn(
        "mx-auto w-full",
        sizeClasses[size],
        paddingClasses,
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
