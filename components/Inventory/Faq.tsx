"use client";

import React, { useState } from 'react';

interface AccordionProps {
  standardJson: string;          // From vehicle.standard
  techSpecsJson: string;         // From vehicle.technical_specification
  optionalJson: string;          // From vehicle.optional
}

// Cleans up the features and completely removes keys with empty data
function safeParseJson(jsonString: any): Record<string, string[]> {
  if (!jsonString) return {};
  
  try {
    // 1. If it's a string, parse it first
    let parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
    
    // 2. Look for an intermediate wrapper key like {"Specifications": {...}} and unwrap it
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const keys = Object.keys(parsed);
      if (keys.length === 1 && typeof parsed[keys[0]] === 'object' && !Array.isArray(parsed[keys[0]])) {
        parsed = parsed[keys[0]]; 
      }
    }

    const normalized: Record<string, string[]> = {};

    // 3. Process each category and clean the values
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      for (const [key, value] of Object.entries(parsed)) {
        let cleanedItems: string[] = [];

        if (Array.isArray(value)) {
          cleanedItems = value.map(item => String(item));
        } else if (value && typeof value === 'object') {
          cleanedItems = Object.entries(value)
            .map(([subKey, subVal]) => {
              if (subVal === 1 || subVal === "1" || subVal === true) {
                return subKey;
              }
              if (subVal === 0 || subVal === "0" || subVal === false) {
                return `No ${subKey}`;
              }
              return `${subKey}: ${String(subVal)}`;
            });
        } else if (value !== null && value !== undefined) {
          if (value === 1 || value === "1" || value === true) {
            cleanedItems = [key];
          } else {
            cleanedItems = [String(value)];
          }
        }

        // ONLY add the subcategory to our output if it actually has feature strings inside
        if (cleanedItems.length > 0) {
          normalized[key] = cleanedItems;
        }
      }
      return normalized;
    }

    return {};
  } catch (e) {
    console.error("Failed to parse vehicle specifications JSON:", e);
    return {};
  }
}

export default function VehicleSpecificationsAccordion({
  standardJson,
  techSpecsJson,
  optionalJson
}: AccordionProps) {
  
  const parsedStandard = safeParseJson(standardJson);
  const parsedTechSpecs = safeParseJson(techSpecsJson);
  const parsedOptional = safeParseJson(optionalJson);

  const categoriesData = {
    standard: { label: "Standard", data: parsedStandard },
    techSpecs: { label: "Technical Specifications", data: parsedTechSpecs },
    optional: { label: "Vehicle Options", data: parsedOptional },
    custom: { label: "Custom Features", data: {} }
  };

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    standard: false, 
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full max-w-[800px] font-sans space-y-2 select-none">
      {Object.entries(categoriesData).map(([key, config]) => {
        const subCategories = config.data;
        const hasContent = Object.keys(subCategories).length > 0;

        // CONDITIONAL RENDER: If this entire main specification group has no features, skip it completely!
        if (!hasContent) return null;

        const isOpen = !!openSections[key];

        return (
          <div key={key} className="border border-gray-200 rounded overflow-hidden shadow-sm">
            <button
              onClick={() => toggleSection(key)}
              className="w-full bg-[#00a651] cursor-pointer text-white font-semibold text-[14px] px-4 py-3 flex items-center justify-between"
            >
              <span className="tracking-wide">{config.label}</span>
              <div className="flex items-center justify-center w-5 h-5">
                {isOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </div>
            </button>

            {isOpen && (
              <div className="bg-white px-5 py-4">
                <div className="space-y-5">
                  {Object.entries(subCategories).map(([subTitle, itemsList]) => (
                    <div key={subTitle} className="space-y-2.5">
                      <h4 className="text-gray-900 font-bold text-[13px] tracking-tight border-b border-gray-100 pb-1">
                        {subTitle}
                      </h4>

                      <div className="space-y-2">
                        {itemsList?.map((feature, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center justify-between text-[12px] font-medium text-gray-700 hover:bg-gray-50/60 py-0.5 px-1 rounded transition-colors"
                          >
                            <span>{feature}</span>
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="w-4 h-4 text-[#00a651] stroke-[2.5] flex-shrink-0 ml-4" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}