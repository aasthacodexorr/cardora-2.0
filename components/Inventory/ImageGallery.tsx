/* =========================
   ImageGallery Component (Inventory / VDP)
   Full-featured image gallery for the Vehicle Detail Page.
   - Main large image with prev/next arrow buttons
   - Vertical thumbnail strip (desktop only)
   - Image counter badge (current / total)
   - "Sold" grayscale overlay when isSold is true
   - Smooth thumbnail scroll-into-view on navigation
========================= */

"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ── Types ──────────────────────────────────────────────────── */
type ImageGalleryProps = {
  images: string[];
  title: string;
  isSold?: boolean;
  centered?: boolean;
};

/* ── Component ─────────────────────────────────────────────── */
export const ImageGallery = ({
  images,
  title,
  isSold = false,
  centered
}: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const previousIndexRef = useRef(0);

  // Navigate to a specific image index with boundary wrapping


  useEffect(() => {
    const container = thumbRef.current;

    if (!container) return;

    // if last thumbnail selected
    if (activeIndex === images.length - 1) {
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    thumbnailRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [activeIndex, images.length]);

  const goTo = (index: number) => {
    setActiveIndex(index);

    if (
      index === images.length - 1 &&
      thumbRef.current
    ) {
      thumbRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };
  if (!images || images.length === 0) return null;

  return (
    <div
      className={`flex gap-1 px-1 md:px-0  h-[350px] md:h-[493px] md:min-w-[860px] ${centered ? "justify-center" : "justify-start"
        }`}
    >

      <div className="flex flex-col md:flex-row rounded-2xl  overflow-hidden">
        {/* ── Main image ──────────────────────────────────────── */}
        <div className="flex-1 relative rounded-2xl md:min-w-[700px] md:max-w-[700px] overflow-hidden bg-gray-100 shadow-sm">

          {/* Sold badge */}
          {isSold && (
            <div className="absolute top-4 right-4 z-20 bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-md shadow-lg uppercase">
              Sold
            </div>
          )}

          {/* Active image */}
          <img
            src={images[activeIndex]}
            alt={`${title} - Image ${activeIndex + 1}`}
            className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${isSold ? "grayscale opacity-90" : ""
              }`}
          />

          {/* Previous button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goTo(activeIndex - 1); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/60 hover:bg-white rounded-full p-1 shadow-xl transition-all duration-300 hover:scale-110"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-9 h-9 text-gray-500/60 cursor-pointer" strokeWidth={3} />
            </button>
          )}

          {/* Next button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goTo(activeIndex + 1); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/60 hover:bg-white rounded-full p-1 shadow-xl transition-all duration-300 hover:scale-110"
              aria-label="Next Image"
            >
              <ChevronRight className="w-9 h-9 text-gray-500/60 cursor-pointer" strokeWidth={3} />
            </button>
          )}




        </div>


        {/* ── Thumbnail strip ───────────────────────────────────── */}
        <div className="">
          {images.length > 1 && (
            <>
              {/* Mobile thumbnails */}
              <div className="md:hidden w-full pb-2">
                <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      ref={(el) => {
                        thumbnailRefs.current[idx] = el;
                      }}
                      type="button"
                      onClick={() => goTo(idx)}
                      className={`relative max-w-[155px] h-[138px] cursor-pointer min-h-[108px] rounded-xl overflow-hidden border-2 transition-all duration-300 ${idx === activeIndex
                          ? "border-transparent scale-[0.98]"
                          : "border-transparent"
                        }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>


      {/* ── Thumbnail strip (desktop only) ──────────────────── */}
      {images.length > 1 ? (
        <div
          ref={thumbRef}
          className="hidden md:flex flex-col gap-2 overflow-y-auto overflow-x-hidden w-[165px] h-[432px] pr-1 scroll-smooth"        >
          {images.map((img, idx) => (
            <button
              key={idx}
              ref={(el) => {
                thumbnailRefs.current[idx] = el;
              }}
              type="button"
              onClick={() => goTo(idx)}
              className={`relative max-w-[155px] h-[138px] cursor-pointer min-h-[108px] rounded-xl overflow-hidden border-2 transition-all duration-300 ${idx === activeIndex
                  ? "border-transparent scale-[0.98]"
                  : "border-transparent"
                }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover rounded-md"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      ) : <img
        src={images[0]}
        alt={`Thumbnail`}
        className="w-42 h-34 object-cover rounded-lg"
        loading="lazy"
      />}
    </div>
  );
};
