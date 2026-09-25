import { AppConfig } from "@/lib/appConfig";
import type { UiState } from "instantsearch.js";

type PlainObject = Record<string, any>;

export const BASELINE_MODEL_TO_MAKE: Record<string, string> = {
  "200": "Chrysler",
  "300": "Chrysler",
  "911": "Porsche",
  "1500": "Ram",
  "Sierra 1500": "GMC",
  "Civic": "Honda",
  "WRX": "Subaru",
  "Highlander": "Toyota",
  "Corolla": "Toyota",
  "Yukon XL": "GMC",
  "Escape": "Ford",
  "Taos": "Volkswagen",
  "C-Class": "Mercedes-Benz",
  "Charger": "Dodge",
  "Sonata": "Hyundai",
  "Qashqai": "Nissan",
  "Camry": "Toyota",
  "Corolla Hybrid": "Toyota",
  "Fusion Energi": "Ford",
  "Mustang": "Ford",
  "RAV4": "Toyota",
  "Durango": "Dodge",
  "IS 300": "Lexus",
  "Edge": "Ford",
  "Acadia": "GMC",
  "Encore": "Buick",
  "G70": "Genesis",
  "Envision": "Buick",
  "Santa Fe": "Hyundai",
  "Encore GX": "Buick",
  "Rogue": "Nissan",
  "Corvette": "Chevrolet",
  "KONA": "Hyundai",
  "Silverado 1500": "Chevrolet",
  "Grand Caravan": "Chrysler",
  "Terrain": "GMC",
  "Enclave": "Buick",
  "Trax": "Chevrolet",
  "Grand Cherokee WK": "Jeep",
  "F-150": "Ford",
  "Envista": "Buick",
  "Jetta": "Volkswagen",
  "Tucson": "Hyundai",
  "Accord Hybrid": "Honda",
  "Jetta GLI": "Volkswagen",
  "A-Class": "Mercedes-Benz",
  "Challenger": "Dodge",
  "CLA-Class": "Mercedes-Benz",
  "Elantra": "Hyundai",
  "Q3": "Audi",
  "Grand Cherokee": "Jeep",
  "Q50": "Infiniti",
  "Altima": "Nissan",
  "Versa": "Nissan",
  "Corsair": "Lincoln",
  "A4": "Audi",
  "Wrangler": "Jeep",
  "S-Class": "Mercedes-Benz",
  "Malibu": "Chevrolet",
  "Range Rover Sport": "Land Rover",
  "3-Series": "BMW",
  "Gladiator": "Jeep",
  "Tiguan": "Volkswagen",
  "E-Class": "Mercedes-Benz",
  "Accord": "Honda",
  "Forte": "KIA",
  "Q5": "Audi",
  "Suburban": "Chevrolet",
  "Grand Cherokee L": "Jeep",
  "Range Rover Velar": "Land Rover",
  "Wrangler 4XE": "Jeep",
  "4Runner": "Toyota",
  "ES": "Lexus",
  "Sentra": "Nissan",
  "CR-V": "Honda",
  "4-Series": "BMW",
  "SIERRA 2500HD": "GMC",
  "Defender": "Land Rover",
  "K4": "Kia",
  "Venue": "Hyundai",
  "Carnival": "Kia",
  "Sorento": "Kia",
  "Seltos": "Kia",
  "Compass": "Jeep",
  "X1": "BMW",
  "Sportage": "Kia",
  "Range Rover": "Land Rover",
  "Yukon": "GMC",
  "Q7": "Audi",
  "Odyssey": "Honda",
  "SUPER DUTY F-250 SRW": "Ford",
  "GLC-Class": "Mercedes-Benz",
  "Model 3": "Tesla",
  "Grecale": "Maserati",
  "GranTurismo": "Maserati",
  "Cayenne": "Porsche",
  "CX-5": "Mazda",
  "Stinger": "Kia",
  "Canyon": "GMC",
  "Tahoe": "Chevrolet",
  "GR COROLLA": "Toyota",
  "TT COUPE": "Audi",
  "Express Cargo Van": "Chevrolet",
  "Civic Hatchback": "Honda",
  "RX 350": "Lexus",
  "1500 Classic": "Ram",
  "Outlander": "Mitsubishi",
  "GLE-Class": "Mercedes-Benz",
  "Atlas": "Volkswagen",
  "Model Y": "Tesla",
  "Impreza": "Subaru",
  "LaCrosse": "Buick",
  "TrailBlazer": "Chevrolet",
  "MKX": "Lincoln",
  "RX": "Lexus",
  "Ram 1500": "Dodge",
  "Journey": "Dodge",
  "SILVERADO 2500HD": "Chevrolet",
  "Camry Hybrid": "Toyota",
  "Passat": "Volkswagen",
  "ZDX": "Acura",
  "CX-70 MHEV": "Mazda",
  "TLX": "Acura",
  "GOLF SPORTWAGEN": "Volkswagen",
  "Aviator": "Lincoln",
  "SUPER DUTY F-450 DRW": "Ford",
  "Explorer": "Ford",
  "Transit 150": "Ford",
  "CR-V Hybrid": "Honda",
};

const MODEL_TO_MAKE = new Map<string, string>(Object.entries(BASELINE_MODEL_TO_MAKE));

const BASELINE_KNOWN_MODELS = [
  "1500", "1500 Classic", "200", "3-Series", "300", "4-Series", "4Runner", "911",
  "A-Class", "A4", "Acadia", "Accord", "Accord Hybrid", "Altima", "Atlas", "Aviator",
  "C-Class", "CLA-Class", "CR-V", "CR-V Hybrid", "CX-5", "CX-70 MHEV", "Camry", "Camry Hybrid",
  "Canyon", "Carnival", "Cayenne", "Challenger", "Charger", "Civic", "Civic Hatchback", "Compass",
  "Corolla", "Corolla Hybrid", "Corsair", "Corvette", "Defender", "Durango", "E-Class", "ES",
  "Edge", "Elantra", "Enclave", "Encore", "Encore GX", "Envision", "Envista", "Escape", "Explorer",
  "Express Cargo Van", "F-150", "Forte", "Fusion Energi", "G70", "GLC-Class", "GLE-Class",
  "GOLF SPORTWAGEN", "GR COROLLA", "Gladiator", "GranTurismo", "Grand Caravan", "Grand Cherokee",
  "Grand Cherokee L", "Grand Cherokee WK", "Grecale", "Highlander", "IS 300", "Impreza", "Jetta",
  "Jetta GLI", "Journey", "K4", "KONA", "LaCrosse", "MKX", "Malibu", "Model 3", "Model Y", "Mustang",
  "Odyssey", "Outlander", "Passat", "Q3", "Q5", "Q50", "Q7", "Qashqai", "RAV4", "RX", "RX 350",
  "Ram 1500", "Range Rover", "Range Rover Sport", "Range Rover Velar", "Rogue", "S-Class",
  "SIERRA 2500HD", "SILVERADO 2500HD", "SUPER DUTY F-250 SRW", "SUPER DUTY F-450 DRW", "Santa Fe",
  "Seltos", "Sentra", "Sierra 1500", "Silverado 1500", "Sonata", "Sorento", "Sportage", "Stinger",
  "Suburban", "TLX", "TT COUPE", "Tahoe", "Taos", "Terrain", "Tiguan", "TrailBlazer", "Transit 150",
  "Trax", "Tucson", "Venue", "Versa", "WRX", "Wrangler", "Wrangler 4XE", "X1", "Yukon", "Yukon XL", "ZDX"
];

const KNOWN_MODELS_REGISTRY = new Set<string>();
const KNOWN_MODELS_BY_LOWER = new Map<string, string>();
const KNOWN_MODELS_BY_SLUG = new Map<string, string>();
const KNOWN_MODELS_BY_NORM = new Map<string, string>();

function indexKnownModel(model: string) {
  if (!model) return;
  const lower = model.toLowerCase();
  const norm = lower.replace(/[^a-z0-9]/g, "");

  // If a canonical version of this model is already registered (e.g. "3-Series"),
  // map this alias (e.g. "3 Series") to that canonical model.
  if (KNOWN_MODELS_BY_NORM.has(norm)) {
    const canonical = KNOWN_MODELS_BY_NORM.get(norm)!;
    KNOWN_MODELS_REGISTRY.add(canonical);
    KNOWN_MODELS_BY_LOWER.set(lower, canonical);
    const slug = lower.replace(/\s+/g, "-");
    KNOWN_MODELS_BY_SLUG.set(slug, canonical);
    const unhyphenated = lower.replace(/-/g, " ");
    KNOWN_MODELS_BY_SLUG.set(unhyphenated, canonical);
    return;
  }

  KNOWN_MODELS_REGISTRY.add(model);
  KNOWN_MODELS_BY_NORM.set(norm, model);

  if (!KNOWN_MODELS_BY_LOWER.has(lower)) {
    KNOWN_MODELS_BY_LOWER.set(lower, model);
  }
  const slug = lower.replace(/\s+/g, "-");
  if (!KNOWN_MODELS_BY_SLUG.has(slug)) {
    KNOWN_MODELS_BY_SLUG.set(slug, model);
  }
  const unhyphenated = lower.replace(/-/g, " ");
  if (!KNOWN_MODELS_BY_SLUG.has(unhyphenated)) {
    KNOWN_MODELS_BY_SLUG.set(unhyphenated, model);
  }
}

BASELINE_KNOWN_MODELS.forEach(indexKnownModel);
Object.keys(BASELINE_MODEL_TO_MAKE).forEach(indexKnownModel);

export function registerKnownModels(models: Iterable<string>) {
  for (const model of models) {
    if (model) indexKnownModel(model);
  }
  initFacetRegistry("model", models);
}

/**
 * Returns all variants for a model name (e.g. "3-Series" -> ["3-Series", "3 Series"])
 * to match database entries that might use hyphens or spaces.
 */
export function getModelVariants(model: string): string[] {
  if (!model || typeof model !== "string") return [];
  const trimmed = model.trim();
  const set = new Set<string>();
  set.add(trimmed);

  const norm = trimmed.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (norm === "3series") {
    set.add("3-Series");
    set.add("3 Series");
  } else if (norm === "4series") {
    set.add("4-Series");
    set.add("4 Series");
  } else if (trimmed.includes("-")) {
    set.add(trimmed.replace(/-/g, " "));
  } else if (trimmed.includes(" ")) {
    set.add(trimmed.replace(/\s+/g, "-"));
  }
  return Array.from(set);
}

const PRESERVE_UPPERCASE_TOKENS = new Set([
  "BMW", "GMC", "SUV", "CVT", "EV", "HEV", "PHEV", "BEV", "AWD", "4WD", "4X4",
  "SRW", "DRW", "HD", "GR", "TT", "ZDX", "GLI", "WK", "MKX", "TLX", "WRX", "MHEV",
  "CR", "CX", "CLA", "GLC", "GLE", "ES", "IS", "RX"
]);

/**
 * Formats all-uppercase or uncapitalized facet labels to Title Case for UI display
 * while preserving standard automotive acronyms (e.g. "ONYX BLACK" -> "Onyx Black",
 * "SIERRA 2500HD" -> "Sierra 2500HD", "BMW" -> "BMW", "CVT" -> "CVT").
 */
export function formatFacetLabel(label: string): string {
  if (!label || typeof label !== "string") return "";
  const hasLetters = /[a-zA-Z]/.test(label);
  if (!hasLetters) return label;

  return label.replace(/[a-zA-Z0-9]+(?:'[a-zA-Z0-9]+)?/g, (word) => {
    const upper = word.toUpperCase();
    if (PRESERVE_UPPERCASE_TOKENS.has(upper)) return upper;
    if (/^\d+HD$/i.test(word)) return word.toUpperCase();
    if (/^[A-Z]\d+$/i.test(word)) return word.toUpperCase();
    const isAllCaps = word === word.toUpperCase() && word.length > 1;
    if (isAllCaps) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
}

/**
 * Converts a model name for use in URL query parameter.
 * Replaces spaces with hyphens (e.g. "1500 Classic" -> "1500-Classic", "3-Series" -> "3-Series")
 * avoiding %20 in the URL.
 */
export function modelToQueryValue(model: string): string {
  if (!model || typeof model !== "string") return "";
  return encodeURIComponent(model.trim().replace(/\s+/g, "-"));
}

/**
 * Resolves a model query slug (e.g. "3-Series", "3%20Series", "1500-Classic")
 * back to the canonical database model name ("3-Series", "1500 Classic").
 */
export function queryValueToModel(value: string): string {
  if (!value || typeof value !== "string") return "";
  const decoded = decodeURIComponent(value).trim();
  if (!decoded) return "";

  // 1. Check normalized key (handles "3-Series", "3 Series", "3-series" consistently)
  const norm = decoded.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (KNOWN_MODELS_BY_NORM.has(norm)) {
    return KNOWN_MODELS_BY_NORM.get(norm)!;
  }

  // 2. Direct match in registry (exact case)
  if (KNOWN_MODELS_REGISTRY.has(decoded)) {
    return decoded;
  }

  // 3. Case-insensitive exact match
  const lower = decoded.toLowerCase();
  const directMatch = KNOWN_MODELS_BY_LOWER.get(lower);
  if (directMatch) {
    return directMatch;
  }

  // 4. Slug match (e.g. "1500-classic" -> "1500 Classic", "c-class" -> "C-Class")
  const slugMatch = KNOWN_MODELS_BY_SLUG.get(lower);
  if (slugMatch) {
    return slugMatch;
  }

  // 5. Also check if decoded has hyphens and converting to spaces matches a known model
  const withSpaces = lower.replace(/-/g, " ");
  const spaceMatch = KNOWN_MODELS_BY_LOWER.get(withSpaces) || KNOWN_MODELS_BY_SLUG.get(withSpaces);
  if (spaceMatch) {
    return spaceMatch;
  }

  // 6. Fallback for new/unknown models not in registry:
  // If it matches standard hyphenated format (e.g. F-150, CX-5, C-Class, 3-Series, CR-V, RX-350, AMG-GT), keep the hyphen.
  if (
    /^[a-z]{1,4}-\d+$/i.test(decoded) ||
    /^[a-z0-9]+-class$/i.test(decoded) ||
    /^\d+-series$/i.test(decoded) ||
    /^[a-z0-9]+-[a-z0-9]+$/i.test(decoded) ||
    /^[a-z0-9]+(-[a-z0-9]+)+$/i.test(decoded)
  ) {
    return decoded;
  }

  // Otherwise convert hyphens back to spaces
  return decoded.replace(/-/g, " ");
}

export function setModelMakeMap(entries: Iterable<[string, string]>) {
  for (const [model, make] of entries) {
    MODEL_TO_MAKE.set(model, make);
    modelMakeAssociations.set(model, make);
    indexKnownModel(model);
  }
}

export function getModelMakeMap() {
  return MODEL_TO_MAKE;
}

export function getMakeForModel(model: string): string | undefined {
  if (!model || typeof model !== "string") return undefined;
  const trimmed = model.trim();
  const modelMakeMap = getModelMakeMap();
  const direct = modelMakeAssociations.get(trimmed) || modelMakeMap.get(trimmed) || BASELINE_MODEL_TO_MAKE[trimmed];
  if (direct) return direct;

  const withSpaces = trimmed.replace(/-/g, " ");
  const fromSpaces = modelMakeAssociations.get(withSpaces) || modelMakeMap.get(withSpaces) || BASELINE_MODEL_TO_MAKE[withSpaces];
  if (fromSpaces) return fromSpaces;

  const withHyphens = trimmed.replace(/\s+/g, "-");
  const fromHyphens = modelMakeAssociations.get(withHyphens) || modelMakeMap.get(withHyphens) || BASELINE_MODEL_TO_MAKE[withHyphens];
  if (fromHyphens) return fromHyphens;

  const canonical = queryValueToModel(trimmed);
  if (canonical && canonical !== trimmed) {
    const fromCanonical = modelMakeAssociations.get(canonical) || modelMakeMap.get(canonical) || BASELINE_MODEL_TO_MAKE[canonical];
    if (fromCanonical) return fromCanonical;
  }

  const lower = trimmed.toLowerCase();
  for (const [m, mk] of modelMakeMap.entries()) {
    if (m.toLowerCase() === lower) return mk;
  }
  for (const [m, mk] of modelMakeAssociations.entries()) {
    if (m.toLowerCase() === lower) return mk;
  }
  for (const [m, mk] of Object.entries(BASELINE_MODEL_TO_MAKE)) {
    if (m.toLowerCase() === lower) return mk;
  }

  return undefined;
}
 
export const FILTER_KEYS: Record<string, string> = {
  location: "locations",
  vehicle_type: "vehicleTypes",
  year: "year",
  make: "makes",
  model: "models",
  exterior_color: "colors",
  body_type: "bodyStyles",
  transmission: "transmissions",
  fuel_type: "fuelTypes",
};
 
export const modelMakeAssociations = new Map<string, string>(Object.entries(BASELINE_MODEL_TO_MAKE));

export type MakeModelSelection = { make: string; model: string };

export function parseMakeModelSelections(value: string): MakeModelSelection[] {
  let currentMake = "";
  return value.split(",").filter(Boolean).flatMap((entry) => {
    const colonIdx = entry.indexOf(":");
    const semicolonIdx = entry.indexOf(";");
    let separator = -1;
    if (colonIdx > 0 && semicolonIdx > 0) {
      separator = Math.min(colonIdx, semicolonIdx);
    } else if (colonIdx > 0) {
      separator = colonIdx;
    } else if (semicolonIdx > 0) {
      separator = semicolonIdx;
    }
    if (separator < 1 || separator === entry.length - 1) {
      const model = queryValueToModel(entry);
      const make = currentMake || modelMakeAssociations.get(model) || getModelMakeMap().get(model) || BASELINE_MODEL_TO_MAKE[model];
      if (make) {
        return [{ make, model }];
      }
      return [];
    }
    const rawMake = entry.slice(0, separator);
    const rawModel = entry.slice(separator + 1);
    const make = parseNamedQueryValue(rawMake, "make");
    currentMake = make;
    const model = queryValueToModel(rawModel);
    return [{ make, model }];
  });
}

let activeRouterResync: (() => void) | null = null;

export function resyncInventoryUrl() {
  activeRouterResync?.();
}

export const RANGE_KEYS: Record<string, readonly [string, string]> = {
  selling_price: ["priceLow", "priceHigh"],
  odometer: ["odometerLow", "odometerHigh"],
};

export const DYNAMIC_RANGE_BOUNDS: Record<string, { min?: number; max?: number }> = {
  selling_price: { min: 0, max: 100000 },
  odometer: { min: 0, max: 200000 },
};

export function registerRangeBounds(attribute: string, min?: number, max?: number) {
  if (!DYNAMIC_RANGE_BOUNDS[attribute]) {
    DYNAMIC_RANGE_BOUNDS[attribute] = {};
  }
  if (min !== undefined && Number.isFinite(min)) {
    DYNAMIC_RANGE_BOUNDS[attribute].min = min;
  }
  if (max !== undefined && Number.isFinite(max)) {
    DYNAMIC_RANGE_BOUNDS[attribute].max = max;
  }
}

 
const PUBLIC_SORT_FIELDS: Record<string, string> = {
  selling_price: "price",
};

function getPublicSort(sortBy: unknown) {
  if (typeof sortBy !== "string") return null;

  const sortExpression = sortBy.split("/sort/")[1];
  if (!sortExpression) return null;
 
  const criteria = sortExpression.split(",");
  const primaryCriterion = criteria.find((c) => !c.startsWith("status_rank:")) || criteria[0];
  const [field, direction] = primaryCriterion.split(":", 2);
  if (!field || !direction) return null;

  return {
    field: PUBLIC_SORT_FIELDS[field] || field,
    direction: direction.toUpperCase(),
  };
}

function getInternalSortField(field: string) {
  return Object.entries(PUBLIC_SORT_FIELDS).find(([, publicField]) => publicField === field)?.[0] || field;
}

let isInternalUrlWrite = false;
let historyPatched = false;
const externalUrlListeners = new Set<() => void>();

function watchExternalUrlChanges() {
  if (historyPatched || typeof window === "undefined") return;
  historyPatched = true;

  const originalPushState = window.history.pushState.bind(window.history);
  const originalReplaceState = window.history.replaceState.bind(window.history);
  const notify = () => externalUrlListeners.forEach((listener) => listener());

  window.history.pushState = function (...args: Parameters<typeof originalPushState>) {
    const result = originalPushState(...args);
    if (!isInternalUrlWrite) notify();
    return result;
  };
  window.history.replaceState = function (...args: Parameters<typeof originalReplaceState>) {
    const result = originalReplaceState(...args);
    if (!isInternalUrlWrite) notify();
    return result;
  };
  window.addEventListener("popstate", notify);
}

const FILTER_ATTRIBUTES = Object.keys(FILTER_KEYS);
const PATH_ATTRIBUTES = [
  "make",
  "model",
  "year",
  "exterior_color",
  "body_type",
  "vehicle_type",
  "fuel_type",
  "transmission",
  "location",
] as const;
type PathFilters = Partial<Record<(typeof PATH_ATTRIBUTES)[number], string[]>>;

function isInventoryListingPath(pathname: string) {
  const segments = pathname.replace(/^\/inventory\/?/, "").split("/").filter(Boolean);
  if (!segments.length) return pathname === "/inventory" || pathname === "/inventory/";

  // Vehicle detail links begin with an inventory ID (for example 3019-2022-honda-civic-lx);
  // listing paths may begin with a four-digit vehicle year or facet name.
  if (segments.length === 1) {
    const firstDash = segments[0].indexOf("-");
    if (firstDash !== -1) {
      const firstToken = segments[0].substring(0, firstDash);
      const numericValue = Number(firstToken);
      if (/^\d+$/.test(firstToken) && (numericValue < 1900 || numericValue > 2100)) {
        const lower = segments[0].toLowerCase();
        if (lower !== "1500-classic" && lower !== "1500") {
          return false;
        }
      }
    }
  }
  return true;
}

const titleCase = (value: string) => value
  .split("-")
  .filter(Boolean)
  .map((part) => {
    const acronyms: Record<string, string> = { bmw: "BMW", gmc: "GMC", ram: "RAM", suv: "SUV" };
    return acronyms[part.toLowerCase()] || `${part.charAt(0).toUpperCase()}${part.slice(1)}`;
  })
  .join(" ");

function readPathSegments(segments: string[], refinementList: PlainObject) {
  for (const segment of segments) {
    if (!segment) continue;
    const decoded = decodeURIComponent(segment).trim();
    if (!decoded) continue;
    const tokens = decoded.split(",").filter(Boolean);
    for (const token of tokens) {
      resolveUnkeyedQueryToken(token, refinementList);
    }
  }
}

const BASELINE_FACET_VALUES: Record<string, string[]> = {
  location: [
    "Cardora Brampton",
    "Cardora Guelph",
    "Cardora Brampton Lot 2",
  ],
  make: [
    "GMC", "Toyota", "Volkswagen", "Dodge", "Honda", "Jeep", "Chevrolet", "Nissan",
    "Hyundai", "Ford", "Buick", "Mercedes-Benz", "BMW", "Chrysler", "KIA", "Land Rover",
    "Audi", "Lexus", "Tesla", "Mazda", "Ram", "Porsche", "Lincoln", "Acura", "Subaru",
    "Genesis", "Maserati", "Infiniti", "Mitsubishi"
  ],
  body_type: [
    "Sedan", "Truck", "SUV-Crossover", "Pickup-Truck", "Sport Utility Vehicle", "SUV",
    "Other/Don't Know", "Coupe", "Pickup Truck", "Convertible", "Van", "Hatchback",
    "Minivan", "Minivan-Van"
  ],
  vehicle_type: [
    "Used", "As-is", "Certified Pre-Owned", "New"
  ],
  transmission: [
    "Automatic", "CVT", "Other", "Manual"
  ],
  fuel_type: [
    "Gasoline Fuel", "Gasoline", "Diesel", "Other/Don't Know", "Electric Battery",
    "HEV", "Hybrid Gas/Electric", "PHEV", "BEV", "Hybrid"
  ],
  exterior_color: [
    "Black", "White", "Grey", "Onyx Black", "Silver", "Summit White", "Red", "Blue",
    "Gray", "Moonstone Gray", "Green", "Orange", "White Frost Tricoat",
    "Ebony Twilight Metallic", "Dark Green", "White Diamond", "Brilliant Red",
    "Galaxy Silver M", "Quicksilver Met", "Thunderstorm Grey", "Sterling Metallic",
    "Summit White, Ebony", "Crimson Red Tin, Jet", "Titanium Rush Metallic",
    "Moonstone Gray Metallic"
  ],
};

interface FacetRegistry {
  exact: Set<string>;
  byLower: Map<string, string>;
  bySlug: Map<string, string>;
}

const FACET_REGISTRIES: Record<string, FacetRegistry> = {};

function initFacetRegistry(attribute: string, values: Iterable<string>) {
  if (!FACET_REGISTRIES[attribute]) {
    FACET_REGISTRIES[attribute] = {
      exact: new Set<string>(),
      byLower: new Map<string, string>(),
      bySlug: new Map<string, string>(),
    };
  }
  const reg = FACET_REGISTRIES[attribute];
  for (const rawV of values) {
    if (!rawV) continue;
    const formatted = attribute === "year" ? rawV : formatFacetLabel(rawV);
    reg.exact.add(rawV);
    reg.exact.add(formatted);
    const lower = rawV.toLowerCase();
    const formattedLower = formatted.toLowerCase();

    reg.byLower.set(lower, formatted);
    reg.byLower.set(formattedLower, formatted);

    const slug = lower.replace(/\s+/g, "-");
    reg.bySlug.set(slug, formatted);
    const formattedSlug = formattedLower.replace(/\s+/g, "-");
    reg.bySlug.set(formattedSlug, formatted);

    const unhyphenated = lower.replace(/-/g, " ");
    reg.bySlug.set(unhyphenated, formatted);
    const formattedUnhyphenated = formattedLower.replace(/-/g, " ");
    reg.bySlug.set(formattedUnhyphenated, formatted);
  }
}

// Initialize all baseline facets
for (const [attr, vals] of Object.entries(BASELINE_FACET_VALUES)) {
  initFacetRegistry(attr, vals);
}
initFacetRegistry("model", BASELINE_KNOWN_MODELS);

export function registerFacetValues(attribute: string, values: Iterable<string>) {
  initFacetRegistry(attribute, values);
}

export function queryValue(value: string) {
  if (!value || typeof value !== "string") return "";
  return encodeURIComponent(value.trim().replace(/\s+/g, "-"));
}

function parseQueryValue(value: string) {
  return value.replace(/--/g, "\u0000").replace(/-/g, " ").replace(/\u0000/g, "-");
}

export function parseNamedQueryValue(value: string, attribute?: string): string {
  if (!value || typeof value !== "string") return "";
  const decoded = decodeURIComponent(value).trim();
  if (!decoded) return "";

  if (attribute === "model") {
    return queryValueToModel(decoded);
  }

  const reg = attribute ? FACET_REGISTRIES[attribute] : undefined;
  if (reg) {
    const lower = decoded.toLowerCase();
    if (reg.byLower.has(lower)) return reg.byLower.get(lower)!;
    if (reg.bySlug.has(lower)) return reg.bySlug.get(lower)!;
    const withSpaces = lower.replace(/-/g, " ");
    if (reg.byLower.has(withSpaces)) return reg.byLower.get(withSpaces)!;
    if (reg.bySlug.has(withSpaces)) return reg.bySlug.get(withSpaces)!;
    if (reg.exact.has(decoded)) return attribute === "year" ? decoded : formatFacetLabel(decoded);
  }

  // If attribute wasn't specified, check all registries
  if (!attribute) {
    for (const registry of Object.values(FACET_REGISTRIES)) {
      const lower = decoded.toLowerCase();
      if (registry.byLower.has(lower)) return registry.byLower.get(lower)!;
      if (registry.bySlug.has(lower)) return registry.bySlug.get(lower)!;
      const withSpaces = lower.replace(/-/g, " ");
      if (registry.byLower.has(withSpaces)) return registry.byLower.get(withSpaces)!;
      if (registry.bySlug.has(withSpaces)) return registry.bySlug.get(withSpaces)!;
      if (registry.exact.has(decoded)) return formatFacetLabel(decoded);
    }
  }

  // Preserve hyphen for known hyphenated patterns like Mercedes-Benz or As-is
  if (/^[a-z]+-benz$/i.test(decoded) || /^as-is$/i.test(decoded)) {
    return decoded;
  }

  // Fallback: convert hyphens back to spaces
  const unhyphenated = decoded.replace(/-/g, " ");
  return attribute === "year" ? unhyphenated : formatFacetLabel(unhyphenated);
}

function setRefinement(refinementList: PlainObject, attribute: string, value: string) {
  if (!value) return;
  if (!refinementList[attribute]) {
    refinementList[attribute] = [value];
  } else if (!refinementList[attribute].includes(value)) {
    refinementList[attribute].push(value);
  }
}

function resolveUnkeyedQueryToken(token: string, refinementList: PlainObject): boolean {
  if (!token) return false;
  const decoded = decodeURIComponent(token).trim();
  if (!decoded) return false;

  // 1. Year: 4 digits (1900-2100)
  if (/^(19\d{2}|20\d{2})$/.test(decoded)) {
    setRefinement(refinementList, "year", decoded);
    return true;
  }

  // 1b. Year prefix composite token (e.g. 2022-toyota-camry)
  const yearPrefixMatch = decoded.match(/^(19\d{2}|20\d{2})-(.+)$/);
  if (yearPrefixMatch) {
    setRefinement(refinementList, "year", yearPrefixMatch[1]);
    return resolveUnkeyedQueryToken(yearPrefixMatch[2], refinementList);
  }

  const lower = decoded.toLowerCase();

  // 2. Check Make registry
  const makeReg = FACET_REGISTRIES["make"];
  const matchedMake =
    makeReg?.exact.has(decoded) ? decoded :
    makeReg?.byLower.get(lower) ||
    makeReg?.bySlug.get(lower) ||
    makeReg?.bySlug.get(lower.replace(/-/g, " "));

  if (matchedMake) {
    setRefinement(refinementList, "make", matchedMake);
    return true;
  }

  // 3. Check Model (known models or mapped)
  const matchedModel = queryValueToModel(decoded);
  const isKnownModel =
    KNOWN_MODELS_REGISTRY.has(matchedModel) ||
    KNOWN_MODELS_BY_LOWER.has(matchedModel.toLowerCase()) ||
    MODEL_TO_MAKE.has(matchedModel) ||
    modelMakeAssociations.has(matchedModel) ||
    Boolean(BASELINE_MODEL_TO_MAKE[matchedModel]);

  if (isKnownModel) {
    setRefinement(refinementList, "model", matchedModel);
    // User requirement: "for model, the corresponding make should be automatically selected /inventory?{make name} & {model name}"
    const make = modelMakeAssociations.get(matchedModel) || getModelMakeMap().get(matchedModel) || BASELINE_MODEL_TO_MAKE[matchedModel];
    if (make) {
      setRefinement(refinementList, "make", make);
    }
    return true;
  }

  // 4. Check other facet registries in priority order
  const attributesToCheck: Array<keyof typeof FILTER_KEYS> = [
    "location",
    "vehicle_type",
    "body_type",
    "transmission",
    "fuel_type",
    "exterior_color",
  ];

  for (const attr of attributesToCheck) {
    const reg = FACET_REGISTRIES[attr];
    if (!reg) continue;
    const matched =
      reg.exact.has(decoded) ? decoded :
      reg.byLower.get(lower) ||
      reg.bySlug.get(lower) ||
      reg.bySlug.get(lower.replace(/-/g, " "));

    if (matched) {
      setRefinement(refinementList, attr, matched);
      return true;
    }
  }

  // 5. Cardora location prefix check (e.g. cardora-brampton)
  if (lower.startsWith("cardora-")) {
    const formatted = parseNamedQueryValue(decoded, "location");
    setRefinement(refinementList, "location", formatted);
    return true;
  }

  // 6. Check for composite make-model tokens (e.g. "mercedes-benz-c-class" or "toyota-camry")
  const allKnownMakes = Array.from(FACET_REGISTRIES["make"]?.exact || []);
  const sortedMakes = allKnownMakes.sort((a, b) => b.length - a.length);

  for (const candidateMake of sortedMakes) {
    const makeSlug = candidateMake.toLowerCase().replace(/\s+/g, "-");
    if (lower === makeSlug || lower.startsWith(`${makeSlug}-`)) {
      setRefinement(refinementList, "make", candidateMake);
      const remainder = decoded.slice(candidateMake.length).replace(/^-+/, "");
      if (remainder) {
        const yearMatch = remainder.match(/-(19\d{2}|20\d{2})$/);
        let modelPart = remainder;
        if (yearMatch) {
          setRefinement(refinementList, "year", yearMatch[1]);
          modelPart = remainder.slice(0, -yearMatch[0].length);
        }
        if (modelPart) {
          const resolvedModel = queryValueToModel(modelPart);
          setRefinement(refinementList, "model", resolvedModel);
          modelMakeAssociations.set(resolvedModel, candidateMake);
        }
      }
      return true;
    }
  }

  // 7. If model-like code pattern (e.g. F-150, CX-5, C-Class, 3-Series, CR-V, RX-350, AMG-GT)
  if (
    /^[a-z0-9]+-[a-z0-9]+(-[a-z0-9]+)?$/i.test(decoded) ||
    /^[a-z0-9]+-class$/i.test(decoded) ||
    /^\d+-series$/i.test(decoded)
  ) {
    const resolvedModel = queryValueToModel(decoded);
    setRefinement(refinementList, "model", resolvedModel);
    const make = modelMakeAssociations.get(resolvedModel) || getModelMakeMap().get(resolvedModel) || BASELINE_MODEL_TO_MAKE[resolvedModel];
    if (make) {
      setRefinement(refinementList, "make", make);
    }
    return true;
  }

  // 8. If make is already present and model is not, treat token as model
  if (refinementList.make?.length && !refinementList.model?.length) {
    const resolvedModel = queryValueToModel(decoded);
    setRefinement(refinementList, "model", resolvedModel);
    return true;
  }

  // 9. Fallback: treat as exterior_color
  const colorVal = parseNamedQueryValue(decoded, "exterior_color");
  setRefinement(refinementList, "exterior_color", colorVal || decoded);
  return true;
}

function getRangeBounds(value: unknown): [unknown, unknown] {
  if (Array.isArray(value)) return [value[0], value[1]];
  if (typeof value === "string") {
    const [low = "", high = ""] = value.split(":", 2);
    return [low, high];
  }
  return [undefined, undefined];
}

function getPathFilters(route: PlainObject): PathFilters {
  const filters: PathFilters = {};
  PATH_ATTRIBUTES.forEach((attribute) => {
    const values = route.refinementList?.[attribute] || [];
    if (values.length === 1) filters[attribute] = values;
  });
  if (filters.model && !filters.make) delete filters.model;
  return filters;
}

export function serializePublicUrl(route: PlainObject) {
  const sourceRefinementList = route.refinementList || {};
  const refinementList: PlainObject = {};

  Object.entries(sourceRefinementList).forEach(([attribute, values]) => {
    if (!Array.isArray(values)) return;
    refinementList[attribute] = [...new Set(values.map(String))];
  });

  // A compact token can be misread as a model when it is a body, fuel, or
  // vehicle value containing hyphens. Do not serialize that duplicate model.
  const nonModelFacetValues = new Set([
    ...(refinementList.body_type || []),
    ...(refinementList.vehicle_type || []),
    ...(refinementList.fuel_type || []),
    ...(refinementList.transmission || []),
  ].map((value: string) => value.toLowerCase()));
  if (Array.isArray(refinementList.model)) {
    refinementList.model = refinementList.model.filter(
      (model: string) => !nonModelFacetValues.has(model.toLowerCase())
    );
  }

  const allSelectedMakes: string[] = refinementList.make || [];
  const allSelectedModels: string[] = refinementList.model || [];

  const modelMakeMap = getModelMakeMap();
  const validModels = allSelectedModels.filter((model) => {
    const make = getMakeForModel(model);
    return make
      ? allSelectedMakes.some((m) => m.toLowerCase() === make.toLowerCase())
      : allSelectedMakes.length > 0;
  });

  const makesWithModels = new Set<string>();
  validModels.forEach((model) => {
    const make = getMakeForModel(model);
    if (make) makesWithModels.add(make);
  });

  // Standalone makes are makes with NO models selected
  const standaloneMakes = allSelectedMakes.filter((make) => !makesWithModels.has(make));
  const totalMakesCount = makesWithModels.size + standaloneMakes.length;

  const pathSegments: string[] = [];
  const queryParams: string[] = [];

  // 1. Makes & Models
  if (totalMakesCount === 1 && validModels.length === 1) {
    // Single make + Single model -> both in path
    const make = getMakeForModel(validModels[0]) || allSelectedMakes[0];
    if (make) {
      pathSegments.push(queryValue(make));
      pathSegments.push(modelToQueryValue(validModels[0]));
    } else {
      pathSegments.push(modelToQueryValue(validModels[0]));
    }
  } else if (totalMakesCount === 1 && validModels.length === 0 && standaloneMakes.length === 1) {
    // Single make, no models -> make in path
    pathSegments.push(queryValue(standaloneMakes[0]));
  } else if (totalMakesCount === 0 && validModels.length === 1) {
    // No make selected, but 1 valid model -> model in path
    const make = getMakeForModel(validModels[0]);
    if (make) {
      pathSegments.push(queryValue(make));
    }
    pathSegments.push(modelToQueryValue(validModels[0]));
  } else if (totalMakesCount === 1 && standaloneMakes.length === 0 && makesWithModels.size === 1 && validModels.length > 1) {
    // Exactly 1 make with multiple models of only that make -> make in path, models in query
    const onlyMake = Array.from(makesWithModels)[0];
    pathSegments.push(queryValue(onlyMake));

    const modelTokens = validModels.map(modelToQueryValue).join(",");
    queryParams.push(`${FILTER_KEYS.model}=${queryValue(onlyMake)}:${modelTokens}`);
  } else {
    // Multiple makes or models across multiple makes -> ALL go to query params
    if (standaloneMakes.length > 0) {
      queryParams.push(`${FILTER_KEYS.make}=${standaloneMakes.map(queryValue).join(",")}`);
    }

    if (validModels.length > 0) {
      const modelsByMake = new Map<string, string[]>();
      const modelsWithoutMake: string[] = [];

      validModels.forEach((model) => {
        const make = modelMakeAssociations.get(model) || modelMakeMap.get(model) || BASELINE_MODEL_TO_MAKE[model];
        if (make) {
          if (!modelsByMake.has(make)) modelsByMake.set(make, []);
          modelsByMake.get(make)!.push(model);
        } else {
          modelsWithoutMake.push(model);
        }
      });

      const modelTokens: string[] = [];
      modelsByMake.forEach((models, make) => {
        const formattedModels = models.map(modelToQueryValue).join(",");
        modelTokens.push(`${queryValue(make)}:${formattedModels}`);
      });
      modelsWithoutMake.forEach((model) => {
        modelTokens.push(modelToQueryValue(model));
      });

      queryParams.push(`${FILTER_KEYS.model}=${modelTokens.join(",")}`);
    }
  }

  // 2. Other facet attributes:
  // year, exterior_color, body_type, vehicle_type, fuel_type, transmission, location
  const otherFacetAttributes = [
    "year",
    "exterior_color",
    "body_type",
    "vehicle_type",
    "fuel_type",
    "transmission",
    "location",
  ] as const;

  otherFacetAttributes.forEach((attr) => {
    const values: string[] = refinementList[attr] || [];
    if (!values.length) return;
    const formattedValues = values.map((v) => (attr === "year" ? v : formatFacetLabel(v)));
    if (formattedValues.length === 1) {
      // Single value -> add to PATH before '?'
      pathSegments.push(queryValue(formattedValues[0]));
    } else {
      // Multi value -> add to QUERY PARAMS after '?'
      const serializedValues = formattedValues.map(queryValue);
      queryParams.push(`${FILTER_KEYS[attr]}=${serializedValues.join(",")}`);
    }
  });

  // 3. Ranges (price, odometer) -> query params
  const [rawPriceLow, rawPriceHigh] = getRangeBounds(route.range?.selling_price);
  if (rawPriceLow !== undefined && rawPriceLow !== "") {
    queryParams.push(`priceLow=${encodeURIComponent(String(rawPriceLow))}`);
  }
  if (rawPriceHigh !== undefined && rawPriceHigh !== "") {
    queryParams.push(`priceHigh=${encodeURIComponent(String(rawPriceHigh))}`);
  }

  const [rawOdoLow, rawOdoHigh] = getRangeBounds(route.range?.odometer);
  if (rawOdoLow !== undefined && rawOdoLow !== "") {
    queryParams.push(`odometerLow=${encodeURIComponent(String(rawOdoLow))}`);
  }
  if (rawOdoHigh !== undefined && rawOdoHigh !== "") {
    queryParams.push(`odometerHigh=${encodeURIComponent(String(rawOdoHigh))}`);
  }

  // 4. Search query q -> query params
  if (route.query) {
    queryParams.push(`q=${encodeURIComponent(route.query)}`);
  }

  // 5. Sorting -> query params
  const sort = getPublicSort(route.sortBy);
  if (sort) {
    queryParams.push(`sortBy=status_rank:asc,${sort.field}:${sort.direction.toLowerCase()}`);
  }

  const basePath = pathSegments.length ? `/inventory/${pathSegments.join("/")}` : "/inventory";
  const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";

  return `${basePath}${queryString}`;
}

export function readRouteState(): PlainObject {
  if (typeof window === "undefined") return {};

  const refinementList: PlainObject = {};
  const range: PlainObject = {};
  let query: string | undefined;
  let sortField: string | undefined;
  let sortDirection: string | undefined;
  let sortBy: string | undefined;

  const processToken = (rawKey: string, rawVal?: string) => {
    const key = rawKey.trim();
    if (!key) return;

    if (rawVal !== undefined) {
      // Keyed parameter: key=value
      const value = rawVal.trim();

      // Check models
      if (key === FILTER_KEYS.model || key === "models" || key === "model") {
        const selections = parseMakeModelSelections(value);
        if (selections.length > 0) {
          const models = selections.map((s) => s.model);
          const makes = selections.map((s) => s.make).filter(Boolean);
          refinementList.model = [...new Set([...(refinementList.model || []), ...models])];
          refinementList.make = [...new Set([...(refinementList.make || []), ...makes])];
          selections.forEach(({ make, model }) => {
            if (make && model) {
              modelMakeAssociations.set(model, make);
              setModelMakeMap([[model, make]]);
            }
          });
        } else {
          // Fallback splitting by comma
          const models: string[] = [];
          const impliedMakes: string[] = [];
          value.split(",").filter(Boolean).forEach((entry) => {
            const colonIdx = entry.indexOf(":");
            if (colonIdx > 0) {
              const mk = parseNamedQueryValue(entry.slice(0, colonIdx), "make");
              const md = queryValueToModel(entry.slice(colonIdx + 1));
              models.push(md);
              if (mk) {
                impliedMakes.push(mk);
                modelMakeAssociations.set(md, mk);
                setModelMakeMap([[md, mk]]);
              }
            } else {
              const md = queryValueToModel(entry);
              models.push(md);
              const mk = modelMakeAssociations.get(md) || getModelMakeMap().get(md) || BASELINE_MODEL_TO_MAKE[md];
              if (mk) {
                impliedMakes.push(mk);
              }
            }
          });
          refinementList.model = [...new Set([...(refinementList.model || []), ...models])];
          if (impliedMakes.length) {
            refinementList.make = [...new Set([...(refinementList.make || []), ...impliedMakes])];
          }
        }
        return;
      }

      // Check other filter keys
      const matchedAttr = Object.keys(FILTER_KEYS).find(
        (attr) => FILTER_KEYS[attr] === key || attr === key
      );
      if (matchedAttr) {
        const values = value
          .split(",")
          .filter(Boolean)
          .map((v) => parseNamedQueryValue(v, matchedAttr));
        refinementList[matchedAttr] = [
          ...new Set([...(refinementList[matchedAttr] || []), ...values]),
        ];
        return;
      }

      // Check ranges
      if (key === "priceLow") {
        const currentHigh = getRangeBounds(range.selling_price)[1] || "";
        range.selling_price = `${decodeURIComponent(value)}:${currentHigh}`;
        return;
      }
      if (key === "priceHigh") {
        const currentLow = getRangeBounds(range.selling_price)[0] || "";
        range.selling_price = `${currentLow}:${decodeURIComponent(value)}`;
        return;
      }
      if (key === "odometerLow") {
        const currentHigh = getRangeBounds(range.odometer)[1] || "";
        range.odometer = `${decodeURIComponent(value)}:${currentHigh}`;
        return;
      }
      if (key === "odometerHigh") {
        const currentLow = getRangeBounds(range.odometer)[0] || "";
        range.odometer = `${currentLow}:${decodeURIComponent(value)}`;
        return;
      }
      if (key === "price") {
        range.selling_price = value.includes(":") ? value : `${value}:`;
        return;
      }
      if (key === "odometer") {
        range.odometer = value.includes(":") ? value : `:${value}`;
        return;
      }

      // Check query
      if (key === "q") {
        query = decodeURIComponent(value);
        return;
      }

      // Check sorting
      if (key === "sortBy") {
        const criteria = value.split(",").filter(Boolean);
        const primaryCriterion = criteria.find((c) => !c.startsWith("status_rank:")) || criteria[0];
        const [field, direction] = primaryCriterion?.split(":", 2) ?? [];
        if (field && direction && (direction.toUpperCase() === "ASC" || direction.toUpperCase() === "DESC")) {
          sortField = field;
          sortDirection = direction.toUpperCase();
        }
        return;
      }
      if (key === "sortField") {
        sortField = value;
        return;
      }
      if (key === "sortDirection" && (value.toUpperCase() === "ASC" || value.toUpperCase() === "DESC")) {
        sortDirection = value.toUpperCase();
        return;
      }
      if (key === "sort") {
        sortBy = value;
        return;
      }
    }

    // Unkeyed token: key is the whole string (no '=')
    const decoded = decodeURIComponent(key).trim();
    if (!decoded) return;

    // Check if it's Make:Model composite (e.g. Ram:1500 or Audi:A4)
    const colonIdx = decoded.indexOf(":");
    const semicolonIdx = decoded.indexOf(";");
    let separator = -1;
    if (colonIdx > 0 && semicolonIdx > 0) {
      separator = Math.min(colonIdx, semicolonIdx);
    } else if (colonIdx > 0) {
      separator = colonIdx;
    } else if (semicolonIdx > 0) {
      separator = semicolonIdx;
    }

    if (separator > 0 && separator < decoded.length - 1) {
      const rawMake = decoded.slice(0, separator);
      const rawModel = decoded.slice(separator + 1);
      const make = parseNamedQueryValue(rawMake, "make");
      const model = queryValueToModel(rawModel);
      if (make) {
        setRefinement(refinementList, "make", make);
        setRefinement(refinementList, "model", model);
        modelMakeAssociations.set(model, make);
        setModelMakeMap([[model, make]]);
        return;
      }
    }

    // Otherwise, resolve as generic unkeyed token
    resolveUnkeyedQueryToken(decoded, refinementList);
  };

  // 1. Process Pathname tokens (e.g. /inventory/Ram:1500&colors=Blue,BRILLIANT-RED or /inventory/Ram/1500/Blue)
  if (isInventoryListingPath(window.location.pathname)) {
    const pathContent = window.location.pathname.replace(/^\/inventory\/?/, "").trim();
    if (pathContent) {
      const segments = pathContent.split("/").filter(Boolean);
      for (const segment of segments) {
        const tokens = segment.split("&").filter(Boolean);
        for (const token of tokens) {
          const eqIdx = token.indexOf("=");
          if (eqIdx !== -1) {
            processToken(token.slice(0, eqIdx), token.slice(eqIdx + 1));
          } else {
            processToken(token);
          }
        }
      }
    }
  }

  // 2. Process Search parameters (e.g. ?priceLow=10000 or legacy ?makes=audi,bmw)
  if (window.location.search) {
    const rawSearch = window.location.search.startsWith("?")
      ? window.location.search.slice(1)
      : window.location.search;
    const searchTokens = rawSearch.split("&").filter(Boolean);
    for (const token of searchTokens) {
      const eqIdx = token.indexOf("=");
      if (eqIdx !== -1) {
        processToken(token.slice(0, eqIdx), token.slice(eqIdx + 1));
      } else {
        processToken(token);
      }
    }
  }

  // Ensure for any model present, its corresponding make is automatically selected
  if (Array.isArray(refinementList.model) && refinementList.model.length > 0) {
    const modelMakeMap = getModelMakeMap();
    const impliedMakes: string[] = [];
    refinementList.model.forEach((model: string) => {
      const make = modelMakeAssociations.get(model) || modelMakeMap.get(model) || BASELINE_MODEL_TO_MAKE[model];
      if (make) impliedMakes.push(make);
    });
    if (impliedMakes.length > 0) {
      const existingMakes: string[] = refinementList.make || [];
      refinementList.make = [...new Set([...existingMakes, ...impliedMakes])];
    }
  }

  Object.keys(refinementList).forEach((attribute) => {
    if (Array.isArray(refinementList[attribute])) {
      refinementList[attribute] = [...new Set(refinementList[attribute])];
    }
  });

  const nonModelFacetValues = new Set([
    ...(refinementList.body_type || []),
    ...(refinementList.vehicle_type || []),
    ...(refinementList.fuel_type || []),
    ...(refinementList.transmission || []),
  ].map((value: string) => value.toLowerCase()));
  if (Array.isArray(refinementList.model)) {
    refinementList.model = refinementList.model.filter(
      (model: string) => !nonModelFacetValues.has(model.toLowerCase())
    );
    const selectedMakes = new Set<string>(refinementList.make || []);
    if (selectedMakes.size > 0) {
      const modelMakeMap = getModelMakeMap();
      refinementList.model = refinementList.model.filter((model: string) => {
        const make = modelMakeAssociations.get(model) || modelMakeMap.get(model) || BASELINE_MODEL_TO_MAKE[model];
        return make ? selectedMakes.has(make) : true;
      });
    }
    if (refinementList.model.length === 0) delete refinementList.model;
  }

  const route: PlainObject = { refinementList, range };
  if (query) route.query = query;
  if (sortField) route.sortField = sortField;
  if (sortDirection) route.sortDirection = sortDirection;
  if (sortBy) route.sortBy = sortBy;

  const pathFilters = window.history.state?.__inventoryPathFilters as PathFilters | undefined;
  if (pathFilters && window.location.pathname.startsWith("/inventory")) {
    PATH_ATTRIBUTES.forEach((attribute) => {
      if (pathFilters[attribute]?.length) refinementList[attribute] = pathFilters[attribute];
    });
  }

  return route;
}

export const createInventoryStateMapping = (config: AppConfig) => {
  const indexName = config.site.collection || "";
  const defaultSort = `${indexName}/sort/status_rank:asc,created_at:desc`;

  const sanitizeRefinementList = (rawRefinementList: PlainObject) => {
    const refinementList = { ...rawRefinementList };
    Object.keys(refinementList).forEach((attr) => {
      if (Array.isArray(refinementList[attr])) {
        const seenNorms = new Set<string>();
        const deduped: string[] = [];
        refinementList[attr].forEach((item: string) => {
          const formatted = attr === "year" ? String(item) : formatFacetLabel(String(item));
          const norm = formatted.toLowerCase().replace(/[^a-z0-9]/g, "");
          if (!seenNorms.has(norm)) {
            seenNorms.add(norm);
            deduped.push(formatted);
          }
        });
        refinementList[attr] = deduped;
      }
    });

    const selectedMakes = new Set<string>(
      (refinementList.make || []).map((m: string) => m.toLowerCase())
    );
    if (Array.isArray(refinementList.model) && refinementList.model.length > 0) {
      refinementList.model = refinementList.model.filter((model: string) => {
        const make = getMakeForModel(model);
        return make ? selectedMakes.has(make.toLowerCase()) : selectedMakes.size > 0;
      });
      if (refinementList.model.length === 0) {
        delete refinementList.model;
      }
    }
    return refinementList;
  };

  return {
    stateToRoute(uiState: UiState) {
      const state = uiState[indexName] || {};
      return {
        query: state.query || undefined,
        refinementList: sanitizeRefinementList(state.refinementList || {}),
        range: state.range || {},
        sortBy: state.sortBy && state.sortBy !== defaultSort ? state.sortBy : undefined,
      };
    },

    routeToState(routeState: PlainObject | undefined | null) {
      const route = routeState || {};
      const sortBy = route.sortField && (route.sortDirection === "ASC" || route.sortDirection === "DESC")
        ? `${indexName}/sort/status_rank:asc,${getInternalSortField(route.sortField)}:${route.sortDirection.toLowerCase()}`
        : route.sortBy || defaultSort;
      return {
        [indexName]: {
          query: route.query || "",
          refinementList: sanitizeRefinementList(route.refinementList || {}),
          range: route.range || {},
          sortBy,
        },
      };
    },
  };
};

export function createInventoryRouter(_config: AppConfig) {
  watchExternalUrlChanges();
  let callback: ((route: PlainObject) => void) | null = null;
  const initialRoute = readRouteState();
  let previousRoute = initialRoute;
  let pathFilters: PathFilters =
    typeof window !== "undefined"
      ? window.history.state?.__inventoryPathFilters || getPathFilters(initialRoute)
      : {};

  // Tracks the last URL we actually wrote via history.replaceState, so we can
  // skip no-op writes below. See performWrite for why this matters.
  let lastWrittenUrl: string | null = null;

  if (typeof window !== "undefined" && Object.keys(pathFilters).length && window.location.pathname === "/inventory") {
    const bootstrapUrl = serializePublicUrl(initialRoute);
    isInternalUrlWrite = true;
    window.history.replaceState({ ...initialRoute, __inventoryPathFilters: pathFilters }, "", bootstrapUrl);
    isInternalUrlWrite = false;
    lastWrittenUrl = bootstrapUrl;
  }

  const performWrite = (route: PlainObject, filters: PathFilters) => {
    if (typeof window === "undefined") return;
    if (!isInventoryListingPath(window.location.pathname)) return;

    const url = serializePublicUrl(route);

    if (url === lastWrittenUrl) return;
    lastWrittenUrl = url;

    const state = { ...route, __inventoryPathFilters: filters };

    // Safari often jumps scroll UP on history.replaceState. Only correct
    // upward jumps so bottom infinite-scroll growth is not fought.
    const scrollY = window.scrollY;
    isInternalUrlWrite = true;
    window.history.replaceState(state, "", url);
    isInternalUrlWrite = false;
    if (window.scrollY < scrollY - 1) {
      window.scrollTo(0, scrollY);
    }
  };

  const resync = () => performWrite(previousRoute, pathFilters);
  activeRouterResync = resync;

  const notify = () => {
    if (!isInventoryListingPath(window.location.pathname)) return;
    const route = readRouteState();
    previousRoute = route;
    if (window.location.pathname.startsWith("/inventory")) {
      pathFilters = getPathFilters(route);
    }
    callback?.(route);
  };
  externalUrlListeners.add(notify);

  return {
    read: readRouteState,

    write(nextRoute: PlainObject) {
      pathFilters = getPathFilters(nextRoute);
      previousRoute = nextRoute;
      performWrite(nextRoute, pathFilters);
    },

    resync,

    createURL(routeState: PlainObject) {
      // InstantSearch only uses this for links; write() is the canonical serializer.
      const url = serializePublicUrl(routeState);
      return typeof window !== "undefined" ? `${window.location.origin}${url}` : url;
    },

    onUpdate(nextCallback: (route: PlainObject) => void) {
      callback = nextCallback;
    },

    dispose() {
      externalUrlListeners.delete(notify);
      if (activeRouterResync === resync) activeRouterResync = null;
      callback = null;
    },
  };
}