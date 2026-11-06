import { HitCardSkeleton } from "@/components/inventory/HitCardSkeleton";

export interface LocationInventorySkeletonProps {
  heading?: string;
  city?: string;
}

export default function LocationInventorySkeleton({
  heading,
  city,
}: LocationInventorySkeletonProps) {
  const displayHeading = heading || `Used Cars for Sale in ${city || "Ontario"}`;

  return (
    <div className="w-full bg-light-gray">
      {/* Top spacing / layout match */}
      <div className="lg:-mt-4 lg:px-14 px-3 py-[20px] max-w-[1550px] mx-auto">
        {/* Mobile search bar shimmer */}
        <div className="flex lg:hidden items-center gap-1.5 mb-3 p-[6px]">
          <div className="h-10 w-full bg-gray-200 animate-pulse rounded-[12px]" />
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-5">
          {/* Sidebar Skeleton (Desktop only) */}
          <aside className="hidden lg:flex lg:flex-col lg:shrink-0 lg:w-[320px] 2xl:w-[360px] space-y-3">
            {/* Filter header shimmer */}
            <div className="bg-white rounded-[16px] border border-border-standard p-4 shadow-2xs space-y-4">
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded-md" />
              <div className="h-10 w-full bg-gray-100 animate-pulse rounded-[10px]" />
              <div className="space-y-2 pt-2">
                <div className="h-5 w-24 bg-gray-200 animate-pulse rounded" />
                <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
                <div className="h-4 w-5/6 bg-gray-100 animate-pulse rounded" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-5 w-28 bg-gray-200 animate-pulse rounded" />
                <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
                <div className="h-4 w-4/6 bg-gray-100 animate-pulse rounded" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-5 w-20 bg-gray-200 animate-pulse rounded" />
                <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
              </div>
            </div>
          </aside>

          {/* Main Content Column Skeleton */}
          <div className="flex-1 w-full min-w-0 space-y-4">
            {/* Search + Sort Bar shimmer */}
            <div className="lg:px-3 lg:pt-2">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="h-[44px] w-full lg:max-w-[440px] bg-white border border-gray-200 animate-pulse rounded-[12px]" />
                <div className="h-[44px] w-48 bg-white border border-gray-200 animate-pulse rounded-[12px] self-end lg:self-auto" />
              </div>
            </div>

            {/* Location Wireframe Heading */}
            <div className="lg:px-3 pt-1">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h1 className="text-md text-gray-700 font-medium tracking-tight">
                  {displayHeading}
                </h1>
                <span className="text-sm font-normal text-gray-400">
                  · Loading inventory...
                </span>
              </div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 lg:gap-0 lg:gap-y-[1px]">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex flex-col h-full p-[9px]">
                  <HitCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
