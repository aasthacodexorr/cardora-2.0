import { permanentRedirect } from "next/navigation";
import InventoryPage from "../page";
import VehicleDetailsPage from "../_components/VehicleDetailsPage";
import { isVehicleDetailSlug } from "@/lib/inventoryUrls";
import { extractLocationFromSlug } from "@/lib/locationPages";
import LocationPage from "@/components/location/LocationPage";

export const dynamic = "force-dynamic";

// Supports shareable inventory filter paths, vehicle detail URLs,
// and location-based inventory URLs (e.g. /inventory/used-cars-brampton, /inventory/audi/used-cars-brampton).
export default async function InventoryCatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  // Redirect legacy singular "used-car-{city}" to plural "used-cars-{city}"
  if (slug.some((segment) => /^used-car-[a-z0-9-]+$/i.test(segment))) {
    const correctedSlug = slug.map((segment) =>
      segment.replace(/^used-car-([a-z0-9-]+)$/i, "used-cars-$1")
    );
    permanentRedirect(`/inventory/${correctedSlug.join("/")}`);
  }

  if (isVehicleDetailSlug(slug)) {
    const vehiclePage = await VehicleDetailsPage({ vehicleParam: slug[0] });
    if (vehiclePage) return vehiclePage;
  }

  // Check if any slug segment represents a location (e.g. used-cars-brampton)
  const locationInfo = slug.map(extractLocationFromSlug).find(Boolean);
  if (locationInfo) {
    return <LocationPage cityKey={locationInfo.cityKey} />;
  }

  return <InventoryPage />;
}
