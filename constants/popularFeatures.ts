import { PopularFeatureTag } from "@/types/vehicle";

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
      "parking sensors‡",
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
      "automated cruise control‡",
      "automated cruise control",
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
      "blind spot monitor‡",
      "blind spot monitor",
      "blind spot monitoring",
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
      "lane departure warning‡",
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
      "power gach or deck lid",
      "power gach deck lid",
      "power hatch / deck lid",
      "power hatch/deck lid",
      "power hatch or deck lid",
      "power hatch deck lid",
      "power deck lid",
      "power liftgate",
      "power tailgate",
      "power trunk",
      "power-liftgate",
      "power hatch",
    ],
  },
  {
    id: "memory-seats",
    name: "Memory Seats",
    aliases: [
      "memory seat(s)",
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
      "power seat(s)",
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
      "a/c seat(s)",
      "a/c seats",
      "ac seat(s)",
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
    .replace(/[‡†*®™]/g, "")
    .replace(/\(s\)/g, "s")
    .replace(/&/g, " and ")
    .replace(/[/\\#,+()$~%.'":*?<>{}]/g, " ")
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

/**
 * 23 Default Popular Feature Tags fetched from the canonical backend configuration:
 * https://demo.zopsoftware.com/api/website/inventory/configurations/default-popular-features
 */
export const DEFAULT_POPULAR_FEATURE_TAGS: PopularFeatureTag[] = [
  {
    icon: "https://zopsoftware-asset.b-cdn.net/Feature_Icons_Web_Final/apple-carplay-android-auto.svg",
    label: "Apple CarPlay & Android Auto",
    value: "Apple CarPlay and Android Auto",
  },
  {
    icon: "https://zopsoftware-asset.b-cdn.net/Feature_Icons_Web_Final/rear-parking-camera.svg",
    label: "Rear parking camera",
    value: "Rear parking camera",
  },
  {
    icon: "https://zopsoftware-asset.b-cdn.net/Feature_Icons_Web_Final/parking-sensors.svg",
    label: "Parking sensors",
    value: "Parking sensors",
  },
  {
    icon: "https://zopsoftware-asset.b-cdn.net/Feature_Icons_Web_Final/roof-rails.svg",
    label: "Roof rails",
    value: "Roof rails",
  },
  {
    icon: "https://zopsoftware-asset.b-cdn.net/Feature_Icons_Web_Final/alloy-wheels.svg",
    label: "Alloy wheels",
    value: "Alloy wheels",
  },
  {
    icon: "https://zopsoftware-asset.b-cdn.net/Feature_Icons_Web_Final/adaptive-cruise-control.svg",
    label: "Adaptive cruise control",
    value: "Adaptive cruise control",
  },
  {
    icon: "https://zopsoftware-asset.b-cdn.net/Feature_Icons_Web_Final/blind-spot-monitoring.svg",
    label: "Blind spot monitoring",
    value: "Blind spot monitoring",
  },
  {
    icon: "https://zopsoftware-asset.b-cdn.net/Feature_Icons_Web_Final/heated-steering-wheel.svg",
    label: "Heated Steering Wheel",
    value: "Heated Steering Wheel",
  },
  {
    icon: "https://zopsoftware-asset.b-cdn.net/Feature_Icons_Web_Final/remote-start.svg",
    label: "Remote Start",
    value: "Remote Start",
  },
  {
    icon: "https://zopsoftware-asset.b-cdn.net/Feature_Icons_Web_Final/front-seat-heaters.svg",
    label: "Front Seat Heaters",
    value: "Front Seat Heaters",
  },
  {
    icon: "https://zopsoftware-asset.b-cdn.net/Feature_Icons_Web_Final/navigation-system.svg",
    label: "Navigation System",
    value: "Navigation System",
  },
  {
    icon: "https://zopsoftware-asset.b-cdn.net/Feature_Icons_Web_Final/bluetooth-technology.svg",
    label: "Bluetooth Technology",
    value: "Bluetooth Technology",
  },
  {
    icon: "https://zopsoftware-asset.b-cdn.net/Feature_Icons_Web_Final/sunroof.svg",
    label: "Sunroof",
    value: "Sunroof",
  },
  {
    icon: "https://zopsoftware-asset.b-cdn.net/Feature_Icons_Web_Final/push-to-start.svg",
    label: "Push to Start",
    value: "Push to Start",
  },
  {
    icon: "https://zopsoftware-asset.b-cdn.net/Feature_Icons_Web_Final/leather-seats.svg",
    label: "Leather Seats",
    value: "Leather Seats",
  },
  {
    icon: "https://zopsoftware-asset.b-cdn.net/Feature_Icons_Web_Final/heads-up-display.svg",
    label: "Heads up Display",
    value: "Heads up Display",
  },
  {
    icon: "https://zopsoftware-asset.b-cdn.net/Feature_Icons_Web_Final/360-degree-camera.svg",
    label: "360 Degree Camera",
    value: "360 Degree Camera",
  },
  {
    icon: "https://zopsoftware-asset.b-cdn.net/Feature_Icons_Web_Final/tow-pack.svg",
    label: "Tow Pack",
    value: "Tow Pack",
  },
  {
    icon: "https://zopsoftware-asset.b-cdn.net/Feature_Icons_Web_Final/lane-departure-warning.svg",
    label: "Land Departure Warning",
    value: "Land Departure Warning",
  },
  {
    icon: "https://zopsoftware-asset.b-cdn.net/Feature_Icons_Web_Final/power-hatch-deck-lid.svg",
    label: "Power Gach/ Deck Lid",
    value: "Power Gach or Deck Lid",
  },
  {
    icon: "https://zopsoftware-asset.b-cdn.net/Feature_Icons_Web_Final/memory-seats.svg",
    label: "Memory Seats",
    value: "Memory Seats",
  },
  {
    icon: "https://zopsoftware-asset.b-cdn.net/Feature_Icons_Web_Final/power-seats.svg",
    label: "Power Seats",
    value: "Power Seats",
  },
  {
    icon: "https://zopsoftware-asset.b-cdn.net/Feature_Icons_Web_Final/ac-seats.svg",
    label: "A/C Seats",
    value: "Air Conditioned Seats",
  },
];

/**
 * Returns the icon URL for a given feature name, label, or value.
 */
export function getFeatureIcon(featureNameOrValue: string): string | undefined {
  if (!featureNameOrValue) return undefined;
  const match = DEFAULT_POPULAR_FEATURE_TAGS.find(
    (tag) =>
      tag.label.toLowerCase() === featureNameOrValue.toLowerCase() ||
      tag.value.toLowerCase() === featureNameOrValue.toLowerCase() ||
      isFeatureMatch(tag.label, featureNameOrValue) ||
      isFeatureMatch(tag.value, featureNameOrValue)
  );
  return match?.icon;
}
