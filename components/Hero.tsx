// import { useState } from "react";
// import { Search } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import yellowSuv from "@/assets/car-yellow-suv.png";
// import whiteSuv from "@/assets/car-white-suv.png";
// import orangeTruck from "@/assets/car-orange-truck.png";

// const Hero = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const router = useRouter();

//   const handleSearch = () => {
//     if (searchQuery.trim()) {
//       router.push(`/inventory?q=${encodeURIComponent(searchQuery.trim())}`);
//     } else {
//       router.push("/inventory");
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   return (
//     <section className="w-full hero_section">
//       <div className="mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-10 px-6 pb-20 pt-6">
//         {/* Left: Headline with cars */}
//         <div className="relative min-h-[460px]">
//           <h1 className="font-extrabold text-foreground leading-[1.05] tracking-tight text-[52px] lg:text-[72px] relative z-10">
//             <span className="block">Buy or sell a</span>
//             <span className="block pl-24 lg:pl-32 mt-6">pre-owned car.</span>
//             <span className="flex items-end gap-6 mt-6">
//               <span className="hidden md:flex flex-col text-[22px] lg:text-[28px] font-bold leading-tight pb-3">
//                 <span>The way everyone deserves.</span>
//               </span>
//             </span>
//           </h1>

//           {/* Floating car images */}
//           <img
//             src={yellowSuv.src}
//             alt="Yellow pre-owned SUV"
//             width={260}
//             height={170}
//             className="pointer-events-none absolute top-[60px] right-[6%] w-[180px] lg:w-[240px] object-contain z-20"
//           />
//           <img
//             src={whiteSuv.src}
//             alt="White pre-owned SUV"
//             width={240}
//             height={160}
//             loading="lazy"
//             className="pointer-events-none absolute top-[180px] right-[55%] w-[160px] lg:w-[210px] object-contain z-0"
//           />
//           <img
//             src={orangeTruck.src}
//             alt="Orange pre-owned pickup truck"
//             width={300}
//             height={200}
//             loading="lazy"
//             className="pointer-events-none absolute bottom-[10px] left-[26%] w-[200px] lg:w-[260px] object-contain z-20"
//           />
//         </div>

//         {/* Right: Search panel */}
//         <div className="rounded-2xl bg-search-panel/80 p-8 flex flex-col justify-center min-h-[360px] self-start">
//           <div className="flex items-stretch rounded-full bg-background overflow-hidden shadow-sm">
//             <div className="flex items-center pl-5 pr-2 text-muted-foreground">
//               <Search className="h-5 w-5" strokeWidth={2.5} />
//             </div>
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="Search for Any Makes or Model"
//               className="flex-1 bg-transparent py-4 text-[15px] outline-none placeholder:text-muted-foreground min-w-0"
//             />
//             <button
//               onClick={handleSearch}
//               className="bg-brand-green text-brand-green-foreground px-8 font-semibold text-[16px] hover:opacity-95 transition-opacity"
//             >
//               Go
//             </button>
//           </div>

//           <div className="my-6 flex items-center gap-4">
//             <div className="h-px flex-1 bg-foreground/20" />
//             <span className="text-foreground/80 text-[15px]">or</span>
//             <div className="h-px flex-1 bg-foreground/20" />
//           </div>

//           <Link
//             href="/inventory"
//             className="w-full text-center rounded-md bg-brand-green text-brand-green-foreground py-4 font-semibold text-[18px] hover:opacity-95 transition-opacity"
//           >
//             Browse all Cars
//           </Link>

//           <p className="mt-5 text-center text-foreground/90 text-[15px]">
//             Looking to sell your car?{" "}
//             <a href="#" className="underline-offset-2 hover:underline">
//               Get a valuation
//             </a>
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;

"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import yellowSuv from "@/assets/car-yellow-suv.png";
import whiteSuv from "@/assets/car-white-suv.png";
import orangeTruck from "@/assets/car-orange-truck.png";

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
    <section className="w-full bg-hero-bg banner_hr">
      <div className="max-w-[1400px] mx-auto px-6 py-16 grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
        {/* LEFT SIDE */}
        <div className="relative flex flex-col justify-center">
          {/* TEXT */}
          <h1 className="font-carmax text-[52px] lg:text-[72px] leading-[1.05] tracking-tight text-black relative z-10">
            <span className="block bu_ell">Buy or sell a</span>

            <span className=" mt-6 ml-20 lg:ml-28 pre_owned">
              pre-owned car.
            </span>
          </h1>

          <p className="mt-6 ml-20 lg:ml-28 text-[20px] font-medium text-black/80 derserve_everyone">
            The way everyone deserves.
          </p>

          {/* CARS */}
          <img
            src={yellowSuv.src}
            alt=""
            className="absolute top-[30px] right-[5%] w-[180px] lg:w-[240px] z-20 green_car"
          />

          <img
            src={whiteSuv.src}
            alt=""
            className="absolute top-[160px] left-[0%] w-[150px] lg:w-[200px] z-0 white_car"
          />

          <img
            src={orangeTruck.src}
            alt=""
            className="absolute bottom-[0px] left-[20%] w-[180px] lg:w-[240px] z-20 red_car"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="serach_banner">
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
