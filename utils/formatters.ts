/* =========================
   Pure helper functions for formatting
   data values used across the UI:
   currency, mileage, dates, etc.
========================= */

/**
 * Strips all HTML tags from a string.
 * Used to sanitize vehicle titles from Typesense.
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, "");
}

/**
 * Prepends the CDN base URL to a relative image path.
 * Returns the original URL if it's already absolute.
 */
export function resolveImageUrl(url: string, assetBaseUrl: string): string {
  const trimmed = url.trim();
  return trimmed.startsWith("/") ? `${assetBaseUrl}${trimmed}` : trimmed;
}

/**
 * Parses a semicolon-separated image URL string into an array.
 * Filters out empty entries and resolves relative paths.
 * When vehicles contain dead external URLs (like expired autoscout24 scraper URLs) alongside valid dealer images,
 * filters out the dead URLs so the actual first vehicle image is displayed.
 */
export function parseImageUrls(
  imageUrlsString: string,
  assetBaseUrl: string
): string[] {
  if (!imageUrlsString) return [];
  const rawUrls = imageUrlsString
    .split(";")
    .map((url) => resolveImageUrl(url, assetBaseUrl))
    .filter(Boolean);

  const hasValidUploads = rawUrls.some((u) => !u.includes("autoscout24.net"));
  return hasValidUploads
    ? rawUrls.filter((u) => !u.includes("autoscout24.net"))
    : rawUrls;
}


/* =========================
   cn() Utility
   Merges Tailwind CSS class names using
   clsx (conditional classes) and tailwind-merge
   (deduplication of conflicting Tailwind utilities).
   Used throughout the component library.
========================= */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class values and resolves
 * Tailwind conflicts via tailwind-merge.
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-green-500", "px-6")
 * // → "py-2 bg-green-500 px-6"  (px-4 overridden by px-6)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}