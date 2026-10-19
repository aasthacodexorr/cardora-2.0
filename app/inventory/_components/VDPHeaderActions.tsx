"use client";

import VDPWishlistButton from "@/components/inventory/VDPWishlistButton";
import { useRecentlyViewed } from "@/lib/recentlyViewed";
import RecentlyViewedIndicator from "./RecentlyViewedIndicator";

type Vehicle = Parameters<typeof VDPWishlistButton>[0]["vehicle"];

interface VDPHeaderActionsProps {
  inventoryId: string | number;
  vehicle: Vehicle;
}

export default function VDPHeaderActions({
  inventoryId,
  vehicle,
}: VDPHeaderActionsProps) {
  const { isRecentlyViewed } = useRecentlyViewed();
  const showRecentlyViewed = isRecentlyViewed(inventoryId);

  return (
    <div
      className={`flex items-center ${
        showRecentlyViewed ? "justify-between" : "justify-end"
      } gap-2 mr-6 ml-10`}
    >
      <RecentlyViewedIndicator inventoryId={inventoryId} />
      <VDPWishlistButton vehicle={vehicle} />
    </div>
  );
}
