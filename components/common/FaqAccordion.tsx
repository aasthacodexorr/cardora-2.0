'use client';
import { useState } from 'react';
import { FAQItem } from '@/constants/serviceData';

export default function FaqAccordion({ faqs }: { faqs: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-[#e6f4ff] hover:shadow-md transition-all"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full px-6 py-4 text-left font-semibold text-slate-900 flex justify-between items-center transition-colors cursor-pointer"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="flex-1 text-xl">{faq.q}</span>
              <span
                className={`text-2xl transition-transform duration-300 flex-shrink-0 ml-4 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              >
                +
              </span>
            </button>
            <div
              id={`faq-answer-${index}`}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="px-6 pb-4 leading-relaxed">
                {faq.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
