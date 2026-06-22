/* =========================
   Inventory Page
   Vehicle listing page powered by react-instantsearch
   and Typesense. Features:
   - Left sidebar with smooth animated collapsible filter groups
   - Only one dropdown open at a time
   - Search box + sort-by dropdown
   - Active refinement chips (CurrentRefinements)
   - Responsive grid of HitCard results
   - URL-driven state via custom InstantSearch router:
     selected filters/search are written back into the URL in the
     client-required format, and reset whenever a fresh footer/home
     link is navigated to.
========================= */

"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search } from "lucide-react";

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
  CurrentRefinements,
  useRange,
  useInstantSearch,
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
    <div className="border-b border-border py-[7px] mb-0 last:border-b-0 first:border-t first:border-t-border">
      <button
        onClick={onToggle}
        className="w-full cursor-pointer"
      >
        <div className={`flex items-center justify-between rounded-[10px] px-[10px] py-[8px] transition-colors duration-200 hover:bg-gray-50 ${isOpen ? 'bg-gray-100' : ''}`}>

          <span className="text-[17px] font-normal text-[#000] uppercase tracking-[1px] text-left">
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
            ? "grid-rows-[1fr] opacity-100 mt-3"
            : "grid-rows-[0fr] opacity-0 mt-0"
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
    // Skip initial page load
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


const PriceRangeFilter = () => {
  const { start, range, refine } = useRange({
    attribute: "selling_price",
  });

  const [min, setMin] = useState(start[0] ?? "");
  const [max, setMax] = useState(start[1] ?? "");

  // Keep local inputs in sync whenever the underlying range state changes
  // externally (e.g. loaded from the URL on first render, or cleared via
  // "Clear Filters").
  useStartSync(start, setMin, setMax);

  const handleApply = () => {
    const minValue = min ? Number(min) : undefined;
    const maxValue = max ? Number(max) : undefined;

    refine([minValue, maxValue]);

  };

  return (
    <div className="pt-2 pb-4">
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={min}
          min={range.min}
          max={range.max}
          onChange={(e) => setMin(e.target.value)}
          placeholder="0"
          className="w-full h-[36px] px-3 border border-[#cfcfcf] rounded-[3px] text-[14px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        <span className="text-[16px]">To</span>

        <input
          type="number"
          value={max}
          min={range.min}
          max={range.max}
          onChange={(e) => setMax(e.target.value)}
          placeholder={String(range.max ?? "")}
          className="w-full h-[36px] px-3 border border-[#cfcfcf] rounded-[3px] text-[14px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        <button
          onClick={handleApply}
          className="h-[36px] px-4 bg-[#00af66] cursor-pointer hover:bg-black text-white rounded-[4px] font-semibold text-[14px] hover:bg-[#00995a] transition"
        >
          Go
        </button>
      </div>
    </div>
  );
}

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

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
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
        <div className="mt-1 z-10 rounded   px-2 py-1 text-[12px] text-black shadow-md">
          {error}
        </div>
      )}
    </div>
  );
}

/* useStartSync: small shared hook so PriceRangeFilter/OdometerRangeFilter
    keep their local text-input state in sync with the InstantSearch
    `useRange` `start` tuple (e.g. when loaded from the URL on first
    render, or reset via "Clear Filters"). asStrings=true mirrors the
    OdometerRangeFilter's original String() coercion. */
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start[0], start[1]]);
}

/* InventoryContent: main page content */
const InventoryContent = () => {
  /* Only one filter open at a time */
  const [openFilter, setOpenFilter] =
    useState<string | null>("");


    
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
            <div className="flex flex-col lg:flex-row items-start gap-5 lg:px-10 px-">

              {/* Sidebar Filters (Modified sticky position to flow up on first scroll) */}
              <aside className="hidden sticky top-[-180px] self-start shrink-0 lg:block bg-white border border-[#ddd] rounded-[15px] p-[15px] w-[290px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

                {/* Hits count + clear filters */}
                <div className="mt-[10px] flex flex-col items-center gap-4">
                  <div className="bg-[#00af66] text-white text-center py-3 px-4 rounded-xl font-bold text-[14px] w-full shadow-sm">
                    <CustomHitsCount />
                  </div>

                  <ClearRefinements
                    classNames={{
                      button:
                        "text-[12px] mb-9 cursor-pointer font-bold text-black disabled:cursor-not-allowed",
                    }}
                    translations={{
                      resetButtonText: "Clear Filters",
                    }}
                  />
                </div>

                {/* Filter groups */}
                <div className="space-y-5">

                  <FilterGroup
                    title="LOCATION"
                    isOpen={openFilter === "LOCATION"}
                    onToggle={() =>
                      setOpenFilter(
                        openFilter === "LOCATION"
                          ? null
                          : "LOCATION"
                      )
                    }
                  >
                    <RefinementList
                      attribute="location"
                      classNames={refinementListClassNames}
                    />
                  </FilterGroup>

                  <FilterGroup
                    title="VEHICLE TYPE"
                    isOpen={openFilter === "VEHICLE TYPE"}
                    onToggle={() =>
                      setOpenFilter(
                        openFilter === "VEHICLE TYPE"
                          ? null
                          : "VEHICLE TYPE"
                      )
                    }
                  >
                    <RefinementList
                      attribute="vehicle_type"
                      classNames={refinementListClassNames}
                    />
                  </FilterGroup>

                  <FilterGroup
                    title="PRICE"
                    isOpen={openFilter === "PRICE"}
                    onToggle={() =>
                      setOpenFilter(
                        openFilter === "PRICE"
                          ? null
                          : "PRICE"
                      )
                    }
                  >
                    <PriceRangeFilter />
                  </FilterGroup>

                  <FilterGroup
                    title="YEAR"
                    isOpen={openFilter === "YEAR"}
                    onToggle={() =>
                      setOpenFilter(
                        openFilter === "YEAR"
                          ? null
                          : "YEAR"
                      )
                    }
                  >
                    <RefinementList
                      attribute="year"
                      sortBy={["name:desc"]}
                      classNames={refinementListClassNames}
                    />
                  </FilterGroup>

                  <FilterGroup
                    title="MAKE"
                    isOpen={openFilter === "MAKE"}
                    onToggle={() =>
                      setOpenFilter(
                        openFilter === "MAKE"
                          ? null
                          : "MAKE"
                      )
                    }
                  >
                    <RefinementList
                      attribute="make"
                      classNames={refinementListClassNames}
                    />
                  </FilterGroup>

                  <FilterGroup
                    title="MODEL"
                    isOpen={openFilter === "MODEL"}
                    onToggle={() =>
                      setOpenFilter(
                        openFilter === "MODEL"
                          ? null
                          : "MODEL"
                      )
                    }
                  >
                    <RefinementList
                      attribute="model"
                      classNames={refinementListClassNames}
                    />
                  </FilterGroup>

                  <FilterGroup
                    title="ODOMETER"
                    isOpen={openFilter === "ODOMETER"}
                    onToggle={() =>
                      setOpenFilter(
                        openFilter === "ODOMETER"
                          ? null
                          : "ODOMETER"
                      )
                    }
                  >
                    <OdometerRangeFilter />
                  </FilterGroup>

                  <FilterGroup
                    title="EXTERIOR COLOR"
                    isOpen={openFilter === "EXTERIOR COLOR"}
                    onToggle={() =>
                      setOpenFilter(
                        openFilter === "EXTERIOR COLOR"
                          ? null
                          : "EXTERIOR COLOR"
                      )
                    }
                  >
                    <RefinementList
                      attribute="exterior_color"
                      classNames={refinementListClassNames}
                    />
                  </FilterGroup>

                  <FilterGroup
                    title="BODY TYPE"
                    isOpen={openFilter === "BODY TYPE"}
                    onToggle={() =>
                      setOpenFilter(
                        openFilter === "BODY TYPE"
                          ? null
                          : "BODY TYPE"
                      )
                    }
                  >
                    <RefinementList
                      attribute="body_type"
                      classNames={refinementListClassNames}
                    />
                  </FilterGroup>

                  <FilterGroup
                    title="TRANSMISSION"
                    isOpen={openFilter === "TRANSMISSION"}
                    onToggle={() =>
                      setOpenFilter(
                        openFilter === "TRANSMISSION"
                          ? null
                          : "TRANSMISSION"
                      )
                    }
                  >
                    <RefinementList
                      attribute="transmission"
                      classNames={refinementListClassNames}
                    />
                  </FilterGroup>

                  <FilterGroup
                    title="FUEL TYPE"
                    isOpen={openFilter === "FUEL TYPE"}
                    onToggle={() =>
                      setOpenFilter(
                        openFilter === "FUEL TYPE"
                          ? null
                          : "FUEL TYPE"
                      )
                    }
                  >
                    <RefinementList
                      attribute="fuel_type"
                      classNames={refinementListClassNames}
                    />
                  </FilterGroup>

                </div>
              </aside>

              {/* Right Content */}
              <div className="w-full lg:flex-1 mt-5 lg:mt-0">

                {/* Search + sort */}
                <div className="flex flex-col lg:flex-row lg:items-center items-end   justify-between gap-4 mb- px-3">

                  <div
                    className="relative w-full lg:max-w-[440px]"
                  >
                    <SearchBox
                      classNames={{
                        root: "w-full",
                        form: "relative flex items-center",
                        input:
                          "w-full pl-[36px] tracking-wide  pr-4 py-[10px] rounded-[12px] border border-[#ddd] shadow-none bg-white text-[14px] text-[#000] outline-none transition-all",
                        submitIcon: "hidden",
                        resetIcon: "hidden",
                        loadingIcon: "hidden",
                      }}
                      placeholder="Search for Anything"
                    />

                    <Search className="h-[20px] w-[18px] absolute left-2 top-1/2 -translate-y-1/2 text-black pointer-events-none" />
                  </div>

                  {/* Sort */}
                  <div className="md:flex hidden items-center gap-4 self-end md:self-auto mr-3">

                    <span className="text-[15px] font-bold text-gray-900 text-nowrap">
                      Sort By
                    </span>

                    <SortBy
                      items={[
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
                      ]}
                      classNames={{
                        select:
                          "px-4 py-1 tracking-wide rounded-[12px] border border-gray-300 bg-white text-black/80 text-[13px] font-extrabold outline-none  cursor-pointer w-[212px] h-[42px] transition-colors appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke-width%3D%222%22%20stroke%3D%22%23000%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M8%209l4-4%204%204m0%206l-4%204-4-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat pr-10",
                      }}
                    />
                  </div>
                </div>

                {/* Current refinements */}
                <div className="ml-3">
                  <CurrentRefinements
                    classNames={{
                      root: "w-full",
                      list: "flex flex-wrap gap-2",
                      item: "flex flex-wrap gap-2",
                      label: "hidden",
                      category:
                        "flex items-center bg-white rounded-lg px-[15px] py-[6px] mt-[5px] mb-2 shadow-none border border-gray-200 text-[14px] text-gray-700 font-light",
                      categoryLabel: "mr-3 text-[16px] cursor-pointer",
                      delete:
                        "text-gray-500 cursor-pointer hover:text-gray-900 focus:outline-none flex items-center justify-center text-[16px]",
                    }}
                  />
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
