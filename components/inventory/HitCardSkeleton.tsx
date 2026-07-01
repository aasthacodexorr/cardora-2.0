/* =========================
   HitCardSkeleton Component
   ========================= */
const HitCardSkeleton = () => {
  return (
    <div className="flex flex-col h-full p-[9px] w-full bg-white border border-gray-200 rounded-[15px] shadow-sm animate-pulse">
      {/* Aspect Ratio Image Container */}
      <div className="w-full aspect-[16/10] bg-gray-200 rounded-t-[12px]" />
      
      {/* Content details */}
      <div className="flex flex-col flex-1 p-4 space-y-3">
        {/* Title & Year */}
        <div className="h-5 bg-gray-200 rounded-md w-3/4" />
        
        {/* Odometer and Trim */}
        <div className="h-4 bg-gray-200 rounded-md w-1/2" />
        
        {/* Separator line */}
        <div className="border-t border-gray-100 my-1" />
        
        {/* Pricing / Bottom Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="h-6 bg-gray-200 rounded-md w-1/3" />
          <div className="h-8 bg-gray-200 rounded-xl w-1/4" />
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
        <div key={index} className="p-[9px]">
          <HitCardSkeleton />
        </div>
      ))}
    </div>
  );
};