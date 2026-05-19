import { ArrowRight } from "lucide-react";
import Link from "next/link";
import shopCars from "@/assets/card-shop-cars.jpg";
import tradeIn from "@/assets/card-trade-in.jpg";
import preQualified from "@/assets/card-pre-qualified.jpg";

type Card = {
  image: any;
  alt: string;
  title: string;
  subtitle: string;
  to: string;
};

const cards: Card[] = [
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

const NextRide = () => {
  return (
    /* next_ride_section: margin-top 50px */
    <section className="w-full bg-background mt-[50px]">
      {/* next_ride_section .container_box: max-w-[1280px] mx-auto px-[20px] */}
      <div className="max-w-[1280px] mx-auto px-[20px]">
        <h2 className="text-[34px] lg:text-[44px] font-extrabold text-foreground tracking-tight mb-8">
          Let&apos;s find your next ride
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.to}
              className="group rounded-2xl border border-border bg-card overflow-hidden flex flex-col hover:shadow-md transition-shadow"
            >
              <div className="aspect-[4/4] overflow-hidden bg-muted">
                <img
                  src={card.image.src}
                  alt={card.alt}
                  width={768}
                  height={960}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <div className="flex items-center justify-between gap-4 px-2 py-5">
                <div className="opacity-70">
                  <h3 className="text-[18px] font-bold text-foreground">
                    {card.title}
                  </h3>
                  {/* next_ride_section p: font-size 16px */}
                  <p className="text-[16px]  mt-1">
                    {card.subtitle}
                  </p>
                </div>
                <ArrowRight
                  className="h-6 w-6 text-brand-green shrink-0 group-hover:translate-x-1 transition-transform"
                  strokeWidth={2.5}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NextRide;
