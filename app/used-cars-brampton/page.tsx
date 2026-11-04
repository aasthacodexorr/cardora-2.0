import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadataHelper";
import { getLocationPage } from "@/lib/locationPages";
import { LocationPage } from "@/components/location";

const CITY_KEY = "brampton";

export async function generateMetadata(): Promise<Metadata> {
  const data = getLocationPage(CITY_KEY);
  if (!data) return {};

  return generateMetadataHelper({
    title: data.title,
    description: data.description,
    canonicalPath: data.slug,
  });
}

export default async function UsedCarsBramptonPage() {
  const data = getLocationPage(CITY_KEY);
  if (!data) {
    notFound();
  }

  return <LocationPage cityKey={CITY_KEY} />;
}
