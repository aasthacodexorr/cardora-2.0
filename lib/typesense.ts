/* =========================
   Typesense Search Client
   ...
========================= */

import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import { AppConfig } from "@/lib/appConfig";
import { parseMakeModelSelections } from "@/lib/inventoryRouting";

/* =========================
   Make/Model filter rewriting
   -------------------------
   react-instantsearch (via the typesense adapter) always ANDs different
   refinementList attributes together: `make:=[BMW,Audi] && model:=[X5]`.
   That means "model=X5" incorrectly restricts every selected make, not
   just BMW.

   We want the equivalent Typesense expression without parentheses because
   this Typesense configuration parses a leading `(make` or `(model` as a
   field name:
     make:=BMW && model:=[X5] || make:=Audi

   i.e. a model only restricts the make it belongs to; any other selected
   make with no model selected still returns all of its vehicles.
========================= */

type FacetFilterEntry = string | string[];

const ATTR_PREFIX = (attribute: string) => `${attribute}:`;

function extractFacetAttribute(facetFilters: FacetFilterEntry[], attribute: string) {
  const prefix = ATTR_PREFIX(attribute);
  const values: string[] = [];
  const remaining: FacetFilterEntry[] = [];

  facetFilters.forEach((entry) => {
    const group = Array.isArray(entry) ? entry : [entry];
    const matching = group.filter(
      (value) => typeof value === "string" && value.startsWith(prefix)
    );

    if (matching.length > 0) {
      matching.forEach((value) => values.push(value.slice(prefix.length)));

      const unrelated = group.filter(
        (value) => typeof value !== "string" || !value.startsWith(prefix)
      );
      if (unrelated.length > 0) {
        remaining.push(Array.isArray(entry) ? unrelated : unrelated[0]);
      }
      return;
    }

    remaining.push(entry);
  });

  return { values, remaining };
}

const isNumericValue = (value: string) => value !== "" && !Number.isNaN(Number(value));
const escapeFilterValue = (value: string) =>
  isNumericValue(value) ? value : `\`${value.replace(/`/g, "'")}\``;

function normalizeFacetValue(value: string) {
  return value.replace(/^=\[?/, "").replace(/\]?$/, "");
}

function buildMakeModelFilter(
  selectedMakes: string[],
  selections: ReturnType<typeof parseMakeModelSelections>,
  availableModels: string[],
) {
  const canonicalMakes = new Map(selectedMakes.map((make) => [make.toLowerCase(), make]));
  const canonicalModels = new Map(availableModels.map((model) => [model.toLowerCase(), model]));
  const grouped = new Map<string, string[]>();

  selections.forEach(({ make, model }) => {
    const canonicalMake = canonicalMakes.get(make.toLowerCase());
    if (!canonicalMake) return;
    const canonicalModel = canonicalModels.get(model.toLowerCase()) || model;
    grouped.set(canonicalMake, [...(grouped.get(canonicalMake) || []), canonicalModel]);
  });

  return selectedMakes.map((make) => {
    const models = grouped.get(make);
    const makeFilter = `make:=[${escapeFilterValue(make)}]`;
    return models?.length
      ? `${makeFilter} && model:=[${models.map(escapeFilterValue).join(",")}]`
      : makeFilter;
  });
}

function getUrlMakeModelSelections() {
  if (typeof window === "undefined") return [];
  return parseMakeModelSelections(new URLSearchParams(window.location.search).get("models") || "");
}

function getMakeModelBranches(request: any) {
  const params = request.params || {};
  const facetFilters: FacetFilterEntry[] | undefined = params.facetFilters;
  if (!facetFilters || facetFilters.length === 0) return null;

  const { values: rawMakes, remaining: withoutMake } = extractFacetAttribute(facetFilters, "make");
  const { values: rawModels, remaining: withoutMakeOrModel } = extractFacetAttribute(withoutMake, "model");
  const makes = rawMakes.map(normalizeFacetValue);
  const models = rawModels.map(normalizeFacetValue);
  const selections = getUrlMakeModelSelections();

  // Typesense in this deployment does not evaluate cross-field `||` filters.
  // Send one valid filter per make instead, then merge those responses below.
  if (makes.length <= 1 || models.length === 0 || selections.length === 0) return null;

  const page = Number(params.page) || 0;
  const perPage = Number(params.hitsPerPage || params.perPage) || 20;
  const branchFilters = buildMakeModelFilter(makes, selections, models);

  return branchFilters.map((branchFilter) => ({
    ...request,
    params: {
      ...params,
      facetFilters: withoutMakeOrModel,
      filters: [params.filters, branchFilter].filter(Boolean).join(" && "),
      page: 0,
      perPage: Math.max(perPage, 1) * Math.max(page, 1),
    },
  }));
}

function mergeSearchResults(results: any[], request: any, branchCount: number) {
  if (branchCount === 1) return results[0];

  const params = request.params || {};
  const page = Number(params.page) || 0;
  const perPage = Number(params.hitsPerPage || params.perPage) || 20;
  const hits = results.flatMap((result) => result.hits || []);
  const nbHits = results.reduce((total, result) => total + (result.nbHits || 0), 0);

  const facets = new Map<string, Record<string, number>>();
  results.forEach((result) => {
    Object.entries(result.facets || {}).forEach(([field, values]) => {
      const merged = facets.get(field) || {};
      Object.entries(values as Record<string, number>).forEach(([value, count]) => {
        merged[value] = (merged[value] || 0) + count;
      });
      facets.set(field, merged);
    });
  });

  return {
    ...results[0],
    nbHits,
    hits: hits.slice(page * perPage, (page + 1) * perPage),
    page,
    nbPages: Math.ceil(nbHits / perPage),
    hitsPerPage: perPage,
    facets: Object.fromEntries(facets),
  };
}

function wrapSearchClientWithMakeModelFilter(searchClient: any) {
  const originalSearch = searchClient.search.bind(searchClient);

  searchClient.search = (requests: any[]) => {
    const expandedRequests: any[] = [];
    const groups: Array<{ request: any; start: number; count: number }> = [];

    requests.forEach((request) => {
      try {
        const branches = getMakeModelBranches(request);
        if (!branches) {
          groups.push({ request, start: expandedRequests.length, count: 1 });
          expandedRequests.push(request);
          return;
        }

        groups.push({ request, start: expandedRequests.length, count: branches.length });
        expandedRequests.push(...branches);
      } catch (error) {
        console.error("[make/model filter] falling back to the original request:", error);
        groups.push({ request, start: expandedRequests.length, count: 1 });
        expandedRequests.push(request);
      }
    });

    return originalSearch(expandedRequests).then((response: any) => {
      const responseResults = Array.isArray(response)
        ? response
        : Array.isArray(response?.results)
          ? response.results
          : [];

      const normalizedResult = {
        ...(Array.isArray(response) ? {} : response),
        results: groups.map((group) =>
          mergeSearchResults(
            responseResults.slice(group.start, group.start + group.count),
            group.request,
            group.count,
          )
        ),
      };

      return normalizedResult;
    });
  };

  return searchClient;
}

export function getTypesenseClient(config: AppConfig) {
  const typesenseServerConfig = {
    apiKey: config.site.inventory_search_only_key,
    nodes: [{
      host: config.site.typesense_host,
      port: Number(config.site.typesense_port) || 443,
      protocol: config.site.typesense_protocol || "https",
    }],
    connectionTimeoutSeconds: 5,
  };

  const typesenseAdapter = new TypesenseInstantSearchAdapter({
    server: typesenseServerConfig,
    additionalSearchParameters: {
      query_by: "make,model,year_search,trim,vin,stock_no,exterior_color,body_type,vehicle_type,transmission,fuel_type",
      num_typos: "0",
      facet_by: "year,make,model,exterior_color,body_type,vehicle_type,transmission,fuel_type,location,selling_price,odometer",
    },
  });

  return {
    searchClient: wrapSearchClientWithMakeModelFilter(typesenseAdapter.searchClient),
    TYPESENSE_COLLECTION_NAME: config.site.collection,
  };
}