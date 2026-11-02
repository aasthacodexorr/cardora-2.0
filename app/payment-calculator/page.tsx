'use client';

import { GetInTouch } from '@/components/common';
import { Footer, Header } from '@/components/layout';
import { useAppConfig } from '@/app/providers';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const ESSENTIAL_PACKAGE_PRICES: Record<'A' | 'B', number> = {
    A: 1799,
    B: 2499,
};

const SALES_TAX_RATE = 0.13; // 13% tax rate

export default function PaymentCalculator() {
    const appConfig = useAppConfig();
    // Input States
    const [vehiclePrice, setVehiclePrice] = useState<number>(appConfig?.payment_calculator?.vehicle_price);
    const [downPayment, setDownPayment] = useState<number>(appConfig?.payment_calculator?.downpayment);
    const [additionalFees, setAdditionalFees] = useState<number>(appConfig?.payment_calculator?.additional_fees ?? 0);
    const [packageClass, setPackageClass] = useState<'A' | 'B' | null>('A');
    const [gapFee, setGapFee] = useState<number>(0);
    const [warrantyCost, setWarrantyCost] = useState<number>(0);
    const [term, setTerm] = useState<number>(84);
    const [tradeInValue, setTradeInValue] = useState<number>(0);
    const [loanBalance, setLoanBalance] = useState<number>(0);
    const [apr, setApr] = useState<number>(7.99);
    const [includeTax, setIncludeTax] = useState<boolean>(false);

    // Output State
    const [biWeeklyPayment, setBiWeeklyPayment] = useState<string>('0.00');
    const [desiredPayment, setDesiredPayment] = useState<string>('');
    const [adjustmentMessage, setAdjustmentMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isAdjusting, setIsAdjusting] = useState<boolean>(false);

    // Loan Calculation Logic
    useEffect(() => {
        // Essential Package = Class A or Class B (if selected) + any manually entered additional fee
        const essentialPackageCost = (packageClass ? ESSENTIAL_PACKAGE_PRICES[packageClass] : 0) + additionalFees;

        // Total Principal = Vehicle Price + Essential Package + Gap Protection + Extended Warranty + Existing Loan Balance - Down Payment - Trade-in
        const basePrincipal =
            vehiclePrice +
            essentialPackageCost +
            gapFee +
            warrantyCost +
            loanBalance -
            downPayment -
            tradeInValue;

        // Simulate simple 13% tax add-on if checked (adjust rate as per your specific region)
        const totalPrincipal = includeTax ? basePrincipal * (1 + SALES_TAX_RATE) : basePrincipal;

        if (totalPrincipal <= 0 || term <= 0) {
            setBiWeeklyPayment('0.00');
            return;
        }

        // Convert Annual APR to a Bi-Weekly Interest Rate
        // There are 26 bi-weekly periods in a year
        const annualRate = apr / 100;
        const biWeeklyRate = annualRate / 26;

        // Convert Month term to total number of bi-weekly payments
        // Approximation: (Months * 12) / 26 periods a year -> or roughly Months * 2.166
        const totalPayments = (term / 12) * 26;

        let payment = 0;
        if (biWeeklyRate === 0) {
            payment = totalPrincipal / totalPayments;
        } else {
            // Standard Amortization Formula: P * (r(1+r)^n) / ((1+r)^n - 1)
            payment =
                (totalPrincipal * biWeeklyRate * Math.pow(1 + biWeeklyRate, totalPayments)) /
                (Math.pow(1 + biWeeklyRate, totalPayments) - 1);
        }

        setBiWeeklyPayment(payment.toFixed(2));
    }, [vehiclePrice, downPayment, additionalFees, packageClass, gapFee, warrantyCost, term, tradeInValue, loanBalance, apr, includeTax]);

    /**
     * Reverse calculation: Calculates the maximum affordable vehicle price based on desired bi-weekly payment
     * Using the inverse of the loan amortization formula
     */
    const handleAdjustBiWeekly = () => {
        setAdjustmentMessage(null);
        setIsAdjusting(true);

        try {
            // Validation
            const desiredPaymentNum = parseFloat(desiredPayment);

            if (!desiredPayment || isNaN(desiredPaymentNum)) {
                setAdjustmentMessage({
                    type: 'error',
                    text: 'Please enter a desired bi-weekly payment amount.',
                });
                setIsAdjusting(false);
                return;
            }

            if (desiredPaymentNum <= 0) {
                setAdjustmentMessage({
                    type: 'error',
                    text: 'Desired bi-weekly payment must be greater than zero.',
                });
                setIsAdjusting(false);
                return;
            }

            if (term <= 0) {
                setAdjustmentMessage({
                    type: 'error',
                    text: 'Invalid loan term.',
                });
                setIsAdjusting(false);
                return;
            }

            // Calculate non-vehicle costs
            const essentialPackageCost = (packageClass ? ESSENTIAL_PACKAGE_PRICES[packageClass] : 0) + additionalFees;
            const nonVehicleCosts = essentialPackageCost + gapFee + warrantyCost + loanBalance - downPayment - tradeInValue;

            // Convert APR to bi-weekly rate and calculate total payments
            const annualRate = apr / 100;
            const biWeeklyRate = annualRate / 26;
            const totalPayments = (term / 12) * 26;

            // Reverse Amortization Formula: Solve for Principal (P)
            // Original: Payment = P * (r(1+r)^n) / ((1+r)^n - 1)
            // Reverse: P = Payment * ((1+r)^n - 1) / (r(1+r)^n)

            let maxFinanceable = 0;

            if (biWeeklyRate === 0) {
                // For 0% APR: P = Payment * n
                maxFinanceable = desiredPaymentNum * totalPayments;
            } else {
                const raisedTerm = Math.pow(1 + biWeeklyRate, totalPayments);
                const denominator = biWeeklyRate * raisedTerm;
                const numerator = raisedTerm - 1;

                if (denominator === 0) {
                    setAdjustmentMessage({
                        type: 'error',
                        text: 'Unable to calculate due to invalid interest rate or term.',
                    });
                    setIsAdjusting(false);
                    return;
                }

                maxFinanceable = desiredPaymentNum * (numerator / denominator);
            }

            // Account for sales tax if enabled
            // If tax is included: totalPrincipal = (vehiclePrice + nonVehicleCosts) * (1 + taxRate)
            // Solve for vehiclePrice: vehiclePrice = (maxFinanceable / (1 + taxRate)) - nonVehicleCosts

            let affordableVehiclePrice = 0;

            if (includeTax) {
                affordableVehiclePrice = maxFinanceable / (1 + SALES_TAX_RATE) - nonVehicleCosts;
            } else {
                affordableVehiclePrice = maxFinanceable - nonVehicleCosts;
            }

            // Validation: Ensure calculated price is valid
            if (affordableVehiclePrice < 0) {
                setAdjustmentMessage({
                    type: 'error',
                    text: 'Your desired payment is too low to finance a vehicle with the current settings. Please increase the desired payment amount.',
                });
                setIsAdjusting(false);
                return;
            }

            // Update vehicle price and clear adjustment message after success
            setVehiclePrice(Math.round(affordableVehiclePrice * 100) / 100); // Round to 2 decimal places
            setAdjustmentMessage({
                type: 'success',
                text: `Vehicle price adjusted to $${(Math.round(affordableVehiclePrice * 100) / 100).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}. Your estimated bi-weekly payment will update automatically.`,
            });
        } catch (error) {
            setAdjustmentMessage({
                type: 'error',
                text: 'An error occurred during calculation. Please check your inputs.',
            });
        } finally {
            setIsAdjusting(false);
        }
    };

    return (
        <>
            {/* <Header /> */}
            <div className='bg-light-gray2'>
                <div className="lg:mt-20 mx-auto max-w-[1340px] px-4 lg:px-16 pt-8 pb-12 lg:pt-14 lg:pb-0 lg:py-12 font-sans text-gray-700 ">
                    <h1 className="text-3xl md:text-5xl font-bold mb-8 text-black">Payment Calculator</h1>

                    <div className=' bg-white'>
                        <div className="grid grid-cols-1 md:grid-cols-3">

                            {/* Left Form Column (Spans 2 columns) */}
                            <div className="md:col-span-2 bg-white px-6 py-10 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-x-7 border-r border-slate-200">

                                <div>
                                    <label className="block text-black  text-base font-lg mb-1">Vehicle Price</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-[12px] text-xl font-light text-input-text">$</span>
                                        <input
                                            type="number"
                                            value={vehiclePrice || ''}
                                            onChange={(e) => setVehiclePrice(Number(e.target.value))}
                                            className="w-full pl-8 pr-3 py-3 rounded-xl border border-border-lightGray transition-all duration-200 outline-none  focus:ring-4 focus:ring-blue-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-black text-base font-lg mb-1">Down Payment</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-[12px] text-xl font-light text-input-text">$</span>
                                        <input
                                            type="number"
                                            value={downPayment || ''}
                                            onChange={(e) => setDownPayment(Number(e.target.value))}
                                            className="w-full pl-8 pr-3 py-3 rounded-xl border border-border-lightGray focus:outline-none focus:ring-1  focus:ring-4 focus:ring-blue-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                {/* Essential Package - Class A / Class B toggle */}
                                <div>
                                    <label className="block text-black text-base font-lg mb-2">Essential Package</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {(['A', 'B'] as const).map((cls) => (
                                            <button
                                                key={cls}
                                                type="button"
                                                onClick={() => setPackageClass(packageClass === cls ? null : cls)}
                                                className={`flex items-center justify-between gap-6 min-w-[160px] px-4 lg:px-6 py-3 border rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer ${packageClass === cls
                                                    ? 'text-white border-none bg-brand-gradient'
                                                    : 'bg-white text-gray-700 border-slate-300 hover:bg-brand-gradient hover:text-white hover:border-transparent'
                                                    }`}
                                            >
                                                <span>Class {cls}</span>
                                                <span>$ {ESSENTIAL_PACKAGE_PRICES[cls].toLocaleString()}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-black text-base font-lg mb-1">Additional Package</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-[12px] text-xl font-light text-input-text">$</span>
                                        <input
                                            type="number"
                                            value={additionalFees || ''}
                                            placeholder="0.00"
                                            onChange={(e) => setAdditionalFees(Number(e.target.value))}
                                            className="w-full pl-8 pr-3 py-3 rounded-xl border border-border-lightGray focus:outline-none focus:ring-1  focus:ring-4 focus:ring-blue-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-black text-base font-lg mb-1">Gap Protection</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-[12px] text-xl font-light text-input-text">$</span>
                                        <input
                                            type="number"
                                            value={gapFee || ''}
                                            onChange={(e) => setGapFee(Number(e.target.value))}
                                            className="w-full pl-8 pr-3 py-3 rounded-xl border border-border-lightGray focus:outline-none focus:ring-1  focus:ring-4 focus:ring-blue-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-black text-base font-lg mb-1">Extended Warranty</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-[12px] text-xl font-light text-input-text">$</span>
                                        <input
                                            type="number"
                                            value={warrantyCost || ''}
                                            onChange={(e) => setWarrantyCost(Number(e.target.value))}
                                            className="w-full pl-8 pr-3 py-3 rounded-xl border border-border-lightGray focus:outline-none focus:ring-1  focus:ring-4 focus:ring-blue-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-black text-base font-lg mb-1">Estimated APR</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={apr}
                                            onChange={(e) => setApr(Number(e.target.value))}
                                            className="w-full pl-8 pr-3 py-3 rounded-xl border border-border-lightGray focus:outline-none focus:ring-1  focus:ring-4 focus:ring-blue-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <span className="absolute right-3 top-[12px] text-input-text">%</span>
                                    </div>
                                </div>

                                {/* Term Radio Toggle Buttons */}
                                <div className="sm:col-span-2">
                                    <label className="block text-black text-base font-medium mb-3 text-black">Term (Months)</label>
                                    <div className="flex flex-wrap gap-1 p-1">
                                        {[12, 24, 36, 48, 60, 72, 84, 96].map((m) => {
                                            return (
                                                <button
                                                    key={m}
                                                    type="button"
                                                    onClick={() => setTerm(m)}
                                                    className={`px-7 py-3 text-sm font-medium rounded-xl cursor-pointer border transition-colors duration-200 ${term === m
                                                        ? 'text-white border-brand bg-brand-gradient'
                                                        : 'border-slate-300 text-gray-700 hover:bg-brand-gradient hover:text-white hover:border-transparent'
                                                        }`}
                                                >
                                                    {m}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-black text-base font-lg mb-1">Trade-In Value</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-[12px] text-xl font-light text-input-text">$</span>
                                        <input
                                            type="number"
                                            value={tradeInValue || ''}
                                            onChange={(e) => setTradeInValue(Number(e.target.value))}
                                            className="w-full pl-8 pr-3 py-3 rounded-xl border border-border-lightGray focus:outline-none focus:ring-1 focus: -blue-400 focus:ring-4 focus:ring-blue-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-black text-base font-lg mb-1">Existing vehicle loan balance</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-[12px] text-xl font-light text-input-text">$</span>
                                        <input
                                            type="number"
                                            value={loanBalance || ''}
                                            onChange={(e) => setLoanBalance(Number(e.target.value))}
                                            className="w-full pl-8 pr-3 py-3 rounded-xl border border-border-lightGray focus:outline-none focus:ring-1  focus:ring-4 focus:ring-blue-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2 flex items-center mt-2">
                                    <input
                                        id="sales-tax"
                                        type="checkbox"
                                        checked={includeTax}
                                        onChange={(e) => setIncludeTax(e.target.checked)}
                                        className="h-4 w-4 text-emerald-600 "
                                    />
                                    <label htmlFor="sales-tax" className="ml-2 text-base font-medium text-gray-700 select-none">
                                        Include Sales Tax
                                    </label>
                                </div>

                            </div>

                            {/* Right Output Sidebar Box */}
                            <div className="bg-white px-8 lg:px-6 lg:py-9 flex flex-col justify-between h-fit text-center">
                                <div>
                                    <p className="text-xl lg:text-sm tracking-wider mb-4">
                                        Based on your input, your estimated payment:
                                    </p>
                                    <h4 className="text-md font-semibold text-gray-600 mt-8 mb-2">Bi-Weekly Payment</h4>
                                    <h3 className="text-4xl font-bold text-gray-900 mb-8">${biWeeklyPayment}</h3>

                                    <Link href={"/financing"}>

                                        <button className="w-full cursor-pointer text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm mb-6 hover:brightness-95 bg-brand-gradient">
                                            Get pre-approved
                                        </button>


                                    </Link>
                                </div>

                                <div className=" ">
                                    <label className="block text-base mb-2 text-left">Desired Bi-Weekly Payment</label>
                                    <div className="relative mb-3">
                                        <span className="absolute left-3 top-[9px] text-input-text">$</span>
                                        <input
                                            type="number"
                                            value={desiredPayment}
                                            onChange={(e) => setDesiredPayment(e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1  focus:ring-4 focus:ring-blue-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAdjustBiWeekly}
                                        disabled={isAdjusting}
                                        className=" bg-black hover:bg-gray-800 disabled:bg-gray-500 text-white text-xs font-bold py-4 px-4 rounded-xl cursor-pointer uppercase tracking-wider transition-colors w-full"
                                    >
                                        {isAdjusting ? 'Adjusting...' : 'Adjust Bi-Weekly'}
                                    </button>
                                    
                                    {/* Adjustment Message */}
                                    {adjustmentMessage && (
                                        <div className={`mt-4 p-3 rounded-md text-sm font-medium ${
                                            adjustmentMessage.type === 'success'
                                                ? 'bg-green-50 text-green-800 border border-green-200'
                                                : 'bg-red-50 text-red-800 border border-red-200'
                                        }`}>
                                            {adjustmentMessage.text}
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Disclosures Section */}
                        <div className="px-6 pt-4 lg:pt-6 pb-14">
                            <p className="font-semibold mb-1 text-gray-700 text-base">Finance disclosures</p>
                            <p className='text-sm leading-relaxed'>
                                The payment estimator is not an advertisement or offer for specific terms of credit and actual terms may vary. Payment amounts presented are for illustrative purposes only and may not be available. Actual vehicle price may vary by Dealer. The Estimated Monthly Payment amount calculated is based on the variables entered, the price of the vehicle you entered, the term you select, the down payment you enter, the Annual Percentage Rate (APR) you select, and any net trade-in amount. The payment estimate displayed does not include taxes, title, license and/or registration fees. Payment amount is for illustrative purposes only. Actual prices may vary by Dealer. Payment amounts may be different due to various factors such as fees, specials, rebates, term, down payment, APR, net trade-in, and applicable tax rate. Actual APR is based on available finance programs and the creditworthiness of the customer. Not all customers will qualify for credit or for the lowest rate. Please contact an authorized dealer for actual rates, program details and actual terms.
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            {/* <Footer /> */}
        </>
    );
}
