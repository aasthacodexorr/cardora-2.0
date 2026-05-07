"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

type ImageGalleryProps = {
  images: string[];
  title: string;
  isSold?: boolean;
};

export const ImageGallery = ({
  images,
  title,
  isSold = false,
}: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbRef = useRef<HTMLDivElement>(null);

  const goTo = (index: number) => {
    if (!images.length) return;

    let newIndex = index;

    if (newIndex < 0) {
      newIndex = images.length - 1;
    }
    if (newIndex >= images.length) {
      newIndex = 0;
    }
    setActiveIndex(newIndex);
    if (thumbRef.current) {
      const thumb = thumbRef.current.children[newIndex] as HTMLElement;

      if (thumb) {
        thumb.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="flex gap-1 h-[320px] md:h-[623px]">
      {/* MAIN IMAGE */}
      <div className="flex-1 relative rounded-2xl overflow-hidden bg-gray-100 shadow-sm btnsd_bt">
        {/* SOLD BADGE */}
        {isSold && (
          <div className="absolute top-4 right-4 z-20 bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-md shadow-lg uppercase">
            Sold
          </div>
        )}

        {/* MAIN IMAGE */}
        <img
          src={images[activeIndex]}
          alt={`${title} - Image ${activeIndex + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
            isSold ? "grayscale opacity-90" : ""
          }`}
        />

        {/* LEFT BUTTON */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goTo(activeIndex - 1);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white rounded-full p-3 shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6 text-black" />
          </button>
        )}

        {/* RIGHT BUTTON */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goTo(activeIndex + 1);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white rounded-full p-3 shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6 text-black" />
          </button>
        )}

        {/* IMAGE COUNTER */}
        <div className="absolute bottom-4 right-4 z-20 bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <div
          ref={thumbRef}
          className="hidden md:flex flex-col gap-1 overflow-y-auto scroll-smooth w-[185px] h-full pr-1 thumb_cont"
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goTo(idx)}
              className={`btn_thumb relative w-[185px] h-[138px] min-h-[138px] rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                idx === activeIndex
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
      )}
    </div>
  );
};
