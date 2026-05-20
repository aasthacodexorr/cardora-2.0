/* =========================
   Card Component
   Reusable card component for displaying
   content in a consistent container.
   Provides standardized card styling
   with optional header, body, and footer.
========================= */

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/* ── Types ──────────────────────────────────────────────────── */
interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outlined";
  hoverable?: boolean;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

/* ── Card Component ────────────────────────────────────────── */
const Card = ({
  children,
  className,
  variant = "default",
  hoverable = false,
}: CardProps) => {
  const variantClasses = {
    default: "bg-card text-card-foreground",
    elevated: "bg-card text-card-foreground shadow-md",
    outlined: "bg-card text-card-foreground border border-border",
  };

  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden",
        variantClasses[variant],
        hoverable && "hover:shadow-lg transition-shadow",
        className
      )}
    >
      {children}
    </div>
  );
};

/* ── Card Header ────────────────────────────────────────────── */
const CardHeader = ({ children, className }: CardHeaderProps) => {
  return (
    <div className={cn("p-6 border-b border-border", className)}>
      {children}
    </div>
  );
};

/* ── Card Body ──────────────────────────────────────────────── */
const CardBody = ({ children, className }: CardBodyProps) => {
  return <div className={cn("p-6", className)}>{children}</div>;
};

/* ── Card Footer ────────────────────────────────────────────── */
const CardFooter = ({ children, className }: CardFooterProps) => {
  return (
    <div className={cn("p-6 border-t border-border", className)}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
