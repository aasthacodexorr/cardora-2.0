"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, MessageCircle, Loader, Check } from "lucide-react";
import { HitCard } from "@/components/inventory";
import { InventoryLoadMoreSkeleton } from "@/components/inventory/HitCardSkeleton";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type AISearchFilters = {
  make?: string[];
  model?: string[];
  year?: number[];
  minPrice?: number;
  maxPrice?: number;
  minOdometer?: number;
  maxOdometer?: number;
  vehicle_type?: string[];
  exterior_color?: string[];
  body_type?: string[];
  transmission?: string[];
  fuel_type?: string[];
};

// Snapshot of the results a given AI response returned, frozen at that point in time.
// Each AI message owns its own snapshot so switching between prompts never
// mutates another message's results.
type ResultsSnapshot = {
  results: any[];
  filters: AISearchFilters;
  total: number;
  page: number;
  hasMore: boolean;
};

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
  // Only AI messages that successfully returned results carry a snapshot.
  resultsSnapshot?: ResultsSnapshot;
};

// ─────────────────────────────────────────────
// Quick-start suggestion chips
// ─────────────────────────────────────────────
const SUGGESTIONS = [
  "Family SUV under $30,000",
  "Fuel-efficient hybrid, low mileage",
  "All-wheel drive for winter",
  "A truck that can tow a trailer",
  "First car for a new driver",
  "Luxury sedan with leather seats",
];

// ─────────────────────────────────────────────
// Sidebar chat (replaces filters when AI mode is on)
// ─────────────────────────────────────────────
interface AIChatSidebarProps {
  messages: Message[];
  input: string;
  loading: boolean;
  activeMessageId: string | null;
  onInputChange: (v: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onViewMessage: (messageId: string) => void;
}

export const AIChatSidebar = ({
  messages,
  input,
  loading,
  activeMessageId,
  onInputChange,
  onSubmit,
  onViewMessage,
}: AIChatSidebarProps) => {
  // Scoped ref to the messages container itself. We deliberately do NOT use
  // scrollIntoView() here — it walks up every scrollable ancestor (including
  // window) to bring the target into view, which was causing the whole page
  // to jump down whenever this sidebar mounted (e.g. switching to the AI tab).
  // Setting scrollTop directly only ever affects this div.
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Message list */}
      <div
        ref={scrollContainerRef}
        className={[
          "flex-1 min-h-0 overflow-y-auto overscroll-contain px-[15px] pt-[12px] pb-[10px] space-y-3",
          "[&::-webkit-scrollbar]:w-[5px]",
          "[&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full",
          "lg:[scrollbar-width:thin]",
        ].join(" ")}
      >
        {messages.map((msg) => {
          const isActive = msg.id === activeMessageId;
          return (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "ai" && (
                <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageCircle className="w-3.5 h-3.5 text-brand" />
                </div>
              )}
              <div
                className={`flex flex-col max-w-[88%] ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-2xl text-[13px] leading-snug ${
                    msg.role === "user"
                      ? "bg-black text-white rounded-tr-sm"
                      : "bg-gray-100 text-gray-800 rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                </div>

                {/* View / Showing-now control — only on AI messages that returned results */}
                {msg.role === "ai" && msg.resultsSnapshot && (
                  <div className="mt-1 px-1">
                    {isActive ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand">
                        <Check className="w-3 h-3" />
                        Showing now
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onViewMessage(msg.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-brand underline underline-offset-2 cursor-pointer transition-colors"
                      >
                        View results ({msg.resultsSnapshot.total})
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-2 justify-start">
            <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
              <MessageCircle className="w-3.5 h-3.5 text-brand" />
            </div>
            <div className="px-3 py-2.5 bg-gray-100 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-[15px] pb-[15px] pt-[10px] border-t border-gray-100">
        <form onSubmit={onSubmit} className="relative flex items-center">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
            }}
            placeholder="Ask anything"
            disabled={loading}
            className="w-full resize-none text-[13px] pl-3 pr-9 py-2.5 rounded-[10px] border border-gray-200 focus:outline-none focus:border-brand bg-gray-50 placeholder-gray-400 leading-snug"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 bottom-2 p-1 text-brand disabled:text-gray-300 transition-colors hover:text-brand/70"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Welcome / results panel (right column content)
// ─────────────────────────────────────────────
interface AIResultsPanelProps {
  results: any[];
  filters: AISearchFilters;
  hasSearched: boolean;
  loading: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  onSuggestionClick: (text: string) => void;
  onRemoveFilter: (key: keyof AISearchFilters, value?: any) => void;
  onLoadMore: () => void;
}

export const AIResultsPanel = ({
  results,
  filters,
  hasSearched,
  loading,
  hasMore,
  loadingMore,
  onSuggestionClick,
  onRemoveFilter,
  onLoadMore,
}: AIResultsPanelProps) => {
  // Sentinel div for auto-loading more results as the user scrolls down.
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore();
      },
      { root: null, rootMargin: "400px" }
    );

    const current = loadMoreRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore, loading, loadingMore, onLoadMore, results.length]);

  // Welcome / empty state
  if (!hasSearched && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 py-10">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mb-6">
          <MessageCircle className="w-8 h-8 text-brand" />
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
          Let me help you find a car.
        </h2>
        <p className="text-gray-500 text-base max-w-md mb-8">
          Tell me how you'll use it, your budget, must-haves — anything. Or start with one of these:
        </p>

        {/* Suggestion chips */}
        <div className="flex flex-wrap justify-center gap-3 max-w-xl">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSuggestionClick(s)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-300 text-sm text-gray-700 bg-white hover:border-brand hover:text-brand transition-colors font-medium shadow-sm"
            >
              <span className="text-brand text-xs">✦</span>
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Loading shimmer for the first page */}
      {loading && results.length === 0 && (
        <div className="flex items-center gap-3 px-5 py-8 text-gray-400 text-sm">
          <Loader className="w-4 h-4 animate-spin" />
          Searching inventory…
        </div>
      )}

      {/* No results */}
      {!loading && hasSearched && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-gray-500 font-medium">
            No vehicles matched your request.
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Try adjusting the budget, year, or vehicle type in the chat.
          </p>
        </div>
      )}

      {/* Results grid */}
      {results.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 lg:gap-0 lg:gap-y-[1px]">
            {results.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex flex-col h-full p-[9px]"
              >
                <HitCard hit={vehicle} />
              </div>
            ))}

            {/* Load-more shimmer, matching the main inventory grid's skeleton */}
            {loadingMore && <InventoryLoadMoreSkeleton />}
          </div>

          {/* Scroll sentinel — triggers onLoadMore when it enters the viewport */}
          {hasMore && !loadingMore && (
            <div ref={loadMoreRef} aria-hidden style={{ height: 1 }} />
          )}
        </>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// The main hook that drives all AI search state
// (exported so inventory page can wire it up)
// ─────────────────────────────────────────────
export function useAISearch() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "ai",
      text: "Hi! I'm here to help you find the right car. What are you looking for?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  // Which AI message's snapshot is currently displayed in the results panel.
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

  const activeMessage = messages.find((m) => m.id === activeMessageId);
  const activeSnapshot = activeMessage?.resultsSnapshot;

  // Derived view state — always reflects whichever message is "active".
  const results = activeSnapshot?.results ?? [];
  const filters = activeSnapshot?.filters ?? {};
  const hasMore = activeSnapshot?.hasMore ?? false;
  const total = activeSnapshot?.total ?? 0;

  const doSearch = async (
    userText: string,
    currentFilters: AISearchFilters,
    currentMessages: Message[],
    previousResultCount?: number
  ) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: userText,
    };
    const nextMessages = [...currentMessages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          filters: currentFilters,
          conversation: currentMessages.slice(1),
          previousResultCount,
        }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      const aiMessageId = `${Date.now()}-ai`;

      // Chat-only replies (greetings, small talk — anything with no real
      // search intent) don't carry results. Leave the results panel exactly
      // as it was — don't flip on the empty state, don't attach a snapshot,
      // don't make this message "active".
      if (data.isChat) {
        const aiMessage: Message = {
          id: aiMessageId,
          role: "ai",
          text: data.message,
        };
        setMessages([...nextMessages, aiMessage]);
      } else {
        const aiMessage: Message = {
          id: aiMessageId,
          role: "ai",
          text: data.message,
          resultsSnapshot: {
            results: data.results || [],
            filters: data.filters || {},
            total: data.total || 0,
            page: data.page || 1,
            hasMore: !!data.hasMore,
          },
        };

        setMessages([...nextMessages, aiMessage]);
        setHasSearched(true);
        // New response becomes the one shown, same as before — but now it's
        // just a pointer, so older snapshots stay intact and viewable.
        setActiveMessageId(aiMessageId);
      }
    } catch {
      setMessages([
        ...nextMessages,
        {
          id: Date.now().toString(),
          role: "ai",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loadingMore || loading || !activeMessageId || !activeSnapshot?.hasMore) return;
    setLoadingMore(true);
    const nextPage = (activeSnapshot.page || 1) + 1;
    const snapshotFilters = activeSnapshot.filters;

    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loadMore: true,
          filters: snapshotFilters,
          page: nextPage,
        }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setMessages((prev) =>
        prev.map((m) =>
          m.id === activeMessageId && m.resultsSnapshot
            ? {
                ...m,
                resultsSnapshot: {
                  ...m.resultsSnapshot,
                  results: [...m.resultsSnapshot.results, ...(data.results || [])],
                  page: data.page || nextPage,
                  hasMore: !!data.hasMore,
                  total: data.total ?? m.resultsSnapshot.total,
                },
              }
            : m
        )
      );
    } catch {
      // Silently stop trying to auto-load on error; user can re-search if needed.
      setMessages((prev) =>
        prev.map((m) =>
          m.id === activeMessageId && m.resultsSnapshot
            ? { ...m, resultsSnapshot: { ...m.resultsSnapshot, hasMore: false } }
            : m
        )
      );
    } finally {
      setLoadingMore(false);
    }
  };

  // Switch the results panel to an earlier prompt's snapshot. Pure UI
  // navigation — no fetch, no mutation of any other message or state.
  const viewMessage = (messageId: string) => {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg?.resultsSnapshot) return;
    setActiveMessageId(messageId);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;
    doSearch(input.trim(), filters, messages, activeSnapshot?.total);
  };

  const handleSuggestion = (text: string) => {
    if (loading) return;
    doSearch(text, filters, messages, activeSnapshot?.total);
  };

  const removeFilter = (key: keyof AISearchFilters, value?: any) => {
    const newFilters = { ...filters };
    if (value !== undefined && Array.isArray(newFilters[key])) {
      (newFilters[key] as any[]) = (newFilters[key] as any[]).filter((v) => v !== value);
      if ((newFilters[key] as any[]).length === 0) delete newFilters[key];
    } else {
      delete newFilters[key];
    }
    doSearch(
      "Re-run the search with the updated filters.",
      newFilters,
      messages,
      activeSnapshot?.total
    );
  };

  const reset = () => {
    setMessages([
      {
        id: "init",
        role: "ai",
        text: "Hi! I'm here to help you find the right car. What are you looking for?",
      },
    ]);
    setInput("");
    setActiveMessageId(null);
    setHasSearched(false);
  };

  return {
    messages,
    input,
    filters,
    results,
    loading,
    loadingMore,
    hasSearched,
    hasMore,
    total,
    activeMessageId,
    setInput,
    handleSubmit,
    handleSuggestion,
    removeFilter,
    loadMore,
    viewMessage,
    reset,
  };
}
