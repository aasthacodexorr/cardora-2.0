import {
  faBolt,
  faCar,
  faVanShuttle,
  faCarSide,
  faPiggyBank,
} from "@fortawesome/free-solid-svg-icons";
import type { Category } from "./types";

export const CATEGORIES: Category[] = [
  { label: "EVs",         icon: faBolt,       queryParams: "fuel_type=Electric" },
  { label: "Sedans",      icon: faCar,        queryParams: "body_type=Sedan|Sedan 4 Dr." },
  { label: "Used",        icon: faCar,        queryParams: "" },
  { label: "Vans",        icon: faVanShuttle, queryParams: "body_type=Van|Passenger Van|Cargo Van" },
  { label: "SUVs",        icon: faCarSide,    queryParams: "body_type=SUV|Sport Utility" },
  { label: "Hybrids",                         queryParams: "fuel_type=Hybrid" },
  { label: "Below $20k",  icon: faPiggyBank,  queryParams: "price=0:20000" },
];

export const PILL_CLASS = "flex items-center px-9 gap-2 rounded-[12px] border border-[#00b066] bg-white py-3 text-[#00b066] font-medium text-base justify-center hover:bg-[linear-gradient(180deg,#00af66a6,#00af66)] hover:text-white transition-all duration-200 snap-start shrink-0";

export const CONTAINER_CLASS = "mx-[15px] md:mx-auto flex md:items-center md:justify-center overflow-x-auto gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory py-5";
