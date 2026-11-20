"use client";

import { useEffect, useState, useMemo } from "react";
import type { ReactNode } from "react";
import { Vehicle } from "@/types/vehicle";
import {
  getManufacturerWarranties,
  groupWarrantiesByType,
  formatWarrantyCoverageText,
} from "@/utils/warranty";

function renderEmphasizedWarrantyText(
  text: string,
  values: (string | undefined)[]
): ReactNode[] {
  const ranges = [...new Set(values.filter((value): value is string => Boolean(value)))]
    .map((value) => {
      const start = text.indexOf(value);
      return start === -1 ? null : { start, end: start + value.length };
    })
    .filter((range): range is { start: number; end: number } => range !== null)
    .sort((a, b) => a.start - b.start || b.end - a.end);

  const nonOverlappingRanges: typeof ranges = [];
  for (const range of ranges) {
    if (
      nonOverlappingRanges.length === 0 ||
      range.start >= nonOverlappingRanges[nonOverlappingRanges.length - 1].end
    ) {
      nonOverlappingRanges.push(range);
    }
  }

  const parts: ReactNode[] = [];
  let cursor = 0;

  for (const [index, range] of nonOverlappingRanges.entries()) {
    if (range.start > cursor) {
      parts.push(text.slice(cursor, range.start));
    }
    parts.push(
      <strong key={`emphasis-${index}`} className="font-semibold text-gray-900">
        {text.slice(range.start, range.end)}
      </strong>
    );
    cursor = range.end;
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return parts;
}

interface WarrantyStatusProps {
  vehicle: Vehicle | Record<string, any>;
}

export default function WarrantyStatus({ vehicle }: WarrantyStatusProps) {
  // 1. Feature toggle check: show only for enabled manufacturer warranty details
  const warrantyFlag = vehicle?.show_manufacturer_warranty_details;
  const isEnabled =
    warrantyFlag === true ||
    warrantyFlag === "true" ||
    warrantyFlag === 1 ||
    warrantyFlag === "1";

  // Hydration-safe date calculation with periodic update on date change
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  useEffect(() => {
    // Sync with client-side date on mount
    setCurrentDate(new Date());

    // Schedule update at midnight when the calendar date changes
    const now = new Date();
    const tomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      1
    );
    const msUntilTomorrow = Math.max(1000, tomorrow.getTime() - now.getTime());

    const timer = setTimeout(() => {
      setCurrentDate(new Date());
    }, msUntilTomorrow);

    return () => clearTimeout(timer);
  }, []);

  // 2. Calculate manufacturer warranties using the exact platform formula
  const calculatedWarranties = useMemo(() => {
    if (!isEnabled) return [];
    return getManufacturerWarranties(vehicle, currentDate);
  }, [isEnabled, vehicle, currentDate]);

  if (!isEnabled || calculatedWarranties.length === 0) {
    return null;
  }

  // 3. Group by warranty_type
  const groups = groupWarrantiesByType(calculatedWarranties);

  return (
    <section className="w-full mt-8 font-sans" aria-labelledby="warranty-status-heading">
      <h2
        id="warranty-status-heading"
        className="text-[20px] md:text-[22px] font-semibold text-black mb-4"
      >
        Warranty status
      </h2>

      <div className="border border-gray-200 rounded-2xl bg-white p-5 md:p-6 shadow-sm">
        <div className="space-y-6">
          {groups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-3">
              <h3 className="text-base md:text-[17px] font-semibold text-gray-900">
                {group.warrantyType}
              </h3>

              <ul className="space-y-2.5">
                {group.items.map((item, itemIdx) => {
                  const { text, isExpired } = formatWarrantyCoverageText(item);

                  return (
                    <li
                      key={itemIdx}
                      className="flex items-start gap-2.5 text-[14px] md:text-[15px] text-gray-700"
                    >
                      <span
                        className={`flex-shrink-0 mt-0.5 ${
                          isExpired ? "text-gray-400" : "text-emerald-600"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span suppressHydrationWarning className="leading-snug">
                        {renderEmphasizedWarrantyText(text, [
                          (item.coverage || "Warranty").trim(),
                          item.warranty_remaining_duration,
                          item.mileage_remaining,
                        ])}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
