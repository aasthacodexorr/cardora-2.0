/* =========================
   Inventory Routing
   Custom InstantSearch router + stateMapping that read/write
   the URL format required by the client:

   /inventory/?{collection_id}%2Fsort%2F{default_sort}%5Bquery%5D=HONDA
   &{collection_id}%2Fsort%2F{default_sort}%5BrefinementList%5D%5Blocation%5D%5B0%5D=Cardora Brampton

   i.e. every InstantSearch param key gets the literal prefix
   "{collection_id}/sort/{default_sort}" stuck in front of it
   (urlencoded), repeated on every single query param.

   This file exports a `history()`-style custom router (via
   instantsearch.js's createInfiniteHitsSessionStorageCache-free
   plain router object) and a stateMapping, both meant to be
   passed to <InstantSearch routing={{ router, stateMapping }} />.
========================= */

import { appConfig } from "@/lib/appConfig";
import { TYPESENSE_COLLECTION_NAME } from "@/lib/typesense";
import type { UiState } from "instantsearch.js";

const COLLECTION_ID = appConfig.site.collection || "";
const DEFAULT_SORT = "status_rank:asc,created_at:desc";

// The constant, literal prefix glued onto every param key, decoded form.
// e.g. "07cb7c095c0cf712732a976016079e19/sort/status_rank:asc,created_at:desc"
const PREFIX = `${COLLECTION_ID}/sort/${DEFAULT_SORT}`;

/* -------------------------------------------------------
   Helpers to turn a nested object into bracketed query keys
   and back, e.g.
     { refinementList: { location: ["A","B"] }, query: "honda" }
   <->
     PREFIX[refinementList][location][0]=A
     PREFIX[refinementList][location][1]=B
     PREFIX[query]=honda
------------------------------------------------------- */

type PlainObject = Record<string, any>;

// Recursively flatten an object into [bracketPath, value][] pairs.
// bracketPath does NOT include the leading PREFIX, e.g. "[query]" or
// "[refinementList][location][0]".
function flatten(obj: PlainObject, prefix = ""): Array<[string, string]> {
  const out: Array<[string, string]> = [];

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const path = `${prefix}[${key}]`;

    if (value === undefined || value === null || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (item === undefined || item === null || item === "") return;
        out.push([`${path}[${i}]`, String(item)]);
      });
    } else if (typeof value === "object") {
      out.push(...flatten(value, path));
    } else {
      out.push([path, String(value)]);
    }
  });

  return out;
}

// Parse a flat list of [bracketPath, value] (bracketPath like
// "[refinementList][location][0]") back into a nested object.
function unflatten(pairs: Array<[string, string]>): PlainObject {
  const root: PlainObject = {};

  pairs.forEach(([path, value]) => {
    // path looks like: [refinementList][location][0]
    const keys = Array.from(path.matchAll(/\[([^\]]*)\]/g)).map((m) => m[1]);
    if (keys.length === 0) return;

    let node = root;
    keys.forEach((key, idx) => {
      const isLast = idx === keys.length - 1;
      const nextKey = keys[idx + 1];
      const nextIsArrayIndex = nextKey !== undefined && /^\d+$/.test(nextKey);

      if (isLast) {
        // If key is a numeric index, the parent should be an array.
        if (/^\d+$/.test(key)) {
          if (!Array.isArray(node)) {
            // shouldn't normally happen, but guard anyway
            return;
          }
          node[Number(key)] = value;
        } else {
          node[key] = value;
        }
      } else {
        const containerKeyIsIndex = /^\d+$/.test(key);
        if (containerKeyIsIndex) {
          if (!Array.isArray(node)) return;
          const idxNum = Number(key);
          if (node[idxNum] === undefined) {
            node[idxNum] = nextIsArrayIndex ? [] : {};
          }
          node = node[idxNum];
        } else {
          if (node[key] === undefined) {
            node[key] = nextIsArrayIndex ? [] : {};
          }
          node = node[key];
        }
      }
    });
  });

  return root;
}

/* -------------------------------------------------------
   stateMapping: translates between InstantSearch's internal
   uiState and the "route state" object the router persists.

   Route state shape (per index):
   {
     query?: string,
     refinementList?: Record<string, string[]>,
     range?: Record<string, string>, // "min:max"
   }
------------------------------------------------------- */

export const inventoryStateMapping = {
  stateToRoute(uiState: UiState) {
    const indexState = uiState[TYPESENSE_COLLECTION_NAME] || {};
    const route: PlainObject = {};

    if (indexState.query) {
      route.query = indexState.query;
    }
    if (indexState.refinementList && Object.keys(indexState.refinementList).length) {
      route.refinementList = indexState.refinementList;
    }
    if (indexState.range && Object.keys(indexState.range).length) {
      route.range = indexState.range;
    }

    // ONLY add sortBy if it's different from the default
    // This prevents the default sort from being written to the URL on initial load
    if (indexState.sortBy && indexState.sortBy !== `${TYPESENSE_COLLECTION_NAME}/sort/status_rank:asc,created_at:desc`) {
      route.sortBy = indexState.sortBy;
    }
 

    return route;
  },

  routeToState(routeState: PlainObject | undefined | null) {
    // Always return explicit values (never "leave as-is") so that
    // navigating to a URL with fewer/no params actually clears any
    // refinements/query left over from a previous route, instead of
    // InstantSearch merging and keeping stale state around.
    // routeState can be undefined/null (e.g. called before any route has
    // been read yet, or with an empty URL) - treat that as "no params".
    const safeRouteState = routeState || {};

    const indexState: PlainObject = {
      query: safeRouteState.query || "",
      refinementList: safeRouteState.refinementList || {},
      range: safeRouteState.range || {},
      // Don't set default sortBy from URL - only use it if it's explicitly in the URL
      sortBy: safeRouteState.sortBy || `${TYPESENSE_COLLECTION_NAME}/sort/status_rank:asc,created_at:desc`,
    };

    return {
      [TYPESENSE_COLLECTION_NAME]: indexState,
    };
  },
};

/* -------------------------------------------------------
   router: a minimal custom history-based router compatible
   with InstantSearch's `routing.router` API:
     - read(): RouteState
     - write(routeState): void
     - createURL(routeState): string
     - onUpdate(callback): void
     - dispose(): void
------------------------------------------------------- */

// Track if we just navigated to a clean inventory URL from the nav
let preserveCleanUrl = false;

export function setPreserveCleanInventoryUrl() {
  preserveCleanUrl = true;
}

function parseUrlToRouteState(): PlainObject {
  if (typeof window === "undefined") return {};

  const search = window.location.search.replace(/^\?/, "");
  
  // If URL has no query params, return clean state
  if (!search) {
    return {};
  }

  const rawPairs = search.split("&").filter(Boolean);
  const encodedPrefix = encodeURIComponent(PREFIX);

  const matchingPairs: Array<[string, string]> = [];

  rawPairs.forEach((pair) => {
    const eqIdx = pair.indexOf("=");
    const rawKey = eqIdx === -1 ? pair : pair.slice(0, eqIdx);
    const rawValue = eqIdx === -1 ? "" : pair.slice(eqIdx + 1);

    // rawKey looks like: {encodedPrefix}%5Bquery%5D
    // or decoded already in some browsers: {PREFIX}[query]
    let bracketPath: string | null = null;

    if (rawKey.startsWith(encodedPrefix)) {
      bracketPath = decodeURIComponent(rawKey.slice(encodedPrefix.length));
    } else if (rawKey.startsWith(PREFIX)) {
      bracketPath = rawKey.slice(PREFIX.length);
    } else {
      // also handle the case where the whole key is already decoded
      try {
        const decodedKey = decodeURIComponent(rawKey);
        if (decodedKey.startsWith(PREFIX)) {
          bracketPath = decodedKey.slice(PREFIX.length);
        }
      } catch {
        // ignore malformed component
      }
    }

    if (bracketPath === null) return;

    let value: string;
    try {
      value = decodeURIComponent(rawValue.replace(/\+/g, " "));
    } catch {
      value = rawValue;
    }

    matchingPairs.push([bracketPath, value]);
  });

  return unflatten(matchingPairs);
}

// Deeply sorts object keys and array values so two route states that are
// semantically identical (but built in a different order) serialize to
// the same JSON string for comparison purposes.
function normalizeRouteState(value: any): any {
  if (Array.isArray(value)) {
    return value.map(normalizeRouteState).sort();
  }
  if (value && typeof value === "object") {
    const out: PlainObject = {};
    Object.keys(value)
      .sort()
      .forEach((key) => {
        const normalized = normalizeRouteState(value[key]);
        // Treat empty string/object/array the same as "absent" so e.g.
        // {query: ""} matches {} - both mean "no query in the URL".
        const isEmpty =
          normalized === "" ||
          normalized === undefined ||
          normalized === null ||
          (typeof normalized === "object" && Object.keys(normalized).length === 0);
        if (!isEmpty) {
          out[key] = normalized;
        }
      });
    return out;
  }
  return value;
}

function routeStateToSearch(routeState: PlainObject): string {
  const pairs = flatten(routeState);
  if (pairs.length === 0) return "";

  const encodedPrefix = encodeURIComponent(PREFIX);

  const parts = pairs.map(([bracketPath, value]) => {
    const encodedPath = bracketPath
      .replace(/\[/g, "%5B")
      .replace(/\]/g, "%5D");
    return `${encodedPrefix}${encodedPath}=${encodeURIComponent(value)}`;
  });

  return parts.join("&");
}

// Module-level flag: true only while OUR OWN write() is in the middle of
// calling history.pushState. Lets the patched history methods below tell
// "we changed the URL" apart from "something else (e.g. Next.js <Link>
// navigation) changed the URL".
let isInternalWrite = false;

// We only want to patch history.pushState/replaceState ONCE per page,
// no matter how many times createInventoryRouter() runs (e.g. on every
// remount). A set of listener callbacks is notified on every call.
let historyPatched = false;
const externalChangeListeners = new Set<() => void>();

function ensureHistoryPatched() {
  if (historyPatched || typeof window === "undefined") return;
  historyPatched = true;

  const originalPushState = window.history.pushState.bind(window.history);
  const originalReplaceState = window.history.replaceState.bind(window.history);

  window.history.pushState = function patchedPushState(...args: Parameters<typeof originalPushState>) {
    const result = originalPushState(...args);
    if (!isInternalWrite) {
      externalChangeListeners.forEach((cb) => cb());
    }
    return result;
  };

  window.history.replaceState = function patchedReplaceState(
    ...args: Parameters<typeof originalReplaceState>
  ) {
    const result = originalReplaceState(...args);
    if (!isInternalWrite) {
      externalChangeListeners.forEach((cb) => cb());
    }
    return result;
  };

  // Back/forward browser navigation
  window.addEventListener("popstate", () => {
    externalChangeListeners.forEach((cb) => cb());
  });
}

export function createInventoryRouter() {
  let writeTimer: ReturnType<typeof setTimeout> | null = null;
  let updateCallback: ((route: PlainObject) => void) | null = null;
  let lastSearch = typeof window !== "undefined" ? window.location.search : "";

  ensureHistoryPatched();

  const onExternalChange = () => {
    if (typeof window === "undefined") return;
    if (window.location.search === lastSearch) return;
    lastSearch = window.location.search;
     if (updateCallback) {
    updateCallback(parseUrlToRouteState());
  }
  };

  externalChangeListeners.add(onExternalChange);

  return {
    read(): PlainObject {
      return parseUrlToRouteState();
    },

    write(routeState: PlainObject) {
      if (typeof window === "undefined") return;

      if (writeTimer) clearTimeout(writeTimer);

      writeTimer = setTimeout(() => {
        const search = routeStateToSearch(routeState);
        const newSearch = search ? `?${search}` : "";

        // No-op if the URL wouldn't actually change. Compare normalized
        // (parsed) route state rather than raw strings, since key
        // ordering can differ between an externally-set URL and the one
        // we'd generate for an equivalent state - a naive string compare
        // would falsely detect a "change" and rewrite the URL anyway,
        // causing a visible flicker.
        const currentRouteState = parseUrlToRouteState();
        const isSameState =
          JSON.stringify(normalizeRouteState(currentRouteState)) ===
          JSON.stringify(normalizeRouteState(routeState));

        if (isSameState) {
          lastSearch = window.location.search;
          return;
        }

        const newUrl = `${window.location.pathname}${newSearch}`;
        if (newSearch === window.location.search) {
          return;
        }

        lastSearch = newSearch;

        isInternalWrite = true;
        console.count("history.write");
        window.history.replaceState(routeState, "", newUrl);
        isInternalWrite = false;
      }, 150); 
    },

    createURL(routeState: PlainObject): string {
      if (typeof window === "undefined") return "";
      const search = routeStateToSearch(routeState);
      return `${window.location.origin}${window.location.pathname}${search ? `?${search}` : ""}`;
    },

    onUpdate(callback: (route: PlainObject) => void) {
      updateCallback = callback;
    },

    dispose() {
      if (writeTimer) clearTimeout(writeTimer);
      externalChangeListeners.delete(onExternalChange);
    },
  };
}