import InventoryPage from "../page";
import VehicleDetailsPage from "../_components/VehicleDetailsPage";

export const dynamic = "force-dynamic";

// Supports shareable inventory filter paths while preserving existing
// one-segment vehicle detail URLs.
export default async function InventoryCatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const leadingToken = slug[0]?.split("-", 1)[0] || "";
  const leadingNumber = Number(leadingToken);
  const isVehicleDetail = /^\d+$/.test(leadingToken)
    && (leadingNumber < 1900 || leadingNumber > 2100);

  if (slug.length === 1 && isVehicleDetail) {
    const vehiclePage = await VehicleDetailsPage({ vehicleParam: slug[0] });
    if (vehiclePage) return vehiclePage;
  }

  return <InventoryPage />;
}
