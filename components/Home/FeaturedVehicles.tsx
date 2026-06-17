/* =========================
   FeaturedVehicles Component (Home)
   Auto-scrolling carousel of featured vehicles.
   - Triples the data array for a seamless infinite loop
   - Auto-advances every 3 seconds
   - Manual left/right scroll buttons
   - Resets scroll position when reaching either end
     to create the illusion of infinite scrolling
========================= */

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";

import car1 from "@/assets/cars/car-kia-forte.jpg";
import car2 from "@/assets/cars/car-featured-2.jpg";
import car3 from "@/assets/cars/car-featured-3.jpg";
import car4 from "@/assets/cars/car-featured-4.jpg";

/*  Types */
type Vehicle = {
  image: any;
  title: string;
  km: string;
  price: string;
};

/*  Static Data */
const vehicles: Vehicle[] = [
  { image: car1, title: "2024 KIA Forte",        km: "61,294 KM", price: "$20,990.00" },
  { image: car2, title: "2023 Hyundai Tucson",   km: "42,180 KM", price: "$28,490.00" },
  { image: car3, title: "2022 Toyota GR86",      km: "18,560 KM", price: "$32,990.00" },
  { image: car4, title: "2021 Chevy Silverado",  km: "55,720 KM", price: "$38,750.00" },
];

// Card width + gap in pixels (used for scroll calculations)
const SCROLL_AMOUNT = 314;

/*  Component */
const FeaturedVehicles = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Triple the array so we can loop seamlessly
  const duplicatedVehicles = [...vehicles, ...vehicles, ...vehicles];

  // Manual scroll handler
  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  // Infinite loop effect: auto-scroll + boundary reset
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const singleSetWidth = (SCROLL_AMOUNT + 24) * vehicles.length;

    // Start from the middle set so both directions work
    container.scrollLeft = singleSetWidth;

    const handleInfiniteScroll = () => {
      if (container.scrollLeft >= singleSetWidth * 2) {
        container.scrollLeft = singleSetWidth;
      }
      if (container.scrollLeft <= 0) {
        container.scrollLeft = singleSetWidth;
      }
    };

    const autoScroll = setInterval(() => {
      container.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
    }, 3000);

    container.addEventListener("scroll", handleInfiniteScroll);

    return () => {
      clearInterval(autoScroll);
      container.removeEventListener("scroll", handleInfiniteScroll);
    };
  }, []);

  return (
    <section className="w-full bg-background mt-[40px] mb-[50px] overflow-hidden font-carmax">
      <div className="max-w-[1280px] mx-auto px-[20px] py-12 relative">
        <h2 className="text-[34px] lg:text-[44px] font-bold text-foreground tracking-tight text-center mb-8">
          Shop featured vehicles
        </h2>

        <div className="relative">
          {/* Left scroll button */}
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="flex absolute left-0 md:-left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 md:h-10 md:w-10 rounded-full bg-card border border-border shadow-md items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>

          {/* Scrollable vehicle cards */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {duplicatedVehicles.map((v, index) => (
              <article
                key={`${v.title}-${index}`}
                className="snap-start shrink-0 w-[290px] rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Square vehicle image */}
                <div className="aspect-square bg-muted">
                  <img
                    src={v.image.src}
                    alt={v.title}
                    width={1024}
                    height={768}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Vehicle info */}
                <div className="p-5">
                  <h3 className="text-[18px] font-bold text-foreground">{v.title}</h3>
                  <p className="text-[14px] text-foreground/70 mt-1">{v.km}</p>
                  <div className="border-t border-border my-4" />
                  <p className="text-[22px] font-bold text-price-green">{v.price}</p>
                  <p className="text-[13px] text-muted-foreground mt-1">Excl. HST &amp; licensing</p>
                </div>
              </article>
            ))}
          </div>

          {/* Right scroll button */}
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="flex absolute right-0 md:-right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 md:h-10 md:w-10 rounded-full bg-card border border-border shadow-md items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;
