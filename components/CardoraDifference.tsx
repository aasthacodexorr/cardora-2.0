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
        width={77}
        height={77}
        className="w-[77px] h-[77px] rounded-[20px]"
      />
    ),
    text: "Upfront prices, Cardora Certified quality, and detailed history reports on every car",
  },
  {
    icon: (
      <Image
        src={MapIcon}
        alt="Map Icon"
        width={77}
        height={77}
        className="w-[77px] h-[77px] rounded-[20px]"
      />
    ),
    text: "Shop online, in-store, or both. We provide no-pressure help along the way.",
  },
  {
    icon: (
      <Image
        src={HeartIcon}
        alt="Heart Icon"
        width={77}
        height={77}
        className="w-[77px] h-[77px] rounded-[20px]"
      />
    ),
    text: "6-month or 10,000 km limited warranty (whichever comes first)",
  },
];

const CardoraDifference = () => {
  return (
    <section className="w-full bg-background">
      <div className="mx-auto max-w-[1400px] md:px-10 px-5 py-14">

        <h2 className="text-[34px] lg:text-[44px] font-extrabold text-foreground tracking-tight mb-10">
          The Cardora difference
        </h2>

        {/* gap-[40px] replaces .cardora_diff .grid { gap: 40px } */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[40px]">
          {items?.map((item, idx) => (
            // .cardora_diff .bg-diff-card styles applied directly
            <div
              key={idx}
              className="rounded-[15px] overflow-hidden min-h-[280px] bg-[#e6f4ff] pt-[40px] pr-[25px] pb-[40px] pl-[25px] text-[20px] text-[#000]"
            >
              {item.icon}

              {/* .cardora_diff p: font-size 20px, color #000, margin-top 15px */}
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
