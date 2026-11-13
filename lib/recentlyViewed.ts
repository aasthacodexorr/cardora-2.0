"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { HitCardHit } from "@/components/inventory/HitCard";

export const RECENTLY_VIEWED_STORAGE_KEY = "cardora_recently_viewed";
export const MAX_RECENTLY_VIEWED = 4;

export interface RecentlyViewedItem {
  inventory_id: string | number;
  inventoryId: string;
  vehicle?: HitCardHit;
  viewed_at: number;
  viewedAt: number;
  visitCount: number;
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

  saveItems(next.slice(0, MAX_RECENTLY_VIEWED));
}

export function clearRecentlyViewed() {
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
          item.visitCount >= 2
      )
    );
  };

  return {
    recentlyViewed,
    recentlyViewedIds: recentlyViewed.map((item) => item.inventoryId),
    recentlyViewedVehicles: recentlyViewed
      .map((item) => item.vehicle)
      .filter((v): v is HitCardHit => Boolean(v && (v.inventory_id || v.id))),
    hasViewedVehicles: recentlyViewed.length > 0,
    hasBeenViewed,
    wasViewedBeforeCurrentVisit,
    addRecentlyViewed,
    clearRecentlyViewed,
  };
}
