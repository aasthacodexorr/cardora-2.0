"use client";

import { Fuel, PaintBucket, Palette, Radiation } from "lucide-react";
const AboutVehicle = ({ vehicle }: any) => {
    return (
        <>
            <div className="bg-card border-none rounded-xl p-0 w-full mt-5 xl:-mt-28">
                <h2 className="text-[22px] font-semibold text-black mb-[30px]">
                    About this vehicle
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Odometer */}
                    {vehicle?.odometer !== undefined && vehicle?.odometer !== null && (
                        <div>
                            <div className="flex items-start gap-2 text-[13px] text-muted-foreground mb-1">
                                <svg
                                    className="w-5 h-5 text-black"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    fill="currentColor"
                                >
                                    <path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1-512 0zm80 0h64.3c8.7 0 15.7-7.1 17.3-15.6 4.4-24.4 18.1-45.5 37.2-59.7 7.4-5.5 10.6-15.6 6-23.6l-32.5-56.3c-4.3-7.5-13.9-10.3-21.2-5.5-48.2 31.5-81.3 84.2-86.3 144.8-.7 8.8 6.5 16 15.3 16zm137.9 89.8c-8.5-3.7-18.8-1.4-23.5 6.6l-31 53.8c-4.3 7.5-1.9 17.2 5.8 21.1 26.1 13.2 55.5 20.7 86.8 20.7s60.7-7.5 86.8-20.7c7.7-3.9 10.1-13.6 5.8-21.1l-31-53.8c-4.6-8-15-10.3-23.5-6.6-11.7 5-24.5 7.8-38.1 7.8s-26.4-2.8-38.1-7.8zM350.4 240.4c1.6 8.6 8.5 15.6 17.3 15.6H432c8.8 0 16.1-7.2 15.3-16-5-60.6-38.1-113.2-86.3-144.8-7.3-4.8-16.8-2-21.2 5.5L307.3 157c-4.6 8-1.4 18.1 6 23.6 19.1 14.2 32.7 35.4 37.2 59.7zM256 305.7a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
                                </svg>
                                <span>
                                    Odometer
                                    <p className="font-bold text-[15px] text-black">
                                        {vehicle?.odometer.toLocaleString()} KM
                                    </p>
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Exterior Color */}
                    {vehicle?.exterior_color && (
                        <div>
                            <div className="flex items-start gap-2 text-[13px] text-muted-foreground mb-1">
                                <PaintBucket color="black" />
                                <span>
                                    Exterior Color
                                    <p className="font-bold text-[15px] text-black">
                                        {vehicle?.exterior_color}
                                    </p>
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Interior Color */}
                    {vehicle?.interior_color && (
                        <div>
                            <div className="flex items-start gap-2 text-[13px] text-muted-foreground mb-1">
                                <Palette color="black" />
                                <span>
                                    Interior Color
                                    <p className="font-bold text-[15px] text-black">
                                        {vehicle?.interior_color}
                                    </p>
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Body Style */}
                    {vehicle?.body_type && (
                        <div>
                            <div className="flex items-start gap-2 text-[13px] text-muted-foreground mb-1">
                                <svg
                                    className="w-5 h-5 text-black"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    fill="currentColor"
                                >
                                    <path d="M165.4 96h181.2c13.6 0 25.7 8.6 30.2 21.4l26.1 74.6H109.1l26.1-74.6c4.5-12.8 16.6-21.4 30.2-21.4zm-90.6.3L39.6 196.8C16.4 206.4 0 229.3 0 256v96c0 23.7 12.9 44.4 32 55.4V448c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32v-32h256v32c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32v-40.6c19.1-11.1 32-31.7 32-55.4v-96c0-26.7-16.4-49.6-39.6-59.2L437.2 96.3C423.7 57.8 387.4 32 346.6 32H165.4c-40.8 0-77.1 25.8-90.6 64.3zM208 288h96c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16h-96c-8.8 0-16-7.2-16-16v-32c0-8.8 7.2-16 16-16zM48 280c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24s-10.7 24-24 24H72c-13.3 0-24-10.7-24-24zm360-24h32c13.3 0 24 10.7 24 24s-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24s10.7-24 24-24z" />
                                </svg>
                                <span>
                                    Body Style
                                    <p className="font-bold text-[15px] text-black">
                                        {vehicle?.body_type}
                                    </p>
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Transmission */}
                    {vehicle?.transmission && (
                        <div>
                            <div className="flex items-start gap-2 text-[13px] text-muted-foreground mb-1">
                                <svg
                                    className="w-5 h-5 text-black"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 640 512"
                                    fill="currentColor"
                                >
                                    <path d="M415.9 210.5c12.2-3.3 25 2.5 30.5 13.8L465 261.9c10.3 1.4 20.4 4.2 29.9 8.1l35-23.3c10.5-7 24.4-5.6 33.3 3.3l19.2 19.2c8.9 8.9 10.3 22.9 3.3 33.3l-23.3 34.9c1.9 4.7 3.6 9.6 5 14.7 1.4 5.1 2.3 10.1 3 15.2l37.7 18.6c11.3 5.6 17.1 18.4 13.8 30.5l-7 26.2c-3.3 12.1-14.6 20.3-27.2 19.5l-42-2.7c-6.3 8.1-13.6 15.6-21.9 22l2.7 41.9c.8 12.6-7.4 24-19.5 27.2l-26.2 7c-12.2 3.3-24.9-2.5-30.5-13.8l-18.6-37.6c-10.3-1.4-20.4-4.2-29.9-8.1l-35 23.3c-10.5 7-24.4 5.6-33.3-3.3l-19.2-19.2c-8.9-8.9-10.3-22.8-3.3-33.3l23.3-35c-1.9-4.7-3.6-9.6-5-14.7s-2.3-10.2-3-15.2l-37.7-18.6c-11.3-5.6-17-18.4-13.8-30.5l7-26.2c3.3-12.1 14.6-20.3 27.2-19.5l41.9 2.7c6.3-8.1 13.6-15.6 21.9-22l-2.7-41.8c-.8-12.6 7.4-24 19.5-27.2l26.2-7zM448.4 340a44 44 0 1 0 .1 88 44 44 0 1 0-.1-88zM224.9-45.5l26.2 7c12.1 3.3 20.3 14.7 19.5 27.2l-2.7 41.8c8.3 6.4 15.6 13.8 21.9 22l42-2.7c12.5-.8 23.9 7.4 27.2 19.5l7 26.2c3.2 12.1-2.5 24.9-13.8 30.5l-37.7 18.6c-.7 5.1-1.7 10.2-3 15.2s-3.1 10-5 14.7l23.3 35c7 10.5 5.6 24.4-3.3 33.3L307.3 262c-8.9 8.9-22.8 10.3-33.3 3.3L239 242c-9.5 3.9-19.6 6.7-29.9 8.1l-18.6 37.6c-5.6 11.3-18.4 17-30.5 13.8l-26.2-7c-12.2-3.3-20.3-14.7-19.5-27.2l2.7-41.9c-8.3-6.4-15.6-13.8-21.9-22l-42 2.7c-12.5.8-23.9-7.4-27.2-19.5l-7-26.2c-3.2-12.1 2.5-24.9 13.8-30.5l37.7-18.6c.7-5.1 1.7-10.1 3-15.2 1.4-5.1 3-10 5-14.7L55.1 46.5c-7-10.5-5.6-24.4 3.3-33.3L77.6-6c8.9-8.9 22.8-10.3 33.3-3.3l35 23.3c9.5-3.9 19.6-6.7 29.9-8.1l18.6-37.6c5.6-11.3 18.3-17 30.5-13.8zM192.4 84a44 44 0 1 0 0 88 44 44 0 1 0 0-88z" />
                                </svg>
                                <span>
                                    Transmission
                                    <p className="font-bold text-[15px] text-black">
                                        {vehicle?.transmission}
                                    </p>
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Drivetrain */}
                    {vehicle?.drivetrain && (
                        <div>
                            <div className="flex items-start gap-2 text-[13px] text-muted-foreground mb-1">
                                <Radiation color="black" />
                                <span>
                                    Drivetrain
                                    <p className="font-bold text-[15px] text-black">
                                        {vehicle?.drivetrain}
                                    </p>
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Fuel Type */}
                    {vehicle?.fuel_type && (
                        <div>
                            <div className="flex items-start gap-2 text-[13px] text-muted-foreground mb-1">
                                <Fuel color="black" />
                                <span>
                                    Fuel Type
                                    <p className="font-bold text-[15px] text-black">
                                        {vehicle?.fuel_type}
                                    </p>
                                </span>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

export default AboutVehicle;
