import type { Metadata } from "next";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadataHelper";

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataHelper({ pageType: "contact_us", customTitle: "Our Services", customDescription: "Explore our full range of automotive services and expertise." });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
