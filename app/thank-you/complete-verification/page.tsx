import { GetInTouch } from '@/components/common';
import { Footer, Header } from '@/components/layout';
import React from 'react';
import HeroImg from "@/assets/icons/comp-verify-1.png";
import sec2Img from "@/assets/icons/comp-verify-2.jpg"
import sec3Img from "@/assets/icons/comp-verify-3.jpg"
import Image from 'next/image';
import Link from 'next/link';
import VehicleCategoryGrid from '@/components/thank-you/VehicleCategoryGrid';

export default function CarLoanLanding() {
  return (
    <>
      <Header />
      <main className="mt-20  font-sans text-gray-800 bg-white">
        {/* 1. Confirmation Banner Section */}
        <section className="bg-[#efefef] py-20 pb-8 text-gray-900">
          <div className="max-w-7xl mx-auto px-4 text-center">
            {/* Heading */}
            <h2 className="text-2xl md:text-[30px] font-bold">
              Thank you for submitting your form!
            </h2>

            {/* Subheading */}
            <p className="text-lg md:text-xl font-bold mb-16">
              We respond within 2 Business Hours.
            </p>

            {/* Buttons Container */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-20 gap-4 sm:gap-12 md:gap-24 w-full px-4">
              <Link href={"/inventory"} className="whitespace-nowrap cursor-pointer bg-[#00af66] hover:bg-[#008f53] text-white text-base py-3 px-6 rounded-xl transition duration-200 shadow-sm">
                View In-Stock Inventory
              </Link>

              <Link href={"/about-us"} className="whitespace-nowrap cursor-pointer bg-[#00af66] hover:bg-[#008f53] text-white text-base py-3 px-6 rounded-xl transition duration-200 shadow-sm">
                Call Dealership
              </Link>

              <Link href={"/"} className="whitespace-nowrap cursor-pointer bg-[#00af66] hover:bg-[#008f53] text-white text-base py-3 px-6 rounded-xl transition duration-200 shadow-sm">
                Go Back to Home Page
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Hero Section: Applying with Confidence */}
        <section className="max-w-[1550px] mx-auto px-4 py-12 md:py-20 md:pl-32">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-2">
            {/* Left Column: Image Container */}
            <div className="relative rounded-3xl overflow-hidden w-full max-w-[550px] mx-auto md:mx-0">
              <Image
                src={HeroImg}
                loading="eager"
                alt="Hero section image"
                className="object-cove w-full h-full rounded-2xl max-w-full"
              />
            </div>

            {/* Right Column: Text Content */}
            <div className="flex flex-col text-center md:text-left items-center md:items-start mt-8 md:mt-0 md:ml-28">
              <h1 className="text-4xl md:text-6xl 2xl:text-6xl max-w-md lg:text-6xl font-bold text-black leading-[1.15] mb-6 tracking-normal">
                Applying for a car loan with confidence
              </h1>

              <p className="text-sm md:text-base  mb-8">
                Complete our online car loan application in minutes to pre-qualify for the car of your choice. We offer financing options for all credit situations.
              </p>

              <Link className="bg-[#00af66] w-fit hover:bg-[#008f53] text-white text-sm font-semibold py-3 px-8 cursor-pointer rounded-xl transition duration-200" href={"/finance"}>
                Get started
              </Link>

            </div>
          </div>
        </section>

        {/* 3. "How It Works" Section */}
        <section className="bg-[#f8f8f8] py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <span className="text-base uppercase font-bold text-emerald-600 block mb-2">
              How it works
            </span>
            <h2 className="text-2xl md:text-5xl font-bold text-gray-900 mb-4">
              A convenient way to get approved for your auto loan
            </h2>
            <p className="text-base text-[#636363]  mx-auto mb-12">
              Complete our car loan application online, and one of our team members will call you to discuss your financing and vehicle options.
            </p>

            <div className="grid gap-8 md:grid-cols-3 relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  1
                </div>
                <h3 className="text-lg font-bold mb-2">APPLY ONLINE</h3>
                <p className="text-base text-[#636363] max-w-sm leading-relaxed">
                  We won’t take “you’re declined” as an answer! <br /> We promise to secure you the best car loan approval at the lowest rate. </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  2
                </div>
                <h3 className="text-lg font-bold mb-2">GET APPROVED</h3>
                <p className="text-base text-[#636363] max-w-sm leading-relaxed">
                  Receive lightning-fast credit approval from our dedicated and qualified team. We provide approval for all credit types.</p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  3
                </div>
                <h3 className="text-lg font-bold mb-2">DRIVE AWAY</h3>
                <p className="text-base text-[#636363] max-w-sm leading-relaxed">
                  Get ready for the best part! Grab the keys and start enjoying your new or used vehicle!</p>
              </div>
            </div>

            <div className="mt-12">
              <Link className="bg-[#00af66] w-fit hover:bg-[#008f53] text-white text-base font-semibold py-3 px-8 cursor-pointer rounded-xl transition duration-200" href={"/finance"}>
                Get started
              </Link>
            </div>
          </div>
        </section>

        {/* 4. We're Here For You Section */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid gap-8 md:gap-12 md:grid-cols-2 items-center">
            <div className="rounded-2xl overflow-hidden relative order-last md:order-first">
              <Image
                src={sec2Img}
                loading="eager"
                alt="Hero section image"
                className="w-full h-full rounded-2xl max-w-xl"
              />
            </div>
            <div className=' w-full'>
              <span className="text-base uppercase tracking-widest font-bold text-emerald-700 block mb-2">
                Let us do the hard work
              </span>
              <h2 className="text-3xl md:text-[64px] 2xl:text-6xl font-bold text-gray-900 leading-tight mb-6">
                We're here for you at every stage
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our experts will help guide you through the car loan process including reviewing options, selecting coverage, and completing necessary paperwork.</p>
              <Link href={"/faq"} className="w-6 h-6 rounded-full bg-black p-4  border border-gray-400 flex items-center justify-center text-white cursor-pointer transition">
                →
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Discover Savings Section */}
        <section className="bg-white max-w-[1250px] mx-auto px-4 pt-12 md:pt-20">
          <div className="grid gap-8 md:grid-cols-2 items-start">
            {/* Left Column: Content */}
            <div className="max-w-xl md:mt-10">
              <span className="text-base uppercase tracking-widest font-extrabold text-emerald-600 block mb-4">
                Lets get started
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-[67px] font-bold text-gray-900 tracking-wide leading-[1.1] mb-6">
                Discover how much you could save on your car loan
              </h2>
              <p className="text-gray-600 text-base mb-8">
                Ready to get started? Talk to a real human today.
              </p>
              <Link className="bg-[#00af66] w-fit hover:bg-[#008f53] text-white text-base py-5 px-10 cursor-pointer rounded-xl transition duration-200" href={"/contact-us"}>
                Get started
              </Link>
            </div>

            {/* Right Column: Transparent Image */}
            <div className="flex justify-center  h-[400px] md:h-[600px] 2xl:h-[700px]">
              <Image
                src={sec3Img}
                loading="eager"
                alt="Hero section image"
                className=" w-full h-full rounded-2xl max-w-lg"
              />
            </div>
          </div>
        </section>

        {/* 6. Clients Testimonial / Carousel Placeholder */}
        <section className="bg-[#c4eafa] py-16 md:py-20">
          <div className="max-w-6xl mx-auto text-start">
            <h3 className="text-xs md:text-2xl 2xl:text-4xl uppercase  font-bold  mb-4">
              A WORD FROM OUR CLIENTS
            </h3>
            <p className="text-sm text-gray-600 italic">
              "Your feedback matters! Here's what our satisfied clients have to say about their car buying and loan experiences."
            </p>
          </div>
        </section>

        {/* 7. Featured Vehicles Category Grid */}
        <div className="mx-auto px-4 md:px-44 bg-[#f1f3f7] pt-14 pb-10 ">
          {/* Section Header */}
          <h3 className="text-3xl max-w-7xl mx-auto  md:text-4xl font-bold tracking-tight text-gray-900 mb-8 uppercase text-left">
            Featured Vehicles
          </h3>

          {/* Light Gray Panel Container */}
          <div className="max-w-7xl mx-auto ">
            <div className="grid gap-8 lg:grid-cols-4 items-start">

              {/* Left Selector Text */}
              <div className="lg:col-span-1 pt-2">
                <span className="text-sm font-medium text-gray-800 block mb-1">
                  Search for a used vehicle by
                </span>
                <h4 className="text-3xl font-bold text-gray-900 mb-2">
                  Category
                </h4>
                <Link
                  href="/inventory"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center gap-1 transition-colors"
                >
                  See all vehicles
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </div>

              {/* Right Vehicle Type Grid */}
              <VehicleCategoryGrid />
            </div>
          </div>
        </div>
      </main>
      <GetInTouch />
      <Footer />

    </>
  );
}