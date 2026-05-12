"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
import { searchClient, TYPESENSE_COLLECTION_NAME } from "@/lib/typesense";
import { HitCard } from "@/components/Inventory/HitCard";
import GetInTouch from "@/components/GetInTouch";

type FilterGroupProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

const FilterGroup = ({
  title,
  children,
  defaultOpen = true,
}: FilterGroupProps) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="text-[15px] font-bold text-foreground">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
};

// We will build custom widgets later. For now, using standard widgets or placeholders.
const CustomHitsCount = () => {
  const { results } = useHits();
  return (
    <span className="text-[14px] font-bold text-white leading-none">
      {results?.nbHits || 0} Matching Vehicles Found
    </span>
  );
};

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

const refinementListClassNames = {
  list: "space-y-3 pt-2 pb-4",
  label:
    "flex items-center gap-3 cursor-pointer text-[16px] text-gray-900 transition-colors",
  checkbox:
    "appearance-none h-[18px] w-[18px] rounded-[4px] border border-gray-800 bg-white checked:border-transparent checked:bg-transparent checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22%2300AF66%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%22%2F%3E%3C%2Fsvg%3E')] checked:bg-center checked:bg-no-repeat checked:bg-[length:20px_20px] focus:ring-0 cursor-pointer",
  labelText: "flex-1",
  count:
    "bg-[#e6f7ec] text-gray-900 font-bold px-2.5 py-0.5 rounded-md text-[13px] ml-auto",
};

const InventoryContent = () => {
  const searchParams = useSearchParams();
  const q = searchParams?.get("q") || "";

  const bodyTypeParam = searchParams?.get("body_type");
  const fuelTypeParam = searchParams?.get("fuel_type");
  const priceParam = searchParams?.get("price");

  const refinementList: Record<string, string[]> = {};
  if (bodyTypeParam) {
    refinementList.body_type = bodyTypeParam.split("|");
  }
  if (fuelTypeParam) {
    refinementList.fuel_type = fuelTypeParam.split("|");
  }

  const range: Record<string, string> = {};
  if (priceParam) {
    range.selling_price = priceParam;
  }

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
      {/* added class inventory_page  */}
      <section className="w-full bg-[#efefef] flex-1 inventory_page">
        <InstantSearch
          searchClient={searchClient}
          indexName={TYPESENSE_COLLECTION_NAME}
          initialUiState={initialUiState}
        >
          <Configure hitsPerPage={21} />

          <div className="mx-auto max-w-[1400px] px-6 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
              {/* Sidebar */}
              {/* added class invntory_left_sidebar  */}
              <aside className="rounded-[2.5rem] bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 h-fit invntory_left_sidebar">
                <div className="mb-6 flex flex-col items-center gap-4">
                  <div className="bg-[#00A651] text-white text-center py-3 px-4 rounded-xl font-bold text-[14px] w-full shadow-sm">
                    <CustomHitsCount />
                  </div>
                  <ClearRefinements
                    classNames={{
                      button:
                        "text-[13px] font-bold text-gray-800 hover:text-[#00A651] disabled:opacity-50 disabled:cursor-not-allowed",
                    }}
                    translations={{
                      resetButtonText: "Clear Filters",
                    }}
                  />
                </div>

                <div className="space-y-1 vehicle_type">
                  <FilterGroup title="VEHICLE TYPE">
                    <RefinementList
                      attribute="vehicle_type"
                      classNames={refinementListClassNames}
                    />
                  </FilterGroup>

                  <FilterGroup title="PRICE">
                    <RangeInput
                      attribute="selling_price"
                      classNames={{
                        root: "w-full pt-2 pb-4",
                        form: "flex items-center gap-2",
                        input:
                          "w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-[14px] outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-gray-900 transition-all",
                        submit: "hidden",
                        separator: "text-gray-400 mx-2 font-medium",
                      }}
                      translations={{
                        separatorElementText: "to",
                      }}
                    />
                  </FilterGroup>

                  <FilterGroup title="YEAR">
                    <RefinementList
                      attribute="year"
                      sortBy={["name:desc"]}
                      classNames={refinementListClassNames}
                    />
                  </FilterGroup>

                  <FilterGroup title="MAKE">
                    <RefinementList
                      attribute="make"
                      classNames={refinementListClassNames}
                    />
                  </FilterGroup>

                  <FilterGroup title="MODEL" defaultOpen={false}>
                    <RefinementList
                      attribute="model"
                      classNames={refinementListClassNames}
                    />
                  </FilterGroup>

                  <FilterGroup title="ODOMETER" defaultOpen={false}>
                    <RangeInput
                      attribute="odometer"
                      classNames={{
                        root: "w-full pt-2 pb-4",
                        form: "flex items-center gap-2",
                        input:
                          "w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-[14px] outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-gray-900 transition-all",
                        submit: "hidden",
                        separator: "text-gray-400 mx-2 font-medium",
                      }}
                      translations={{
                        separatorElementText: "to",
                      }}
                    />
                  </FilterGroup>

                  <FilterGroup title="EXTERIOR COLOR" defaultOpen={false}>
                    <RefinementList
                      attribute="exterior_color"
                      classNames={refinementListClassNames}
                    />
                  </FilterGroup>

                  <FilterGroup title="BODY TYPE" defaultOpen={false}>
                    <RefinementList
                      attribute="body_type"
                      classNames={refinementListClassNames}
                    />
                  </FilterGroup>

                  <FilterGroup title="TRANSMISSION" defaultOpen={false}>
                    <RefinementList
                      attribute="transmission"
                      classNames={refinementListClassNames}
                    />
                  </FilterGroup>

                  <FilterGroup title="FUEL TYPE" defaultOpen={false}>
                    <RefinementList
                      attribute="fuel_type"
                      classNames={refinementListClassNames}
                    />
                  </FilterGroup>
                </div>
              </aside>

              {/* Results */}
              {/* added class results_view_wr  */}
              <div className="results_view_wr">
                {/* Search & Sort bar */}
                {/* added class seacrh_header_part  */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-3 seacrh_header_part">
                  <div className="relative w-full md:max-w-md">
                    <SearchBox
                      classNames={{
                        root: "w-full",
                        form: "relative flex items-center",
                        input:
                          "w-full pl-12 pr-4 py-3.5 rounded-[1rem] border-0 shadow-sm bg-white text-[15px] outline-none focus:ring-2 focus:ring-brand-green transition-all",
                        submitIcon: "hidden",
                        resetIcon: "hidden",
                      }}
                      placeholder="Search for Anything"
                    />
                    <Search className="h-[22px] w-[22px] absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-auto">
                    <span className="text-[15px] font-bold text-gray-900 sort_by_title">
                      Sort By
                    </span>
                    <SortBy
                      items={[
                        {
                          label: "Recently Added",
                          value: `${TYPESENSE_COLLECTION_NAME}/sort/status_rank:asc,created_at:desc`,
                        },
                        {
                          label: "Price: Low to High",
                          value: `${TYPESENSE_COLLECTION_NAME}/sort/selling_price:asc`,
                        },
                        {
                          label: "Price: High to Low",
                          value: `${TYPESENSE_COLLECTION_NAME}/sort/selling_price:desc`,
                        },
                        {
                          label: "KM: Low to High",
                          value: `${TYPESENSE_COLLECTION_NAME}/sort/odometer:asc`,
                        },
                        {
                          label: "KM: High to Low",
                          value: `${TYPESENSE_COLLECTION_NAME}/sort/odometer:desc`,
                        },
                        {
                          label: "Year: New to Old",
                          value: `${TYPESENSE_COLLECTION_NAME}/sort/year:desc`,
                        },
                        {
                          label: "Year: Old to New",
                          value: `${TYPESENSE_COLLECTION_NAME}/sort/year:asc`,
                        },
                      ]}
                      classNames={{
                        select:
                          "px-4 py-2 rounded-md border border-gray-300 bg-white text-[14px] font-bold outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green cursor-pointer min-w-[200px] h-[42px] transition-colors appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke-width%3D%222%22%20stroke%3D%22%23000%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M8%209l4-4%204%204m0%206l-4%204-4-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat pr-10",
                      }}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <CurrentRefinements
                    classNames={{
                      root: "w-full",
                      list: "flex flex-wrap gap-2",
                      item: "flex flex-wrap gap-2",
                      label: "hidden",
                      category:
                        "flex items-center bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200 text-[14px] text-gray-700",
                      categoryLabel: "mr-3",
                      delete:
                        "text-gray-500 hover:text-gray-900 focus:outline-none flex items-center justify-center text-[16px]",
                    }}
                  />
                </div>
                {/* added class results_view_wr_grid */}
                <div className="mb-4 results_view_wr_grid">
                  <NoResultsHandler>
                    <Hits
                      hitComponent={HitCard}
                      classNames={{
                        list: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6",
                        item: "flex flex-col h-full",
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

const Inventory = () => {
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

export default Inventory;
