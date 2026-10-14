"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getVehicleFeatures } from "./vehicleFeaturesConfig";

type VehicleFeaturesProps = {
  bodyType?: string | null;
};

export default function VehicleFeatures({ bodyType }: VehicleFeaturesProps) {
  const carouselRef = useRef<HTMLUListElement>(null);
  const [unavailableAssets, setUnavailableAssets] = useState<Set<string>>(
    () => new Set(),
  );
  const features = getVehicleFeatures(bodyType);

  if (features.length === 0) return null;

  const markAssetUnavailable = (asset: string) => {
    setUnavailableAssets((previous) => new Set(previous).add(asset));
  };

  const scroll = (direction: "left" | "right") => {
    const carousel = carouselRef.current;
    const firstCard = carousel?.querySelector<HTMLElement>("[data-feature-card]");
    if (!carousel || !firstCard) return;

    const gap = Number.parseFloat(getComputedStyle(carousel).columnGap) || 0;
    carousel.scrollBy({
      left: direction === "left" ? -(firstCard.offsetWidth + gap) : firstCard.offsetWidth + gap,
      behavior: "smooth",
    });
  };

  return (
    <section className="mt-10 w-full px-4 md:px-10" aria-labelledby="vehicle-features-heading">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2
            id="vehicle-features-heading"
            className="text-[20px] lg:text-[26px] font-semibold text-black"
          >
            Even more to love
          </h2>
          <h1 className="text-[25px] lg:text-[35px] mt-1 w-full lg:max-w-xl font-semibold leading-tight text-black">
            Maintains your set distance, warns of blind-spot traffic, and folds rear seats flat.
          </h1>
        </div>
        {features.length > 1 && (
          <div className="shrink-0 items-center gap-1 hidden sm:flex">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Previous vehicle features"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Next vehicle features"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      <ul
        ref={carouselRef}
        aria-label="Vehicle features carousel"
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch] [touch-action:pan-x_pan-y]"
      >
        {features.map((feature) => {
          const image = feature.image;
          const video = feature.video;
          const asset = image?.src ?? video;
          const assetUnavailable = !asset || unavailableAssets.has(asset);

          return (
            <li
              key={feature.id}
              data-feature-card
              className="flex w-[72%] shrink-0 snap-start flex-col sm:w-[42%] md:w-[31%] lg:w-[28%]"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100">
                {!assetUnavailable && image && (
                  <Image
                    src={image}
                    alt={feature.name}
                    width={image.width}
                    height={image.height}
                    className="h-full w-full object-cover"
                    onError={() => markAssetUnavailable(image.src)}
                  />
                )}
                {!assetUnavailable && video && (
                  <video
                    src={video}
                    aria-label={feature.name}
                    autoPlay
                    muted
                    loop
                    preload="metadata"
                    className="h-full w-full object-cover"
                    onError={() => markAssetUnavailable(video)}
                  />
                )}
                {assetUnavailable && (
                  <span className="flex h-full items-center justify-center px-3 text-sm text-gray-500">
                    Image unavailable
                  </span>
                )}
              </div>
              {feature.category && (
                <p className="my-2 text-[14px] leading-4 text-gray-500">
                  {feature.category}
                </p>
              )}
              <h3
                className={`${feature.category ? "" : "mt-2"}text-[16px] font-semibold leading-4 text-gray-900`}
              >
                {feature.name}
              </h3>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
