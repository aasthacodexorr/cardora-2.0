import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ScriptLoader } from "@/components/ScriptLoader";
import { getAppConfig, getSafeDealershipConfig, getSafeSchemaOrgConfig } from "@/lib/appConfig";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadataHelper";
import { CSS_VARIABLES } from "@/lib/colors";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const appConfig = await getAppConfig();
  return generateMetadataHelper({
    title: appConfig.site.home_page_title,
    description: appConfig.site.home_page_description,
    canonicalPath: "",
  });
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appConfig = await getAppConfig();
  const safeD = getSafeDealershipConfig(appConfig.dealership);
  const safeSO = getSafeSchemaOrgConfig(appConfig.schema_org);

  let host = "www.cardora.ca";
  try {
    const headersList = await headers();
    const headerHost = headersList.get("host");
    if (headerHost) {
      host = headerHost;
    }
  } catch (e) {
    // Fallback for static generation
  }

  const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const schemaOrgData = {
    "@context": "https://schema.org",
    "@type": safeSO.entity_type || "AutoDealer",
    "name": safeD.dealership_name,
    "image": safeD.dealership_logo || safeD.default_placeholder_image,
    "telephone": safeD.sales_number_1 || safeD.toll_free_number_1 || "",
    "email": safeD.email_1 || "",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": safeD.full_address_1,
      "addressLocality": safeD.city_1,
      "addressRegion": safeD.province_1,
      "postalCode": safeD.postal_code_1,
      "addressCountry": safeD.country_1,
    },
    "url": baseUrl,
    "priceRange": safeSO.price_range || "$$",
    "openingHours": safeSO.opening_hours || "Mo-Su 09:00-18:00",
  };

  return (
    <html
      lang="en"
      className="h-full antialiased"
      style={CSS_VARIABLES as React.CSSProperties}
    >
      <head>
        {/* Load form validation script before any interactive content */}
        <ScriptLoader />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgData) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers config={appConfig}>{children}</Providers>
      </body>
    </html>
  );
}