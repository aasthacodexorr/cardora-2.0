"use client";

import { useRef, useMemo, useCallback, useEffect, useState } from "react";
import {
  useInstantSearch,
  useRefinementList,
  useCurrentRefinements,
} from "react-instantsearch";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  POPULAR_FEATURE_LIST,
  isFeatureMatch,
  getCanonicalFeatureName,
  PopularFeatureName,
} from "@/constants/popularFeatures";

export default function PopularFeatureSearchChips() {
  // Mount refinement list for popular_features so InstantSearch manages the facet attribute
  useRefinementList({
    attribute: "popular_features",
    limit: 200,
  });

  const { indexUiState, setIndexUiState } = useInstantSearch();
  const { items: currentRefinements } = useCurrentRefinements();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to display left/right navigation arrows on desktop
  const updateScrollArrows = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    updateScrollArrows();
    el.addEventListener("scroll", updateScrollArrows, { passive: true });
    window.addEventListener("resize", updateScrollArrows);
    return () => {
      el.removeEventListener("scroll", updateScrollArrows);
      window.removeEventListener("resize", updateScrollArrows);
    };
  }, [updateScrollArrows]);

  // Scroll left/right smoothly
  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = Math.max(el.clientWidth * 0.6, 200);
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Convert mouse wheel vertical scroll to horizontal scroll on desktop
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && el.scrollWidth > el.clientWidth) {
      el.scrollLeft += e.deltaY;
    }
  };

  // Active feature values currently in indexUiState or currentRefinements
  const activeFeatures = useMemo(() => {
    const fromUiState: string[] =
      (indexUiState.refinementList?.popular_features as string[]) || [];

    const featCategory = currentRefinements.find(
      (c) => c.attribute === "popular_features"
    );
    const fromCurrent: string[] =
      featCategory?.refinements.map((r) => String(r.value || r.label)) || [];

    return Array.from(new Set([...fromUiState, ...fromCurrent]));
  }, [indexUiState.refinementList?.popular_features, currentRefinements]);

  // Check if a specific feature chip is active
  const isFeatureActive = useCallback(
    (featureName: PopularFeatureName): boolean => {
      return activeFeatures.some((activeVal) =>
        isFeatureMatch(activeVal, featureName)
      );
    },
    [activeFeatures]
  );

  // Toggle feature filter on click
  const handleToggle = (featureName: PopularFeatureName) => {
    const canonicalName = getCanonicalFeatureName(featureName) || featureName;

    setIndexUiState((prevState) => {
      const currentRefinementList = prevState.refinementList || {};
      const currentFeatures = (currentRefinementList.popular_features || []).map(
        String
      );

      const isCurrentlyActive = currentFeatures.some((val) =>
        isFeatureMatch(val, canonicalName)
      );

      let nextFeatures: string[];
      if (isCurrentlyActive) {
        // Deselect feature: remove all matching instances
        nextFeatures = currentFeatures.filter(
          (val) => !isFeatureMatch(val, canonicalName)
        );
      } else {
        // Select feature: append canonical name
        nextFeatures = [...currentFeatures, canonicalName];
      }

      const nextRefinementList = { ...currentRefinementList };
      if (nextFeatures.length > 0) {
        nextRefinementList.popular_features = nextFeatures;
      } else {
        delete nextRefinementList.popular_features;
      }

      return {
        ...prevState,
        page: 1,
        refinementList: nextRefinementList,
      };
    });
  };

  return (
    <div
      className="relative w-full pt-2 pb-1"
      aria-label="Popular vehicle feature filters"
    >
      {/* Left Scroll Arrow with gradient backdrop (Desktop) */}
      {canScrollLeft && (
        <div className="hidden lg:flex absolute left-0 top-0 bottom-0 z-10 w-14 items-center justify-start pl-0.5 bg-gradient-to-r from-[#efefef] from-50% to-transparent pointer-events-none">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            aria-label="Scroll features left"
            className="pointer-events-auto flex items-center justify-center w-7 h-7 rounded-full bg-white border border-gray-300 text-gray-700 shadow-sm hover:bg-gray-50 hover:text-black hover:border-gray-400 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Horizontal scroll container: single row, hidden scrollbar, touch-friendly */}
      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        className="w-full overflow-x-auto no-scrollbar scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="inline-flex items-center gap-2 pr-2 py-0.5">
          {POPULAR_FEATURE_LIST.map((featureName) => {
            const active = isFeatureActive(featureName);

            return (
              <button
                key={featureName}
                type="button"
                onClick={() => handleToggle(featureName)}
                aria-pressed={active}
                className={`shrink-0 inline-flex items-center justify-center whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-medium leading-none cursor-pointer select-none transition-all duration-150 ${
                  active
                    ? "bg-[#111827] text-white border border-[#111827] shadow-xs hover:bg-black"
                    : "bg-white text-gray-800 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100"
                }`}
              >
                {featureName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Scroll Arrow with gradient backdrop (Desktop) */}
      {canScrollRight && (
        <div className="hidden lg:flex absolute right-0 top-0 bottom-0 z-10 w-14 items-center justify-end pr-0.5 bg-gradient-to-l from-[#efefef] from-50% to-transparent pointer-events-none">
          <button
            type="button"
            onClick={() => handleScroll("right")}
            aria-label="Scroll features right"
            className="pointer-events-auto flex items-center justify-center w-7 h-7 rounded-full bg-white border border-gray-300 text-gray-700 shadow-sm hover:bg-gray-50 hover:text-black hover:border-gray-400 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
