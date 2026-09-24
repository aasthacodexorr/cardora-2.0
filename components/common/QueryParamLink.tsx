"use client";

/**
 * QueryParamLink
 *
 * Drop-in replacement for Next.js <Link> and plain <a> for ALL internal
 * navigation. Automatically appends the current page's query parameters
 * to the destination URL at click time, so params like inventory_id,
 * source, utm_*, etc. are preserved across every page transition.
 *
 * Usage — exactly like <Link> or <a>:
 *
 *   <QueryParamLink href="/book-an-appointment">Schedule Online</QueryParamLink>
 *   <QueryParamLink href="/finance" className="btn">Get started</QueryParamLink>
 *
 * Rules:
 * - Only rewrites paths that start with "/" (internal pages).
 * - External links (http/https) are passed through unchanged.
 * - Does NOT interfere with Next.js soft navigation — still uses router.push.
 * - If there are no query params on the current page, the href is unchanged.
 * - Preserves any params already present on the destination href (they stay;
 *   page params win on key collisions via URLSearchParams.set).
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setQueryParams } from "@/utils/queryParams";

type QueryParamLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  /** Force a full page reload instead of soft navigation. Useful for pages
   *  like /inventory that manage their own routing state. */
  hardNavigate?: boolean;
  children: React.ReactNode;
};

export default function QueryParamLink({
  href,
  hardNavigate = false,
  onClick,
  children,
  ...rest
}: QueryParamLinkProps) {
  const router = useRouter();
  const [decoratedHref, setDecoratedHref] = useState(href);

  useEffect(() => {
    setDecoratedHref(setQueryParams(href));
  }, [href]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Call any passed-in onClick first
      onClick?.(e);
      if (e.defaultPrevented) return;

      // Only intercept internal paths
      if (!href.startsWith("/")) return;

      e.preventDefault();
      const finalUrl = setQueryParams(href);

      if (hardNavigate) {
        window.location.href = finalUrl;
      } else {
        router.push(finalUrl);
      }
    },
    [href, hardNavigate, onClick, router]
  );

  // External links: render a plain <a> with no interception
  if (!href.startsWith("/")) {
    return (
      <a href={href} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={decoratedHref} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
