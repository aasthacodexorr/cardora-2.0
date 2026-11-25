"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { HitCardHit } from "@/components/inventory/HitCard";
import type { AppConfig } from "@/lib/appConfig";

export const RECENTLY_VIEWED_STORAGE_KEY = "cardora_recently_viewed";
export const MAX_RECENTLY_VIEWED_HOME = 4;
export const MAX_STORED_RECENTLY_VIEWED = 100;
// Retained for backwards compatibility if referenced elsewhere
export const MAX_RECENTLY_VIEWED = MAX_RECENTLY_VIEWED_HOME;

export interface RecentlyViewedItem {
  inventory_id: string | number;
  inventoryId: string;
  vehicle?: HitCardHit;
  viewed_at: number;
  viewedAt: number;
  visitCount: number;
}

/**
 * Determines whether a vehicle is considered sold.
 * In Cardora, any vehicle with status other than "instock" (e.g. "Sold")
 * or with an explicit sold flag is treated as sold.
 */
export function isSoldVehicle(v: unknown): boolean {
  if (!v || typeof v !== "object") return false;
  const item = v as Record<string, any>;
  const vehicle = (item.vehicle && typeof item.vehicle === "object" ? item.vehicle : item) as Record<string, any>;

  // Check explicit boolean or numeric flags
  if (
    vehicle.is_sold === true ||
    vehicle.is_sold === 1 ||
    vehicle.is_sold === "1" ||
    vehicle.is_sold === "true" ||
    item.is_sold === true ||
    item.is_sold === 1 ||
    item.is_sold === "1" ||
    item.is_sold === "true" ||
    vehicle.isSold === true ||
    item.isSold === true
  ) {
    return true;
  }

  // Check status field
  const rawStatus = vehicle.status ?? item.status;
  if (rawStatus !== undefined && rawStatus !== null) {
    const status = String(rawStatus).trim().toLowerCase();
    if (status === "sold") return true;
    if (status && status !== "instock" && status !== "in stock") {
      return true;
    }
  }

  // Check sub_status field
  const rawSubStatus = vehicle.sub_status ?? item.sub_status;
  if (rawSubStatus !== undefined && rawSubStatus !== null) {
    const subStatus = String(rawSubStatus).trim().toLowerCase();
    if (subStatus === "sold") return true;
  }

  return false;
}

/**
 * Extracts only the vehicle fields required by the HitCard component
 * to keep stored vehicle data compact and structured according to the API model.
 */
export function extractHitCardData(
  vehicle: Record<string, any>,
  fallbackId?: string | number
): HitCardHit {
  const inventory_id = vehicle.inventory_id ?? vehicle.id ?? fallbackId ?? "";

  let image_urls = "";
  if (typeof vehicle.image_urls === "string") {
    image_urls = vehicle.image_urls;
  } else if (Array.isArray(vehicle.image_urls)) {
    image_urls = vehicle.image_urls.filter(Boolean).join(";");
  } else if (typeof vehicle.image === "string") {
    image_urls = vehicle.image;
  } else if (typeof vehicle.image_url === "string") {
    image_urls = vehicle.image_url;
  }

  const result: HitCardHit = {
    inventory_id,
    id: String(inventory_id),
  };

  if (vehicle.year !== undefined && vehicle.year !== null) result.year = vehicle.year;
  if (vehicle.make !== undefined && vehicle.make !== null) result.make = String(vehicle.make);
  if (vehicle.model !== undefined && vehicle.model !== null) result.model = String(vehicle.model);
  if (vehicle.trim !== undefined && vehicle.trim !== null) result.trim = String(vehicle.trim);
  if (vehicle.price !== undefined && vehicle.price !== null) result.price = vehicle.price;
  if (vehicle.special_price !== undefined && vehicle.special_price !== null) {
    result.special_price = vehicle.special_price;
  }
  if (vehicle.odometer !== undefined && vehicle.odometer !== null) result.odometer = vehicle.odometer;
  if (vehicle.drivetrain !== undefined && vehicle.drivetrain !== null) {
    result.drivetrain = String(vehicle.drivetrain);
  }
  if (vehicle.stock_no !== undefined && vehicle.stock_no !== null) {
    result.stock_no = String(vehicle.stock_no);
  }
  if (vehicle.status !== undefined && vehicle.status !== null) {
    result.status = String(vehicle.status);
  }
  if (vehicle.sub_status !== undefined && vehicle.sub_status !== null) {
    result.sub_status = String(vehicle.sub_status);
  }
  if (image_urls) {
    result.image_urls = image_urls;
  }
  if (vehicle.vehicle_type !== undefined && vehicle.vehicle_type !== null) {
    result.vehicle_type = String(vehicle.vehicle_type);
  }
  if (vehicle.financing_on !== undefined && vehicle.financing_on !== null) {
    result.financing_on = vehicle.financing_on;
  }
  if (vehicle.financing_special !== undefined && vehicle.financing_special !== null) {
    result.financing_special = vehicle.financing_special;
  }
  if (vehicle.emi_amount !== undefined && vehicle.emi_amount !== null) {
    result.emi_amount = vehicle.emi_amount;
  }
  if (vehicle.downpayment !== undefined && vehicle.downpayment !== null) {
    result.downpayment = vehicle.downpayment;
  }
  if (vehicle.payment_frequency !== undefined && vehicle.payment_frequency !== null) {
    result.payment_frequency = String(vehicle.payment_frequency);
  }
  if (vehicle.interest_rate !== undefined && vehicle.interest_rate !== null) {
    result.interest_rate = vehicle.interest_rate;
  }
  if (vehicle.term !== undefined && vehicle.term !== null) {
    result.term = vehicle.term;
  }

  return result;
}

const EMPTY_SNAPSHOT = "[]";
let snapshot = EMPTY_SNAPSHOT;
const listeners = new Set<() => void>();

function readSnapshot(): string {
  if (typeof window === "undefined") {
    return EMPTY_SNAPSHOT;
  }

  try {
    return window.localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY) ?? EMPTY_SNAPSHOT;
  } catch (error) {
    console.error("Failed to read recently viewed vehicles:", error);
    return snapshot;
  }
}

function parseItems(value: string): RecentlyViewedItem[] {
  try {
    const parsed: unknown = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.flatMap((rawItem): RecentlyViewedItem[] => {
      if (!rawItem || typeof rawItem !== "object") {
        return [];
      }

      const item = rawItem as Record<string, any>;

      // Determine vehicle data if nested under vehicle key or flat
      let vehicleData: HitCardHit | undefined = undefined;
      if (item.vehicle && typeof item.vehicle === "object") {
        vehicleData = extractHitCardData(item.vehicle);
      } else if (item.make || item.model || item.price || item.image_urls) {
        vehicleData = extractHitCardData(item);
      }

      // Exclude sold vehicles from recently viewed
      if (isSoldVehicle(vehicleData) || isSoldVehicle(item)) {
        return [];
      }

      const idRaw =
        item.inventory_id ??
        item.inventoryId ??
        item.id ??
        vehicleData?.inventory_id ??
        vehicleData?.id;

      if (idRaw === undefined || idRaw === null) {
        return [];
      }

      const normalizedId = String(idRaw).trim();
      if (!normalizedId) {
        return [];
      }

      const viewedAt =
        typeof item.viewed_at === "number"
          ? item.viewed_at
          : typeof item.viewedAt === "number"
          ? item.viewedAt
          : Date.now();

      const visitCount =
        typeof item.visitCount === "number"
          ? item.visitCount
          : 1;

      return [
        {
          inventory_id: idRaw,
          inventoryId: normalizedId,
          viewed_at: viewedAt,
          viewedAt,
          visitCount,
          vehicle: vehicleData,
        },
      ];
    });
  } catch (error) {
    console.error("Failed to parse recently viewed vehicles:", error);
    return [];
  }
}

if (typeof window !== "undefined") {
  try {
    const initialRaw = window.localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
    const initialItems = parseItems(initialRaw ?? EMPTY_SNAPSHOT);
    if (initialItems.length > 0) {
      document.documentElement.classList.add("is-returning-visitor");
    }
  } catch {
    // Ignore storage check errors
  }
}

function notifySubscribers() {
  for (const listener of listeners) {
    listener();
  }
}

function handleStorageChange(event: StorageEvent) {
  if (event.key !== RECENTLY_VIEWED_STORAGE_KEY && event.key !== null) {
    return;
  }

  snapshot = event.newValue ?? EMPTY_SNAPSHOT;
  notifySubscribers();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (listeners.size === 1 && typeof window !== "undefined") {
    window.addEventListener("storage", handleStorageChange);
  }

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0 && typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorageChange);
    }
  };
}

function getSnapshot() {
  const currentSnapshot = readSnapshot();

  if (currentSnapshot !== snapshot) {
    snapshot = currentSnapshot;
  }

  return snapshot;
}

function getServerSnapshot() {
  return EMPTY_SNAPSHOT;
}

function saveItems(items: RecentlyViewedItem[]) {
  // Store structured objects with inventory_id, vehicle, viewed_at as requested,
  // plus backwards-compatible properties.
  const serialized = items.map((item) => ({
    inventory_id: item.inventory_id,
    inventoryId: item.inventoryId,
    vehicle: item.vehicle,
    viewed_at: item.viewed_at,
    viewedAt: item.viewedAt,
    visitCount: item.visitCount,
  }));

  const nextSnapshot = JSON.stringify(serialized);
  snapshot = nextSnapshot;

  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, nextSnapshot);
      if (items.length > 0) {
        document.documentElement.classList.add("is-returning-visitor");
      } else {
        document.documentElement.classList.remove("is-returning-visitor");
      }
    }
  } catch (error) {
    console.error("Failed to save recently viewed vehicles:", error);
  }

  notifySubscribers();
}

export function addRecentlyViewed(
  inventoryIdOrVehicle: string | number | Record<string, any>,
  vehicleData?: Record<string, any>
) {
  let id: string | number = "";
  let vehicleObj: Record<string, any> | undefined = vehicleData;

  if (
    typeof inventoryIdOrVehicle === "object" &&
    inventoryIdOrVehicle !== null
  ) {
    vehicleObj = inventoryIdOrVehicle;
    id = vehicleObj.inventory_id ?? vehicleObj.id ?? "";
  } else {
    id = inventoryIdOrVehicle;
  }

  const normalizedId = String(id).trim();
  if (!normalizedId) {
    return;
  }

  // If vehicle is sold, do not add it and remove it from existing storage if present
  if (
    (vehicleObj && isSoldVehicle(vehicleObj)) ||
    (vehicleData && isSoldVehicle(vehicleData))
  ) {
    const currentItems = parseItems(readSnapshot());
    const next = currentItems.filter(
      (item) =>
        item.inventoryId !== normalizedId &&
        String(item.inventory_id) !== normalizedId
    );
    if (next.length !== currentItems.length) {
      saveItems(next);
    }
    return;
  }

  const currentItems = parseItems(readSnapshot());
  const previousItem = currentItems.find(
    (item) =>
      item.inventoryId === normalizedId ||
      String(item.inventory_id) === normalizedId
  );

  // Remove existing vehicle to avoid duplicates and bump to top
  const next = currentItems.filter(
    (item) =>
      item.inventoryId !== normalizedId &&
      String(item.inventory_id) !== normalizedId
  );

  const extractedVehicle = vehicleObj
    ? extractHitCardData(vehicleObj, normalizedId)
    : previousItem?.vehicle;

  const now = Date.now();
  const nextItem: RecentlyViewedItem = {
    inventory_id: vehicleObj?.inventory_id ?? vehicleObj?.id ?? normalizedId,
    inventoryId: normalizedId,
    vehicle: extractedVehicle,
    viewed_at: now,
    viewedAt: now,
    visitCount: (previousItem?.visitCount ?? 0) + 1,
  };

  next.unshift(nextItem);

  saveItems(next.slice(0, MAX_STORED_RECENTLY_VIEWED));

  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem("cardora_last_vdp_view_time", now.toString());
    } catch {
      // Ignore storage errors
    }
  }
}

export function clearRecentlyViewed() {
  if (typeof document !== "undefined") {
    document.documentElement.classList.remove("is-returning-visitor");
  }
  saveItems([]);
}

export function useRecentlyViewed() {
  const serializedItems = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const recentlyViewed = useMemo(
    () => parseItems(serializedItems),
    [serializedItems]
  );

  const hasBeenViewed = (inventoryId: string | number) => {
    const normalizedId = String(inventoryId).trim();
    return (
      normalizedId !== "" &&
      recentlyViewed.some(
        (item) =>
          (item.inventoryId === normalizedId ||
            String(item.inventory_id) === normalizedId) &&
          !isSoldVehicle(item.vehicle) &&
          !isSoldVehicle(item) &&
          item.visitCount >= 1
      )
    );
  };

  const wasViewedBeforeCurrentVisit = (inventoryId: string | number) => {
    const normalizedId = String(inventoryId).trim();
    return (
      normalizedId !== "" &&
      recentlyViewed.some(
        (item) =>
          (item.inventoryId === normalizedId ||
            String(item.inventory_id) === normalizedId) &&
          !isSoldVehicle(item.vehicle) &&
          !isSoldVehicle(item) &&
          item.visitCount >= 2
      )
    );
  };

  const recentlyViewedVehicles = useMemo(
    () =>
      recentlyViewed
        .map((item) => item.vehicle)
        .filter((v): v is HitCardHit => Boolean(v && (v.inventory_id || v.id) && !isSoldVehicle(v))),
    [recentlyViewed]
  );

  return {
    recentlyViewed,
    recentlyViewedIds: recentlyViewed.map((item) => item.inventoryId),
    recentlyViewedVehicles,
    hasViewedVehicles: recentlyViewedVehicles.length > 0,
    hasBeenViewed,
    wasViewedBeforeCurrentVisit,
    addRecentlyViewed,
    clearRecentlyViewed,
  };
}

/**
 * Fetches current inventory records for recently viewed IDs. Local vehicle data
 * is only used to remember which inventory IDs to request, never as card data.
 */
export async function fetchRecentlyViewedInventory(
  ids: string[],
  appConfig: AppConfig
): Promise<HitCardHit[]> {
  if (ids.length === 0) return [];

  const { typesense_host, typesense_port, typesense_protocol, collection, inventory_search_only_key } =
    appConfig.site;
  if (!inventory_search_only_key || !collection || !typesense_host) {
    throw new Error("Missing Typesense configuration for recently viewed vehicles");
  }

  const protocol = typesense_protocol || "https";
  const port = Number(typesense_port) || 443;
  const url = new URL(
    `${protocol}://${typesense_host}:${port}/collections/${collection}/documents/search`
  );
  url.searchParams.set("q", "*");
  url.searchParams.set("filter_by", `id:=[${ids.join(",")}]`);
  url.searchParams.set("per_page", String(ids.length));

  const response = await fetch(url.toString(), {
    headers: { "X-TYPESENSE-API-KEY": inventory_search_only_key },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch recently viewed inventory: ${response.status}`);
  }

  const data = (await response.json()) as {
    hits?: Array<{ document?: HitCardHit }>;
  };
  const vehiclesById = new Map<string, HitCardHit>();
  for (const hit of data.hits ?? []) {
    const vehicle = hit.document;
    if (!vehicle) continue;

    const id = vehicle.inventory_id ?? vehicle.id;
    if (id !== undefined && id !== null) {
      vehiclesById.set(String(id), vehicle);
    }
    if (vehicle.inventory_id !== undefined && vehicle.inventory_id !== null) {
      vehiclesById.set(String(vehicle.inventory_id), vehicle);
    }
  }

  const currentVehicles = ids.flatMap((id) => {
    const vehicle = vehiclesById.get(id);
    return vehicle && !isSoldVehicle(vehicle) ? [vehicle] : [];
  });
  const requestedIds = new Set(ids);
  const currentItems = parseItems(readSnapshot());
  const syncedItems = currentItems.flatMap((item) => {
    if (!requestedIds.has(item.inventoryId)) return [item];
    const vehicle = vehiclesById.get(item.inventoryId);
    return vehicle && !isSoldVehicle(vehicle)
      ? [{ ...item, vehicle: extractHitCardData(vehicle, item.inventoryId) }]
      : [];
  });

  if (JSON.stringify(syncedItems) !== JSON.stringify(currentItems)) {
    saveItems(syncedItems);
  }

  return currentVehicles;
}
