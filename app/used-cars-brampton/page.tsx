import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadataHelper";
import { getLocationPage } from "@/lib/locationPages";
import { LocationPage } from "@/components/location";

const CITY_KEY = "brampton";

export async function generateMetadata(): Promise<Metadata> {
  const data = getLocationPage(CITY_KEY);
  if (!data) return {};

  const exactCanonicalUrl = `https://www.cardora.ca${data.slug}/`;

  return generateMetadataHelper({
    title: data.title,
    description: data.description,
    canonicalUrl: exactCanonicalUrl,
    images: data.ogImage ? [data.ogImage] : undefined,
    siteName: "Cardora",
    locale: "en_CA",
    robots: {
      index: true,
      follow: true,
    },
  });
}

export default async function UsedCarsBramptonPage() {
  const data = getLocationPage(CITY_KEY);
  if (!data) {
    notFound();
  }

  return <LocationPage cityKey={CITY_KEY} />;
}
