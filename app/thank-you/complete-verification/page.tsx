import { GetInTouch } from '@/components/common';
import { Footer, Header } from '@/components/layout';
import Link from 'next/link';

export default function CarLoanLanding() {
  return (
    <>
      <Header />
      <main className="lg:mt-20 font-sans text-gray-800 bg-white ">
        {/* 1. Confirmation Banner Section */}
        <section className="my-44 text-gray-900">
          <div className="max-w-7xl mx-auto px-4 text-center">
            {/* Heading */}
            <h2 className="text-2xl md:text-[30px] font-bold">
              Thank you for submitting your form!
            </h2>

            {/* Subheading */}
            <p className="text-lg md:text-xl font-bold my-5">
              We respond within 2 Business Hours.
            </p>

            {/* Buttons Container */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-20 gap-4 sm:gap-12 md:gap-24 w-full px-44">
              <Link href={"/inventory"} className="whitespace-nowrap cursor-pointer text-white text-base py-3 px-6 rounded-xl transition duration-200 shadow-sm hover:opacity-90 bg-brand">
                View In-Stock Inventory
              </Link>

              <Link href={"/about-us"} className="whitespace-nowrap cursor-pointer text-white text-base py-3 px-14 lg:px-6 rounded-xl transition duration-200 shadow-sm hover:opacity-90 bg-brand">
                Call Dealership
              </Link>

              <Link href={"/"} className="whitespace-nowrap cursor-pointer text-white text-base py-3 px-6 rounded-xl transition duration-200 shadow-sm hover:opacity-90 bg-brand">
                Go Back to Home Page
              </Link>
            </div>
          </div>
        </section>        
      </main>
      <GetInTouch />
      <Footer />
    </>
  );
}
