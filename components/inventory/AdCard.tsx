"use client";
import AdCard1 from '@/assets/icons/ad-card-1.jpg'
import AdCard2 from '@/assets/icons/ad-card-2.jpg'
import AdCard3 from '@/assets/icons/ad-card-3.jpg'


const CardShell = ({
  onClick,
  className = "",
  children,
}: {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    onClick={onClick}
    className={`block h-full min-h-[420px] rounded-[20px] cursor-pointer p-[2px] overflow-hidden flex flex-col border border-border-standard ${className}`}
  >
    {children}
  </div>
);

/* -------------------------------------------------------------------------
   1) Finance ad — Carvana-style wordmark, green theme, links to Finance page
------------------------------------------------------------------------- */
export const FinanceAdCard = () => {
  const financeUrl = `/financing`;

  return (
    <CardShell
      onClick={() => {
        window.location.href = financeUrl;
      }}
      className="bg-white text-[#0B1A30] justify-center items-center gap-4 px-6 py-8 text-center border border-gray-200 rounded-2xl shadow-sm"
    >
      {/* Top Graphic/Image */}
      <img
        src={AdCard1?.src}
        alt="Finance Illustration"
        className="w-44 h-auto mx-auto mb-2"
      />

      {/* Heading */}
      <h3 className="text-[22px] font-bold tracking-tight text-[#051329]">
        Finance with Cardora
      </h3>

      {/* Subtext */}
      <p className="text-[14px] text-gray-500 leading-snug max-w-[240px] mx-auto">
        Real, personalized financing terms in less than 2 minutes, with no hit
        to your credit.
      </p>

      {/* Call to Action Button */}
      <span className="mt-2 inline-block rounded-lg bg-brand text-white text-[14px] px-6 py-2.5 hover:opacity-90 transition-opacity transition-colors cursor-pointer">
        Get Pre-Qualified
      </span>
    </CardShell>
  );
};
/* -------------------------------------------------------------------------
   2) Trade-In ad — links to Trade-In page
------------------------------------------------------------------------- */
export const TradeInAdCard = () => {
  const tradeInUrl = "/trade-in-my-car";

  return (
    <CardShell
      onClick={() => {
        window.location.href = tradeInUrl;
      }}
      className="bg-white text-[#0B1A30] justify-center items-center gap-4 px-6 py-8 text-center border border-gray-200 rounded-2xl shadow-sm"
    >
      {/* Graphic / Image */}
      <img
        src={AdCard2?.src}
        alt="Trade in your car"
        className="w-48 h-auto mx-auto mb-2"
      />

      {/* Heading */}
      <h3 className="text-[22px] font-bold tracking-tight text-[#051329]">
        Trade in your car
      </h3>

      {/* Subtext */}
      <p className="text-[14px] text-gray-500 leading-snug max-w-[240px] mx-auto">
        Get a real offer in less than 2 minutes. Sell, trade or track your value.
      </p>

      {/* Call to Action Button */}
      <span className="mt-2 inline-block rounded-lg bg-brand text-white text-[14px] px-6 py-2.5 hover:opacity-90 transition-opacity transition-colors cursor-pointer">
        Get your offer
      </span>
    </CardShell>
  );
};
/* -------------------------------------------------------------------------
   3) Clutch-style ad — bold orange/black marketplace styling
------------------------------------------------------------------------- */
export const GreatDealsAdCard = () => {
  return (
    <CardShell
      onClick={() => { }}
      className="bg-white text-[#0B1A30] justify-center items-center gap-4 px-6 py-8 text-center border border-gray-200 rounded-2xl shadow-sm"
    >
      {/* Graphic / Image */}
      <div className="w-full flex items-center justify-center my-4 bg-white">
        <img
          src={AdCard3?.src}
          alt="Cardora Certified"
          className="w-72 h-auto object-contain transform -rotate-12 bg-white transition-transform duration-300"
        />
      </div>

      {/* Heading with Info Icon */}
      <h3 className="text-[22px] font-bold tracking-tight text-[#051329] leading-none flex items-center justify-center gap-1.5 flex-wrap">
        <span>Every vehicle you see is Cardora Certified.</span>

      </h3>

      {/* Subtext */}
      <p className="text-[14px] text-gray-500 leading-snug max-w-[250px] mx-auto">
       Thoroughly inspected and serviced by our certified technicians.
      </p>

      {/* Call to Action Button */}
      <span className="mt-2 inline-block rounded-lg bg-brand text-white text-[14px] px-6 py-2.5 hover:opacity-90 transition-opacity transition-colors cursor-pointer">
        Shop now
      </span>
    </CardShell>
  );
};

/* -------------------------------------------------------------------------
   Ordered list used by the grid interleaving logic in page.tsx.
   Index 0 -> Finance, 1 -> Trade-In, 2 -> Clutch-style.
------------------------------------------------------------------------- */
export const AD_CARDS: React.ComponentType[] = [
  FinanceAdCard,
  TradeInAdCard,
  GreatDealsAdCard,
];
