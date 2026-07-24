import type { Metadata } from "next";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadataHelper";

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataHelper({
    title: "Why Cardora | Canada’s Smarter Way to Buy & Sell Cars",
    description: "Learn more about our dealership and our commitment to customer service."
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
