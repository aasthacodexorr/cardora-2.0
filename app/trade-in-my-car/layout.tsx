import type { Metadata } from "next";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadataHelper";

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataHelper({ pageType: "trade_in_appraisal" });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
