"use client";

import { useEffect, useState } from "react";
import { useRecentlyViewed, RECENTLY_VIEWED_STORAGE_KEY } from "@/lib/recentlyViewed";

export const LAST_VISIT_STORAGE_KEY = "cardora_last_visit";
export const SESSION_VISIT_STORAGE_KEY = "cardora_session_visit";

/**
 * Checks whether the user has viewed any vehicle (opened a VDP).
 * Stored in browser storage indefinitely until cache/storage is cleared.
 */
export function hasViewedAnyVehicle(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const raw = window.localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return false;
    return parsed.some(
      (item) =>
        Boolean(
          item &&
            ((item.vehicle && (item.vehicle.inventory_id || item.vehicle.id)) ||
              item.inventory_id ||
              item.inventoryId ||
              item.id)
        )
    );
  } catch {
    return false;
  }
}

/**
 * Hook to determine if Welcome Back content should be shown on the homepage.
 * Returns true only if the user has visited at least one vehicle VDP and has
 * available recently viewed cards to display.
 */
export function useVisitorTracking() {
  const [isMounted, setIsMounted] = useState(false);
  const { recentlyViewedVehicles } = useRecentlyViewed();

  useEffect(() => {
    setIsMounted(true);

    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(LAST_VISIT_STORAGE_KEY, Date.now().toString());
        window.sessionStorage.setItem(SESSION_VISIT_STORAGE_KEY, "true");
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Show Welcome Back only if mounted on client (avoiding SSR hydration mismatch)
  // and user has viewed at least one VDP with available recently viewed vehicle cards
  const hasRecentlyViewedCards = isMounted && recentlyViewedVehicles.length > 0;

  useEffect(() => {
    if (!isMounted) return;
    if (typeof document !== "undefined") {
      if (hasRecentlyViewedCards) {
        document.documentElement.classList.add("is-returning-visitor");
      } else {
        document.documentElement.classList.remove("is-returning-visitor");
      }
    }
  }, [isMounted, hasRecentlyViewedCards]);

  return {
    isReturningVisitor: hasRecentlyViewedCards,
    hasViewedVehicles: hasRecentlyViewedCards,
    isHydrated: isMounted,
  };
}

/**
 * Helper to clear visitor tracking data (useful for testing).
 */
export function resetVisitorTracking() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(SESSION_VISIT_STORAGE_KEY);
    window.localStorage.removeItem(LAST_VISIT_STORAGE_KEY);
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("is-returning-visitor");
    }
  } catch {
    // Ignore storage errors
  }
}
