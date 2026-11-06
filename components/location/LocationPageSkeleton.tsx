import LocationInventorySkeleton from "./LocationInventorySkeleton";

export default function LocationPageSkeleton({ city }: { city?: string }) {
  return (
    <div className="w-full bg-light-gray">
      {/* Inventory Skeleton */}
      <LocationInventorySkeleton city={city} />

      {/* Separate Editorial Content Skeleton */}
      <section className="max-w-[1550px] mx-auto px-3 lg:px-14 py-8">
        <div className="bg-white rounded-2xl border border-border-standard p-6 sm:p-8 lg:p-12 shadow-2xs space-y-6">
          <div className="h-8 w-64 bg-gray-200 animate-pulse rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 pt-4 border-b border-gray-100 pb-8">
            <div className="space-y-3">
              <div className="h-6 w-36 bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
              <div className="h-4 w-5/6 bg-gray-100 animate-pulse rounded" />
              <div className="h-4 w-4/6 bg-gray-100 animate-pulse rounded" />
            </div>
            <div className="space-y-3">
              <div className="h-6 w-36 bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
              <div className="h-4 w-5/6 bg-gray-100 animate-pulse rounded" />
              <div className="h-4 w-3/4 bg-gray-100 animate-pulse rounded" />
            </div>
          </div>
          <div className="space-y-3 pt-2">
            <div className="h-6 w-48 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
            <div className="h-4 w-2/3 bg-gray-100 animate-pulse rounded" />
          </div>
        </div>
      </section>
    </div>
  );
}
