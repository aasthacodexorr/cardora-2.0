"use client"

import { GetInTouch, Captcha } from '@/components/common';
import { Footer, Header } from '@/components/layout';
import { useState } from 'react';
import Image from 'next/image';
import callIcon from "@/assets/icons/call_icon.svg";
import envelopIcon from "@/assets/icons/envelop_icon.svg";
import { getConstants } from '@/constants';
import { useAppConfig } from '@/app/providers';
import Link from 'next/link';

export default function ContactUs() {
    const appConfig = useAppConfig();
    const SITE_CONFIG = getConstants(appConfig).SITE_CONFIG;
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
    const [error, setError] = useState<string | null>(null);

    // 3. reCAPTCHA states
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [resetCaptcha, setResetCaptcha] = useState(false);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        const targetValue = type === 'checkbox' ? checked : value;

        // --- ON-TYPING VALIDATION LOGIC ---
        if (name === 'firstName' || name === 'lastName') {
            // Prevent entering numbers or special characters immediately
            const nameRegex = /^[A-Za-z\s]*$/;
            if (!nameRegex.test(targetValue)) {
                setError(`${name === 'firstName' ? 'First name' : 'Last name'} should only contain letters.`);
                return; // Block the input state change
            } else {
                setError(null);
            }
        }

        if (name === 'phoneNumber') {
            // Allow only numbers and restrict to 10 digits max
            const cleanPhone = targetValue.replace(/\D/g, '');
            if (cleanPhone.length > 10) return; // Block typing beyond 10 digits

            if (cleanPhone.length > 0 && cleanPhone.length < 10) {
                setError("Phone number must be exactly 10 digits.");
            } else {
                setError(null);
            }

            setFormData((prev) => ({ ...prev, [name]: cleanPhone }));
            return;
        }

        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (targetValue.trim() !== '' && !emailRegex.test(targetValue.trim())) {
                setError("Please enter a valid email address.");
            } else {
                setError(null);
            }
        }

        if (name === 'agreeToTerms') {
            if (!checked) {
                setError("You must agree to the terms and conditions to proceed.");
            } else {
                setError(null);
            }
        }

        // Update state if all instant validation checks pass
        setFormData((prev) => ({ ...prev, [name]: targetValue }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        // Check if reCAPTCHA is completed
        if (!captchaToken) {
            setError("Please complete the reCAPTCHA verification.");
            return;
        }

        // Final sanity check before submission
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }

        if (formData.phoneNumber.length !== 10) {
            setError("Phone number must be exactly 10 digits.");
            return;
        }

        if (!formData.agreeToTerms) {
            setError("You must agree to the terms and conditions to proceed.");
            return;
        }

        setLoading(true);
        setError(null);

        // TODO: Add backend API call here to verify captchaToken server-side
        // For now, simulate successful submission
        setTimeout(() => {
            setSuccess(true);
            setLoading(false);
            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                message: '',
                agreeToTerms: false,
            });
            setCaptchaToken(null);
            setResetCaptcha(!resetCaptcha); // Trigger reCAPTCHA reset
        }, 1000);
    };

    return (
        <>
            <Header />
            <div className="min-h-screen flex items-center justify-center px-3 py-10  lg:px-24 font-sans text-gray-900 lg:mt-28">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 lg:gap-12 gap-8">

                    {/* Left Side */}
                    <div className="space-y-8">
                        <h1 className="text-2xl sm:text-[42px] font-bold lg:mt-28 lg:max-w-xl">
                            Got a question? We’re here to help.
                        </h1>
                        <div className="space-y-7 lg:space-y-4 lg:w-[480px]">
                            {/* Call Card */}
                            <Link
                                href={`tel:${appConfig.dealership.sales_number_1}`}
                                className="group relative bg-white p-6 rounded-md border border-gray-200 flex justify-between overflow-hidden cursor-pointer block"
                            >
                                <div className="absolute inset-0 bg-[#2f413936] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="relative z-10">
                                    <h2 className="text-xl font-bold mb-1">Call us</h2>
                                    <p className="text-gray-600">{appConfig.dealership.sales_number_1 || "Call Us Anytime Now"}</p>
                                </div>

                                <div className="relative z-10 h-[55px] w-[55px] rounded-full bg-[#00af66] flex items-center justify-center">
                                    <Image
                                        src={callIcon}
                                        alt="Call icon"
                                        width={27}
                                        height={27}
                                        className="object-contain"
                                    />
                                </div>
                            </Link>

                            {/* Email Card */}
                            <Link
                                href={`mailto:${appConfig.dealership.email_1}`}
                                className="group relative bg-white p-6 rounded-md border border-gray-200 flex justify-between overflow-hidden cursor-pointer block"
                            >
                                <div className="absolute inset-0 bg-[#2f413936] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="relative z-10">
                                    <h2 className="text-xl font-bold mb-1">Email</h2>
                                    <p className="text-gray-600">{appConfig.dealership.email_1 || "Send Us an Email"}</p>
                                </div>

                                <div className="relative z-10 h-[55px] w-[55px] rounded-full bg-[#00af66] flex items-center justify-center">
                                    <Image
                                        src={envelopIcon}
                                        alt="Email icon"
                                        width={27}
                                        height={27}
                                        className="object-contain"
                                    />
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Right Side: Form Container */}
                    <div className=" bg-white px-4 pt-8 pb-18 sm:p-10 rounded-3xl shadow-[0_2px_18px_rgba(0,0,0,0.1)] border border-gray-100">
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
                            <form onSubmit={handleSubmit} className="space-y-6 ">
                                {error && (
                                    <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm font-medium">
                                        {error}
                                    </div>
                                )}

                                <div className='grid xl:grid-cols-2 grid-cols-1 gap-4'>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="w-full px-4 py-3  rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100"
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100"
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100"
                                    />
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        placeholder="Phone Number"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100"
                                    />
                                </div>

                                <div>
                                    <textarea
                                        name="message"
                                        placeholder="Message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 resize-none disabled:bg-gray-100"
                                    ></textarea>
                                </div>


                                <div className="flex items-start gap-3 text-[11px] leading-relaxed pt-2">
                                    <input
                                        type="checkbox"
                                        name="agreeToTerms"
                                        id="agreeToTerms"
                                        checked={formData.agreeToTerms}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="mt-0.5 rounded text-emerald-600 focus:outline-none focus:ring-1 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 border-gray-300 h-4 w-4 cursor-pointer transition-colors"
                                    />
                                    <label htmlFor="agreeToTerms" className="select-none cursor-pointer">
                                        By submitting this form, you agree to be contacted through phone calls, SMS, WhatsApp, or email regarding your inquiry, offers, and updates. You can opt out anytime by texting STOP. Messaging frequency may vary. Message and data rates may apply. For assistance, text HELP or visit our website at <a href="/" className="text-blue-500 hover:underline">{SITE_CONFIG?.dealership.name}</a>. Visit <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a> for privacy policy and <a href="#" className="text-blue-500 hover:underline">Terms and Conditions</a> for Terms of Service.
                                    </label>
                                </div>

                                {/* reCAPTCHA Component */}
                                <Captcha 
                                    onVerify={setCaptchaToken}
                                    resetTrigger={resetCaptcha}
                                />

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading || !captchaToken}
                                        className="w-full lg:w-fit border-[#00b066] bg-gradient-to-b from-[#00af66] cursor-pointer hover:opacity-90 to-[#00af66]/65 text-white font-medium px-8 py-3 rounded-xl transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Submit
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