"use client";

import { useEffect, useState } from "react";
import { HitCard } from "@/components/inventory";
import { useRecentlyViewed, MAX_RECENTLY_VIEWED_HOME } from "@/lib/recentlyViewed";

let hasClientHydrated = false;

export default function RecentlyViewedVehicles() {
  const [isMounted, setIsMounted] = useState(() => hasClientHydrated);
  const { recentlyViewedVehicles } = useRecentlyViewed();

  useEffect(() => {
    hasClientHydrated = true;
    setIsMounted(true);
  }, []);

  // During SSR / initial load before mount, render a placeholder skeleton for returning visitors.
  // CSS will display it if html.is-returning-visitor, preventing CategoryPills from flashing above it.
  if (!isMounted) {
    return (
      <section className="recently-viewed-placeholder w-full bg-background mt-8 sm:mt-5 mb-8 sm:mb-1">
        <div className="max-w-[1280px] xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 md:px-8 lg:px-14">
          <div className="flex items-center justify-between mb-6 md:mb-2">
            <h2 className="text-[28px] lg:text-[40px] font-bold text-foreground tracking-tight">
              Recently Viewed
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-4 border border-border/40 h-[380px] animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Hide section if no vehicles have been viewed
  if (recentlyViewedVehicles.length === 0) {
    return null;
  }

  // Display a maximum of 4 recently viewed vehicles on the home page
  const displayVehicles = recentlyViewedVehicles.slice(0, MAX_RECENTLY_VIEWED_HOME);

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
              showRecentlyViewedBadge={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
