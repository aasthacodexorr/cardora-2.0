"use client";

import InventoryView from "@/components/inventory/InventoryView";

export interface LocationInventoryProps {
  city: string;
  heading: string;
}

export default function LocationInventory({
  city,
  heading,
}: LocationInventoryProps) {
  return (
    <InventoryView
      isLocationPage={true}
      locationCity={city}
      locationHeading={heading}
    />
  );
}
