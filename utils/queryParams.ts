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
 * Applies query parameters from the current page (or a provided search string)
 * to a destination URL.
 *
 * - Accepts both absolute URLs (https://...) and relative paths (/finance).
 * - Parameters already specified on the destination URL (e.g. inventory_id=3195)
 *   are preserved and take precedence over current page parameters.
 * - Current page parameters (e.g. sdnfsdjk, utm_*, source, etc.) are appended.
 * - Valueless parameters (e.g. ?sdnfsdjk without an '=') are preserved without
 *   an unnecessary trailing '='.
 * - Normalizes any accidental trailing slashes before the query string on
 *   internal routes (e.g. /finance/?... -> /finance?...).
 * - Works in SSR by returning the original URL when no window or search string is available.
 *
 * Example:
 *   Current page:   /inventory/3195-2026-gmc-sierra-1500-at4?sdnfsdjk
 *   Input:          /finance?inventory_id=3195
 *   Output:         /finance?inventory_id=3195&sdnfsdjk
 *
 *   Input:          /trade-in-my-car?inventory_id=3195
 *   Output:         /trade-in-my-car?inventory_id=3195&sdnfsdjk
 *
 * @param url           - Absolute URL or root-relative path to decorate.
 * @param currentSearch - Optional query string to use instead of window.location.search.
 * @returns             - The decorated URL string.
 */
export function setQueryParams(url: string, currentSearch?: string): string {
  const search =
    currentSearch !== undefined
      ? currentSearch
      : typeof window !== "undefined"
      ? window.location.search
      : "";

  if (!search) {
    return url;
  }

  const rawSearch = search.startsWith("?") ? search.slice(1) : search;
  if (!rawSearch) {
    return url;
  }

  // Handle hash
  const hashIndex = url.indexOf("#");
  let hash = "";
  let withoutHash = url;
  if (hashIndex !== -1) {
    hash = url.slice(hashIndex);
    withoutHash = url.slice(0, hashIndex);
  }

  // Handle existing query in url
  const queryIndex = withoutHash.indexOf("?");
  let basePath = withoutHash;
  let existingQuery = "";
  if (queryIndex !== -1) {
    basePath = withoutHash.slice(0, queryIndex);
    existingQuery = withoutHash.slice(queryIndex + 1);
  }

  // Normalize trailing slash on relative paths (e.g. /finance/ -> /finance)
  if (basePath.startsWith("/") && basePath.length > 1 && basePath.endsWith("/")) {
    basePath = basePath.slice(0, -1);
  }

  const params = new Map<string, { value: string; hasEqual: boolean }>();

  if (existingQuery) {
    existingQuery.split("&").forEach((part) => {
      if (!part) return;
      const eqIdx = part.indexOf("=");
      if (eqIdx === -1) {
        params.set(part, { value: "", hasEqual: false });
      } else {
        const key = part.slice(0, eqIdx);
        const val = part.slice(eqIdx + 1);
        params.set(key, { value: val, hasEqual: true });
      }
    });
  }

  rawSearch.split("&").forEach((part) => {
    if (!part) return;
    const eqIdx = part.indexOf("=");
    if (eqIdx === -1) {
      if (!params.has(part)) {
        params.set(part, { value: "", hasEqual: false });
      }
    } else {
      const key = part.slice(0, eqIdx);
      const val = part.slice(eqIdx + 1);
      // Destination URL params (like inventory_id=3195) take precedence if already set
      if (!params.has(key)) {
        params.set(key, { value: val, hasEqual: true });
      }
    }
  });

  const queryParts: string[] = [];
  params.forEach((meta, key) => {
    if (meta.hasEqual) {
      queryParts.push(`${key}=${meta.value}`);
    } else {
      queryParts.push(key);
    }
  });

  const finalQuery = queryParts.length ? `?${queryParts.join("&")}` : "";
  return `${basePath}${finalQuery}${hash}`;
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
