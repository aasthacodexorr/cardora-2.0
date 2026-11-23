/* =========================
   FeaturedVehicles Component (Home)
   Auto-scrolling carousel of featured vehicles.
   - Responsive: shows 1 / 2 / 3 slides based on viewport like reviews
   - Only shows navigation arrows if there are more than 3 vehicles
   - Seamless infinite loop when more than 3 vehicles
   - Native touch/swipe scrollable
========================= */

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getFeaturedVehicles } from "@/lib/featuredVehicles";
import { useAppConfig } from "@/app/providers";
import cardoraImg from "@/assets/brand/defaultImage.webp";

type DisplayVehicle = {
  id: string;
  image: string;
  title: string;
  km: string;
  price: string;
};

const defaultImg = cardoraImg?.src;

export default function FeaturedVehicles() {
  const appConfig = useAppConfig();
  const [vehicles, setVehicles] = useState<DisplayVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [slidesToShow, setSlidesToShow] = useState(3);

  const hasMoreThanThree = vehicles.length > 3;
  // Only duplicate if we have more than 3 vehicles to support infinite carousel looping
  const displayVehicles =  [...vehicles, ...vehicles, ...vehicles]

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 767) setSlidesToShow(1);
      else if (window.innerWidth < 1024) setSlidesToShow(2);
      else setSlidesToShow(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
            imageUrl =
              vehicle.static_images.find((img) => img.active === "1")?.image_url ||
              vehicle.static_images[0].image_url;
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
            price: `$${displayPrice.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
          };
        });

        setVehicles(displayVehicles);
      })
      .finally(() => setLoading(false));
  }, []);

  const getScrollAmount = () => {
    if (!scrollRef.current) return 0;
    const firstChild = scrollRef.current.querySelector("[data-slide]") as HTMLElement | null;
    return firstChild ? firstChild.offsetWidth : scrollRef.current.clientWidth / slidesToShow;
  };

  const checkBoundary = () => {
    if (!hasMoreThanThree) return;
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = getScrollAmount();
    const singleSetWidth = scrollAmount * vehicles.length;
    if (!singleSetWidth) return;

    if (container.scrollLeft >= singleSetWidth * 2 - 5) {
      container.style.scrollBehavior = "auto";
      container.scrollLeft -= singleSetWidth;
      void container.offsetWidth;
      container.style.scrollBehavior = "smooth";
    } else if (container.scrollLeft <= singleSetWidth - scrollAmount) {
      container.style.scrollBehavior = "auto";
      container.scrollLeft += singleSetWidth;
      void container.offsetWidth;
      container.style.scrollBehavior = "smooth";
    }
  };

  const scroll = (dir: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = getScrollAmount();
    if (!scrollAmount) return;

    if (hasMoreThanThree) {
      const singleSetWidth = scrollAmount * vehicles.length;

      // Pre-check boundary before scrolling to wrap around seamlessly
      if (dir === "right" && container.scrollLeft >= singleSetWidth * 2 - scrollAmount) {
        container.style.scrollBehavior = "auto";
        container.scrollLeft -= singleSetWidth;
        void container.offsetWidth;
      } else if (dir === "left" && container.scrollLeft <= singleSetWidth) {
        container.style.scrollBehavior = "auto";
        container.scrollLeft += singleSetWidth;
        void container.offsetWidth;
      }
    }

    container.style.scrollBehavior = "smooth";
    container.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      checkBoundary();
    }, 400);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || vehicles.length === 0) return;

    if (hasMoreThanThree) {
      const scrollAmount = getScrollAmount();
      const singleSetWidth = scrollAmount * vehicles.length;

      if (container.scrollLeft === 0) {
        container.scrollLeft = singleSetWidth;
      }

      const handleScroll = () => {
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          checkBoundary();
        }, 150);
      };

      container.addEventListener("scroll", handleScroll, { passive: true });
      container.addEventListener("scrollend", checkBoundary);

      return () => {
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        container.removeEventListener("scroll", handleScroll);
        container.removeEventListener("scrollend", checkBoundary);
      };
    } else {
      container.scrollLeft = 0;
    }
  }, [vehicles.length, slidesToShow, hasMoreThanThree]);

  if (loading || vehicles.length === 0) return null;

  return (
    <section className="w-full bg-background mt-[36px] mb-[35px] overflow-hidden font-carmax">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10 lg:py-12 relative">
        <h2 className="text-[28px] lg:text-[44px] lg:font-bold text-foreground tracking-tight text-center mb-12 lg:mb-8">
          Shop featured vehicles
        </h2>

        <div className="relative mt-5 lg:mt-0 px-4 md:px-0">
          {hasMoreThanThree && (
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="flex absolute left-0 md:-left-3 top-1/2 cursor-pointer -translate-y-1/2 z-10 h-9 w-9 md:h-10 md:w-10 rounded-full bg-card border border-border shadow-md items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
          )}

          <div
            ref={scrollRef}
            className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full snap-x snap-mandatory"
          >
            <div
              className={`flex w-full py-2 ${
                !hasMoreThanThree && vehicles.length === 1 ? "justify-center" : ""
              }`}
            >
              {displayVehicles.map((v, index) => {
                const isPlaceholder =
                  !v.image ||
                  v.image === defaultImg ||
                  (typeof v.image === "string" &&
                    (v.image.includes("default-placeholder") ||
                      v.image.includes("1659125544_f21e016f7d07e43069d9") ||
                      v.image.includes("1691004750_0b3143a68b415b9465e9")));

                return (
                  <div
                    key={`${v.id}-${index}`}
                    data-slide
                    className={`snap-center shrink-0 lg:flex-shrink-0 px-2 md:px-3 ${
                      slidesToShow === 1 ? "w-full" : slidesToShow === 2 ? "w-1/2" : "w-1/3"
                    }`}
                  >
                    <article className="rounded-[20px] border border-border-standard bg-white overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-[19px] bg-white">
                        <Image
                          src={v.image || defaultImg}
                          alt={v.title}
                          fill
                          sizes="(max-width: 640px) 280px, (max-width: 1024px) 340px, 400px"
                          className={`w-full h-full ${
                            isPlaceholder ? "object-cover" : "object-contain"
                          } transition-transform duration-500 hover:scale-105`}
                          priority={index < 3}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = defaultImg;
                            target.classList.remove("object-contain");
                            target.classList.add("object-cover");
                          }}
                        />
                      </div>

                    <div className="p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="text-[18px] font-bold text-foreground line-clamp-1">
                          {v.title}
                        </h3>
                        <p className="text-[14px] text-foreground/70 mt-1">{v.km}</p>
                      </div>
                      <div>
                        <div className="border-t border-border my-4" />
                        <p className="text-[22px] font-bold text-price-green">{v.price}</p>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
            </div>
          </div>

          {hasMoreThanThree && (
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="flex absolute right-0 md:-right-3 top-1/2 cursor-pointer -translate-y-1/2 z-10 h-9 w-9 md:h-10 md:w-10 rounded-full bg-card border border-border shadow-md items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
