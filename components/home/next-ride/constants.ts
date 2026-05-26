import shopCars     from "@/assets/cards/card-shop-cars.jpg";
import tradeIn      from "@/assets/cards/card-trade-in.jpg";
import preQualified from "@/assets/cards/card-pre-qualified.jpg";
import type { Card } from "./types";

export const CARDS: Card[] = [
  {
    image: shopCars,
    alt: "Aerial view of cars in a dealership lot",
    title: "Shop all cars",
    subtitle: "A wide selection, updated daily",
    to: "/inventory",
  },
  {
    image: tradeIn,
    alt: "Person handing over car keys",
    title: "Start with a trade-in",
    subtitle: "Get an offer in under 2 mins.",
    to: "#",
  },
  {
    image: preQualified,
    alt: "Smiling woman holding phone with approval",
    title: "Get pre-qualified",
    subtitle: "No impact to your credit",
    to: "#",
  },
  
];

export const CONTAINER_CLASS = "max-w-[1280px] mx-auto px-[20px]";

export const GRID_CLASS = "flex  justify-center gap-6";
