/* =========================
   Reviews Component (Home)
   Customer review carousel on the homepage.
   - Responsive: shows 1 / 2 / 3 slides based on viewport
   - Auto-advances every 4 seconds
   - Manual prev/next navigation buttons
   - Displays Google Review branding on each card
========================= */

"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";

import google from "@/assets/brand/google.png";
import googleReview from "@/assets/brand/Goolge-Review-Logo.jpg";
import { getConstants } from "@/constants";
import { useAppConfig } from "@/app/providers";

type Review = {
  initial: string;
  name: string;
  text: string;
};

const reviews: Review[] = [
  {
    initial: "J",
    name: "It's Jerry",
    text: "So, I recently bought a 2021 Jetta High line from Dealership, and I can confidently say the experience was nothing short of amazing—thanks to Sam! From the very beginning, Sam went above and beyond to make sure everything went smoothly.",
  },
  {
    initial: "S",
    name: "Shimul Rajput",
    text: "Just bought my first car and Sam was amazing! He was so supportive, quick to respond, and made the whole process feel easy and stress-free. Couldn't have asked for a better experience! Highly recommended! ✨",
  },
  {
    initial: "K",
    name: "Katie McWade",
    text: "My husband and I recently went through Sam for the purchase of our new family vehicle. He worked very hard for us for the best rate possible and turned what had been a stressful and frustrating process, into something absolutely seamless and enjoyable.",
  },
  {
    initial: "A",
    name: "Alex Brown",
    text: "Amazing experience dealing with Sam and his team at Gedi Route (GR Cars). I highly recommend them for any vehicle purchase. I will definitely be using them for my next vehicle upgrade.",
  },
];

const Reviews = () => {
  const appConfig = useAppConfig();
  const { SITE_CONFIG } = getConstants(appConfig);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const [slidesToShow, setSlidesToShow] = useState(3);

  // Triple the array to provide buffer segments for infinite scrolling loops
  const duplicatedReviews = [...reviews, ...reviews, ...reviews];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 767) setSlidesToShow(1);
      else if (window.innerWidth < 1024) setSlidesToShow(2);
      else setSlidesToShow(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getScrollAmount = () => {
    if (!scrollRef.current) return 0;
    const firstChild = scrollRef.current.querySelector("[data-slide]");
    return firstChild ? firstChild.clientWidth : scrollRef.current.clientWidth / slidesToShow;
  };

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current || isScrolling.current) return;

    const container = scrollRef.current;
    const scrollAmount = getScrollAmount();
    
    isScrolling.current = true;

    // Use absolute coordinates instead of scrollBy to prevent multi-click calculation stacking
    const targetScrollLeft = dir === "left" 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScrollLeft,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = getScrollAmount();
    const singleSetWidth = scrollAmount * reviews.length;
    
    // Initial jump to the middle track setup
    container.scrollLeft = singleSetWidth;

    const handleScrollEnd = () => {
      if (!container) return;
      const currentScrollAmount = getScrollAmount();
      const currentSetWidth = currentScrollAmount * reviews.length;

      // Infinite loop boundary correction mechanics
      if (container.scrollLeft >= currentSetWidth * 2 - 10) {
        container.style.scrollBehavior = "auto";
        container.scrollLeft = container.scrollLeft - currentSetWidth;
        container.style.scrollBehavior = "smooth";
      } else if (container.scrollLeft <= currentScrollAmount) {
        container.style.scrollBehavior = "auto";
        container.scrollLeft = container.scrollLeft + currentSetWidth;
        container.style.scrollBehavior = "smooth";
      }
      
      // Unblock click interaction
      isScrolling.current = false;
    };

    container.addEventListener("scrollend", handleScrollEnd);
    return () => container.removeEventListener("scrollend", handleScrollEnd);
  }, [slidesToShow]);

  return (
    <section className="w-full bg-[#eaeff5] overflow-hidden mt-14">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 pt-12 lg:pt-18 pb-9">
        <h2 className="text-[26px] md:text-[44px] font-bold text-foreground tracking-tight leading-none text-center mb-5">
          People love buying with {SITE_CONFIG?.dealership.name}
        </h2>

        <div className="flex justify-center items-center w-full sm:px-10 mb-7">
          <a
            href="https://www.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[16px] font-semibold text-foreground w-full md:w-auto"
          >
            <div className="flex items-center justify-center gap-3 rounded-[40px] overflow-hidden border border-[#e2e2e2] bg-transparent shadow-none py-[10px] lg:px-4 px-6 lg:w-[500px] max-w-full flex-wrap">
              <Image src={google} alt="Google" className="h-[29px] w-[85px] object-contain" />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-star text-star" />
                ))}
              </div>
              <span className="text-[15px] font-medium text-foreground">5.0 (33)</span>
              <span className="underline font-md">View all</span>
            </div>
          </a>
        </div>

        <div className="relative mt-5 lg:mt-0 px-4 md:px-10">
          <button
            onClick={() => scroll("left")}
            aria-label="Previous review"
            className="flex absolute left-1 md:left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-card border border-border shadow-md items-center justify-center cursor-pointer hover:bg-accent transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>

          {/* Changed overflow-x-hidden to overflow-x-auto to make touch gestures work natively on mobile */}
          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-none w-full snap-x mandatory"
          >
            <div className="flex w-full py-2">
              {duplicatedReviews.map((r, index) => (
                <div
                  key={`${r.name}-${index}`}
                  data-slide
                  className={`snap-center shrink-0 lg:flex-shrink-0 px-2 min-h-[470px] lg:min-h-[450px] md:px-3 ${
                    slidesToShow === 1 ? "w-full" : slidesToShow === 2 ? "w-1/2" : "w-1/3"
                  }`}
                >
                  <article className="rounded-2xl bg-card p-5 md:p-6 shadow-md flex flex-col h-full border border-border transition-shadow duration-300 hover:shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-[65px] w-[65px] rounded-full bg-[#512da8] flex items-center justify-center text-white text-[35px] font-medium flex-shrink-0">
                        {r.initial}
                      </div>
                      <div>
                        <h3 className="text-[20px] font-bold text-review-name">{r.name}</h3>
                        <div className="flex gap-0.5 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-star text-star" />
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="mt-5 text-[16px] text-foreground/80 leading-relaxed flex-1">
                      {r.text}
                    </p>

                    <div className="flex items-center gap-2 mt-6 pt-2">
                      <Image src={googleReview} alt="Google" className="h-[30px] w-[30px] object-contain" />
                      <span className="text-[14px] font-bold text-foreground/80">Google Review</span>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => scroll("right")}
            aria-label="Next review"
            className="flex absolute right-1 md:right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-card border border-border shadow-md items-center justify-center cursor-pointer hover:bg-accent transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Reviews;