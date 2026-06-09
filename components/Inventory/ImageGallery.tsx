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

  // Navigate to a specific image index with boundary wrapping
  const goTo = (index: number) => {
    if (images.length === 0) return;
    // Boundary wrapping logic
    if (index < 0) {
      setActiveIndex(images.length - 1);
    } else if (index >= images.length) {
      setActiveIndex(0);
    } else {
      setActiveIndex(index);
    }
  };

  // Handles smooth, calculated vertical scrolling on Desktop
  useEffect(() => {
    const container = thumbRef.current;
    if (!container || images.length <= 1) return;

    // 500px total container height / 4 visible thumbnails = 125px per item slot
    const itemHeight = 125; 
    
    // Calculate the current top scroll position of the container
    const currentScrollTop = container.scrollTop;
    
    // Determine the visible window boundary
    const minVisibleY = currentScrollTop;
    const maxVisibleY = currentScrollTop + 500 - itemHeight;

    // Target vertical pixel position for the current active item
    const itemTargetY = activeIndex * itemHeight;

    if (itemTargetY < minVisibleY) {
      // If moving up out of view, scroll up to align item perfectly to top
      container.scrollTo({
        top: itemTargetY,
        behavior: "smooth",
      });
    } else if (itemTargetY > maxVisibleY) {
      // If moving down out of view, scroll down so item aligns perfectly to bottom
      container.scrollTo({
        top: itemTargetY - 500 + itemHeight,
        behavior: "smooth",
      });
    } else if (activeIndex === 0) {
      // Reset back to top if wrapped back to start
      container.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeIndex, images.length]);

  if (!images || images.length === 0) return null;

  return (
    <div
      className={`flex flex-col lg:flex-row gap-2 w-full max-w-full  xl:max-h-[500px] overflow-hidden ${
        centered ? "justify-center" : "justify-start"
      }`}
    >
      <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden">
        {/* ── Main image ──────────────────────────────────────── */}
        <div className="relative rounded-2xl xl:min-w-[700px] xl:max-w-[700px] overflow-hidden bg-gray-100 shadow-sm">
          {/* Image counter badge */}
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </div>

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
            className={`w-full aspect-[4/3] md:h-full object-cover transition-opacity duration-500 ease-in-out ${
              isSold ? "grayscale opacity-90" : ""
            }`}
          />

          {/* Previous button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goTo(activeIndex - 1);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer bg-white/60 hover:bg-white rounded-full p-1 shadow-xl transition-all duration-300 hover:scale-110"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-9 h-9 text-gray-500/60" strokeWidth={3} />
            </button>
          )}

          {/* Next button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goTo(activeIndex + 1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer bg-white/60 hover:bg-white rounded-full p-1 shadow-xl transition-all duration-300 hover:scale-110"
              aria-label="Next Image"
            >
              <ChevronRight className="w-9 h-9 text-gray-500/60" strokeWidth={3} />
            </button>
          )}
        </div>

        {/* ── Mobile Thumbnail strip ───────────────────────────── */}
        {images.length > 1 && (
          <div className="md:hidden mt-2 w-full">
            <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goTo(idx)}
                  className={`flex-shrink-0 w-[80px] h-[60px] rounded-lg overflow-hidden border snap-start ${
                    idx === activeIndex ? "ring-2 ring-blue-500" : "border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Desktop Thumbnail strip ──────────────────── */}
      {images.length > 1 ? (
        <div
          ref={thumbRef}
          className="hidden md:flex flex-col overflow-y-auto overflow-x-hidden w-[165px] h-[500px] pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goTo(idx)}
              className={`w-[155px] h-[117px] my-1 flex-shrink-0 cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                idx === activeIndex
                  ? " border-transparent"
                  : "border-transparent  "
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
      ) : (
        <div className="hidden md:block w-[165px]">
          <img
            src={images[0]}
            alt={`Thumbnail`}
            className="w-42 h-34 object-cover rounded-lg"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};