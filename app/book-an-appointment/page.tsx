"use client"

import { GetInTouch } from '@/components/common';
import { Footer, Header } from '@/components/layout';
import React, { useState } from 'react';

interface VehicleFormState {
  year: string;
  make: string;
  model: string;
  trim: string;
  odometer: string;
}

// 1. Define the fields as a constant tuple using 'as const' 
// so TypeScript knows exactly what values are allowed.
const SELECT_FIELDS = ['year', 'make', 'model', 'trim'] as const;

const VehicleForm = () => {
  const [formData, setFormData] = useState<VehicleFormState>({
    year: '',
    make: '',
    model: '',
    trim: '',
    odometer: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const years = Array.from({ length: 80 }, (_, i) => 2027 - i);

  return (
    <>
      <Header />
      <div className="bg-white mx-auto mt-18 mb-32 tracking-wider">
        <h4 className="text-3xl my-4">What vehicle needs service or repair?</h4>
        <div className="space-y-6">
          <label className="block text-base">
            Provide the following details about your vehicle:
          </label>

          <div className="grid gap-6">
            {/* 2. Map over the strictly-typed fields */}
            {SELECT_FIELDS.map((field) => (
              <select
                key={field}
                name={field}
                className="w-full md:w-11/12 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 cursor-pointer appearance-none"
                onChange={handleChange}
                value={formData[field]} //  No more error!
              >
                <option value="" disabled>Select {field.charAt(0).toUpperCase() + field.slice(1)}</option>
                {field === 'year' && years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            ))}

            <input
              type="text"
              name="odometer"
              placeholder="Odometer"
              className="w-full md:w-11/12 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 cursor-pointer"
              onChange={handleChange}
              value={formData.odometer}
            />
          </div>

          <button className="mt-4 text-white py-3 px-10 rounded-xl bg-gradient-to-b from-[#00af66] to-[#00af66a6] transition-all cursor-pointer hover:opacity-90">
            GET STARTED
          </button>
        </div>
      </div>
      <GetInTouch />
      <Footer />
    </>

  );
};

export default VehicleForm;