import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

// Configuration based on Typesense v0.23.1 requirements
export const typesenseServerConfig = {
  apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_KEY || "", 
  nodes: [
    {
      host: process.env.NEXT_PUBLIC_TYPESENSE_HOST || "",
      port: Number(process.env.NEXT_PUBLIC_TYPESENSE_PORT) || 443,
      protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || "https",
    },
  ],
  connectionTimeoutSeconds: 5,
};

// Export the search client adapter to be used in react-instantsearch
export const typesenseAdapter = new TypesenseInstantSearchAdapter({
  server: typesenseServerConfig,
  // Using the collection specified for Cardora
  additionalSearchParameters: {
    query_by: "make,model,body_type,trim,vehicle_type,exterior_color,transmission,fuel_type",
  },
});

export const searchClient = typesenseAdapter.searchClient;
export const TYPESENSE_COLLECTION_NAME = process.env.NEXT_PUBLIC_TYPESENSE_COLLECTION || "";
