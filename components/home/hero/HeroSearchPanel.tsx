"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppConfig } from "@/app/providers";
import { Search } from "lucide-react";
import { getInventoryUrlByQuery } from "@/lib/inventoryUrls";


const HeroSearchPanelContent = () => {
  const appConfig = useAppConfig();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q") || "";
    if (q) {
      setSearchQuery(q);
    }
  }, []);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 1) {
      setSuggestions([]);
      return;
    }

    try {
      setIsLoading(true);
      const protocol = appConfig.site.typesense_protocol || "https";
      const host = appConfig.site.typesense_host;
      const port = Number(appConfig.site.typesense_port) || 443;
      const searchKey = appConfig.site.inventory_search_only_key;
      const collection = appConfig.site.collection;
      
      const searchUrl = `${protocol}://${host}:${port}/collections/${collection}/documents/search?q=${encodeURIComponent(query)}&query_by=make,model,trim&facet_by=make,model&limit=20&per_page=5`;
      
      const response = await fetch(searchUrl, {
        headers: {
          "X-TYPESENSE-API-KEY": searchKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const results = await response.json();

      // Extract unique makes and models
      const uniqueSuggestions = new Set<string>();
      
      // From facet distributions
      if (results.facet_distributions) {
        if (results.facet_distributions.make) {
          Object.keys(results.facet_distributions.make).forEach(make => {
            if (make && make.trim()) uniqueSuggestions.add(make);
          });
        }
        if (results.facet_distributions.model) {
          Object.keys(results.facet_distributions.model).forEach(model => {
            if (model && model.trim()) uniqueSuggestions.add(model);
          });
        }
      }

      // From direct hits
      if (results.hits && Array.isArray(results.hits)) {
        results.hits.slice(0, 15).forEach((hit: any) => {
          if (hit.document) {
            if (hit.document.make) uniqueSuggestions.add(hit.document.make);
            if (hit.document.model) uniqueSuggestions.add(hit.document.model);
          }
        });
      }

      setSuggestions(Array.from(uniqueSuggestions).slice(0, 8));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [appConfig]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      router.push(`/inventory/`);
      return;
    }

    setShowSuggestions(false);
    router.push(getInventoryUrlByQuery(searchQuery.trim(), appConfig));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    router.push(getInventoryUrlByQuery(suggestion.trim(), appConfig));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);
    fetchSuggestions(value);
  };

  return (
    <div className="w-full max-w-[550px] flex justify-center rounded-[10px] lg:mt-4 lg:pt-2 bg-prequalify-blue relative z-40">
      <div className="rounded-[10px] p-4 lg:p-[30px_25px_18px] w-full">
        {/* Search input */}
        <div className="flex items-center bg-white overflow-visible shadow relative rounded-[10px] z-40">
          <div className="relative bg-white overflow-hidden rounded-[10px] left-3 w-6 ">
           <Search size={15} fontWeight="normal"/>
          </div>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search for Any Makes or Model"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => searchQuery && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full px-3 py-4 outline-none text-sm"
            />
            
            {/* Dropdown suggestions */}
            {showSuggestions && suggestions?.length > 0 && (
              <div className="absolute cursor-pointer left-0 right-0 top-[100%] mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-xl z-50 max-h-72 overflow-y-auto">
                {suggestions?.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors text-base font-medium text-gray-800 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex cursor-pointer items-center gap-3">
                      <Search size={16} className="text-green-600" />
                      <span>{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="bg-brand-green cursor-pointer text-white px-6 font-medium hover:opacity-90 absolute right-2 h-[34px] flex justify-center items-center rounded-[5px] z-10"
          >
            Go
          </button>
        </div>

        {/* OR divider */}
        <div className="flex items-center gap-4 lg:my-5 my-4">
          <div className="h-px bg-black/20 flex-1" />
          <span className="text-md text-black">or</span>
          <div className="h-px bg-black/20 flex-1" />
        </div>

        {/* Browse all Cars button */}
        <Link
          href={`/inventory/`}
          className="block text-center text-white font-medium text-base w-full hover:opacity-90 transition-opacity rounded-[12px] py-3 px-[30px] bg-brand-btn-gradient"
        >
          Browse all Cars
        </Link>

        {/* Sell / valuation CTA */}
        <p className="text-center mt-2 mb-3 text-base text-black p-0 bg-transparent cursor-pointer">
          <Link
            href="/financing"
            className="cursor-pointer text-black bg-transparent p-2 text-[14.5px] transition-colors hover:text-brand-green"
          >
            Looking to sell your car? Get a valuation
          </Link>
        </p>
      </div>
    </div>
  );
};

const HeroSearchPanel = () => {
  return (
    <Suspense fallback={<div className="w-full max-w-[550px] h-[300px] rounded-[10px] bg-prequalify-blue" />}>
      <HeroSearchPanelContent />
    </Suspense>
  );
};

export default HeroSearchPanel;
