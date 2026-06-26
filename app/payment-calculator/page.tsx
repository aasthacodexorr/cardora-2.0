'use client';

import { GetInTouch } from '@/components/common';
import { Footer, Header } from '@/components/layout';
import { appConfig } from '@/lib/appConfig';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function PaymentCalculator() {
    // Input States
    const [vehiclePrice, setVehiclePrice] = useState<number>(appConfig?.payment_calculator?.vehicle_price);
    const [downPayment, setDownPayment] = useState<number>(appConfig?.payment_calculator?.downpayment);
    const [additionalFees, setAdditionalFees] = useState<number>(appConfig?.payment_calculator?.additional_fees);
    const [financeFee, setFinanceFee] = useState<number>(999);
    const [gapFee, setGapFee] = useState<number>(1999);
    const [warrantyCost, setWarrantyCost] = useState<number>(0);
    const [term, setTerm] = useState<number>(84);
    const [tradeInValue, setTradeInValue] = useState<number>(0);
    const [loanBalance, setLoanBalance] = useState<number>(0);
    const [creditScore, setCreditScore] = useState<string>('Excellent');
    const [apr, setApr] = useState<number>(7.99);
    const [includeTax, setIncludeTax] = useState<boolean>(false);

    // Output State
    const [biWeeklyPayment, setBiWeeklyPayment] = useState<string>('0.00');
    const [desiredPayment, setDesiredPayment] = useState<string>('');

    // Loan Calculation Logic
    useEffect(() => {
        // Total Principal = Vehicle Price + Fees + Existing Loan Balance - Down Payment - Trade-in
        const basePrincipal =
            vehiclePrice +
            additionalFees +
            financeFee +
            gapFee +
            warrantyCost +
            loanBalance -
            downPayment -
            tradeInValue;

        // Simulate simple 13% tax add-on if checked (adjust rate as per your specific region)
        const totalPrincipal = includeTax ? basePrincipal * 1.13 : basePrincipal;

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
    }, [vehiclePrice, downPayment, additionalFees, financeFee, gapFee, warrantyCost, term, tradeInValue, loanBalance, apr, includeTax]);

    return (
        <>
            <Header />
            <div className="lg:mt-28 mx-auto px-5 lg:px-16 py-8 lg:py-12 bg-[#f4f4f4] shadow-sm font-sans text-gray-700">
                <h1 className="text-3xl md:text-5xl font-bold mb-8 text-black">Payment Calculator</h1>

                <div className=' bg-white'>
                    <div className="grid grid-cols-1 md:grid-cols-3">

                    {/* Left Form Column (Spans 2 columns) */}
                    <div className="md:col-span-2 bg-white px-6 py-10 grid grid-cols-1 sm:grid-cols-2 gap-4 border-r border-slate-200">

                        <div>
                            <label className="block text-base font-lg mb-1">Vehicle Price</label>
                            <div className="relative">
                                <span className="absolute left-3 top-[9px] text-black">$</span>
                                <input
                                    type="number"
                                    value={vehiclePrice || ''}
                                    onChange={(e) => setVehiclePrice(Number(e.target.value))}
                                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md transition-all duration-200 outline-none  focus:ring-4 focus:ring-blue-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-base font-lg mb-1">Down Payment</label>
                            <div className="relative">
                                <span className="absolute left-3 top-[9px] text-black">$</span>
                                <input
                                    type="number"
                                    value={downPayment || ''}
                                    onChange={(e) => setDownPayment(Number(e.target.value))}
                                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1  focus:ring-4 focus:ring-blue-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-base font-lg mb-1">Additional Fees</label>
                            <div className="relative">
                                <span className="absolute left-3 top-[9px] text-black">$</span>
                                <input
                                    type="number"
                                    value={additionalFees || ''}
                                    placeholder="0.00"
                                    onChange={(e) => setAdditionalFees(Number(e.target.value))}
                                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1  focus:ring-4 focus:ring-blue-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-base font-lg mb-1">Finance Fee</label>
                            <div className="relative">
                                <span className="absolute left-3 top-[9px] text-black">$</span>
                                <input
                                    type="number"
                                    value={financeFee || ''}
                                    placeholder="0.00"
                                    onChange={(e) => setFinanceFee(Number(e.target.value))}
                                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1  focus:ring-4 focus:ring-blue-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-base font-lg mb-1">Gap Fee</label>
                            <div className="relative">
                                <span className="absolute left-3 top-[9px] text-black">$</span>
                                <input
                                    type="number"
                                    value={gapFee || ''}
                                    onChange={(e) => setGapFee(Number(e.target.value))}
                                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1  focus:ring-4 focus:ring-blue-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-base font-lg mb-1">Warranty Cost</label>
                            <div className="relative">
                                <span className="absolute left-3 top-[9px] text-black">$</span>
                                <input
                                    type="number"
                                    value={warrantyCost || ''}
                                    onChange={(e) => setWarrantyCost(Number(e.target.value))}
                                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1  focus:ring-4 focus:ring-blue-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {/* Term Radio Toggle Buttons */}
                            <div className="sm:col-span-2">
                                <label className="block text-base font-medium mb-3 text-slate-700">Term (Months)</label>
                                <div className="flex flex-wrap gap-1 p-1">
                                    {[12, 24, 36, 48, 60, 72, 84, 96].map((m) => {
                                        return (
                                            <button
                                                key={m}
                                                type="button"
                                                onClick={() => setTerm(m)}
                                                className={`px-7 py-3 text-sm font-medium rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.1)] cursor-pointer border transition-all duration-200 border-slate-300 text-gray-700 hover:border-slate-400 hover:shadow-[0_4px_0_0_#00af66] ${term === m
                                                    ? 'border-[#00af66] bg-gradient-to-b from-[#00af66] to-[#00af66a6] text-white'
                                                    : ''
                                                    }`}
                                            >
                                                {m}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                        <div>
                            <label className="block text-base font-lg mb-1">Trade-In Value</label>
                            <div className="relative">
                                <span className="absolute left-3 top-[9px] text-black">$</span>
                                <input
                                    type="number"
                                    value={tradeInValue || ''}
                                    onChange={(e) => setTradeInValue(Number(e.target.value))}
                                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus: -blue-400 focus:ring-4 focus:ring-blue-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-base font-lg mb-1">Existing vehicle loan balance</label>
                            <div className="relative">
                                <span className="absolute left-3 top-[9px] text-black">$</span>
                                <input
                                    type="number"
                                    value={loanBalance || ''}
                                    onChange={(e) => setLoanBalance(Number(e.target.value))}
                                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1  focus:ring-4 focus:ring-blue-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {/* Credit Score Toggles */}
                        <div className="sm:col-span-2">
                            <label className="block text-base font-lg mb-2">Approx. Credit Score</label>
                            <div className="flex gap-2 w-[50%]">
                                {['Poor', 'Fair', 'Good', 'Excellent'].map((score) => (
                                    <button
                                        key={score}
                                        type="button"
                                        onClick={() => {
                                            setCreditScore(score);
                                            // Match estimated APR shifts based on credit tir
                                            if (score === 'Excellent') setApr(4.99);
                                            if (score === 'Good') setApr(5.99);
                                            if (score === 'Fair') setApr(9.99);
                                            if (score === 'Poor') setApr(14.99);
                                        }}
                                        className={`px-4 lg:px-6 py-2 border border-slate-300 rounded-xl text-sm font-medium transition-colors  cursor-pointer ${creditScore === score
                                                ? 'bg-gradient-to-b from-[#00af66] to-[#00af66a6] hover:bg-[#0f9f6e] text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {score}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-base font-lg mb-1">Estimated APR</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    value={apr}
                                    onChange={(e) => setApr(Number(e.target.value))}
                                    className="w-full pr-8 pl-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1  focus:ring-4 focus:ring-blue-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <span className="absolute right-3 top-[9px] text-black">%</span>
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
                    <div className="bg-white px-2 lg:px-6 lg:py-9 flex flex-col justify-between h-fit text-center">
                        <div>
                            <p className="text-xl lg:text-sm tracking-wider mb-4">
                                Based on your input, your estimated payment:
                            </p>
                            <h4 className="text-md font-semibold text-gray-600 my-8">Bi-Weekly Payment</h4>
                            <h3 className="text-4xl font-bold text-gray-900 mb-8">${biWeeklyPayment}</h3>

                            <Link href={"/finance"}>

                            <button  className="w-full cursor-pointer bg-gradient-to-b from-[#00af66] to-[#00af66a6] hover:bg-[#0f9f6e] text-white font-semibold py-3 px-4 rounded-md transition-colors shadow-sm mb-6">
                                Get pre-approved
                            </button>
                            


                            </Link>
                        </div>

                        <div className=" ">
                            <label className="block text-base mb-2 text-left">Desired Bi-Weekly Payment</label>
                            <div className="relative mb-3">
                                <span className="absolute left-3 top-[9px] text-black">$</span>
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
                                className=" bg-black hover:bg-gray-800 text-white text-xs font-bold py-4 px-4 rounded-xl cursor-pointer uppercase tracking-wider transition-colors"
                            >
                                Adjust Bi-Weekly
                            </button>
                        </div>
                    </div>

                </div>

                {/* Disclosures Section */}
                <div className="px-6 lg:pt-6 pb-14">
                    <p className="font-semibold mb-1 text-gray-700 text-base">Finance disclosures</p>
                    <p className='text-sm leading-relaxed'>
                        The payment estimator is not an advertisement or offer for specific terms of credit and actual terms may vary. Payment amounts presented are for illustrative purposes only and may not be available. Actual vehicle price may vary by Dealer. The Estimated Monthly Payment amount calculated is based on the variables entered, the price of the vehicle you entered, the term you select, the down payment you enter, the Annual Percentage Rate (APR) you select, and any net trade-in amount. The payment estimate displayed does not include taxes, title, license and/or registration fees. Payment amount is for illustrative purposes only. Actual prices may vary by Dealer. Payment amounts may be different due to various factors such as fees, specials, rebates, term, down payment, APR, net trade-in, and applicable tax rate. Actual APR is based on available finance programs and the creditworthiness of the customer. Not all customers will qualify for credit or for the lowest rate. Please contact an authorized dealer for actual rates, program details and actual terms.
                    </p>
                </div>
                </div>
            </div>

            <GetInTouch/>
            <Footer />
        </>
    );
}