import type { Metadata } from "next";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadataHelper";

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataHelper({
    title: "Skip The Dealership | Buy Cars Online in Canada - Cardora",
    description: "Buy your next car online without dealership pressure. Browse, finance, and get delivery across Canada with Cardora . Fast, simple, and transparent.",
    canonicalPath: "/skip-the-dealership",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
