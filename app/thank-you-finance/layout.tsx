import type { Metadata } from "next";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadataHelper";

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataHelper({ pageType: "thank_you" });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
