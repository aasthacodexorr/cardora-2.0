"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HitCard } from "@/components/inventory";
import { fetchRecentlyViewedInventory, useRecentlyViewed } from "@/lib/recentlyViewed";
import { useAppConfig } from "@/app/providers";

let hasClientHydrated = false;

export default function RecentlyViewedVehicles() {
  const appConfig = useAppConfig();
  const [isMounted, setIsMounted] = useState(() => hasClientHydrated);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { recentlyViewed } = useRecentlyViewed();
  const idsKey = JSON.stringify(recentlyViewed.map((item) => item.inventoryId));
  const recentlyViewedIds = useMemo(
    () => JSON.parse(idsKey) as string[],
    [idsKey]
  );
  const [inventoryVehicles, setInventoryVehicles] = useState<
    Awaited<ReturnType<typeof fetchRecentlyViewedInventory>>
  >([]);
  const [loadedIdsKey, setLoadedIdsKey] = useState<string | null>(null);

  useEffect(() => {
    hasClientHydrated = true;
    setIsMounted(true);
  }, []);

  // Only render cards from the current inventory response, never the local snapshot.
  useEffect(() => {
    if (!isMounted) return;

    let cancelled = false;
    fetchRecentlyViewedInventory(recentlyViewedIds, appConfig)
      .then((vehicles) => {
        if (!cancelled) setInventoryVehicles(vehicles);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setInventoryVehicles([]);
          console.error("Failed to load recently viewed inventory:", error);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadedIdsKey(idsKey);
      });

    return () => {
      cancelled = true;
    };
  }, [appConfig, idsKey, isMounted, recentlyViewedIds]);

  const isLoadingInventory =
    isMounted && recentlyViewedIds.length > 0 && loadedIdsKey !== idsKey;
  const displayVehicles = loadedIdsKey === idsKey ? inventoryVehicles : [];

  const checkScrollState = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const el = carouselRef.current;
    if (!el) return;

    checkScrollState();
    el.addEventListener("scroll", checkScrollState, { passive: true });
    window.addEventListener("resize", checkScrollState);

    const timer = setTimeout(checkScrollState, 100);

    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", checkScrollState);
      window.removeEventListener("resize", checkScrollState);
    };
  }, [checkScrollState, isMounted, displayVehicles.length]);

  const scroll = (direction: "left" | "right") => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const card = carousel.querySelector("[data-card-item]") as HTMLElement | null;
    const step = card ? card.offsetWidth : carousel.clientWidth;
    const scrollAmount =
      typeof window !== "undefined" && window.innerWidth >= 1024
        ? step * 3
        : step;

    carousel.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // During SSR / initial load before mount, render a placeholder skeleton for returning visitors.
  // CSS will display it if html.is-returning-visitor, preventing CategoryPills from flashing above it.
  if (!isMounted || isLoadingInventory) {
    return (
      <section className="recently-viewed-placeholder w-full bg-background mt-6 sm:mt-5 mb-6 sm:mb-5">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-6 md:mb-2">
            <h2 className="text-[28px] lg:text-[40px] font-bold text-foreground tracking-tight">
              Recently viewed
            </h2>
          </div>

          <div className="px-4 md:px-0">
            <div className="flex overflow-x-auto pb-4 pt-1 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden overscroll-x-contain">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-full shrink-0 snap-start px-2 md:w-1/2 md:px-0 lg:w-1/3"
                >
                  <div className="h-[380px] animate-pulse rounded-2xl border border-border/40 bg-card p-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Hide section if no active vehicles have been viewed
  if (displayVehicles.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-background mt-6 sm:mt-5 mb-6 sm:mb-5">
      <div className="max-w-[1280px] mx-auto px-4 md:px-2">
        <div className="flex items-center justify-between mb-6 md:mb-4">
          <h2 className="text-[28px] lg:px-3 lg:text-[40px] font-bold text-foreground tracking-tight">
            Recently viewed
          </h2>

          {displayVehicles.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Previous recently viewed vehicles"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-xs transition-all hover:bg-gray-100 hover:border-gray-400 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Next recently viewed vehicles"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-xs transition-all hover:bg-gray-100 hover:border-gray-400 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="px-4 md:px-0">
          <div
            ref={carouselRef}
            className="flex overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden overscroll-x-contain"
          >
            {displayVehicles.map((vehicle, index) => (
              <div
                key={String(vehicle.inventory_id ?? vehicle.id ?? index)}
                data-card-item
                className="w-full shrink-0 snap-start px-2 md:w-1/2 md:px-3 lg:w-1/3"
              >
                <HitCard
                  hit={vehicle}
                  showRecentlyViewedBadge={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
