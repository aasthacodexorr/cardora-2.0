/* =========================
   Inventory Page
   Vehicle listing page powered by react-instantsearch
   and Typesense. Features:
   - Left sidebar with collapsible filter groups
   - Search box + sort-by dropdown
   - Active refinement chips (CurrentRefinements)
   - Responsive grid of HitCard results
   - URL-driven initial state (q, body_type, fuel_type, price params)
   Wrapped in Suspense to handle useSearchParams safely.
========================= */

"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";

// Layout
import { Header, Footer } from "@/components/layout";

// Inventory components
import { HitCard } from "@/components/Inventory";

// Shared components
import { GetInTouch } from "@/components/common";

// react-instantsearch
import {
  InstantSearch,
  Hits,
  SearchBox,
  RefinementList,
  Configure,
  useHits,
  RangeInput,
  ClearRefinements,
  SortBy,
  CurrentRefinements,
} from "react-instantsearch";

// Typesense search client
import { searchClient, TYPESENSE_COLLECTION_NAME } from "@/lib/typesense";

/* ── Shared class name configs for InstantSearch widgets ─────── */
const refinementListClassNames = {
  list: "space-y-3 pt-2 pb-4 p-0",
  label:
    "flex items-center gap-3 cursor-pointer text-[16px] text-gray-900 transition-colors",
  checkbox:
    "appearance-none h-[18px] w-[18px] rounded-[4px] border border-gray-800 bg-white checked:border-transparent checked:bg-transparent checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22%2300AF66%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%22%2F%3E%3C%2Fsvg%3E')] checked:bg-center checked:bg-no-repeat checked:bg-[length:20px_20px] focus:ring-0 cursor-pointer",
  labelText: "flex-1",
  count:
    "bg-[#e6f7ec] text-gray-900 font-bold px-[8px] py-[2px] rounded-md text-[11px] ml-auto",
};

const rangeInputClassNames = {
  root: "w-full pt-2 pb-4 p-0",
  form: "flex items-center gap-2",
  input:
    "w-full px-3 py-2.5 rounded-xl border border-[#d0d0d0] bg-white text-[16px] font-normal outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-[#000] transition-all mx-[2%]",
  submit: "hidden",
  separator: "text-gray-400 mx-2 font-medium",
};

/* ── FilterGroup: collapsible sidebar section ────────────────── */
type FilterGroupProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

const FilterGroup = ({ title, children, defaultOpen = true }: FilterGroupProps) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border py-[10px] mb-0 last:border-b-0 first:border-t first:border-t-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left cursor-pointer"
      >
        <span className="text-[17px] font-normal text-[#000] uppercase tracking-[1px] text-left">
          {title}
        </span>
        <ChevronDown
          className={`h-[23px] w-[23px] text-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
};

/* ── CustomHitsCount: shows total matching vehicles ──────────── */
const CustomHitsCount = () => {
  const { results } = useHits();
  return (
    <span className="text-[14px] font-normal text-white leading-none uppercase">
      {results?.nbHits || 0} Matching Vehicles Found
    </span>
  );
};

/* ── NoResultsHandler: shows message when no hits ────────────── */
const NoResultsHandler = ({ children }: { children: React.ReactNode }) => {
  const { results } = useHits();
  if (results && results.nbHits === 0) {
    return (
      <div className="mt-8 text-[15px] text-gray-800">
        Currently, there are no vehicles that match your criteria.
      </div>
    );
  }
  return <>{children}</>;
};

/* ── InventoryContent: main page content (needs useSearchParams) */
const InventoryContent = () => {
  const searchParams = useSearchParams();
  const q = searchParams?.get("q") || "";

  // Parse URL filter params for initial InstantSearch state
  const bodyTypeParam = searchParams?.get("body_type");
  const fuelTypeParam = searchParams?.get("fuel_type");
  const priceParam    = searchParams?.get("price");

  const refinementList: Record<string, string[]> = {};
  if (bodyTypeParam) refinementList.body_type = bodyTypeParam.split("|");
  if (fuelTypeParam) refinementList.fuel_type = fuelTypeParam.split("|");

  const range: Record<string, string> = {};
  if (priceParam) range.selling_price = priceParam;

  const initialUiState = {
    [TYPESENSE_COLLECTION_NAME]: {
      query: q,
      ...(Object.keys(refinementList).length > 0 && { refinementList }),
      ...(Object.keys(range).length > 0 && { range }),
    },
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="bg-hero-bg">
        <Header />
      </div>

      <section className="w-full bg-[#efefef] flex-1">
        <InstantSearch
          searchClient={searchClient}
          indexName={TYPESENSE_COLLECTION_NAME}
          initialUiState={initialUiState}
        >
          <Configure hitsPerPage={21} />
          <div className="max-w-[1600px] mx-auto px-3 md:px-[24px] pt-[20px] pb-[50px]">
            <div className="flex gap-5 md:px-10">

              {/* ── Left sidebar: filters ──────────────────── */}
             <aside className="hidden md:block bg-white border border-[#ddd] rounded-[15px] p-[15px] w-[380px] h-fits">
                {/* Hits count + clear filters */}
                <div className="mt-[10px] flex flex-col items-center gap-4">
                  <div className="bg-[#00af66] text-white text-center py-3 px-4 rounded-xl font-bold text-[14px] w-full shadow-sm">
                    <CustomHitsCount />
                  </div>
                  <ClearRefinements 
                    classNames={{
                      button:
                        "text-[13px] mb-10 cursor-pointer font-bold text-black hover:text-[#00A651] disabled:opacity-50 disabled:cursor-not-allowed",
                    }}
                    translations={{ resetButtonText: "Clear Filters" }}
                  />
                </div>

                {/* Filter groups */}
                <div className="space-y-1">
                  <FilterGroup title="VEHICLE TYPE">
                    <RefinementList attribute="vehicle_type" classNames={refinementListClassNames} />
                  </FilterGroup>

                  <FilterGroup title="PRICE">
                    <RangeInput
                      attribute="selling_price"
                      classNames={rangeInputClassNames}
                      translations={{ separatorElementText: "to" }}
                    />
                  </FilterGroup>

                  <FilterGroup title="YEAR">
                    <RefinementList attribute="year" sortBy={["name:desc"]} classNames={refinementListClassNames} />
                  </FilterGroup>

                  <FilterGroup title="MAKE">
                    <RefinementList attribute="make" classNames={refinementListClassNames} />
                  </FilterGroup>

                  <FilterGroup title="MODEL" defaultOpen={false}>
                    <RefinementList attribute="model" classNames={refinementListClassNames} />
                  </FilterGroup>

                  <FilterGroup title="ODOMETER" defaultOpen={false}>
                    <RangeInput
                      attribute="odometer"
                      classNames={rangeInputClassNames}
                      translations={{ separatorElementText: "to" }}
                    />
                  </FilterGroup>

                  <FilterGroup title="EXTERIOR COLOR" defaultOpen={false}>
                    <RefinementList attribute="exterior_color" classNames={refinementListClassNames} />
                  </FilterGroup>

                  <FilterGroup title="BODY TYPE" defaultOpen={false}>
                    <RefinementList attribute="body_type" classNames={refinementListClassNames} />
                  </FilterGroup>

                  <FilterGroup title="TRANSMISSION" defaultOpen={false}>
                    <RefinementList attribute="transmission" classNames={refinementListClassNames} />
                  </FilterGroup>

                  <FilterGroup title="FUEL TYPE" defaultOpen={false}>
                    <RefinementList attribute="fuel_type" classNames={refinementListClassNames} />
                  </FilterGroup>
                </div>
              </aside>

              {/* ── Right: search bar + results grid ──────── */}
              <div className=" w-full">
                {/* Search + sort controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-3 px-3">
                  <div className="relative w-full" style={{ maxWidth: "440px" }}>
                    <SearchBox
                      classNames={{
                        root: "w-full",
                        form: "relative flex items-center",
                        input:
                          "w-full pl-[36px] pr-4 py-[10px] rounded-[12px] border border-[#ddd] shadow-none bg-white text-[16px] text-[#000] outline-none focus:ring-2 focus:ring-brand-green transition-all",
                        submitIcon: "hidden",
                        resetIcon: "hidden",
                      }}
                      placeholder="Search for Anything"
                    />
                    <Search className="h-[16px] w-[16px] absolute left-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" />
                  </div>

                  {/* Sort by dropdown (desktop only) */}
                  <div className="md:flex hidden items-center gap-4 self-end md:self-auto mr-3">
                    <span className="text-[15px] font-bold text-gray-900 text-nowrap">
                      Sort By
                    </span>
                    <SortBy
                      items={[
                        { label: "Recently Added",    value: `${TYPESENSE_COLLECTION_NAME}/sort/status_rank:asc,created_at:desc` },
                        { label: "Price: Low to High", value: `${TYPESENSE_COLLECTION_NAME}/sort/selling_price:asc` },
                        { label: "Price: High to Low", value: `${TYPESENSE_COLLECTION_NAME}/sort/selling_price:desc` },
                        { label: "KM: Low to High",    value: `${TYPESENSE_COLLECTION_NAME}/sort/odometer:asc` },
                        { label: "KM: High to Low",    value: `${TYPESENSE_COLLECTION_NAME}/sort/odometer:desc` },
                        { label: "Year: New to Old",   value: `${TYPESENSE_COLLECTION_NAME}/sort/year:desc` },
                        { label: "Year: Old to New",   value: `${TYPESENSE_COLLECTION_NAME}/sort/year:asc` },
                      ]}
                      classNames={{
                        select:
                          "px-4 py-2 rounded-[12px] border border-gray-300 bg-white text-[13px] font-[800] outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green cursor-pointer w-[212px] h-[42px] transition-colors appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke-width%3D%222%22%20stroke%3D%22%23000%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M8%209l4-4%204%204m0%206l-4%204-4-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat pr-10",
                      }}
                    />
                  </div>
                </div>

                {/* Active filter chips */}
                <div className="">
                  <CurrentRefinements
                    classNames={{
                      root: "w-full",
                      list: "flex flex-wrap gap-2",
                      item: "flex flex-wrap gap-2",
                      label: "hidden",
                      category:
                        "flex items-center bg-white rounded-lg px-[15px] py-[6px] shadow-none border border-gray-200 text-[14px] text-gray-700",
                      categoryLabel: "mr-3 text-[16px]",
                      delete:
                        "text-gray-500 hover:text-gray-900 focus:outline-none flex items-center justify-center text-[16px]",
                    }}
                  />
                </div>

                {/* Results grid */}
                <div className="mb-4">
                  <NoResultsHandler>
                    <Hits
                      hitComponent={HitCard}
                      classNames={{
                        list: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 lg:gap-0 gap-x-[24px] gap-y-[20px]",
                        item: "flex flex-col h-full p-[9px]",
                      }}
                    />
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

/* ── Page export: wrapped in Suspense for useSearchParams ─────── */
const InventoryPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center font-bold">
          Loading inventory...
        </div>
      }
    >
      <InventoryContent />
    </Suspense>
  );
};

export default InventoryPage;
