/* =========================
   CardoraDifference Component (Home)
   "The Cardora difference" section on the homepage.
   Displays three value-proposition cards, each with
   a custom SVG icon and a short description.
   Used on the homepage and referenced in ProtectionPlans.
========================= */

import Image from "next/image";

import CheckIcon from "@/assets/icons/CHECK_ICON.svg";
import MapIcon   from "@/assets/icons/MAP-ICON.svg";
import HeartIcon from "@/assets/icons/HEART-ICON.svg";

/* ── Static Data ────────────────────────────────────────────── */
const items = [
  {
    icon: <Image src={CheckIcon} alt="Check Icon" width={77} height={77} className="w-[77px] h-[77px] rounded-[20px]" />,
    text: "Upfront prices, Cardora Certified quality, and detailed history reports on every car",
  },
  {
    icon: <Image src={MapIcon} alt="Map Icon" width={77} height={77} className="w-[77px] h-[77px] rounded-[20px]" />,
    text: "Shop online, in-store, or both. We provide no-pressure help along the way.",
  },
  {
    icon: <Image src={HeartIcon} alt="Heart Icon" width={77} height={77} className="w-[77px] h-[77px] rounded-[20px]" />,
    text: "6-month or 10,000 km limited warranty (whichever comes first)",
  },
];

/* ── Component ─────────────────────────────────────────────── */
const CardoraDifference = () => {
  return (
    <section className="w-full bg-background">
      <div className="mx-auto max-w-[1400px] md:px-10 px-5 py-14">
        <h2 className="text-[34px] lg:text-[44px] font-extrabold text-foreground tracking-tight mb-10">
          The Cardora difference
        </h2>

        {/* Three value-prop cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[40px]">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-[15px] overflow-hidden min-h-[280px] bg-[#e6f4ff] pt-[40px] pr-[25px] pb-[40px] pl-[25px]"
            >
              {item.icon}
              <p className="text-[20px] text-[#000] mt-[15px] leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardoraDifference;
