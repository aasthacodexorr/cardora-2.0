/* =========================
   Vehicle Service
   Handles all server-side data fetching
   for vehicle data from the Typesense API.
   Used by the Vehicle Detail Page (VDP).
========================= */

/**
 * Fetches a single vehicle document from Typesense by its document ID.
 * Returns null if the vehicle is not found or the request fails.
 *
 * @param id - The Typesense document ID
 */
export async function getVehicleById(id: string): Promise<Record<string, any> | null> {
  const apiKey     = process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_KEY;
  const collection = process.env.NEXT_PUBLIC_TYPESENSE_COLLECTION;
  const host       = process.env.NEXT_PUBLIC_TYPESENSE_HOST;

  if (!apiKey || !collection || !host) {
    throw new Error(
      "Missing Typesense configuration. Check NEXT_PUBLIC_TYPESENSE_SEARCH_KEY, " +
      "NEXT_PUBLIC_TYPESENSE_COLLECTION, and NEXT_PUBLIC_TYPESENSE_HOST in .env"
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
