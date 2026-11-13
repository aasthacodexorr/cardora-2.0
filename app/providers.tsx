"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { AppConfig, defaultAppConfig } from "@/lib/appConfig";
import { WishlistProvider } from "@/context/WishlistContext";
import { DrawerProvider } from "@/context/DrawerContext";
import { useDrawer } from "@/context/DrawerContext";
import WishlistDrawer from "@/components/inventory/WishlistDrawer";
import { LAST_VISIT_STORAGE_KEY, SESSION_VISIT_STORAGE_KEY } from "@/lib/visitorTracking";

export const AppConfigContext = createContext<AppConfig>(defaultAppConfig);

export function useAppConfig() {
  return useContext(AppConfigContext);
}

function WishlistDrawerWithState() {
  const { isWishlistDrawerOpen, closeWishlistDrawer } = useDrawer();
  return <WishlistDrawer isOpen={isWishlistDrawerOpen} onClose={closeWishlistDrawer} />;
}

function VisitorTracker() {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(LAST_VISIT_STORAGE_KEY, Date.now().toString());
        window.sessionStorage.setItem(SESSION_VISIT_STORAGE_KEY, "true");
      }
    } catch {
      // Ignore storage errors
    }
  }, []);
  return null;
}

export function Providers({ children, config }: { children: React.ReactNode; config: AppConfig }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AppConfigContext.Provider value={config}>
      <QueryClientProvider client={queryClient}>
        <WishlistProvider>
          <DrawerProvider>
            <VisitorTracker />
            <WishlistDrawerWithState />
            {children}
          </DrawerProvider>
        </WishlistProvider>
      </QueryClientProvider>
    </AppConfigContext.Provider>
  );
}
