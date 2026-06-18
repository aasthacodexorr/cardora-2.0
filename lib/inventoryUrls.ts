/* =========================
   Inventory URL Generator
   Dynamically generates inventory filter URLs with collection_id and default sort
   as query parameters (not path-based).
   
   URL Format:
   /inventory/?{collection_id_encoded}%2Fsort%2F{sort_encoded}[query]={value}
   
   Example:
   /inventory/?07cb7c095c0cf712732a976016079e19%2Fsort%2Fstatus_rank%3Aasc%2Ccreated_at%3Adesc[query]=van
   
   When clicking footer links or using hero search:
   - The query parameter includes collection_id and default sort encoded
   - Additional query params (q, body_type, fuel_type, etc.) are appended
   - React-instantsearch reads the URL and auto-populates the search box
========================= */

import { appConfig } from "@/lib/appConfig";

const COLLECTION_ID = appConfig.site.collection || "";

// Default sort parameters: recently added (status_rank ascending, created_at descending)
const DEFAULT_SORT = "status_rank:asc,created_at:desc";

/**
 * Encodes collection_id and default sort for URL parameter
 * Converts: 07cb7c...e19/sort/status_rank:asc,created_at:desc
 * To URL safe: 07cb7c...e19%2Fsort%2Fstatus_rank%3Aasc%2Ccreated_at%3Adesc
 * 
 * @returns Encoded collection_id/sort string
 */
const getEncodedCollectionAndSort = (): string => {
  if (!COLLECTION_ID) {
    console.warn("NEXT_PUBLIC_TYPESENSE_COLLECTION not set in environment");
    return "";
  }
  
  const collectionSort = `${COLLECTION_ID}/sort/${DEFAULT_SORT}`;
  return encodeURIComponent(collectionSort);
};

/**
 * Generates a make-filtered inventory URL with collection_id and default sort in query params
 * Sets the search query parameter so the search box is pre-populated
 * 
 * Example: Used Toyota
 * URL: /inventory/?07cb7c...%2Fsort%2F...%5Bquery%5D=Toyota
 * 
 * @param make - Vehicle make (e.g., "Toyota", "BMW", "Honda")
 * @returns Full inventory URL with collection_id, sort, and search query
 */
export const getInventoryUrlByMake = (make: string): string => {
  const encoded = getEncodedCollectionAndSort();
  if (!encoded) return "/inventory";
  
  return `/inventory/?${encoded}%5Bquery%5D=${encodeURIComponent(make)}`;
};

/**
 * Generates a body type filtered inventory URL with collection_id and default sort in query params
 * Sets the search query parameter so the search box is pre-populated
 * 
 * Example: Used SUVs
 * URL: /inventory/?07cb7c...%2Fsort%2F...%5Bquery%5D=SUV
 * 
 * @param bodyType - Single body type value
 * @returns Full inventory URL with collection_id, sort, and search query
 */
export const getInventoryUrlByBodyType = (bodyType: string): string => {
  const encoded = getEncodedCollectionAndSort();
  if (!encoded) return "/inventory";
  
  return `/inventory/?${encoded}%5Bquery%5D=${encodeURIComponent(bodyType)}`;
};

/**
 * Generates a generic filtered inventory URL with custom parameters
 * Includes collection_id and default sort in query params
 * 
 * @param params - Query parameters as key-value pairs
 * @returns Full inventory URL with collection_id, sort, and custom filters
 */
export const getInventoryUrlWithParams = (params: Record<string, string>): string => {
  const encoded = getEncodedCollectionAndSort();
  if (!encoded) return "/inventory";
  
  const queryString = Object.entries(params)
    .map(([key, value]) => `%5B${key}%5D=${encodeURIComponent(value)}`)
    .join("&");
  
  return queryString ? `/inventory/?${encoded}&${queryString}` : `/inventory/?${encoded}`;
};

/*  Inventory Link Definitions */

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

/* =========================
   Vehicle Service
   Handles all server-side data fetching
   for vehicle data from the Typesense API.
   Used by the Vehicle Detail Page (VDP).
========================= */

/**
 * Fetches a single vehicle document from Typesense by its document ID.
 * Returns null if the vehicle is not found or the request fails.
 *
 * @param id - The Typesense document ID
 */
export async function getVehicleById(id: string): Promise<Record<string, any> | null> {
  const apiKey     = appConfig.site.inventory_search_only_key;
  const collection = appConfig.site.collection;
  const host       = appConfig.site.typesense_host;

  if (!apiKey || !collection || !host) {
    throw new Error(
      "Missing Typesense configuration in appConfig.site"
    );
  }

  const url = `https://${host}/collections/${collection}/documents/search?q=*&filter_by=id:=${id}`;

  const res = await fetch(url, {
    headers: { "X-TYPESENSE-API-KEY": apiKey },
    cache: "no-store", // Always fetch fresh data for VDP
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.hits?.[0]?.document ?? null;
}
