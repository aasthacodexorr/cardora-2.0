/* =========================
   Typography Component
   Reusable typography component for
   consistent text styling.
   Provides standardized heading,
   body, and caption styles.
========================= */

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/* ── Types ──────────────────────────────────────────────────── */
interface TypographyProps {
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body" | "caption" | "label";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold";
  color?: "default" | "muted" | "primary" | "brand" | "price";
  className?: string;
  children: ReactNode;
  as?: React.ElementType;
}

/* ── Component ─────────────────────────────────────────────── */
const Typography = ({
  variant = "body",
  size,
  weight = "normal",
  color = "default",
  className,
  children,
  as: Component = "p",
}: TypographyProps) => {
  const variantClasses = {
    h1: "font-carmax font-semibold",
    h2: "font-carmax font-semibold",
    h3: "font-carmax font-semibold",
    h4: "font-carmax font-semibold",
    h5: "font-carmax font-semibold",
    h6: "font-carmax font-semibold",
    body: "font-normal",
    caption: "font-normal",
    label: "font-medium",
  };

  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
    "6xl": "text-6xl",
    "7xl": "text-7xl",
  };

  const weightClasses = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
  };

  const colorClasses = {
    default: "text-foreground",
    muted: "text-muted-foreground",
    primary: "text-primary",
    brand: "text-brand-green",
    price: "text-price-green",
  };

  return (
    <Component
      className={cn(
        variantClasses[variant],
        size && sizeClasses[size],
        weightClasses[weight],
        colorClasses[color],
        className
      )}
    >
      {children}
    </Component>
  );
};

export default Typography;
