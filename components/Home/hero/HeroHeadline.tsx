import HeroLine from "./HeroLine";
import { HERO_HEADLINE_CLASS } from "./constants";

import yellowSuv from "@/assets/cars/car-yellow-suv 1.png";
import whiteSuv from "@/assets/cars/car-white-suv 1.png";
import orangeTruck from "@/assets/cars/car-orange-truck 1.png";

interface HeroHeadlineProps {
  fullWidth?: boolean;
}

const HeroHeadline = ({ fullWidth = false }: HeroHeadlineProps) => {
  return (
    <div className={`w-full flex ${fullWidth ? 'justify-start' : 'justify-cente'}`}>
      <h1 className={`${HERO_HEADLINE_CLASS} ${fullWidth ? 'items-center text-center' : ''}`}>
        <HeroLine
          text="Buy or sell a"
          image={yellowSuv.src}
          imageAlt="Yellow SUV"
        />
        <HeroLine
          image={whiteSuv.src}
          imageAlt="White SUV"
          text="pre-owned"
          reverse
        />
        <HeroLine
          text="car."
          image={orangeTruck.src}
          imageAlt="Orange Truck"
          tagline="The way everyone deserves."
        />
      </h1>
    </div>
  );
};

export default HeroHeadline;
