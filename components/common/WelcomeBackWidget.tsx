"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

import { useRecentlyViewed } from "@/lib/recentlyViewed";
import { useAppConfig } from "@/app/providers";
import { getConstants } from "@/constants";
import { isVehicleDetailSlug } from "@/lib/inventoryUrls";
import { parseImageUrls } from "@/utils/formatters";
import { MessageModal } from "@/components/inventory/VehicleInfo";

export default function WelcomeBackWidget() {
  const pathname = usePathname();
  const appConfig = useAppConfig();
  const { SITE_CONFIG, DEFAULT_PLACEHOLDER_IMAGE } = getConstants(appConfig);
  const { recentlyViewedVehicles } = useRecentlyViewed();

  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isRequestInfoOpen, setIsRequestInfoOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [wbImgIndex, setWbImgIndex] = useState(0);
  const [wbHasError, setWbHasError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const userInteractedRef = useRef(false);

  // Latest vehicle viewed
  const latestVehicle = recentlyViewedVehicles[0];

  useEffect(() => {
    setWbImgIndex(0);
    setWbHasError(false);
  }, [latestVehicle?.inventory_id, latestVehicle?.id, latestVehicle?.image_urls]);

  // Route checks:
  // The notification icon should ONLY be shown on the inventory listing page.
  // It should NOT come on the landing (home) page, VDP page, or other pages.
  const isInventoryListing = useMemo(() => {
    if (!pathname) return false;
    const cleanPath = pathname.replace(/\/+$/, "") || "/";
    if (cleanPath === "/inventory") return true;
    if (cleanPath.startsWith("/inventory/")) {
      const segments = cleanPath.slice("/inventory/".length).split("/").filter(Boolean);
      if (segments.length === 0) return true;
      // If it matches a vehicle detail slug, it is a VDP (not an inventory listing)
      return !isVehicleDetailSlug(segments);
    }
    return false;
  }, [pathname]);

  const shouldShowWidget = isInventoryListing;

  // Mount detection for SSR safety
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle visibility timing:
  // 1. Only run on inventory listing pages (never on home, VDP, or other pages)
  // 2. Show the notification icon after 5 seconds of page load (5000ms)
  // 3. Show the popup by default on desktop; mobile starts with it closed.
  useEffect(() => {
    if (!isMounted || !latestVehicle || !shouldShowWidget) {
      setIsVisible(false);
      setIsOpen(false);
      return;
    }

    // Reset visibility on route change so delay takes effect
    setIsVisible(false);
    setIsOpen(false);
    userInteractedRef.current = false;

    // Show notification icon after 5 seconds of page load
    const iconTimer = setTimeout(() => {
      setIsVisible(true);
      setIsOpen(window.matchMedia("(min-width: 640px)").matches);
    }, 5000);

    return () => {
      clearTimeout(iconTimer);
    };
  }, [pathname, isMounted, latestVehicle?.inventory_id, shouldShowWidget]);

  // Click outside to dismiss popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        // Check if the click was not on the bell button
        const bellButton = document.getElementById("welcome-back-bell-trigger");
        if (bellButton && bellButton.contains(event.target as Node)) {
          return;
        }
        userInteractedRef.current = true;
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleClose = () => {
    userInteractedRef.current = true;
    setIsOpen(false);
  };

  const handleToggle = () => {
    userInteractedRef.current = true;
    setIsOpen((prev) => !prev);
  };

  // Do not render anything during SSR, if no vehicle has been viewed, or if not yet visible
  if (!isMounted || !latestVehicle || !shouldShowWidget || !isVisible) {
    return null;
  }

  // Construct vehicle title
  const vehicleTitle = [latestVehicle.year, latestVehicle.make, latestVehicle.model]
    .filter(Boolean)
    .join(" ") || "Featured Vehicle";

  // Construct VDP URL
  const slug = [
    latestVehicle.inventory_id ?? latestVehicle.id,
    latestVehicle.year,
    latestVehicle.make,
    latestVehicle.model,
    latestVehicle.trim,
  ]
    .filter(Boolean)
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const vdpUrl = `/inventory/${slug}`;

  // Extract vehicle image with fallback logic
  const parsedUrls = latestVehicle?.image_urls
    ? parseImageUrls(latestVehicle.image_urls, SITE_CONFIG?.urls?.assetBaseUrl || "")
    : [];
  const defaultPlaceholder =
    DEFAULT_PLACEHOLDER_IMAGE ||
    `${SITE_CONFIG?.urls?.assetBaseUrl}/image/default-placeholder.jpg`;

  const imageSrc =
    wbHasError || parsedUrls.length === 0
      ? defaultPlaceholder
      : parsedUrls[wbImgIndex] || defaultPlaceholder;

  const handleWbImgError = () => {
    if (wbImgIndex === 0 && parsedUrls.length > 1) {
      setWbImgIndex(1);
    } else {
      setWbHasError(true);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[60] flex flex-col items-start  pointer-events-auto"
        >
          {/* Welcome Back Popup Card - slides in from bottom to top like Tabangi */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={cardRef}
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.95 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-[calc(100vw-32px)] max-w-[300px] sm:max-w-[325px] -mb-6 sm:-mb-8 text-left max-h-[calc(100dvh-90px)] flex flex-col origin-bottom-left"
              >
                {/* Top brand-colored arched cap */}
                <div className="h-2.5 bg-brand w-full flex-shrink-0" />

                {/* Close button */}
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close"
                  className="absolute top-3.5 right-3 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer z-20"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="p-3.5 sm:p-4 pt-2.5 sm:pt-3.5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {/* Header */}
                  <div className="text-center pr-6 pl-6">
                    <h3 className="text-brand font-bold text-lg sm:text-xl tracking-tight leading-tight">
                      Welcome back!
                    </h3>
                    <p className="text-gray-500 text-[12px] sm:text-[13px] mt-0.5">
                      Continue where you left off
                    </p>
                  </div>

                  {/* Clickable Vehicle Area (opens VDP in new tab) */}
                  <Link
                    href={vdpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="group/item block focus:outline-none"
                  >
                    {/* Vehicle Image */}
                    <div className="relative w-full h-[170px] rounded-xl overflow-hidden bg-gray-100 mt-2.5 sm:mt-3 border border-gray-100 flex-shrink-0">
                      <Image
                        src={imageSrc}
                        alt={vehicleTitle}
                        fill
                        sizes="(max-width: 640px) 280px, 320px"
                        className="object-cover group-hover/item:scale-105 transition-transform duration-300"
                        unoptimized
                        onError={handleWbImgError}
                      />
                    </div>

                    {/* Vehicle Title */}
                    <h4
                      className="text-foreground group-hover/item:text-brand font-bold text-[14px] sm:text-[16px] text-center mt-2.5 sm:mt-3 truncate px-1 transition-colors"
                      title={vehicleTitle}
                    >
                      {vehicleTitle}
                    </h4>
                  </Link>

                  {/* Action Buttons Row 1: See More & Not Now */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mt-2.5 sm:mt-3">
                    <Link
                      href={vdpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="bg-brand hover:opacity-90 text-white text-xs sm:text-[13px] font-semibold py-2 px-3 rounded-lg text-center transition-opacity shadow-sm border border-brand-green2 flex items-center justify-center"
                    >
                      See More
                    </Link>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="border border-brand text-brand hover:bg-brand/10 text-xs sm:text-[13px] font-semibold py-2 px-3 rounded-lg text-center transition-colors flex items-center justify-center cursor-pointer"
                    >
                      Not Now
                    </button>
                  </div>

                  {/* Action Button Row 2: Request information */}
                  <div className="mt-2 sm:mt-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        setIsRequestInfoOpen(true);
                      }}
                      className="w-full cursor-pointer bg-brand hover:opacity-90 text-white text-xs sm:text-[13px] font-semibold py-2.5 px-3 rounded-lg text-center flex items-center justify-center gap-1.5 transition-opacity shadow-sm border border-brand-green2"
                    >
                      Request info
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Bell Icon Trigger (Brand Colored with pulse animation) */}
          <button
            id="welcome-back-bell-trigger"
            type="button"
            onClick={handleToggle}
            aria-label="Welcome Back - View recently viewed vehicle"
            className="relative z-0 w-11 h-11 sm:w-13 sm:h-13 bg-brand hover:opacity-90 text-white rounded-full flex items-center justify-center shadow-xl shadow-brand/25 border border-brand-green2 hover:scale-105 active:scale-95 transition-all cursor-pointer animate-widget-pulse"
          >
            <BellIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-bell-ring" />
          </button>
        </motion.div>
      )}
      <MessageModal
        isOpen={isRequestInfoOpen}
        onClose={() => setIsRequestInfoOpen(false)}
        vehicle={latestVehicle}
      />
    </AnimatePresence>
  );
}
