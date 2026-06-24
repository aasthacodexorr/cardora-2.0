"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, Settings2, X } from "lucide-react";

// Layout
import { Header, Footer } from "@/components/layout";

// Inventory components
import { HitCard } from "@/components/inventory";

// Shared components
import { GetInTouch } from "@/components/common";

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
    label: "Sort",
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

/* Custom Select styling using inline Sort / Alignment icon match */
const selectClasses = "px-4 py-1 tracking-wide rounded-[12px] border border-gray-300 bg-white text-black text-[14px] font-bold outline-none cursor-pointer h-[42px] transition-colors appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%3E%3Cpath%20d%3D%22M4%206h16M4%2012h14M4%2018h8%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.15em_1.15em] bg-[left_1.1rem_center] bg-no-repeat pl-10 pr-6 ";

type FilterGroupProps = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
};

const FilterGroup = ({
  title,
  children,
  isOpen,
  onToggle,
}: FilterGroupProps) => {
  return (
    <div className={`border-b border-border py-[7px] mb-0 last:border-b-0 first:border-t first:border-t-border transition-all duration-300 ${isOpen ? 'pb-4' : ''}`}>
      <button
        onClick={onToggle}
        className="w-full cursor-pointer"
      >
        <div className={`flex items-center justify-between rounded-[10px] px-[10px] py-[8px] transition-colors duration-200 hover:bg-gray-50 ${isOpen ? 'bg-gray-100' : ''}`}>
          <span className="text-[16px] font-medium text-[#000] tracking-[0.5px] text-left normal-case">
            {title}
          </span>
          <ChevronDown
            className={`h-[20px] w-[20px] text-foreground/70 transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : ""
              }`}
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

/* CustomHitsCount: shows total matching vehicles */
const CustomHitsCount = () => {
  const { results } = useHits();
  return (
    <span className="text-[13px] font-normal text-white leading-none uppercase p-0 tracking-tight">
      {results?.nbHits || 0} Matching Vehicles Found
    </span>
  );
};

const ScrollToTopOnSearch = () => {
  const { results } = useInstantSearch();
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [results?.__isArtificial, results?.nbHits]);

  return null;
};

/* NoResultsHandler: shows message when no hits */
const NoResultsHandler = ({ children }: { children: React.ReactNode }) => {
  const { results } = useHits();
  if (results && results.nbHits === 0) {
    return (
      <div className="mt-8 text-[15px] text-gray-800">
        {/* Currently, there are no vehicles that match your criteria. */}
      </div>
    );
  }
  return <>{children}</>;
};

/* CustomInfiniteHits: shows hits and a load more button */
const CustomInfiniteHits = ({ hitComponent: HitComponent }: any) => {
  const { hits, isLastPage, showMore } = useInfiniteHits();

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 lg:gap-0 lg:gap-y-[1px]">
        {hits.map((hit) => (
          <div key={hit.objectID} className="flex flex-col h-full p-[9px]">
            <HitComponent hit={hit} />
          </div>
        ))}
      </div>
      {!isLastPage && (
        <div className="mt-8 flex justify-start pl-[9px]">
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

/* Custom Grouped Refinements Component for precise visual hierarchy */
const GroupedCurrentRefinements = () => {
  const { items, refine } = useCurrentRefinements();

  if (items.length === 0) return null;

  return (
    <div className="w-full flex flex-wrap gap-y-2 gap-x-2 mt-2 mb-3">
      {items.map((category) => (
        <div 
          key={category.attribute} 
          className="flex flex-wrap items-center gap-[0.5px] bg-transparent"
        >
          {category.refinements.map((refinement) => (
            <div
              key={refinement.label}
              className="flex items-center bg-white rounded-lg px-[12px] py-[6px] border border-gray-200 text-[14px] text-gray-700 font-light shadow-sm"
            >
              <span className="cursor-pointer">{refinement.label}</span>
              <button
                onClick={() => refine(refinement)}
                className="text-gray-400 ml-2 hover:text-gray-950 focus:outline-none flex items-center justify-center"
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

const PriceRangeFilter = () => {
  const { start, range, refine } = useRange({
    attribute: "selling_price",
  });
  
  const { hits } = useHits();

  // 1. Keep the global absolute boundaries for the slider track
  const absoluteMin = range.min ?? 0;
  const absoluteMax = range.max ?? 100000;

  // Extract all current matching numeric prices from the loaded hits for the histogram distribution
  const currentPrices = hits
    .map((hit: any) => Number(hit.selling_price))
    .filter((price) => !isNaN(price))
    .sort((a, b) => a - b);

  const [minInput, setMinInput] = useState<string>("");
  const [maxInput, setMaxInput] = useState<string>("");

  // 2. Sync values correctly with current refinement states
  useEffect(() => {
    setMinInput(start[0] !== undefined ? String(start[0]) : String(absoluteMin));
    setMaxInput(start[1] !== undefined ? String(start[1]) : String(absoluteMax));
  }, [start, absoluteMin, absoluteMax]);

  // Generate histogram distribution bins based on current prices loaded
  const generateHistogramBins = () => {
    const binCount = 40; 
    const bins = Array(binCount).fill(0);
    if (currentPrices.length === 0) return bins;

    // Use absolute boundaries so bins don't shift positions when filtering
    const rangeDiff = absoluteMax - absoluteMin;
    if (rangeDiff === 0) {
      bins[0] = currentPrices.length;
      return bins;
    }

    currentPrices.forEach((price) => {
      let binIndex = Math.floor(((price - absoluteMin) / rangeDiff) * binCount);
      if (binIndex >= binCount) binIndex = binCount - 1;
      if (binIndex < 0) binIndex = 0;
      bins[binIndex]++;
    });

    const maxBinValue = Math.max(...bins);
    return bins.map((count) => (maxBinValue > 0 ? (count / maxBinValue) * 100 : 0));
  };

  const histogramBars = generateHistogramBins();

  const handleApply = () => {
    const minValue = minInput !== "" ? Number(minInput) : undefined;
    const maxValue = maxInput !== "" ? Number(maxInput) : undefined;
    refine([minValue, maxValue]);
  };

  const handleInputChange = (type: "min" | "max", value: string) => {
    if (type === "min") setMinInput(value);
    if (type === "max") setMaxInput(value);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, target: "min" | "max") => {
    const val = e.target.value;
    if (target === "min") {
      setMinInput(val);
      refine([Number(val), maxInput ? Number(maxInput) : undefined]);
    } else {
      setMaxInput(val);
      refine([minInput ? Number(minInput) : undefined, Number(val)]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleApply();
    }
  };

  // Percentages calculated against stable global boundaries
  const minPercent = absoluteMax !== absoluteMin ? ((Number(minInput || absoluteMin) - absoluteMin) / (absoluteMax - absoluteMin)) * 100 : 0;
  const maxPercent = absoluteMax !== absoluteMin ? ((Number(maxInput || absoluteMax) - absoluteMin) / (absoluteMax - absoluteMin)) * 100 : 100;

  return (
    <div className="pt-2 pb-4 select-none">
      <div className="mb-2 text-[13px] font-bold text-gray-700 uppercase tracking-wide">
        Price Range
      </div>

      {/* Input Boxes Grid */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="number"
          value={minInput}
          placeholder={String(absoluteMin)}
          onChange={(e) => handleInputChange("min", e.target.value)}
          onBlur={handleApply}
          onKeyDown={handleKeyDown}
          className="w-full h-[40px] px-3 border border-[#cfcfcf] rounded-[6px] text-[14px] font-medium outline-none text-center"
        />
        <span className="text-gray-400 font-medium">—</span>
        <input
          type="number"
          value={maxInput}
          placeholder={String(absoluteMax)}
          onChange={(e) => handleInputChange("max", e.target.value)}
          onBlur={handleApply}
          onKeyDown={handleKeyDown}
          className="w-full h-[40px] px-3 border border-[#cfcfcf] rounded-[6px] text-[14px] font-medium outline-none text-center"
        />
      </div>

      {/* Histogram bars visualization */}
      <div className="flex items-end h-[35px] gap-[1px] px-2 w-full select-none pointer-events-none mb-[-10px]">
        {histogramBars.map((heightPercent, idx) => {
          const stepValue = absoluteMin + ((absoluteMax - absoluteMin) / 40) * idx;
          const isSelected = stepValue >= Number(minInput || absoluteMin) && stepValue <= Number(maxInput || absoluteMax);
          return (
            <div
              key={idx}
              className="flex-1 transition-all duration-300"
              style={{
                height: `${Math.max(heightPercent, 8)}%`,
                backgroundColor: isSelected ? "#333333" : "#404142ff",
              }}
            />
          );
        })}
      </div>

      {/* Custom HTML Dual Multi-Range Slider */}
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
          min={absoluteMin}
          max={absoluteMax}
          value={minInput || absoluteMin}
          onChange={(e) => handleSliderChange(e, "min")}
          className="absolute pointer-events-none appearance-none w-full h-1 bg-transparent active:z-30 focus:outline-none
            [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:cursor-pointer"
        />
        <input
          type="range"
          min={absoluteMin}
          max={absoluteMax}
          value={maxInput || absoluteMax}
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
  const { start, refine } = useRange({
    attribute: "odometer",
  });
  const [error, setError] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  useStartSync(start, setMin, setMax, true);

  const handleApply = () => {
    const minValue = min ? Number(min) : undefined;
    const maxValue = max ? Number(max) : undefined;
    setError("");

    if (
      (minValue !== undefined && minValue < 400) ||
      (maxValue !== undefined && maxValue < 400)
    ) {
      setError("Odometer values must be at least 400");
      return;
    }

    if (
      minValue !== undefined &&
      maxValue !== undefined &&
      minValue > maxValue
    ) {
      setError("Minimum odometer cannot be greater than maximum odometer");
      return;
    }

    refine([minValue, maxValue]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleApply();
    }
  };

  return (
    <div className="pt-2 pb-4 relative">
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={400}
          value={min}
          onChange={(e) => setMin(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="400"
          className={`w-full h-[36px] px-3 border rounded-[3px] text-[14px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${error ? "border-red-500" : "border-[#cfcfcf]"
            }`}
        />
        <span className="text-[16px] text-gray-700">To</span>
        <input
          type="number"
          min={400}
          value={max}
          onChange={(e) => setMax(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Max"
          className={`w-full h-[36px] px-3 border rounded-[3px] text-[14px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${error ? "border-red-500" : "border-[#cfcfcf]"
            }`}
        />
        <button
          type="button"
          onClick={handleApply}
          className="h-[36px] px-4 bg-[#00AF66] text-white rounded-[4px] cursor-pointer"
        >
          Go
        </button>
      </div>
      {error && (
        <div className="mt-1 z-10 rounded px-2 py-1 text-[12px] text-black shadow-md">
          {error}
        </div>
      )}
    </div>
  );
}

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

/* InventoryContent: main page content */
const InventoryContent = () => {
  const [openFilter, setOpenFilter] = useState<string | null>("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileFilterOpen]);

  const renderFilterGroups = () => (
    <div className="space-y-[18px]">
      <FilterGroup
        title="Location"
        isOpen={openFilter === "LOCATION"}
        onToggle={() => setOpenFilter(openFilter === "LOCATION" ? null : "LOCATION")}
      >
        <RefinementList attribute="location" classNames={refinementListClassNames} />
      </FilterGroup>

      <FilterGroup
        title="Vehicle Type"
        isOpen={openFilter === "VEHICLE TYPE"}
        onToggle={() => setOpenFilter(openFilter === "VEHICLE TYPE" ? null : "VEHICLE TYPE")}
      >
        <RefinementList attribute="vehicle_type" classNames={refinementListClassNames} />
      </FilterGroup>

      <FilterGroup
        title="Price"
        isOpen={openFilter === "PRICE"}
        onToggle={() => setOpenFilter(openFilter === "PRICE" ? null : "PRICE")}
      >
        <PriceRangeFilter />
      </FilterGroup>

      <FilterGroup
        title="Year"
        isOpen={openFilter === "YEAR"}
        onToggle={() => setOpenFilter(openFilter === "YEAR" ? null : "YEAR")}
      >
        <RefinementList attribute="year" sortBy={["name:desc"]} classNames={refinementListClassNames} />
      </FilterGroup>

      <FilterGroup
        title="Make"
        isOpen={openFilter === "MAKE"}
        onToggle={() => setOpenFilter(openFilter === "MAKE" ? null : "MAKE")}
      >
        <RefinementList attribute="make" classNames={refinementListClassNames} />
      </FilterGroup>

      <FilterGroup
        title="Model"
        isOpen={openFilter === "MODEL"}
        onToggle={() => setOpenFilter(openFilter === "MODEL" ? null : "MODEL")}
      >
        <RefinementList attribute="model" classNames={refinementListClassNames} />
      </FilterGroup>

      <FilterGroup
        title="Odometer"
        isOpen={openFilter === "ODOMETER"}
        onToggle={() => setOpenFilter(openFilter === "ODOMETER" ? null : "ODOMETER")}
      >
        <OdometerRangeFilter />
      </FilterGroup>

      <FilterGroup
        title="Exterior Color"
        isOpen={openFilter === "EXTERIOR COLOR"}
        onToggle={() => setOpenFilter(openFilter === "EXTERIOR COLOR" ? null : "EXTERIOR COLOR")}
      >
        <RefinementList attribute="exterior_color" classNames={refinementListClassNames} />
      </FilterGroup>

      <FilterGroup
        title="Body Type"
        isOpen={openFilter === "BODY TYPE"}
        onToggle={() => setOpenFilter(openFilter === "BODY TYPE" ? null : "BODY TYPE")}
      >
        <RefinementList attribute="body_type" classNames={refinementListClassNames} />
      </FilterGroup>

      <FilterGroup
        title="Transmission"
        isOpen={openFilter === "TRANSMISSION"}
        onToggle={() => setOpenFilter(openFilter === "TRANSMISSION" ? null : "TRANSMISSION")}
      >
        <RefinementList attribute="transmission" classNames={refinementListClassNames} />
      </FilterGroup>

      <FilterGroup
        title="Fuel Type"
        isOpen={openFilter === "FUEL TYPE"}
        onToggle={() => setOpenFilter(openFilter === "FUEL TYPE" ? null : "FUEL TYPE")}
      >
        <RefinementList attribute="fuel_type" classNames={refinementListClassNames} />
      </FilterGroup>
    </div>
  );

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="bg-hero-bg">
        <Header />
      </div>

      <section className="w-full bg-[#efefef] flex-1">
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

          <div className="max-w-[1600px] mx-auto px-3 lg:px-[24px] pt-[20px] pb-[50px]">
            <div className="flex flex-col lg:flex-row items-start gap-5 lg:px-10">

              {/* Desktop Sidebar Filters Layout */}
              <aside className="hidden sticky top-[-180px] self-start shrink-0 lg:block bg-white border border-[#ddd] rounded-[15px] p-[15px] w-[290px] max-h-[calc(100vh-40px)] overflow-y-auto overscroll-contain">
                <div className="mt-[10px] flex flex-col items-center gap-4">
                  <div className="bg-[#00af66] text-white text-center py-3 px-4 rounded-xl font-bold text-[14px] w-full shadow-sm">
                    <CustomHitsCount />
                  </div>
                  <ClearRefinements
                    classNames={{
                      button: "text-[12px] mb-[15px] cursor-pointer font-bold text-black disabled:cursor-not-allowed",
                    }}
                    translations={{
                      resetButtonText: "Clear Filters",
                    }}
                  />
                </div>
                {renderFilterGroups()}
              </aside>

              {/* Mobile Sidebar overlay */}
              <div 
                className={`fixed inset-0 z-50 flex lg:hidden transition-opacity duration-300 ${
                  isMobileFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileFilterOpen(false)} />
                <div 
                  className={`relative flex w-full max-w-xs flex-col bg-white h-full shadow-xl ml-auto p-4 overflow-y-auto overscroll-contain transition-transform duration-300 ease-in-out ${
                    isMobileFilterOpen ? "translate-x-0" : "translate-x-full"
                  }`}
                >
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-4">
                    <h2 className="text-lg font-bold text-black tracking-wider">Filters</h2>
                    <button 
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                    >
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
                      translations={{
                        resetButtonText: "Clear Active Filters",
                      }}
                    />
                  </div>

                  <div className="flex-1">
                    {renderFilterGroups()}
                  </div>
                </div>
              </div>

              {/* Right Content */}
              <div className="w-full lg:flex-1 mt-5 lg:mt-0">

                {/* Search + sort + responsive control bar */}
                <div className="flex flex-col lg:flex-row lg:items-center items-end justify-between gap-4 px-3">
                  
                  {/* Search bar container */}
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

                  {/* Responsive Filters and Sorting Bar */}
                  <div className="w-full lg:w-auto flex items-center justify-between sm:justify-end gap-2 mt-1 lg:mt-0">
                    
                    {/* Filter Trigger button (Visible only on mobile/tablet) */}
                    <button
                      type="button"
                      onClick={() => setIsMobileFilterOpen(true)}
                      className="flex lg:hidden items-center justify-center gap-2 h-[42px] px-4 rounded-[12px] border border-[#ddd] bg-white text-black text-[14px] font-bold shadow-sm hover:bg-gray-50 transition-colors cursor-pointer shrink-0"
                    >
                      <Settings2 className="h-4 w-4" />
                      <span>Filters</span>
                    </button>

                    {/* Responsive Sort dropdown box setup */}
                    <div className="flex items-start">
                      <SortBy
                        items={sortItems}
                        classNames={{
                          select: `${selectClasses} w-[115px] sm:w-[130px]`,
                        }}
                      />
                    </div>

                  </div>
                </div>

                {/* Grouped custom current refinements layout wrapper */}
                <div className="px-3">
                  <GroupedCurrentRefinements />
                </div>

                {/* Results */}
                <div className="mb-4 mt-3">
                  <NoResultsHandler>
                    <CustomInfiniteHits hitComponent={HitCard} />
                  </NoResultsHandler>
                </div>

              </div>
            </div>
          </div>
        </InstantSearch>
      </section>

      <GetInTouch />
      <Footer />
    </main>
  );
};

/* Page export */
const InventoryPage = () => {
  return <InventoryContent />;
};

export default InventoryPage; 