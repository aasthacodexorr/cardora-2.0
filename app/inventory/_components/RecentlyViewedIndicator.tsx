"use client";

import { RecentlyViewedTag } from "@/components/inventory";
import { useRecentlyViewed } from "@/lib/recentlyViewed";

interface RecentlyViewedIndicatorProps {
  inventoryId: string | number;
}

export default function RecentlyViewedIndicator({
  inventoryId,
}: RecentlyViewedIndicatorProps) {
  const { isRecentlyViewed } = useRecentlyViewed();

  if (!isRecentlyViewed(inventoryId)) {
    return null;
  }

  return <RecentlyViewedTag variant="inline" />;
}
