
import { getEffectivePrice, isValidPriceDrop, type PriceValue } from "@/utils/pricing";

export type PriceDropProps = {
  price: PriceValue;
  specialPrice?: PriceValue;
  adjustment?: number;
  className?: string;
  formatPrice?: (price: number) => string;
};

const defaultFormatPrice = (price: number) =>
  `$${price.toLocaleString("en-CA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const PriceDrop = ({
  price,
  specialPrice,
  adjustment = 0,
  className,
  formatPrice = defaultFormatPrice,
}: PriceDropProps) => {
  const originalPrice = getEffectivePrice(price);

  if (originalPrice === null || originalPrice <= 0) {
    return null;
  }

  const hasPriceDrop = isValidPriceDrop(price, specialPrice);
  const currentPrice = (hasPriceDrop
    ? getEffectivePrice(specialPrice)
    : originalPrice) ?? originalPrice;
  const safeAdjustment = Number.isFinite(adjustment) ? adjustment : 0;

  if (!hasPriceDrop) {
    return (
      <span className={className}>
        {formatPrice(currentPrice + safeAdjustment)}
      </span>
    );
  }

  return (
    <span className="inline-flex flex-nowrap items-center justify-end gap-1">
      <span
        aria-hidden="true"
        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#00a650]"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M2 2L8 8M8 8V3.8M8 8H3.8"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <span className={className}>
        {formatPrice(currentPrice + safeAdjustment)}
      </span>

      <span className="text-[11px] font-normal text-gray-500 line-through">
        {formatPrice(originalPrice + safeAdjustment)}
      </span>
    </span>
  );
};
