import type { Metadata } from "next";
import { getAppConfig, getSafeDealershipConfig } from "@/lib/appConfig";
import { getVehicleBySlug, isVehicleDetailSlug } from "@/lib/inventoryUrls";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadataHelper";
import { parseImageUrls } from "@/utils/formatters";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (!isVehicleDetailSlug(slug)) {
    return {};
  }

  const appConfig = await getAppConfig();
  const dealership = getSafeDealershipConfig(appConfig.dealership);

  const vehicle = await getVehicleBySlug(slug, appConfig);

  if (!vehicle) {
    return {
      title: "Vehicle Not Found",
    };
  }

  const images = vehicle.image_urls
    ? parseImageUrls(vehicle.image_urls, appConfig.site.cdn_api)
    : [dealership.default_placeholder_image];

  return generateMetadataHelper({
    title: appConfig.site.vdp_page_title_template,
    description: appConfig.site.vdp_page_description_template,
    additionalReplacements: {
      year: String(vehicle.year),
      make: vehicle.make,
      model: vehicle.model,
      trim: vehicle.trim || "",
      dynamic_price_placeholder: "$" + (vehicle.selling_price ? Number(vehicle.selling_price).toLocaleString("en-CA") : "0"),
    },
    canonicalPath: `/inventory/${slug[0]}`,
    images: images,
  });
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}