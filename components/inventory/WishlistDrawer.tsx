  "use client";

  import { useState, useEffect } from "react";
  import { X } from "lucide-react";
  import Image from "next/image";
  import Link from "next/link";
  import { useWishlist, WishlistItem } from "@/context/WishlistContext";
  import { HitCard } from "./HitCard";

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
          className={`fixed top-0 right-0 h-screen w-full sm:max-w-sm bg-white shadow-lg z-[999] transform transition-transform duration-300 ease-in-out overflow-y-auto ${
            isOpen ? "translate-x-0" : "translate-x-full"
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
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p className="text-gray-500 text-sm mb-2">Your favourites list is empty</p>
                <Link
                  href="/inventory"
                  onClick={onClose}
                  className="text-brand-green font-semibold hover:underline text-sm"
                >
                  Browse vehicles
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlist.map((item,index) => (
                  <div
                    key={index}
                    className="rounded-lg overflow-hidden bg-white"
                  >
                    <HitCard  hit={convertToHitFormat(item)}  />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
