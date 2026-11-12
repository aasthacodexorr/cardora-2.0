import type { LocationPageConfig } from "@/lib/locationPages";

export interface LocationSEOContentProps {
  data: LocationPageConfig;
}

export default function LocationSEOContent({ data }: LocationSEOContentProps) {
  const seo = data.seoContent;
  if (!seo) return null;

  const hasOverview = Boolean(seo.overview?.paragraphs && seo.overview.paragraphs.length > 0);
  const hasBenefits = Boolean(seo.keyBenefits?.items && seo.keyBenefits.items.length > 0);
  const hasTradeOffs = Boolean(seo.tradeOffs?.items && seo.tradeOffs.items.length > 0);

  return (
    <section
      aria-labelledby="location-guide-heading"
      className="w-full bg-light-gray border-t border-gray-200/50 max-w-[1550px] mx-auto px-3 lg:px-14 py-8"
    >
      <div className="bg-white rounded-2xl border border-border-standard p-6 sm:p-8 lg:p-12 shadow-2xs">
        {/* Main Guide Heading H2 */}
        <h2
          id="location-guide-heading"
          className="font-bold text-gray-900 tracking-tight mb-6 sm:mb-8"
        >
          {seo.guideHeading || `${data.city} Used Car Guide`}
        </h2>

        {/* Two-Column Section: Overview & Key Benefits (Desktop 2 cols, stacks on mobile/tablet) */}
        {(hasOverview || hasBenefits) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 mb-10">
            {/* Overview */}
            {hasOverview && (
              <div>
                <h3 className="font-bold text-gray-900 mb-4">
                  {seo.overview?.heading || "Overview"}
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  {seo.overview?.paragraphs?.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Key Benefits */}
            {hasBenefits && (
              <div>
                <h3 className="font-bold text-gray-900 mb-4">
                  {seo.keyBenefits?.heading || "Key benefits"}
                </h3>
                {seo.keyBenefits?.leadText && (
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {seo.keyBenefits.leadText}
                  </p>
                )}
                {seo.keyBenefits?.items && seo.keyBenefits.items.length > 0 && (
                  <ul className="space-y-3.5 text-gray-700 leading-relaxed">
                    {seo.keyBenefits.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand mt-2 mr-2.5 shrink-0" />
                        <div>
                          <strong className="text-gray-900 font-semibold">{item.title}: </strong>
                          <span>{item.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {seo.keyBenefits?.summary && (
                  <p className="text-gray-700 mt-5 leading-relaxed font-medium">
                    {seo.keyBenefits.summary}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Potential Trade-offs (Full Width below 2 columns) */}
        {hasTradeOffs && (
          <div>
            <h3 className="font-bold text-gray-900 mb-4">
              {seo.tradeOffs?.heading || "Potential trade-offs"}
            </h3>
            {seo.tradeOffs?.leadText && (
              <p className="text-gray-700 mb-4 leading-relaxed">
                {seo.tradeOffs.leadText}
              </p>
            )}
            {seo.tradeOffs?.items && seo.tradeOffs.items.length > 0 && (
              <ul className="space-y-3.5 text-sm text-gray-700 leading-relaxed">
                {seo.tradeOffs.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 mr-2.5 shrink-0" />
                    <div>
                      <strong className="text-gray-900 font-semibold">{item.title}: </strong>
                      <span>{item.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {seo.tradeOffs?.closingNote && (
              <p className="text-gray-700 mt-5 leading-relaxed font-medium">
                {seo.tradeOffs.closingNote}
              </p>
            )}
          </div>
        )}

        {/* Subtle placeholder when waiting for client editorial content */}
        {!hasOverview && !hasBenefits && !hasTradeOffs && (
          <div className="py-6 text-center text-gray-400 italic">
            Editorial content for {data.city} will be published shortly.
          </div>
        )}
      </div>
    </section>
  );
}
