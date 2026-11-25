"use client";

import { useRef, useMemo, useCallback, useEffect, useState } from "react";
import {
  useInstantSearch,
  useRefinementList,
  useCurrentRefinements,
} from "react-instantsearch";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppConfig } from "@/app/providers";
import { PopularFeatureTag } from "@/types/vehicle";
import {
  DEFAULT_POPULAR_FEATURE_TAGS,
  isFeatureMatch,
} from "@/constants/popularFeatures";

const PopularFeatureChipsSkeleton = () => (
  <div
    className="w-full pt-2 pb-1"
    aria-label="Loading popular vehicle feature filters"
    aria-busy="true"
  >
    <div className="flex items-center gap-2 overflow-hidden py-0.5">
      {[96, 116, 88, 128, 104, 92].map((width, index) => (
        <div
          key={index}
          style={{ width }}
          className="relative h-9 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-[#e5e7eb] [transform:translateZ(0)]"
          aria-hidden="true"
        >
          <span className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,rgba(229,231,235,0)_0%,rgba(255,255,255,0.85)_50%,rgba(229,231,235,0)_100%)] -translate-x-full animate-[inventoryShimmerSweep_1.35s_ease-in-out_infinite] will-change-transform" />
        </div>
      ))}
    </div>
  </div>
);

export default function PopularFeatureSearchChips() {
  const appConfig = useAppConfig();

  // 1. Master list of popular vehicle features fetched from Popular Feature API (or appConfig / fallback)
  const fromConfig = appConfig?.vehicle_default_popular_tags;
  const initialTags = useMemo(() => {
    return Array.isArray(fromConfig) && fromConfig.length > 0
      ? fromConfig
      : DEFAULT_POPULAR_FEATURE_TAGS;
  }, [fromConfig]);

  const [fetchedTags, setFetchedTags] = useState<PopularFeatureTag[] | null>(null);

  useEffect(() => {
    if (Array.isArray(fromConfig) && fromConfig.length > 0) return;

    let cancelled = false;
    fetch(
      "https://demo.zopsoftware.com/api/website/inventory/configurations/default-popular-features"
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setFetchedTags(data);
        }
      })
      .catch(() => {
        // Fallback to DEFAULT_POPULAR_FEATURE_TAGS already present
      });

    return () => {
      cancelled = true;
    };
  }, [fromConfig]);

  const featureTags = fetchedTags || initialTags;

  // 2. Typesense facet values and counts for popular_features
  const { items: facetItems } = useRefinementList({
    attribute: "popular_features",
    limit: 100,
  });

  const { indexUiState, setIndexUiState, results, status } = useInstantSearch();
  const { items: currentRefinements } = useCurrentRefinements();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasInitialResults, setHasInitialResults] = useState(false);

  useEffect(() => {
    if (
      !hasInitialResults &&
      status === "idle" &&
      results &&
      !results.__isArtificial
    ) {
      setHasInitialResults(true);
    }
  }, [hasInitialResults, status, results]);

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

  const hasActiveFilters = currentRefinements.length > 0;

  // Match an API tag to all equivalent Typesense facet values. Inventory data
  // can contain multiple casings or aliases for the same canonical feature.
  const findMatchingFacets = useCallback(
    (tag: PopularFeatureTag) => {
      const tagVal = (tag.value || "").trim().toLowerCase();
      const tagLab = (tag.label || "").trim().toLowerCase();

      return facetItems.filter((item) => {
        const itemVal = (item.value || item.label || "").trim().toLowerCase();
        if (tagVal && itemVal === tagVal) return true;
        if (tagLab && itemVal === tagLab) return true;
        return (
          isFeatureMatch(item.value, tag.value) ||
          isFeatureMatch(item.value, tag.label)
        );
      });
    },
    [facetItems]
  );

  const findMatchingFacet = useCallback(
    (tag: PopularFeatureTag) => {
      const matchingFacets = findMatchingFacets(tag);
      return matchingFacets.find((item) => item.count > 0) || matchingFacets[0];
    },
    [findMatchingFacets]
  );

  // Check if a specific feature tag is currently active
  const isFeatureActive = useCallback(
    (tag: PopularFeatureTag): boolean => {
      const tagVal = (tag.value || "").trim().toLowerCase();
      const tagLab = (tag.label || "").trim().toLowerCase();

      return activeFeatures.some((activeVal) => {
        if (!activeVal) return false;
        const aLower = activeVal.trim().toLowerCase();
        if (tagVal && aLower === tagVal) return true;
        if (tagLab && aLower === tagLab) return true;
        return (
          isFeatureMatch(activeVal, tag.value) ||
          isFeatureMatch(activeVal, tag.label)
        );
      });
    },
    [activeFeatures]
  );

  // Keep the full set of chips available while filters are active; facet counts
  // are scoped to filtered results and can otherwise hide every popular feature.
  const visibleTags = useMemo(() => {
    return featureTags.filter((tag) => {
      if (hasActiveFilters || isFeatureActive(tag)) {
        return true;
      }

      return findMatchingFacets(tag).some((item) => item.count > 0);
    });
  }, [featureTags, hasActiveFilters, isFeatureActive, findMatchingFacets]);

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
  }, [updateScrollArrows, visibleTags]);

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

  // Toggle feature filter on click using the actual API value
  const handleToggle = (tag: PopularFeatureTag) => {
    const matchingFacet = findMatchingFacet(tag);
    // Use the actual API / Typesense value for filtering, not just the display label
    const filterValue = matchingFacet?.value || tag.value || tag.label;
    if (!filterValue) return;

    setIndexUiState((prevState) => {
      const currentRefinementList = prevState.refinementList || {};
      const currentFeatures = (currentRefinementList.popular_features || []).map(
        String
      );

      const isCurrentlyActive = currentFeatures.some(
        (val) =>
          isFeatureMatch(val, filterValue) ||
          isFeatureMatch(val, tag.label) ||
          isFeatureMatch(val, tag.value) ||
          val.trim().toLowerCase() === filterValue.trim().toLowerCase()
      );

      let nextFeatures: string[];
      if (isCurrentlyActive) {
        // Deselect feature: remove all matching instances
        nextFeatures = currentFeatures.filter(
          (val) =>
            !isFeatureMatch(val, filterValue) &&
            !isFeatureMatch(val, tag.label) &&
            !isFeatureMatch(val, tag.value) &&
            val.trim().toLowerCase() !== filterValue.trim().toLowerCase()
        );
      } else {
        // Select feature: append actual API filter value (supports multiple selections)
        nextFeatures = [...currentFeatures, filterValue];
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

  if (!hasInitialResults) {
    return <PopularFeatureChipsSkeleton />;
  }

  // If no popular features have matching vehicles in current results, hide the chips container
  if (visibleTags.length === 0) {
    return null;
  }

  return (
    <div
      className="relative w-full pt-3 pb-1"
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
          {visibleTags.map((tag) => {
            const active = isFeatureActive(tag);
            const displayLabel = tag.label || tag.value;

            return (
              <button
                key={tag.label || tag.value}
                type="button"
                onClick={() => handleToggle(tag)}
                aria-pressed={active}
                className={`shrink-0 inline-flex items-center justify-center gap-1.5 whitespace-nowrap px-3 py-2 rounded-full text-xs sm:text-[13px] font-semibold leading-none cursor-pointer transition-all duration-150 ${
                  active
                    ? "bg-[#111827] text-white border border-[#111827] shadow-xs hover:bg-black"
                    : "bg-white text-gray-800 border border-gray-300 hover:border-gray-400 bg-gray-50 active:bg-gray-100"
                }`}
              >
                {tag.icon && (
                  <span
                    className={`inline-flex w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0 items-center justify-center ${
                      active ? "rounded-full bg-white p-0.5" : ""
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tag.icon}
                      alt=""
                      className={`h-full w-full object-contain transition-opacity ${
                        active ? "" : "opacity-80"
                      }`}
                      loading="lazy"
                    />
                  </span>
                )}
                <span>{displayLabel}</span>
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
