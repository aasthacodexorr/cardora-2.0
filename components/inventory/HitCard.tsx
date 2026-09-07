"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";

import { getConstants } from "@/constants";
import { useAppConfig } from "@/app/providers";
import { useWishlist } from "@/context/WishlistContext";
import { MessageModal } from "./VehicleInfo";

/* =========================
   HitCard Component (Inventory)
========================= */

export const HitCard = ({ hit }: { hit: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<
    "finance" | "cash" | null
  >(null);

  const tooltipRef = useRef<HTMLDivElement>(null);

  const appConfig = useAppConfig();

  const {
    SITE_CONFIG,
    PHONE_NUMBER,
    DEFAULT_PLACEHOLDER_IMAGE,
  } = getConstants(appConfig);

  const {
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    isHydrated,
  } = useWishlist();

  /* =========================
     Close tooltip on outside click
  ========================= */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setActiveTooltip(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* Phone number fallback strategy */
  const phoneNumber = PHONE_NUMBER || "";

  const title = `${hit.year || ""} ${hit.make || ""} ${hit.model || ""} ${
    hit.trim || ""
  }`.trim();

  const price = Number(hit.selling_price) || 0;
  const km = Number(hit.odometer) || 0;
  const drivetrain = hit.drivetrain || "N/A";
  const stock = hit.stock_no || "N/A";

  const isSold =
    hit.status && hit.status.toLowerCase() !== "instock";

  const isDealPending = hit.sub_status === "Deal Pending";

  const imageUrls = hit.image_urls
    ? hit.image_urls.split(";")
    : [];

  let imageSrc =
    DEFAULT_PLACEHOLDER_IMAGE ||
    `${SITE_CONFIG?.urls?.assetBaseUrl}/image/default-placeholder.jpg`;

  if (imageUrls.length > 0) {
    const firstUrl = imageUrls[0].trim();

    imageSrc = firstUrl.startsWith("/")
      ? `${SITE_CONFIG?.urls?.assetBaseUrl}${firstUrl}`
      : firstUrl;
  }

  const getVehicleUrl = (hitDoc: any) => {
    const slug = [
      hitDoc.inventory_id,
      hitDoc.year,
      hitDoc.make,
      hitDoc.model,
      hitDoc.trim,
    ]
      .filter(Boolean)
      .join("-")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    return `/inventory/${slug}`;
  };

  const vehicleUrl = getVehicleUrl(hit);

  return (
    <>
      <div className="block h-full rounded-[20px] cursor-pointer bg-white overflow-visible flex flex-col gap-2 hover:shadow-none transition-none relative border border-border-standard">
        <article
          onClick={() => {
            window.location.href = vehicleUrl;
          }}
        >
          {/* Vehicle image with heart overlay */}
          <div className="relative overflow-hidden rounded-t-[19px] p-3">
            <Image
              src={imageSrc}
              alt={title}
              width={600}
              height={400}
              className={`w-full object-cover h-[240px] min-h-[240px] 2xl:h-[260px] 2xl:min-h-[260px] rounded-xl transition-transform duration-500 ${
                isSold || isDealPending
                  ? "grayscale opacity-80"
                  : ""
              }`}
            />

            {/* SOLD Ribbon */}
            {isSold && (
              <div className="absolute top-4 -left-10 rotate-[-45deg] text-white text-[14px] font-bold uppercase tracking-[3px] shadow-lg w-[160px] text-center py-[6px] z-10 bg-sold-overlay">
                Sold
              </div>
            )}

            {/* DEAL PENDING Ribbon */}
            {isDealPending && (
              <div className="absolute uppercase ml-1 top-4 left-1/2 -translate-x-1/2 w-fit whitespace-nowrap text-white text-[11px] font-semibold shadow-lg text-center py-[6px] px-3 rounded-md z-10 bg-brand-green">
                Deal Pending
              </div>
            )}

            {/* Wishlist Button */}
            {isHydrated && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  if (isInWishlist(hit.inventory_id)) {
                    removeFromWishlist(hit.inventory_id);
                  } else {
                    addToWishlist({
                      inventory_id: hit.inventory_id,
                      title,
                      price,
                      odometer: km,
                      image_url: imageSrc,
                      year: hit.year,
                      make: hit.make,
                      model: hit.model,
                      trim: hit.trim || "",
                      stock_no: stock,
                      drivetrain,
                      status: hit.status,
                    });
                  }
                }}
                className="absolute top-[14px] right-[14px] p-1 cursor-pointer rounded-full bg-white/90 hover:bg-white transition-colors shadow-md z-20"
                aria-label={
                  isInWishlist(hit.inventory_id)
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
              >
                <Heart
                  className={`w-5 h-5 ${
                    isInWishlist(hit.inventory_id)
                      ? "fill-brand-green stroke-none"
                      : "stroke-gray-600"
                  } transition-colors`}
                />
              </button>
            )}
          </div>

          {/* Card body */}
          <div className="flex flex-col flex-1 px-[15px] pt-3 pb-0 text-start">
            <h3 className="text-[16px] font-[600] text-foreground leading-[22px] overflow-hidden text-ellipsis line-clamp-2 min-h-[44px]">
              {title}
            </h3>

            <hr className="border-gray-200 mt-[4px]" />

            {/* Price and mileage */}
            <div>
              {!isSold ? (
                hit?.vehicle_type?.toLowerCase() === "as-is" ? (
                  /* =========================
                     AS-IS VEHICLE
                     ========================= */
                  <div className="text-[17px] w-full font-semibold text-foreground leading-6 mt-2 py-[3px]">
                    <div className="flex justify-between items-center w-full">
                      {price > 0 ? (
                        <span>
                          ${price.toLocaleString("en-CA")}.00
                        </span>
                      ) : (
                        /* Single Call for price */
                        <span className="flex items-center gap-1 text-price-green">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 01.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>

                          <span>Call for price</span>
                        </span>
                      )}
                    </div>
                  </div>
                ) : price > 0 ? (
                  /* =========================
                     NORMAL VEHICLE - HAS PRICE
                     ========================= */
                  <div
                    ref={tooltipRef}
                    className="text-[17px] w-full font-semibold text-foreground leading-6 mt-2 py-[3px] flex flex-col gap-1"
                  >
                    {/* Finance Price */}
                    <div className="flex justify-between items-center w-full">
                      <span>Finance Price</span>

                      <div className="relative inline-flex items-center gap-1">
                        <span>
                          ${price.toLocaleString("en-CA")}.00
                        </span>

                        {/* Finance Info */}
                        <div className="relative group shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();

                              setActiveTooltip((prev) =>
                                prev === "finance"
                                  ? null
                                  : "finance"
                              );
                            }}
                            aria-label="Finance price information"
                            className="flex items-center justify-center p-0.5"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4 text-gray-400 cursor-pointer"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>

                          <div
                            className={`absolute bottom-full right-0 mb-2 w-[240px] max-w-[calc(100vw-32px)] bg-black text-white text-xs sm:text-sm leading-5 px-3 py-2.5 rounded-lg shadow-xl z-[9999] transition-opacity duration-150 ${
                              activeTooltip === "finance"
                                ? "opacity-100 visible"
                                : "opacity-0 invisible"
                            } group-hover:opacity-100 group-hover:visible`}
                          >
                            Finance price does not include taxes and licensing fees.

                            <div className="absolute right-2 bottom-[-5px] w-2.5 h-2.5 bg-black rotate-45" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cash Price */}
                    <div className="flex justify-between items-center w-full">
                      <span>Cash Price</span>

                      <div className="relative inline-flex items-center gap-1">
                        <span>
                          ${(price + 2000).toLocaleString("en-CA")}.00
                        </span>

                        {/* Cash Info */}
                        <div className="relative group shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();

                              setActiveTooltip((prev) =>
                                prev === "cash" ? null : "cash"
                              );
                            }}
                            aria-label="Cash price information"
                            className="flex items-center justify-center p-0.5"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4 text-gray-400 cursor-pointer"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>

                          <div
                            className={`absolute bottom-full right-0 mb-2 w-[240px] max-w-[calc(100vw-32px)] bg-black text-white text-xs sm:text-sm leading-5 px-3 py-2.5 rounded-lg shadow-xl z-[9999] transition-opacity duration-150 ${
                              activeTooltip === "cash"
                                ? "opacity-100 visible"
                                : "opacity-0 invisible"
                            } group-hover:opacity-100 group-hover:visible`}
                          >
                            Cash price does not include taxes and licensing
                            fees.

                            <div className="absolute right-2 bottom-[-5px] w-2.5 h-2.5 bg-black rotate-45" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* =========================
                     NORMAL VEHICLE - NO PRICE
                     ========================= */
                  <div className="text-[17px] w-full font-semibold leading-6 mt-2 py-[3px]">
                    <div className="flex items-center gap-1 text-price-green">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>

                      <span>Call for price</span>
                    </div>
                  </div>
                )
              ) : null}

              {/* Mileage + Drivetrain */}
              <p className="text-[14px] text-gray-700/80 leading-[14px] mt-[10px] flex-1">
                {km.toLocaleString()} KM
                {drivetrain && drivetrain !== "N/A" && (
                  <> &bull; {drivetrain}</>
                )}
              </p>
            </div>

            <hr className="border-gray-200 my-2" />

            <p className="text-[12px] mb-2 font-light">
              Stock #: {stock}
            </p>
          </div>
        </article>

        {/* Action Buttons */}
        {!isSold && !isDealPending && (
          <div className="w-full rounded-[12px] mb-3 px-3 mt-auto flex gap-2">
            {/* Call Button */}
            <a
              href={phoneNumber ? `tel:${phoneNumber}` : "#"}
              onClick={(e) => e.stopPropagation()}
              className="cursor-pointer flex-1 text-center rounded-[10px] sm:rounded-[12px] text-gray-800 bg-white hover:bg-gray-100 py-[10px] text-[14px] sm:text-[15px] font-medium transition-colors border border-gray-300 flex items-center justify-center gap-1"
            >
              <svg
                className="w-4 h-4 shrink-0 overflow-visible"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>

              <span>Call</span>
            </a>

            {/* Check Availability Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="cursor-pointer flex-[2] text-center rounded-[10px] sm:rounded-[12px] text-white py-[10px] text-[14px] sm:text-[15px] font-medium hover:opacity-90 transition-opacity bg-brand border border-brand-green2"
            >
              Check availability
            </button>
          </div>
        )}
      </div>

      {/* Availability Modal */}
      <MessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicle={hit}
      />
    </>
  );
};