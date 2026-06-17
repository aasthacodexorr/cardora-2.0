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
import { appConfig } from "@/lib/appConfig";

/*  Server configuration */
export const typesenseServerConfig = {
  apiKey: appConfig.site.inventory_search_only_key,
  nodes: [
    {
      host:     appConfig.site.typesense_host,
      port:     Number(appConfig.site.typesense_port) || 443,
      protocol: appConfig.site.typesense_protocol || "https",
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
export const TYPESENSE_COLLECTION_NAME = appConfig.site.collection;
