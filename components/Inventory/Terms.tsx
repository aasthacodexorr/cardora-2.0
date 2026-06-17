"use client";
import { appConfig } from "@/lib/appConfig";

const Terms = ({vehicle}:any) => {

    return (
        <>

            <div className="w-full   font-sans mt-8">
                {/* Main Container Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-gray-800">

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-[14px] font-medium tracking-tight">

                        {/* 6-month warranty */}
                        <div className="flex items-center gap-2.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0 text-black" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.92 11.01C18.72 10.42 18.16 10 17.5 10h-11c-.66 0-1.21.42-1.42 1.01L3 16v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-4.99zM6.5 18c-.83 0-1.5-.67-1.5-1.5S5.67 15 6.5 15s1.5.67 1.5 1.5S7.33 18 6.5 18zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 13l1.5-4.5h11L19 13H5zM12 2c-1.1 0-2 .9-2 2h4c0-1.1-.9-2-2-2zm-5 4h10v1H7V6z" />
                            </svg>
                            <span>6-month warranty</span>
                        </div>

                        {/* 150-point inspection */}
                        <div className="flex items-center gap-2.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            <span>150-point inspection</span>
                        </div>

                        {/* Roadside assistance */}
                        <div className="flex items-center gap-2.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0 text-black" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            <span>Roadside assistance</span>
                        </div>

                        {/* 10-day exchange */}
                        <div className="flex items-center gap-2.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0 text-black" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2c-1.1 0-2 .9-2 2v1.07C7.5 5.57 6 7.74 6 10.5c0 2.5 1.17 4.29 2.57 5.61L7 19h10l-1.57-2.89c1.4-1.32 2.57-3.11 2.57-5.61 0-2.76-1.5-4.93-4-5.43V4c0-1.1-.9-2-2-2zm0 11c-1.38 0-2.5-1.12-2.5-2.5S10.62 8 12 8s2.5 1.12 2.5 2.5S13.38 13 12 13z" />
                            </svg>
                            <span>10-day exchange</span>
                        </div>

                    </div>

                    {/* View terms text trigger with Interactive Black Tooltip */}
                    <div className="mt-5 text-center flex items-center justify-center relative group">
                        <div className="inline-flex items-center gap-1 cursor-pointer py-1">
                            <span className="text-[14px] text-gray-500 font-medium underline underline-offset-2">
                                View terms
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>

                        {/* Black Background Tooltip Box Container */}
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-[340px] bg-black text-white text-[11px] font-normal leading-normal px-4 py-3 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-left shadow-xl pointer-events-none">
                            <p className="font-bold mb-1 text-[12px] text-white">Buy with confidence.</p>
                            <p className="text-gray-200">
                                Every {appConfig.dealership.dealership_name} vehicle includes a 6-month powertrain warranty,
                                10-day exchange policy, 150-point inspection,
                                complimentary CARFAX® vehicle history report,
                                inspection report, and roadside assistance. Certain conditions, limitations,
                                and exclusions may apply. Please visit the dealership for complete details.
                            </p>
                            {/* Downward facing anchor triangle */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-black rotate-45 -mt-1.5"></div>
                        </div>
                    </div>

                    {/* Divider rule line */}
                    <div className="my-4 border-t border-gray-200 w-full"></div>

                    {/* Google Reviews Rating section */}
                    <div className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>

                        <div className="flex gap-0.5 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>

                        <span className="text-[15px] font-black tracking-tight text-gray-900 ml-0.5">4.8</span>
                    </div>

                </div>

                {/* Geolocation Tag Badge placement */}
                <div className="mt-5 flex items-center justify-center gap-2 text-gray-700 font-medium text-[14px]">
                    <div className="w-8 h-8 rounded-full border border-emerald-500 bg-white flex items-center justify-center shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <span>{vehicle?.location || `${appConfig.dealership.dealership_name} ${appConfig.dealership.city_1}`}</span>
                </div>
            </div>



        </>

    );
};

export default Terms;
