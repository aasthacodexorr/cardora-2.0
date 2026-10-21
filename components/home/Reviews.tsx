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
    initial: "A",
    name: "Avinash Ramlal",
    text: "I was in the market for a new truck. I recently purchased my GMC Sierra 1500 from Cardora. I had the pleasure of dealing with Derik. Derik was informative, patient and was so helpful when it came to the whole process. Even though I had a few setbacks, he made sure everything went smoothly and helped me throughout the process. I really appreciate his support and would highly recommend Cardora!",
  },
  {
    initial: "N",
    name: "Nicola Harrison",
    text: "I recently purchased my Toyota RAV4 from Cardora. I had the pleasure of dealing with Derik. This was such an amazing experience. Derik was informative, patient and was so helpful. I had a bit of a set back during the process but Derik was understanding, supportive, and helped me work through everything. He made the experience much easier, and I truly appreciate his help. I would definitely recommend Cardora!",
  },
  {
    initial: "C",
    name: "Chantié M",
    text: "Firstly, this is such an amazing place, 10/10 would come back to purchase a vehicle. The customer service is great. Sania is amazing! both representatives at the front were super easy to talk to, everyone has an amazing personality, such a warm and welcoming environment.",
  },
  {
    initial: "S",
    name: "Sebastian Palacios",
    text: "Amazing experience at Cardora Dealership! The staff was professional, honest, and very helpful throughout the entire process. They made buying a vehicle smooth and stress free, answered all my questions, and went above and beyond to make sure everything went smoothly. I highly recommend Cardora to anyone looking to purchase a vehicle!",
  },
  {
    initial: "C",
    name: "Ciera",
    text: "If you’re ever looking for a car and need everything done with professionalism. Ask for Andy he is the best! The team is amazing you will not be disappointed!",
  },
  {
    initial: "K",
    name: "kudus rasheed",
    text: "Nice doing business with you, I have a very smooth deal with him ✅ thank you once again",
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
    <section className="w-full overflow-hidden mt-14 bg-review-blue">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 pt-12 lg:pt-16 pb-16">
        <h2 className="text-[26px] md:text-[44px] font-bold text-foreground tracking-tight leading-none text-center mb-5">
          People love buying with {SITE_CONFIG?.dealership.name}
        </h2>

        <div className="flex justify-center items-center w-full sm:px-10 mb-7">
          <a
            href="https://www.google.com/search?q=cardora&oq=cardora&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRg8MgYIAhBFGDwyDwgDEC4YChivARjHARiABDILCAQQABgKGAsYgAQyCwgFEAAYChgLGIAEMgsIBhAAGAoYCxiABDIGCAcQRRg80gEIMjgxMGowajeoAgiwAgHxBRTGNHBoyF19&sourceid=chrome&ie=UTF-8&zx=1764666449357&no_sw_cr=1#lrd=0x882b3f8957c9a033:0x9a07057d8dafccb0,1,,,,"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[16px] font-semibold text-foreground w-full md:w-auto"
          >
            <div className="flex items-center justify-center gap-3 rounded-[40px] overflow-hidden bg-transparent shadow-none py-[10px] lg:px-4 px-6 lg:w-[500px] max-w-full flex-wrap border border-neutral-mediumGray2">
              <Image src={google} alt="Google" className="h-[29px] w-[85px] object-contain" />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-star text-star" />
                ))}
              </div>
              <span className="text-[15px] font-medium text-foreground">5.0 (120)</span>
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
                  className={`snap-center shrink-0 lg:flex-shrink-0 px-2 min-h-[470px] lg:min-h-[450px] md:px-3 ${slidesToShow === 1 ? "w-full" : slidesToShow === 2 ? "w-1/2" : "w-1/3"
                    }`}
                >
                  <article className="rounded-2xl bg-card p-5 md:p-6 shadow-md flex flex-col h-full border border-border transition-shadow duration-300 hover:shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-[65px] w-[65px] rounded-full flex items-center justify-center text-white text-[35px] font-medium flex-shrink-0 bg-avatar-purple">
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