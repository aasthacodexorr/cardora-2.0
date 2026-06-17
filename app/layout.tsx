import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { appConfig } from "@/lib/appConfig";

export const metadata: Metadata = {
  title: appConfig.site.home_page_title
    .replace("%city_1", appConfig.dealership.city_1)
    .replace("%province_1", appConfig.dealership.province_1),
  description: appConfig.site.home_page_description
    .replace("%dealership_name", appConfig.dealership.dealership_name)
    .replace("%city_1", appConfig.dealership.city_1)
    .replace("%province_1", appConfig.dealership.province_1),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}