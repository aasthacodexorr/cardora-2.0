import type { Metadata } from "next";
import { getAppConfig, getSafeDealershipConfig } from "./appConfig";
import { headers } from "next/headers";

interface MetadataGeneratorOptions {
  title: string;
  description: string;
  additionalReplacements?: Record<string, string>;
  canonicalPath?: string;
  images?: string[];
}

/**
 * Replace template placeholders in metadata strings
 * Supports: %dealership_name, %city_1, %province_1, %sales_number_1, %email_1
 */
function replacePlaceholders(
  template: string,
  dealership: ReturnType<typeof getSafeDealershipConfig>,
  additionalReplacements?: Record<string, string>
): string {
  let result = template;

  // Standard replacements
  result = result.replace(/%dealership_name/g, dealership.dealership_name);
  result = result.replace(/%city_1/g, dealership.city_1);
  result = result.replace(/%province_1/g, dealership.province_1);
  result = result.replace(/%sales_number_1/g, dealership.sales_number_1);
  result = result.replace(/%email_1/g, dealership.email_1);

  // Custom replacements
  if (additionalReplacements) {
    Object.entries(additionalReplacements).forEach(([key, value]) => {
      result = result.replace(new RegExp(`%${key}`, "g"), value);
    });
  }

  return result;
}

export async function generateMetadata(
  options: MetadataGeneratorOptions
): Promise<Metadata> {
  const appConfig = await getAppConfig();
  const safeD = getSafeDealershipConfig(appConfig.dealership);

  const title = replacePlaceholders(options.title, safeD, options.additionalReplacements);
  const description = replacePlaceholders(options.description, safeD, options.additionalReplacements);

  let host = "www.cardora.ca";
  try {
    const headersList = await headers();
    const headerHost = headersList.get("host");
    if (headerHost) {
      host = headerHost;
    }
  } catch (e) {
    // Fallback for static generation where headers are unavailable
  }

  const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;
  const canonicalUrl = `${baseUrl}${options.canonicalPath || ""}`;
  const resolvedImages = options.images && options.images.length > 0
    ? options.images
    : [safeD.dealership_logo];

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: safeD.dealership_name,
      images: resolvedImages,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: resolvedImages,
    },
  };
}
