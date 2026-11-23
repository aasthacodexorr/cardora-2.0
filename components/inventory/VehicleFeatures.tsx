"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Vehicle } from "@/types/vehicle";

import {
  extractVehicleFeatureNames,
  getMatchedVehicleFeatures,
  getVehicleFeaturesHeadline,
  VehicleFeatureItem,
} from "./vehicleFeaturesConfig";

type VehicleFeaturesProps = {
  vehicle?: Vehicle | Record<string, any> | null;
  bodyType?: string | null;
  features?: string[];
  isMobileInline?: boolean;
};

export default function VehicleFeatures({
  vehicle,
  bodyType,
  features: explicitFeatures,
  isMobileInline = false,
}: VehicleFeaturesProps) {
  const carouselRef = useRef<HTMLUListElement>(null);
  const [failedVideos, setFailedVideos] = useState<Set<string>>(() => new Set());
  const [unavailableAssets, setUnavailableAssets] = useState<Set<string>>(() => new Set());
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hasOverflow, setHasOverflow] = useState(false);

  // 1. Resolve selected features list from explicit prop or vehicle document
  const rawFeatures = useMemo(() => {
    if (explicitFeatures && explicitFeatures.length > 0) {
      return explicitFeatures;
    }
    return extractVehicleFeatureNames(vehicle);
  }, [explicitFeatures, vehicle]);

  // 2. Resolve body type
  const effectiveBodyType = bodyType ?? vehicle?.body_type ?? vehicle?.body_style ?? null;

  // 3. Match against CarMax CRM feature definitions
  const matchedFeatures: VehicleFeatureItem[] = useMemo(() => {
    return getMatchedVehicleFeatures(rawFeatures, effectiveBodyType);
  }, [rawFeatures, effectiveBodyType]);

  // 4. Dynamic CarMax-style headline and subheading description
  const { heading, subheading } = useMemo(() => {
    return getVehicleFeaturesHeadline(matchedFeatures);
  }, [matchedFeatures]);

  // Check scroll position to disable/enable arrow buttons and detect overflow
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
  }, [checkScrollState, matchedFeatures]);

  // If vehicle has no matching features, hide the entire section
  if (matchedFeatures.length === 0) {
    return null;
  }

  const markVideoFailed = (featureId: string) => {
    setFailedVideos((previous) => new Set(previous).add(featureId));
  };

  const markAssetUnavailable = (featureId: string) => {
    setUnavailableAssets((previous) => new Set(previous).add(featureId));
  };

  const scroll = (direction: "left" | "right") => {
    const carousel = carouselRef.current;
    const firstCard = carousel?.querySelector<HTMLElement>("[data-feature-card]");
    if (!carousel || !firstCard) return;

    const gap = Number.parseFloat(getComputedStyle(carousel).columnGap) || 16;
    const scrollAmount = firstCard.offsetWidth + gap;

    carousel.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section
      className={`w-full my-6 font-sans ${
        isMobileInline
          ? "px-0"
          : "lg:mt-0 lg:mb-8 mx-auto max-w-[1440px] xl:max-w-[1600px] px-4 md:px-8 lg:px-10 2xl:px-0"
      }`}
      aria-labelledby="vehicle-features-showcase-heading"
    >
      {/* Header section with CarMax style typography and controls */}
      <div className="lg:mb-5 flex flex-row sm:items-end justify-between gap-3">
        <div className="max-w-2xl">
          <h2 className="text-[22px] font-semibold text-black mb-[15px]">
            Popular Features
          </h2>
          
        </div>

        {hasOverflow && (
          <div className="shrink-0 flex items-center gap-2 self-end sm:self-auto mb-5 lg:mb-0">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Previous vehicle features"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-xs transition-all hover:bg-gray-100 hover:border-gray-400 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Next vehicle features"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-xs transition-all hover:bg-gray-100 hover:border-gray-400 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Carousel */}
      <ul
        ref={carouselRef}
        aria-label="Vehicle features showcase carousel"
        className={`flex gap-4 ${
          matchedFeatures.length === 1
            ? "w-full overflow-visible pb-4"
            : "snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]"
        }`}
      >
        {matchedFeatures.map((feature) => {
          const image = feature.image;
          const video = feature.video;
          const hasVideo = Boolean(video) && !failedVideos.has(feature.id);
          const isUnavailable = unavailableAssets.has(feature.id);
          const isSingle = matchedFeatures.length === 1;

          return (
            <li
              key={feature.id}
              data-feature-card
              className={`flex shrink-0 snap-start flex-col ${
                isSingle
                  ? "w-full max-w-full lg:w-[270px] lg:max-w-[280px]"
                  : "w-[75%] sm:w-[250px] md:w-[260px] lg:w-[270px] max-w-[280px]"
              }`}
            >
              {/* Media Card Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-100 border border-gray-200/80 shadow-xs group">
                {!isUnavailable && hasVideo && video && (
                  <video
                    src={video}
                    aria-label={feature.name}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                    onError={() => markVideoFailed(feature.id)}
                  />
                )}

                {!isUnavailable && !hasVideo && image && (
                  <Image
                    src={image}
                    alt={feature.name}
                    fill
                    sizes="(max-width: 640px) 75vw, 270px"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
                    onError={() => markAssetUnavailable(feature.id)}
                  />
                )}

                {isUnavailable && (
                  <div className="flex h-full w-full items-center justify-center px-4 text-center text-xs text-gray-400">
                    Feature preview unavailable
                  </div>
                )}
              </div>

              {/* Feature Details */}
              <div className="mt-3 flex flex-col">
                <h3 className="text-[16px] font-semibold leading-snug text-gray-900">
                  {feature.name.replace(/[®™]/g, "").trim()}
                </h3>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
