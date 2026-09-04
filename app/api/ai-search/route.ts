import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { Client as TypesenseClient } from "typesense";
import { getAppConfig } from "@/lib/appConfig";

const FiltersSchema = z.object({
  make: z.array(z.string()).optional(),
  model: z.array(z.string()).optional(),
  year: z.array(z.number()).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minOdometer: z.number().optional(),
  maxOdometer: z.number().optional(),
  vehicle_type: z.array(z.string()).optional(),
  exterior_color: z.array(z.string()).optional(),
  body_type: z.array(z.string()).optional(),
  transmission: z.array(z.string()).optional(),
  fuel_type: z.array(z.string()).optional(),
  location: z.array(z.string()).optional(),
});

// The model now returns intent + a conversational reply alongside filters,
// instead of us guessing intent from "did any filter field come back set".
const AIResponseSchema = FiltersSchema.extend({
  intent: z.enum(["search", "chat"]),
  reply: z.string().optional(),
  note: z.string().optional(),
  followUp: z.string().optional(),
});

type AIResponse = z.infer<typeof AIResponseSchema>;

const PER_PAGE = 20;

type FilterField = keyof AIResponse;


const CORE_FIELDS: FilterField[] = ["make", "model"];


const RELAXATION_ORDER: FilterField[] = [
  "minOdometer",
  "maxOdometer",
  "year",
  "minPrice",
  "maxPrice",
  "location",
  "exterior_color",
  "transmission",
  "fuel_type",
  "body_type",
  "vehicle_type",
];


const DEFAULT_SORT_BY = "status_rank:asc,created_at:desc";

// Fields we'll proactively suggest the user narrow by next, if they aren't
// already set — mirrors "want to also set a budget, body style...?"
const SUGGESTION_FIELDS: { field: FilterField; label: string }[] = [
  { field: "maxPrice", label: "a budget" },
  { field: "body_type", label: "a body style (SUV/sedan)" },
  { field: "transmission", label: "a transmission (automatic/manual)" },
];

function buildFilterByStr(f: AIResponse): string {
  const parts: string[] = [];
  if (f.make?.length) parts.push(`make:=[${f.make.join(",")}]`);
  if (f.model?.length) parts.push(`model:=[${f.model.join(",")}]`);
  if (f.year?.length) parts.push(`year:=[${f.year.join(",")}]`);
  if (f.minPrice !== undefined) parts.push(`selling_price:>=${f.minPrice}`);
  if (f.maxPrice !== undefined) parts.push(`selling_price:<=${f.maxPrice}`);
  if (f.minOdometer !== undefined) parts.push(`odometer:>=${f.minOdometer}`);
  if (f.maxOdometer !== undefined) parts.push(`odometer:<=${f.maxOdometer}`);
  if (f.vehicle_type?.length) parts.push(`vehicle_type:=[${f.vehicle_type.join(",")}]`);
  if (f.exterior_color?.length) parts.push(`exterior_color:=[${f.exterior_color.join(",")}]`);
  if (f.body_type?.length) parts.push(`body_type:=[${f.body_type.join(",")}]`);
  if (f.transmission?.length) parts.push(`transmission:=[${f.transmission.join(",")}]`);
  if (f.fuel_type?.length) parts.push(`fuel_type:=[${f.fuel_type.join(",")}]`);
  if (f.location?.length) parts.push(`location:=[${f.location.join(",")}]`);
  return parts.join(" && ");
}

function humanizeFilter(field: FilterField, f: AIResponse): string | null {
  switch (field) {
    case "make":
      return f.make?.length ? f.make.join("/") : null;
    case "model":
      return f.model?.length ? f.model.join("/") : null;
    case "year":
      return f.year?.length ? `year ${f.year.join("/")}` : null;
    case "minPrice":
      return f.minPrice !== undefined ? `over $${f.minPrice.toLocaleString()}` : null;
    case "maxPrice":
      return f.maxPrice !== undefined ? `under $${f.maxPrice.toLocaleString()}` : null;
    case "minOdometer":
      return f.minOdometer !== undefined ? `over ${f.minOdometer.toLocaleString()} km` : null;
    case "maxOdometer":
      return f.maxOdometer !== undefined ? `under ${f.maxOdometer.toLocaleString()} km` : null;
    case "vehicle_type":
      return f.vehicle_type?.length ? f.vehicle_type.join("/") : null;
    case "exterior_color":
      return f.exterior_color?.length ? `${f.exterior_color.join("/")} color` : null;
    case "body_type":
      return f.body_type?.length ? f.body_type.join("/") : null;
    case "transmission":
      return f.transmission?.length ? `${f.transmission.join("/")} transmission` : null;
    case "fuel_type":
      return f.fuel_type?.length ? f.fuel_type.join("/") : null;
    case "location":
      return f.location?.length ? f.location.join("/") : null;
    default:
      return null;
  }
}

function describeFilters(f: AIResponse): string {
  const parts = ([...CORE_FIELDS, ...RELAXATION_ORDER] as FilterField[])
    .map((field) => humanizeFilter(field, f))
    .filter((x): x is string => !!x);
  return parts.length ? parts.join(", ") : "your search";
}

function joinNatural(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function roundTo(value: number, nearest: number): number {
  return Math.round(value / nearest) * nearest;
}


const WIDEN_CONFIG: Partial<Record<FilterField, { multiplier: number; roundTo: number; describe: (v: number) => string }>> = {
  maxOdometer: {
    multiplier: 2,
    roundTo: 5000,
    describe: (v) => `raised the mileage cap to ${v.toLocaleString()} km`,
  },
  maxPrice: {
    multiplier: 1.5,
    roundTo: 1000,
    describe: (v) => `raised the budget to $${v.toLocaleString()}`,
  },
};


type FacetCache = { values: Record<string, string[]>; fetchedAt: number };
const facetCacheByCollection = new Map<string, FacetCache>();
const FACET_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const FACETED_FIELDS = [
  "vehicle_type",
  "body_type",
  "transmission",
  "fuel_type",
  "exterior_color",
  "location",
  "year",
] as const;

async function getFacetValues(
  typesense: TypesenseClient,
  collection: string
): Promise<Record<string, string[]>> {
  const cached = facetCacheByCollection.get(collection);
  if (cached && Date.now() - cached.fetchedAt < FACET_CACHE_TTL_MS) {
    return cached.values;
  }

  try {
    const facetResult = await typesense
      .collections(collection)
      .documents()
      .search({
        q: "*",
        query_by: "make",
        facet_by: FACETED_FIELDS.join(","),
        per_page: 0,
      });

    const values: Record<string, string[]> = {};
    for (const field of FACETED_FIELDS) {
      const facet = facetResult.facet_counts?.find((f) => f.field_name === field);
      values[field] = facet?.counts.map((c) => String(c.value)).filter(Boolean) ?? [];
    }

    facetCacheByCollection.set(collection, { values, fetchedAt: Date.now() });
    return values;
  } catch (err) {

    console.error("AI Search Error: failed to fetch facet values", err);
    return cached?.values ?? { vehicle_type: [], body_type: [] };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      message,
      filters,
      conversation,
      loadMore,
      page: requestedPage,
      previousResultCount,  
      directFilters, 
    } = body;

    const config = await getAppConfig();
    const typesense = new TypesenseClient({
      nodes: [
        {
          host: config.site.typesense_host,
          port: Number(config.site.typesense_port) || 443,
          protocol: config.site.typesense_protocol || "https",
        },
      ],
      apiKey: config.site.inventory_search_only_key,
      connectionTimeoutSeconds: 5,
    });

    let parsedFilters: AIResponse;

    if (loadMore) {
  parsedFilters = { ...(filters || {}), intent: "search" } as AIResponse;
} else if (directFilters) {
  // Suggestion-chip search: apply exactly these filters, no LLM guessing.
  // Normalize casing against real facet values so "Sedan" vs "sedan"
  // can't silently zero out the result set.
  const facetValues = await getFacetValues(typesense, config.site.collection);
  const matchFacet = (values: string[] | undefined, list: string[]) =>
    values?.length
      ? values.map((v) => list.find((fv) => fv.toLowerCase() === v.toLowerCase()) ?? v)
      : values;

  parsedFilters = {
    ...directFilters,
    body_type: matchFacet(directFilters.body_type, facetValues.body_type ?? []),
    vehicle_type: matchFacet(directFilters.vehicle_type, facetValues.vehicle_type ?? []),
    transmission: matchFacet(directFilters.transmission, facetValues.transmission ?? []),
    fuel_type: matchFacet(directFilters.fuel_type, facetValues.fuel_type ?? []),
    exterior_color: matchFacet(directFilters.exterior_color, facetValues.exterior_color ?? []),
    location: matchFacet(directFilters.location, facetValues.location ?? []),
    intent: "search",
  } as AIResponse;
} else {
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.error("AI Search Error: OPENAI_API_KEY is not set");
        return NextResponse.json(
          { error: "AI search is not configured." },
          { status: 500 }
        );
      }

      const openai = new OpenAI({ apiKey });

      const facetValues = await getFacetValues(typesense, config.site.collection);
      const vehicleTypeValues = facetValues.vehicle_type ?? [];
      const bodyTypeValues = facetValues.body_type ?? [];
      const transmissionValues = facetValues.transmission ?? [];
      const fuelTypeValues = facetValues.fuel_type ?? [];
      const exteriorColorValues = facetValues.exterior_color ?? [];
      const locationValues = facetValues.location ?? [];
      const yearValues = facetValues.year ?? [];

      const systemPrompt = `You are an AI vehicle search assistant for Cardora.
  Your job is to understand natural language requests and, when appropriate, output structured filters to query our car inventory.

  First decide the user's intent:
  - "search": the message contains actual car-shopping criteria (make, model, year, price, body type, color, transmission, fuel type, use-case like "family SUV", "tow a trailer", etc.) — including refinements/additions/removals to the current filters.
  - "chat": the message is a greeting, small talk, a question about you, or anything with no car criteria to extract (e.g. "hi", "hey", "thanks", "how does this work?"). Do NOT treat this as a request to show all vehicles.

  Rules:
  - Only set intent to "search" if the message itself (or the conversation so far) actually specifies or changes search criteria.
  - If intent is "chat", do not modify the filters at all — omit all filter fields. Write a short, friendly "reply" (2-3 sentences max):
    - If there ARE currently active filters (see "Current Active Filters" below) and the message signals the user wants to change or move away from the current search WITHOUT saying what they want instead (e.g. "something different", "not this", "show me other options", "try something else"), explicitly restate the current active filters in plain language and ask what to change, in this style: "Sure — what would you like to change from the current {filters, e.g. 'Hybrid + under 20,000 km'} filter? Tell me a make/model, body style (SUV/sedan), budget, or drivetrain (AWD/FWD), and I'll switch the results to match." Reference the ACTUAL current filter values, not a placeholder.
    - If the message is a vague request for MORE or BROADER results WITHOUT saying which criterion to relax (e.g. "more?", "show me more", "any other options", "can you widen it"), do NOT guess and do NOT change any filters yourself. Instead, restate the current filters, then propose 1-2 CONCRETE next values for the numeric filters that are actually set (roughly double an active mileage cap, or extend an active year range back by 1-2 years — compute the actual proposed number from the current value, don't invent one), and ask which they'd prefer, in this style: "Right now you're filtered to {filters}. If you want more options, I can widen one of those — raise the mileage cap (e.g. 40,000 km) or include older years (e.g. 2021+); which would you like?" Only offer options for fields that are currently set; if nothing numeric is set to widen, ask what they'd like to relax instead.
    - Otherwise (no active filters yet, or a plain greeting/small talk), write a short, friendly reply that guides them toward giving real search criteria, with concrete varied examples across a few categories (vehicle type, budget, must-haves like drivetrain/mileage/year/features). Vary the examples naturally rather than repeating the same fixed list every time.
    - Never claim to have found or shown any vehicles in a "chat" reply.

  - If intent is "search":
    - When the message includes a VAGUE/RELATIVE qualifier that needs interpretation to become a concrete filter (e.g. "latest model", "newest", "affordable", "low mileage" with no number, "reliable"), make a reasonable concrete assumption rather than leaving it unfiltered (e.g. "latest" -> year filter for the current year and one prior, "affordable" -> a sensible maxPrice for the vehicle class). Set "note" to ONE short sentence plainly stating the assumption you made, e.g. "I interpreted 'latest' as 2023 or newer." Omit "note" when the request was already concrete (e.g. "under $30k" needs no note).
    - ALWAYS set "followUp": one short, SPECIFIC next question inviting further narrowing, tailored to what's genuinely still open given the fields NOT yet set (pick 1-2 concrete, relevant fields — e.g. body style + budget, or "tell me the oldest year you'll accept and whether you prefer SUV or sedan"). Do not repeat a generic list of every field every time; vary it and keep it relevant to what's missing.
    - Decide for EACH filter field whether the new message is a REFINEMENT (merge onto the existing value) or should be dropped/reset, instead of always merging everything forward:
    1. REFINEMENT (merge/keep): the new message adds a constraint that is compatible with what's already set, explicitly says to add/also/include something, narrows a range, or the conversation as a whole shows the user is still pursuing the same combination of criteria (e.g. "under $30k" added to an existing SUV search, "add AWD", "make it 2022 or newer", or a follow-up that clearly still wants everything discussed so far).
    2. RESET/DROP: the new message reads as a short, standalone criterion (often just a make, model, or type — e.g. "honda", "jetta", "something cheaper") that does NOT reference or build on the previously active filters. Treat this as the user pivoting to a narrower or different idea, not appending to everything said so far. When this happens, keep only what the new message itself specifies, plus any earlier filter the user explicitly and deliberately typed themselves (not one you inferred/normalized on their behalf) that is still compatible with the new message. Drop everything else, especially filters that were only ever your own inference from a vaguer earlier message (e.g. mapping "fuel-efficient, low mileage" to fuel_type/maxOdometer) — those don't outlive a pivot to a completely different, more specific criterion.
    3. This reset behavior is especially important when "Previous search result count" (below) is 0: a combination that has already returned nothing should not keep absorbing new constraints on top of itself. Treat a zero-result search as expired context — the next message should mostly stand on its own unless it explicitly references what came before ("also", "and", "still want it under 30k", etc.).
    4. If the user explicitly asks to remove/clear a filter (e.g. "any year", "remove the price limit", "no mileage limit"), clear it.
    5. If they specify a budget like 'under 50k', set maxPrice to 50000.

  - Grounding filter values in real inventory data (IMPORTANT — this is the #1 source of mismatches between this AI search and the manual filter sidebar on the inventory page):
    - The manual inventory filter page only ever lets a user pick from the ACTUAL values present in the data (it builds its checkboxes directly from Typesense facets). For this AI search to return the exact same results as the same combination applied manually, every enum-style field below MUST use one of the exact strings listed — never invent, pluralize, abbreviate, or reword a value, even if your guess seems reasonable. A value that doesn't exactly match the data causes that filter to silently match zero vehicles (or, if you leave the field unset instead, to match ALL vehicles) — both are parity bugs.
    - Valid "vehicle_type" values: ${vehicleTypeValues.length ? vehicleTypeValues.join(", ") : "(none available)"}
    - Valid "body_type" values: ${bodyTypeValues.length ? bodyTypeValues.join(", ") : "(none available)"}
    - Valid "transmission" values: ${transmissionValues.length ? transmissionValues.join(", ") : "(none available)"}
    - Valid "fuel_type" values: ${fuelTypeValues.length ? fuelTypeValues.join(", ") : "(none available)"}
    - Valid "exterior_color" values: ${exteriorColorValues.length ? exteriorColorValues.join(", ") : "(none available)"}
    - Valid "location" values: ${locationValues.length ? locationValues.join(", ") : "(none available)"}
    - Valid "year" values: ${yearValues.length ? yearValues.join(", ") : "(none available)"}
    - Two DIFFERENT fields can hold a vehicle class: "vehicle_type" and "body_type". When the user names a vehicle class (e.g. "truck", "pickup", "SUV", "sedan", "coupe", "van", "hatchback", "convertible"), match it against BOTH lists above and set whichever field(s) actually contain a matching value. If a term matches a value in only one list, set only that field. If it plausibly matches values in both lists, you may set both.
    - "location" covers dealership/branch names the user mentions (e.g. "in Brampton", "at the Guelph location") — match against the valid location values above, don't invent a location string.
    - If the user's term does not closely match any value in the relevant list, do NOT guess a made-up string — omit that field entirely and use "note" to say you couldn't find an exact match, so the user can rephrase.
    - Never leave a clearly-named field (vehicle class, color, transmission, fuel type, location) unset just because you can't find a perfect match — check for the closest reasonable match first, and only fall back to omitting + a "note" if genuinely nothing in the list is close. An empty filter here is what causes searches like "truck" to incorrectly return the entire inventory instead of the intended subset.

  - NEVER invent or promise that a specific vehicle exists. Just return the structured search filters.
  - Normalize makes (e.g. 'Mercedes' -> 'Mercedes-Benz', 'Chevy' -> 'Chevrolet'). Makes and models are not grounded against a value list in this prompt (too many to list), so rely on these normalization rules and common sense; if truly uncertain, prefer a shorter/broader value over inventing a specific trim string.
  - YOU MUST RETURN A VALID JSON OBJECT. Do not wrap it in markdown.

  JSON shape:
  {
    "intent": "search" | "chat",
    "reply": string,            // required when intent is "chat"; a short conversational reply
    "note": string,              // optional, "search" only; states any assumption made for a vague qualifier
    "followUp": string,          // optional but preferred, "search" only; one short, specific next question
    "make": string[],           // only when intent is "search" and relevant
    "model": string[],
    "year": number[],
    "minPrice": number,
    "maxPrice": number,
    "minOdometer": number,
    "maxOdometer": number,
    "vehicle_type": string[],
    "exterior_color": string[],
    "body_type": string[],
    "transmission": string[],
    "fuel_type": string[],
    "location": string[]
  }

  Current Active Filters (human-readable): ${describeFilters((filters || {}) as AIResponse)}
  Current Active Filters (raw):
  ${JSON.stringify(filters || {}, null, 2)}

  Previous search result count: ${typeof previousResultCount === "number"
          ? previousResultCount
          : "unknown (no search has run yet)"
        }
  `;

      const messages: any[] = [{ role: "system", content: systemPrompt }];

      if (conversation && conversation.length > 0) {
        messages.push(
          ...conversation.map((msg: any) => ({
            role: msg.role === "ai" ? "assistant" : "user",
            content: msg.text,
          }))
        );
      }

      messages.push({ role: "user", content: message });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const raw = JSON.parse(completion.choices[0].message.content || "{}");
      const result = AIResponseSchema.safeParse(raw);

      if (!result.success) {
        // Model didn't follow the contract — fail safe into a chat response
        // rather than silently searching with empty/garbage filters.
        console.error("AI Search Error: invalid model response", result.error, raw);
        parsedFilters = {
          intent: "chat",
          reply: "Sorry, I didn't quite catch that — what kind of car are you looking for?",
        } as AIResponse;
      } else {
        parsedFilters = result.data;
      }
    }

    // ── Chat intent: respond conversationally, no Typesense query, no results ──
    if (parsedFilters.intent === "chat") {
      return NextResponse.json({
        message: parsedFilters.reply || "What kind of car are you looking for?",
        filters: filters || {},
        results: [],
        total: 0,
        page: 1,
        hasMore: false,
        // No resultsSnapshot-worthy data: frontend only attaches a snapshot
        // when results/total actually reflect a search that ran.
        isChat: true,
      });
    }

    // Build the Typesense filter string and run the search
    const originalFilters: AIResponse = { ...parsedFilters };
    let activeFilters: AIResponse = { ...parsedFilters };
    let filterByStr = buildFilterByStr(activeFilters);


    console.log("AI Search:", {
      message: loadMore ? "(loadMore)" : message,
      parsedFilters,
      filterByStr,
    });

    // Pagination: page 1 for a fresh search, otherwise whatever page the client asked for
    const page = loadMore ? Math.max(2, Number(requestedPage) || 2) : 1;

    let searchResult = await typesense
      .collections(config.site.collection)
      .documents()
      .search({
        q: "*",
        filter_by: filterByStr,
        sort_by: DEFAULT_SORT_BY,
        per_page: PER_PAGE,
        page,
      });

    let totalHits = searchResult.found || 0;
    const relaxationSteps: string[] = [];


    if (!loadMore && totalHits === 0) {
      for (const field of RELAXATION_ORDER) {
        if (activeFilters[field] === undefined) continue;

        const widenConfig = WIDEN_CONFIG[field];
        if (widenConfig) {
          const currentValue = activeFilters[field] as number;
          const widenedValue = roundTo(currentValue * widenConfig.multiplier, widenConfig.roundTo);

          if (widenedValue > currentValue) {
            const widenAttempt: AIResponse = { ...activeFilters, [field]: widenedValue };
            const widenFilterByStr = buildFilterByStr(widenAttempt);
            const widenResult = await typesense
              .collections(config.site.collection)
              .documents()
              .search({
                q: "*",
                filter_by: widenFilterByStr,
                sort_by: DEFAULT_SORT_BY,
                per_page: PER_PAGE,
                page: 1,
              });

            activeFilters = widenAttempt;
            relaxationSteps.push(widenConfig.describe(widenedValue));
            filterByStr = widenFilterByStr;
            searchResult = widenResult;
            totalHits = widenResult.found || 0;

            if (totalHits > 0) break;
          }
        }

        // Widening (if attempted) wasn't enough — drop the field entirely.
        const attempt: AIResponse = { ...activeFilters };
        delete (attempt as any)[field];

        const attemptFilterByStr = buildFilterByStr(attempt);
        const attemptResult = await typesense
          .collections(config.site.collection)
          .documents()
          .search({
            q: "*",
            filter_by: attemptFilterByStr,
            sort_by: DEFAULT_SORT_BY,
            per_page: PER_PAGE,
            page: 1,
          });

        const removedDescription = humanizeFilter(field, activeFilters);
        activeFilters = attempt;
        relaxationSteps.push(
          removedDescription ? `removed the ${removedDescription} filter` : `removed the ${field} filter`
        );
        filterByStr = attemptFilterByStr;
        searchResult = attemptResult;
        totalHits = attemptResult.found || 0;

        if (totalHits > 0) break;
      }
    }

    const hits = searchResult.hits?.map((h) => h.document) || [];
    const hasMore = page * PER_PAGE < totalHits;
    const isFirstTurn = !conversation || conversation.length === 0;

    let aiMessage: string | undefined;
    if (!loadMore) {
      if (relaxationSteps.length > 0) {
        if (totalHits > 0) {
          aiMessage = `I couldn't find matches for ${describeFilters(
            originalFilters
          )}, so I ${joinNatural(
            relaxationSteps
          )} — showing ${totalHits} result${totalHits > 1 ? "s" : ""} instead.`;

          const suggestions = SUGGESTION_FIELDS.filter(
            (s) => activeFilters[s.field] === undefined
          )
            .slice(0, 2)
            .map((s) => s.label);
          aiMessage += ` Want to bring back what I removed, or set ${suggestions.length > 0 ? joinNatural(suggestions) : "a different budget or year range"
            }?`;
        } else {
          aiMessage =
            "I still couldn't find any vehicles even after broadening the search. Try a different make or model.";
        }
      } else if (totalHits === 0) {
        aiMessage = "I couldn't find vehicles matching those requirements. Try changing the year, price, or vehicle type.";
      } else {
        const prefix = isFirstTurn ? "Filtered to" : "Done — I've updated the search to";
        aiMessage = `${prefix} ${describeFilters(activeFilters)}.`;

        if (parsedFilters.note) {
          aiMessage += ` ${parsedFilters.note}`;
        }
        if (parsedFilters.followUp) {
          aiMessage += ` ${parsedFilters.followUp}`;
        } else {
          const suggestions = SUGGESTION_FIELDS.filter(
            (s) => activeFilters[s.field] === undefined
          )
            .slice(0, 2)
            .map((s) => s.label);
          if (suggestions.length > 0) {
            aiMessage += ` Want to also narrow by ${joinNatural(suggestions)}?`;
          }
        }
      }
    }

    return NextResponse.json({
      message: aiMessage,
      filters: activeFilters,
      results: hits,
      total: totalHits,
      page,
      hasMore,
      relaxationSteps: relaxationSteps.length > 0 ? relaxationSteps : undefined,
    });
  } catch (error: any) {
    console.error("AI Search Error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}