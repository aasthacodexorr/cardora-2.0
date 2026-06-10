/* =========================
   Typesense Search Client
   Configures and exports the Typesense
   InstantSearch adapter and search client.
   Used by the Inventory page (react-instantsearch).

   Environment variables required:
   - NEXT_PUBLIC_TYPESENSE_SEARCH_KEY
   - NEXT_PUBLIC_TYPESENSE_HOST
   - NEXT_PUBLIC_TYPESENSE_PORT
   - NEXT_PUBLIC_TYPESENSE_PROTOCOL
   - NEXT_PUBLIC_TYPESENSE_COLLECTION
========================= */

import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

/*  Server configuration */
export const typesenseServerConfig = {
  apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_KEY || "",
  nodes: [
    {
      host:     process.env.NEXT_PUBLIC_TYPESENSE_HOST     || "",
      port:     Number(process.env.NEXT_PUBLIC_TYPESENSE_PORT) || 443,
      protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || "https",
    },
  ],
  connectionTimeoutSeconds: 5,
};

/*  Adapter + search client */
// Pinned to ~2.8.0 for Typesense v0.23.1 compatibility
export const typesenseAdapter = new TypesenseInstantSearchAdapter({
  server: typesenseServerConfig,
  additionalSearchParameters: {
    // Fields searched when a user types in the search box
    query_by:
      "make,model,body_type,trim,vehicle_type,exterior_color,transmission,fuel_type",
  },
});

/** The InstantSearch-compatible search client */
export const searchClient = typesenseAdapter.searchClient;

/** Typesense collection name used as the InstantSearch index name */
export const TYPESENSE_COLLECTION_NAME =
  process.env.NEXT_PUBLIC_TYPESENSE_COLLECTION || "";
