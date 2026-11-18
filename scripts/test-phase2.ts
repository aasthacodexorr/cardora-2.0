import {
  parseWarrantyDetails,
  parseInServiceDate,
  calculateWarrantyExpiryDate,
  formatRemainingDuration,
  isUnlimitedMileage,
  formatWarrantyCoverageText,
  groupWarrantiesByType,
} from "../utils/warranty";

import {
  parsePopularFeatures,
  matchPopularFeatures,
} from "../utils/popularFeatures";

import { PopularFeatureTag } from "../types/vehicle";

let failed = 0;
let passed = 0;

function assert(condition: boolean, testName: string, details?: any) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}`, details || "");
    failed++;
  }
}

console.log("=== RUNNING PHASE 2 VEHICLE DETAILS TEST SUITE ===\n");

// Helper to check whether WarrantyStatus would render
function shouldRenderWarranty(vehicle: any): boolean {
  const isEnabled =
    vehicle?.show_manufacturer_warranty_details === 1 ||
    vehicle?.show_manufacturer_warranty_details === "1" ||
    vehicle?.show_manufacturer_warranty_details === true ||
    vehicle?.show_manufacturer_warranty_details === "true";

  if (!isEnabled) return false;
  const details = parseWarrantyDetails(vehicle?.manufacturer_warranty_details);
  return details.length > 0;
}

// 1. Warranty toggle disabled
{
  const v1 = { show_manufacturer_warranty_details: 0, manufacturer_warranty_details: [{ coverage: "Engine" }] };
  const v2 = { show_manufacturer_warranty_details: "0", manufacturer_warranty_details: [{ coverage: "Engine" }] };
  const v3 = { show_manufacturer_warranty_details: false, manufacturer_warranty_details: [{ coverage: "Engine" }] };
  const v4 = { show_manufacturer_warranty_details: null, manufacturer_warranty_details: [{ coverage: "Engine" }] };
  const v5 = { manufacturer_warranty_details: [{ coverage: "Engine" }] };

  assert(!shouldRenderWarranty(v1), "Test 1a: Toggle disabled (0) does not render");
  assert(!shouldRenderWarranty(v2), "Test 1b: Toggle disabled ('0') does not render");
  assert(!shouldRenderWarranty(v3), "Test 1c: Toggle disabled (false) does not render");
  assert(!shouldRenderWarranty(v4), "Test 1d: Toggle disabled (null) does not render");
  assert(!shouldRenderWarranty(v5), "Test 1e: Toggle disabled (undefined) does not render");
}

// 2. Warranty toggle enabled
{
  const details = [
    {
      warranty_type: "Original Manufacturer Warranty",
      coverage: "Engine, transmission, & drivetrain",
      years: "1",
      months: "0",
      mileage_limit: "134273",
      is_unlimited_mileage: "0",
    },
  ];
  const v1 = { show_manufacturer_warranty_details: 1, manufacturer_warranty_details: details };
  const v2 = { show_manufacturer_warranty_details: "1", manufacturer_warranty_details: details };
  const v3 = { show_manufacturer_warranty_details: true, manufacturer_warranty_details: details };
  const v4 = { show_manufacturer_warranty_details: "true", manufacturer_warranty_details: details };

  assert(shouldRenderWarranty(v1), "Test 2a: Toggle enabled (1) renders");
  assert(shouldRenderWarranty(v2), "Test 2b: Toggle enabled ('1') renders");
  assert(shouldRenderWarranty(v3), "Test 2c: Toggle enabled (true) renders");
  assert(shouldRenderWarranty(v4), "Test 2d: Toggle enabled ('true') renders");
}

// 3. Empty warranty details
{
  const vEmptyArr = { show_manufacturer_warranty_details: 1, manufacturer_warranty_details: [] };
  const vEmptyStr = { show_manufacturer_warranty_details: 1, manufacturer_warranty_details: "" };
  const vEmptyJson = { show_manufacturer_warranty_details: 1, manufacturer_warranty_details: "[]" };
  const vNull = { show_manufacturer_warranty_details: 1, manufacturer_warranty_details: null };

  assert(!shouldRenderWarranty(vEmptyArr), "Test 3a: Empty array does not render");
  assert(!shouldRenderWarranty(vEmptyStr), "Test 3b: Empty string does not render");
  assert(!shouldRenderWarranty(vEmptyJson), "Test 3c: Empty JSON array string does not render");
  assert(!shouldRenderWarranty(vNull), "Test 3d: Null details does not render");
}

// 4. Single warranty entry
{
  const single = [
    {
      warranty_type: "Original Manufacturer Warranty",
      coverage: "Engine, transmission, & drivetrain",
      years: "1",
      months: "0",
      mileage_limit: "134273",
      is_unlimited_mileage: "0",
    },
  ];
  const parsed = parseWarrantyDetails(single);
  assert(parsed.length === 1, "Test 4a: Parses single warranty entry");
  const groups = groupWarrantiesByType(parsed);
  assert(groups.length === 1 && groups[0].warrantyType === "Original Manufacturer Warranty", "Test 4b: Groups single warranty under its type");
  assert(groups[0].items.length === 1, "Test 4c: Group contains single item");
}

// 5. Multiple warranty entries
{
  const multiple = [
    {
      warranty_type: "Original Manufacturer Warranty",
      coverage: "Engine, transmission, & drivetrain",
      years: "1",
      months: "0",
      mileage_limit: "134273",
      is_unlimited_mileage: "0",
    },
    {
      warranty_type: "Powertrain",
      coverage: "High-voltage battery",
      years: "2",
      months: "0",
      mileage_limit: "134259",
      is_unlimited_mileage: "1",
    },
    {
      warranty_type: "Corrosion",
      coverage: "Perforation sheet metal",
      years: "5",
      months: "0",
      mileage_limit: "160000",
      is_unlimited_mileage: "0",
    },
  ];
  const parsed = parseWarrantyDetails(multiple);
  assert(parsed.length === 3, "Test 5a: Parses multiple (3) warranty entries");
  const groups = groupWarrantiesByType(parsed);
  assert(groups.length === 3, "Test 5b: Groups into 3 distinct warranty types");
}

// 6. Limited mileage
{
  // User example:
  // In-Service Date: 25 November 2025
  // Years: 1, Months: 0 -> Expiry date: 24 November 2026
  // Remaining duration: 8 days
  // Expected: "Engine, transmission, & drivetrain is expected to expire in 8 days or 134,273 Km"
  const inServiceSeconds = Math.floor(Date.UTC(2025, 10, 25) / 1000);
  const current8Days = new Date(Date.UTC(2026, 10, 16));

  const item = {
    warranty_type: "Original Manufacturer Warranty",
    coverage: "Engine, transmission, & drivetrain",
    years: "1",
    months: "0",
    mileage_limit: "134273",
    is_unlimited_mileage: "0",
  };

  const res = formatWarrantyCoverageText(item, inServiceSeconds, current8Days);
  assert(
    res.text === "Engine, transmission, & drivetrain is expected to expire in 8 days or 134,273 Km",
    "Test 6: Limited mileage matches exact required format",
    res.text
  );
}

// 7. Unlimited mileage
{
  // User example with unlimited mileage:
  // "High-voltage battery is expected to expire in 8 days"
  const inServiceSeconds = Math.floor(Date.UTC(2025, 10, 25) / 1000);
  const current8Days = new Date(Date.UTC(2026, 10, 16));

  const item = {
    warranty_type: "Powertrain",
    coverage: "High-voltage battery",
    years: "1",
    months: "0",
    mileage_limit: "134259",
    is_unlimited_mileage: "1",
  };

  const res = formatWarrantyCoverageText(item, inServiceSeconds, current8Days);
  assert(
    res.text === "High-voltage battery is expected to expire in 8 days",
    "Test 7: Unlimited mileage omits mileage limit",
    res.text
  );
}

// 8. Expired warranty
{
  const inServiceSeconds = Math.floor(Date.UTC(2023, 0, 1) / 1000); // 1 Jan 2023
  const currentNow = new Date(Date.UTC(2026, 10, 18)); // Nov 2026

  const item = {
    coverage: "Bumper-to-bumper",
    years: "1",
    months: "0",
    mileage_limit: "20000",
    is_unlimited_mileage: "0",
  };

  const res = formatWarrantyCoverageText(item, inServiceSeconds, currentNow);
  assert(res.isExpired === true, "Test 8a: Correctly identifies expired warranty");
  assert(res.text === "Bumper-to-bumper has expired", "Test 8b: Shows graceful expired message with no negative days", res.text);
}

// 9. Zero years and months
{
  const inServiceSeconds = Math.floor(Date.UTC(2025, 5, 15) / 1000);
  const currentNow = new Date(Date.UTC(2026, 10, 18));

  const item = {
    coverage: "No warranty",
    years: "0",
    months: "0",
    mileage_limit: "0",
    is_unlimited_mileage: "0",
  };

  const expiry = calculateWarrantyExpiryDate(inServiceSeconds, item.years, item.months);
  assert(expiry !== null, "Test 9a: Zero years/months calculates without error");
  const res = formatWarrantyCoverageText(item, inServiceSeconds, currentNow);
  assert(res.isExpired === true && res.text === "No warranty has expired", "Test 9b: Zero years/months shows expired message safely", res.text);
}

// 10. Missing in-service date
{
  const item = {
    coverage: "Powertrain",
    years: "5",
    months: "0",
    mileage_limit: "100000",
    is_unlimited_mileage: "0",
  };

  const resMissing = formatWarrantyCoverageText(item, null);
  assert(!resMissing.isExpired, "Test 10a: Missing date does not crash or mark falsely expired");
  assert(resMissing.text.includes("Powertrain"), "Test 10b: Displays coverage with fallback", resMissing.text);

  const resInvalid = formatWarrantyCoverageText(item, "invalid-date-string");
  assert(resInvalid.text.includes("Powertrain"), "Test 10c: Invalid date string handled gracefully", resInvalid.text);
}

// 11. Popular features with multiple selected values
{
  const configTags: PopularFeatureTag[] = [
    { label: "Sunroof / Moonroof", icon: "https://example.com/sunroof.png", value: "sunroof" },
    { label: "Heated Front Seats", icon: "https://example.com/seats.png", value: "heated_seats" },
    { label: "Navigation System", icon: "https://example.com/nav.png", value: "navigation" },
    { label: "Backup Camera", icon: "https://example.com/camera.png", value: "backup_camera" },
  ];

  const vehicleFeatures = ["sunroof", "navigation", "backup_camera"];
  const matched = matchPopularFeatures(vehicleFeatures, configTags);

  assert(matched.length === 3, "Test 11a: Matches all 3 selected features");
  assert(matched[0].label === "Sunroof / Moonroof", "Test 11b: Matches Sunroof label and icon dynamically");
  assert(matched[1].label === "Navigation System", "Test 11c: Matches Navigation label and icon dynamically");
  assert(matched[2].label === "Backup Camera", "Test 11d: Matches Camera label and icon dynamically");

  // Also test case-insensitivity
  const matchedCase = matchPopularFeatures(["SUNROOF", "Heated_Seats"], configTags);
  assert(matchedCase.length === 2, "Test 11e: Matches case-insensitively");
}

// 12. Empty popular features
{
  const configTags: PopularFeatureTag[] = [
    { label: "Sunroof", icon: "", value: "sunroof" },
  ];

  assert(parsePopularFeatures([]).length === 0, "Test 12a: Empty array parsed as empty");
  assert(parsePopularFeatures("").length === 0, "Test 12b: Empty string parsed as empty");
  assert(parsePopularFeatures(null).length === 0, "Test 12c: Null parsed as empty");
  assert(matchPopularFeatures([], configTags).length === 0, "Test 12d: Empty popular features matches 0");
}

// 13. Missing configuration options
{
  const vehicleFeatures = ["sunroof", "leather_seats"];

  const matchedEmptyConfig = matchPopularFeatures(vehicleFeatures, []);
  assert(matchedEmptyConfig.length === 0, "Test 13a: Empty config returns empty array without throwing");

  const matchedNullConfig = matchPopularFeatures(vehicleFeatures, null as any);
  assert(matchedNullConfig.length === 0, "Test 13b: Null config handled safely without crashing");

  // Feature selected that does not exist in config
  const configWithOnlySunroof: PopularFeatureTag[] = [
    { label: "Sunroof", icon: "https://example.com/sunroof.png", value: "sunroof" },
  ];
  const matchedPartial = matchPopularFeatures(["sunroof", "nonexistent_feature"], configWithOnlySunroof);
  assert(matchedPartial.length === 1 && matchedPartial[0].value === "sunroof", "Test 13c: Ignores unknown feature not present in config");
}

console.log(`\n=== TEST RESULTS: ${passed} PASSED, ${failed} FAILED ===`);
if (failed > 0) {
  process.exit(1);
}
