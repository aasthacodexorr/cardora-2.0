"use client";

import { useState, useEffect } from "react";
import { Heart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist, WishlistItem } from "@/context/WishlistContext";
import { HitCard } from "./HitCard";
import carImg from "@/assets/cars/car-white-suv 1.png"

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const { wishlist, removeFromWishlist, isHydrated } = useWishlist();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isHydrated) {
    return null;
  }


  // Convert wishlist items to HitCard format
  const convertToHitFormat = (item: WishlistItem) => ({
    inventory_id: item.inventory_id,
    year: item.year,
    make: item.make,
    model: item.model,
    trim: item.trim,
    selling_price: item.price,
    odometer: item.odometer,
    drivetrain: item.drivetrain,
    stock_no: item.stock_no,
    status: item.status,
    image_urls: item.image_url,
  });

  return (
    <>
      {/* Overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[999] transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:max-w-sm bg-white shadow-lg z-[999] transform transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            My Favourites
          </h2>

          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 cursor-pointer rounded-md transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {wishlist.length === 0 ? (
            <div className="flex flex-col items-start text-left py-4">
              {/* Car illustration box */}
              <div className="relative w-full aspect-[16/9] max-w-[280px] bg-[#dbe2e9] rounded-2xl overflow-hidden mb-6 flex items-center justify-center">
                <Image
                  src={carImg?.src}
                  alt="No favorites"
                  width={240}
                  height={135}
                  className="object-contain"
                />
                {/* Red heart icon overlay */}
                <div className="absolute top-3 right-3 text-brand-green">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-3">
                Your Favorites List Is Empty.
              </h3>

              <p className="text-gray-600 text-base leading-relaxed mb-6">
                Browse our inventory and tap the{" "}
                <Heart className="inline-block w-5 h-5 fill-brand-green stroke-none align-middle mr-1" />
                on any vehicle to add it to your favorites.
              </p>

              {/* CTA Button */}
              <Link
                href="/inventory"
                onClick={onClose}
                className="inline-flex items-center justify-center bg-brand-green hover:bg-brand-green-alpha hover:text-white transition-all text-white px-6 py-3 rounded-xl text-base transition-colors mb-6"
              >
                Browse vehicles
              </Link>
            </div>
          ) : (
            <div className="space-y-4 mb-28">
              {wishlist.map((item, index) => (
                <div key={index} className="rounded-lg overflow-hidden bg-white">
                  <HitCard hit={convertToHitFormat(item)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
