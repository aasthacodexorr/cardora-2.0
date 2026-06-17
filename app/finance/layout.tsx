import type { Metadata } from "next";
import { appConfig } from "@/lib/appConfig";

export const metadata: Metadata = {
  title: appConfig.site.finance_page_title
    .replace("%dealership_name", appConfig.dealership.dealership_name)
    .replace("%city_1", appConfig.dealership.city_1)
    .replace("%province_1", appConfig.dealership.province_1),
  description: appConfig.site.finance_page_description
    .replace("%dealership_name", appConfig.dealership.dealership_name)
    .replace("%city_1", appConfig.dealership.city_1)
    .replace("%province_1", appConfig.dealership.province_1),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
