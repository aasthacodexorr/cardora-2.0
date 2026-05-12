"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";

import google from "../assets/google.png";
import google_review from "../assets/Goolge-Review-Logo.jpg";

type Review = {
  initial: string;
  name: string;
  text: string;
};

const reviews: Review[] = [
  {
    initial: "J",
    name: "It's Jerry",
    text: "So, I recently bought a 2021 Jetta High line from Cardora, and I can confidently say the experience was nothing short of amazing—thanks to Sam! From the very beginning, Sam went above and beyond to make sure everything went smoothly.",
  },
  {
    initial: "S",
    name: "Shimul Rajput",
    text: "Just bought my first car and Sam was amazing! He was so supportive, quick to respond, and made the whole process feel easy and stress-free.",
  },
  {
    initial: "K",
    name: "Katie McWade",
    text: "My husband and I recently went through Sam for the purchase of our new family vehicle. He worked very hard for us for the best rate possible.",
  },
  {
    initial: "A",
    name: "Alex Brown",
    text: "Amazing service from start to finish. Highly recommend Cardora and their amazing customer support.",
  },
];

const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect Mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + 1 >= reviews.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - 1 < 0 ? reviews.length - 1 : prev - 1
    );
  };

  return (
    <section className="w-full bg-review-bg reviews_section overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-14">
        <h2 className="text-[30px] md:text-[44px] font-extrabold text-foreground tracking-tight text-center mb-8">
          People love buying with Cardora
        </h2>

        {/* Google Bar */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-xl bg-card px-4 py-3 shadow-sm border border-border reviews_google_bar">
            <Image src={google} alt="Google" className="h-5 w-5" />

            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-star text-star"
                />
              ))}
            </div>

            <span className="text-[15px] font-medium text-foreground">
              5.0 (33)
            </span>

            <a
              href="#"
              className="text-[15px] underline text-foreground hover:opacity-80"
            >
              View all
            </a>
          </div>
        </div>

        {/* Slider */}
        <div className="relative mt-8">
          {/* Prev */}
          <button
            onClick={prevSlide}
            aria-label="Previous"
            className="flex absolute left-0 md:-left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 md:h-10 md:w-10 rounded-full bg-card border border-border shadow-md items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>

          {/* Slides */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${
                  currentIndex * (isMobile ? 100 : 33.3333)
                }%)`,
              }}
            >
              {[...reviews, ...reviews].map((r, index) => (
                <div
                  key={`${r.name}-${index}`}
                  className="w-full md:w-1/3 flex-shrink-0 px-2 md:px-3"
                >
                  <article className="rounded-2xl bg-card p-5 md:p-6 shadow-sm flex flex-col h-full">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 round_pill_reviews rounded-full bg-review-avatar flex items-center justify-center text-dark-section-foreground font-bold text-lg">
                        {r.initial}
                      </div>

                      <div>
                        <h3 className="text-[18px] font-bold text-review-name">
                          {r.name}
                        </h3>

                        <div className="flex gap-0.5 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-star text-star"
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="mt-5 text-[15px] text-foreground/80 leading-relaxed flex-1">
                      {r.text}
                    </p>

                    <div className="flex items-center gap-2 mt-6 pt-2 google_review_logo">
                      <Image
                        src={google_review}
                        alt="Google"
                        className="h-5 w-5"
                      />

                      <span className="text-[15px] text-foreground/80">
                        Google Review
                      </span>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {/* Next */}
          <button
            onClick={nextSlide}
            aria-label="Next"
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