"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ImageGalleryProps = {
  images: string[];
  title: string;
  isSold?: boolean;
};

export const ImageGallery = ({ images, title, isSold = false }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbRef = useRef<HTMLDivElement>(null);

  const goTo = (index: number) => {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    setActiveIndex(index);

    // Scroll the thumbnail into view
    if (thumbRef.current) {
      const thumb = thumbRef.current.children[index] as HTMLElement;
      if (thumb) {
        thumb.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  };

  if (images.length === 0) return null;

  return (
    <div className="flex gap-3" style={{ height: "480px" }}>
      {/* Main image with left/right arrows */}
      <div className="flex-1 min-w-0 relative rounded-xl overflow-hidden shadow-sm bg-muted group" style={{ height: "480px" }}>
        {isSold && (
          <div className="absolute top-4 right-4 z-10 bg-red-600 text-white text-[14px] font-bold px-4 py-2 rounded-sm shadow-md uppercase tracking-wider">
            Sold
          </div>
        )}

        <img
          src={images[activeIndex]}
          alt={`${title} - Image ${activeIndex + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isSold ? "grayscale opacity-90" : ""}`}
        />

        {/* Left Arrow */}
        {images.length > 1 && (
          <button
            onClick={() => goTo(activeIndex - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {/* Right Arrow */}
        {images.length > 1 && (
          <button
            onClick={() => goTo(activeIndex + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        {/* Image counter */}
        <div className="absolute bottom-3 right-3 z-10 bg-black/60 text-white text-[12px] font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails — scrollable vertical strip on the right */}
      {images.length > 1 && (
        <div
          ref={thumbRef}
          className="flex flex-col gap-2 overflow-y-auto"
          style={{ width: "120px", height: "480px" }}
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setActiveIndex(idx)}
              style={{ width: "120px", height: "90px", minHeight: "90px" }}
              className={`rounded-lg overflow-hidden border-2 cursor-pointer transition-colors bg-muted ${
                idx === activeIndex
                  ? "border-brand-green"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
