/* =========================
   Hero Component (Home)
   Homepage hero section.
   - Left side: animated headline with inline car images, or
     personalized Welcome Back message for returning visitors
   - Right side: search panel with text input, "Browse all Cars"
     button, and a "Get a valuation" sell CTA
   Handles search input and navigates to /inventory on submit.
========================= */

"use client";

import { useEffect } from "react";
import HeroHeadline from "./HeroHeadline";
import HeroSearchPanel from "./HeroSearchPanel";
import HeroWelcomeBack from "./HeroWelcomeBack";
import { useRecentlyViewed } from "@/lib/recentlyViewed";
import { useVisitorTracking } from "@/lib/visitorTracking";

const Hero = () => {
  const { recentlyViewedVehicles } = useRecentlyViewed();
  const { isHydrated } = useVisitorTracking();

  // Keep returning visitor class in sync once client hydration completes
  useEffect(() => {
    if (!isHydrated) return;
    if (recentlyViewedVehicles.length > 0) {
      document.documentElement.classList.add("is-returning-visitor");
    } else {
      document.documentElement.classList.remove("is-returning-visitor");
    }
  }, [isHydrated, recentlyViewedVehicles.length]);

  return (
    <section className="w-full px-3.5 md:px-8 lg:mt-18 bg-hero-bg">
      <div className="mx-auto flex flex-col items-center gap-8 md:gap-12 max-w-[1600px]
                      lg:flex-row lg:items-center lg:justify-center lg:pt-[87px] lg:pb-[75px]
                      md:pt-[60px] md:pb-[60px]
                      pt-[40px] pb-[30px]">
        <div className="hero-welcome-returning w-full">
          <HeroWelcomeBack />
        </div>
        <div className="hero-welcome-default w-full">
          <HeroHeadline />
        </div>
        <HeroSearchPanel />

      </div>
    </section>
  );
};

export default Hero;
