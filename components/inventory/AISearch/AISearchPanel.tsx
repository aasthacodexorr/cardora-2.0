"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, MessageCircle, Loader, Check } from "lucide-react";
import { HitCard } from "@/components/inventory";
import { InventoryLoadMoreSkeleton } from "@/components/inventory/HitCardSkeleton";
import logo from "@/assets/brand/logo.jpg";
import adlogo from "@/assets/icons/ad-card-3.jpg"

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
 
const CAROUSEL_VISIBLE_DOTS = 7;
const CAROUSEL_DOT_SLOT = 12; // px per dot "slot" (dot + gap), tune to taste

interface MobileResultsCarouselProps {
  results: any[];
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

const MobileResultsCarousel = ({
  results,
  loadingMore,
  hasMore,
  onLoadMore,
}: MobileResultsCarouselProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
 
  useEffect(() => {
    setActiveIndex(0);
    trackRef.current?.scrollTo({ left: 0 });
  }, [results]);

  // Figure out which card is centered as the user swipes.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const { scrollLeft, clientWidth } = track;
        if (!clientWidth) return;
        const idx = Math.round(scrollLeft / clientWidth);
        setActiveIndex((prev) => {
          const next = Math.max(0, Math.min(idx, results.length - 1));
          return prev === next ? prev : next;
        });
      });
    };
    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(raf);
    };
  }, [results.length]);

  // Prefetch more results as the user approaches the end of the carousel.
  useEffect(() => {
    if (hasMore && !loadingMore && results.length > 0 && activeIndex >= results.length - 2) {
      onLoadMore();
    }
  }, [activeIndex, results.length, hasMore, loadingMore, onLoadMore]);

  // Keep the active dot scrolled into the visible dot window.
  useEffect(() => {
    const dot = dotsRef.current?.children[activeIndex] as HTMLElement | undefined;
    dot?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeIndex]);

  const goToIndex = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
  };

  if (results.length === 0) return null;

  return (
    <div className="sm:hidden">
      {/* Card track — one full-width card per swipe, native scroll-snap */}
      <div
        ref={trackRef}
        className={[
          "flex overflow-x-auto snap-x snap-mandatory scroll-smooth",
          "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
        ].join(" ")}
      >
        {results.map((vehicle) => (
          <div key={vehicle.id} className="shrink-0 w-full snap-center px-[9px]">
            <HitCard hit={vehicle} />
          </div>
        ))}

        {loadingMore && (
          <div className="shrink-0 w-full snap-center px-[9px]">
            <InventoryLoadMoreSkeleton />
          </div>
        )}
      </div>
 
      {results.length > 1 && (
        <div
          ref={dotsRef}
          className={[
            "flex items-center gap-1.5 overflow-x-auto py-3 mx-auto",
            "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
          ].join(" ")}
          style={{ maxWidth: CAROUSEL_VISIBLE_DOTS * CAROUSEL_DOT_SLOT }}
        >
          {results.map((vehicle, i) => (
            <button
              key={vehicle.id}
              type="button"
              aria-label={`Go to result ${i + 1} of ${results.length}`}
              onClick={() => goToIndex(i)}
              className={[
                "shrink-0 rounded-full cursor-pointer transition-all duration-200",
                i === activeIndex ? "w-2.5 h-2.5 bg-brand" : "w-1.5 h-1.5 bg-gray-300",
              ].join(" ")}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Sidebar chat (replaces filters when AI mode is on)
// ─────────────────────────────────────────────
interface AIChatSidebarProps {
  messages: Message[];
  input: string;
  loading: boolean;
  loadingMore: boolean;
  hasSearched: boolean;
  activeMessageId: string | null;
  onInputChange: (v: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onViewMessage: (messageId: string) => void;
  onSuggestionClick: (text: string) => void;
  onLoadMore: () => void;
}

export const AIChatSidebar = ({
  messages,
  input,
  loading,
  loadingMore,
  hasSearched,
  activeMessageId,
  onInputChange,
  onSubmit,
  onViewMessage,
  onSuggestionClick,
  onLoadMore,
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
    <div className="flex flex-col min-h-0 flex-1 mt-0 sm:mb-0">
      {/* Fixed Clutch Assistant Header */}
      <div className="shrink-0 bg-white border-b border-gray-200 px-0 py-0">
        <div className="flex items-center gap-">
          {/* Assistant icon */}
          <div className="w-20 h-20 flex justify-center items-center">
            <img src={adlogo?.src} />
          </div>

          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold text-gray-900 leading-tight">
              Cardora Assistant
            </h3>

            <p className="text-[12px] text-gray-500 leading-[12px] mt-0.5">
              Describe the car you're looking for
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable messages */}
      <div
        ref={scrollContainerRef}
        className={[
          "flex-1 min-h-0 overflow-y-auto overscroll-contain px-[15px] pt-[15px] pb-[15px] space-y-3",
          "[&::-webkit-scrollbar]:w-[5px]",
          "[&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full",
          "lg:[scrollbar-width:thin]",
        ].join(" ")}
      >
        {messages.map((msg) => {
          const isActive = msg.id === activeMessageId;
          return (
            <div key={msg.id} className="space-y-2">
              <div
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex flex-col max-w-[88%] ${msg.role === "user" ? "items-end" : "items-start"
                    }`}
                >
                  <div
                    className={`px-3 py-2 rounded-2xl text-[15px] leading-snug ${msg.role === "user"
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
 
              {msg.role === "ai" && msg.resultsSnapshot && isActive && (
                <div className="-mx-[15px]">
                  <MobileResultsCarousel
                    results={msg.resultsSnapshot.results}
                    loadingMore={loadingMore}
                    hasMore={msg.resultsSnapshot.hasMore}
                    onLoadMore={onLoadMore}
                  />
                </div>
              )}
            </div>
          );
        })}
 
        {messages.length === 1 && !hasSearched && !loading && (
          <div className="sm:hidden flex flex-col gap-2 mt-5">
            <p className="text-gray-600 font-semibold text-sm">Or start with one of these</p>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSuggestionClick(s)}
                className="flex items-center gap-1 px-3 py-1.5 w-fit rounded-full border border-gray-200 text-[12px] text-gray-700 bg-white hover:border-brand hover:text-brand transition-colors font-medium cursor-pointer"
              >
                <span className="text-brand text-[10px]">✦</span>
                {s}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex gap-2 justify-start">
            <div className="px-3 py-2.5 bg-gray-100 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
      </div>

      {/* Input — fixed at bottom within the modal */}
      <div className="shrink-0 px-[15px] pt-[15px] pb-[max(15px,env(safe-area-inset-bottom))] border-t border-gray-200 bg-white">
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
            className="w-full resize-none text-[15px] pl-3 pr-9 py-2.5 rounded-[10px] border border-gray-200 focus:outline-none focus:border-brand bg-gray-50 placeholder-gray-400 leading-snug"
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
// Welcome / results panel (right column content — DESKTOP ONLY now that
// mobile renders its results inline inside AIChatSidebar above)
// ─────────────────────────────────────────────
interface AIResultsPanelProps {
  results: any[];
  filters: AISearchFilters;
  hasSearched: boolean;
  loading: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  total: number;
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
  total,
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
        <div className="w-40 h-auto bg-red-500">
          <img src={logo?.src} />
        </div>

        <h2 className="text-5xl font-bold text-gray-900 mb-3 tracking-tight">
          Let me help you find a car.
        </h2>
        <p className="text-gray-500 text-md mb-8">
          Tell me how you'll use it, your budget, must-haves — anything. Or start with <br /> one of these:
        </p>

        {/* Suggestion chips */}
        <div className="flex flex-wrap justify-center gap-3 max-w-xl">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSuggestionClick(s)}
              className="flex items-center gap-1.5 px-4.5 py-3 rounded-full border border-gray-300 text-base text-gray-700 bg-white hover:border-brand hover:text-brand transition-colors font-medium shadow-sm"
            >
              <span className="text-brand text-sm">✦</span>
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[60vh]">
      {/* Loading state */}
      {loading ? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <Loader className="w-8 h-8 text-brand animate-spin" />
          </div>
        </div>
      ) : (
        <>
          {/* Welcome / empty state */}

          {/* No results */}
          {hasSearched && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-gray-500 font-medium">
                No vehicles matched your request.
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting the budget, year, or vehicle type in the chat.
              </p>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <>
              <div className="hidden lg:flex items-center px-5 py-3 text-base font-medium text-gray-700">
                <span>{total} matching vehicles found</span>
              </div>

              <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 lg:gap-0 lg:gap-y-[1px]">
                {results.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex flex-col h-full px-[14px] py-[10px]"
                  >
                    <HitCard hit={vehicle} />
                  </div>
                ))}

                {loadingMore && <InventoryLoadMoreSkeleton />}
              </div>

              {hasMore && !loadingMore && (
                <div ref={loadMoreRef} aria-hidden style={{ height: 1 }} />
              )}
            </>
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
