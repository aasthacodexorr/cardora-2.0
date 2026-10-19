"use client";

import { useEffect, useRef } from "react";

import { useRecentlyViewed } from "@/lib/recentlyViewed";

interface RecentlyViewedTrackerProps {
  inventoryId: string | number;
}

export default function RecentlyViewedTracker({
  inventoryId,
}: RecentlyViewedTrackerProps) {
  const { addRecentlyViewed } = useRecentlyViewed();
  const lastTrackedInventoryId = useRef<string | null>(null);

  useEffect(() => {
    const normalizedId = String(inventoryId).trim();

    if (!normalizedId || lastTrackedInventoryId.current === normalizedId) {
      return;
    }

    lastTrackedInventoryId.current = normalizedId;
    addRecentlyViewed(normalizedId);
  }, [addRecentlyViewed, inventoryId]);

  return null;
}
