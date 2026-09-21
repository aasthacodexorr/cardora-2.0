"use client";

/**
 * AppointmentLink
 *
 * Client component used in server-rendered service pages to navigate to
 * /book-an-appointment while preserving all current page query parameters.
 * Accepts all standard anchor props so it can match any styling the caller needs.
 */

import QueryParamLink from "@/components/common/QueryParamLink";

type AppointmentLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  children: React.ReactNode;
};

export default function AppointmentLink({ children, ...rest }: AppointmentLinkProps) {
  return (
    <QueryParamLink href="/book-an-appointment" {...rest}>
      {children}
    </QueryParamLink>
  );
}
