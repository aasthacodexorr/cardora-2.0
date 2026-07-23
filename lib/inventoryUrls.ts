import { AppConfig } from "@/lib/appConfig";
import { FILTER_KEYS, RANGE_KEYS, queryValue as friendlyValue } from "@/lib/inventoryRouting";

// Links built here start as plain query params (e.g. "/inventory?makes=Toyota").
// That's intentional, not a shortcut: createInventoryRouter's bootstrap step
// reads those params on first mount (while their case is still fully
// reversible) and upgrades the address bar to the pretty, path-based URL
// (e.g. "/inventory/toyota") itself. Building a fake "/inventory/toyota"
// link directly here wouldn't work — the router can only recover a path
// segment's exact-case facet value from history.state or from query params,
// never by re-parsing lowercase path text.
const inventoryUrl = (key: string, values: readonly string[]) => `/inventory?${key}=${values.map(friendlyValue).join(",")}`;

export const getInventoryUrlByMake = (make: string, _appConfig: AppConfig) => inventoryUrl(FILTER_KEYS.make, [make]);
export const getInventoryUrlByBodyType = (bodyType: string, _appConfig: AppConfig) => inventoryUrl(FILTER_KEYS.body_type, [bodyType]);
export const getInventoryUrlByVehicleType = (vehicleType: string, _appConfig: AppConfig) => inventoryUrl(FILTER_KEYS.vehicle_type, [vehicleType]);
export const getInventoryUrlWithParams = (params: Record<string, string>, _appConfig: AppConfig) => {
  const query = Object.entries(params).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");
  return query ? `/inventory?${query}` : "/inventory";
};

export const POPULAR_MAKES = [
  { label: "Used Toyota", make: "Toyota" }, { label: "Used Hyundai", make: "Hyundai" },
  { label: "Used BMW", make: "BMW" }, { label: "Used Honda", make: "Honda" },
  // { label: "Used Mercedes", make: "Mercedes" }, 
  { label: "Used Ford", make: "Ford" },
  { label: "Used Dodge", make: "Dodge" }, { label: "Used Volkswagen", make: "Volkswagen" },
] as const;
export const POPULAR_CAR_TYPES = [
  { label: "Used SUVs", bodyType: ["SUV", "Sport Utility Vehicle", "SUV-Crossover", "Suvs", "Sport Utility 4-Door"] },
  { label: "Used Vans", bodyType: ["Van", "Minivan-Van", "minivan", "Minivan"] },
  { label: "Used Hatchbacks", bodyType: ["Hatchback", "Hatchback 2 Dr."] },
  { label: "Used Sedans", bodyType: ["Sedan", "Sedan 4 Dr."] },
  { label: "Used Coupes", bodyType: ["Coupe", "Coupes", "Coupe 2-Door"] },
  { label: "Used Convertibles", bodyType: ["Convertible", "Convertibles"] },
  { label: "Used Pick-up", bodyType: ["Pickup Truck", "Truck", "Pickup-Truck", "Trucks"] },
] as const;

export const getMakeUrl = (make: string, appConfig: AppConfig) => getInventoryUrlByMake(make, appConfig);
export const getBodyTypeUrl = (bodyType: string, appConfig: AppConfig) => getInventoryUrlByBodyType(bodyType, appConfig);
export const getInventoryUrlByQuery = (query: string, _appConfig: AppConfig) => `/inventory?q=${encodeURIComponent(query)}`;
export const getInventoryUrlByRefinement = (attribute: string, values: readonly string[], _appConfig: AppConfig) => {
  const key = FILTER_KEYS[attribute];
  return key ? inventoryUrl(key, values) : "/inventory";
};
export const getInventoryUrlByRange = (attribute: string, range: string, _appConfig: AppConfig) => {
  const keys = RANGE_KEYS[attribute];
  if (!keys) return "/inventory";
  const [low = "", high = ""] = range.split(":", 2);
  const query = [low && `${keys[0]}=${encodeURIComponent(low)}`, high && `${keys[1]}=${encodeURIComponent(high)}`].filter(Boolean).join("&");
  return query ? `/inventory?${query}` : "/inventory";
};

export async function getVehicleById(id: string, appConfig: AppConfig): Promise<Record<string, any> | null> {
  const apiKey = appConfig.site.inventory_search_only_key;
  const collection = appConfig.site.collection;
  const host = appConfig.site.typesense_host;
  if (!apiKey || !collection || !host) throw new Error("Missing Typesense configuration in appConfig.site");
  const res = await fetch(`https://${host}/collections/${collection}/documents/search?q=*&filter_by=id:=${id}`, {
    headers: { "X-TYPESENSE-API-KEY": apiKey }, cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.hits?.[0]?.document ?? null;
}

/**
 * Shared server utility to fetch vehicle by slug for both metadata and page rendering
 * Slug format: "{id}-{slug}"
 * 
 * @param slugArray - The slug array from params (e.g., ["12345-2023-honda-civic"])
 * @param appConfig - The app configuration object
 * @returns The vehicle document or null if not found
 */
export async function getVehicleBySlug(slugArray: string[], appConfig: AppConfig): Promise<Record<string, any> | null> {
  if (!slugArray || slugArray.length === 0) return null;
  
  const vehicleParam = slugArray[0];
  const firstDash = vehicleParam.indexOf("-");
  if (firstDash === -1) return null;
  
  const id = vehicleParam.substring(0, firstDash);
  return getVehicleById(id, appConfig);
}