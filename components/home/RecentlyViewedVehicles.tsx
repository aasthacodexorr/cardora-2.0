"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HitCard } from "@/components/inventory";
import {
  useRecentlyViewed,
  isSoldVehicle,
  validateRecentlyViewedStatus,
} from "@/lib/recentlyViewed";
import { useAppConfig } from "@/app/providers";

let hasClientHydrated = false;

export default function RecentlyViewedVehicles() {
  const appConfig = useAppConfig();
  const [isMounted, setIsMounted] = useState(() => hasClientHydrated);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { recentlyViewedVehicles } = useRecentlyViewed();

  useEffect(() => {
    hasClientHydrated = true;
    setIsMounted(true);
  }, []);

  // Display all active (non-sold) recently viewed vehicles on the home page
  const displayVehicles = recentlyViewedVehicles.filter((v) => !isSoldVehicle(v));

  // Asynchronously validate live status against Typesense on mount
  useEffect(() => {
    if (!isMounted || displayVehicles.length === 0) return;
    validateRecentlyViewedStatus(appConfig);
  }, [isMounted, appConfig, displayVehicles.length]);

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
    const gap = typeof window !== "undefined" && window.innerWidth >= 640 ? 24 : 16;
    const step = card ? card.offsetWidth + gap : carousel.clientWidth * 0.8;
    const scrollAmount =
      typeof window !== "undefined" && window.innerWidth >= 1024
        ? step * 2
        : step;

    carousel.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // During SSR / initial load before mount, render a placeholder skeleton for returning visitors.
  // CSS will display it if html.is-returning-visitor, preventing CategoryPills from flashing above it.
  if (!isMounted) {
    return (
      <section className="recently-viewed-placeholder w-full bg-background mt-6 sm:mt-5 mb-6 sm:mb-5">
        <div className="max-w-[1280px] xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 md:px-8 lg:px-14">
          <div className="flex items-center justify-between mb-6 md:mb-2">
            <h2 className="text-[28px] lg:text-[40px] font-bold text-foreground tracking-tight">
              Recently Viewed
            </h2>
          </div>

          <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 pt-1 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden overscroll-x-contain -mx-4 px-4 md:-mx-8 md:px-8 lg:mx-0 lg:px-0">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-[82%] sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-72px)/4)] shrink-0 snap-start bg-card rounded-2xl p-4 border border-border/40 h-[380px] animate-pulse"
              />
            ))}
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
      <div className="max-w-[1280px] xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 md:px-8 lg:px-14">
        <div className="flex items-center justify-between mb-6 md:mb-4">
          <h2 className="text-[28px] lg:text-[40px] font-bold text-foreground tracking-tight">
            Recently Viewed
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

        <div
          ref={carouselRef}
          className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 pt-1 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden overscroll-x-contain -mx-4 px-4 md:-mx-8 md:px-8 lg:mx-0 lg:px-0"
        >
          {displayVehicles.map((vehicle, index) => (
            <div
              key={String(vehicle.inventory_id ?? vehicle.id ?? index)}
              data-card-item
              className="w-[82%] sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-72px)/4)] shrink-0 snap-start flex flex-col self-stretch"
            >
              <HitCard
                hit={vehicle}
                showRecentlyViewedBadge={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
