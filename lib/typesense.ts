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
import { AppConfig } from "@/lib/appConfig";

export function getTypesenseClient(config: AppConfig) {
  const typesenseServerConfig = {
    apiKey: config.site.inventory_search_only_key,
    nodes: [
      {
        host: config.site.typesense_host,
        port: Number(config.site.typesense_port) || 443,
        protocol: config.site.typesense_protocol || "https",
      },
    ],
    connectionTimeoutSeconds: 5,
  };

  const typesenseAdapter = new TypesenseInstantSearchAdapter({
    server: typesenseServerConfig,
    additionalSearchParameters: {
      query_by:
        "make,model,body_type,trim,vehicle_type,exterior_color,transmission,fuel_type",
    },
  });

  return {
    searchClient: typesenseAdapter.searchClient,
    TYPESENSE_COLLECTION_NAME: config.site.collection,
  };
}
