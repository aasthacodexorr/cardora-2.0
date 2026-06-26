"use client";

import { useState, useEffect, useRef } from "react";
import { Check, ChevronDown, Search, Settings2, X } from "lucide-react";

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
} from "react-instantsearch";

// Typesense search client
import { searchClient, TYPESENSE_COLLECTION_NAME } from "@/lib/typesense";

// Custom router/stateMapping that produces the client-required URL format
import { createInventoryRouter, inventoryStateMapping } from "@/lib/inventoryRouting";

/* Shared class name configs for InstantSearch widgets */
const refinementListClassNames = {
  list: "space-y-2 pt-2 pb-4 p-0",
  label:
    "flex items-center gap-3 cursor-pointer text-[16px] text-gray-900 transition-colors",
  checkbox:
    "appearance-none h-[18px] w-[18px] rounded-[4px] border border-gray-800 bg-white checked:border-transparent checked:bg-transparent checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22%2300AF66%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%22%2F%3E%3C%2Fsvg%3E')] checked:bg-center checked:bg-no-repeat checked:bg-[length:20px_20px] focus:ring-0 cursor-pointer",
  labelText: "flex-1",
  count:
    "bg-[#e6f7ec] text-gray-900 font-bold px-[8px] py-[2px] rounded-md text-[11px] ml-auto",
};

/* Shared Sort Options array to match your visual requirement */
const sortItems = [
  {
    label: "Recently Added",
    value: `${TYPESENSE_COLLECTION_NAME}/sort/status_rank:asc,created_at:desc`,
  },
  {
    label: "Price (Low to High)",
    value: `${TYPESENSE_COLLECTION_NAME}/sort/selling_price:asc`,
  },
  {
    label: "Price (High to Low)",
    value: `${TYPESENSE_COLLECTION_NAME}/sort/selling_price:desc`,
  },
  {
    label: "Odometer (Low to High)",
    value: `${TYPESENSE_COLLECTION_NAME}/sort/odometer:asc`,
  },
  {
    label: "Odometer (High to Low)",
    value: `${TYPESENSE_COLLECTION_NAME}/sort/odometer:desc`,
  },
  {
    label: "Make (A - Z)",
    value: `${TYPESENSE_COLLECTION_NAME}/sort/make_rank:asc`,
  },
  {
    label: "Make (Z - A)",
    value: `${TYPESENSE_COLLECTION_NAME}/sort/make_rank:desc`,
  },
  {
    label: "Model (A - Z)",
    value: `${TYPESENSE_COLLECTION_NAME}/sort/model_rank:asc`,
  },
  {
    label: "Model (Z - A)",
    value: `${TYPESENSE_COLLECTION_NAME}/sort/model_rank:desc`,
  },
  {
    label: "Year (Low to High)",
    value: `${TYPESENSE_COLLECTION_NAME}/sort/year:desc`,
  },
  {
    label: "Year (High to Low)",
    value: `${TYPESENSE_COLLECTION_NAME}/sort/year:asc`,
  },
  {
    label: "Image Count (Low to High)",
    value: `${TYPESENSE_COLLECTION_NAME}/sort/image_count:asc`,
  },
  {
    label: "Image Count (High to Low)",
    value: `${TYPESENSE_COLLECTION_NAME}/sort/image_count:desc`,
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
          <span className="text-[16px] font-medium text-[#000] tracking-[0.5px] text-left normal-case">
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

const CustomHitsCount = () => {
  const { results } = useHits();
  return (
    <span className="text-[13px] font-normal text-white leading-none uppercase p-0 tracking-tight">
      {results?.nbHits || 0} Matching Vehicles Found
    </span>
  );
};

const ScrollToTopOnSearch = () => {
  // ── CHANGED ──────────────────────────────────────────────────────────────
  // Previously scrolled window to top. Now we scroll the results column
  // (identified by id="results-column") so only that pane resets, not the page.
  const { results } = useInstantSearch();
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    const resultsCol = document.getElementById("results-column");
    if (resultsCol) {
      resultsCol.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [results?.__isArtificial, results?.nbHits]);

  return null;
};

const NoResultsHandler = ({ children }: { children: React.ReactNode }) => {
  const { results } = useInstantSearch();

  if (!results?.__isArtificial && results?.nbHits === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="mt-3 max-w-md">
          Currently, there are no vehicles that match your criteria.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

const CustomInfiniteHits = ({ hitComponent: HitComponent }: any) => {
  const { hits, isLastPage, showMore } = useInfiniteHits();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isLastPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
         console.log("Intersecting:", entry.isIntersecting);

        if (entry.isIntersecting) {
           console.log("Calling showMore");
          showMore();
        }
      },
      {
        root: document.getElementById("results-column"),
        rootMargin: "250px",
      }
    );

    const current = loadMoreRef.current;

    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [isLastPage, showMore]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 lg:gap-0 lg:gap-y-[1px]">
        {hits.map((hit) => (
          <div key={hit.objectID} className="flex flex-col h-full p-[9px]">
            <HitComponent hit={hit} />
          </div>
        ))}
      </div>

      {/* Observer Target */}
      {!isLastPage && (
        <div ref={loadMoreRef}   style={{ height: 50 }}/>
      )}

      {!isLastPage && (
        <div className="mt-8 flex justify-start pl-[9px]" >
          <button
            onClick={showMore}
            className="bg-black text-white px-6 py-3 rounded-xl cursor-pointer font-medium text-[13px] uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            Show More Results
          </button>
        </div>
      )}
    </div>
  );
};

const GroupedCurrentRefinements = () => {
  const { items, refine } = useCurrentRefinements();
  if (items.length === 0) return null;
  return (
    <div className="w-full flex flex-wrap gap-y-2 gap-x-2 mt-2 mb-3">
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
                className="text-gray-400 ml-2 hover:text-gray-950 focus:outline-none flex items-center justify-center cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const CustomSortBy = () => {
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
  

  return (
    <div  ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={selectClasses}
      >
        Sort
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-60 rounded-lg bg-white border border-slate-200 shadow-lg z-50">
          {sortItems?.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                refine(item.value);
                setOpen(false);
              }}
              className={`flex w-full items-center cursor-pointer text-black/70 justify-between px-4 py-3 hover:bg-gray-100 border-b border-slate-200 ${currentRefinement === item.value
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
 
  const currentPrices = hits
    .map((hit: any) => Number(hit.selling_price))
    .filter((price) => !isNaN(price) && price > 0)
    .sort((a, b) => a - b);

  const dynamicMin = range.min ?? 0;
  const dynamicMax = range.max ?? 100000;

  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");
  const [selectedMin, setSelectedMin] = useState(dynamicMin);
  const [selectedMax, setSelectedMax] = useState(dynamicMax);
 
  useEffect(() => {
    const min =
      typeof start?.[0] === "number" &&
        Number.isFinite(start[0])
        ? start[0]
        : dynamicMin;

    const max =
      typeof start?.[1] === "number" &&
        Number.isFinite(start[1])
        ? start[1]
        : dynamicMax;

    setSelectedMin(min);
    setSelectedMax(max);

    setMinInput(String(min));
    setMaxInput(String(max));
  }, [dynamicMin, dynamicMax, start]);

  const generateHistogramBins = () => {
    const binCount = 40;
    const bins = Array(binCount).fill(0);
    if (currentPrices.length === 0) return bins;

    const rangeDiff = dynamicMax - dynamicMin;
    if (rangeDiff === 0) {
      bins[0] = currentPrices.length;
      return bins;
    }

    currentPrices.forEach((price) => {
      let binIndex = Math.floor(
        ((price - dynamicMin) / rangeDiff) * binCount
      );
      if (binIndex >= binCount) binIndex = binCount - 1;
      if (binIndex < 0) binIndex = 0;
      bins[binIndex]++;
    });

    const maxBinValue = Math.max(...bins);
    return bins.map((count) =>
      maxBinValue > 0 ? (count / maxBinValue) * 100 : 0
    );
  };


  const handleApply = () => {
    const minValue = minInput !== ""
      ? Math.max(Number(minInput), dynamicMin)
      : dynamicMin;
    const maxValue = maxInput !== ""
      ? Math.min(Number(maxInput), dynamicMax)
      : dynamicMax;

    refine([
      minValue > dynamicMin ? minValue : undefined,
      maxValue < dynamicMax ? maxValue : undefined,
    ]);
  };

  const handleInputChange = (type: "min" | "max", value: string) => {
    if (type === "min") setMinInput(value);
    else setMaxInput(value);
  };

  const handleSliderChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "min" | "max"
  ) => {
    const val = Number(e.target.value);

    if (target === "min") {
      const value = Math.max(
        dynamicMin,
        Math.min(val, selectedMax)
      );

      setSelectedMin(value);
      setMinInput(String(value));

      refine([
        value > dynamicMin ? value : undefined,
        selectedMax < dynamicMax ? selectedMax : undefined,
      ]);
    } if (target === "max") {
      const value = Math.min(
        dynamicMax,
        Math.max(val, selectedMin)
      );

      setSelectedMax(value);
      setMaxInput(String(value));

      refine([
        selectedMin > dynamicMin ? selectedMin : undefined,
        value < dynamicMax ? value : undefined,
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleApply();
  };


  const safeSelectedMin = Number.isFinite(selectedMin)
    ? selectedMin
    : dynamicMin;

  const safeSelectedMax = Number.isFinite(selectedMax)
    ? selectedMax
    : dynamicMax;

  const minPercent =
    dynamicMax > dynamicMin
      ? ((safeSelectedMin - dynamicMin) /
        (dynamicMax - dynamicMin)) *
      100
      : 0;

  const maxPercent =
    dynamicMax > dynamicMin
      ? ((safeSelectedMax - dynamicMin) /
        (dynamicMax - dynamicMin)) *
      100
      : 100;
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
          className="w-full h-[40px] px-3 border border-[#cfcfcf] rounded-[6px] text-[14px] font-medium outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
          className="w-full h-[40px] px-3 border border-[#cfcfcf] rounded-[6px] text-[14px] font-medium outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>

      <div className="relative w-full h-7 flex items-center mt-2">
        <div className="absolute left-0 right-0 h-[3px] bg-gray-200 rounded-full" />
        <div
          className="absolute h-[3px] bg-black rounded-full"
          style={{
            left: `${Math.max(0, Math.min(minPercent, 100))}%`,
            right: `${100 - Math.max(0, Math.min(maxPercent, 100))}%`,
          }}
        />

        <input
          type="range"
          min={dynamicMin}
          max={dynamicMax}
          value={selectedMin}
          onChange={(e) => handleSliderChange(e, "min")}
          className="absolute pointer-events-none appearance-none w-full h-1 bg-transparent active:z-30 focus:outline-none
            [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:cursor-pointer"
        />

        <input
          type="range"
          min={dynamicMin}
          max={dynamicMax}
          value={selectedMax}
          onChange={(e) => handleSliderChange(e, "max")}
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

  useStartSync(start, setMin, setMax, true);

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
          className={`w-full h-[36px] px-3 border rounded-[3px] text-[14px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${error ? "border-red-500" : "border-[#cfcfcf]"}`} />
        <span className="text-[16px] text-gray-700">To</span>
        <input type="number" min={400} value={max} onChange={(e) => setMax(e.target.value)}
          onKeyDown={handleKeyDown} placeholder="Max"
          className={`w-full h-[36px] px-3 border rounded-[3px] text-[14px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${error ? "border-red-500" : "border-[#cfcfcf]"}`} />
        <button type="button" onClick={handleApply}
          className="h-[36px] px-4 bg-[#00AF66] text-white rounded-[4px] cursor-pointer">
          Go
        </button>
      </div>
      {error && (
        <div className="mt-1 z-10 rounded px-2 py-1 text-[12px] text-black shadow-md">{error}</div>
      )}
    </div>
  );
};

function useStartSync(
  start: readonly [number | undefined, number | undefined],
  setMin: (v: any) => void,
  setMax: (v: any) => void,
  asStrings = false
) {
  useEffect(() => {
    if (asStrings) {
      setMin(start[0] !== undefined ? String(start[0]) : "");
      setMax(start[1] !== undefined ? String(start[1]) : "");
    } else {
      setMin(start[0] ?? "");
      setMax(start[1] ?? "");
    }
  }, [start[0], start[1]]);
}

// ── CHANGED: measure the Header height dynamically so the two-column layout
// fills exactly the remaining viewport without hardcoding a pixel offset.
function useHeaderHeight() {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const ro = new ResizeObserver(() => setHeight(header.getBoundingClientRect().height));
    ro.observe(header);
    return () => ro.disconnect();
  }, []);
  return height;
}

const InventoryContent = () => {
  const [openFilter, setOpenFilter] = useState<string | null>("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const headerHeight = useHeaderHeight();

  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileFilterOpen]);

  const renderFilterGroups = () => (
    <div className="space-y-[18px]">
      <FilterGroup title="LOCATION" isOpen={openFilter === "LOCATION"}
        onToggle={() => setOpenFilter(openFilter === "LOCATION" ? null : "LOCATION")}>
        <RefinementList attribute="location" classNames={refinementListClassNames} />
      </FilterGroup>
      <FilterGroup title="VEHICLE TYPE" isOpen={openFilter === "VEHICLE TYPE"}
        onToggle={() => setOpenFilter(openFilter === "VEHICLE TYPE" ? null : "VEHICLE TYPE")}>
        <RefinementList attribute="vehicle_type" classNames={refinementListClassNames} />
      </FilterGroup>
      <FilterGroup title="PRICE" isOpen={openFilter === "PRICE"}
        onToggle={() => setOpenFilter(openFilter === "PRICE" ? null : "PRICE")}>
        <PriceRangeFilter />
      </FilterGroup>
      <FilterGroup title="YEAR" isOpen={openFilter === "YEAR"}
        onToggle={() => setOpenFilter(openFilter === "YEAR" ? null : "YEAR")}>
        <RefinementList attribute="year" sortBy={["name:desc"]} classNames={refinementListClassNames} />
      </FilterGroup>
      <FilterGroup title="MAKE" isOpen={openFilter === "MAKE"}
        onToggle={() => setOpenFilter(openFilter === "MAKE" ? null : "MAKE")}>
        <RefinementList attribute="make" classNames={refinementListClassNames} />
      </FilterGroup>
      <FilterGroup title="MODEL" isOpen={openFilter === "MODEL"}
        onToggle={() => setOpenFilter(openFilter === "MODEL" ? null : "MODEL")}>
        <RefinementList attribute="model" classNames={refinementListClassNames} />
      </FilterGroup>
      <FilterGroup title="ODOMETER" isOpen={openFilter === "ODOMETER"}
        onToggle={() => setOpenFilter(openFilter === "ODOMETER" ? null : "ODOMETER")}>
        <OdometerRangeFilter />
      </FilterGroup>
      <FilterGroup title="EXTERIOR COLOR" isOpen={openFilter === "EXTERIOR COLOR"}
        onToggle={() => setOpenFilter(openFilter === "EXTERIOR COLOR" ? null : "EXTERIOR COLOR")}>
        <RefinementList attribute="exterior_color" classNames={refinementListClassNames} />
      </FilterGroup>
      <FilterGroup title="BODY TYPE" isOpen={openFilter === "BODY TYPE"}
        onToggle={() => setOpenFilter(openFilter === "BODY TYPE" ? null : "BODY TYPE")}>
        <RefinementList attribute="body_type" classNames={refinementListClassNames} />
      </FilterGroup>
      <FilterGroup title="TRANSMISSION" isOpen={openFilter === "TRANSMISSION"}
        onToggle={() => setOpenFilter(openFilter === "TRANSMISSION" ? null : "TRANSMISSION")}>
        <RefinementList attribute="transmission" classNames={refinementListClassNames} />
      </FilterGroup>
      <FilterGroup title="FUEL TYPE" isOpen={openFilter === "FUEL TYPE"}
        onToggle={() => setOpenFilter(openFilter === "FUEL TYPE" ? null : "FUEL TYPE")}>
        <RefinementList attribute="fuel_type" classNames={refinementListClassNames} />
      </FilterGroup>
    </div>
  );

  


  useEffect(() => {
  console.log(document.getElementById("results-column"));
}, []);

useEffect(() => {
  const el = document.getElementById("results-column");

  if (!el) return;

  console.log({
    scrollHeight: el.scrollHeight,
    clientHeight: el.clientHeight,
    overflow: getComputedStyle(el).overflowY,
  });
}, []);

  return (
    <main className="flex flex-col h-screen overflow-hidden bg-background lg:pt-30">

      {/* ── Header: fixed at the top, outside the scrolling area ── */}
      <div className="bg-hero-bg">
        <Header />
      </div>

      {/* ── Inventory section: fills all remaining vertical space ── */}
      {/* On mobile we revert to normal page scroll; on lg+ we clip overflow */}
      <section className="flex-1 min-h-0 bg-[#efefef] overflow-y-auto lg:overflow-hidden lg:px-14">
        <InstantSearch
          searchClient={searchClient}
          indexName={TYPESENSE_COLLECTION_NAME}
          routing={{
            router: createInventoryRouter(),
            stateMapping: inventoryStateMapping,
          }}
        >
          <ScrollToTopOnSearch />
          <Configure hitsPerPage={21} />

          <div className="lg:flex lg:h-full lg:overflow-hidden max-w-[1600px] mx-auto px-3 lg:px-[24px] lg:px-10 py-[20px] lg:py-0">
 
            <aside
              className={[
                "hidden",
                "lg:flex lg:flex-col",
                "lg:shrink-0 lg:w-[320px]",
                "lg:h-full lg:overflow-y-auto",
                "lg:py-[20px]",
                "[&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar-track]:hidden",
                "lg:[scrollbar-width:none] lg:[-ms-overflow-style:none]",
              ].join(" ")}
            >
              {/* Inner card — keeps the rounded white box look */}
              <div className="bg-white border border-[#ddd] rounded-[15px] p-[15px] flex-1">
                <div className="mt-[10px] flex flex-col items-center gap-4">
                  <div className="bg-[#00af66] text-white text-center py-3 px-4 rounded-xl font-bold text-[14px] w-full shadow-sm">
                    <CustomHitsCount />
                  </div>
                  <ClearRefinements
                    classNames={{
                      button: "text-[12px] mb-[15px] cursor-pointer font-bold text-black disabled:cursor-not-allowed",
                    }}
                    translations={{ resetButtonText: "Clear Filters" }}
                  />
                </div>
                {renderFilterGroups()}
              </div>
            </aside>
 
            <div
              id="results-column"
              className={[
                "w-full lg:flex-1",
                "lg:h-full lg:overflow-y-auto",
                "lg:pl-5 pt-[20px]",
                "[&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar-track]:hidden",
                "lg:[scrollbar-width:none] lg:[-ms-overflow-style:none]",
              ].join(" ")}
            >
              {/* Search + sort + responsive control bar */}
              <div className="flex flex-col lg:flex-row lg:items-center items-end justify-between gap-4 px-3">
                <div className="relative w-full lg:max-w-[440px]">
                  <SearchBox
                    classNames={{
                      root: "w-full",
                      form: "relative flex items-center",
                      input: "w-full pl-[36px] tracking-wide pr-4 py-[10px] rounded-[12px] border border-[#ddd] shadow-none bg-white text-[14px] text-[#000] outline-none transition-all",
                      submitIcon: "hidden",
                      resetIcon: "hidden",
                      loadingIcon: "hidden",
                    }}
                    placeholder="Search for Anything"
                  />
                  <Search className="h-[20px] w-[18px] absolute left-2 top-1/2 -translate-y-1/2 text-black pointer-events-none" />
                </div>

                <div className="w-full lg:w-auto flex items-center justify-between sm:justify-end gap-2 mt-1 lg:mt-0">
                  {/* Mobile filter trigger */}
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="flex lg:hidden items-center justify-center gap-2 h-[42px] px-4 rounded-[12px] border border-[#ddd] bg-white text-black text-[14px] font-bold shadow-sm hover:bg-gray-50 transition-colors cursor-pointer shrink-0"
                  >
                    <Settings2 className="h-4 w-4" />
                    <span>Filters</span>
                  </button>

                  <div className="flex items-start">
                    <CustomSortBy />           
                  </div>
                </div>
              </div>

              {/* Active refinement pills */}
              <div className="px-3">
                <GroupedCurrentRefinements />
              </div>

              {/* Results grid */}
              <div className="mb-4 mt-3 min-h-[800px]">
                <NoResultsHandler>
                  <CustomInfiniteHits hitComponent={HitCard} />
                </NoResultsHandler>
              </div>

              {/* Footer lives inside the results column so it scrolls with cards */}
              <GetInTouch />
              <Footer />
            </div>

          </div>

          {/* ── Mobile filter slide-in overlay (unchanged) ── */}
          <div
            className={`fixed inset-0 z-50 flex lg:hidden transition-opacity duration-300 ${isMobileFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
          >
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileFilterOpen(false)} />
            <div
              className={`relative flex w-full max-w-xs flex-col bg-white h-full shadow-xl ml-auto p-4 overflow-y-auto overscroll-contain transition-transform duration-300 ease-in-out ${isMobileFilterOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-4">
                <h2 className="text-lg font-bold text-black tracking-wider">Filters</h2>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="mb-4">
                <div className="bg-[#00af66] text-white text-center py-2.5 px-4 rounded-xl font-bold text-[13px] w-full shadow-sm mb-3">
                  <CustomHitsCount />
                </div>
                <ClearRefinements
                  classNames={{
                    button: "w-full py-2 text-[12px] border border-gray-300 rounded-xl cursor-pointer font-bold text-black disabled:cursor-not-allowed text-center block bg-gray-50",
                  }}
                  translations={{ resetButtonText: "Clear Active Filters" }}
                />
              </div>
              <div className="flex-1">{renderFilterGroups()}</div>
            </div>
          </div>

        </InstantSearch>
      </section>


    </main>
  );
};

const InventoryPage = () => <InventoryContent />;
export default InventoryPage;