import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlist | Cardora",
  description: "View your saved wishlist of vehicles from Cardora",
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
