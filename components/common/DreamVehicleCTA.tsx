/* =========================
   DreamVehicleCTA Component (Common)
   Reusable call-to-action banner used at the
   bottom of several pages (Service, Protection Plans,
   About Us). Prompts users to browse inventory
   or get pre-qualified for financing.
========================= */

import { ArrowRight } from "lucide-react";

const DreamVehicleCTA = () => {
  return (
    <section className="w-full bg-hero-bg dream_vehicle_cta">
      <div className="mx-auto max-w-[1400px] px-6 py-16 text-center">
        <h2 className="text-[36px] lg:text-[52px] font-extrabold text-foreground tracking-tight">
          Your dream vehicle is close...
        </h2>
        <p className="mt-4 text-[17px] text-foreground/80 max-w-2xl mx-auto">
          Browse our full inventory or get pre-qualified in minutes — no impact to your credit.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {/* Browse inventory CTA */}
          <a
            href="/inventory"
            className="inline-flex items-center gap-2 rounded-md bg-brand-green text-brand-green-foreground px-7 py-4 font-semibold text-[16px] hover:opacity-95 transition-opacity"
          >
            Browse all Cars
            <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
          </a>

          {/* Pre-qualify CTA */}
          <a
            href="/financing"
            className="inline-flex items-center gap-2 rounded-md border-2 border-foreground/80 text-foreground px-7 py-4 font-semibold text-[16px] hover:bg-foreground hover:text-background transition-colors"
          >
            Get pre-qualified
          </a>
        </div>
      </div>
    </section>
  );
};

export default DreamVehicleCTA;
