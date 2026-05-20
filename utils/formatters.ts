/* =========================
   Formatters Utility
   Pure helper functions for formatting
   data values used across the UI:
   currency, mileage, dates, etc.
========================= */

/**
 * Formats a number as a Canadian dollar price string.
 * e.g. 20990 → "$20,990.00"
 */
export function formatPrice(value: number): string {
  return `$${value.toLocaleString("en-CA")}.00`;
}

/**
 * Formats a mileage number with KM suffix.
 * e.g. 61294 → "61,294 KM"
 */
export function formatKm(value: number): string {
  return `${value.toLocaleString("en-CA")} KM`;
}

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
 */
export function parseImageUrls(
  imageUrlsString: string,
  assetBaseUrl: string
): string[] {
  if (!imageUrlsString) return [];
  return imageUrlsString
    .split(";")
    .map((url) => resolveImageUrl(url, assetBaseUrl))
    .filter(Boolean);
}
