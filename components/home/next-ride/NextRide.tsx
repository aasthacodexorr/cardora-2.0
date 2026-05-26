/* =========================
   NextRide Component (Home)
   "Let's find your next ride" section on the homepage.
   Displays three action cards:
   - Shop all cars → /inventory
   - Start with a trade-in
   - Get pre-qualified
   Each card has an image, title, subtitle, and arrow icon.
========================= */

import NextRideCard from "./NextRideCard";
import { CARDS, CONTAINER_CLASS, GRID_CLASS } from "./constants";

const NextRide = () => {
  return (
    <section className="w-full bg-background mt-[50px]">
      <div className={CONTAINER_CLASS}>
        <h2 className="text-[34px] lg:text-[44px] font-extrabold text-foreground tracking-tight mb-8">
          Let&apos;s find your next ride
        </h2>

        <div className={GRID_CLASS}>
          {CARDS?.slice(0, 3).map((card) => (
            <NextRideCard
              key={card.title}
              image={card.image}
              alt={card.alt}
              title={card.title}
              subtitle={card.subtitle}
              to={card.to}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NextRide;
