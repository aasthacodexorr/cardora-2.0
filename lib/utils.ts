/* =========================
   cn() Utility
   Merges Tailwind CSS class names using
   clsx (conditional classes) and tailwind-merge
   (deduplication of conflicting Tailwind utilities).
   Used throughout the component library.
========================= */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class values and resolves
 * Tailwind conflicts via tailwind-merge.
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-green-500", "px-6")
 * // → "py-2 bg-green-500 px-6"  (px-4 overridden by px-6)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
