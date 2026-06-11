
"use client"

import { GetInTouch } from '@/components/common';
import { Footer, Header } from '@/components/layout';
import React, { useState } from 'react';
import callIcon from "@/assets/icons/call_icon.svg";
import envelopIcon from "@/assets/icons/envelop_icon.svg";

export default function ContactUs() {
    // 1. Keep input state so React can track what the user types
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        message: '',
        agreeToTerms: false,
    });

    // 2. Add API status states to control UI changes
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Send the formData to your Next.js API route that communicates with Typesense
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Something went wrong. Please try again.');

            setSuccess(true);
            // Reset form on success
            setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '', message: '', agreeToTerms: false });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen flex items-center justify-center p-6 sm:p-12 font-sans text-gray-900">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 ">

                    {/* Left Side */}
                    <div className="space-y-8">
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight lg:mt-28">
                            Got a question? We’re here to help.
                        </h1>
                        <div className="space-y-4 w-[480px]">
                            <div className="group relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between overflow-hidden cursor-pointer">
                                <div className="absolute inset-0 bg-[#2f413936] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="relative z-10">
                                    <h2 className="text-xl font-bold mb-1">Call us</h2>
                                    <p className="text-gray-600">Call Us Anytime Now</p>
                                </div>

                                <div className="relative z-10 h-[55px] w-[55px] rounded-full bg-[#00af66] flex items-center justify-center">
                                    <img
                                        src={callIcon?.src}
                                        alt=""
                                        width={27}
                                        height={27}
                                        className="object-contain"
                                    />
                                </div>
                            </div>

                            <div className="group relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between overflow-hidden cursor-pointer">
                                <div className="absolute inset-0 bg-[#2f413936] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="relative z-10">
                                    <h2 className="text-xl font-bold mb-1">Email</h2>
                                    <p className="text-gray-600">Send Us an Email</p>
                                </div>

                                <div className="relative z-10 h-[55px] w-[55px] rounded-full bg-[#00af66] flex items-center justify-center">
                                    <img
                                        src={envelopIcon?.src}
                                        alt=""
                                        width={27}
                                        height={27}
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form Container */}
                    <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_2px_18px_rgba(0,0,0,0.1)] border border-gray-100">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Let’s Get You on the Road</h2>

                        {/* Conditional UI based on Success State */}
                        {success ? (
                            <div className="bg-emerald-50 text-emerald-800 p-6 rounded-2xl text-center">
                                <h3 className="text-lg font-bold mb-2">Message Sent Successfully!</h3>
                                <p className="text-sm">Thank you for reaching out. Our team will contact you shortly.</p>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="mt-4 text-sm font-semibold underline text-emerald-600 hover:text-emerald-700"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm font-medium">
                                        {error}
                                    </div>
                                )}

                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
                                />

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
                                />
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="Phone Number"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
                                />

                                <div>
                                    <textarea
                                        name="message"
                                        placeholder="Message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none disabled:bg-gray-100"
                                    ></textarea>
                                </div>


                                <div className="flex items-start gap-3 text-[13px] leading-relaxed pt-2">
                                    <input
                                        type="checkbox"
                                        name="agreeToTerms"
                                        id="agreeToTerms"
                                        checked={formData.agreeToTerms}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 h-4 w-4 cursor-pointer transition-colors"
                                    />
                                    <label htmlFor="agreeToTerms" className="select-none cursor-pointer">
                                        By submitting this form, you agree to be contacted through phone calls, SMS, WhatsApp, or email regarding your inquiry, offers, and updates. You can opt out anytime by texting STOP. Messaging frequency may vary. Message and data rates may apply. For assistance, text HELP or visit our website at <a href="#" className="text-emerald-600 font-semibold hover:underline">Cardora</a>. Visit <a href="#" className="text-emerald-600 font-semibold hover:underline">Privacy Policy</a> for privacy policy and <a href="#" className="text-emerald-600 font-semibold hover:underline">Terms and Conditions</a> for Terms of Service.
                                    </label>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="border-[#00b066] bg-gradient-to-b from-[#00af66] cursor-pointer hover:opacity-90 to-[#00af66]/65 text-white font-medium px-8 py-3 rounded-xl transition-colors duration-200 shadow-md"
                                    >
                                        {loading ? 'Sending...' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                </div>
            </div>

            <GetInTouch />
            <Footer />
        </>
    );
}