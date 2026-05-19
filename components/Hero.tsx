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
    <section className="w-full px-5">
      <div className="max-w-[1600px] mx-auto px-5 pt-[87px] pb-[80px] grid md:grid-cols-[1.2fr_1fr] gap-12 items-center max-[991px]:flex max-[991px]:flex-col max-[767px]:pt-[30px] max-[767px]:pb-[30px] max-[767px]:px-5 max-[640px]:px-0 max-[640px]:pt-16">

        {/* ── LEFT SIDE ── */}

        {/* Desktop banner: hidden below 1140px */}
        <div className="font-carmax block max-[1140px]:hidden max-[991px]:max-w-[550px]">
          <h1 className="flex flex-col items-start font-bold leading-[1.3]
            text-[70px]
            max-[1538px]:text-[70px]
            max-[1203px]:text-[40px]
            max-[1078px]:text-[35px]
            max-[991px]:text-[45px]
            max-[549px]:text-[35px]
            max-[481px]:text-[30px]">

            {/* line 1: Buy or sell a + yellow car */}
            <div className="flex items-center font-carmax font-semibold">
              Buy or sell a{" "}
              <img
                src={yellowSuv.src}
                alt="Yellow SUV"
                className="max-w-[250px] max-[1399px]:max-w-[200px] max-[991px]:max-w-[150px] max-[481px]:max-w-[130px]"
              />
            </div>

            {/* line 2: white car + pre-owned */}
            <div className="flex items-center font-carmax font-semibold">
              <img
                src={whiteSuv.src}
                alt="White SUV"
                className="max-w-[250px] -ml-[25px] max-[1399px]:max-w-[200px] max-[1024px]:ml-0 max-[991px]:max-w-[150px] max-[481px]:max-w-[130px]"
              />
              pre-owned
            </div>

            {/* line 3: car. + orange truck + tagline */}
            <div className="flex items-center font-carmax font-semibold">
              {" "}car.
              <img
                src={orangeTruck.src}
                alt="Orange Truck"
                className="max-w-[250px] -ml-[15px] max-[1399px]:max-w-[200px] max-[1024px]:ml-0 max-[991px]:max-w-[150px] max-[481px]:max-w-[130px]"
              />
              <span className="font-carmax font-semibold mt-5 text-2xl font-semibold max-[1203px]:mt-[15px] max-[1203px]:text-[19px] max-[991px]:mt-0 max-[991px]:text-[20px] max-[481px]:text-[15px]">
                The way everyone <br /> deserves.
              </span>
            </div>
          </h1>
        </div>

        {/* Mobile banner: hidden above 1140px */}
        <div className="hidden max-[1140px]:block w-full max-[991px]:max-w-[550px]">
          <h1 className="flex flex-wrap items-center font-semibold
            text-[50px]
            max-[767px]:text-[30px]
            max-[549px]:text-[35px]
            max-[481px]:text-[34px]">
            Buy or sell a{" "}
            <img
              src={yellowSuv.src}
              alt="Yellow SUV"
              className="w-full max-w-[300px] max-[767px]:max-w-[300px] max-[767px]:h-[100px] max-[474px]:max-w-[100px] max-[474px]:h-auto"
            />
           <div className="flex">
             <img
              src={whiteSuv.src}
              alt="White SUV"
              className="w-full max-w-[300px] max-[767px]:max-w-[300px] max-[767px]:h-[100px] max-[474px]:max-w-[150px] max-[474px]:h-auto"
            />
            pre-owned
           </div>
           <div className="flex w-full">
            car. 
            <img
              src={orangeTruck.src}
              alt="Orange Truck"
              className="w-full max-w-[300px] max-[767px]:max-w-[300px] max-[767px]:h-[100px] max-[474px]:max-w-[140px] max-[474px]:h-auto"
            />
            <span className="text-[24px] font-semibold max-[767px]:text-[16px]">
              The way everyone deserves.
            </span>
           </div>
          </h1>
        </div>

        {/* ── RIGHT SIDE ── */}
        <div className="flex justify-end items-center max-[1140px]:justify-center max-[1140px]:w-full max-[991px]:max-w-[550px]">
          {/* Search panel */}
          <div className="bg-search-panel/80 overflow-hidden w-[550px] max-[1140px]:w-full"
               style={{ borderRadius: "10px", padding: "35px 25px 18px" }}>

            {/* Search input row */}
            <div className="flex items-center bg-white overflow-hidden shadow relative"
                 style={{ borderRadius: "10px" }}>
              <div className="pl-5 text-gray-500">
                <Search className="w-5 h-5" />
              </div>

              <input
                type="text"
                placeholder="Search for Any Makes or Model"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 px-3 py-4 outline-none text-sm [font-family:Lato,sans-serif]"
              />

              <button
                onClick={handleSearch}
                className="bg-brand-green text-white px-6 font-medium hover:opacity-90 absolute right-2 h-[34px] flex justify-center items-center"
                style={{ borderRadius: "5px" }}
              >
                Go
              </button>
            </div>

            {/* OR divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-black/20 flex-1" />
              <span className="text-sm text-black/70">or</span>
              <div className="h-px bg-black/20 flex-1" />
            </div>

            {/* Browse all Cars button */}
            <Link
              href="/inventory"
              className="block text-center text-white font-medium text-base w-full hover:opacity-90 transition-opacity"
              style={{
                background: "linear-gradient(180deg, #00af66, #00af66a6)",
                borderRadius: "12px",
                padding: "12px 30px",
              }}
            >
              Browse all Cars
            </Link>

            {/* Sell CTA text */}
            <p className="text-center mt-4 text-base text-black p-0 bg-transparent">
              Looking to sell your car?{" "}
              <Link
                href="/financing"
                className="underline cursor-pointer text-black hover:text-[#00af66] bg-transparent p-0"
              >
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
