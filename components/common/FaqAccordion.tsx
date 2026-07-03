'use client';
import { useState } from 'react';

export interface FAQItem {
  q?: string;
  question?: string;
  a?: string;
  answer?: string;
}

export default function FaqAccordion({ faqs }: { faqs: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const questionText = faq.q || faq.question;
        const answerText = faq.a || faq.answer;

        return (
          <div
            key={index}
            className="border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-[#e6f4ff] hover:shadow-md transition-all duration-300"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className={`w-full px-6 py-4 text-left font-semibold flex justify-between items-center transition-colors duration-300 cursor-pointer ${
                isOpen ? 'text-slate-900' : 'text-slate-500/80  '
              }`}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="flex-1 text-xl">{questionText}</span>
              <span
                className={`text-xl transition-transform duration-300 flex-shrink-0 ml-4 ease-in-out ${
                  isOpen ? 'rotate-180' : ''
                }`}
              >
                +
              </span>
            </button>
            
            {/* Smooth Height Container */}
            <div
              id={`faq-answer-${index}`}
              className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-4 leading-relaxed text-slate-700">
                  {answerText}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}