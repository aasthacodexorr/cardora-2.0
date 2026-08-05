"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { Header, Footer } from "@/components/layout";
import { GetInTouch } from "@/components/common";
import { useWishlist, WishlistItem } from "@/context/WishlistContext";
import { HitCard } from "@/components/inventory";

export default function WishlistPage() {
  const { wishlist, clearWishlist, isHydrated } = useWishlist();

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
      <Header />
      <main className="min-h-screen bg-light-gray py-14 px-4">
        <div className="max-w-[1400px] mx-auto">
          {/* Header Section */}
          <div className="mb-2 lg:mt-10 text-center">
            <h1 className="text-[36px] lg:text-[48px] font-bold text-foreground">
              My Wishlist
            </h1>
            <p className="text-[16px] text-gray-600 ">
              {isHydrated && wishlist.length > 0
                ? `You have ${wishlist.length} vehicle${wishlist.length !== 1 ? "s" : ""
                } saved in your wishlist.  `
                : "Add vehicles to your wishlist to save them for later."}
            </p>
          </div>

          {/* Wishlist Content */}
          {!isHydrated ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-brand mx-auto mb-4 animate-spin" />
                <p className="text-gray-600">Loading your wishlist...</p>
              </div>
            </div>
          ) : wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
              <Heart className="w-16 h-16 text-gray-300 mb-4" />
              <h2 className="text-[24px] font-bold text-gray-900 mb-3">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-8 max-w-md text-center">
                Start adding your favorite vehicles to your wishlist by clicking
                the heart icon on any vehicle card in the inventory.
              </p>
              <Link
                href="/inventory"
                className="inline-block bg-brand text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Browse Inventory
              </Link>
            </div>
          ) : (
            <>
              {/* Wishlist Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 lg:gap-0 lg:gap-y-[1px] mb-8 max-w-[1000px] mx-auto">
                {wishlist.map((item) => (
                  <div key={item.inventory_id} className="flex flex-col h-full p-[9px] max-w-[380px]">
                    <HitCard hit={convertToHitFormat(item)} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer Sections */}
      {isHydrated && wishlist.length > 0 && (
        <>
          <GetInTouch />
          <Footer />
        </>
      )}
    </>
  );
}
