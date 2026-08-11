"use client";

import { useState, useEffect, useLayoutEffect, useRef, useMemo } from "react";
import { Check, ChevronDown, ChevronUp, Search, Settings2, X } from "lucide-react";

// Layout
import { Header, Footer } from "@/components/layout";

// Inventory components
import { HitCard } from "@/components/inventory";

// Shared components
import { GetInTouch } from "@/components/common";

import { useSortBy } from "react-instantsearch";

// react-instantsearch
import {
  InstantSearch,
  SearchBox,
  RefinementList,
  Configure,
  useHits,
  useInfiniteHits,
  ClearRefinements,
  SortBy,
  useRange,
  useInstantSearch,
  useCurrentRefinements,
  useRefinementList,
} from "react-instantsearch";

import { getTypesenseClient } from "@/lib/typesense";

// Custom router/stateMapping that produces the client-required URL format
import { createInventoryRouter, createInventoryStateMapping, getModelMakeMap, setModelMakeMap } from "@/lib/inventoryRouting";
import { useAppConfig } from "@/app/providers";
import { InventoryGridSkeleton, InventoryLoadMoreSkeleton } from "@/components/inventory/HitCardSkeleton";
import { AD_CARDS } from "@/components/inventory/AdCard";
import { useDrawer } from "@/context/DrawerContext";

const AD_BLOCK_CYCLE = 6 + 7 + 8;
const AD_SLOT_TO_INDEX: Record<number, number> = { 6: 0, 13: 1, 0: 2 };

type DisplayItem =
  | { kind: "hit"; hit: any }
  | { kind: "ad"; adIndex: number; key: string };
  
type PlainIndexUiState = Record<string, any>;

function buildDisplayItems(hits: any[]): DisplayItem[] {
  const items: DisplayItem[] = [];
  let realCount = 0;

  hits.forEach((hit) => {
    items.push({ kind: "hit", hit });
    realCount += 1;

    const cyclePosition = realCount % AD_BLOCK_CYCLE;
    const adIndex = AD_SLOT_TO_INDEX[cyclePosition];
    if (adIndex !== undefined) {
      items.push({ kind: "ad", adIndex, key: `ad-${realCount}` });
    }
  });

  return items;
}

/* Shared class name configs for InstantSearch widgets */
const refinementListClassNames = {
  list: "space-y-2 pt-2 pb-4 p-0",
  label:
    "flex items-center gap-3 cursor-pointer text-[16px] text-gray-900 transition-colors",
  checkbox:
    "appearance-none h-[18px] w-[18px] rounded-[4px] border border-gray-800 bg-white checked:border-transparent checked:bg-transparent checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22%2300AF66%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%22%2F%3E%3C%2Fsvg%3E')] checked:bg-center checked:bg-no-repeat checked:bg-[length:20px_20px] focus:ring-0 cursor-pointer",
  labelText: "flex-1",
  count:
    "text-gray-900 font-bold px-[8px] py-[2px] rounded-md text-[11px] ml-auto",
};

/* Shared Sort Options array to match your visual requirement */
const getSortItems = (collectionName: string) => [
  {
    label: "Recently Added",
    value: `${collectionName}/sort/status_rank:asc,created_at:desc`,
  },
  {
    label: "Price (Low to High)",
    value: `${collectionName}/sort/status_rank:asc,selling_price:asc`,
  },
  {
    label: "Price (High to Low)",
    value: `${collectionName}/sort/status_rank:asc,selling_price:desc`,
  },
  {
    label: "Odometer (Low to High)",
    value: `${collectionName}/sort/status_rank:asc,odometer:asc`,
  },
  {
    label: "Odometer (High to Low)",
    value: `${collectionName}/sort/status_rank:asc,odometer:desc`,
  },
  {
    label: "Make (A - Z)",
    value: `${collectionName}/sort/status_rank:asc,make_rank:asc`,
  },
  {
    label: "Make (Z - A)",
    value: `${collectionName}/sort/status_rank:asc,make_rank:desc`,
  },
  {
    label: "Model (A - Z)",
    value: `${collectionName}/sort/status_rank:asc,model_rank:asc`,
  },
  {
    label: "Model (Z - A)",
    value: `${collectionName}/sort/status_rank:asc,model_rank:desc`,
  },
  {
    label: "Year (Low to High)",
    value: `${collectionName}/sort/status_rank:asc,year:desc`,
  },
  {
    label: "Year (High to Low)",
    value: `${collectionName}/sort/status_rank:asc,year:asc`,
  },
  {
    label: "Image Count (Low to High)",
    value: `${collectionName}/sort/status_rank:asc,image_count:asc`,
  },
  {
    label: "Image Count (High to Low)",
    value: `${collectionName}/sort/status_rank:asc,image_count:desc`,
  },
];

const selectClasses = "px-4 py-1 tracking-wide rounded-[12px] border border-gray-300 bg-white text-black text-[14px] font-bold outline-none cursor-pointer h-[42px] transition-colors appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%3E%3Cpath%20d%3D%22M4%206h16M4%2012h14M4%2018h8%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.15em_1.15em] bg-[left_1.1rem_center] bg-no-repeat pl-10 pr-6 ";

type FilterGroupProps = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
};

const FilterGroup = ({ title, children, isOpen, onToggle }: FilterGroupProps) => {
  return (
    <div className={`border-b border-border py-[7px] mb-0 last:border-b-0 first:border-t first:border-t-border transition-all duration-300 ${isOpen ? "pb-4" : ""}`}>
      <button onClick={onToggle} className="w-full cursor-pointer">
        <div className={`flex items-center justify-between rounded-[10px] px-[10px] py-[8px] transition-colors duration-200 hover:bg-gray-50 ${isOpen ? "bg-gray-100" : ""}`}>
          <span className="text-[16px] font-medium tracking-[0.5px] text-left normal-case">
            {title}
          </span>
          <ChevronDown
            className={`h-[20px] w-[20px] text-foreground/70 transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen
          ? "grid-rows-[1fr] opacity-100 mt-3 px-[10px]"
          : "grid-rows-[0fr] opacity-0 mt-0 px-[10px]"
          }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-2">{children}</div>
        </div>
      </div>
    </div>
  );
};

const SearchResultsWrapper = ({ children }: { children: React.ReactNode }) => {
  const { status } = useInstantSearch();
  const { results } = useHits();

  // Cache the last known non-null, REAL hit count so a transient
  // undefined/artificial result between refinements doesn't flicker.
  const lastNbHitsRef = useRef(0);
  if (typeof results?.nbHits === "number" && !results?.__isArtificial) {
    lastNbHitsRef.current = results.nbHits;
  }
  const hasHits = lastNbHitsRef.current > 0;

  // ── NEW: only flip this once we've received a genuine first response
  // (idle status + a non-artificial results object). Using state (not a
  // ref) guarantees React re-renders the moment this becomes true.
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    if (!isHydrated && status === "idle" && results && !results.__isArtificial) {
      setIsHydrated(true);
    }
  }, [status, results, isHydrated]);

  const showSkeleton = (!isHydrated || status === "stalled") && !hasHits;

  if (showSkeleton) {
    return <InventoryGridSkeleton />;
  }

  return <>{children}</>;
};

const CustomHitsCount = () => {
  const { results } = useHits();
  return (
    <span className="text-[13px] font-normal text-white leading-none uppercase p-0 tracking-tight">
      {results?.nbHits || 0} Matching Vehicles Found
    </span>
  );
};

const ScrollToTopOnSearch = () => {
  const { indexUiState } = useInstantSearch();
  const firstLoad = useRef(true);
  const prevSignatureRef = useRef<string>("");

  useEffect(() => {
    // Ignore pagination-only updates (infinite scroll). Safari is especially
    // sensitive to scrollTo(0) while the user is mid-feed.
    const { page: _page, ...searchCriteria } = (indexUiState || {}) as PlainIndexUiState;
    const signature = JSON.stringify(searchCriteria);

    if (firstLoad.current) {
      firstLoad.current = false;
      prevSignatureRef.current = signature;
      return;
    }

    if (signature === prevSignatureRef.current) return;
    prevSignatureRef.current = signature;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [indexUiState]);

  return null;
};

const NoResultsHandler = ({ children }: { children: React.ReactNode }) => {
  const { results } = useInstantSearch();

  if (!results?.__isArtificial && results?.nbHits === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-32 text-center w-full min-h-[350px]">
        <p className="mt-3 max-w-md text-gray-500 font-medium">
          Currently, there are no vehicles that match your criteria.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

const LOAD_MORE_SHIMMER_MIN_MS = 450;

const CustomInfiniteHits = ({ hitComponent: HitComponent }: any) => {
  const { status } = useInstantSearch();
  const { hits, isLastPage, showMore } = useInfiniteHits();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const loadingMoreRef = useRef(false);
  const preservedScrollYRef = useRef<number | null>(null);
  const cachedHitsRef = useRef(hits);
  const hitsLengthBeforeLoadRef = useRef(hits.length);
  const loadStartedAtRef = useRef(0);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // idle → loading (shimmer) → revealing (soft fade-in cards)
  const [loadPhase, setLoadPhase] = useState<"idle" | "loading" | "revealing">("idle");
  const [revealFromIndex, setRevealFromIndex] = useState<number | null>(null);

  if (hits.length > 0) {
    cachedHitsRef.current = hits;
  }
  const stableHits =
    hits.length > 0
      ? hits
      : loadPhase !== "idle"
        ? cachedHitsRef.current
        : hits;

  const settled = status === "idle";
  const showSkeleton = status === "stalled" && stableHits.length === 0;
  const hasAppendedPage = hits.length > hitsLengthBeforeLoadRef.current;
  // Keep shimmer mounted until min duration so Safari can paint the animation.
  const showLoadMoreShimmer = loadPhase === "loading";
  const isLoadMoreBusy = loadPhase !== "idle";

  useEffect(() => {
    return () => {
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (loadPhase !== "loading") return;
    if (!hasAppendedPage && !settled) return;

    const elapsed = Date.now() - loadStartedAtRef.current;
    const wait = Math.max(0, LOAD_MORE_SHIMMER_MIN_MS - elapsed);

    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    revealTimerRef.current = setTimeout(() => {
      // Soft handoff: swap shimmer → cards, then let opacity ease in.
      setLoadPhase("revealing");
      loadingMoreRef.current = false;
      hitsLengthBeforeLoadRef.current = hits.length;

      revealTimerRef.current = setTimeout(() => {
        setLoadPhase("idle");
        setRevealFromIndex(null);
        preservedScrollYRef.current = null;
      }, 480);
    }, wait);
  }, [loadPhase, hasAppendedPage, settled, hits.length]);

  // One-shot Safari guard: only fix a clear jump UP, never fight normal scroll.
  useLayoutEffect(() => {
    if (loadPhase !== "loading" && loadPhase !== "revealing") return;
    const y = preservedScrollYRef.current;
    if (y == null) return;
    if (window.scrollY < y - 80) {
      window.scrollTo(0, y);
    }
  }, [loadPhase, hasAppendedPage]);

  const handleShowMore = () => {
    if (loadingMoreRef.current || isLastPage || !settled || isLoadMoreBusy) return;
    loadingMoreRef.current = true;
    hitsLengthBeforeLoadRef.current = hits.length;
    loadStartedAtRef.current = Date.now();
    setRevealFromIndex(hits.length);
    preservedScrollYRef.current = window.scrollY;
    setLoadPhase("loading");
    showMore();
  };

  useEffect(() => {
    if (isLastPage || isLoadMoreBusy || !settled) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) handleShowMore();
      },
      { root: null, rootMargin: "350px" }
    );
    const current = loadMoreRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLastPage, settled, stableHits.length, isLoadMoreBusy]);

  if (showSkeleton) {
    return <InventoryGridSkeleton />;
  }

  // Freeze previous page under shimmer; reveal full list only after data arrives.
  const visibleHits = showLoadMoreShimmer
    ? stableHits.slice(0, hitsLengthBeforeLoadRef.current || stableHits.length)
    : stableHits;
  const displayItems = buildDisplayItems(visibleHits);
  let hitOrdinal = -1;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 lg:gap-0 lg:gap-y-[1px]">
        {displayItems.map((item) => {
          if (item.kind === "hit") {
            hitOrdinal += 1;
            const isNew = revealFromIndex != null && hitOrdinal >= revealFromIndex;
            return (
              <div
                key={item.hit.objectID}
                className={[
                  "flex flex-col h-full p-[9px]",
                  isNew && loadPhase === "revealing" ? "animate-inventory-card-in" : "",
                ].join(" ")}
              >
                <HitComponent hit={item.hit} />
              </div>
            );
          }

          const AdComponent = AD_CARDS[item.adIndex];
          return (
            <div key={item.key} className="flex flex-col h-full p-[9px]">
              <AdComponent />
            </div>
          );
        })}

        {showLoadMoreShimmer && <InventoryLoadMoreSkeleton />}
      </div>

      {!isLastPage && !isLoadMoreBusy && (
        <div ref={loadMoreRef} aria-hidden style={{ height: 1 }} />
      )}
    </div>
  );
};
 
const PageFooter = () => {
  const { status } = useInstantSearch();
  const { hits, isLastPage } = useInfiniteHits();
 
  const shouldShowFooter = status === "idle" && isLastPage && hits.length > 0;

  if (!shouldShowFooter) return null;

  return (
    <div className="mt-12 transition-opacity duration-300 ease-in">
      <GetInTouch />
      <Footer />
    </div>
  );
};

const ClearFiltersButton = ({ mobile = false }: { mobile?: boolean }) => {
  const { items } = useCurrentRefinements();
  if (items.length === 0) return null;

  return (
    <ClearRefinements
      classNames={{
        button: mobile
          ? "w-full py-2 text-[12px] border border-gray-300 rounded-xl cursor-pointer font-bold text-black disabled:cursor-not-allowed text-center block bg-gray-50"
          : "text-[12px] mb-[15px] cursor-pointer font-bold text-black disabled:cursor-not-allowed",
      }}
      translations={{ resetButtonText: mobile ? "Clear Active Filters" : "Clear Filters" }}
    />
  );
};

const GroupedCurrentRefinements = () => {
  const { items, refine } = useCurrentRefinements();
  if (items.length === 0) return null;
  return (
    <div className="w-full flex flex-wrap gap-y-2 gap-x-2">
      {items.map((category) => (
        <div key={category.attribute} className="flex flex-wrap items-center gap-[0.5px] bg-transparent">
          {category.refinements.map((refinement) => (
            <div
              key={refinement.label}
              className="flex items-center bg-white rounded-lg px-[12px] py-[6px] border border-gray-200 text-[14px] text-gray-600 font-light shadow-sm"
            >
              <span className="cursor-pointer tracking-wider font-light">{refinement.label}</span>
              <button
                onClick={() => refine(refinement)}
                className="ml-2 hover:text-gray-950 focus:outline-none flex items-center justify-center cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const MakeRefinementList = () => {
  const { items: currentRefinements, refine } = useCurrentRefinements();

  const {
    items: makeItems,
    refine: refineMake,
  } = useRefinementList({
    attribute: "make",
    limit: 200,
    sortBy: ["name:asc"],
  });

  const {
    items: modelItems,
    refine: refineModel,
  } = useRefinementList({
    attribute: "model",
    limit: 200,
    sortBy: ["name:asc"],
  });
  const handleToggle = (item: typeof makeItems[number]) => {
    const make = item.value as string;

    if (item.isRefined) {
      // When removing a make, also remove all associated models
      const modelMakeMap = getModelMakeMap();

      // Get all models that are currently refined and belong to this make
      const modelsToRemove = modelItems.filter(
        (m) => m.isRefined && modelMakeMap.get(m.value as string) === make
      );

      // Remove associated models first
      modelsToRemove.forEach((model) => {
        refineModel(model.value as string);
      });

      // Then remove the make
      refineMake(make);
      return;
    }

    refineMake(make);
  };

  return (
  <ul
    className={`
    ${refinementListClassNames.list}
    max-h-[300px]
    overflow-y-auto
    pr-2
    [&::-webkit-scrollbar]:w-[5px]
    [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:bg-gray-300
    [&::-webkit-scrollbar-thumb]:rounded-full
    lg:[scrollbar-width:thin]
  `}
  >
    {makeItems.map((item) => (
      <li key={item.value}>
        <label className={refinementListClassNames.label}>
          <input
            type="checkbox"
            checked={item.isRefined}
            onChange={() => handleToggle(item)}
            className={refinementListClassNames.checkbox}
          />

          <span className={refinementListClassNames.labelText}>
            {item.label}
          </span>

          <span className={refinementListClassNames.count}>
            {item.count}
          </span>
        </label>
      </li>
    ))}
  </ul>
);
};


const ModelRefinementList = () => {
  const {
    items: makeItems,
    refine: refineMake,
  } = useRefinementList({
    attribute: "make",
  });

  const {
    items: modelItems,
    refine: refineModel,
  } = useRefinementList({
    attribute: "model",
  });

  const selectedMakes = useMemo(
    () =>
      new Set(
        makeItems
          .filter((item) => item.isRefined)
          .map((item) => item.value as string)
      ),
    [makeItems]
  );

  const handleToggle = (item: typeof modelItems[number]) => {
    const model = item.value as string;
    const make = getModelMakeMap().get(model);

    // Selecting a model
    if (!item.isRefined) {
      if (make && !selectedMakes.has(make)) {
        refineMake(make);
      }

      refineModel(model);
      return;
    }

    // Deselecting a model
    refineModel(model);
  };

  return (
    <ul className={refinementListClassNames.list}>
      {modelItems.map((item) => (
        <li key={item.value}>
          <label className={refinementListClassNames.label}>
            <input
              type="checkbox"
              checked={item.isRefined}
              onChange={() => handleToggle(item)}
              className={refinementListClassNames.checkbox}
            />

            <span className={refinementListClassNames.labelText}>
              {item.label}
            </span>

            <span className={refinementListClassNames.count}>
              {item.count}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
};

const CustomSortBy = ({ sortItems }: { sortItems: { label: string, value: string }[] }) => {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentRefinement, refine } = useSortBy({
    items: sortItems,
  });
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      setOpen(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={selectClasses}
      >
        Sort
      </button>

      {open && (
        <div className="absolute top-full max-h-[450px] overflow-y-auto overscroll-contain right-0 mt-2 w-60 rounded-lg bg-white border border-slate-200 shadow-lg z-50">
          {sortItems?.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                refine(item.value);
                setOpen(false);
              }}
              className={`flex w-full items-start cursor-pointer text-black/70 justify-between px-2 py-3 hover:bg-gray-100 border-b border-slate-200 ${currentRefinement === item.value
                ? "font-semibold"
                : ""
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


const PriceRangeFilter = () => {
  const { start, range, refine } = useRange({ attribute: "selling_price" });
  const { hits } = useHits();

  // Cache price calculations so they don't block the UI threads
  const currentPrices = useMemo(() => {
    return hits
      .map((hit: any) => Number(hit.selling_price))
      .filter((price) => !isNaN(price) && price > 0)
      .sort((a, b) => a - b);
  }, [hits]);

  const dynamicMin = range.min ?? 0;
  const dynamicMax = range.max ?? 100000;

  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");
  const [selectedMin, setSelectedMin] = useState(dynamicMin);
  const [selectedMax, setSelectedMax] = useState(dynamicMax);

  // ── NEW: Track if the user is actively dragging a slider track ──
  const isDragging = useRef(false);

  // Sync server changes to local state ONLY if the user isn't touching the slider
  useEffect(() => {
    if (isDragging.current) return;

    const min =
      typeof start?.[0] === "number" && Number.isFinite(start[0])
        ? start[0]
        : dynamicMin;

    const max =
      typeof start?.[1] === "number" && Number.isFinite(start[1])
        ? start[1]
        : dynamicMax;

    setSelectedMin(min);
    setSelectedMax(max);
    setMinInput(String(min));
    setMaxInput(String(max));
  }, [dynamicMin, dynamicMax, start]);

  const handleApply = () => {
    const minValue = minInput !== "" ? Math.max(Number(minInput), dynamicMin) : dynamicMin;
    const maxValue = maxInput !== "" ? Math.min(Number(maxInput), dynamicMax) : dynamicMax;

    refine([
      minValue > dynamicMin ? minValue : undefined,
      maxValue < dynamicMax ? maxValue : undefined,
    ]);
  };

  const handleInputChange = (type: "min" | "max", value: string) => {
    if (type === "min") setMinInput(value);
    else setMaxInput(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleApply();
  };

  const safeSelectedMin = Number.isFinite(selectedMin) ? selectedMin : dynamicMin;
  const safeSelectedMax = Number.isFinite(selectedMax) ? selectedMax : dynamicMax;

  const minPercent =
    dynamicMax > dynamicMin ? ((safeSelectedMin - dynamicMin) / (dynamicMax - dynamicMin)) * 100 : 0;
  const maxPercent =
    dynamicMax > dynamicMin ? ((safeSelectedMax - dynamicMin) / (dynamicMax - dynamicMin)) * 100 : 100;

  // Shared completion function when releasing handles
  const handleCommitChange = (currentMin: number, currentMax: number) => {
    isDragging.current = false;
    refine([
      currentMin > dynamicMin ? currentMin : undefined,
      currentMax < dynamicMax ? currentMax : undefined,
    ]);
  };

  return (
    <div className="pt-2 pb-4 select-none">
      {/* Input Boxes */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="number"
          value={minInput}
          placeholder={String(dynamicMin)}
          min={dynamicMin}
          max={dynamicMax}
          onChange={(e) => handleInputChange("min", e.target.value)}
          onBlur={handleApply}
          onKeyDown={handleKeyDown}
          className="w-full h-[40px] px-3 border border-border-lightGray rounded-[6px] text-[14px] font-medium outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="text-gray-400 font-medium">—</span>
        <input
          type="number"
          value={maxInput}
          placeholder={String(dynamicMax)}
          min={dynamicMin}
          max={dynamicMax}
          onChange={(e) => handleInputChange("max", e.target.value)}
          onBlur={handleApply}
          onKeyDown={handleKeyDown}
          className="w-full h-[40px] px-3 border border-border-lightGray rounded-[6px] text-[14px] font-medium outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>

      {/* Slider Bars Track */}
      <div className="relative w-full h-7 flex items-center mt-2">
        <div className="absolute left-0 right-0 h-[3px] bg-gray-200 rounded-full" />
        <div
          className="absolute h-[3px] bg-black rounded-full"
          style={{
            left: `${Math.max(0, Math.min(minPercent, 100))}%`,
            right: `${100 - Math.max(0, Math.min(maxPercent, 100))}%`,
          }}
        />

        {/* Minimum Slider Handle */}
        <input
          type="range"
          min={dynamicMin}
          max={dynamicMax}
          value={selectedMin}
          onMouseDown={() => { isDragging.current = true; }}
          onTouchStart={() => { isDragging.current = true; }}
          onChange={(e) => {
            const val = Number(e.target.value);
            const value = Math.max(dynamicMin, Math.min(val, selectedMax));
            setSelectedMin(value);
            setMinInput(String(value));
          }}
          onMouseUp={() => handleCommitChange(selectedMin, selectedMax)}
          onTouchEnd={() => handleCommitChange(selectedMin, selectedMax)}
          className="absolute pointer-events-none appearance-none w-full h-1 bg-transparent active:z-30 focus:outline-none
            [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:cursor-pointer"
        />

        {/* Maximum Slider Handle */}
        <input
          type="range"
          min={dynamicMin}
          max={dynamicMax}
          value={selectedMax}
          onMouseDown={() => { isDragging.current = true; }}
          onTouchStart={() => { isDragging.current = true; }}
          onChange={(e) => {
            const val = Number(e.target.value);
            const value = Math.min(dynamicMax, Math.max(val, selectedMin));
            setSelectedMax(value);
            setMaxInput(String(value));
          }}
          onMouseUp={() => handleCommitChange(selectedMin, selectedMax)}
          onTouchEnd={() => handleCommitChange(selectedMin, selectedMax)}
          className="absolute pointer-events-none appearance-none w-full h-1 bg-transparent active:z-30 focus:outline-none
            [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>
    </div>
  );
};


const OdometerRangeFilter = () => {
  const { start, refine } = useRange({ attribute: "odometer" });
  const [error, setError] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const lastAppliedRange = useRef<readonly [number | undefined, number | undefined]>([undefined, undefined]);

  useEffect(() => {
    const nextMin = start[0] ?? lastAppliedRange.current[0];
    const nextMax = start[1] ?? lastAppliedRange.current[1];
    setMin(nextMin === undefined ? "" : String(nextMin));
    setMax(nextMax === undefined ? "" : String(nextMax));
  }, [start]);

  const handleApply = () => {
    const minValue = min ? Number(min) : undefined;
    const maxValue = max ? Number(max) : undefined;
    setError("");
    if ((minValue !== undefined && minValue < 400) || (maxValue !== undefined && maxValue < 400)) {
      setError("Odometer values must be at least 400");
      return;
    }
    if (minValue !== undefined && maxValue !== undefined && minValue > maxValue) {
      setError("Minimum odometer cannot be greater than maximum odometer");
      return;
    }
    lastAppliedRange.current = [minValue, maxValue];
    refine([minValue, maxValue]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleApply();
  };

  return (
    <div className="pt-2 pb-4 relative">
      <div className="flex items-center gap-2">
        <input type="number" min={400} value={min} onChange={(e) => setMin(e.target.value)}
          onKeyDown={handleKeyDown} placeholder="400"
          className={`w-full h-[36px] px-3 border rounded-[3px] text-[14px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${error ? 'border-red-500' : 'border-border-lightGray'}`}
        />
        <span className="text-[16px] text-gray-700">To</span>
        <input type="number" min={400} value={max} onChange={(e) => setMax(e.target.value)}
          onKeyDown={handleKeyDown} placeholder="Max"
          className={`w-full h-[36px] px-3 border rounded-[3px] text-[14px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${error ? 'border-red-500' : 'border-border-lightGray'}`}
        />
        <button type="button" onClick={handleApply}
          className="h-[36px] px-4 text-white rounded-[4px] cursor-pointer bg-brand">
          Go
        </button>
      </div>
      {error && (
        <div className="mt-1 z-10 rounded px-2 py-1 text-[12px] text-black shadow-md">{error}</div>
      )}
    </div>
  );
};

// ── CHANGED: measure the Header height dynamically so the two-column layout
// fills exactly the remaining viewport without hardcoding a pixel offset.
function useHeaderHeight() {
  const [height, setHeight] = useState(96);
  useEffect(() => {
    const update = () => {
      const headers = document.querySelectorAll("header");
      const visible = Array.from(headers).find((h) => h.getBoundingClientRect().height > 0);
      if (visible) setHeight(visible.getBoundingClientRect().height);
    };
    update();

    const ro = new ResizeObserver(update);
    document.querySelectorAll("header").forEach((h) => ro.observe(h));
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);
  return height;
}

// 1. Create a tiny layout wrapper component that sits inside the InstantSearch context
const MainLayoutWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { results } = useInstantSearch();
  const hasNoResults = !results?.__isArtificial && results?.nbHits === 0;

  return (
    <main
      className={`bg-background ${hasNoResults ? "overflow-hidden h-screen" : "min-h-screen"}`}
    >
      {children}
    </main>
  );
};



const SyncModelMakeMap = () => {
  const { hits } = useHits();

  useEffect(() => {
    const existing = getModelMakeMap();
    const merged = new Map(existing);

    hits.forEach((hit: any) => {
      if (hit.model && hit.make) {
        merged.set(hit.model as string, hit.make as string);
      }
    });

    setModelMakeMap(Array.from(merged.entries()));
  }, [hits]);

  return null;
};

// Sync component to remove orphaned models when makes change
const SyncOrphanedModels = () => {
  const { items: makeItems } = useRefinementList({
    attribute: "make",
  });

  const { items: modelItems, refine: refineModel } = useRefinementList({
    attribute: "model",
  });

  useEffect(() => {
    const selectedMakes = new Set(
      makeItems
        .filter((item) => item.isRefined)
        .map((item) => item.value as string)
    );

    const modelMakeMap = getModelMakeMap();

    // Check each refined model to see if its make is still selected
    const modelsToRemove = modelItems.filter((model) => {
      if (!model.isRefined) return false;
      const make = modelMakeMap.get(model.value as string);
      // Remove if make is known but not in selectedMakes
      return make && !selectedMakes.has(make);
    });

    if (modelsToRemove.length > 0) {
      modelsToRemove.forEach((model) => {
        refineModel(model.value as string);
      });
    }
  }, [makeItems, modelItems, refineModel]);

  return null;
};

// 2. Your cleaned up, error-free InventoryContent Component
const InventoryContent = () => {
  const config = useAppConfig();
  const { isWishlistDrawerOpen } = useDrawer();
  const { searchClient, TYPESENSE_COLLECTION_NAME } = useMemo(() => getTypesenseClient(config), [config]);
  const router = useMemo(() => createInventoryRouter(config), [config]);
  const stateMapping = useMemo(() => createInventoryStateMapping(config), [config]);

  const [openFilter, setOpenFilter] = useState<string | null>("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const headerHeight = useHeaderHeight();

  const sidebarTop = headerHeight + 21;
  const sidebarMaxHeight = `calc(100vh - ${headerHeight + 50}px)`;

  // ── Scroll Management State ──
  const [showScrollTop, setShowScrollTop] = useState(false);
  const lastScrollY = useRef(0);
  const isVisible = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setShowScrollTop(current > 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // set correct state on mount too
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileFilterOpen]);

  // Blur search input when drawer opens
  useEffect(() => {
    const searchInput = document.querySelector('input[placeholder="Search for Anything"]') as HTMLInputElement;
    if (isWishlistDrawerOpen && searchInput === document.activeElement) {
      searchInput?.blur();
    }
  }, [isWishlistDrawerOpen]);

  // Apply CSS variables to RefinementList count badges and SearchBox
  useEffect(() => {
    const countBadges = document.querySelectorAll('.ais-RefinementList-count');
    countBadges.forEach((badge) => {
      (badge as HTMLElement).style.backgroundColor = "var(--color-background-green-card)";
    });

    // Apply styles to SearchBox input
    const searchInput = document.querySelector('input[placeholder="Search for Anything"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.style.borderColor = "var(--color-border-standard)";
      searchInput.style.color = "var(--color-text-primary)";
    }
  }, []);

  const renderFilterGroups = () => (
    <div className="space-y-[18px]">
      <FilterGroup title="LOCATION" isOpen={openFilter === "LOCATION"} onToggle={() => setOpenFilter(openFilter === "LOCATION" ? null : "LOCATION")}>
        <RefinementList attribute="location" classNames={refinementListClassNames} />
      </FilterGroup>
      <FilterGroup title="VEHICLE TYPE" isOpen={openFilter === "VEHICLE TYPE"} onToggle={() => setOpenFilter(openFilter === "VEHICLE TYPE" ? null : "VEHICLE TYPE")}>
        <RefinementList attribute="vehicle_type" classNames={refinementListClassNames} />
      </FilterGroup>
      <FilterGroup title="PRICE" isOpen={openFilter === "PRICE"} onToggle={() => setOpenFilter(openFilter === "PRICE" ? null : "PRICE")}>
        <PriceRangeFilter />
      </FilterGroup>
      <FilterGroup title="YEAR" isOpen={openFilter === "YEAR"} onToggle={() => setOpenFilter(openFilter === "YEAR" ? null : "YEAR")}>
        <RefinementList attribute="year" sortBy={["name:desc"]} classNames={refinementListClassNames} />
      </FilterGroup>
      <FilterGroup title="MAKE" isOpen={openFilter === "MAKE"} onToggle={() => setOpenFilter(openFilter === "MAKE" ? null : "MAKE")}>
        <MakeRefinementList />
      </FilterGroup>
      <FilterGroup title="MODEL" isOpen={openFilter === "MODEL"} onToggle={() => setOpenFilter(openFilter === "MODEL" ? null : "MODEL")}>
        <ModelRefinementList />
      </FilterGroup>
      <FilterGroup title="ODOMETER" isOpen={openFilter === "ODOMETER"} onToggle={() => setOpenFilter(openFilter === "ODOMETER" ? null : "ODOMETER")}>
        <OdometerRangeFilter />
      </FilterGroup>
      <FilterGroup title="EXTERIOR COLOR" isOpen={openFilter === "EXTERIOR COLOR"} onToggle={() => setOpenFilter(openFilter === "EXTERIOR COLOR" ? null : "EXTERIOR COLOR")}>
        <RefinementList attribute="exterior_color" classNames={refinementListClassNames} />
      </FilterGroup>
      <FilterGroup title="BODY TYPE" isOpen={openFilter === "BODY TYPE"} onToggle={() => setOpenFilter(openFilter === "BODY TYPE" ? null : "BODY TYPE")}>
        <RefinementList attribute="body_type" classNames={refinementListClassNames} />
      </FilterGroup>
      <FilterGroup title="TRANSMISSION" isOpen={openFilter === "TRANSMISSION"} onToggle={() => setOpenFilter(openFilter === "TRANSMISSION" ? null : "TRANSMISSION")}>
        <RefinementList attribute="transmission" classNames={refinementListClassNames} />
      </FilterGroup>
      <FilterGroup title="FUEL TYPE" isOpen={openFilter === "FUEL TYPE"} onToggle={() => setOpenFilter(openFilter === "FUEL TYPE" ? null : "FUEL TYPE")}>
        <RefinementList attribute="fuel_type" classNames={refinementListClassNames} />
      </FilterGroup>
    </div>
  );

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={TYPESENSE_COLLECTION_NAME}
      routing={{
        router,
        stateMapping,
      }}
       stalledSearchDelay={300}
    >
      <SyncModelMakeMap/>
      <SyncOrphanedModels/>
      <ScrollToTopOnSearch />
      <Configure hitsPerPage={21} />

      {/* Put the layout wrapper here, safe inside InstantSearch context! */}
      <MainLayoutWrapper>
        {/* ── Header ── */}
        <div className="w-full bg-hero-bg">
          <Header />
          <div className="hidden lg:block" style={{ height: headerHeight }} aria-hidden />
        </div>

        {/* ── Two-column layout (sidebar sits outside results bg so it slides under header) ── */}
        <div className="bg-light-gray lg:-mt-4 min-h-screen px-3 lg:px-14 py-[20px] overflow-visible">
          <div className="flex flex-col lg:flex-row items-start max-w-[1550px] mx-auto gap-5 overflow-visible">
            <aside
              className={[
                "hidden",
                "lg:flex lg:flex-col lg:shrink-0 lg:w-[320px]",
                "2xl:w-[360px]",
                "lg:sticky lg:self-start lg:z-30",
              ].join(" ")}
              style={{ top: sidebarTop, maxHeight: sidebarMaxHeight, contain: "layout paint" }}
            >
             <div
  className="flex flex-col bg-white rounded-[15px] border border-border-standard overflow-hidden w-full"
  style={{ maxHeight: sidebarMaxHeight }}
>
  {/* Everything below (hit count, clear filters, filter groups) now lives
      inside ONE scrollable container — nothing stays fixed while scrolling. */}
  <div
    className={[
      "flex-1 min-h-0 overflow-y-auto overscroll-contain px-[15px] pt-[15px] pb-[15px]",
      // visible thin scrollbar instead of the hidden one
      "[&::-webkit-scrollbar]:w-[6px]",
      "[&::-webkit-scrollbar-track]:bg-transparent",
      "[&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full",
      "lg:[scrollbar-width:thin]",
    ].join(" ")}
  >
    <div className="flex flex-col items-center gap-4 pb-0">
      <div className="text-white text-center py-3 px-4 rounded-xl font-bold text-[14px] w-full shadow-sm bg-brand">
        <CustomHitsCount />
      </div>
      <ClearFiltersButton />
    </div>

    {renderFilterGroups()}
  </div>
</div>
            </aside>

            {/* ── Results Column ── */}
            <div id="results-column" className="w-full flex-1 mt-3 min-w-0 min-h-screen">

              {/* ── Search + Sort bar (sticky below header) ── */}
              <div className="sticky z-40 px-4 py-2 bg-light-gray">
                <div className="flex flex-col lg:flex-row lg:items-center items-end justify-between gap-4">

                  <div className="fixed inset-x-0 z-50 pointer-events-none" style={{ top: sidebarTop + 26 }}>
                    <div className="max-w-[1550px] mx-auto px-3 lg:px-14">
                      <div className="flex justify-center lg:pl-[340px] 2xl:pl-[380px]">
                        <button
                          onClick={scrollToTop}
                          className={[
                            "pointer-events-auto cursor-pointer flex items-center gap-2 bg-[#222] hover:bg-black text-white text-[13px] font-bold px-5 py-2.5 rounded-full shadow-lg active:scale-95 transition-all duration-200",
                            "-translate-y-7 lg:translate-y-0",
                            showScrollTop
                              ? "opacity-100 scale-100 visible"
                              : "opacity-0 scale-95 invisible",
                          ].join(" ")}
                        >
                          <ChevronUp className="h-4 w-4" />
                          <span>Back to top</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Search Input Box */}
                  <div className="relative w-full lg:max-w-[440px]">
                    <SearchBox
                      classNames={{
                        root: "w-full",
                        form: "relative flex items-center",
                        input: "w-full pl-[36px] tracking-wide pr-4 py-[10px] rounded-[12px] shadow-none bg-white text-[14px] outline-none transition-all focus:border-gray-400",
                        submitIcon: "hidden",
                        resetIcon: "hidden",
                        loadingIcon: "hidden",
                      }}
                      placeholder="Search for Anything"
                      autoFocus={false}
                    />
                    <Search className="h-[20px] w-[18px] absolute left-2 top-1/2 -translate-y-1/2 text-black pointer-events-none" />
                  </div>

                  <div className="w-full lg:w-auto flex items-center justify-between sm:justify-end gap-2 mt-1 lg:mt-0">
                    <button
                      type="button"
                      onClick={() => setIsMobileFilterOpen(true)}
                      className="flex lg:hidden items-center justify-center gap-2 h-[42px] px-4 rounded-[12px] bg-white text-black text-[14px] font-bold shadow-sm hover:bg-gray-50 transition-colors cursor-pointer shrink-0 border border-border-standard"
                    >
                      <Settings2 className="h-4 w-4" />
                      <span>Filters</span>
                    </button>

                    <div className="flex items-start">
                      <CustomSortBy sortItems={getSortItems(TYPESENSE_COLLECTION_NAME)} />
                    </div>
                  </div>

                </div>
              </div>

              <div className="px-4">
                <GroupedCurrentRefinements />
              </div>

              <div className="mb-4  px-2">
                <SearchResultsWrapper>
                  <NoResultsHandler>
                    <CustomInfiniteHits hitComponent={HitCard} />
                  </NoResultsHandler>
                </SearchResultsWrapper>
              </div>
            </div>
          </div>

          {/* ── Common footer — spans the full width beneath BOTH the sidebar
              and the results column, once results have finished loading. ── */}
          <div className="max-w-[1550px] mx-auto">
            <PageFooter />
          </div>
        </div>

        {/* ── Mobile filter slide-in overlay ── */}
        <div className={`fixed inset-0 z-50 flex lg:hidden transition-opacity duration-300 ${isMobileFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileFilterOpen(false)} />
          <div className={`relative flex w-full max-w-xs flex-col bg-white h-full shadow-xl ml-auto p-4 overflow-y-auto overscroll-contain transition-transform duration-300 ease-in-out ${isMobileFilterOpen ? "translate-x-0" : "translate-x-full"}`}>
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-4">
              <h2 className="text-lg font-bold text-black tracking-wider">Filters</h2>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
                <X className="h-6 w-6" />
              </button>
            </div>
           <div className="mb-4">
  <div className="text-white text-center py-2.5 px-4 rounded-xl font-bold text-[13px] w-full shadow-sm mb-3 bg-brand">
    <CustomHitsCount />
  </div>
  <ClearFiltersButton mobile />
</div>
            <div className="flex-1">{renderFilterGroups()}</div>
          </div>
        </div>
      </MainLayoutWrapper>
    </InstantSearch>
  );
};

export const InventoryPage = () => <InventoryContent />;
export default InventoryPage;
