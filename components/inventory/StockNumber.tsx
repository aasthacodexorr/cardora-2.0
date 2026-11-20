"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";

interface StockNumberProps {
  stockNumber?: string | number | null;
  className?: string;
}

export default function StockNumber({
  stockNumber,
  className = "",
}: StockNumberProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const value = String(stockNumber ?? "");

  useEffect(() => {
    if (copyState === "idle") return;

    const timeoutId = window.setTimeout(() => {
      setCopyState("idle");
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [copyState]);

  const copyStockNumber = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={copyStockNumber}
        disabled={!value || value === "N/A"}
        aria-label={`Copy stock number ${value}`}
        className={`cursor-pointer hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 disabled:cursor-default ${className}`}
      >
        {value}
      </button>
      {copyState !== "idle" && (
        <span
          role="status"
          aria-live="polite"
          className={copyState === "error" ? "ml-1 text-red-600" : "ml-1 text-gray-500"}
        >
          {copyState === "copied" ? "Copied" : "Unable to copy"}
        </span>
      )}
    </>
  );
}
