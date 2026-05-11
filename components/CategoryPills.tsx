import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faBolt,
  faCar,
  faVanShuttle,
  faCarSide,
  faPiggyBank,
} from "@fortawesome/free-solid-svg-icons";

type Category = {
  label: string;
  icon?: any;
  queryParams?: string;
};

const categories: Category[] = [
  { label: "EVs", icon: faBolt, queryParams: "fuel_type=Electric" },
  { label: "Sedans", icon: faCar, queryParams: "body_type=Sedan|Sedan 4 Dr." },
  { label: "Used", icon: faCar, queryParams: "" },
  {
    label: "Vans",
    icon: faVanShuttle,
    queryParams: "body_type=Van|Passenger Van|Cargo Van",
  },
  {
    label: "SUVs",
    icon: faCarSide,
    queryParams: "body_type=SUV|Sport Utility",
  },
  {
    label: "Hybrids",
    queryParams: "fuel_type=Hybrid",
  },
  {
    label: "Below $20k",
    icon: faPiggyBank,
    queryParams: "price=0:20000",
  },
];

const CategoryPills = () => {
  return (
    // added class category_pills 
    <section className="w-full bg-background category_pills">
      <div className="mx-auto flex max-w-[1400px] flex-wrap justify-center gap-4">
        {categories.map(({ label, icon, queryParams }) => (
          <Link
            key={label}
            href={`/inventory${queryParams ? `?${queryParams}` : ""}`}
            className="flex items-center gap-2 rounded-lg border-2 border-brand-green/70 bg-background px-8 py-4 text-brand-green font-semibold text-[17px] hover:bg-brand-green hover:text-brand-green-foreground transition-all duration-200 min-w-[150px] justify-center"
          >
            {icon && (
              <FontAwesomeIcon
                icon={icon}
                className="text-[18px] leading-none"
              />
            )}
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryPills;