/* =========================
   NavLink Component (Common)
   A Next.js Link wrapper that automatically
   applies an active class when the current
   pathname matches the `to` prop.
   Drop-in replacement for React Router's NavLink.
========================= */

"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/*  Types */
interface NavLinkCompatProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>,
    LinkProps {
  to: string;
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

/*  Component */
const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, to, href, ...props }, ref) => {
    const pathname = usePathname();
    const isActive =
      pathname === to || pathname?.startsWith(String(to) + "/");

    return (
      <Link
        ref={ref}
        href={to}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };
