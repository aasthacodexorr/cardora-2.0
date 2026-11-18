"use client";

import { useAppConfig } from "@/app/providers";
import { Vehicle, PopularFeatureTag } from "@/types/vehicle";
import { useMemo } from "react";
import { parsePopularFeatures, matchPopularFeatures } from "@/utils/popularFeatures";

export { parsePopularFeatures, matchPopularFeatures };

interface PopularFeaturesProps {
  vehicle: Vehicle | Record<string, any>;
  configOverride?: {
    vehicle_default_popular_tags?: PopularFeatureTag[];
  };
}

/**
 * Dynamic icon renderer for configuration icons (SVG markup or image URL).
 */
function FeatureIcon({ icon, label }: { icon?: string; label: string }) {
  if (!icon) {
    return (
      <span className="w-5 h-5 flex items-center justify-center text-emerald-600 flex-shrink-0">
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
    );
  }

  const trimmedIcon = icon.trim();

  // If icon is raw SVG markup
  if (trimmedIcon.startsWith("<svg") || trimmedIcon.startsWith("<?xml")) {
    return (
      <span
        className="w-5 h-5 flex items-center justify-center text-gray-800 flex-shrink-0 [&>svg]:w-5 [&>svg]:h-5 [&>svg]:max-w-full [&>svg]:max-h-full"
        dangerouslySetInnerHTML={{ __html: trimmedIcon }}
        aria-hidden="true"
      />
    );
  }

  // Otherwise treat as an image URL (PNG, SVG, webp, etc.)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={trimmedIcon}
      alt={label}
      className="w-5 h-5 object-contain flex-shrink-0"
      loading="lazy"
    />
  );
}

export default function PopularFeatures({
  vehicle,
  configOverride,
}: PopularFeaturesProps) {
  const appConfig = useAppConfig();

  // Retrieve configuration tags from appConfig (or override if provided)
  const configTags = useMemo(() => {
    return (
      configOverride?.vehicle_default_popular_tags ??
      appConfig?.vehicle_default_popular_tags ??
      (appConfig as any)?.site?.vehicle_default_popular_tags ??
      []
    );
  }, [configOverride, appConfig]);

  // Selected features on vehicle
  const selectedValues = useMemo(() => {
    return parsePopularFeatures(vehicle?.popular_features);
  }, [vehicle?.popular_features]);

  // Match selected features against configuration tags
  const matchedFeatures = useMemo(() => {
    return matchPopularFeatures(selectedValues, configTags);
  }, [selectedValues, configTags]);

  // If no popular features match or empty, do not render
  if (matchedFeatures.length === 0) {
    return null;
  }

  return (
    <section className="w-full mt-8 font-sans" aria-labelledby="popular-features-heading">
      <h2
        id="popular-features-heading"
        className="text-[20px] md:text-[22px] font-semibold text-black mb-4"
      >
        Popular features
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {matchedFeatures.map((feature, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 bg-white shadow-xs hover:border-gray-300 transition-colors"
          >
            <FeatureIcon icon={feature.icon} label={feature.label} />
            <span className="text-[14px] font-medium text-gray-800 leading-snug">
              {feature.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
