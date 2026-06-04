/* =========================
   Inventory URL Generator
   Dynamically generates inventory filter URLs
   using the Typesense collection ID from env vars.
   
   This centralizes all inventory link logic,
   making it easy to maintain and update.
   
   When clicking footer links:
   - The search query (make/type) is added to the URL as a parameter
   - react-instantsearch reads the URL and auto-populates the search box
   - Cards are filtered based on the search term
========================= */

const COLLECTION_ID = process.env.NEXT_PUBLIC_TYPESENSE_COLLECTION || "";

/**
 * Generates a make-filtered inventory URL
 * Sets the search query parameter so the search box is pre-populated
 * 
 * Example: Used Toyota
 * URL: /inventory?q=Honda
 * 
 * @param make - Vehicle make (e.g., "Toyota", "BMW", "Honda")
 * @returns Full inventory URL with search query parameter
 */
export const getInventoryUrlByMake = (make: string): string => {
  // Use standard q parameter that the inventory page expects
  return `/inventory?q=${encodeURIComponent(make)}`;
};

/**
 * Generates a body type filtered inventory URL
 * Sets the search query parameter so the search box is pre-populated
 * 
 * Example: Used SUVs
 * URL: /inventory?q=SUV
 * 
 * @param bodyType - Single body type value
 * @returns Full inventory URL with search query parameter
 */
export const getInventoryUrlByBodyType = (bodyType: string): string => {
  // Use standard q parameter that the inventory page expects
  return `/inventory?q=${encodeURIComponent(bodyType)}`;
};

/**
 * Generates a generic filtered inventory URL with custom parameters
 * 
 * @param params - Query parameters as key-value pairs
 * @returns Full inventory URL with custom filters
 */
export const getInventoryUrlWithParams = (params: Record<string, string>): string => {
  if (!COLLECTION_ID) {
    console.warn("NEXT_PUBLIC_TYPESENSE_COLLECTION not set in environment");
    return "/inventory";
  }
  
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  
  return `/inventory?${queryString}`;
};

/* ── Inventory Link Definitions ────────────────────────────────── */

export const POPULAR_MAKES = [
  { label: "Used Toyota", make: "Toyota" },
  { label: "Used Hyundai", make: "Hyundai" },
  { label: "Used BMW", make: "BMW" },
  { label: "Used Honda", make: "Honda" },
  { label: "Used Mercedes", make: "Mercedes" },
  { label: "Used Ford", make: "Ford" },
  { label: "Used Dodge", make: "Dodge" },
  { label: "Used Volkswagen", make: "Volkswagen" },
] as const;

export const POPULAR_CAR_TYPES = [
  { label: "Used SUVs", bodyType: "SUV" },
  { label: "Used Vans", bodyType: "Van" },
  { label: "Used Hatchbacks", bodyType: "Hatchback" },
  { label: "Used Sedans", bodyType: "Sedan" },
  { label: "Used Coupes", bodyType: "Coupe" },
  { label: "Used Convertibles", bodyType: "Convertible" },
  { label: "Used Pick-up", bodyType: "Pickup Truck" },
] as const;

/**
 * Get inventory URL for a make
 */
export const getMakeUrl = (make: string): string => {
  return getInventoryUrlByMake(make);
};

/**
 * Get inventory URL for body type
 */
export const getBodyTypeUrl = (bodyType: string): string => {
  return getInventoryUrlByBodyType(bodyType);
};
