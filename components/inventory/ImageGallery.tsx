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
import Image from "next/image";

import LightGallery from "lightgallery/react";
import type { LightGallery as LightGalleryInstance } from "lightgallery/lightgallery";

// Core and standard plugin CSS
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-fullscreen.css";
import "lightgallery/css/lg-autoplay.css";
import "lightgallery/css/lg-share.css";
import "lightgallery/css/lg-rotate.css"; 

// Core and plugin modules
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgHash from "lightgallery/plugins/hash";
import lgFullscreen from "lightgallery/plugins/fullscreen";
import lgAutoplay from "lightgallery/plugins/autoplay";
import lgShare from "lightgallery/plugins/share";
import lgRotate from "lightgallery/plugins/rotate";  

type ImageGalleryProps = {
  images: string[];
  title: string;
  isSold?: boolean;
  centered?: boolean;
};

export const ImageGallery = ({ images, title, isSold = false, centered }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const lightboxRef = useRef<LightGalleryInstance | null>(null);

  const goTo = (index: number) => {
    if (images.length === 0) return;
    if (index < 0) setActiveIndex(images.length - 1);
    else if (index >= images.length) setActiveIndex(0);
    else setActiveIndex(index);
  };

  if (!images || images.length === 0) return null;

  // Formats images into the object array structure lightGallery expects
  const dynamicEl = images.map((img) => ({
    src: img,
    thumb: img,
    alt: title,
  }));


  

  return (
    <div className={`flex flex-col lg:flex-row gap-[2px] w-full max-w-full xl:max-h-[500px] overflow-hidden ${centered ? "justify-center" : "justify-start"}`}>
      <LightGallery
        onInit={(detail) => {
          lightboxRef.current = detail.instance;
        }}
        dynamic={true}
        dynamicEl={dynamicEl}
        plugins={[lgThumbnail, lgZoom, lgHash, lgFullscreen, lgAutoplay, lgShare]}
        hash={true}
        galleryId="1"
        speed={400}
        download={false}
        share={true}
        autoplay={true}
        fullScreen={true}
        zoom={true}
        toggleThumb={false}
        actualSize={false}
        slideShowAutoplay={false}
        elementClassNames="hidden"
      />

      <div className="flex flex-col rounded-2xl overflow-hidden">
        {/* Clickable Main view triggers lightGallery */}
        <div
          onClick={() => {
            // Open lightGallery immediately at the correct slide index
            lightboxRef.current?.openGallery(activeIndex);
          }}
          className="relative rounded-2xl xl:min-w-[750px] xl:max-w-[750px] overflow-hidden bg-gray-100 shadow-sm cursor-zoom-in"
        >
          {isSold && (
            <div className="absolute top-4 right-4 z-20 bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-md shadow-lg uppercase">
              Sold
            </div>
          )}

          <Image
            src={images[activeIndex]}
            alt={`${title} - Image ${activeIndex + 1}`}
            width={800}
            height={600}
            priority
            className={`w-full aspect-[4/3] md:h-full object-cover transition-opacity duration-500 ease-in-out ${isSold ? "grayscale opacity-90" : ""}`}
          />

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // Prevents launching lightbox when choosing arrows
                goTo(activeIndex - 1);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer bg-white/60 hover:bg-white rounded-full p-1 shadow-xl z-10"
            >
              <ChevronLeft className="w-9 h-9 text-gray-500/60" strokeWidth={3} />
            </button>
          )}

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goTo(activeIndex + 1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer bg-white/60 hover:bg-white rounded-full p-1 shadow-xl z-10"
            >
              <ChevronRight className="w-9 h-9 text-gray-500/60" strokeWidth={3} />
            </button>
          )}
        </div>

        {/*  Mobile Thumbnail strip */}
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
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    width={80}
                    height={60}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Thumbnail Strip (Unchanged) */}
      {images.length > 1 && (
        <div className="hidden md:flex flex-col overflow-y-auto w-[165px] h-[500px] pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goTo(idx)}
              className={`w-[155px] h-[119px] flex-shrink-0 cursor-pointer rounded-xl overflow-hidden border-2 mb-2 ${idx === activeIndex ? "border-blue-500" : "border-transparent"}`}
            >
              <Image src={img} alt={`Thumbnail ${idx + 1}`} width={155} height={125} className="w-full h-full object-cover rounded-md" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};