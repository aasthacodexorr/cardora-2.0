import { AppConfig } from "@/lib/appConfig";
import type { UiState } from "instantsearch.js";

type PlainObject = Record<string, any>;

/**
 * Public URL names. Typesense field names must never be written to the URL.
 * Exported so inventoryUrls.ts (which builds links to /inventory from
 * elsewhere in the site) uses these exact same keys instead of keeping its
 * own copy — two copies had already drifted apart (year was "year" here but
 * "years" there), which silently broke the year filter on any link built
 * from that file.
 */
export const FILTER_KEYS: Record<string, string> = {
  location: "locations",
  vehicle_type: "vehicleTypes",
  year: "year",
  make: "makes",
  model: "models",
  exterior_color: "colors",
  body_type: "bodyStyles",
  transmission: "transmissions",
  fuel_type: "fuelTypes",
};

export const RANGE_KEYS: Record<string, readonly [string, string]> = {
  selling_price: ["priceLow", "priceHigh"],
  odometer: ["odometerLow", "odometerHigh"],
};

let isInternalUrlWrite = false;
let historyPatched = false;
const externalUrlListeners = new Set<() => void>();

function watchExternalUrlChanges() {
  if (historyPatched || typeof window === "undefined") return;
  historyPatched = true;

  const originalPushState = window.history.pushState.bind(window.history);
  const originalReplaceState = window.history.replaceState.bind(window.history);
  const notify = () => externalUrlListeners.forEach((listener) => listener());

  window.history.pushState = function (...args: Parameters<typeof originalPushState>) {
    const result = originalPushState(...args);
    if (!isInternalUrlWrite) notify();
    return result;
  };
  window.history.replaceState = function (...args: Parameters<typeof originalReplaceState>) {
    const result = originalReplaceState(...args);
    if (!isInternalUrlWrite) notify();
    return result;
  };
  window.addEventListener("popstate", notify);
}

const FILTER_ATTRIBUTES = Object.keys(FILTER_KEYS);
const PATH_ATTRIBUTES = [
  "year",
  "make",
  "model",
  "body_type",
  "vehicle_type",
  "exterior_color",
  "fuel_type",
  "location",
] as const;
type PathFilters = Partial<Record<(typeof PATH_ATTRIBUTES)[number], string[]>>;

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function routeValue(value: string) {
  return encodeURIComponent(slugify(value));
}

// Use hyphens instead of %20, while retaining enough information to restore
// the exact facet value. A literal hyphen becomes "--" before spaces become
// "-", so "SUV-Crossover" and "Sport Utility Vehicle" stay distinct.
export function queryValue(value: string) {
  return encodeURIComponent(value.replace(/-/g, "--").replace(/ /g, "-"));
}

function parseQueryValue(value: string) {
  return value.replace(/--/g, "\u0000").replace(/-/g, " ").replace(/\u0000/g, "-");
}

function getRangeBounds(value: unknown): [unknown, unknown] {
  if (Array.isArray(value)) return [value[0], value[1]];
  if (typeof value === "string") {
    const [low = "", high = ""] = value.split(":", 2);
    return [low, high];
  }
  return [undefined, undefined];
}

function getPathFilters(route: PlainObject): PathFilters {
  const filters: PathFilters = {};
  PATH_ATTRIBUTES.forEach((attribute) => {
    const values = route.refinementList?.[attribute] || [];
    if (values.length) filters[attribute] = values;
  });
  return filters;
}

function serializePublicUrl(route: PlainObject, pathFilters: PathFilters) {
  const params: string[] = [];
  const appended = new Set<string>();
  const appendFacet = (attribute: string) => {
    const values: string[] = route.refinementList?.[attribute] || [];
    if (!values.length || pathFilters[attribute as keyof PathFilters]?.length) return;
    params.push(`${FILTER_KEYS[attribute]}=${values.map(queryValue).join(",")}`);
    appended.add(attribute);
  };
  const appendRange = (attribute: keyof typeof RANGE_KEYS, index: 0 | 1) => {
    const [low, high] = getRangeBounds(route.range?.[attribute]);
    const value = index === 0 ? low : high;
    if (value !== undefined && value !== "") {
      params.push(`${RANGE_KEYS[attribute][index]}=${encodeURIComponent(String(value))}`);
    }
  };

  // Canonical query order, independent of the order in which filters were selected.
  appendRange("selling_price", 0);
  appendRange("odometer", 0);
  appendFacet("transmission");
  appendRange("selling_price", 1);
  appendRange("odometer", 1);
  FILTER_ATTRIBUTES.forEach((attribute) => {
    if (!appended.has(attribute)) appendFacet(attribute);
  });
  if (route.query) params.push(`q=${encodeURIComponent(route.query)}`);
  if (route.sortBy) params.push(`sort=${encodeURIComponent(route.sortBy)}`);
  // Path segments are cosmetic only — they're never parsed back out of the
  // URL text. The exact-case values that actually drive filtering always
  // come from history.state (see readRouteState), or, on a fresh/external
  // link, get derived from query params before being upgraded into a path
  // (see the bootstrap block in createInventoryRouter). That's what makes it
  // safe to lowercase-slugify them here for a clean, readable URL.
  const pathValues = (attributes: readonly (keyof PathFilters)[]) =>
    attributes
      .map((attribute) => pathFilters[attribute]?.map(routeValue).join(","))
      .filter((value): value is string => Boolean(value));
  const vehicleSegments = pathValues(["year", "make", "model", "body_type"]);
  const detailSegments = pathValues(["vehicle_type", "exterior_color", "fuel_type", "location"]);
  const path = vehicleSegments.length
    ? `/inventory/${vehicleSegments.join("-")}${detailSegments.length ? `/${detailSegments.join("-")}` : ""}`
    : detailSegments.length
      ? `/inventory/${detailSegments.join("-")}`
      : "/inventory";
  return params.length ? `${path}?${params.join("&")}` : path;
}

function readRouteState(): PlainObject {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const refinementList: PlainObject = {};
  const range: PlainObject = {};

  for (const [attribute, key] of Object.entries(FILTER_KEYS)) {
    const value = params.get(key);
    if (value) refinementList[attribute] = value.split(",").filter(Boolean).map(parseQueryValue);
  }

  for (const [attribute, [lowKey, highKey]] of Object.entries(RANGE_KEYS)) {
    const low = params.get(lowKey);
    const high = params.get(highKey);
    if (low !== null || high !== null) {
      // React InstantSearch stores a range as "low:high".
      range[attribute] = `${low || ""}:${high || ""}`;
    }
  }

  const route: PlainObject = { refinementList, range };
  const query = params.get("q");
  const sortBy = params.get("sort");
  if (query) route.query = query;
  if (sortBy) route.sortBy = sortBy;

  // The attribute of a bare path value cannot be inferred from the text alone
  // ("black", for example, could be a colour, make or model). We retain this
  // small piece of routing metadata in history state. It is never part of the
  // visible URL and supports refresh/back/forward navigation in the browser.
  const pathFilters = window.history.state?.__inventoryPathFilters as PathFilters | undefined;
  if (pathFilters && window.location.pathname.startsWith("/inventory/")) {
    PATH_ATTRIBUTES.forEach((attribute) => {
      if (pathFilters[attribute]?.length) refinementList[attribute] = pathFilters[attribute];
    });
  }

  return route;
}

export const createInventoryStateMapping = (config: AppConfig) => {
  const indexName = config.site.collection || "";
  const defaultSort = `${indexName}/sort/status_rank:asc,created_at:desc`;

  return {
    stateToRoute(uiState: UiState) {
      const state = uiState[indexName] || {};
      return {
        query: state.query || undefined,
        refinementList: state.refinementList || {},
        range: state.range || {},
        sortBy: state.sortBy && state.sortBy !== defaultSort ? state.sortBy : undefined,
      };
    },

    routeToState(routeState: PlainObject | undefined | null) {
      const route = routeState || {};
      return {
        [indexName]: {
          query: route.query || "",
          refinementList: route.refinementList || {},
          range: route.range || {},
          sortBy: route.sortBy || defaultSort,
        },
      };
    },
  };
};

export function createInventoryRouter(_config: AppConfig) {
  watchExternalUrlChanges();
  let callback: ((route: PlainObject) => void) | null = null;
  const initialRoute = readRouteState();
  let previousRoute = initialRoute;
  let pathFilters: PathFilters =
    typeof window !== "undefined"
      ? window.history.state?.__inventoryPathFilters || getPathFilters(initialRoute)
      : {};

  if (typeof window !== "undefined" && Object.keys(pathFilters).length && window.location.pathname === "/inventory") {
    isInternalUrlWrite = true;
    window.history.replaceState({ ...initialRoute, __inventoryPathFilters: pathFilters }, "", serializePublicUrl(initialRoute, pathFilters));
    isInternalUrlWrite = false;
  }

  const notify = () => {
    // Once the user leaves inventory, this router must not restore an old
    // inventory URL over the destination page's URL.
    if (!window.location.pathname.startsWith("/inventory")) return;
    const route = readRouteState();
    previousRoute = route;
    if (window.location.pathname === "/inventory") {
      pathFilters = getPathFilters(route);
    }
    callback?.(route);
  };
  externalUrlListeners.add(notify);

  return {
    read: readRouteState,

    write(nextRoute: PlainObject) {
      if (typeof window === "undefined") return;
      if (!window.location.pathname.startsWith("/inventory")) return;

      pathFilters = getPathFilters(nextRoute);

      // This only updates the address bar; it does not navigate away from the
      // already-mounted inventory page or create a page for every filter.
      const url = serializePublicUrl(nextRoute, pathFilters);
      const state = { ...nextRoute, __inventoryPathFilters: pathFilters };

      previousRoute = nextRoute;
      isInternalUrlWrite = true;
      window.history.replaceState(state, "", url);
      isInternalUrlWrite = false;
    },

    createURL(routeState: PlainObject) {
      // InstantSearch only uses this for links; write() is the canonical serializer.
      const query = routeState.query ? `?q=${encodeURIComponent(routeState.query)}` : "";
      return `${window.location.origin}/inventory${query}`;
    },

    onUpdate(nextCallback: (route: PlainObject) => void) {
      callback = nextCallback;
    },

    dispose() {
      externalUrlListeners.delete(notify);
      callback = null;
    },
  };
}