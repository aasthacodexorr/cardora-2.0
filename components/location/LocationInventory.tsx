"use client";

import InventoryView from "@/components/inventory/InventoryView";
import LocationSEOContent from "./LocationSEOContent";
import type { LocationPageConfig } from "@/lib/locationPages";

export interface LocationInventoryProps {
  city: string;
  heading: string;
  locationData: LocationPageConfig;
  hasLocationVehicles?: boolean;
}

export default function LocationInventory({
  city,
  heading,
  locationData,
  hasLocationVehicles,
}: LocationInventoryProps) {
  return (
    <InventoryView
      isLocationPage={true}
      locationCity={city}
      locationHeading={heading}
      hasLocationVehicles={hasLocationVehicles}
    />
  );
}
