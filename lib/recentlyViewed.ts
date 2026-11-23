"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { HitCardHit } from "@/components/inventory/HitCard";

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

let hasValidatedStatusInSession = false;

/**
 * Validates the live status of stored recently viewed vehicles against Typesense.
 * If any previously viewed vehicle is now marked as sold or unavailable,
 * it is automatically pruned from localStorage.
 */
export async function validateRecentlyViewedStatus(appConfig?: any) {
  if (typeof window === "undefined" || hasValidatedStatusInSession) return;

  try {
    const rawItems = parseItems(readSnapshot());
    if (rawItems.length === 0) return;

    const ids = rawItems
      .map((item) =>
        String(
          item.inventory_id ??
            item.inventoryId ??
            item.vehicle?.inventory_id ??
            item.vehicle?.id ??
            ""
        ).trim()
      )
      .filter(Boolean);

    if (ids.length === 0) return;

    const host =
      appConfig?.site?.typesense_host || "v6eba1srpfohj89dp-1.a1.typesense.net";
    const port = Number(appConfig?.site?.typesense_port) || 443;
    const protocol = appConfig?.site?.typesense_protocol || "https";
    const collection =
      appConfig?.site?.collection || "56d5b06765ad7f3843fd182cf2b4afe0";
    const searchKey = appConfig?.site?.inventory_search_only_key;

    if (!searchKey || !collection || !host) return;

    hasValidatedStatusInSession = true;

    const filterIds = ids.slice(0, 50).join(",");
    const url = `${protocol}://${host}:${port}/collections/${collection}/documents/search?q=*&filter_by=id:=[${filterIds}]&include_fields=id,inventory_id,status,sub_status,is_sold&per_page=50`;

    const res = await fetch(url, {
      headers: { "X-TYPESENSE-API-KEY": searchKey },
    });

    if (!res.ok) return;

    const data = await res.json();
    const hits: any[] = data.hits || [];

    const statusMap = new Map<string, any>();
    for (const hit of hits) {
      const doc = hit.document;
      if (doc) {
        if (doc.id) statusMap.set(String(doc.id), doc);
        if (doc.inventory_id) statusMap.set(String(doc.inventory_id), doc);
      }
    }

    const current = parseItems(readSnapshot());
    const valid = current.filter((item) => {
      const id = String(
        item.inventory_id ??
          item.inventoryId ??
          item.vehicle?.inventory_id ??
          item.vehicle?.id ??
          ""
      ).trim();
      const liveDoc = statusMap.get(id);
      if (liveDoc && isSoldVehicle(liveDoc)) {
        return false;
      }
      return true;
    });

    if (valid.length !== current.length) {
      saveItems(valid);
    }
  } catch (err) {
    // Silently continue if network check fails
  }
}
