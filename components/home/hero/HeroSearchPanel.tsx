"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const HeroSearchPanel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    router.push(
      searchQuery.trim()
        ? `/inventory?q=${encodeURIComponent(searchQuery.trim())}`
        : "/inventory"
    );
  };

  return (
    <div className="w-full max-w-[550px] flex justify-center bg-[#00573326] rounded-[10px]">
      <div className="overflow-hidden rounded-[10px] p-[30px_25px_18px] w-full">
        {/* Search input */}
        <div className="flex items-center bg-white overflow-hidden shadow relative rounded-[10px]">
          <div className="relative bg-white overflow-hidden rounded-[10px] left-3 w-6 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-[15px] h-[15px] text-black "
            >
              <circle cx="10.1" cy="10.1" r="8.5" />
              <path d="m23 23-9-9" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search for Any Makes or Model"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 px-3 py-4 outline-none text-sm"
          />
          <button
            onClick={handleSearch}
            className="bg-brand-green cursor-pointer text-white px-6 font-medium hover:opacity-90 absolute right-2 h-[34px] flex justify-center items-center rounded-[5px]"
          >
            Go
          </button>
        </div>

        {/* OR divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="h-px bg-black/20 flex-1" />
          <span className="text-md text-black">or</span>
          <div className="h-px bg-black/20 flex-1" />
        </div>

        {/* Browse all Cars button */}
        <Link
          href="/inventory"
          className="block text-center text-white font-medium text-base w-full hover:opacity-90 transition-opacity rounded-[12px] py-3 px-[30px] bg-gradient-to-b from-[#00af66] to-[#00af66a6]"
        >
          Browse all Cars
        </Link>

        {/* Sell / valuation CTA */}
        <p className="text-center mt-2 mb-3 text-base text-black p-0 bg-transparent hover:text-[#00af66] cursor-pointer">
          <Link
            href="/financing"
            className="cursor-pointer text-black hover:text-[#00af66] bg-transparent p-2 text-[14.5px]"
          >
                      Looking to sell your car? Get a valuation
          </Link>
        </p>
      </div>
    </div>
  );
};

export default HeroSearchPanel;
