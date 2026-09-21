/**
 * Centralized query-parameter utilities
 *
 * Single source of truth for reading and writing URL query parameters
 * across the entire application.
 *
 * Rules:
 * - getQueryParams()  — reads ALL current page query parameters
 * - setQueryParams()  — applies current page query parameters to any URL
 * - isZopSoftwareUrl() — validates whether a URL belongs to ZopSoftware
 *
 * Nothing in here is tied to a specific parameter name (e.g. inventory_id).
 * All logic is generic so any parameter propagates automatically.
 */

/**
 * Returns the current page's query parameters as a URLSearchParams object.
 *
 * Works in both browser and SSR contexts; returns an empty URLSearchParams
 * on the server so callers never have to guard against undefined.
 *
 * Example:
 *   URL: /inventory?inventory_id=2588&source=website
 *   getQueryParams() → URLSearchParams { inventory_id: "2588", source: "website" }
 */
export function getQueryParams(): URLSearchParams {
  if (typeof window === "undefined") {
    return new URLSearchParams();
  }
  return new URLSearchParams(window.location.search);
}

/**
 * Applies the current page query parameters to a destination URL.
 *
 * - Accepts both absolute URLs (https://...) and relative paths (/finance).
 * - Uses set() so existing parameters on the destination URL are overwritten
 *   by the page parameter when the same key is present.
 * - Preserves any parameters that already exist on the destination URL and
 *   are not present in the current page parameters.
 * - Returns the URL unchanged (same string reference) if there are no page
 *   query parameters to apply.
 *
 * Example:
 *   Current page:   /inventory?inventory_id=2588&source=website
 *   Input:          /finance
 *   Output:         /finance?inventory_id=2588&source=website
 *
 *   Current page:   /inventory?inventory_id=2588
 *   Input:          https://cardora.zopsoftware.com/api/templates/render/7?foo=bar
 *   Output:         https://cardora.zopsoftware.com/api/templates/render/7?foo=bar&inventory_id=2588
 *
 * @param url - Absolute URL or root-relative path to decorate.
 * @returns   - The decorated URL as a string.
 */
export function setQueryParams(url: string): string {
  const pageParams = getQueryParams();

  if (!pageParams.toString()) {
    return url;
  }

  // URL constructor requires an absolute base when the input is relative.
  const base =
    typeof window !== "undefined" ? window.location.origin : "http://localhost";

  const parsed = new URL(url, base);

  pageParams.forEach((value, key) => {
    parsed.searchParams.set(key, value);
  });

  // Return a root-relative path for relative inputs so callers don't end up
  // with unexpected origins embedded in internal links.
  if (url.startsWith("/") || (!url.startsWith("http://") && !url.startsWith("https://"))) {
    return parsed.pathname + (parsed.search ? parsed.search : "") + (parsed.hash ? parsed.hash : "");
  }

  return parsed.toString();
}

/**
 * Returns true when the given URL hostname is zopsoftware.com or any
 * subdomain of it (e.g. cardora.zopsoftware.com).
 *
 * Uses strict hostname comparison — never a loose string-include check —
 * so unrelated iframes (YouTube, Google, payment providers, etc.) are
 * never accidentally modified.
 *
 * @param url - Absolute URL string.
 */
export function isZopSoftwareUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return (
      hostname === "zopsoftware.com" ||
      hostname.endsWith(".zopsoftware.com")
    );
  } catch {
    return false;
  }
}
