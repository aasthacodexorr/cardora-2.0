"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface WishlistItem {
  inventory_id: string;
  title: string;
  price: number;
  odometer: number;
  image_url: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  stock_no: string;
  drivetrain: string;
  status: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (inventoryId: string) => void;
  isInWishlist: (inventoryId: string) => boolean;
  clearWishlist: () => void;
  isHydrated: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "cardora_wishlist";

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load wishlist from localStorage:", error);
    }
    setIsHydrated(true);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
      } catch (error) {
        console.error("Failed to save wishlist to localStorage:", error);
      }
    }
  }, [wishlist, isHydrated]);

  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prev) => {
      // Check if item already exists
      const exists = prev.some((w) => w.inventory_id === item.inventory_id);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (inventoryId: string) => {
    setWishlist((prev) =>
      prev.filter((item) => item.inventory_id !== inventoryId)
    );
  };

  const isInWishlist = (inventoryId: string) => {
    return wishlist.some((item) => item.inventory_id === inventoryId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const value: WishlistContextType = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    isHydrated,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};
