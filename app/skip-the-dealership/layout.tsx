import type { Metadata } from "next";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadataHelper";

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataHelper({
    pageType: "contact_us",
    customTitle: "Skip the Dealership - Buy Your Car Online",
    customDescription: "Buy your next car 100% online without the dealership hassle. Fast approvals, transparent pricing, and home delivery options available."
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
