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

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ── Types ──────────────────────────────────────────────────── */
type ImageGalleryProps = {
  images: string[];
  title: string;
  isSold?: boolean;
};

/* ── Component ─────────────────────────────────────────────── */
export const ImageGallery = ({
  images,
  title,
  isSold = false,
}: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbRef = useRef<HTMLDivElement>(null);

  // Navigate to a specific image index with boundary wrapping
  const goTo = (index: number) => {
    if (!images.length) return;

    let newIndex = index;
    if (newIndex < 0)              newIndex = images.length - 1;
    if (newIndex >= images.length) newIndex = 0;

    setActiveIndex(newIndex);

    // Scroll the corresponding thumbnail into view
    if (thumbRef.current) {
      const thumb = thumbRef.current.children[newIndex] as HTMLElement;
      thumb?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="flex gap-1 h-[320px] md:h-[493px]">

<div className="flex flex-col md:flex-row rounded-2xl overflow-hidden">
{/* ── Main image ──────────────────────────────────────── */}
      <div className="flex-1 relative rounded-2xl overflow-hidden bg-gray-100 shadow-sm">

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
          className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
            isSold ? "grayscale opacity-90" : ""
          }`}
        />

        {/* Previous button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goTo(activeIndex - 1); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white rounded-full p-3 shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6 text-gray-500" />
          </button>
        )}

        {/* Next button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goTo(activeIndex + 1); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white rounded-full p-3 shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6 text-gray-500" />
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
            type="button"
            onClick={() => goTo(idx)}
            className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              idx === activeIndex
                ? "border-green-500"
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
          className="hidden md:flex flex-col gap-1 overflow-x-hidden overflow-y-auto scroll-smooth w-[155px] h-[440px] pr-1"
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goTo(idx)}
              className={`relative max-w-[155px] h-[138px] min-h-[108px] rounded-xl overflow-hidden border-2 transition-all duration-300 ${idx === activeIndex
                  ? "border-green-500 scale-[0.98]"
                  : "border-transparent hover:border-gray-300"
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
      ) : <img
        src={images[0]}
        alt={`Thumbnail`}
        className="w-44 h-36 object-cover rounded-2xl"
        loading="lazy"
      />}
    </div>
  );
};
