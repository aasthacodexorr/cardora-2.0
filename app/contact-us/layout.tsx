import type { Metadata } from "next";
import { getAppConfig } from "@/lib/appConfig";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadataHelper";

export async function generateMetadata(): Promise<Metadata> {
  const appConfig = await getAppConfig();
  return generateMetadataHelper({
    title: appConfig.site.contact_us_page_title,
    description: appConfig.site.contact_us_page_description,
    canonicalPath: "/contact-us",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
