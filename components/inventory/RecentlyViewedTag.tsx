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
          ? "absolute top-5 left-5 z-10 rounded-lg bg-brand px-2 py-1.5 text-[13px] font-medium leading-none text-white"
          : "inline-flex items-center whitespace-nowrap rounded-lg bg-brand px-2 py-1.5 text-[13px] font-medium leading-none text-white"
      }
    >
      Recently Viewed
    </span>
  );
}
