import type { Metadata } from "next";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadataHelper";

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataHelper({
    title: "Protect Your Vehicle | Warranty & Coverage Plans - Cardora",
    description: "Protect your vehicle with comprehensive coverage plans. From extended warranties to added protection, drive with confidence anywhere in Canada. Visit Cardora for full details."
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}