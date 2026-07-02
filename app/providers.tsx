"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { AppConfig, defaultAppConfig } from "@/lib/appConfig";

export const AppConfigContext = createContext<AppConfig>(defaultAppConfig);

export function useAppConfig() {
  return useContext(AppConfigContext);
}

export function Providers({ children, config }: { children: React.ReactNode; config: AppConfig }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AppConfigContext.Provider value={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </AppConfigContext.Provider>
  );
}
