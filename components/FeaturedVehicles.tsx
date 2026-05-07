import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import car1 from "@/assets/car-kia-forte.jpg";
import car2 from "@/assets/car-featured-2.jpg";
import car3 from "@/assets/car-featured-3.jpg";
import car4 from "@/assets/car-featured-4.jpg";

type Vehicle = {
  image: any;
  title: string;
  km: string;
  price: string;
};

const vehicles: Vehicle[] = [
  { image: car1, title: "2024 KIA Forte", km: "61,294 KM", price: "$20,990.00" },
  { image: car2, title: "2023 Hyundai Tucson", km: "42,180 KM", price: "$28,490.00" },
  { image: car3, title: "2022 Toyota GR86", km: "18,560 KM", price: "$32,990.00" },
  { image: car4, title: "2021 Chevy Silverado", km: "55,720 KM", price: "$38,750.00" },
];

const FeaturedVehicles = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-background shop_featured_vehicle">
      <div className="mx-auto max-w-[1400px] px-6 py-12 relative">
        <h2 className="text-[34px] lg:text-[44px] font-extrabold text-foreground tracking-tight text-center mb-8">
          Shop featured vehicles
        </h2>

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {vehicles.map((v) => (
              <article
                key={v.title}
                className="snap-start shrink-0 w-[290px] rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/3] bg-muted">
                  <img
                    src={v.image.src}
                    alt={v.title}
                    width={1024}
                    height={768}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-[18px] font-bold text-foreground">{v.title}</h3>
                  <p className="text-[14px] text-foreground/70 mt-1">{v.km}</p>
                  <div className="border-t border-border my-4" />
                  <p className="text-[22px] font-bold text-price-green">{v.price}</p>
                  <p className="text-[13px] text-muted-foreground mt-1">Excl. HST &amp; licensing</p>
                </div>
              </article>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;
