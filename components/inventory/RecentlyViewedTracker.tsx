"use client";

import { useEffect } from "react";

import { useRecentlyViewed } from "@/lib/recentlyViewed";

interface RecentlyViewedTrackerProps {
  inventoryId: string | number;
}

export default function RecentlyViewedTracker({
  inventoryId,
}: RecentlyViewedTrackerProps) {
  const { addRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    if (!inventoryId) {
      return;
    }

    addRecentlyViewed(inventoryId);
  }, [addRecentlyViewed, inventoryId]);

  return null;
}
