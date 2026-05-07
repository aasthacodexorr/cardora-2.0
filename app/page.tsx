"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryPills from "@/components/CategoryPills";
import PreQualify from "@/components/PreQualify";
import NextRide from "@/components/NextRide";
import FeaturedVehicles from "@/components/FeaturedVehicles";
import Reviews from "@/components/Reviews";
import CardoraDifference from "@/components/CardoraDifference";
// import DreamVehicleCTA from "@/components/DreamVehicleCTA";
import GetInTouch from "@/components/GetInTouch";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background home_p">
      <div className="bg-hero-bg">
        <Header />
        <Hero />
      </div>
      <CategoryPills />
      <PreQualify />
      <NextRide />
      <FeaturedVehicles />
      <Reviews />
      <CardoraDifference />
      {/* <DreamVehicleCTA /> */}
      <GetInTouch />
      <Footer />
    </main>
  );
};

export default Index;
