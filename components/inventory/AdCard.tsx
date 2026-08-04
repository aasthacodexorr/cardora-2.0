"use client";

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
  const financeUrl =  `/financing`;

  return (
    <CardShell
      onClick={() => { window.location.href = financeUrl; }}
      className="bg-[#004d31] text-white justify-center items-center gap-6 px-6 text-center"
    >
      {/* Carvana-style wordmark: rounded, lowercase, green-on-white pill */}
      <div className="bg-white rounded-full px-6 py-2 shadow-md">
        <span className="text-[26px] font-extrabold tracking-tight text-[#00AF66] lowercase">
          drivo<span className="text-[#004d31]">finance</span>
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-[22px] font-bold leading-tight">
          Get Pre-Qualified
        </p>
        <p className="text-[14px] text-white/80 max-w-[240px] mx-auto">
          See your real rate in minutes, with no impact to your credit score.
        </p>
      </div>

      <span className="mt-2 inline-block rounded-full bg-[#00AF66] text-white text-[14px] font-semibold px-6 py-2.5 hover:bg-[#00994f] transition-colors">
        Start Financing
      </span>
    </CardShell>
  );
};

/* -------------------------------------------------------------------------
   2) Trade-In ad — links to Trade-In page
------------------------------------------------------------------------- */
export const TradeInAdCard = () => {
  const tradeInUrl =  "/trade-in-my-car";

  return (
    <CardShell
      onClick={() => { window.location.href = tradeInUrl; }}
      className="bg-gray-900 text-white justify-center items-center gap-6 px-6 text-center"
    >
      <svg className="w-12 h-12 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" />
      </svg>

      <div className="space-y-2">
        <p className="text-[22px] font-bold leading-tight">
          What's Your Trade Worth?
        </p>
        <p className="text-[14px] text-white/70 max-w-[240px] mx-auto">
          Get an instant estimate and apply it toward your next vehicle.
        </p>
      </div>

      <span className="mt-2 inline-block rounded-full bg-white text-gray-900 text-[14px] font-semibold px-6 py-2.5 hover:bg-gray-200 transition-colors">
        Value My Trade-In
      </span>
    </CardShell>
  );
};

/* -------------------------------------------------------------------------
   3) Clutch-style ad — bold orange/black marketplace styling
------------------------------------------------------------------------- */
export const ClutchStyleAdCard = () => {

  return (
    <CardShell
      onClick={() => {}}
      className="bg-black text-white justify-center items-center gap-6 px-6 text-center"
    >
      <div className="rounded-full border-2 border-[#FF6A39] px-6 py-2">
        <span className="text-[24px] font-black tracking-tight text-[#FF6A39]">
          clutch<span className="text-white">.</span>
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-[22px] font-bold leading-tight">
          100% Online. Delivered.
        </p>
        <p className="text-[14px] text-white/70 max-w-[240px] mx-auto">
          Browse, buy, and get your next car delivered straight to your door.
        </p>
      </div>

      <span className="mt-2 inline-block rounded-full bg-[#FF6A39] text-black text-[14px] font-semibold px-6 py-2.5 hover:bg-[#e85f30] transition-colors">
        Explore Now
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
  ClutchStyleAdCard,
];
