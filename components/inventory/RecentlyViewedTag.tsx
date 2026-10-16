interface RecentlyViewedTagProps {
  variant?: "overlay" | "inline";
}

export function RecentlyViewedTag({
  variant = "overlay",
}: RecentlyViewedTagProps) {
  return (
    <span
      className={
        variant === "overlay"
          ? "absolute top-5 left-5 z-10 rounded-lg bg-white px-2 py-1.5 text-[13px] font-medium leading-none text-black border border-gray-500 "
          : "inline-flex items-center whitespace-nowrap rounded-lg bg-white px-2 py-1.5 text-[13px] font-medium leading-none text-black border border-gray-500 "
      }
    >
      Recently Viewed
    </span>
  );
}
