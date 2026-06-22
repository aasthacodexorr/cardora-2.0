import { appConfig } from "@/lib/appConfig";

export interface FeaturedVehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  odometer?: number;
  price?: number;
  selling_price?: number;
  static_images?: Array<{ image_url: string; active: string }>;
  km_miles?: string;
  [key: string]: any;
}

/**
 * Fetches featured vehicles from Typesense API
 * @returns Array of featured vehicles
 */
export async function getFeaturedVehicles(): Promise<FeaturedVehicle[]> {
  try {
    const { feature_inventory_key, typesense_host, typesense_port, typesense_protocol, collection } = appConfig.site;

    if (!feature_inventory_key || !typesense_host || !collection) {
      throw new Error("Missing Typesense configuration");
    }

    const url = `${typesense_protocol}://${typesense_host}:${typesense_port}/collections/${collection}/documents/search?q=*&query_by=make,model,trim&sort_by=created_at:desc&limit=8`;

    const response = await fetch(url, {
      headers: { "X-TYPESENSE-API-KEY": feature_inventory_key },
      cache: "no-store",
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.hits?.map((item: any) => item.document) || [];
  } catch (error) {
    console.error("Error fetching featured vehicles:", error);
    return [];
  }
}
