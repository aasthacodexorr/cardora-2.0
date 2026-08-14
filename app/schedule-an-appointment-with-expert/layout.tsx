import type { Metadata } from "next";
import { getAppConfig } from "@/lib/appConfig";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadataHelper";

export async function generateMetadata(): Promise<Metadata> {
  const appConfig = await getAppConfig();
  return generateMetadataHelper({
    title: appConfig.site.book_an_appointment_page_title,
    description: appConfig.site.book_an_appointment_page_description,
    canonicalPath: "/schedule-an-appointment-with-expert",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
