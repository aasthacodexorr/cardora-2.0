"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HitCard } from "@/components/inventory";
import { useRecentlyViewed } from "@/lib/recentlyViewed";

export default function RecentlyViewedVehicles() {
  const [isMounted, setIsMounted] = useState(false);
  const { recentlyViewedVehicles } = useRecentlyViewed();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Avoid SSR hydration mismatch and hide section if no vehicles have been viewed
  if (!isMounted || recentlyViewedVehicles.length === 0) {
    return null;
  }

  // Display a maximum of 4 recently viewed vehicles
  const displayVehicles = recentlyViewedVehicles.slice(0, 4);

  return (
    <section className="w-full bg-background mt-8 sm:mt-5 mb-8 sm:mb-1">
      <div className="max-w-[1280px] xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 md:px-8 lg:px-14">
        <div className="flex items-center justify-between mb-6 md:mb-2">
          <h2 className="text-[28px] lg:text-[40px] font-bold text-foreground tracking-tight">
            Recently Viewed
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayVehicles.map((vehicle, index) => (
            <HitCard
              key={String(vehicle.inventory_id ?? vehicle.id ?? index)}
              hit={vehicle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
