import type { Metadata } from "next";
import { appConfig } from "@/lib/appConfig";

export const metadata: Metadata = {
  title: `${appConfig.dealership.dealership_name} | About Us`,
  description: `Learn more about ${appConfig.dealership.dealership_name} in ${appConfig.dealership.city_1}, ${appConfig.dealership.province_1}.`,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
