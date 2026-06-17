/* =========================
   Vehicle Service
   Handles all server-side data fetching
   for vehicle data from the Typesense API.
   Used by the Vehicle Detail Page (VDP).
========================= */

import { appConfig } from "@/lib/appConfig";

/**
 * Fetches a single vehicle document from Typesense by its document ID.
 * Returns null if the vehicle is not found or the request fails.
 *
 * @param id - The Typesense document ID
 */
export async function getVehicleById(id: string): Promise<Record<string, any> | null> {
  const apiKey     = appConfig.site.inventory_search_only_key;
  const collection = appConfig.site.collection;
  const host       = appConfig.site.typesense_host;

  if (!apiKey || !collection || !host) {
    throw new Error(
      "Missing Typesense configuration in appConfig.site"
    );
  }

  const url = `https://${host}/collections/${collection}/documents/search?q=*&filter_by=id:=${id}`;

  const res = await fetch(url, {
    headers: { "X-TYPESENSE-API-KEY": apiKey },
    cache: "no-store", // Always fetch fresh data for VDP
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.hits?.[0]?.document ?? null;
}
