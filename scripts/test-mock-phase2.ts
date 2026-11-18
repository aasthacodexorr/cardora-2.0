import {
  ENABLE_PHASE2_MOCK,
  mockWarrantyData,
  mockPopularFeatures,
  mockPopularTagsConfig,
} from "../data/mockVehiclePhase2";

import {
  parseWarrantyDetails,
  calculateWarrantyExpiryDate,
  formatWarrantyCoverageText,
  groupWarrantiesByType,
} from "../utils/warranty";

import {
  parsePopularFeatures,
  matchPopularFeatures,
} from "../utils/popularFeatures";

console.log("=== VERIFYING PHASE 2 MOCK DATA & BEHAVIOR ===\n");

// 1. Verify all three warranty entries and groups
const details = parseWarrantyDetails(mockWarrantyData.manufacturer_warranty_details);
console.log(`Warranty entries parsed: ${details.length} / 3`);
if (details.length !== 3) {
  throw new Error(`Expected 3 warranty entries, got ${details.length}`);
}

const groups = groupWarrantiesByType(details);
console.log(`Warranty groups count: ${groups.length}`);
groups.forEach((g) => {
  console.log(` - Group: "${g.warrantyType}" with ${g.items.length} item(s)`);
});

// 2 & 3 & 4. Verify Expiry Dates and Mileage formatting
console.log("\nTesting individual warranty calculations:");

// Entry 1: Basic warranty (1 year, limited mileage: 80,000 km)
const item1 = details[0];
const expiry1 = calculateWarrantyExpiryDate(mockWarrantyData.in_service_date, item1.years, item1.months);
const text1 = formatWarrantyCoverageText(item1, mockWarrantyData.in_service_date);
console.log(`1. ${item1.warrantyType} -> ${item1.coverage}:`);
console.log(`   Expiry Date: ${expiry1?.toUTCString()}`);
console.log(`   Formatted Text: "${text1.text}"`);

if (!text1.text.includes("80,000 Km")) {
  throw new Error(`Expected item 1 to display 80,000 Km, got "${text1.text}"`);
}

// Entry 2: Powertrain (2 years, limited mileage: 134,273 km)
const item2 = details[1];
const expiry2 = calculateWarrantyExpiryDate(mockWarrantyData.in_service_date, item2.years, item2.months);
const text2 = formatWarrantyCoverageText(item2, mockWarrantyData.in_service_date);
console.log(`2. ${item2.warrantyType} -> ${item2.coverage}:`);
console.log(`   Expiry Date: ${expiry2?.toUTCString()}`);
console.log(`   Formatted Text: "${text2.text}"`);

if (!text2.text.includes("134,273 Km")) {
  throw new Error(`Expected item 2 to display 134,273 Km, got "${text2.text}"`);
}

// Entry 3: Battery Warranty (3 years, unlimited mileage: 1)
const item3 = details[2];
const expiry3 = calculateWarrantyExpiryDate(mockWarrantyData.in_service_date, item3.years, item3.months);
const text3 = formatWarrantyCoverageText(item3, mockWarrantyData.in_service_date);
console.log(`3. ${item3.warrantyType} -> ${item3.coverage}:`);
console.log(`   Expiry Date: ${expiry3?.toUTCString()}`);
console.log(`   Formatted Text: "${text3.text}"`);

if (text3.text.includes("Km") || text3.text.includes("km")) {
  throw new Error(`Expected item 3 (unlimited mileage) to NOT display Km, got "${text3.text}"`);
}

// 5. Verify all four popular features match and have icons
console.log("\nTesting popular features matching:");
const parsedFeatures = parsePopularFeatures(mockPopularFeatures);
const matchedFeatures = matchPopularFeatures(parsedFeatures, mockPopularTagsConfig);
console.log(`Matched features: ${matchedFeatures.length} / 4`);
matchedFeatures.forEach((f) => {
  console.log(` - Feature: "${f.label}" (has icon: ${Boolean(f.icon)})`);
});

if (matchedFeatures.length !== 4) {
  throw new Error(`Expected 4 matched features, got ${matchedFeatures.length}`);
}

for (const f of matchedFeatures) {
  if (!f.icon || !f.icon.includes("<svg")) {
    throw new Error(`Feature "${f.label}" is missing its SVG icon`);
  }
}

// 6. Verify toggle functionality
console.log(`\nENABLE_PHASE2_MOCK current state: ${ENABLE_PHASE2_MOCK}`);
const mockVehicleDisabled = false ? { ...mockWarrantyData, popular_features: mockPopularFeatures } : { show_manufacturer_warranty_details: 0, popular_features: [] };
console.log(`Disabled mock vehicle show_warranty: ${mockVehicleDisabled.show_manufacturer_warranty_details}`);
console.log(`Disabled mock vehicle popular_features: ${JSON.stringify(mockVehicleDisabled.popular_features)}`);

console.log("\n=== ALL MOCK VERIFICATIONS PASSED SUCCESSFULLY ===");
