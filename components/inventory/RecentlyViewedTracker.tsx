"use client";

import { useEffect, useRef } from "react";

import { useRecentlyViewed } from "@/lib/recentlyViewed";

interface RecentlyViewedTrackerProps {
  inventoryId: string | number;
  vehicle?: Record<string, any> | null;
}

export default function RecentlyViewedTracker({
  inventoryId,
  vehicle,
}: RecentlyViewedTrackerProps) {
  const { addRecentlyViewed } = useRecentlyViewed();
  const lastTrackedInventoryId = useRef<string | null>(null);

  useEffect(() => {
    const normalizedId = String(inventoryId).trim();

    if (!normalizedId || lastTrackedInventoryId.current === normalizedId) {
      return;
    }

    lastTrackedInventoryId.current = normalizedId;
    addRecentlyViewed(normalizedId, vehicle ?? undefined);
  }, [addRecentlyViewed, inventoryId, vehicle]);

  return null;
}
