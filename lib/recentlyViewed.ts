"use client";

import { useMemo, useSyncExternalStore } from "react";

export const RECENTLY_VIEWED_STORAGE_KEY = "cardora_recently_viewed";
export const MAX_RECENTLY_VIEWED = 100;

export interface RecentlyViewedItem {
  inventoryId: string;
  viewedAt: number;
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

    return parsed.filter(
      (item): item is RecentlyViewedItem =>
        !!item &&
        typeof item === "object" &&
        typeof item.inventoryId === "string" &&
        typeof item.viewedAt === "number"
    );
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
  const nextSnapshot = JSON.stringify(items);
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

export function addRecentlyViewed(inventoryId: string | number) {
  const normalizedId = String(inventoryId).trim();

  if (!normalizedId) {
    return;
  }

  const next = parseItems(readSnapshot()).filter(
    (item) => item.inventoryId !== normalizedId
  );

  next.unshift({
    inventoryId: normalizedId,
    viewedAt: Date.now(),
  });

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

  const isRecentlyViewed = (inventoryId: string | number) => {
    const normalizedId = String(inventoryId).trim();
    return normalizedId !== "" && recentlyViewed.some(
      (item) => item.inventoryId === normalizedId
    );
  };

  return {
    recentlyViewedIds: recentlyViewed.map((item) => item.inventoryId),
    isRecentlyViewed,
    addRecentlyViewed,
    clearRecentlyViewed,
  };
}
