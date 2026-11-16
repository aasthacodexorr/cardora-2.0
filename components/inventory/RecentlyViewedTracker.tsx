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
  const lastTrackedKey = useRef<string | null>(null);

  useEffect(() => {
    const normalizedId = String(inventoryId).trim();
    if (!normalizedId) {
      return;
    }

    const hasVehicleData = Boolean(
      vehicle && (vehicle.inventory_id || vehicle.id || vehicle.make || vehicle.model)
    );
    const trackingKey = `${normalizedId}-${hasVehicleData ? "with-vehicle" : "no-vehicle"}`;

    if (lastTrackedKey.current === trackingKey) {
      return;
    }

    if (lastTrackedKey.current === `${normalizedId}-with-vehicle` && !hasVehicleData) {
      return;
    }

    lastTrackedKey.current = trackingKey;
    addRecentlyViewed(normalizedId, vehicle ?? undefined);
  }, [addRecentlyViewed, inventoryId, vehicle]);

  return null;
}
