/* =========================
   Vehicle Detail Page (VDP)
   Server component that fetches a single vehicle
   from Typesense by document ID
========================= */

import { notFound } from "next/navigation";
// Layout
import { Header, Footer } from "@/components/layout";

// Inventory components
import { ImageGallery } from "@/components/Inventory";
import FinanceCalculator from "@/components/Inventory/FinanceCalculator";

// Shared components
import { GetInTouch } from "@/components/common";

// Config, assets & services
import { SITE_CONFIG } from "@/lib/config";
import { getVehicleById } from "@/services";
import { stripHtml, parseImageUrls } from "@/utils";

import noimage from "@/assets/cars/no-image-placeholder.jpg";
import doller from "@/assets/icons/doller-1.png";
import protectShield from "@/assets/icons/trade-shield.png";
import VehicleSpecificationsAccordion from "@/components/Inventory/Faq";
import Terms from "@/components/Inventory/Terms";
import AboutVehicle from "@/components/Inventory/AboutVehicle";
import { PriceAndCTA, VehicleHeader } from "@/components/Inventory/VehicleInfo";

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
  
  return (
    <main className="min-h-screen bg-background flex flex-col overflow-hidden">
      <div className="bg-hero-bg">
        <Header />
      </div>

      <section className="w-full bg-background flex-1 justify-center">
        <div className="mx-auto w-full max-w-[1600px] py-6 lg:pt-[30px] px-5 md:px-8 lg:px-10">
          
          {/* ── SECTION ROW: Controls the boundaries of the sticky sidebar ── */}
          <div className="flex flex-col lg:flex-row gap-10 items-start items-stretch">
            
            {/* ── Left column: gallery + specs + description ── */}
            <div className={`flex flex-col gap-8 items-start flex-1 w-full max-w-[1000px] ${showSidebar ? "" : "mx-auto"}`}>
              {/* Image gallery */}
              <ImageGallery images={images} title={titleText} isSold={isSold} centered={!showSidebar} />

              <div className="text-[12px] font-light">
                <p><strong className="font-medium">STOCK #</strong>: G-148421</p>
              </div>

              {/* Trade In Banner */}
              <div className="w-full mb-30">
                <div className="flex flex-col md:flex-row items-center justify-between border border-gray-200 rounded-2xl p-6 bg-white w-full max-w-4xl gap-6 box-border font-sans">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 flex-1">
                    <div className="flex-shrink-0">
                      <img src={doller.src} alt="Trade Icon" className="w-[65px] h-auto block" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h4 className="m-0 text-xl md:text-2xl font-semibold text-gray-900">Trade and Upgrade</h4>
                      <p className="m-0 text-sm text-gray-600 leading-relaxed">Unlock the value of your old car. Get a quick quote today and upgrade to your dream car.</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-full md:w-auto text-center">
                    <div>
                      <a href="https://www.cardora.ca/trade-in-my-car?inventory_id=2478"
                        className="inline-block w-full md:w-auto bg-gradient-to-br from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white text-lg font-semibold px-7 py-3.5 rounded-xl no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-600/20 text-center whitespace-nowrap">
                        Sell or trade in
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specs grid & Extended Coverage */}
              <div className="w-full max-w-[850px]">
                <AboutVehicle vehicle={vehicle} />
                <div className="w-full my-14">
                  <div className="flex flex-col sm:flex-row items-center border border-gray-200 rounded-2xl px-6 py-4 bg-white w-full max-w-4xl mx-auto gap-5 box-border font-sans">
                    <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-5 flex-1">
                      <div className="flex-shrink-0">
                        <img src={protectShield?.src} alt="Protection Shield" className="w-[50px] h-auto block" />
                      </div>
                      <div>
                        <p className="m-0 text-[15px] text-gray-800 font-normal leading-relaxed">
                          Get mechanical protection plus 24/7 roadside assistance with Cardora Extended Coverage.
                          <a data-toggle="modal" data-target="#exampleModalCenter"
                            className="font-semibold text-black underline cursor-pointer hover:text-emerald-500 transition-colors duration-150 inline-block ml-1">
                            Learn more
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle description */}
                {vehicle.vehicle_description && (
                  <div className="bg-card border-none rounded-xl p-0 mt-[45px] flex-wrap">
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

              {/* Accordion list */}
              <div className="w-full flex justify-start mt-4">
                <VehicleSpecificationsAccordion
                  standardJson={vehicle.standard}
                  techSpecsJson={vehicle.technical_specification}
                  optionalJson={vehicle.optional}
                />
              </div>
            </div>

            {/* ── Right column: sticky sidebar (desktop) ── */}
            {showSidebar && (
              <div className="w-full lg:w-[380px] lg:flex-shrink-0 hidden lg:block">
                <div className="sticky top-6 space-y-5">
                  <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
                    <VehicleHeader vehicle={vehicle} />
                    <PriceAndCTA vehicle={vehicle} />
                  </div>
                  <Terms vehicle={vehicle} />
                </div>
              </div>
            )}
          </div>

          {/* ── Out of Bounds Elements ── */}
          {/* Anything below this row boundary will release the sticky container cleanly */}
          <div className="mt-12 w-full">
            <FinanceCalculator vehiclePrice={vehicle.selling_price} inventoryId={resolvedParams.id} />
          </div>

        </div>
      </section>

      <div className="w-full flex justify-center items-center text-[12px] px-10 bg-[#666]/10 pt-10 pb-16 italic text-black">
        Every reasonable effort is made to ensure the accuracy of the information listed above. Vehicle pricing, incentives, options (including standard equipment), and technical specifications listed is for the 2025 Hyundai Elantra Preferred w/ Tech Pkg may not match the exact vehicle displayed. Please confirm with a sales representative the accuracy of this information.
      </div>

      <GetInTouch />
      <Footer />
    </main>
  );
}