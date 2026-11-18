import { ManufacturerWarrantyDetail } from "@/types/vehicle";

/**
 * Safely parses manufacturer_warranty_details from various possible formats:
 * - A valid array of objects
 * - A JSON string encoding an array
 * - An empty string, empty array, or null/undefined
 */
export function parseWarrantyDetails(data: unknown): ManufacturerWarrantyDetail[] {
  if (!data) return [];

  let parsed: unknown = data;

  if (typeof data === "string") {
    const trimmed = data.trim();
    if (!trimmed || trimmed === "[]" || trimmed === '""') return [];
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      return [];
    }
  }

  if (Array.isArray(parsed)) {
    return parsed.filter(
      (item): item is ManufacturerWarrantyDetail =>
        Boolean(item && typeof item === "object")
    );
  }

  return [];
}

/**
 * Parses in_service_date Unix timestamp into a valid Date object.
 * Returns null if missing or invalid.
 */
export function parseInServiceDate(inServiceDate: unknown): Date | null {
  if (inServiceDate === null || inServiceDate === undefined || inServiceDate === "") {
    return null;
  }

  const num = Number(inServiceDate);
  if (isNaN(num) || num <= 0) return null;

  // In-service date in Unix seconds is < 1e11 (timestamp in ms is > 1e12)
  const ms = num < 1e11 ? num * 1000 : num;
  const date = new Date(ms);

  return isNaN(date.getTime()) ? null : date;
}

/**
 * Calculates warranty inclusive expiry date:
 * 1. Read years and months.
 * 2. Start from in_service_date.
 * 3. Add specified years and months using calendar date logic.
 * 4. Subtract 1 calendar day to get inclusive expiry date.
 */
export function calculateWarrantyExpiryDate(
  inServiceDate: unknown,
  years: string | number | undefined,
  months: string | number | undefined
): Date | null {
  const startDate = parseInServiceDate(inServiceDate);
  if (!startDate) return null;

  const y = Number(years) || 0;
  const m = Number(months) || 0;

  // Use UTC calendar date parts to avoid timezone & daylight-saving issues
  const startYear = startDate.getUTCFullYear();
  const startMonth = startDate.getUTCMonth();
  const startDay = startDate.getUTCDate();

  const targetYear = startYear + y;
  const targetMonth = startMonth + m;

  // Clamp day to the number of days in target month (e.g. Jan 31 + 1 mo -> Feb 28/29)
  const daysInTargetMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  const clampedDay = Math.min(startDay, daysInTargetMonth);

  const targetDate = new Date(Date.UTC(targetYear, targetMonth, clampedDay));

  // Subtract one calendar day to get the inclusive expiry date
  targetDate.setUTCDate(targetDate.getUTCDate() - 1);

  return targetDate;
}

export interface RemainingDurationResult {
  isExpired: boolean;
  durationText: string;
  diffDays: number;
}

/**
 * Calculates remaining duration between current date and expiry date in human-readable format.
 */
export function formatRemainingDuration(
  currentDate: Date,
  expiryDate: Date
): RemainingDurationResult {
  const currentUTC = Date.UTC(
    currentDate.getUTCFullYear(),
    currentDate.getUTCMonth(),
    currentDate.getUTCDate()
  );
  const expiryUTC = Date.UTC(
    expiryDate.getUTCFullYear(),
    expiryDate.getUTCMonth(),
    expiryDate.getUTCDate()
  );

  const diffMs = expiryUTC - currentUTC;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      isExpired: true,
      durationText: "has expired",
      diffDays,
    };
  }

  if (diffDays === 0) {
    return {
      isExpired: false,
      durationText: "is expected to expire today",
      diffDays,
    };
  }

  if (diffDays < 30) {
    const unit = diffDays === 1 ? "day" : "days";
    return {
      isExpired: false,
      durationText: `is expected to expire in ${diffDays} ${unit}`,
      diffDays,
    };
  }

  const months = Math.round(diffDays / 30.4375);
  const unit = months <= 1 ? "month" : "months";
  return {
    isExpired: false,
    durationText: `is expected to expire in ${months} ${unit}`,
    diffDays,
  };
}

/**
 * Check whether a warranty item has unlimited mileage.
 */
export function isUnlimitedMileage(val: unknown): boolean {
  return val === 1 || val === "1" || val === true || val === "true";
}

/**
 * Formats a warranty coverage string for display:
 * "Engine, transmission, & drivetrain is expected to expire in 8 days or 134,273 Km"
 * or "High-voltage battery is expected to expire in 8 days" (if unlimited)
 * or "Engine, transmission, & drivetrain has expired" (if expired)
 */
export function formatWarrantyCoverageText(
  detail: ManufacturerWarrantyDetail,
  inServiceDate: unknown,
  currentDate: Date = new Date()
): { text: string; isExpired: boolean } {
  const coverage = (detail.coverage || "Warranty").trim();
  const unlimited = isUnlimitedMileage(detail.is_unlimited_mileage);

  let mileageSuffix = "";
  if (!unlimited && detail.mileage_limit !== undefined && detail.mileage_limit !== null && detail.mileage_limit !== "") {
    const limit = Number(detail.mileage_limit);
    if (!isNaN(limit) && limit > 0) {
      mileageSuffix = ` or ${limit.toLocaleString("en-CA")} Km`;
    }
  }

  const expiry = calculateWarrantyExpiryDate(inServiceDate, detail.years, detail.months);

  if (!expiry) {
    // In-service date missing or invalid
    if (mileageSuffix) {
      return {
        text: `${coverage} (Coverage up to ${mileageSuffix.replace(/^ or /, "")})`,
        isExpired: false,
      };
    }
    return {
      text: coverage,
      isExpired: false,
    };
  }

  const duration = formatRemainingDuration(currentDate, expiry);

  if (duration.isExpired) {
    return {
      text: `${coverage} has expired`,
      isExpired: true,
    };
  }

  return {
    text: `${coverage} ${duration.durationText}${mileageSuffix}`,
    isExpired: false,
  };
}

export interface WarrantyGroup {
  warrantyType: string;
  items: ManufacturerWarrantyDetail[];
}

/**
 * Groups warranty detail entries by warranty_type preserving order.
 */
export function groupWarrantiesByType(
  details: ManufacturerWarrantyDetail[]
): WarrantyGroup[] {
  const groups: WarrantyGroup[] = [];
  const map = new Map<string, WarrantyGroup>();

  for (const item of details) {
    const typeName = (item.warranty_type || "Original manufacturer").trim();
    let group = map.get(typeName);
    if (!group) {
      group = { warrantyType: typeName, items: [] };
      map.set(typeName, group);
      groups.push(group);
    }
    group.items.push(item);
  }

  return groups;
}
