/* =========================
   Typesense Search Client
   ...
========================= */

import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import { AppConfig } from "@/lib/appConfig";
import {
  parseMakeModelSelections,
  readRouteState,
  modelMakeAssociations,
  getModelMakeMap,
  getModelVariants,
} from "@/lib/inventoryRouting";

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
  const canonicalModels = new Map<string, string>();
  availableModels.forEach((model) => {
    canonicalModels.set(model.toLowerCase(), model);
    const slug = model.toLowerCase().replace(/\s+/g, "-");
    if (!canonicalModels.has(slug)) {
      canonicalModels.set(slug, model);
    }
    const spaced = model.toLowerCase().replace(/-/g, " ");
    if (!canonicalModels.has(spaced)) {
      canonicalModels.set(spaced, model);
    }
  });
  const grouped = new Map<string, string[]>();

  selections.forEach(({ make, model }) => {
    const canonicalMake = canonicalMakes.get(make.toLowerCase());
    if (!canonicalMake) return;
    const canonicalModel =
      canonicalModels.get(model.toLowerCase()) ||
      canonicalModels.get(model.toLowerCase().replace(/\s+/g, "-")) ||
      canonicalModels.get(model.toLowerCase().replace(/-/g, " ")) ||
      model;
    const variants = getModelVariants(canonicalModel);
    grouped.set(canonicalMake, [...(grouped.get(canonicalMake) || []), ...variants]);
  });

  return selectedMakes.map((make) => {
    const models = grouped.get(make);
    const makeFilter = `make:=[${escapeFilterValue(make)}]`;
    if (!models?.length) return makeFilter;
    const uniqueModels = Array.from(new Set(models));
    return `${makeFilter} && model:[${uniqueModels.map((m) => `=${escapeFilterValue(m)}`).join(",")}]`;
  });
}

function getUrlMakeModelSelections() {
  if (typeof window === "undefined") return [];
  const fromModels = parseMakeModelSelections(new URLSearchParams(window.location.search).get("models") || "");
  if (fromModels.length > 0) return fromModels;

  const route = readRouteState();
  const routeModels: string[] = route.refinementList?.model || [];
  const routeMakes: string[] = route.refinementList?.make || [];
  if (routeModels.length === 0) return [];

  const modelMakeMap = getModelMakeMap();
  return routeModels.map((model) => {
    const make = modelMakeAssociations.get(model) || modelMakeMap.get(model) || routeMakes[0] || "";
    return { make, model };
  }).filter((entry) => Boolean(entry.make && entry.model));
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

function expandFacetFiltersWithModelVariants(
  facetFilters: FacetFilterEntry[] | undefined
): FacetFilterEntry[] | undefined {
  if (!facetFilters || !Array.isArray(facetFilters)) return facetFilters;
  return facetFilters.map((entry) => {
    if (typeof entry === "string") {
      if (entry.startsWith("model:")) {
        const val = normalizeFacetValue(entry.slice("model:".length));
        const variants = getModelVariants(val);
        if (variants.length > 1) {
          return variants.map((v) => `model:${v}`);
        }
      }
      return entry;
    }
    if (Array.isArray(entry)) {
      const expanded: string[] = [];
      let hadModel = false;
      entry.forEach((item) => {
        if (typeof item === "string" && item.startsWith("model:")) {
          hadModel = true;
          const val = normalizeFacetValue(item.slice("model:".length));
          const variants = getModelVariants(val);
          variants.forEach((v) => {
            const f = `model:${v}`;
            if (!expanded.includes(f)) expanded.push(f);
          });
        } else {
          expanded.push(item);
        }
      });
      return hadModel ? expanded : entry;
    }
    return entry;
  });
}

function wrapSearchClientWithMakeModelFilter(searchClient: any) {
  const originalSearch = searchClient.search.bind(searchClient);

  searchClient.search = (requests: any[]) => {
    const expandedRequests: any[] = [];
    const groups: Array<{ request: any; start: number; count: number }> = [];

    const processedRequests = requests.map((req) => {
      if (!req?.params?.facetFilters) return req;
      return {
        ...req,
        params: {
          ...req.params,
          facetFilters: expandFacetFiltersWithModelVariants(req.params.facetFilters),
        },
      };
    });

    processedRequests.forEach((request) => {
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