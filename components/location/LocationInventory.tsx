"use client";

import InventoryView from "@/components/inventory/InventoryView";
import LocationSEOContent from "./LocationSEOContent";
import type { LocationPageConfig } from "@/lib/locationPages";

export interface LocationInventoryProps {
  city: string;
  heading: string;
  seoData?: LocationPageConfig;
}

export default function LocationInventory({
  city,
  heading,
  seoData,
}: LocationInventoryProps) {
  return (
    <InventoryView
      isLocationPage={true}
      locationCity={city}
      locationHeading={heading}
      bottomSlot={seoData ? <LocationSEOContent data={seoData} /> : undefined}
    />
  );
}
