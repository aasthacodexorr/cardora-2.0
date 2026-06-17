import type { Metadata } from "next";
import { appConfig } from "@/lib/appConfig";

export const metadata: Metadata = {
  title: appConfig.site.contact_us_page_title
    .replace("%dealership_name", appConfig.dealership.dealership_name)
    .replace("%city_1", appConfig.dealership.city_1)
    .replace("%province_1", appConfig.dealership.province_1),
  description: appConfig.site.contact_us_page_description
    .replace("%dealership_name", appConfig.dealership.dealership_name)
    .replace("%city_1", appConfig.dealership.city_1)
    .replace("%province_1", appConfig.dealership.province_1)
    .replace("%sales_number_1", appConfig.dealership.sales_number_1)
    .replace("%email_1", appConfig.dealership.email_1),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
