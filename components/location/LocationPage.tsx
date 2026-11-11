import { Suspense } from "react";
import { getAppConfig, getSafeDealershipConfig, defaultAppConfig } from "@/lib/appConfig";
import { getLocationPage, checkLocationHasVehicles } from "@/lib/locationPages";
import LocationInventory from "./LocationInventory";
import LocationInventorySkeleton from "./LocationInventorySkeleton";

export interface LocationPageProps {
  cityKey: string;
}

export default async function LocationPage({ cityKey }: LocationPageProps) {
  let safeD = getSafeDealershipConfig(defaultAppConfig.dealership);
  let resolvedAppConfig = defaultAppConfig;
  try {
    const appConfig = await getAppConfig();
    if (appConfig) {
      resolvedAppConfig = appConfig;
      if (appConfig.dealership) {
        safeD = getSafeDealershipConfig(appConfig.dealership);
      }
    }
  } catch (err) {
    // Graceful fallback to defaultAppConfig
  }

  const data = getLocationPage(cityKey);

  if (!data) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-bold text-foreground">Location Not Found</h1>
        <p className="mt-2 text-foreground/70">
          The requested city location page is not configured.
        </p>
      </div>
    );
  }

  const hasVehicles = await checkLocationHasVehicles(data.city, resolvedAppConfig);

  const baseUrl = "https://cardora.ca";
  const canonicalUrl = `${baseUrl}${data.slug}`;
  const exactCanonicalUrl = `https://www.cardora.ca${data.slug}/`;

  // Structured Data 1: BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Used Cars",
        item: `${baseUrl}/inventory`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: data.heading,
        item: canonicalUrl,
      },
    ],
  };

  // Structured Data 2: AutoDealer serving this area
  const autoDealerSchema = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: safeD.dealership_name || "Cardora",
    url: canonicalUrl,
    logo: safeD.dealership_logo,
    image: safeD.dealership_logo || safeD.default_placeholder_image,
    telephone: safeD.sales_number_1 || safeD.toll_free_number_1 || "",
    email: safeD.email_1 || "",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: safeD.full_address_1,
      addressLocality: safeD.city_1,
      addressRegion: safeD.province_1,
      postalCode: safeD.postal_code_1,
      addressCountry: safeD.country_1,
    },
    areaServed: [
      {
        "@type": "City",
        name: data.city,
      },
      {
        "@type": "AdministrativeArea",
        name: data.province,
      },
    ],
  };

  return (
    <div className="w-full bg-light-gray">
      {/* Schema.org Structured Data */}
      {data.schemaMarkup ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data.schemaMarkup) }}
        />
      ) : (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(autoDealerSchema) }}
          />
        </>
      )}

      {/* Main Location Inventory Section with Suspense loading skeleton */}
      <Suspense fallback={<LocationInventorySkeleton heading={data.heading} city={data.city} />}>
        <LocationInventory
          city={data.city}
          heading={data.heading}
          locationData={data}
          hasLocationVehicles={hasVehicles}
        />
      </Suspense>


    </div>
  );
}
