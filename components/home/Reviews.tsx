/* =========================
   Reviews Component (Home)
   Customer review carousel on the homepage.
   - Responsive: shows 1 / 2 / 3 slides based on viewport
   - Auto-advances every 4 seconds
   - Manual prev/next navigation buttons
   - Displays Google Review branding on each card
========================= */

"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";

import google        from "@/assets/brand/google.png";
import googleReview  from "@/assets/brand/Goolge-Review-Logo.jpg";

/* ── Types ──────────────────────────────────────────────────── */
type Review = {
  initial: string;
  name: string;
  text: string;
};

/* ── Static Data ────────────────────────────────────────────── */
const reviews: Review[] = [
  {
    initial: "J",
    name: "It's Jerry",
    text: "So, I recently bought a 2021 Jetta High line from Cardora, and I can confidently say the experience was nothing short of amazing—thanks to Sam! From the very beginning, Sam went above and beyond to make sure everything went smoothly.",
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

/* ── Component ─────────────────────────────────────────────── */
const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);

  // Responsive: update slides count on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768)       setSlidesToShow(1);
      else if (window.innerWidth < 1024) setSlidesToShow(2);
      else                               setSlidesToShow(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, slidesToShow]);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1 >= reviews.length ? 0 : prev + 1));

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 < 0 ? reviews.length - 1 : prev - 1));

  return (
    <section className="w-full bg-[#eaeff5] overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 pt-18 pb-9">
        <h2 className="text-[30px] md:text-[44px] font-bold text-foreground tracking-tight text-center mb-5">
          People love buying with Cardora
        </h2>

        {/* Google rating bar */}
        <div className="flex justify-center">
          <a href="https://www.google.com/search?q=cardora&oq=cardora&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRg8MgYIAhBFGDwyDwgDEC4YChivARjHARiABDILCAQQABgKGAsYgAQyCwgFEAAYChgLGIAEMgsIBhAAGAoYCxiABDIGCAcQRRg80gEIMjgxMGowajeoAgiwAgHxBRTGNHBoyF19&sourceid=chrome&ie=UTF-8&zx=1764666449357&no_sw_cr=1#lrd=" target="_blank" className="text-[16px] font-semibold text-foreground">
            <div className="flex items-center justify-center gap-3 rounded-[20px] overflow-hidden border border-[#e2e2e2] bg-transparent shadow-none py-[10px] px-4 w-[500px] max-w-full flex-wrap">
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

        {/* Carousel */}
        <div className="relative mt-8">
          {/* Prev button */}
          <button
            onClick={prevSlide}
            aria-label="Previous review"
            className="flex absolute left-0 md:-left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 md:h-10 md:w-10 rounded-full bg-card border border-border shadow-md items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>

          {/* Slides */}
          <div className="overflow-hidden min-h-[500px]">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)` }}
            >
              {[...reviews, ...reviews].map((r, index) => (
                <div
                  key={`${r.name}-${index}`}
                  className={`flex-shrink-0 px-2 min-h-[450px] md:px-3 ${
                    slidesToShow === 1 ? "w-full" : slidesToShow === 2 ? "w-1/2" : "w-1/3"
                  }`}
                >
                  <article className="rounded-2xl bg-card p-5 md:p-6 shadow-md flex flex-col h-full">
                    {/* Reviewer avatar + name */}
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

                    {/* Review text */}
                    <p className="mt-5 text-[16px] text-foreground/80 leading-relaxed flex-1">
                      {r.text}
                    </p>

                    {/* Google Review badge */}
                    <div className="flex items-center gap-2 mt-6 pt-2">
                      <Image src={googleReview} alt="Google" className="h-[30px] w-[30px] object-contain" />
                      <span className="text-[14px] font-bold text-foreground/80">Google Review</span>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={nextSlide}
            aria-label="Next review"
            className="flex absolute right-0 md:-right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 md:h-10 md:w-10 rounded-full bg-card border border-border shadow-md items-center justify-center"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
