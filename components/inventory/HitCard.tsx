
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";

import { PriceDrop } from "@/components/common/PriceDrop";
import { getConstants } from "@/constants";
import { useAppConfig } from "@/app/providers";
import { useWishlist } from "@/context/WishlistContext";
import { getEffectivePrice, isValidPriceDrop } from "@/utils/pricing";
import { MessageModal } from "./VehicleInfo";
import { RecentlyViewedTag } from "@/components/inventory/RecentlyViewedTag";
import { useRecentlyViewed } from "@/lib/recentlyViewed";

/* =========================
   HitCard Component (Inventory)
========================= */

type HitCardHit = {
  inventory_id?: string | number;
  year?: number | string;
  make?: string;
  model?: string;
  trim?: string;
  price?: number | string;
  special_price?: number | string;
  odometer?: number | string;
  drivetrain?: string;
  stock_no?: string;
  status?: string;
  sub_status?: string;
  image_urls?: string;
  vehicle_type?: string;
  financing_on?: number | string;
  financing_special?: number | string;
  emi_amount?: number | string;
  downpayment?: number | string;
  payment_frequency?: string;
  interest_rate?: number | string;
  term?: number | string;
  [key: string]: unknown;
};

/* =========================
   Bi-weekly payment calculation

   Uses:
   - Effective finance price
   - Down payment
   - Annual interest rate
   - Loan term in months

   Assumes 26 payments per year.
========================= */

const calculateBiWeeklyPayment = (
  price: number,
  downPayment: number,
  annualInterestRate: number,
  termMonths: number
): number | null => {
  const principal = price - downPayment;

  if (
    !Number.isFinite(principal) ||
    !Number.isFinite(annualInterestRate) ||
    !Number.isFinite(termMonths) ||
    principal <= 0 ||
    downPayment < 0 ||
    annualInterestRate < 0 ||
    termMonths <= 0 ||
    downPayment > price
  ) {
    return null;
  }

  const numberOfPayments = (termMonths / 12) * 26;
  const periodicRate = annualInterestRate / 100 / 26;

  if (numberOfPayments <= 0) {
    return null;
  }

  if (periodicRate === 0) {
    return principal / numberOfPayments;
  }

  const payment =
    (principal * periodicRate) /
    (1 - Math.pow(1 + periodicRate, -numberOfPayments));

  return Number.isFinite(payment) && payment > 0 ? payment : null;
};

/* =========================
   Currency formatter
========================= */

const formatCurrency = (amount: number): string =>
  amount.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatCashDown = (amount: number): string =>
  amount.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  });

/* =========================
   Reusable information icon
========================= */

const InfoIcon = () => (
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
);

export const HitCard = ({ hit }: { hit: HitCardHit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePriceTab, setActivePriceTab] = useState<"finance" | "cash">("finance");
  const [activeTooltip, setActiveTooltip] = useState<
    "finance" | "cash" | "payment" | null
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

  const { hasBeenViewed } = useRecentlyViewed();

  const inventoryId = String(hit.inventory_id ?? "");
  const isRecentlyViewedVehicle = hasBeenViewed(inventoryId);

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

  /* =========================
     Vehicle information
  ========================= */

  const phoneNumber = PHONE_NUMBER || "";

  const title = `${hit.year || ""} ${hit.make || ""} ${hit.model || ""
    } ${hit.trim || ""}`.trim();

  const price =
    getEffectivePrice(hit.price, hit.special_price) ?? 0;

  const hasPriceDrop = isValidPriceDrop(
    hit.price,
    hit.special_price
  );

  const km = Number(hit.odometer) || 0;
  const drivetrain = hit.drivetrain || "N/A";
  const stock = hit.stock_no || "N/A";

  const isSold =
    Boolean(hit.status) &&
    String(hit.status).toLowerCase() !== "instock";

  const isDealPending = hit.sub_status === "Deal Pending";

  // Read the financing settings from the API.
  const downPayment = Number(hit.downpayment ?? 0);
  const interestRate = Number(hit.interest_rate);
  const termMonths = Number(hit.term);

  // Calculate using the effective finance price and API settings.
  const biWeeklyPayment = calculateBiWeeklyPayment(
    price,
    downPayment,
    interestRate,
    termMonths
  );

  // The API's emi_amount is not used for the displayed payment.
  const isFinancingEnabled = Number(hit.financing_on) != 1;

  const hasFinancingDetails =
    isFinancingEnabled &&
    biWeeklyPayment !== null &&
    Number.isFinite(downPayment) &&
    downPayment >= 0;

  /* =========================
     Vehicle images
  ========================= */

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

  /* =========================
     Vehicle URL
  ========================= */

  const getVehicleUrl = (hitDoc: HitCardHit) => {
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
              className={`w-full object-cover h-[240px] min-h-[240px] 2xl:h-[260px] 2xl:min-h-[260px] rounded-xl transition-transform duration-500 ${isSold || isDealPending
                ? "grayscale opacity-80"
                : ""
                }`}
            />

            {isRecentlyViewedVehicle && (
              <div>
                <RecentlyViewedTag />
              </div>
            )}

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

                  if (isInWishlist(inventoryId)) {
                    removeFromWishlist(inventoryId);
                  } else {
                    addToWishlist({
                      inventory_id: inventoryId,
                      title,
                      price,
                      odometer: km,
                      image_url: imageSrc,
                      year: Number(hit.year ?? 0),
                      make: String(hit.make ?? ""),
                      model: String(hit.model ?? ""),
                      trim: String(hit.trim ?? ""),
                      stock_no: stock,
                      drivetrain,
                      status: String(hit.status ?? "instock"),
                    });
                  }
                }}
                className="absolute top-[14px] right-[14px] p-1 cursor-pointer rounded-full bg-white/90 hover:bg-white transition-colors shadow-md z-20"
                aria-label={
                  isInWishlist(inventoryId)
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
              >
                <Heart
                  className={`w-5 h-5 ${isInWishlist(inventoryId)
                    ? "fill-brand-green stroke-none"
                    : "stroke-gray-600"
                    } transition-colors`}
                />
              </button>
            )}
          </div>

          {/* Price drop badge */}
          {!isSold && hasPriceDrop && (
            <div className="w-fit mx-3 z-10 rounded-lg bg-brand px-2 py-1.5 -mt-1 text-[13px] font-medium leading-none text-white">
              Price drop
            </div>
          )}

          {/* Card body */}
          <div className="flex flex-col flex-1 px-[15px] pt-2 pb-0 text-start">
            <h3 className="text-[16px] font-[600] text-foreground leading-[22px] overflow-hidden text-ellipsis line-clamp-2 min-h-[44px]">
              {title}
            </h3>

            <hr className="border-gray-200 mt-[4px]" />

            {/* Price and mileage */}
            <div>
              {!isSold ? (
                hit?.vehicle_type?.toLowerCase() === "as-is" ? (
                  /* AS-IS VEHICLE */
                  <div className="text-[17px] w-full font-semibold text-foreground leading-6 mt-2 py-[3px]">
                    <div className="flex justify-between items-center w-full">
                      {price > 0 ? (
                        <PriceDrop
                          price={hit.price}
                          specialPrice={hit.special_price}
                        />
                      ) : (
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
                              d="M3 5a2 2 0 012-2h3.28a2 2 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a11.042 11.042 0 01.502-1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a11.042 11.042 0 011.21-.502l4.493 1.498a11.042 11.042 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          <span>Call for price</span>
                        </span>
                      )}
                    </div>
                  </div>
                ) : price > 0 ? (
                  /* NORMAL VEHICLE - HAS PRICE */
                  <div className="w-full">
                    <div className="grid grid-cols-2 border-b border-gray-200">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActivePriceTab("finance");
                          setActiveTooltip(null);
                        }}
                        className={`relative py-2 text-[13px] font-medium transition-colors ${activePriceTab === "finance"
                          ? "text-brand-green"
                          : "text-gray-500 hover:text-gray-700"
                          }`}
                      >
                        Finance
                        {activePriceTab === "finance" && (
                          <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-brand-green" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActivePriceTab("cash");
                          setActiveTooltip(null);
                        }}
                        className={`relative py-2 text-[13px] font-medium transition-colors ${activePriceTab === "cash"
                          ? "text-brand-green"
                          : "text-gray-500 hover:text-gray-700"
                          }`}
                      >
                        Cash
                        {activePriceTab === "cash" && (
                          <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-brand-green" />
                        )}
                      </button>
                    </div>

                    {/* Selected Price */}
                    <div className="flex items-center justify-between gap-2 pt-2">
                      <div className="flex items-center gap-1 min-w-0">
                        {activePriceTab === "finance" ? (
                          <PriceDrop
                            price={hit.price}
                            specialPrice={hit.special_price}
                            className='text-[22px] font-extrabold leading-none text-price-green'
                          />
                        ) : (
                          <PriceDrop
                            price={hit.price}
                            specialPrice={hit.special_price}
                            adjustment={2000}
                            showArrow={false}
                            className='text-[22px] font-extrabold leading-none text-price-green'
                          />
                        )}

                        <div className="relative group shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setActiveTooltip((prev) =>
                                prev === activePriceTab ? null : activePriceTab
                              );
                            }}
                            aria-label={`${activePriceTab === "finance" ? "Finance" : "Cash"} price information`}
                            className="flex items-center justify-center p-0.5"
                          >
                            <InfoIcon />
                          </button>

                          <div
                            className={`absolute bottom-full right-0 mb-2 w-[240px] max-w-[calc(100vw-32px)] bg-black text-white text-xs sm:text-sm leading-5 px-3 py-2.5 rounded-lg shadow-xl z-[9999] transition-opacity duration-150 ${activeTooltip === activePriceTab
                              ? "opacity-100 visible"
                              : "opacity-0 invisible"
                              } group-hover:opacity-100 group-hover:visible`}
                          >
                            {activePriceTab === "finance"
                              ? "Finance price does not include taxes and licensing fees."
                              : "Cash price does not include taxes and licensing fees."}
                            <div className="absolute right-2 bottom-[-5px] w-2.5 h-2.5 bg-black rotate-45" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* NORMAL VEHICLE - NO PRICE */
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
                          d="M3 5a2 2 0 012-2h3.28a2 2 0 01.948.684l1.498 4.493a2 2 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a2 2 0 01.502-1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a11.042 11.042 0 011.21-.502l4.493 1.498a2 2 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 19 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span>Call for price</span>
                    </div>
                  </div>
                )
              ) : null}

              {/* Financing payment and cash down */}
              {!isSold && hasFinancingDetails && (
                <>
                  <p className="text-[14px] text-gray-700/80 leading-[14px] mt-[5px] flex justify-start items-center gap-1">
                    {formatCurrency(biWeeklyPayment!)}
                    /Bi-Weekly

                    <span className="relative group shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          setActiveTooltip((prev) =>
                            prev === "payment" ? null : "payment"
                          );
                        }}
                        aria-label="Financing payment information"
                        className="flex items-center justify-center p-0.5"
                      >
                        <InfoIcon />
                      </button>

                      <span
                        className={`absolute bottom-full right-0 mb-2 w-[240px] max-w-[calc(100vw-32px)] bg-black text-white text-xs sm:text-sm leading-5 px-3 py-2.5 rounded-lg shadow-xl z-[9999] transition-opacity duration-150 ${activeTooltip === "payment"
                          ? "opacity-100 visible"
                          : "opacity-0 invisible"
                          } group-hover:opacity-100 group-hover:visible`}
                      >
                        Estimated bi-weekly financing payment. Taxes and licensing fees are not included.
                        <span className="absolute right-2 bottom-[-5px] w-2.5 h-2.5 bg-black rotate-45" />
                      </span>
                    </span>
                  </p>

                  <p className="text-[14px] text-gray-700/80 leading-[14px] mt-[4px] flex-1">
                    {formatCashDown(downPayment)} cash down
                  </p>
                </>
              )}

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
                  d="M3 5a2 2 0 012-2h3.28a2 2 0 01.948.684l1.498 4.493a2 2 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a2 2 0 011.21-.502l4.493 1.498a2 2 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 9.716 3 14.284 3 6V5z"
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
