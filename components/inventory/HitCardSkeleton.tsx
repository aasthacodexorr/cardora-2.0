"use client";

import { useEffect, useState } from "react";

/* =========================
   HitCardSkeleton Component
   ========================= */
export const HitCardSkeleton = () => {
  return (
    <div className="flex flex-col h-full w-full bg-white border border-border-standard rounded-[20px] overflow-hidden">
      {/* Match HitCard image box so shimmer → card swap stays height-stable */}
      <div className="relative overflow-hidden rounded-t-[19px] p-3">
        <div className="inventory-shimmer w-full min-h-[240px] h-[240px] 2xl:min-h-[260px] 2xl:h-[260px] rounded-xl">
          <span className="inventory-shimmer-sweep" aria-hidden />
        </div>
      </div>

      <div className="flex flex-col flex-1 px-[15px] pt-3 pb-0 space-y-0">
        <div className="inventory-shimmer h-[44px] rounded-md w-3/4">
          <span className="inventory-shimmer-sweep" aria-hidden />
        </div>
        <div className="border-t border-gray-200 mt-[4px]" />
        <div className="inventory-shimmer h-5 mt-2 rounded-md w-1/2">
          <span className="inventory-shimmer-sweep" aria-hidden />
        </div>
        <div className="inventory-shimmer h-[14px] mt-[10px] rounded-md w-2/5">
          <span className="inventory-shimmer-sweep" aria-hidden />
        </div>
        <div className="border-t border-gray-200 my-2" />
        <div className="inventory-shimmer h-3 mb-2 rounded-md w-1/3">
          <span className="inventory-shimmer-sweep" aria-hidden />
        </div>
      </div>

      <div className="w-full rounded-[12px] mb-3 px-3 mt-auto flex gap-1">
        <div className="inventory-shimmer h-[42px] w-26 rounded-[12px]">
          <span className="inventory-shimmer-sweep" aria-hidden />
        </div>
        <div className="inventory-shimmer h-[42px] flex-1 rounded-[12px]">
          <span className="inventory-shimmer-sweep" aria-hidden />
        </div>
      </div>
    </div>
  );
};

/* Grid Wrapper matching your exact CustomInfiniteHits layout */
export const InventoryGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 lg:gap-0 lg:gap-y-[1px]">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex flex-col h-full p-[9px]">
          <HitCardSkeleton />
        </div>
      ))}
    </div>
  );
};

function getLoadMoreSkeletonCount() {
  if (typeof window === "undefined") return 1;
  if (window.matchMedia("(min-width: 1280px)").matches) return 3;
  if (window.matchMedia("(min-width: 640px)").matches) return 2;
  return 1;
}

/** Matches inventory grid: 1 col <640, 2 cols 640–1279, 3 cols ≥1280. */
function useLoadMoreSkeletonCount() {
  const [count, setCount] = useState(getLoadMoreSkeletonCount);

  useEffect(() => {
    const sm = window.matchMedia("(min-width: 640px)");
    const xl = window.matchMedia("(min-width: 1280px)");

    const update = () => setCount(getLoadMoreSkeletonCount());

    update();
    // Safari < 14 uses addListener; modern uses addEventListener.
    const listen = (mq: MediaQueryList) => {
      if (typeof mq.addEventListener === "function") {
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
      }
      mq.addListener(update);
      return () => mq.removeListener(update);
    };

    const unsm = listen(sm);
    const unxl = listen(xl);
    return () => {
      unsm();
      unxl();
    };
  }, []);

  return count;
}

/* Load-more shimmer: 1 / 2 / 3 cards by viewport (JS breakpoints — Safari-safe). */
export const InventoryLoadMoreSkeleton = () => {
  const count = useLoadMoreSkeletonCount();

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`load-more-skeleton-${index}`}
          className="flex flex-col h-full p-[9px]"
        >
          <HitCardSkeleton />
        </div>
      ))}
    </>
  );
};
