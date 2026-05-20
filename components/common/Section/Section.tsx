/* =========================
   Section Component
   Reusable section wrapper for consistent
   vertical spacing and optional backgrounds.
   Provides reusable section structure
   with responsive spacing.
========================= */

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/* ── Types ──────────────────────────────────────────────────── */
interface SectionProps {
  children: ReactNode;
  className?: string;
  spacing?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  background?: "default" | "muted" | "hero" | "dark" | "review";
  id?: string;
}

/* ── Component ─────────────────────────────────────────────── */
const Section = ({
  children,
  className,
  spacing = "lg",
  background = "default",
  id,
}: SectionProps) => {
  const spacingClasses = {
    none: "py-0",
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
    xl: "py-20",
    "2xl": "py-24",
  };

  const backgroundClasses = {
    default: "bg-background",
    muted: "bg-muted",
    hero: "bg-hero-bg",
    dark: "bg-dark-section",
    review: "bg-review-bg",
  };

  return (
    <section
      id={id}
      className={cn(
        "w-full",
        spacingClasses[spacing],
        backgroundClasses[background],
        className
      )}
    >
      {children}
    </section>
  );
};

export default Section;
