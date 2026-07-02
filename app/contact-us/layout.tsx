import type { Metadata } from "next";
import { getAppConfig, getSafeDealershipConfig } from "@/lib/appConfig";

export async function generateMetadata(): Promise<Metadata> {
  const appConfig = await getAppConfig();
  const safeD = getSafeDealershipConfig(appConfig.dealership);
  
  return {
  title: appConfig.site.contact_us_page_title
    .replace("%dealership_name", safeD.dealership_name)
    .replace("%city_1", safeD.city_1)
    .replace("%province_1", safeD.province_1),
  description: appConfig.site.contact_us_page_description
    .replace("%dealership_name", safeD.dealership_name)
    .replace("%city_1", safeD.city_1)
    .replace("%province_1", safeD.province_1)
    .replace("%sales_number_1", safeD.sales_number_1)
    .replace("%email_1", safeD.email_1),
};
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
