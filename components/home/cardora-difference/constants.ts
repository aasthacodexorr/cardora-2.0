import type { DifferenceItem } from "./types";

export const ITEMS: Omit<DifferenceItem, 'icon'>[] = [
  {
    text: "Upfront prices, Cardora Certified quality, and detailed history reports on every car",
  },
  {
    text: "Shop online, in-store, or both. We provide no-pressure help along the way.",
  },
  {
    text: "6-month or 10,000 km limited warranty (whichever comes first)",
  },
];

export const CONTAINER_CLASS = "mx-auto max-w-[1400px] md:px-12 px-5 py-14 ";

export const GRID_CLASS = "flex justify-center gap-[30px] lg:gap-[40px] flex-col lg:flex-row";

export const CARD_CLASS = "rounded-[15px] overflow-hidden min-h-[280px] bg-[#e6f4ff] pt-[40px] pr-[25px] pb-[40px] pl-[25px] w-full lg:max-w-[400px] lg:min-w-[300px]";
