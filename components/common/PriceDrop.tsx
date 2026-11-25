import Image from "next/image";
import priceDropIcon from "@/assets/icons/price-drop.png";
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
    <span className="inline-flex flex-nowrap items-center gap-2">
      {showArrow && (
        <span
          aria-hidden="true"
          className="relative inline-flex h-4 w-3 shrink-0 items-center"
        >
          <Image
            src={priceDropIcon}
            alt=""
            width={29}
            height={28}
            unoptimized
            className="absolute left-1/2 top-1/2 min-w-[40px] -translate-x-1/2 -translate-y-1/2"
          />
        </span>
      )}

      <span className={className}>
        {formatPrice(currentPrice + safeAdjustment)}
      </span>

      <span className="text-[13px] mt-1 font-normal text-gray-500 line-through">
        {formatPrice(originalPrice + safeAdjustment)}
      </span>
    </span>
  );
};
