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
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getFeaturedVehicles, type FeaturedVehicle } from "@/lib/featuredVehicles";
import { useAppConfig } from "@/app/providers";

type DisplayVehicle = {
  id: string;
  image: string;
  title: string;
  km: string;
  price: string;
};

const SCROLL_AMOUNT = 314; // Card width (290px) + Gap (24px)

export default function FeaturedVehicles() {
  const appConfig = useAppConfig();
  const [vehicles, setVehicles] = useState<DisplayVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isResetting = useRef(false);

  useEffect(() => {
    getFeaturedVehicles(appConfig)
      .then((data) => {
        if (data.length === 0) {
          setVehicles([]);
          return;
        }

        const displayVehicles: DisplayVehicle[] = data.map((vehicle) => {
          // Get image from static_images or fallback
          let imageUrl = "";
          if (vehicle.static_images?.length) {
            imageUrl = vehicle.static_images.find((img) => img.active === "1")?.image_url || vehicle.static_images[0].image_url;
          }

          // Prepend CDN URL if relative path
          if (imageUrl?.startsWith("/")) {
            imageUrl = `${appConfig.site.cdn_api}${imageUrl}`;
          }

          const displayPrice = vehicle.price || vehicle.selling_price || 0;
          const displayKm = vehicle.odometer || 0;

          return {
            id: vehicle.id,
            image: imageUrl,
            title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
            km: `${displayKm.toLocaleString()} ${vehicle.km_miles === "Miles" ? "Miles" : "KM"}`,
            price: `$${displayPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          };
        });

        setVehicles(displayVehicles);
      })
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current || isResetting.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || vehicles.length === 0) return;

    const singleSetWidth = SCROLL_AMOUNT * vehicles.length;
    container.scrollLeft = singleSetWidth;

    const handleScrollEnd = () => {
      if (!container) return;

      if (container.scrollLeft >= singleSetWidth * 2) {
        isResetting.current = true;
        container.style.scrollBehavior = "auto";
        container.scrollLeft = container.scrollLeft - singleSetWidth;
        container.style.scrollBehavior = "smooth";
        isResetting.current = false;
      }

      if (container.scrollLeft <= SCROLL_AMOUNT) {
        isResetting.current = true;
        container.style.scrollBehavior = "auto";
        container.scrollLeft = container.scrollLeft + singleSetWidth;
        container.style.scrollBehavior = "smooth";
        isResetting.current = false;
      }
    };

    container.addEventListener("scrollend", handleScrollEnd);
    return () => container.removeEventListener("scrollend", handleScrollEnd);
  }, [vehicles.length]);

  if (loading || vehicles.length === 0) return null;

  const duplicatedVehicles = [...vehicles, ...vehicles, ...vehicles];

  return (
    <section className="w-full bg-background mt-[40px] mb-[50px] overflow-hidden font-carmax">
      <div className="max-w-[1280px] mx-auto px-[23px] lg:px-[20px] py-10 lg:py-12 relative">
        <h2 className="text-[28px] lg:text-[44px] lg:font-bold text-foreground tracking-tight text-center mb-12 lg:mb-8">
          Shop featured vehicles
        </h2>

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="flex absolute left-0 md:-left-3 top-1/2 cursor-pointer -translate-y-1/2 z-10 h-9 w-9 md:h-10 md:w-10 rounded-full bg-card border border-border shadow-md items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {duplicatedVehicles.map((v, index) => (
              <article
                key={`${v.id}-${index}`}
                className="snap-start shrink-0 w-full lg:w-[290px] rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-muted">
                  <Image
                    src={v.image}
                    alt={v.title}
                    width={290}
                    height={290}
                    className="w-full h-full object-cover"
                    priority={index < 3}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='290' height='290'%3E%3Crect fill='%23f0f0f0' width='290' height='290'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-family='sans-serif' font-size='14'%3EImage not available%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-[18px] font-bold text-foreground">{v.title}</h3>
                  <p className="text-[14px] text-foreground/70 mt-1">{v.km}</p>
                  <div className="border-t border-border my-4" />
                  <p className="text-[22px] font-bold text-price-green">{v.price}</p>
                  {/* <p className="text-[13px] text-muted-foreground mt-1">Excl. HST &amp; licensing</p> */}
                </div>
              </article>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="flex absolute right-0 md:-right-3 top-1/2 cursor-pointer -translate-y-1/2 z-10 h-9 w-9 md:h-10 md:w-10 rounded-full bg-card border border-border shadow-md items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
}
