import { GetInTouch } from '@/components/common';
import { Footer, Header } from '@/components/layout';
import React from 'react';
import HeroImg from "@/assets/icons/comp-verify-1.png";
import Image from 'next/image';

export default function CarLoanLanding() {
  return (
    <>
      <Header />
      <main className="mt-20 mb-16 font-sans text-gray-800 bg-white">
        {/* 1. Confirmation Banner Section */}
        <section className="bg-[#efefef] py-20 pb-8 text-gray-900">
          <div className="max-w-6xl mx-auto px-4 text-center">
            {/* Heading */}
            <h2 className="text-xl md:text-[30px] font-bold">
              Thank you for submitting your form!
            </h2>

            {/* Subheading */}
            <p className="text-lg md:text-xl font-bold mb-16">
              We respond within 2 Business Hours.
            </p>

            {/* Buttons Container */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-20 gap-4 sm:gap-12 md:gap-24 w-full px-4">
              <button className="whitespace-nowrap bg-[#00af66] hover:bg-[#008f53] text-white text-sm py-3 px-6 rounded-xl transition duration-200 shadow-sm">
                View In-Stock Inventory
              </button>

              <button className="whitespace-nowrap bg-[#00af66] hover:bg-[#008f53] text-white text-sm py-3 px-6 rounded-xl transition duration-200 shadow-sm">
                Call Dealership
              </button>

              <button className="whitespace-nowrap bg-[#00af66] hover:bg-[#008f53] text-white text-sm py-3 px-6 rounded-xl transition duration-200 shadow-sm">
                Go Back to Home Page
              </button>
            </div>
          </div>
        </section>

        {/* 2. Hero Section: Applying with Confidence */}
        <section className="max-w-6xl mx-auto py-20">
          <div className="flex items-center gap-12 md:gap-20  ">
            {/* Left Column: Image Container */}
            <div className="relative rounded-3xl overflow-hidden w-full max-w-md">
              <Image
                src={HeroImg}
                loading="eager"
                alt="Hero section image"
                className="object-cove w-full h-full rounded-2xl max-w-md"
              />
            </div>

            {/* Right Column: Text Content */}
            <div className="flex flex-col ml-20">
              <h1 className="text-4xl md:text-5xl max-w-md lg:text-6xl font-bold text-gray-900 leading-[1.15] mb-6 tracking-tight">
                Applying for a car loan with confidence
              </h1>

              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 max-w-2xl">
                Complete our online car loan application in minutes to pre-qualify for the car of your choice. We offer financing options for all credit situations.
              </p>

              <div>
                <button className="bg-[#00af66] hover:bg-[#008f53] text-white text-sm font-semibold py-3 px-6 rounded-xl transition duration-200">
                  Get started
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. "How It Works" Section */}
        <section className="bg-[#f8f8f8] py-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <span className="text-xs uppercase tracking-widest font-bold text-emerald-600 block mb-2">
              How it works
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              A convenient way to get approved for your auto loan
            </h2>
            <p className="text-sm text-gray-500  mx-auto mb-12">
             Complete our car loan application online, and one of our team members will call you to discuss your financing and vehicle options. 
            </p>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  1
                </div>
                <h3 className="text-lg font-bold mb-2">APPLY ONLINE</h3>
                <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
                  Our quick application process will give you an instant decision. Let us do the heavy lifting to find you the best loan options.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  2
                </div>
                <h3 className="text-lg font-bold mb-2">GET APPROVED</h3>
                <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
                  We work with top tier lenders and credit unions to find affordable solutions and customized rates for all credit types.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  3
                </div>
                <h3 className="text-lg font-bold mb-2">DRIVE AWAY</h3>
                <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
                  Get ready to drive home in your new car! We will help make the process easy so you can start enjoying your new ride sooner.
                </p>
              </div>
            </div>

            <div className="mt-12">
              <button className="bg-[#00af66] hover:bg-[#008f53] text-white text-xs font-bold py-3 px-8 rounded-md transition duration-200">
                Get Started
              </button>
            </div>
          </div>
        </section>

        {/* 4. We're Here For You Section */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-lg h-[350px] md:h-[400px] relative order-last md:order-first">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                alt="Woman with laptop"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-emerald-600 block mb-2">
                Let us do the hard work
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
                We're here for you at every stage
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our team of auto finance specialists will work with you through every step of the process. We will manage negotiations with lenders, secure approvals quickly, and help complete necessary paperwork smoothly.
              </p>
              <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center text-gray-500 cursor-pointer hover:border-emerald-600 hover:text-emerald-600 transition">
                →
              </div>
            </div>
          </div>
        </section>

        {/* 5. Discover Savings Section */}
        <section className="max-w-6xl mx-auto px-4 py-16 border-t border-gray-100">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-emerald-600 block mb-2">
                Let's get started
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
                Discover how much you could save on your car loan
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Speak to our car credit specialists and find out if you qualify for a much lower interest rate on your loan.
              </p>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-3 px-8 rounded-full transition duration-200">
                Get started
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg h-[350px] md:h-[400px] relative">
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80"
                alt="Man holding phone"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* 6. Clients Testimonial / Carousel Placeholder */}
        <section className="bg-cyan-100/60 py-12">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h3 className="text-xs uppercase tracking-widest font-bold text-gray-700 mb-4">
              A WORD FROM OUR CLIENTS
            </h3>
            <p className="text-sm text-gray-600 italic">
              "Your feedback matters! Here's what our satisfied clients have to say about their car buying and loan experiences."
            </p>
          </div>
        </section>

        {/* 7. Featured Vehicles Category Grid */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h3 className="text-lg font-bold text-gray-900 mb-8 uppercase tracking-wider text-center md:text-left">
            Featured Vehicles
          </h3>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Left Category selector */}
            <div className="md:col-span-1 flex flex-col justify-center">
              <span className="text-xs text-gray-400">Search by vehicle class</span>
              <h4 className="text-2xl font-bold text-gray-900 mt-1 mb-2">Category</h4>
              <div className="w-16 h-1 bg-emerald-600 rounded"></div>
            </div>

            {/* Right Vehicle Type Grid */}
            <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Sedan', icon: '🚗' },
                { label: 'Station Wagon', icon: '🚙' },
                { label: 'Compact', icon: '🏎️' },
                { label: 'SUV', icon: '🚘' },
                { label: 'Truck', icon: '🛻' },
                { label: 'Minivan', icon: '🚐' }
              ].map((vehicle, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-100 hover:border-emerald-600 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200"
                >
                  <span className="text-3xl mb-2" role="img" aria-label={vehicle.label}>
                    {vehicle.icon}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">{vehicle.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <GetInTouch />
      <Footer />

    </>
  );
}