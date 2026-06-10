/* =========================
   HitCard Component (Inventory)
   Renders a single vehicle card in the
   react-instantsearch Hits grid.
   Displays: vehicle image, title, price, KM,
   drivetrain, stock number, and a pre-qualify CTA.
   Handles "Sold" state with a diagonal banner overlay.
   Image URLs are semicolon-separated strings from Typesense.
========================= */

import React from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";
// no image placeholder
import noimage from "@/assets/cars/no-image-placeholder.jpg";

/*  Component */
export const HitCard = ({ hit }: { hit: any }) => {
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
  let imageSrc = noimage.src;
  if (imageUrls.length > 0) {
    const firstUrl = imageUrls[0].trim();
    imageSrc = firstUrl.startsWith("/")
      ? `${SITE_CONFIG.urls.assetBaseUrl}${firstUrl}`
      : firstUrl;
  }

  return (
    <Link href={hit.page_url || "#"} className="block h-full ">
      <article className="rounded-[20px] p-[2px] border border-[#ddd] bg-white overflow-hidden flex flex-col h-full hover:shadow-none transition-none relative">

        {/* Vehicle image with optional sold overlay */}
        <div className="relative overflow-hidden rounded-xl p-2">
          <img
            src={imageSrc}
            alt={title}
            className={`w-full object-cover min-h-[240px] md:max-h-[240px] rounded-xl transition-transform duration-500 ${isSold ? "grayscale opacity-80" : ""
              }`}
            loading="lazy"
          />

          {/* SOLD Ribbon */}
          {isSold && (
            <div className="absolute top-4 -left-10 rotate-[-45deg] bg-[#5f5f5f] text-white text-[14px] font-bold uppercase tracking-[3px] shadow-lg w-[160px] text-center py-[6px] z-10">
              Sold
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="flex flex-col flex-1 px-[15px] pb-0 text-start">
          <h3 className="text-[16px] font-[600] text-[#000] leading-[22px] overflow-hidden text-ellipsis line-clamp-2 min-h-[44px]">
            {title}
          </h3>

         
          <hr className="border-gray-200 mt-[4px]" />

          {/* Price and mileage */}
          <div>
            <p className="text-[20px] font-bold text-[#000] leading-5 mt-2 py-[3px] px-[0.5px]">
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
          <div className="bg-[#e6f4ff] w-full rounded-[12px] mb-3">
            <div className="text-[#005dff] lg:text-[10.5px] text-[10px] font-semibold text-center leading-[16px] py-[9px] lg:px-[12px]">

              <span className="inline">
                Get pre-qualified to see your personalized bi-weekly payment
              </span>

              <span className="inline ml-[2px] text-[14px] leading-none font-normal">
                &rarr;
              </span>

            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};
