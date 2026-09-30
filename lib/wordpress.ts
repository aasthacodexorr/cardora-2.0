export const BLOG_DOMAINS = {
  cardora: "https://blog.cardora.ca",
} as const;

export function getBlogDomain(host?: string | null): string {
  return BLOG_DOMAINS.cardora;
}

export function getBlogUrl(slug?: string, host?: string | null): string {
  const base = getBlogDomain(host);
  if (!slug) return `${base}/`;
  const cleanSlug = slug.replace(/^\/+|\/+$/g, "");
  return `${base}/${cleanSlug}`;
}