"use client";

import { usePathname } from "next/navigation";

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const topMargin = pathname === "/certified" ? "" : "mt-10";

  return (
    <div className={`flex-1 flex flex-col min-h-screen ${topMargin} lg:mt-0`}>
      {children}
    </div>
  );
}
