import React from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";

export const HitCard = ({ hit }: { hit: any }) => {
  // Extracting details from Typesense hit schema
  const title = `${hit.year || ""} ${hit.make || ""} ${hit.model || ""} ${hit.trim || ""}`.trim();
  const price = Number(hit.selling_price) || 0;
  const km = Number(hit.odometer) || 0;
  const biWeekly = Number(hit.emi_amount) || 0;
  const drivetrain = hit.drivetrain || "N/A";
  const stock = hit.stock_no || "N/A";
  const isSold = hit.status && hit.status.toLowerCase() !== "instock";

  // image_urls is a semicolon-separated string
  const imageUrls = hit.image_urls ? hit.image_urls.split(";") : [];
  let imageSrc = "/placeholder-car.jpg"; // fallback if no image
  if (imageUrls.length > 0) {
    const firstUrl = imageUrls[0].trim();
    // Prepend domain if relative
    imageSrc = firstUrl.startsWith("/") ? `${SITE_CONFIG.urls.assetBaseUrl}${firstUrl}` : firstUrl;
  }

  return (
    <Link href={hit.page_url || "#"} className="block h-full group">
      <article className="rounded-3xl border border-gray-200 bg-white overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300 relative group-hover:-translate-y-1">
        
        {/* SOLD Badge overlay */}
        {isSold && (
          <div className="absolute top-4 right-4 z-10 bg-red-600 text-white text-[12px] font-bold px-3 py-1 rounded-sm shadow-md uppercase tracking-wider">
            Sold
          </div>
        )}

        <div className="aspect-[4/3] bg-muted relative overflow-hidden rounded-t-3xl">
          <img
            src={imageSrc}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isSold ? 'grayscale opacity-80' : ''}`}
            loading="lazy"
          />
        </div>
        
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-[18px] font-bold text-gray-900 leading-tight">
            {title}
          </h3>
          
          <hr className="my-4 border-gray-200" />
          
          <div>
            <p className="text-[26px] font-bold text-gray-900 leading-none">${price.toLocaleString()}.00</p>
            <p className="text-[14px] text-gray-500 mt-2">
              {km.toLocaleString()} KM &bull; {drivetrain}
            </p>
          </div>
          
          <hr className="my-4 border-gray-200" />
          
          <div className="text-[14px] text-gray-700 mb-4 flex-1">
            Stock #: {stock}
          </div>

          <div className="bg-[#eaf5ff] w-full py-3 px-4 rounded-xl text-center">
            <span className="text-[#0070d6] text-[13px] font-bold flex items-center justify-center gap-1 leading-snug">
              Get pre-qualified to see your personalized bi-weekly payment <span className="text-lg leading-none font-normal">&rarr;</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};
