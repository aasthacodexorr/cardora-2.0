/* =========================
   Hero Component (Home)
   Homepage hero section.
   - Left side: animated headline with inline car images
   - Right side: search panel with text input, "Browse all Cars"
     button, and a "Get a valuation" sell CTA
   Handles search input and navigates to /inventory on submit.
========================= */

import HeroHeadline from "./HeroHeadline";
import HeroSearchPanel from "./HeroSearchPanel";

const Hero = () => {
  return (
    <section className="w-full px-6 md:px-8 bg-[#c4eafa] lg:mt-18">
      <div className="mx-auto flex flex-col items-center gap-8 md:gap-12 max-w-[1600px]
                      lg:flex-row lg:items-center lg:justify-center lg:pt-[87px] lg:pb-[75px]
                      md:pt-[60px] md:pb-[60px]
                      pt-[40px] pb-[30px]">

        <HeroHeadline />
        <HeroSearchPanel />

      </div>
    </section>
  );
};

export default Hero;
