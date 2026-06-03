/* =========================
   Vehicle Detail Page (VDP)
   Server component that fetches a single vehicle
   from Typesense by document ID and renders:
   - Image gallery with thumbnails
   - Vehicle specs grid (odometer, body, transmission, etc.)
   - Vehicle description (HTML stripped / rendered)
   - Sticky right sidebar: price, express checkout, CTA buttons
   - Mobile: sidebar rendered inline below gallery
   Returns 404 if the vehicle is not found.
========================= */

import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

// Layout
import { Header, Footer } from "@/components/layout";

// Inventory components
import { ImageGallery } from "@/components/Inventory";

// Shared components
import { GetInTouch } from "@/components/common";

// Config, assets & services
import { SITE_CONFIG } from "@/lib/config";
import { getVehicleById } from "@/services";
import { stripHtml, parseImageUrls } from "@/utils";
import expre from "@/assets/icons/expre.svg";

import noimage from "@/assets/cars/no-image-placeholder.jpg";
import doller from "@/assets/icons/doller-1.png";


// Force dynamic rendering — vehicle data changes frequently
export const dynamic = "force-dynamic";
const showSidebar = true;  

/* ── Page Component ────────────────────────────────────────── */
export default async function VehicleDetailsPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const resolvedParams = await params;
  const vehicle = await getVehicleById(resolvedParams.id);

  if (!vehicle) notFound();

  // Build display title (strip HTML if title field contains markup)
  const titleText = vehicle.title
    ? stripHtml(vehicle.title)
    : `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`;

  // Parse semicolon-separated image URLs; prepend CDN domain for relative paths
  const images = vehicle.image_urls
    ? parseImageUrls(vehicle.image_urls, SITE_CONFIG.urls.assetBaseUrl)
    : [noimage.src]; 

  const isSold = vehicle.status?.toLowerCase() !== "instock";

  /* ── Reusable: Price + CTA block (used in both columns) ─── */
  const PriceAndCTA = () => (
    <div className="bg-white rounded-2xl px-5 pb-2 text-center shadow-sm">
      {/* Price */}
      <div className="flex items-center justify-center gap-1">
        <p className="text-[32px] font-extrabold text-[#00A651] leading-none">
          ${vehicle.selling_price.toLocaleString()}.00
        </p>

        <div className="relative inline-flex items-center group">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 text-gray-500 cursor-pointer"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 100-2 1 1 0 000 2zm1 8a1 1 0 10-2 0 1 1 0 002 0zm-1-6a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>

          {/* Tooltip */}
          <div className="absolute left-1/2 top-[-52px] -translate-x-1/2 whitespace-nowrap bg-black text-white text-[14px] font-semibold px-4 py-2 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg">
            Listed price does not include taxes and licensing fees.

            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-3 h-3 bg-black rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Express checkout badge */}
      <div className="mt-2">
        <Image src={expre} alt="Express Checkout" />
      </div>

      {/* CTA buttons */}
      <div className="mt-4 space-y-3">
        <button className="mt-3 cursor-pointer font-bold w-full min-w-full block text-center rounded-[10px] sm:rounded-[12px] border border-[#00b066] bg-gradient-to-b from-[#00af66] to-[#00af66]/65 text-white py-[12px] sm:py-[10px] text-[15px] sm:text-[20px] hover:opacity-90 shadow-md transition-opacity"
>
          Get started
        </button>
        <button className="w-full bg-white cursor-pointer hover:bg-[#00af66a6] hover:text-white border-2 border-[#00af66a6] text-[#00A651] font-bold py-3 rounded-xl transition-colors text-[16px] sm:text-[20px]">
          Send message
        </button>
      </div>
    </div>
  );

  /* ── Reusable: Vehicle title + quick specs block ─────────── */
  const VehicleHeader = () => (
    <div className="bg-[#eaf5ff] rounded-t-xl px-3 py-6 text-center">
      <h1 className="text-[28px]  font-bold text-gray-900 leading-tight tracking-wide">
        {vehicle.year}{vehicle.make}{vehicle.model}
      </h1>
      <p className="text-[16px] text-gray-500 mt-0.5 text-center">{vehicle.trim}</p>

      <div className="flex items-center justify-center gap-6 mt-6 text-black">
        {/* Odometer */}
        <div className="flex items-center text-center gap-2 text-[16px] text-black/70">
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="">
            <path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1-512 0zm320 96c0-26.9-16.5-49.9-40-59.3L280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24v172.7c-23.5 9.5-40 32.5-40 59.3 0 35.3 28.7 64 64 64s64-28.7 64-64zM144 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm-16 80a32 32 0 1 0-64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM400 144a32 32 0 1 0-64 0 32 32 0 1 0 64 0z" />
          </svg>
          <span className="text-center text-black">{vehicle.odometer.toLocaleString()} KM</span>
        </div>
        {/* Drivetrain */}
        <div className="flex items-center gap-2 text-[14px] text-gray-700 text-center">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="black">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0H3m10 0h2m0 0a1 1 0 011-1l2-3h3l1 3a1 1 0 011 1v1h-8v-1z" />
          </svg>
          <span className="text-black">{vehicle.drivetrain || "Other"}</span>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-background flex flex-col overflow-hidden">
      <div className="bg-hero-bg">
        <Header />
      </div>

      <section className="w-full bg-background flex-1 pb-16  justify-center">
        <div className="mx-auto w-full max-w-[1600px] py-6 lg:pt-[30px] px-5 md:px-8 lg:px-10">

          <div
  className={`flex flex-col xl:flex-row gap-8 items-start ${
    showSidebar ? "" : "justify-center"
  }`}
>
            {/* ── Left column: gallery + specs ──────────── */}
            <div
  className={`flex flex-col space-y-8 min-w-0 ${
    showSidebar ? "flex-1 w-full max-w-[1000px]" : "w-full max-w-[1000px]"
  }`}
>
              {/* Image gallery */}
              <ImageGallery images={images} title={titleText} isSold={isSold} centered={!showSidebar} />

              <div className="text-[12px] font-light">
                <p><strong className="font-medium">STOCK #</strong>: G-148421</p>
              </div>
            </div>

            {/* ── Right column: sticky sidebar (desktop) ─── */}
            {showSidebar && (
              <div className="w-full xl:w-[380px] lg:flex-shrink-0">
                <div className="sticky top-6 space-y-5 border border-gray-200 rounded-xl">
                  <VehicleHeader />
                  <PriceAndCTA />
                </div>
              </div>
            )}

          </div>
          {/* Specs grid */}
          <div className="bg-card border-none rounded-xl p-0 w-full mt-5 xl:mt-0">
            <h2 className="text-[22px] font-semibold text-black mb-[30px]">
              About this vehicle
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <div className="flex items-start gap-2 text-[13px] text-muted-foreground mb-1">
                  <svg
                    className="w-5 h-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    fill="currentColor"
                  >
                    <path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1-512 0zm80 0h64.3c8.7 0 15.7-7.1 17.3-15.6 4.4-24.4 18.1-45.5 37.2-59.7 7.4-5.5 10.6-15.6 6-23.6l-32.5-56.3c-4.3-7.5-13.9-10.3-21.2-5.5-48.2 31.5-81.3 84.2-86.3 144.8-.7 8.8 6.5 16 15.3 16zm137.9 89.8c-8.5-3.7-18.8-1.4-23.5 6.6l-31 53.8c-4.3 7.5-1.9 17.2 5.8 21.1 26.1 13.2 55.5 20.7 86.8 20.7s60.7-7.5 86.8-20.7c7.7-3.9 10.1-13.6 5.8-21.1l-31-53.8c-4.6-8-15-10.3-23.5-6.6-11.7 5-24.5 7.8-38.1 7.8s-26.4-2.8-38.1-7.8zM350.4 240.4c1.6 8.6 8.5 15.6 17.3 15.6H432c8.8 0 16.1-7.2 15.3-16-5-60.6-38.1-113.2-86.3-144.8-7.3-4.8-16.8-2-21.2 5.5L307.3 157c-4.6 8-1.4 18.1 6 23.6 19.1 14.2 32.7 35.4 37.2 59.7zM256 305.7a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
                  </svg>
                  <span>
                    Odometer
                    <p className="font-bold text-[15px] text-black ">
                      {vehicle.odometer.toLocaleString()} KM
                    </p>
                  </span>
                </div>

              </div>
              <div>
                <div className="flex items-start gap-2 text-[13px] text-muted-foreground mb-1">
                  <svg
                    className="w-5 h-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    fill="currentColor"
                  >
                    <path d="M165.4 96h181.2c13.6 0 25.7 8.6 30.2 21.4l26.1 74.6H109.1l26.1-74.6c4.5-12.8 16.6-21.4 30.2-21.4zm-90.6.3L39.6 196.8C16.4 206.4 0 229.3 0 256v96c0 23.7 12.9 44.4 32 55.4V448c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32v-32h256v32c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32v-40.6c19.1-11.1 32-31.7 32-55.4v-96c0-26.7-16.4-49.6-39.6-59.2L437.2 96.3C423.7 57.8 387.4 32 346.6 32H165.4c-40.8 0-77.1 25.8-90.6 64.3zM208 288h96c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16h-96c-8.8 0-16-7.2-16-16v-32c0-8.8 7.2-16 16-16zM48 280c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24s-10.7 24-24 24H72c-13.3 0-24-10.7-24-24zm360-24h32c13.3 0 24 10.7 24 24s-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24s10.7-24 24-24z" />
                  </svg>
                  <span>
                    Body Style
                    <p className="font-bold text-[15px] text-black">
                      {vehicle.body_type || "N/A"}
                    </p>
                  </span>
                </div>

              </div>
              <div>
                <div className="flex items-start gap-2 text-[13px] text-muted-foreground mb-1">
                  <svg
                    className="w-5 h-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512"
                    fill="currentColor"
                  >
                    <path d="M415.9 210.5c12.2-3.3 25 2.5 30.5 13.8L465 261.9c10.3 1.4 20.4 4.2 29.9 8.1l35-23.3c10.5-7 24.4-5.6 33.3 3.3l19.2 19.2c8.9 8.9 10.3 22.9 3.3 33.3l-23.3 34.9c1.9 4.7 3.6 9.6 5 14.7 1.4 5.1 2.3 10.1 3 15.2l37.7 18.6c11.3 5.6 17.1 18.4 13.8 30.5l-7 26.2c-3.3 12.1-14.6 20.3-27.2 19.5l-42-2.7c-6.3 8.1-13.6 15.6-21.9 22l2.7 41.9c.8 12.6-7.4 24-19.5 27.2l-26.2 7c-12.2 3.3-24.9-2.5-30.5-13.8l-18.6-37.6c-10.3-1.4-20.4-4.2-29.9-8.1l-35 23.3c-10.5 7-24.4 5.6-33.3-3.3l-19.2-19.2c-8.9-8.9-10.3-22.8-3.3-33.3l23.3-35c-1.9-4.7-3.6-9.6-5-14.7s-2.3-10.2-3-15.2l-37.7-18.6c-11.3-5.6-17-18.4-13.8-30.5l7-26.2c3.3-12.1 14.6-20.3 27.2-19.5l41.9 2.7c6.3-8.1 13.6-15.6 21.9-22l-2.7-41.8c-.8-12.6 7.4-24 19.5-27.2l26.2-7zM448.4 340a44 44 0 1 0 .1 88 44 44 0 1 0-.1-88zM224.9-45.5l26.2 7c12.1 3.3 20.3 14.7 19.5 27.2l-2.7 41.8c8.3 6.4 15.6 13.8 21.9 22l42-2.7c12.5-.8 23.9 7.4 27.2 19.5l7 26.2c3.2 12.1-2.5 24.9-13.8 30.5l-37.7 18.6c-.7 5.1-1.7 10.2-3 15.2s-3.1 10-5 14.7l23.3 35c7 10.5 5.6 24.4-3.3 33.3L307.3 262c-8.9 8.9-22.8 10.3-33.3 3.3L239 242c-9.5 3.9-19.6 6.7-29.9 8.1l-18.6 37.6c-5.6 11.3-18.4 17-30.5 13.8l-26.2-7c-12.2-3.3-20.3-14.7-19.5-27.2l2.7-41.9c-8.3-6.4-15.6-13.8-21.9-22l-42 2.7c-12.5.8-23.9-7.4-27.2-19.5l-7-26.2c-3.2-12.1 2.5-24.9 13.8-30.5l37.7-18.6c.7-5.1 1.7-10.1 3-15.2 1.4-5.1 3-10 5-14.7L55.1 46.5c-7-10.5-5.6-24.4 3.3-33.3L77.6-6c8.9-8.9 22.8-10.3 33.3-3.3l35 23.3c9.5-3.9 19.6-6.7 29.9-8.1l18.6-37.6c5.6-11.3 18.3-17 30.5-13.8zM192.4 84a44 44 0 1 0 0 88 44 44 0 1 0 0-88z" />
                  </svg>
                  <span>
                    Transmission
                    <p className="font-bold text-[15px] text-black">
                      {vehicle.transmission || "N/A"}
                    </p>
                  </span>
                </div>

              </div>
              <div>
                <div className="flex items-start gap-2 text-[13px] text-muted-foreground mb-1">
                  <svg
                    className="w-5 h-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512"
                    fill="currentColor"
                  >
                    <path d="M160 96c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32v32h64V96c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32v32h16c26.5 0 48 21.5 48 48v160c0 26.5-21.5 48-48 48h-16v32c0 17.7-14.3 32-32 32h-64c-17.7 0-32-14.3-32-32v-32h-64v32c0 17.7-14.3 32-32 32h-64c-17.7 0-32-14.3-32-32v-32H96c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48h64V96zm48 96c-26.5 0-48 21.5-48 48v64c0 26.5 21.5 48 48 48h224c26.5 0 48-21.5 48-48v-64c0-26.5-21.5-48-48-48H208z" />
                  </svg>
                  <span>
                    Engine
                    <p className="font-bold text-[15px] text-black">
                      {vehicle.litres || "N/A"}
                    </p>
                  </span>
                </div>

              </div>
              <div>
                <div className="flex items-start gap-2 text-[13px] text-muted-foreground mb-1">
                  <svg
                    className="w-5 h-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    fill="currentColor"
                  >
                    <path d="M256 32C132.3 32 32 132.3 32 256s100.3 224 224 224 224-100.3 224-224S379.7 32 256 32zm0 48c88.4 0 161.3 64.4 174.6 149H346.5c-13.2-22.7-37.7-38-66.5-38s-53.3 15.3-66.5 38H81.4C94.7 144.4 167.6 80 256 80zm-96 197c0-26.5 21.5-48 48-48s48 21.5 48 48v11H160v-11zm-26.4 59h244.8c-17.9 57.3-71.5 96-122.4 96s-104.5-38.7-122.4-96zm170.4-48v-11c0-26.5 21.5-48 48-48s48 21.5 48 48v11h-96z" />
                  </svg>
                  <span>
                    Drivetrain
                    <p className="font-bold text-[15px] text-black">
                      {vehicle.drivetrain || "N/A"}
                    </p>
                  </span>
                </div>

              </div>
              <div>
                <div className="flex items-start gap-2 text-[13px] text-muted-foreground mb-1">
                  <svg
                    className="w-5 h-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512"
                    fill="currentColor"
                  >
                    <path d="M147 106.7l-29.8 85.3h122.9v-96h-77.9c-6.8 0-12.9 4.3-15.1 10.7zM48.6 193.9L86.5 85.6C97.8 53.5 128.1 32 162.1 32H360c25.2 0 48.9 11.9 64 32l96.2 128.3C587.1 196.5 640 252.1 640 320v16c0 35.3-28.7 64-64 64h-16.4c-4 44.9-41.7 80-87.6 80s-83.6-35.1-87.6-80H239.7c-4 44.9-41.7 80-87.6 80s-83.6-35.1-87.6-80h-.4c-35.3 0-64-28.7-64-64v-80c0-30.1 20.7-55.3 48.6-62.1zM440 192l-67.2-89.6c-3-4-7.8-6.4-12.8-6.4h-72v96H440zM152 432a40 40 0 1 0 0-80 40 40 0 1 0 0 80zm360-40a40 40 0 1 0-80 0 40 40 0 1 0 80 0z" />
                  </svg>
                  <span>
                    Doors
                    <p className="font-bold text-[15px] text-black">
                      {vehicle.door || "N/A"}
                    </p>
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* Vehicle description */}
          {vehicle.vehicle_description && (
                <div className="bg-card border-none rounded-xl p-0 mt-[45px]">
                  <h2 className="text-[22px] font-semibold text-black mb-[15px]">
                    Vehicle Description
                  </h2>
                  <div
                    className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-foreground/80 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: vehicle.vehicle_description }}
                  />
                </div>
              )}
        </div>
      </section>

      <GetInTouch />
      <Footer />
    </main>
  );
}
