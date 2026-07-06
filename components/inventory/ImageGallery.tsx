/* =========================
   ImageGallery Component (Inventory / VDP)
   Full-featured image gallery for the Vehicle Detail Page.
========================= */

"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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

type ImageGalleryProps = {
  images: string[];
  title: string;
  isSold?: boolean;
  centered?: boolean;
};

export const ImageGallery = ({ images, title, isSold = false, centered }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  
  const lightboxRef = useRef<LightGalleryInstance | null>(null);
  const desktopThumbsRef = useRef<HTMLDivElement | null>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Smooth scroll thumbnail into view, handling loop-to-top scenario
  useEffect(() => {
    const container = desktopThumbsRef.current;
    if (!container) return;

    if (activeIndex === 0) {
      // If it loops back to the first image, snap cleanly back to the top
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      const activeThumb = thumbRefs.current[activeIndex];
      if (activeThumb) {
        container.scrollTo({
          top: activeThumb.offsetTop - container.offsetTop - 12, // 12px padding offset
          behavior: "smooth",
        });
      }
    }
  }, [activeIndex]);

  const goTo = (index: number) => {
    if (images.length === 0) return;

    if (index < 0) {
      setDirection(-1);
      setActiveIndex(images.length - 1);
    } else if (index >= images.length) {
      setDirection(1);
      setActiveIndex(0); // This triggers the loop back to top
    } else {
      setDirection(index > activeIndex ? 1 : -1);
      setActiveIndex(index);
    }
  };

  if (!images || images.length === 0) return null;

  const dynamicEl = images.map((img) => ({
    src: img,
    thumb: img,
    alt: title,
  }));

  // Highly-optimized transition configurations for silky smooth movement
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <div className={`flex flex-col lg:flex-row gap-[2px] w-full max-w-full xl:max-h-[500px] 2xl:min-h-[550px] overflow-hidden ${centered ? "justify-center" : "justify-start"}`}>
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
            lightboxRef.current?.openGallery(activeIndex);
          }}
          className="relative rounded-2xl xl:min-w-[775px] xl:max-w-[750px] 2xl:min-w-[850px] overflow-hidden bg-gray-100 shadow-sm cursor-zoom-in aspect-[4/3] w-full"
        >
          {isSold && (
            <div className="absolute top-4 right-4 z-20 bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-md shadow-lg uppercase">
              Sold
            </div>
          )}

          {/* Animating the main image swap smoothly */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 260, damping: 28 },
                  opacity: { duration: 0.25, ease: "easeInOut" }
                }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={images[activeIndex]}
                  alt={`${title} - Image ${activeIndex + 1}`}
                  fill
                  priority
                  className={`object-cover ${isSold ? "grayscale opacity-90" : ""}`}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
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
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer bg-white/60 hover:bg-white rounded-full p-1 shadow-xl z-0"
            >
              <ChevronRight className="w-9 h-9 text-gray-500/60" strokeWidth={3} />
            </button>
          )}
        </div>

        {/* Mobile Thumbnail strip */}
        {images.length > 1 && (
          <div className="md:hidden mt-2 w-full">
            <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goTo(idx)}
                  className={`flex-shrink-0 w-[80px] h-[60px] rounded-lg overflow-hidden border snap-start ${
                    idx === activeIndex ? "border-transparent" : "border-gray-200"
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

      {/* Desktop Thumbnail Strip */}
      {images.length > 1 ? (
        <div 
          ref={desktopThumbsRef}
          className="hidden md:flex flex-col overflow-y-auto w-[165px] h-[500px] 2xl:w-[200px] pr-1 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              ref={(el) => { thumbRefs.current[idx] = el; }}
              type="button"
              onClick={() => goTo(idx)}
              className={`w-full flex-shrink-0 cursor-pointer rounded-xl overflow-hidden border-2 mb-1 transition-all duration-200 ${
                idx === activeIndex ? "border-transparent" : "border-transparent"
              }`}
            >
              <Image 
                src={img} 
                alt={`Thumbnail ${idx + 1}`} 
                width={155} 
                height={125} 
                className="w-full h-full object-cover rounded-md" 
              />
            </button>
          ))}
        </div>
      ) : <div className="hidden md:block w-[165px] 2xl:w-[200px]">
          <Image
            src={images[0]}
            alt={`Thumbnail`}
            width={168}
            height={136}
            className="w-full object-cover rounded-lg cursor-pointer"
          />
        </div>}
    </div>
  );
};