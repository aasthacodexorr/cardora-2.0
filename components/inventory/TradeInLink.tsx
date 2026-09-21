"use client";

/**
 * TradeInLink
 *
 * Client component that renders the "Sell or trade in" button on the VDP.
 * Uses setQueryParams to carry all current page query parameters (including
 * inventory_id and any others like source, utm_*, etc.) to the trade-in page,
 * so navigation preserves the full query context.
 *
 * The server component (VehicleDetailsPage) passes the vehicle id as a prop;
 * this component decides the final href on the client where window.location
 * is available.
 */

import { setQueryParams } from "@/utils/queryParams";

interface TradeInLinkProps {
  vehicleId: string | number;
}

export default function TradeInLink({ vehicleId }: TradeInLinkProps) {
  const href = setQueryParams(`/trade-in-my-car?inventory_id=${vehicleId}`);

  return (
    <a
      href={href}
      className="inline-block w-full md:w-auto hover:opacity-90 shadow-md transition-opacity text-white text-lg font-semibold px-9 py-3.5 rounded-xl no-underline transition-all duration-200 text-center whitespace-nowrap bg-brand-btn-gradient"
    >
      Sell or trade in
    </a>
  );
}
