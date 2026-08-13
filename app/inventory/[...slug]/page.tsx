import InventoryPage from "../page";
import VehicleDetailsPage from "../_components/VehicleDetailsPage";
import { isVehicleDetailSlug } from "@/lib/inventoryUrls";

export const dynamic = "force-dynamic";

// Supports shareable inventory filter paths while preserving existing
// one-segment vehicle detail URLs.
export default async function InventoryCatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  if (isVehicleDetailSlug(slug)) {
    const vehiclePage = await VehicleDetailsPage({ vehicleParam: slug[0] });
    if (vehiclePage) return vehiclePage;
  }

  return <InventoryPage />;
}
