"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HitCard } from "@/components/inventory/HitCard";
import { useRecentlyViewed, isSoldVehicle } from "@/lib/recentlyViewed";

interface VDPRecentlyViewedProps {
  currentVehicleId: string | number;
}

export default function VDPRecentlyViewed({
  currentVehicleId,
}: VDPRecentlyViewedProps) {
  const [isMounted, setIsMounted] = useState(false);
  const carouselRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hasOverflow, setHasOverflow] = useState(false);

  const { recentlyViewedVehicles } = useRecentlyViewed();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const normalizedCurrentId = String(currentVehicleId).trim();

  // Filter out the current open vehicle and any sold vehicle
  const otherVehicles = recentlyViewedVehicles.filter((v) => {
    const vId = String(v.inventory_id ?? v.id ?? "").trim();
    return (
      vId !== "" &&
      vId !== normalizedCurrentId &&
      String(v.inventory_id) !== normalizedCurrentId &&
      String(v.id) !== normalizedCurrentId &&
      !isSoldVehicle(v)
    );
  });

  const checkScrollState = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const overflow = scrollWidth > clientWidth + 10;
    setHasOverflow(overflow);
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

    // Re-check after layout calculation
    const timer = setTimeout(checkScrollState, 100);

    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", checkScrollState);
      window.removeEventListener("resize", checkScrollState);
    };
  }, [checkScrollState, isMounted, otherVehicles.length]);

  const scroll = (direction: "left" | "right") => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const scrollAmount = carousel.clientWidth;

    carousel.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!isMounted || otherVehicles.length === 0) {
    return null;
  }

  return (
    <section className="w-full overflow-hidden bg-background mt-6 md:mt-12 mb-8 md:mb-14 font-sans">
      <div className=" mx-auto max-w-[1440px] xl:max-w-[1600px] px-4 md:px-8 lg:px-10 2xl:px-0">
        <div className="flex items-center justify-between mb-4 md:mb-2">
          <h2 className="text-[22px] font-bold text-foreground tracking-tight">
            Recently viewed
          </h2>

          {hasOverflow && (
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

        <div className="px-0 w-full">
          <ul
            ref={carouselRef}
            aria-label="Recently viewed vehicles carousel"
            className="flex w-full gap-4 lg:gap-8 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]"
          >
            {otherVehicles.map((vehicle, index) => (
              <li
                key={String(vehicle.inventory_id ?? vehicle.id ?? index)}
                data-card-item
                className="shrink-0 w-full px-1 md:px-0 md:w-[calc(50%-8px)] lg:w-[calc((100%-64px)/3)]"
              >
                <HitCard
                  hit={vehicle}
                  showRecentlyViewedBadge={false}
                  compact
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
