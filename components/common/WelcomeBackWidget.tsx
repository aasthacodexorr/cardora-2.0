"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, ArrowRight } from "lucide-react";
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

export default function WelcomeBackWidget() {
  const pathname = usePathname();
  const appConfig = useAppConfig();
  const { SITE_CONFIG, DEFAULT_PLACEHOLDER_IMAGE } = getConstants(appConfig);
  const { recentlyViewedVehicles } = useRecentlyViewed();

  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Latest vehicle viewed
  const latestVehicle = recentlyViewedVehicles[0];

  // Route calculations
  const routeInfo = useMemo(() => {
    if (!pathname) {
      return { isVdp: false, isInventoryListing: false, isHomePage: false };
    }

    const isHome = pathname === "/";
    const isInvPath = pathname === "/inventory" || pathname.startsWith("/inventory/");

    if (!isInvPath) {
      return { isVdp: false, isInventoryListing: false, isHomePage: isHome };
    }

    const segments = pathname.replace(/^\/inventory\/?/, "").split("/").filter(Boolean);
    const isVehiclePage = isVehicleDetailSlug(segments);

    return {
      isVdp: isVehiclePage,
      isInventoryListing: !isVehiclePage,
      isHomePage: isHome,
    };
  }, [pathname]);

  const { isVdp, isInventoryListing, isHomePage } = routeInfo;

  // Mount detection for SSR safety
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle auto-open on Inventory listing page vs closed on Homepage
  useEffect(() => {
    if (!isMounted || !latestVehicle) return;

    // Do nothing on VDP pages
    if (isVdp) {
      setIsOpen(false);
      return;
    }

    if (isInventoryListing) {
      // Check if user already dismissed for the current VDP visit
      try {
        const lastVdpTime = window.sessionStorage.getItem("cardora_last_vdp_view_time") || "initial";
        const lastDismissedTime = window.sessionStorage.getItem("cardora_welcome_back_dismissed");

        if (lastDismissedTime !== lastVdpTime) {
          // Auto-open with a brief delay for a polished entry transition
          const timer = setTimeout(() => {
            setIsOpen(true);
          }, 350);
          return () => clearTimeout(timer);
        }
      } catch {
        // Fallback open if storage is unavailable
        setIsOpen(true);
      }
    } else if (isHomePage) {
      // On Home page, initial view is closed with bell icon shown
      setIsOpen(false);
    }
  }, [pathname, isInventoryListing, isHomePage, isVdp, isMounted, latestVehicle?.inventory_id]);

  // Click outside to dismiss popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        // Check if the click was not on the bell button
        const bellButton = document.getElementById("welcome-back-bell-trigger");
        if (bellButton && bellButton.contains(event.target as Node)) {
          return;
        }
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
    setIsOpen(false);
    try {
      if (typeof window !== "undefined") {
        const lastVdpTime = window.sessionStorage.getItem("cardora_last_vdp_view_time") || "initial";
        window.sessionStorage.setItem("cardora_welcome_back_dismissed", lastVdpTime);
      }
    } catch {
      // Ignore storage errors
    }
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  // Do not render anything during SSR, if on VDP page, or if no vehicle has been viewed
  if (!isMounted || isVdp || !latestVehicle) {
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
  const scheduleAppointmentUrl = "/schedule-an-appointment-with-expert";

  // Extract vehicle image
  const imageUrls = latestVehicle.image_urls ? latestVehicle.image_urls.split(";") : [];
  let imageSrc = DEFAULT_PLACEHOLDER_IMAGE || `${SITE_CONFIG?.urls?.assetBaseUrl}/image/default-placeholder.jpg`;
  if (imageUrls.length > 0 && imageUrls[0]) {
    const firstUrl = imageUrls[0].trim();
    imageSrc = firstUrl.startsWith("/") ? `${SITE_CONFIG?.urls?.assetBaseUrl}${firstUrl}` : firstUrl;
  }

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[60] flex flex-col items-start select-none pointer-events-auto">
      {/* Welcome Back Popup Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-[calc(100vw-32px)] max-w-[300px] sm:max-w-[325px] mb-2.5 sm:mb-3 text-left max-h-[calc(100dvh-90px)] flex flex-col"
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

              {/* Action Button Row 2: Book test drive (opens schedule-an-appointment-with-expert in new tab) */}
              <div className="mt-2 sm:mt-2.5">
                <Link
                  href={scheduleAppointmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-brand hover:opacity-90 text-white text-xs sm:text-[13px] font-semibold py-2.5 px-3 rounded-lg text-center flex items-center justify-center gap-1.5 transition-opacity shadow-sm border border-brand-green2"
                >
                  <span>Book test drive</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bell Icon Trigger (Brand Colored) */}
      <button
        id="welcome-back-bell-trigger"
        type="button"
        onClick={handleToggle}
        aria-label="Welcome Back - View recently viewed vehicle"
        className="relative w-11 h-11 sm:w-13 sm:h-13 bg-brand hover:opacity-90 text-white rounded-full flex items-center justify-center shadow-xl shadow-brand/25 border border-brand-green2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <BellIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-bell-ring" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-brand font-bold text-[11px] rounded-full flex items-center justify-center shadow-md border border-brand/20">
          1
        </span>
      </button>
    </div>
  );
}
