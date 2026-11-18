/**
 * 23 Popular Vehicle Features Constants & Helpers
 * Used across Inventory Search Chips, URL Routing, and Typesense Filtering.
 */

export const POPULAR_FEATURE_LIST = [
  "Apple CarPlay & Android Auto",
  "Rear Parking Camera",
  "Parking Sensors",
  "Roof Rails",
  "Alloy Wheels",
  "Adaptive Cruise Control",
  "Blind Spot Monitoring",
  "Heated Steering Wheel",
  "Remote Start",
  "Front Seat Heaters",
  "Navigation System",
  "Bluetooth Technology",
  "Sunroof",
  "Push to Start",
  "Leather Seats",
  "Heads Up Display",
  "360 Degree Camera",
  "Tow Pack",
  "Lane Departure Warning",
  "Power Gach/Deck Lid",
  "Memory Seats",
  "Power Seats",
  "A/C Seats",
] as const;

export type PopularFeatureName = (typeof POPULAR_FEATURE_LIST)[number];

export interface PopularFeatureMeta {
  id: string;
  name: PopularFeatureName;
  aliases: string[];
}

export const POPULAR_FEATURE_DEFINITIONS: PopularFeatureMeta[] = [
  {
    id: "apple-carplay-android-auto",
    name: "Apple CarPlay & Android Auto",
    aliases: [
      "apple carplay & android auto",
      "apple carplay and android auto",
      "apple carplay",
      "android auto",
      "carplay",
      "apple-carplay",
      "android-auto",
      "apple_carplay",
      "android_auto",
    ],
  },
  {
    id: "rear-parking-camera",
    name: "Rear Parking Camera",
    aliases: [
      "rear parking camera",
      "backup camera",
      "backup-camera",
      "rear camera",
      "reverse camera",
      "rearview camera",
      "rear-view camera",
    ],
  },
  {
    id: "parking-sensors",
    name: "Parking Sensors",
    aliases: [
      "parking sensors",
      "parking sensor",
      "parking-sensors",
      "park assist",
      "parking distance control",
      "park distance warning",
      "rear parking sensors",
      "front and rear parking sensors",
    ],
  },
  {
    id: "roof-rails",
    name: "Roof Rails",
    aliases: [
      "roof rails",
      "roof rack",
      "roof-rails",
      "roof-rack",
      "luggage rack",
    ],
  },
  {
    id: "alloy-wheels",
    name: "Alloy Wheels",
    aliases: [
      "alloy wheels",
      "alloy rims",
      "aluminum wheels",
      "alloy-wheels",
      "custom wheels",
    ],
  },
  {
    id: "adaptive-cruise-control",
    name: "Adaptive Cruise Control",
    aliases: [
      "adaptive cruise control",
      "adaptive cruise",
      "adaptive-cruise-control",
      "smart cruise control",
      "acc",
    ],
  },
  {
    id: "blind-spot-monitoring",
    name: "Blind Spot Monitoring",
    aliases: [
      "blind spot monitoring",
      "blind spot monitor",
      "blind spot detection",
      "blind-spot-monitoring",
      "blind-spot-monitor",
      "bsm",
      "blis",
    ],
  },
  {
    id: "heated-steering-wheel",
    name: "Heated Steering Wheel",
    aliases: [
      "heated steering wheel",
      "heated steering",
      "heated-steering-wheel",
      "heated wheel",
    ],
  },
  {
    id: "remote-start",
    name: "Remote Start",
    aliases: [
      "remote start",
      "remote engine start",
      "remote-start",
      "keyless remote start",
    ],
  },
  {
    id: "front-seat-heaters",
    name: "Front Seat Heaters",
    aliases: [
      "front seat heaters",
      "heated seats",
      "heated front seats",
      "seat heaters",
      "front-seat-heaters",
      "heated-seats",
    ],
  },
  {
    id: "navigation-system",
    name: "Navigation System",
    aliases: [
      "navigation system",
      "navigation",
      "navigation-system",
      "gps navigation",
      "gps",
      "nav system",
    ],
  },
  {
    id: "bluetooth-technology",
    name: "Bluetooth Technology",
    aliases: [
      "bluetooth technology",
      "bluetooth",
      "bluetooth wireless",
      "bluetooth-technology",
      "hands-free bluetooth",
    ],
  },
  {
    id: "sunroof",
    name: "Sunroof",
    aliases: [
      "sunroof",
      "moonroof",
      "sunroof / moonroof",
      "panoramic sunroof",
      "panoramic roof",
      "sun-roof",
    ],
  },
  {
    id: "push-to-start",
    name: "Push to Start",
    aliases: [
      "push to start",
      "push-to-start",
      "push button start",
      "push-button start",
      "keyless start",
      "keyless go",
    ],
  },
  {
    id: "leather-seats",
    name: "Leather Seats",
    aliases: [
      "leather seats",
      "leather interior",
      "leather upholstery",
      "leather-seats",
      "leather seating",
    ],
  },
  {
    id: "heads-up-display",
    name: "Heads Up Display",
    aliases: [
      "heads up display",
      "head-up display",
      "heads-up display",
      "hud",
      "head up display",
    ],
  },
  {
    id: "360-degree-camera",
    name: "360 Degree Camera",
    aliases: [
      "360 degree camera",
      "360 camera",
      "360-degree camera",
      "surround view camera",
      "surround view",
      "bird's eye view",
      "birds eye view",
    ],
  },
  {
    id: "tow-pack",
    name: "Tow Pack",
    aliases: [
      "tow pack",
      "tow package",
      "trailer tow package",
      "towing package",
      "tow-pack",
      "tow hitch",
      "trailer hitch",
    ],
  },
  {
    id: "lane-departure-warning",
    name: "Lane Departure Warning",
    aliases: [
      "lane departure warning",
      "land departure warning", // CRM typo variant
      "lane keep assist",
      "lane-departure-warning",
      "lane departure",
      "ldw",
      "lka",
    ],
  },
  {
    id: "power-gach-deck-lid",
    name: "Power Gach/Deck Lid",
    aliases: [
      "power gach/deck lid",
      "power gach/ deck lid",
      "power gach / deck lid",
      "power deck lid",
      "power liftgate",
      "power tailgate",
      "power trunk",
      "power-liftgate",
    ],
  },
  {
    id: "memory-seats",
    name: "Memory Seats",
    aliases: [
      "memory seats",
      "memory seat",
      "driver seat memory",
      "memory-seats",
      "seat memory",
    ],
  },
  {
    id: "power-seats",
    name: "Power Seats",
    aliases: [
      "power seats",
      "power seat",
      "power driver seat",
      "power-seats",
      "electric seats",
      "power adjustable seats",
    ],
  },
  {
    id: "ac-seats",
    name: "A/C Seats",
    aliases: [
      "a/c seats",
      "ac seats",
      "a/c seat",
      "ventilated seats",
      "ventilated front seats",
      "cooled seats",
      "air conditioned seats",
    ],
  },
];

/**
 * Normalizes a raw feature string for fuzzy/alias matching.
 */
export function normalizeFeatureKey(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[&/\\#,+()$~%.'":*?<>{}]/g, " ")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Finds the definition for a given feature name, id, or alias.
 */
export function findPopularFeatureDefinition(value: string): PopularFeatureMeta | undefined {
  if (!value || typeof value !== "string") return undefined;
  const trimmed = value.trim();
  const lower = trimmed.toLowerCase();
  const normalized = normalizeFeatureKey(trimmed);

  return POPULAR_FEATURE_DEFINITIONS.find((def) => {
    if (def.name.toLowerCase() === lower || def.id === lower) return true;
    if (normalizeFeatureKey(def.name) === normalized || normalizeFeatureKey(def.id) === normalized) {
      return true;
    }
    return def.aliases.some((alias) => {
      const aliasLower = alias.toLowerCase();
      return aliasLower === lower || normalizeFeatureKey(alias) === normalized;
    });
  });
}

/**
 * Returns the exact canonical feature name (one of 23), or null if not recognized.
 */
export function getCanonicalFeatureName(value: string): PopularFeatureName | null {
  const def = findPopularFeatureDefinition(value);
  return def ? def.name : null;
}

/**
 * Checks whether two feature values represent the same feature.
 */
export function isFeatureMatch(valA: string, valB: string): boolean {
  if (!valA || !valB) return false;
  if (valA.trim().toLowerCase() === valB.trim().toLowerCase()) return true;

  const defA = findPopularFeatureDefinition(valA);
  const defB = findPopularFeatureDefinition(valB);

  if (defA && defB) {
    return defA.id === defB.id;
  }

  return normalizeFeatureKey(valA) === normalizeFeatureKey(valB);
}

/**
 * Returns all search/filter query variants for a feature (name, id, aliases, casings).
 */
export function getFeatureQueryVariants(value: string): string[] {
  const def = findPopularFeatureDefinition(value);
  const variants = new Set<string>();

  variants.add(value.trim());

  if (def) {
    variants.add(def.name);
    variants.add(def.id);
    def.aliases.forEach((alias) => variants.add(alias));
  }

  // Also include lowercase variants for case-insensitive matching
  Array.from(variants).forEach((v) => {
    variants.add(v.toLowerCase());
  });

  return Array.from(variants).filter(Boolean);
}
