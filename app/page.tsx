/* =========================
   Home Page
   Root page of the Cardora website.
   Composes all homepage sections in order:
   Hero → CategoryPills → PreQualify → NextRide →
   FeaturedVehicles → Reviews → CardoraDifference →
   GetInTouch → Footer
========================= */

"use client";

// Layout components
import { Header, Footer } from "@/components/layout";

// Home-specific sections
import {
  Hero,
  CategoryPills,
  PreQualify,
  NextRide,
  FeaturedVehicles,
  Reviews,
  CardoraDifference,
} from "@/components/home";

// Shared/reusable sections
import { GetInTouch } from "@/components/common";

/* ── Page Component ────────────────────────────────────────── */
const HomePage = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero section has a blue background that wraps the header */}
      <div className="bg-hero-bg">
        <Header />
        <Hero />
      </div>

      {/* Homepage sections */}
      <CategoryPills />
      <PreQualify />
      <NextRide />
      <FeaturedVehicles />
      <Reviews />
      <CardoraDifference />
      <GetInTouch />
      <Footer />
    </main>
  );
};

export default HomePage;
