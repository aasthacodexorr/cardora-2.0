import type { Metadata } from "next";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadataHelper";

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataHelper({
    pageType: "contact_us",
    customTitle: "About Us",
    customDescription: "Learn more about our dealership and our commitment to customer service."
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
