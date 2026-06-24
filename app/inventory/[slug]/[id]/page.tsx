/* =========================
   Vehicle Detail Page (VDP)
   Server component that fetches a single vehicle
   from Typesense by document ID
========================= */

import { notFound } from "next/navigation";
// Layout
import { Header, Footer } from "@/components/layout";

// Inventory components
import { ImageGallery } from "@/components/inventory";
import FinanceCalculator from "@/components/inventory/FinanceCalculator";

// Shared components
import { GetInTouch } from "@/components/common";

// Config, assets & services
import { SITE_CONFIG, DEFAULT_PLACEHOLDER_IMAGE } from "@/constants";
import { getVehicleById } from "@/lib/inventoryUrls";
import { stripHtml, parseImageUrls } from "@/utils/formatters";
import { appConfig } from "@/lib/appConfig";

import doller from "@/assets/icons/doller-1.png";
import protectShield from "@/assets/icons/trade-shield.png";
import Image from "next/image";
import VehicleSpecificationsAccordion from "@/components/inventory/Faq";
import Terms from "@/components/inventory/Terms";
import AboutVehicle from "@/components/inventory/AboutVehicle";
import { PriceAndCTA, VehicleHeader } from "@/components/inventory/VehicleInfo";
import CoverageModal from "@/components/inventory/CoverageModal";

// Force dynamic rendering — vehicle data changes frequently
export const dynamic = "force-dynamic";
const showSidebar = true;

/* Page Component */
export default async function VehicleDetailsPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const resolvedParams = await params;
  const vehicle = await getVehicleById(resolvedParams.id);
  const description = vehicle?.vehicle_description
  ?.replace(/_{10,}/g, "<hr />");

  if (!vehicle) notFound();

  // Build display title (strip HTML if title field contains markup)
  const titleText = vehicle.title
    ? stripHtml(vehicle.title)
    : `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`;

  // Parse semicolon-separated image URLs; prepend CDN domain for relative paths
  const images = vehicle.image_urls
    ? parseImageUrls(vehicle.image_urls, SITE_CONFIG.urls.assetBaseUrl)
    : [DEFAULT_PLACEHOLDER_IMAGE || `${SITE_CONFIG.urls.assetBaseUrl}/image/default-placeholder.jpg`];

  const isSold = vehicle.status?.toLowerCase() !== "instock";

  return (
    <main className="min-h-screen bg-background flex flex-col items-center">
      {/* Header spanning 100% viewport, inside contents are usually centered natively */}
      <div className="w-full bg-hero-bg">
        <Header />
      </div>
      
      {/* CRITICAL FIX: 
        We added 'max-w-[1440px] xl:max-w-[1600px] w-full mx-auto' to control the core structure 
        so that on large monitors the entire layout centers like the design.
      */}
      <section className="w-full bg-background flex-1 max-w-[1440px] xl:max-w-[1600px] mx-auto">
        <div className="w-full pt-[30px]">
          
          {/* SECTION ROW: Controls the boundaries of the sticky sidebar */}
          <div className="flex flex-col gap-8 lg:flex-row items-stretch px-5 md:px-8 lg:px-10 relative w-full">
            
            {/* Left column: gallery + specs + description */}
            <div className={`flex flex-col gap-8 items-start flex-1 w-full ${showSidebar ? "lg:flex-1" : "mx-auto"}`}>
              {/* Image gallery */}
              <ImageGallery images={images} title={titleText} isSold={isSold} centered={!showSidebar} />
              
              <div className="text-[12px] font-light border-b border-gray-200">
                <p><strong className="font-medium">STOCK #</strong>: G-148421</p>
              </div>

              {/* vehicle header on mobile */}
              <div className={`flex justify-center w-full lg:hidden -mt-4`}>
                <div className="w-full">
                  <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
                    <VehicleHeader vehicle={vehicle} />
                    <PriceAndCTA vehicle={vehicle} />
                  </div>
                  <Terms vehicle={vehicle} />
                </div>  
              </div>

              {/* Trade In Banner */}
              <div className="w-full lg:mb-30 max-w-[925px] -mt-3 lg:-mt-0">
                <div className="flex flex-col md:flex-row items-center justify-between border border-gray-200 rounded-2xl p-6 bg-white w-full gap-6 box-border font-sans">
                  <div className="flex sm:flex-row md:gap- flex-1">
                    <div className="flex-shrink-0">
                      <Image src={doller} alt="Trade Icon" className="w-[65px] h-auto block" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h4 className="m-0 text-xl md:text-2xl font-semibold text-gray-900">Trade and Upgrade</h4>
                      <p className="m-0 text-[14px] text-black/70 md:leading-relaxed">Unlock the value of your old car. Get a quick quote today and upgrade to your dream car.</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-full md:w-auto text-center">
                    <div>
                      <a href={`/trade-in?inventory_id=${vehicle.id}`}
                        className="inline-block w-full md:w-auto bg-gradient-to-b from-[#00af66] to-[#00af66]/65 hover:opacity-90 shadow-md transition-opacity text-white text-lg font-semibold px-9 py-3.5 rounded-xl no-underline transition-all duration-200 text-center whitespace-nowrap">
                        Sell or trade in
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specs grid & Extended Coverage */}
              <div className="w-full max-w-[925px]">
                <AboutVehicle vehicle={vehicle} />
                <div className="w-full border-t border-gray-200 mt-4">
                  <div className="flex flex-col sm:flex-row items-center border border-gray-200 rounded-2xl px-6 py-4  mt-4 bg-white w-full mx-auto gap-5 box-border font-sans">
                    <div className="flex items-center sm:text-left gap-3">
                      <div className="flex-shrink-0">
                        <Image src={protectShield} alt="Protection Shield" className="w-[50px] h-auto block" />
                      </div>
                      <div>
                        <div className="m-0 text-[15px] text-gray-800 font-normal leading-relaxed">
                          Get mechanical protection plus 24/7 roadside assistance with Cardora Extended Coverage.
                          <a data-toggle="modal" data-target="#exampleModalCenter"
                            className="font-semibold text-black underline cursor-pointer hover:text-emerald-500 transition-colors duration-150">
                            <CoverageModal /> 
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle description */}
                {vehicle.vehicle_description && (
                  <div className="bg-card border-none rounded-xl p-0 mt-[15px] lg:mt-[45px] flex-wrap">
                    <h2 className="text-[22px] font-semibold text-black mb-[15px]">
                      Vehicle Description
                    </h2>
                    <div
                      className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-foreground/80 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </div>
                )}
              </div>

              {/* Accordion list */}
              <div className="w-full flex justify-start lg:mt-4 mt-0 max-w-[860px]">
                <VehicleSpecificationsAccordion
                  standardJson={vehicle.standard}
                  techSpecsJson={vehicle.technical_specification}
                  optionalJson={vehicle.optional}
                />
              </div>
            </div>

            {/* Right column: sticky sidebar (desktop) */}
            {showSidebar && (
              <div className="hidden lg:block lg:w-[450px] xl:w-[450px]">
                <div className="sticky top-6 h-fit space-y-5">
                  <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
                    <VehicleHeader vehicle={vehicle} />
                    <PriceAndCTA vehicle={vehicle} />
                  </div>
                  <Terms vehicle={vehicle} />
                </div>
              </div>
            )}
          </div>

          {/* Finance Calculator - Now spans full responsive width within the centralized container bounds */}
          <div className="mt-12 w-full md:px-8 lg:px-10">
            <FinanceCalculator vehiclePrice={vehicle.selling_price} inventoryId={resolvedParams.id} />
          </div>

        </div>
      </section>

      {/* Disclaimers & Info banner footer base */}
      <div className="w-full lg:text-center text-xs md:text-[12px] px-2 md:px-10 bg-[#666]/10 pt-10 pb-16 italic text-black mt-12">
        <div className="max-w-[1440px] xl:max-w-[1600px] mx-auto">
          Every reasonable effort is made to ensure the accuracy of the information listed above. Vehicle pricing, incentives, options (including standard equipment), and technical specifications listed for the {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim} may not match the exact vehicle displayed. {appConfig.site.inventory_pricing_verbage} Please confirm with a sales representative the accuracy of this information.
        </div>
      </div>

      <div className="w-full bg-black">
        <div className="max-w-[1440px] xl:max-w-[1600px] mx-auto w-full">
          <GetInTouch />
          <Footer />
        </div>
      </div>
    </main>
  );
}