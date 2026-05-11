import Image from "next/image";

import CheckIcon from "../assets/CHECK_ICON.svg";
import MapIcon from "../assets/MAP-ICON.svg";
import HeartIcon from "../assets/HEART-ICON.svg";

const items = [
  {
    icon: (
      <Image
        src={CheckIcon}
        alt="Check Icon"
        width={28}
        height={28}
        className="h-7 w-7"
      />
    ),
    text: "Upfront prices, Cardora Certified quality, and detailed history reports on every car",
  },
  {
    icon: (
      <Image
        src={MapIcon}
        alt="Map Icon"
        width={28}
        height={28}
        className="h-7 w-7"
      />
    ),
    text: "Shop online, in-store, or both. We provide no-pressure help along the way.",
  },
  {
    icon: (
      <Image
        src={HeartIcon}
        alt="Heart Icon"
        width={28}
        height={28}
        className="h-7 w-7"
      />
    ),
    text: "6-month or 10,000 km limited warranty (whichever comes first)",
  },
];

const CardoraDifference = () => {
  return (
    // added class cardora_diff 
    <section className="w-full bg-background cardora_diff">
      <div className="mx-auto max-w-[1400px] px-6 py-14">
        
        <h2 className="text-[34px] lg:text-[44px] font-extrabold text-foreground tracking-tight mb-10">
          The Cardora difference
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div key={idx} className="rounded-2xl bg-diff-card p-8">
              
              <div className="image_car">
                {item.icon}
              </div>

              <p className="text-[17px] text-foreground leading-relaxed">
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