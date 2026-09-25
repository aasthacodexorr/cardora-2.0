import type { Metadata } from "next";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadataHelper";

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataHelper({
    title: "Cardora Quality Standards | Certified Vehicle Inspection & Reconditioning",
    description: "Discover Cardora's forensic 150-point inspection and reconditioning process. Handpicked, professionally tested, and showroom-perfected cars across Canada.",
    canonicalPath: "/cardora-quality",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
