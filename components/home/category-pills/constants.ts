import {
  faBolt,
  faCar,
  faVanShuttle,
  faCarSide,
  faPiggyBank,
} from "@fortawesome/free-solid-svg-icons";
import type { Category } from "./types";
import { getInventoryUrlByQuery } from "@/lib/inventoryUrls";

export const CATEGORIES : Category[] = [
  {
    label: "EVs",
    icon: faBolt,
    href: getInventoryUrlByQuery("electic"),
  },
  {
    label: "Sedans",
    icon: faCar,
    href: getInventoryUrlByQuery("sedan"),
  },
   {
    label: "Used",
    icon: faCar,
    href: getInventoryUrlByQuery("used"),
  },
  {
    label: "Vans",
    icon: faVanShuttle,
    href: getInventoryUrlByQuery("van"),
  },
  {
    label: "SUVs",
    icon: faCarSide,
    href: getInventoryUrlByQuery("suv"),
  },
  {
    label: "Hybrids",
    icon: null,
    href: getInventoryUrlByQuery("Hybrids"),
  },
  {
    label: "Below $20k",
    icon: faPiggyBank,
    href: getInventoryUrlByQuery("price=0:20000"),
  },
];
 
export const PILL_CLASS = "my-5 flex items-center px-9 gap-[0.5px] rounded-[12px] border border-[#00b066] bg-white py-4 text-[#00b066] font-medium text-base justify-center hover:bg-[linear-gradient(180deg,#00af66a6,#00af66)] hover:text-white transition-all duration-200 snap-start shrink-0";

export const CONTAINER_CLASS = "mx-[19px] md:mx-auto flex md:items-center md:justify-center overflow-x-auto gap-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory py-5";
