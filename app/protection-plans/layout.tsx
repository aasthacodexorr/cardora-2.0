import type { Metadata } from "next";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadataHelper";

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataHelper({
    pageType: "contact_us",
    customTitle: "Vehicle Protection Plans",
    customDescription: "Comprehensive vehicle protection plans with warranty coverage, roadside assistance, and nationwide protection."
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
