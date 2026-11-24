import moment from "moment";
import { ManufacturerWarrantyDetail } from "@/types/vehicle";

export interface CalculatedWarrantyDetail extends ManufacturerWarrantyDetail {
  mileage_remaining: string;
  warranty_validity_date: string;
  warranty_remaining_duration: string;
}

/**
 * Coerces value to integer safely, removing any commas or non-numeric characters.
 */
export function coerceToInteger(val: unknown): number {
  if (val === null || val === undefined || val === "") return 0;
  if (typeof val === "number") return isNaN(val) ? 0 : Math.floor(val);
  const cleaned = String(val).replace(/[^0-9-]/g, "");
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 0 : num;
}

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
 * Parses in_service_date (Unix seconds, milliseconds, or date string) into a moment object.
 */
export function parseMomentDate(val: unknown): moment.Moment {
  if (val === null || val === undefined || val === "") {
    return moment.invalid();
  }
  if (typeof val === "number") {
    return val < 1e11 ? moment.unix(val) : moment(val);
  }
  if (typeof val === "string") {
    const trimmed = val.trim();
    const num = Number(trimmed);
    if (!isNaN(num) && num > 0) {
      return num < 1e11 ? moment.unix(num) : moment(num);
    }
    return moment(trimmed);
  }
  return moment(val as any);
}

/**
 * Parses in_service_date Unix timestamp into a valid Date object.
 * Returns null if missing or invalid.
 */
export function parseInServiceDate(inServiceDate: unknown): Date | null {
  const m = parseMomentDate(inServiceDate);
  return m.isValid() ? m.toDate() : null;
}

/**
 * Exact warranty calculation formula provided by the reference platform:
 * Calculates remaining mileage, validity date, and remaining duration for each warranty item.
 */
export function getManufacturerWarranties(
  form: {
    manufacturer_warranty_details?: unknown;
    odometer?: unknown;
    in_service_date?: unknown;
    km_miles?: string;
    odometer_unit?: string;
    [key: string]: any;
  },
  referenceToday?: moment.MomentInput
): CalculatedWarrantyDetail[] {
  const parsedDetails = parseWarrantyDetails(form?.manufacturer_warranty_details);
  const manufacturer_warranties = Array.isArray(parsedDetails) ? parsedDetails : [];

  const odometer = coerceToInteger(form?.odometer);
  const in_service_date = parseMomentDate(form?.in_service_date);
  const today = referenceToday ? moment(referenceToday) : moment();
  const number_formatter = new Intl.NumberFormat("en-CA");
  const km_miles = form?.km_miles || form?.odometer_unit || "Km";

  return manufacturer_warranties.map((warranty) => {
    // Mileage Remaining
    let mileage_remaining = "";
    let warranty_remaining_duration = "";

    const isUnlimited =
      warranty?.is_unlimited_mileage === "1" ||
      warranty?.is_unlimited_mileage === 1 ||
      warranty?.is_unlimited_mileage === true ||
      warranty?.is_unlimited_mileage === "true";

    if (isUnlimited) {
      mileage_remaining = `Unlimited ${km_miles}`;
    } else {
      const mileage_limit = coerceToInteger(warranty?.mileage_limit);
      const remaining = mileage_limit - odometer;

      mileage_remaining =
        remaining > 0
          ? `${number_formatter.format(remaining)} ${km_miles}`
          : "";
    }

    // Warranty Validity Date
    let warranty_validity_date = "";

    if (form?.in_service_date && in_service_date.isValid()) {
      const years = parseInt(String(warranty?.years ?? 0), 10) || 0;
      const months = parseInt(String(warranty?.months ?? 0), 10) || 0;

      const expiry_date = in_service_date
        .clone()
        .add(years, "years")
        .add(months, "months");

      if (expiry_date.isSameOrAfter(today, "day")) {
        warranty_validity_date = expiry_date.format("MMM D, YYYY");
        if (mileage_remaining) {
          const durationText = formatRemainingDuration(
            today.toDate(),
            expiry_date.toDate()
          ).durationText;
          warranty_remaining_duration = durationText.replace(
            "is expected to expire ",
            ""
          );
        }
      }
    }

    return {
      ...warranty,
      mileage_remaining,
      warranty_validity_date,
      warranty_remaining_duration,
    };
  });
}

/**
 * Calculates warranty inclusive expiry date:
 * Starts from in_service_date and adds specified years and months.
 */
export function calculateWarrantyExpiryDate(
  inServiceDate: unknown,
  years: string | number | undefined,
  months: string | number | undefined
): Date | null {
  const m = parseMomentDate(inServiceDate);
  if (!m.isValid()) return null;

  const y = Number(years) || 0;
  const mo = Number(months) || 0;

  return m.add(y, "years").add(mo, "months").toDate();
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
 * Formats a calculated warranty coverage string for display:
 * "Engine, transmission, & drivetrain is expected to expire in 2 years or 89,273 Km"
 * or "High-voltage battery is expected to expire in 2 years or Unlimited Km"
 * or "Basic warranty has expired"
 */
export function formatWarrantyCoverageText(
  detail: ManufacturerWarrantyDetail | CalculatedWarrantyDetail,
  inServiceDate?: unknown,
  currentDate: Date = new Date(),
  odometer: unknown = 0,
  kmMiles: string = "Km"
): { text: string; isExpired: boolean } {
  const coverage = (detail.coverage || "Warranty").trim();

  // If detail already contains pre-calculated fields from getManufacturerWarranties
  const calcDetail = detail as CalculatedWarrantyDetail;
  if (
    typeof calcDetail.mileage_remaining === "string" &&
    typeof calcDetail.warranty_validity_date === "string" &&
    typeof calcDetail.warranty_remaining_duration === "string"
  ) {
    if (calcDetail.warranty_remaining_duration && calcDetail.mileage_remaining) {
      return {
        text: `${coverage} is expected to expire ${calcDetail.warranty_remaining_duration} or ${calcDetail.mileage_remaining}`,
        isExpired: false,
      };
    }

    if (calcDetail.warranty_remaining_duration) {
      return {
        text: `${coverage} is expected to expire ${calcDetail.warranty_remaining_duration}`,
        isExpired: false,
      };
    }

    if (calcDetail.mileage_remaining && !calcDetail.warranty_validity_date) {
      if (calcDetail.years || calcDetail.months) {
        return {
          text: `${coverage} has expired`,
          isExpired: true,
        };
      }
      return {
        text: `${coverage} (Coverage up to ${calcDetail.mileage_remaining})`,
        isExpired: false,
      };
    }

    return {
      text: `${coverage} has expired`,
      isExpired: true,
    };
  }

  // Fallback: Compute on-the-fly using getManufacturerWarranties formula
  const calculated = getManufacturerWarranties(
    {
      manufacturer_warranty_details: [detail],
      in_service_date: inServiceDate,
      odometer,
      km_miles: kmMiles,
    },
    currentDate
  )[0];

  if (!calculated) {
    return {
      text: coverage,
      isExpired: false,
    };
  }

  return formatWarrantyCoverageText(calculated);
}

export interface WarrantyGroup {
  warrantyType: string;
  items: (ManufacturerWarrantyDetail | CalculatedWarrantyDetail)[];
}

/**
 * Groups warranty detail entries by warranty_type preserving order.
 */
export function groupWarrantiesByType<T extends ManufacturerWarrantyDetail>(
  details: T[]
): { warrantyType: string; items: T[] }[] {
  const groups: { warrantyType: string; items: T[] }[] = [];
  const map = new Map<string, { warrantyType: string; items: T[] }>();

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
