import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ImageGallery } from "@/components/Inventory/ImageGallery";
import { SITE_CONFIG } from "@/lib/config";
import GetInTouch from "@/components/GetInTouch";
import Image from "next/image";
import expre from "../../../../assets/expre.svg";

export const dynamic = "force-dynamic"; // Use dynamic rendering since we fetch from an external API

async function getVehicleData(id: string) {
  const apiKey = process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_KEY;
  const collection = process.env.NEXT_PUBLIC_TYPESENSE_COLLECTION;
  const host = process.env.NEXT_PUBLIC_TYPESENSE_HOST;

  if (!apiKey || !collection || !host) {
    throw new Error("Missing Typesense configuration");
  }

  const url = `https://${host}/collections/${collection}/documents/search?q=*&filter_by=id:=${id}`;

  const res = await fetch(url, {
    headers: {
      "X-TYPESENSE-API-KEY": apiKey,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  if (data.hits && data.hits.length > 0) {
    return data.hits[0].document;
  }

  return null;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, "");
}

export default async function VehicleDetailsPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const resolvedParams = await params;
  const vehicle = await getVehicleData(resolvedParams.id);

  if (!vehicle) {
    notFound();
  }

  const titleText = vehicle.title
    ? stripHtml(vehicle.title)
    : `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`;

  // Parse Images
  let images: string[] = [];
  if (vehicle.image_urls) {
    images = vehicle.image_urls
      .split(";")
      .map((url: string) => {
        const trimmed = url.trim();
        return trimmed.startsWith("/")
          ? `${SITE_CONFIG.urls.assetBaseUrl}${trimmed}`
          : trimmed;
      })
      .filter(Boolean);
  }

  const primaryImage = images.length > 0 ? images[0] : "/placeholder-car.jpg"; // Provide a fallback if needed

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="bg-hero-bg">
        <Header />
      </div>
      {/* added class detail_page_section  */}
      <section className="w-full bg-background flex-1 pb-16 detail_page_section">
        <div className="mx-auto max-w-[1400px] px-6 py-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center text-[13px] text-muted-foreground mb-6">
            <Link href="/" className="hover:text-brand-green">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link href="/inventory" className="hover:text-brand-green">
              Inventory
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-foreground">{titleText}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
            {/* Left Column: Images & Details */}
            {/* added class gallry_p  */}
            <div className="space-y-8 gallry_p">
              {/* Image Gallery with arrows */}
              <ImageGallery
                images={images}
                title={titleText}
                isSold={vehicle.status?.toLowerCase() !== "instock"}
              />

              <div className="mb_con">
                            <div className="relative right_detail_container">
              <div className="sticky top-6 space-y-5">
                {/* Vehicle Title & Specs */}
                <div className="bg-[#eaf5ff] rounded-2xl p-6">
                  <h1 className="text-[28px] font-extrabold text-gray-900 leading-tight">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h1>
                  <p className="text-[16px] text-gray-500 mt-0.5">
                    {vehicle.trim}
                  </p>

                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2 text-[14px] text-gray-700">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        fill="currentColor"
                      >
                        <path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1-512 0zm320 96c0-26.9-16.5-49.9-40-59.3L280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24v172.7c-23.5 9.5-40 32.5-40 59.3 0 35.3 28.7 64 64 64s64-28.7 64-64zM144 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm-16 80a32 32 0 1 0-64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM400 144a32 32 0 1 0-64 0 32 32 0 1 0 64 0z" />
                      </svg>
                      <span className="font-semibold">
                        {vehicle.odometer.toLocaleString()} KM
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[14px] text-gray-700">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0H3m10 0h2m0 0a1 1 0 011-1l2-3h3l1 3a1 1 0 011 1v1h-8v-1z"
                        />
                      </svg>
                      <span className="font-semibold">
                        {vehicle.drivetrain || "Other"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price & Express Checkout */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <p className="text-[32px] font-extrabold text-[#00A651] leading-none">
                    ${vehicle.selling_price.toLocaleString()}.00
                    <span className="inline-block ml-1.5 align-middle">
                      <svg
                        className="w-5 h-5 text-gray-400 inline"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
                        <path
                          strokeLinecap="round"
                          strokeWidth={1.5}
                          d="M12 16v-4m0-4h.01"
                        />
                      </svg>
                    </span>
                  </p>

                  {/* Express Checkout */}
                  {/* added class express_checkout  */}
                  <div className="express_checkout">
                    <Image src={expre} alt="Express Checkout" />
                  </div>

                  {/* CTA Buttons */}
                  {/* added class cehckout_bbtns  */}
                  <div className="mt-6 space-y-3 cehckout_bbtns">
                    <button className="w-full bg-[#00A651] text-white font-bold py-3.5 rounded-xl hover:bg-[#009347] transition-colors text-[16px] shadow-sm">
                      Get started
                    </button>
                    <button className="w-full bg-white border-2 border-[#00A651] text-[#00A651] font-bold py-3 rounded-xl hover:bg-green-50 transition-colors text-[16px]">
                      Send message
                    </button>
                  </div>
                </div>
              </div>
            </div>
              </div>

              {/* Specs Grid */}
              {/* added class about_this_vehicle  */}
              <div className="bg-card border border-border rounded-xl p-6 about_this_vehicle">
                <h2 className="text-[20px] font-bold text-foreground mb-5">
                  About this vehicle
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-[13px] text-muted-foreground mb-1">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        fill="currentColor"
                      >
                        <path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1-512 0zm80 0h64.3c8.7 0 15.7-7.1 17.3-15.6 4.4-24.4 18.1-45.5 37.2-59.7 7.4-5.5 10.6-15.6 6-23.6l-32.5-56.3c-4.3-7.5-13.9-10.3-21.2-5.5-48.2 31.5-81.3 84.2-86.3 144.8-.7 8.8 6.5 16 15.3 16zm137.9 89.8c-8.5-3.7-18.8-1.4-23.5 6.6l-31 53.8c-4.3 7.5-1.9 17.2 5.8 21.1 26.1 13.2 55.5 20.7 86.8 20.7s60.7-7.5 86.8-20.7c7.7-3.9 10.1-13.6 5.8-21.1l-31-53.8c-4.6-8-15-10.3-23.5-6.6-11.7 5-24.5 7.8-38.1 7.8s-26.4-2.8-38.1-7.8zM350.4 240.4c1.6 8.6 8.5 15.6 17.3 15.6H432c8.8 0 16.1-7.2 15.3-16-5-60.6-38.1-113.2-86.3-144.8-7.3-4.8-16.8-2-21.2 5.5L307.3 157c-4.6 8-1.4 18.1 6 23.6 19.1 14.2 32.7 35.4 37.2 59.7zM256 305.7a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
                      </svg>
                      Odometer
                    </p>
                    <p className="font-bold text-[15px]">
                      {vehicle.odometer.toLocaleString()} KM
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-muted-foreground mb-1">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        fill="currentColor"
                      >
                        <path d="M165.4 96h181.2c13.6 0 25.7 8.6 30.2 21.4l26.1 74.6H109.1l26.1-74.6c4.5-12.8 16.6-21.4 30.2-21.4zm-90.6.3L39.6 196.8C16.4 206.4 0 229.3 0 256v96c0 23.7 12.9 44.4 32 55.4V448c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32v-32h256v32c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32v-40.6c19.1-11.1 32-31.7 32-55.4v-96c0-26.7-16.4-49.6-39.6-59.2L437.2 96.3C423.7 57.8 387.4 32 346.6 32H165.4c-40.8 0-77.1 25.8-90.6 64.3zM208 288h96c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16h-96c-8.8 0-16-7.2-16-16v-32c0-8.8 7.2-16 16-16zM48 280c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24s-10.7 24-24 24H72c-13.3 0-24-10.7-24-24zm360-24h32c13.3 0 24 10.7 24 24s-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24s10.7-24 24-24z" />
                      </svg>
                      Body Style
                    </p>
                    <p className="font-bold text-[15px]">
                      {vehicle.body_type || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-muted-foreground mb-1">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 512"
                        fill="currentColor"
                      >
                        <path d="M415.9 210.5c12.2-3.3 25 2.5 30.5 13.8L465 261.9c10.3 1.4 20.4 4.2 29.9 8.1l35-23.3c10.5-7 24.4-5.6 33.3 3.3l19.2 19.2c8.9 8.9 10.3 22.9 3.3 33.3l-23.3 34.9c1.9 4.7 3.6 9.6 5 14.7 1.4 5.1 2.3 10.1 3 15.2l37.7 18.6c11.3 5.6 17.1 18.4 13.8 30.5l-7 26.2c-3.3 12.1-14.6 20.3-27.2 19.5l-42-2.7c-6.3 8.1-13.6 15.6-21.9 22l2.7 41.9c.8 12.6-7.4 24-19.5 27.2l-26.2 7c-12.2 3.3-24.9-2.5-30.5-13.8l-18.6-37.6c-10.3-1.4-20.4-4.2-29.9-8.1l-35 23.3c-10.5 7-24.4 5.6-33.3-3.3l-19.2-19.2c-8.9-8.9-10.3-22.8-3.3-33.3l23.3-35c-1.9-4.7-3.6-9.6-5-14.7s-2.3-10.2-3-15.2l-37.7-18.6c-11.3-5.6-17-18.4-13.8-30.5l7-26.2c3.3-12.1 14.6-20.3 27.2-19.5l41.9 2.7c6.3-8.1 13.6-15.6 21.9-22l-2.7-41.8c-.8-12.6 7.4-24 19.5-27.2l26.2-7zM448.4 340a44 44 0 1 0 .1 88 44 44 0 1 0-.1-88zM224.9-45.5l26.2 7c12.1 3.3 20.3 14.7 19.5 27.2l-2.7 41.8c8.3 6.4 15.6 13.8 21.9 22l42-2.7c12.5-.8 23.9 7.4 27.2 19.5l7 26.2c3.2 12.1-2.5 24.9-13.8 30.5l-37.7 18.6c-.7 5.1-1.7 10.2-3 15.2s-3.1 10-5 14.7l23.3 35c7 10.5 5.6 24.4-3.3 33.3L307.3 262c-8.9 8.9-22.8 10.3-33.3 3.3L239 242c-9.5 3.9-19.6 6.7-29.9 8.1l-18.6 37.6c-5.6 11.3-18.4 17-30.5 13.8l-26.2-7c-12.2-3.3-20.3-14.7-19.5-27.2l2.7-41.9c-8.3-6.4-15.6-13.8-21.9-22l-42 2.7c-12.5.8-23.9-7.4-27.2-19.5l-7-26.2c-3.2-12.1 2.5-24.9 13.8-30.5l37.7-18.6c.7-5.1 1.7-10.1 3-15.2 1.4-5.1 3-10 5-14.7L55.1 46.5c-7-10.5-5.6-24.4 3.3-33.3L77.6-6c8.9-8.9 22.8-10.3 33.3-3.3l35 23.3c9.5-3.9 19.6-6.7 29.9-8.1l18.6-37.6c5.6-11.3 18.3-17 30.5-13.8zM192.4 84a44 44 0 1 0 0 88 44 44 0 1 0 0-88z" />
                      </svg>
                      Transmission
                    </p>
                    <p className="font-bold text-[15px]">
                      {vehicle.transmission || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-muted-foreground mb-1">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                        fill="currentColor"
                      >
                        <path d="M309.7 71.6l-64.4 64.4 33.4 33.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0l-33.4-33.4-96.4 96.4c-2.9 2.9-5.1 6.5-6.3 10.3h321.5l53.7-53.7c4.9-4.9 7.6-11.5 7.6-18.3s-2.7-13.5-7.6-18.3L346.3 71.6C341.5 66.7 334.9 64 328 64s-13.5 2.7-18.3 7.6zM58.3 232.4l96.4-96.4-49.4-49.4c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L200 90.7l64.4-64.4C281.3 9.5 304.1 0 328 0s46.7 9.5 63.6 26.3L517.7 152.4C534.5 169.3 544 192.1 544 216s-9.5 46.7-26.3 63.6L311.6 485.7C294.7 502.5 271.9 512 248 512s-46.7-9.5-63.6-26.3L58.3 359.6C41.5 342.7 32 319.9 32 296s9.5-46.7 26.3-63.6zM512 544c-35.3 0-64-28.7-64-64 0-25.2 32.6-79.6 51.2-108.7 6-9.4 19.5-9.4 25.5 0 18.7 29.1 51.2 83.5 51.2 108.7 0 35.3-28.7 64-64 64z" />
                      </svg>
                      Exterior Color
                    </p>
                    <p className="font-bold text-[15px]">
                      {vehicle.exterior_color || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-muted-foreground mb-1">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 512"
                        fill="currentColor"
                      >
                        <path d="M160 96c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32v32h64V96c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32v32h16c26.5 0 48 21.5 48 48v160c0 26.5-21.5 48-48 48h-16v32c0 17.7-14.3 32-32 32h-64c-17.7 0-32-14.3-32-32v-32h-64v32c0 17.7-14.3 32-32 32h-64c-17.7 0-32-14.3-32-32v-32H96c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48h64V96zm48 96c-26.5 0-48 21.5-48 48v64c0 26.5 21.5 48 48 48h224c26.5 0 48-21.5 48-48v-64c0-26.5-21.5-48-48-48H208z" />
                      </svg>
                      Engine
                    </p>
                    <p className="font-bold text-[15px]">
                      {vehicle.litres || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-muted-foreground mb-1">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        fill="currentColor"
                      >
                        <path d="M256 32C132.3 32 32 132.3 32 256s100.3 224 224 224 224-100.3 224-224S379.7 32 256 32zm0 48c88.4 0 161.3 64.4 174.6 149H346.5c-13.2-22.7-37.7-38-66.5-38s-53.3 15.3-66.5 38H81.4C94.7 144.4 167.6 80 256 80zm-96 197c0-26.5 21.5-48 48-48s48 21.5 48 48v11H160v-11zm-26.4 59h244.8c-17.9 57.3-71.5 96-122.4 96s-104.5-38.7-122.4-96zm170.4-48v-11c0-26.5 21.5-48 48-48s48 21.5 48 48v11h-96z" />
                      </svg>
                      Drivetrain
                    </p>
                    <p className="font-bold text-[15px]">
                      {vehicle.drivetrain || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-muted-foreground mb-1">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 512"
                        fill="currentColor"
                      >
                        <path d="M147 106.7l-29.8 85.3h122.9v-96h-77.9c-6.8 0-12.9 4.3-15.1 10.7zM48.6 193.9L86.5 85.6C97.8 53.5 128.1 32 162.1 32H360c25.2 0 48.9 11.9 64 32l96.2 128.3C587.1 196.5 640 252.1 640 320v16c0 35.3-28.7 64-64 64h-16.4c-4 44.9-41.7 80-87.6 80s-83.6-35.1-87.6-80H239.7c-4 44.9-41.7 80-87.6 80s-83.6-35.1-87.6-80h-.4c-35.3 0-64-28.7-64-64v-80c0-30.1 20.7-55.3 48.6-62.1zM440 192l-67.2-89.6c-3-4-7.8-6.4-12.8-6.4h-72v96H440zM152 432a40 40 0 1 0 0-80 40 40 0 1 0 0 80zm360-40a40 40 0 1 0-80 0 40 40 0 1 0 80 0z" />
                      </svg>
                      Doors
                    </p>
                    <p className="font-bold text-[15px]">
                      {vehicle.door || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-muted-foreground mb-1">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                        fill="currentColor"
                      >
                        <path d="M96 32C60.7 32 32 60.7 32 96v320c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64V160L416 32H96zm288 32l96 96h-96V64zM160 256h256c17.7 0 32 14.3 32 32v96H128v-96c0-17.7 14.3-32 32-32zm32 48v32h64v-32h-64zm128 0v32h64v-32h-64z" />
                      </svg>
                      Stock #
                    </p>
                    <p className="font-bold text-[15px]">{vehicle.stock_no}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Description */}
              {vehicle.vehicle_description && (
                // added class vehicle_descr
                <div className="bg-card border border-border rounded-xl p-6 vehicle_descr">
                  <h2 className="text-[20px] font-bold text-foreground mb-5">
                    Vehicle Description
                  </h2>
                  <div
                    className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-foreground/80 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: vehicle.vehicle_description,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Right Column: Info & Checkout */}
            {/* added class right_detail_container  */}
            <div className="relative right_detail_container">
              <div className="sticky top-6 space-y-5">
                {/* Vehicle Title & Specs */}
                <div className="bg-[#eaf5ff] rounded-2xl p-6">
                  <h1 className="text-[28px] font-extrabold text-gray-900 leading-tight">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h1>
                  <p className="text-[16px] text-gray-500 mt-0.5">
                    {vehicle.trim}
                  </p>

                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2 text-[14px] text-gray-700">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        fill="currentColor"
                      >
                        <path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1-512 0zm320 96c0-26.9-16.5-49.9-40-59.3L280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24v172.7c-23.5 9.5-40 32.5-40 59.3 0 35.3 28.7 64 64 64s64-28.7 64-64zM144 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm-16 80a32 32 0 1 0-64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM400 144a32 32 0 1 0-64 0 32 32 0 1 0 64 0z" />
                      </svg>
                      <span className="font-semibold">
                        {vehicle.odometer.toLocaleString()} KM
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[14px] text-gray-700">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0H3m10 0h2m0 0a1 1 0 011-1l2-3h3l1 3a1 1 0 011 1v1h-8v-1z"
                        />
                      </svg>
                      <span className="font-semibold">
                        {vehicle.drivetrain || "Other"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price & Express Checkout */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <p className="text-[32px] font-extrabold text-[#00A651] leading-none">
                    ${vehicle.selling_price.toLocaleString()}.00
                    <span className="inline-block ml-1.5 align-middle">
                      <svg
                        className="w-5 h-5 text-gray-400 inline"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
                        <path
                          strokeLinecap="round"
                          strokeWidth={1.5}
                          d="M12 16v-4m0-4h.01"
                        />
                      </svg>
                    </span>
                  </p>

                  {/* Express Checkout */}
                  {/* added class express_checkout  */}
                  <div className="express_checkout">
                    <Image src={expre} alt="Express Checkout" />
                  </div>

                  {/* CTA Buttons */}
                  {/* added class cehckout_bbtns  */}
                  <div className="mt-6 space-y-3 cehckout_bbtns">
                    <button className="w-full bg-[#00A651] text-white font-bold py-3.5 rounded-xl hover:bg-[#009347] transition-colors text-[16px] shadow-sm">
                      Get started
                    </button>
                    <button className="w-full bg-white border-2 border-[#00A651] text-[#00A651] font-bold py-3 rounded-xl hover:bg-green-50 transition-colors text-[16px]">
                      Send message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <GetInTouch />
      <Footer />
    </main>
  );
}
