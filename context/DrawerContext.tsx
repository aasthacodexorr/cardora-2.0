"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface DrawerContextType {
  isWishlistDrawerOpen: boolean;
  openWishlistDrawer: () => void;
  closeWishlistDrawer: () => void;
  toggleWishlistDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const DrawerProvider = ({ children }: { children: ReactNode }) => {
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false);

  const openWishlistDrawer = () => setIsWishlistDrawerOpen(true);
  const closeWishlistDrawer = () => setIsWishlistDrawerOpen(false);
  const toggleWishlistDrawer = () => setIsWishlistDrawerOpen(prev => !prev);

  return (
    <DrawerContext.Provider value={{
      isWishlistDrawerOpen,
      openWishlistDrawer,
      closeWishlistDrawer,
      toggleWishlistDrawer,
    }}>
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error("useDrawer must be used within DrawerProvider");
  }
  return context;
};
