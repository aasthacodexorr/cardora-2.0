"use client";

import { RecentlyViewedTag } from "@/components/inventory";
import { useRecentlyViewed } from "@/lib/recentlyViewed";

interface RecentlyViewedIndicatorProps {
  inventoryId: string | number;
}

export default function RecentlyViewedIndicator({
  inventoryId,
}: RecentlyViewedIndicatorProps) {
  const { wasViewedBeforeCurrentVisit } = useRecentlyViewed();

  if (!wasViewedBeforeCurrentVisit(inventoryId)) {
    return null;
  }

  return <RecentlyViewedTag variant="inline" />;
}
