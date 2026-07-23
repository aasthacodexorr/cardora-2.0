import type { Metadata } from "next";
import { getAppConfig, getSafeDealershipConfig } from "@/lib/appConfig";
import { getVehicleBySlug } from "@/lib/inventoryUrls";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const appConfig = await getAppConfig();
  const dealership = getSafeDealershipConfig(appConfig.dealership);

  const vehicle = await getVehicleBySlug(slug, appConfig);

  if (!vehicle) {
    return {
      title: "Vehicle Not Found",
    };
  }

  const title = appConfig.site.vdp_page_title_template
    .replaceAll("%year", vehicle.year)
    .replaceAll("%make", vehicle.make)
    .replaceAll("%model", vehicle.model)
    .replaceAll("%dealership_name", dealership.dealership_name)
    .replaceAll("%city_1", dealership.city_1)
    .replaceAll("%province_1", dealership.province_1);

  const description = appConfig.site.vdp_page_description_template
    .replaceAll("%year", vehicle.year)
    .replaceAll("%make", vehicle.make)
    .replaceAll("%model", vehicle.model)
    .replaceAll("%trim", vehicle.trim)
    .replaceAll("%dynamic_price_placeholder", vehicle.price)
    .replaceAll("%dealership_name", dealership.dealership_name)
    .replaceAll("%city_1", dealership.city_1)
    .replaceAll("%province_1", dealership.province_1);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [vehicle.primaryImage],
    },
  };
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}