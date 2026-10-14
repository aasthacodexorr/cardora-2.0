export type PriceValue = number | string | null | undefined;

export const parsePrice = (value: PriceValue): number | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const isValidPriceDrop = (
  price: PriceValue,
  specialPrice: PriceValue,
): boolean => {
  const original = parsePrice(price);
  const special = parsePrice(specialPrice);

  return (
    original !== null &&
    original > 0 &&
    special !== null &&
    special > 0 &&
    special < original
  );
};

export const getEffectivePrice = (
  price: PriceValue,
  specialPrice?: PriceValue,
): number | null => {
  if (isValidPriceDrop(price, specialPrice)) {
    return parsePrice(specialPrice);
  }

  return parsePrice(price);
};
