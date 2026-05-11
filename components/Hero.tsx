"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import yellowSuv from "@/assets/car-yellow-suv 1.png";
import whiteSuv from "@/assets/car-white-suv 1.png";
import orangeTruck from "@/assets/car-orange-truck 1.png";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    router.push(
      searchQuery.trim()
        ? `/inventory?q=${encodeURIComponent(searchQuery.trim())}`
        : "/inventory",
    );
  };

  return (
    //  added class banner_hr
    <section className="w-full bg-hero-bg banner_hr">
      <div className="max-w-[1400px] mx-auto px-6 py-16 grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
        {/* LEFT SIDE */}
        <div className="banner_text">
            <h1>
              Buy or sell a{" "}
              <img
                src={yellowSuv.src}
                alt="Yellow SUV"
                className="b_yellow_car"
              />
              <img src={whiteSuv.src} alt="White SUV" className="b_white_car" />
              pre-owned car.
              <img
                src={orangeTruck.src}
                alt="Orange Truck"
                className="b_orange_car"
              />
              <span className="banner_sp">The way everyone deserves.</span>
            </h1>
        </div>

        {/* RIGHT SIDE */}
        {/* added class serach_banner  */}
        <div className="serach_banner">
          {/* added class part_search  */}
          <div className="part_search bg-search-panel/80 rounded-2xl p-8 shadow-sm search_panel">
            {/* SEARCH */}
            <div className="flex items-center bg-white rounded-full overflow-hidden shadow">
              <div className="pl-5 text-gray-500">
                <Search className="w-5 h-5" />
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
                className="bg-brand-green text-white px-6 py-3 font-semibold rounded-full mr-2 hover:opacity-90"
              >
                Go
              </button>
            </div>

            {/* OR */}
            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-black/20 flex-1" />
              <span className="text-sm text-black/70">or</span>
              <div className="h-px bg-black/20 flex-1" />
            </div>

            {/* BUTTON */}
            <Link
              href="/inventory"
              className="block text-center bg-brand-green text-white py-4 rounded-md font-semibold text-lg hover:opacity-90"
            >
              Browse all Cars
            </Link>

            {/* TEXT */}
            {/* added class banner_btn  */}
            <p className="text-center mt-4 text-sm text-black/80 banner_btn">
              Looking to sell your car?{" "}
              <Link href="/financing" className="underline cursor-pointer">
                Get a valuation
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
