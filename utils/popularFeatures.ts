import { PopularFeatureTag } from "@/types/vehicle";

/**
 * Safely parses vehicle popular_features into an array of strings.
 */
export function parsePopularFeatures(data: unknown): string[] {
  if (!data) return [];

  if (Array.isArray(data)) {
    return data
      .map((item) => (typeof item === "string" ? item.trim() : String(item ?? "").trim()))
      .filter(Boolean);
  }

  if (typeof data === "string") {
    const trimmed = data.trim();
    if (!trimmed || trimmed === "[]") return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => (typeof item === "string" ? item.trim() : String(item ?? "").trim()))
          .filter(Boolean);
      }
    } catch {
      // Fallback: comma-separated string
      return trimmed
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  return [];
}

/**
 * Matches vehicle selected feature values against configuration tags.
 */
export function matchPopularFeatures(
  selectedValues: string[],
  configTags: PopularFeatureTag[]
): PopularFeatureTag[] {
  if (!selectedValues || selectedValues.length === 0 || !configTags || !Array.isArray(configTags) || configTags.length === 0) {
    return [];
  }

  const matched: PopularFeatureTag[] = [];
  const seen = new Set<string>();

  for (const selected of selectedValues) {
    const normalizedSelected = selected.toLowerCase();

    // Match against configuration tag's value or label (case-insensitive)
    const tag = configTags.find((t) => {
      const tagValue = (t.value || "").trim().toLowerCase();
      const tagLabel = (t.label || "").trim().toLowerCase();
      return tagValue === normalizedSelected || tagLabel === normalizedSelected;
    });

    if (tag) {
      const uniqueKey = (tag.value || tag.label || "").toLowerCase();
      if (!seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        matched.push(tag);
      }
    }
  }

  return matched;
}
