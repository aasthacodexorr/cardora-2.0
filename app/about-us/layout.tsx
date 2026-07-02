import type { Metadata } from "next";
import { getAppConfig, getSafeDealershipConfig } from "@/lib/appConfig";

export async function generateMetadata(): Promise<Metadata> {
  const appConfig = await getAppConfig();
  const safeD = getSafeDealershipConfig(appConfig.dealership);
  
  return {
  title: `${safeD.dealership_name} | About Us`,
  description: `Learn more about ${safeD.dealership_name} in ${safeD.city_1}, ${safeD.province_1}.`,
};
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
