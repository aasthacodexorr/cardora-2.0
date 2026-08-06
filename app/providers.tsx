"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { AppConfig, defaultAppConfig } from "@/lib/appConfig";
import { WishlistProvider } from "@/context/WishlistContext";
import { DrawerProvider } from "@/context/DrawerContext";
import { useDrawer } from "@/context/DrawerContext";
import WishlistDrawer from "@/components/inventory/WishlistDrawer";

export const AppConfigContext = createContext<AppConfig>(defaultAppConfig);

export function useAppConfig() {
  return useContext(AppConfigContext);
}

function WishlistDrawerWithState() {
  const { isWishlistDrawerOpen, closeWishlistDrawer } = useDrawer();
  return <WishlistDrawer isOpen={isWishlistDrawerOpen} onClose={closeWishlistDrawer} />;
}

export function Providers({ children, config }: { children: React.ReactNode; config: AppConfig }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AppConfigContext.Provider value={config}>
      <QueryClientProvider client={queryClient}>
        <WishlistProvider>
          <DrawerProvider>
            <WishlistDrawerWithState />
            {children}
          </DrawerProvider>
        </WishlistProvider>
      </QueryClientProvider>
    </AppConfigContext.Provider>
  );
}
