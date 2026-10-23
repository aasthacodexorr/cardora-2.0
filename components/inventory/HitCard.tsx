"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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

export type HitCardHit = {
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



const getPaymentFrequencyDetails = (frequency?: string) => {
  const normalizedFrequency = frequency?.trim().toLowerCase();

  switch (normalizedFrequency) {
    case "bi-weekly":
    case "biweekly":
    case "bi weekly":
      return {
        label: "Bi-Weekly",
        paymentsPerYear: 26,
      };

    case "monthly":
      return {
        label: "Monthly",
        paymentsPerYear: 12,
      };

    case "yearly":
    case "annually":
    case "annual":
      return {
        label: "Yearly",
        paymentsPerYear: 1,
      };

    default:
      return {
        label: "Bi-Weekly",
        paymentsPerYear: 26,
      };
  }
};

/* =========================
   Bi-weekly payment calculation
========================= */



const calculatePayment = (
  price: number,
  downPayment: number,
  annualInterestRate: number,
  termMonths: number,
  paymentsPerYear: number
): number | null => {
  const loanAmount = price - downPayment;

  if (
    !Number.isFinite(price) ||
    !Number.isFinite(downPayment) ||
    !Number.isFinite(loanAmount) ||
    !Number.isFinite(annualInterestRate) ||
    !Number.isFinite(termMonths) ||
    !Number.isFinite(paymentsPerYear) ||
    loanAmount <= 0 ||
    price <= 0 ||
    downPayment < 0 ||
    downPayment > price ||
    annualInterestRate < 0 ||
    termMonths <= 0 ||
    paymentsPerYear <= 0
  ) {
    return null;
  }

  // Calculate the number of payments for the selected loan term.
  const numberOfPayments = (termMonths / 12) * paymentsPerYear;

  // Calculate the interest rate per payment period.
  const periodicRate =
    annualInterestRate / 100 / paymentsPerYear;

  let payment: number;

  if (periodicRate === 0) {
    payment = loanAmount / numberOfPayments;
  } else {
    const rateFactor = Math.pow(
      1 + periodicRate,
      numberOfPayments
    );

    payment =
      (loanAmount * periodicRate * rateFactor) /
      (rateFactor - 1);
  }

  return Number.isFinite(payment) && payment > 0
    ? payment
    : null;
};



/* =========================
   Currency formatters
========================= */

const formatCurrency = (amount: number): string =>
  Math.floor(amount).toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const formatCashDown = (amount: number): string =>
  amount.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  });

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4.5 h-4.5 text-gray-400 cursor-pointer"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
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
  const [activeTooltip, setActiveTooltip] = useState<"finance" | "cash" | "payment" | null>(null);

  const tooltipRef = useRef<HTMLDivElement>(null);
  const appConfig = useAppConfig();

  const { SITE_CONFIG, PHONE_NUMBER, DEFAULT_PLACEHOLDER_IMAGE } = getConstants(appConfig);
  const { isInWishlist, addToWishlist, removeFromWishlist, isHydrated } = useWishlist();
  const { hasBeenViewed } = useRecentlyViewed();

  const inventoryId = String(hit.inventory_id ?? "");
  const isRecentlyViewedVehicle = hasBeenViewed(inventoryId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setActiveTooltip(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const phoneNumber = PHONE_NUMBER || "";
  const title = `${hit.year || ""} ${hit.make || ""} ${hit.model || ""} ${hit.trim || ""}`.trim();
  const price = getEffectivePrice(hit.price, hit.special_price) ?? 0;
  const hasPriceDrop = isValidPriceDrop(hit.price, hit.special_price);
  const km = Number(hit.odometer) || 0;
  const drivetrain = hit.drivetrain || "N/A";
  const stock = hit.stock_no || "N/A";

  const isSold = Boolean(hit.status) && String(hit.status).toLowerCase() !== "instock";
  const isDealPending = hit.sub_status === "Deal Pending";

  const downPayment = Number(hit.downpayment ?? 0);
  const interestRate = Number(hit.interest_rate);
  const termMonths = Number(hit.term);

  const paymentFrequency = getPaymentFrequencyDetails(hit.payment_frequency);

  const paymentAmount = calculatePayment(
    price,
    downPayment,
    interestRate,
    termMonths,
    paymentFrequency.paymentsPerYear
  );
  const isFinancingEnabled = Number(hit.financing_on) === 1;
  const hasFinancingDetails =
    isFinancingEnabled &&
    paymentAmount !== null &&
    Number.isFinite(downPayment) &&
    downPayment >= 0;

  const imageUrls = hit.image_urls ? hit.image_urls.split(";") : [];
  let imageSrc = DEFAULT_PLACEHOLDER_IMAGE || `${SITE_CONFIG?.urls?.assetBaseUrl}/image/default-placeholder.jpg`;

  if (imageUrls.length > 0) {
    const firstUrl = imageUrls[0].trim();
    imageSrc = firstUrl.startsWith("/") ? `${SITE_CONFIG?.urls?.assetBaseUrl}${firstUrl}` : firstUrl;
  }

  const slug = [hit.inventory_id, hit.year, hit.make, hit.model, hit.trim]
    .filter(Boolean)
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const vehicleUrl = `/inventory/${slug}`;

  return (
    <>
      <div className="relative flex flex-col justify-between h-full bg-white border border-border-standard rounded-[20px] overflow-visible group/card">
        {/* Clickable Card Body Area */}
        <Link href={vehicleUrl} className="flex flex-col flex-1 focus:outline-none">
          {/* Image & Badges */}
          <div className="relative overflow-hidden rounded-t-[19px] p-3">
            <Image
              src={imageSrc}
              alt={title}
              width={600}
              height={400}
              className={`w-full object-cover h-[240px] min-h-[240px] 2xl:h-[260px] 2xl:min-h-[260px] rounded-xl transition-transform duration-500 ${isSold || isDealPending ? "grayscale opacity-80" : ""
                }`}
            />

            {isRecentlyViewedVehicle && (
              <div>
                <RecentlyViewedTag />
              </div>
            )}

            {isSold && (
              <div className="absolute top-4 -left-10 rotate-[-45deg] text-white text-[14px] font-bold uppercase tracking-[3px] shadow-lg w-[160px] text-center py-[6px] z-10 bg-sold-overlay">
                Sold
              </div>
            )}

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
                className="absolute top-[14px] right-[14px] p-1.5 cursor-pointer rounded-full bg-white/90 hover:bg-white transition-colors shadow-md z-20"
                aria-label={isInWishlist(inventoryId) ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={`w-5 h-5 ${isInWishlist(inventoryId) ? "fill-brand-green stroke-none" : "stroke-gray-600"
                    } transition-colors`}
                />
              </button>
            )}
          </div>

          {/* Price drop tag */}
          {!isSold && hasPriceDrop && (
            <div className="w-fit mx-3 z-10 rounded-lg bg-brand px-2 py-1.5 -mt-1 text-[13px] font-medium leading-none text-white">
              Price drop
            </div>
          )}

          {/* Details Body */}
          <div className="flex flex-col flex-1 px-[15px] pt-2 pb-0 text-start">
            <h3 className="text-[16px] font-[600] text-foreground leading-[22px] overflow-hidden text-ellipsis line-clamp-2 min-h-[44px]">
              {title}
            </h3>

            {/* Mileage & Stock */}
            <p className="text-[14px] text-gray-700/80 leading-[14px] mt-[10px]">
              {km.toLocaleString()} KM {drivetrain && drivetrain !== "N/A" && <>&bull; {drivetrain}</>}
            </p>

            {/* Price Selection / Call for price */}
            <div ref={tooltipRef}>
              {!isSold ? (
                hit?.vehicle_type?.toLowerCase() === "as-is" ? (
                  <div className="text-[17px] w-full font-semibold text-foreground leading-6 mt-2 py-[3px]">
                    <div className="flex justify-between items-center w-full">
                      {price > 0 ? (
                        <PriceDrop price={hit.price} specialPrice={hit.special_price} />
                      ) : (
                        <span className="flex items-center gap-1 text-price-green">
                          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          <span>Call for price</span>
                        </span>
                      )}
                    </div>
                  </div>
                ) : price > 0 ? (
                  <div className="w-full">
                    {/* Finance vs Cash Tabs */}
                    <div className="grid grid-cols-2 mt-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActivePriceTab("finance");
                          setActiveTooltip(null);
                        }}
                        className={`relative py-2 cursor-pointer text-[14px] font-semibold transition-colors ${activePriceTab === "finance" ? "text-brand-green" : "text-gray-500 hover:text-gray-700"
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
                        className={`relative py-2 cursor-pointer text-[14px] font-semibold transition-colors ${activePriceTab === "cash" ? "text-brand-green" : "text-gray-500 hover:text-gray-700"
                          }`}
                      >
                        Cash
                        {activePriceTab === "cash" && (
                          <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-brand-green" />
                        )}
                      </button>
                    </div>

                    {/* Price & Tooltip */}
                    <div className="flex items-center justify-between gap-2 pt-2">
                      <div className="flex items-center gap-1 min-w-0">
                        {activePriceTab === "finance" ? (
                          <PriceDrop
                            price={hit.price}
                            specialPrice={hit.special_price}
                            className="text-[23px] font-extrabold leading-none text-price-black"
                          />
                        ) : (
                          <PriceDrop
                            price={hit.price}
                            specialPrice={hit.special_price}
                            adjustment={2000}
                            showArrow={false}
                            className="text-[23px] font-extrabold leading-none text-price-black"
                          />
                        )}

                        <div className="relative group shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setActiveTooltip((prev) => (prev === activePriceTab ? null : activePriceTab));
                            }}
                            aria-label={`${activePriceTab === "finance" ? "Finance" : "Cash"} price information`}
                            className="flex items-center justify-center p-0.5"
                          >
                            <InfoIcon />
                          </button>

                          <div
                            className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[240px] max-w-[calc(100vw-32px)] bg-black text-white text-xs sm:text-sm leading-5 px-3 py-2.5 rounded-lg shadow-xl z-[9999] transition-opacity duration-150 pointer-events-none ${activeTooltip === activePriceTab ? "opacity-100 visible" : "opacity-0 invisible"
                              } group-hover:opacity-100 group-hover:visible`}
                          >
                            {activePriceTab === "finance"
                              ? "Finance price does not include taxes and licensing fees."
                              : "Cash price does not include taxes and licensing fees."}
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-5px] w-2.5 h-2.5 bg-black rotate-45" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-[17px] w-full font-semibold leading-6 mt-1.5">
                    <div className="flex items-center gap-1 text-price-green border-t border-gray-300 py-2">
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span>Call for price</span>
                    </div>
                  </div>
                )
              ) : null}

              {/* Bi-weekly & Cash Down Section */}
              {!isSold && hasFinancingDetails && (
                <>
                  <p className="text-[14px] text-gray-700/80 leading-[14px] mt-[5px] flex justify-start items-center gap-1">
                    {formatCurrency(paymentAmount!)}/{paymentFrequency.label} estimated
                    <span className="relative group shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveTooltip((prev) => (prev === "payment" ? null : "payment"));
                        }}
                        aria-label="Financing payment information"
                        className="flex items-center justify-center p-0.5"
                      >
                        <InfoIcon />
                      </button>

                      <span
                        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[240px] max-w-[calc(100vw-32px)] bg-black text-white text-xs sm:text-sm leading-5 px-3 py-2.5 rounded-lg shadow-xl z-[9999] transition-opacity duration-150 pointer-events-none ${activeTooltip === "payment" ? "opacity-100 visible" : "opacity-0 invisible"
                          } group-hover:opacity-100 group-hover:visible`}
                      >
                        Estimated bi-weekly financing payment. Taxes and licensing fees are not included.
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-[-5px] w-2.5 h-2.5 bg-black rotate-45" />
                      </span>
                    </span>
                  </p>

                  <p className="text-[14px] text-gray-700/80 leading-[14px] mt-[4px]">
                    {formatCashDown(downPayment)} cash down
                  </p>
                </>
              )}
            </div>

            <p className="text-[12px] mb-2 font-light text-gray-500 mt-1">Stock #: {stock}</p>
          </div>
        </Link>

        {/* Action Buttons */}
        {!isSold && !isDealPending && (
          <div className="w-full rounded-[12px] mb-3 px-3 mt-auto flex gap-2">
            <a
              href={phoneNumber ? `tel:${phoneNumber}` : "#"}
              className="cursor-pointer flex-1 text-center rounded-[10px] sm:rounded-[12px] text-gray-800 bg-white hover:bg-gray-100 py-[10px] text-[14px] sm:text-[15px] font-medium transition-colors border border-gray-300 flex items-center justify-center gap-1"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>Call</span>
            </a>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer flex-[2] text-center rounded-[10px] sm:rounded-[12px] text-white py-[10px] text-[14px] sm:text-[15px] font-medium hover:opacity-90 transition-opacity bg-brand border border-brand-green2"
            >
              Check availability
            </button>
          </div>
        )}
      </div>

      {/* Availability Modal */}
      <MessageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} vehicle={hit} />
    </>
  );
};