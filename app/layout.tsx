import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ScriptLoader } from "@/components/ScriptLoader";
import { getAppConfig, getSafeDealershipConfig } from "@/lib/appConfig";

export async function generateMetadata(): Promise<Metadata> {
  const appConfig = await getAppConfig();
  const safeD = getSafeDealershipConfig(appConfig.dealership);
  
  return {
    title: appConfig.site.home_page_title
      .replace("%city_1", safeD.city_1)
      .replace("%province_1", safeD.province_1),
    description: appConfig.site.home_page_description
      .replace("%dealership_name", safeD.dealership_name)
      .replace("%city_1", safeD.city_1)
      .replace("%province_1", safeD.province_1),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appConfig = await getAppConfig();

  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <head>
        {/* Load form validation script before any interactive content */}
        <ScriptLoader />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers config={appConfig}>{children}</Providers>
      </body>
    </html>
  );
}