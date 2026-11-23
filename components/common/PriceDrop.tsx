
import { getEffectivePrice, isValidPriceDrop, type PriceValue } from "@/utils/pricing";

export type PriceDropProps = {
  price: PriceValue;
  specialPrice?: PriceValue;
  adjustment?: number;
  className?: string;
  formatPrice?: (price: number) => string;
  showArrow?: boolean;
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
  showArrow = true,
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
    <span className="inline-flex flex-nowrap items-center gap-1.5">
      {showArrow && (
        <span
          aria-hidden="true"
          className="inline-flex h-[20px] w-[20px] sm:h-[22px] sm:w-[22px] shrink-0 items-center justify-center rounded-full bg-[#00a650]"
        >
          <svg
            className="w-3 h-3 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="6" y1="6" x2="18" y2="18" />
            <polyline points="18 9 18 18 9 18" />
          </svg>
        </span>
      )}

      <span className={className}>
        {formatPrice(currentPrice + safeAdjustment)}
      </span>

      <span className="text-[14px] sm:text-[15px] lg:text-[16px] font-normal text-gray-500 line-through">
        {formatPrice(originalPrice + safeAdjustment)}
      </span>
    </span>
  );
};
