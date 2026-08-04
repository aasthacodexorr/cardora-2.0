/* =========================
   HitCard Component (Inventory)
   Renders a single vehicle card in the
   react-instantsearch Hits grid.
   Displays: vehicle image, title, price, KM,
   drivetrain, stock number, and a pre-qualify CTA.
   Handles "Sold" state with a diagonal banner overlay.
   Image URLs are semicolon-separated strings from Typesense.
========================= */

"use client";

import Image from "next/image";
import { getConstants } from "@/constants";
import { useAppConfig } from "@/app/providers";


/*  Component */
export const HitCard = ({ hit }: { hit: any }) => {
  const appConfig = useAppConfig();
  const { SITE_CONFIG, DEFAULT_PLACEHOLDER_IMAGE } = getConstants(appConfig);
  // Build display title from Typesense document fields
  const title =
    `${hit.year || ""} ${hit.make || ""} ${hit.model || ""} ${hit.trim || ""}`.trim();

  const price = Number(hit.selling_price) || 0;
  const km = Number(hit.odometer) || 0;
  const drivetrain = hit.drivetrain || "N/A";
  const stock = hit.stock_no || "N/A";

  // Vehicle is "sold" when status is anything other than "instock"
  const isSold = hit.status && hit.status.toLowerCase() !== "instock";

  // Parse semicolon-separated image URLs; prepend CDN domain for relative paths
  const imageUrls = hit.image_urls ? hit.image_urls.split(";") : [];
  let imageSrc = DEFAULT_PLACEHOLDER_IMAGE || `${SITE_CONFIG.urls.assetBaseUrl}/image/default-placeholder.jpg`;
  if (imageUrls.length > 0) {
    const firstUrl = imageUrls[0].trim();
    imageSrc = firstUrl.startsWith("/")
      ? `${SITE_CONFIG.urls.assetBaseUrl}${firstUrl}`
      : firstUrl;
  }


  const getVehicleUrl = (hit: any) => {
    const slug = [
      hit.inventory_id,
      hit.year,
      hit.make,
      hit.model,
      hit.trim,
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
    <div className="block h-full rounded-[20px] cursor-pointer p-[2px] bg-white overflow-hidden flex flex-col h-full hover:shadow-none transition-none relative border border-border-standard">
      <article onClick={() => {
        window.location.href = vehicleUrl;
      }}>

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
            className={`w-full object-cover min-h-[240px] md:max-h-[240px] 2xl:min-h-[260px]  rounded-xl transition-transform duration-500 ${isSold ? "grayscale opacity-80" : ""
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

          {/* Pre-qualify CTA */}

        </div>
      </article>
      <div className="w-full rounded-[12px] mb-3 px-2">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = `/finance?inventory_id=${hit.inventory_id}`;
          }}
          className="mt-7 cursor-pointer sm:mt-[10px] w-full min-w-full block text-center rounded-[10px] sm:rounded-[12px] text-white py-[12px] sm:py-[10px] text-[18px] sm:text-[16px] font-medium hover:opacity-90 lg:shadow-md transition-opacity bg-brand-btn-gradient border border-brand-green2"
        >
          Get pre-qualified
        </button>
      </div>
    </div>
  );
};
