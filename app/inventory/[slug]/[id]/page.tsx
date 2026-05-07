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
            <div className="space-y-8">
              {/* Image Gallery with arrows */}
              <ImageGallery
                images={images}
                title={titleText}
                isSold={vehicle.status?.toLowerCase() !== "instock"}
              />

              {/* Specs Grid */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-[20px] font-bold text-foreground mb-5">
                  About this vehicle
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-[13px] text-muted-foreground mb-1">
                      Odometer
                    </p>
                    <p className="font-bold text-[15px]">
                      {vehicle.odometer.toLocaleString()} KM
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-muted-foreground mb-1">
                      Body Style
                    </p>
                    <p className="font-bold text-[15px]">
                      {vehicle.body_type || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-muted-foreground mb-1">
                      Transmission
                    </p>
                    <p className="font-bold text-[15px]">
                      {vehicle.transmission || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-muted-foreground mb-1">
                      Exterior Color
                    </p>
                    <p className="font-bold text-[15px]">
                      {vehicle.exterior_color || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-muted-foreground mb-1">
                      Engine
                    </p>
                    <p className="font-bold text-[15px]">
                      {vehicle.litres || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-muted-foreground mb-1">
                      Drivetrain
                    </p>
                    <p className="font-bold text-[15px]">
                      {vehicle.drivetrain || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-muted-foreground mb-1">
                      Doors
                    </p>
                    <p className="font-bold text-[15px]">
                      {vehicle.door || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-muted-foreground mb-1">
                      Stock #
                    </p>
                    <p className="font-bold text-[15px]">{vehicle.stock_no}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Description */}
              {vehicle.vehicle_description && (
                <div className="bg-card border border-border rounded-xl p-6">
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
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
                        <path
                          strokeLinecap="round"
                          strokeWidth={1.5}
                          d="M12 6v6l4 2"
                        />
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
                    <div className="express_checkout">
                    <Image src={expre} alt="Express Checkout" />
                    </div>

                  {/* CTA Buttons */}
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
