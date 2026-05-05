import { Zap, Car, Bus, Truck, PiggyBank } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

type Category = {
  label: string;
  icon?: LucideIcon;
  queryParams?: string;
};

const categories: Category[] = [
  { label: "EVs", icon: Zap, queryParams: "fuel_type=Electric" },
  { label: "Sedans", icon: Car, queryParams: "body_type=Sedan|Sedan 4 Dr." },
  { label: "Used", icon: Car, queryParams: "" },
  { label: "Vans", icon: Bus, queryParams: "body_type=Van|Passenger Van|Cargo Van" },
  { label: "SUVs", icon: Truck, queryParams: "body_type=SUV|Sport Utility" },
  { label: "Hybrids", queryParams: "fuel_type=Hybrid" },
  { label: "Below $20k", icon: PiggyBank, queryParams: "price=0:20000" },
];

const CategoryPills = () => {
  return (
    <section className="w-full bg-background category_pills">
      <div className="mx-auto flex max-w-[1400px] flex-wrap justify-center gap-4">
        {categories.map(({ label, icon: Icon, queryParams }) => (
          <Link
            key={label}
            href={`/inventory${queryParams ? `?${queryParams}` : ""}`}
            className="flex items-center gap-2 rounded-lg border-2 border-brand-green/70 bg-background px-8 py-4 text-brand-green font-semibold text-[17px] hover:bg-brand-green hover:text-brand-green-foreground transition-colors min-w-[150px] justify-center"
          >
            {Icon && <Icon className="h-5 w-5" strokeWidth={2.5} />}
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryPills;
