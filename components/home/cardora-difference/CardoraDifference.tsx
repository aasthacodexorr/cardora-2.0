/* =========================
   CardoraDifference Component (Home)
   "The Cardora difference" section on the homepage.
   Displays three value-proposition cards, each with
   a custom SVG icon and a short description.
   Used on the homepage and referenced in ProtectionPlans.
========================= */

import Image from "next/image";
import DifferenceCard from "./DifferenceCard";
import { ITEMS, CONTAINER_CLASS, GRID_CLASS } from "./constants";

import CheckIcon from "@/assets/icons/CHECK_ICON.svg";
import MapIcon   from "@/assets/icons/MAP-ICON.svg";
import HeartIcon from "@/assets/icons/HEART-ICON.svg";

const icons = [
  <Image src={CheckIcon} alt="Check Icon" width={77} height={77} className="w-[77px] h-[77px] rounded-[20px]" />,
  <Image src={MapIcon} alt="Map Icon" width={77} height={77} className="w-[77px] h-[77px] rounded-[20px]" />,
  <Image src={HeartIcon} alt="Heart Icon" width={77} height={77} className="w-[77px] h-[77px] rounded-[20px]" />,
];

const CardoraDifference = () => {
  return (
    <section className="w-full bg-background">
      <div className={CONTAINER_CLASS}>
        <h2 className="text-[34px] lg:text-[44px] font-bold text-foreground tracking-tight mb-10">
          The Cardora difference
        </h2>

        {/* Three value-prop cards */}
        <div className={GRID_CLASS}>
          {ITEMS.map((item, idx) => (
            <DifferenceCard
              key={idx}
              icon={icons[idx]}
              text={item.text}
              body=""
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardoraDifference;
