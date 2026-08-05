"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getConstants } from "@/constants";
import { useAppConfig } from "@/app/providers";

/* =========================
   MessageModal Overlay
========================= */
const MessageModal = ({ isOpen, onClose, vehicle }: any) => {
  const appConfig = useAppConfig();
  const { SITE_CONFIG } = getConstants(appConfig);
  const inventoryId = vehicle?.inventory_id || vehicle?.id;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999] px-4 text-left lg:mt-20">
      <div className="bg-white rounded-2xl w-full z-[9999] max-w-[620px] relative shadow-2xl p-6 lg:p-5 flex flex-col max-h-[88vh]">
        <button
          onClick={onClose}
          className="absolute right-5 cursor-pointer top-5 text-gray-400 hover:text-gray-600 transition-colors"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-[24px] font-bold text-gray-900 mb-5">Check Availability</h2>
        <div className="h-[500px]">
          <iframe
            src={`${SITE_CONFIG?.urls?.vehiclePageContactUsBaseUrl}?inventory_id=${inventoryId}`}
            className="w-full rounded-2xl h-full"
            title="Contact Us"
            allow="payment"
          />
        </div>
      </div>
    </div>
  );
};

/* =========================
   HitCard Component (Inventory)
========================= */
export const HitCard = ({ hit }: { hit: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const appConfig = useAppConfig();
  const { SITE_CONFIG,PHONE_NUMBER, DEFAULT_PLACEHOLDER_IMAGE } = getConstants(appConfig);

  // Phone number fallback strategy
  const phoneNumber = PHONE_NUMBER || "";

  const title =
    `${hit.year || ""} ${hit.make || ""} ${hit.model || ""} ${hit.trim || ""}`.trim();

  const price = Number(hit.selling_price) || 0;
  const km = Number(hit.odometer) || 0;
  const drivetrain = hit.drivetrain || "N/A";
  const stock = hit.stock_no || "N/A";

  const isSold = hit.status && hit.status.toLowerCase() !== "instock";

  const imageUrls = hit.image_urls ? hit.image_urls.split(";") : [];
  let imageSrc = DEFAULT_PLACEHOLDER_IMAGE || `${SITE_CONFIG?.urls?.assetBaseUrl}/image/default-placeholder.jpg`;
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
      <div className="block h-full rounded-[20px] cursor-pointer p-[2px] bg-white overflow-hidden flex flex-col gap-2 hover:shadow-none transition-none relative border border-border-standard">
        <article
          onClick={() => {
            window.location.href = vehicleUrl;
          }}
        >
          {/* Vehicle image with optional sold overlay */}
          <div className="relative overflow-hidden rounded-xl p-2">
            <Image
              src={imageSrc}
              alt={title}
              width={600}
              height={400}
              style={{
                width: "auto",
                height: "auto",
              }}
              className={`w-full object-cover min-h-[240px] md:max-h-[240px] 2xl:min-h-[260px] rounded-xl transition-transform duration-500 ${
                isSold ? "grayscale opacity-80" : ""
              }`}
            />

            {/* SOLD Ribbon */}
            {isSold && (
              <div className="absolute top-4 -left-10 rotate-[-45deg] text-white text-[14px] font-bold uppercase tracking-[3px] shadow-lg w-[160px] text-center py-[6px] z-10 bg-sold-overlay">
                Sold
              </div>
            )}
          </div>

          {/* Card body */}
          <div className="flex flex-col flex-1 px-[15px] pb-0 text-start">
            <h3 className="text-[16px] font-[600] text-foreground leading-[22px] overflow-hidden text-ellipsis line-clamp-2 min-h-[44px]">
              {title}
            </h3>

            <hr className="border-gray-200 mt-[4px]" />

            {/* Price and mileage */}
            <div>
              <p className="text-[20px] font-bold text-foreground leading-5 mt-2 py-[3px] px-[0.5px]">
                ${price.toLocaleString()}.00
              </p>
              <p className="text-[14px] text-gray-700/80 leading-[14px] mt-[10px] flex-1">
                {km.toLocaleString()} KM
                {drivetrain && drivetrain !== "N/A" && (
                  <> &bull; {drivetrain}</>
                )}
              </p>
            </div>

            <hr className="border-gray-200 my-2" />

            <p className="text-[12px] mb-2 font-light">Stock #: {stock}</p>
          </div>
        </article>

        {/* Action Buttons */}
        <div className="w-full rounded-[12px] mb-3 px-2 mt-auto grid grid-cols-2 gap-2">
          {/* Call Button */}
          <a
            href={phoneNumber ? `tel:${phoneNumber}` : "#"}
            onClick={(e) => e.stopPropagation()}
            className="cursor-pointer text-center rounded-[10px] sm:rounded-[12px] text-gray-800 bg-gray-100 hover:bg-gray-200 py-[10px] text-[14px] sm:text-[15px] font-medium transition-colors border border-gray-300 flex items-center justify-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call Now
          </a>

          {/* Check Availability Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="cursor-pointer text-center rounded-[10px] sm:rounded-[12px] text-white py-[10px] text-[14px] sm:text-[15px] font-medium hover:opacity-90 transition-opacity bg-brand border border-brand-green2"
          >
            Check Availability
          </button>
        </div>
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