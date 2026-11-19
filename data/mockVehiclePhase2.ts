import { PopularFeatureTag } from "@/types/vehicle";

/**
 * Master toggle for Phase 2 Mock Data.
 * - Set to true to test UI with mock data.
 * - Set to false to restore actual API-driven behavior.
 */
export const ENABLE_PHASE2_MOCK = false;

export const mockWarrantyData = {
  show_manufacturer_warranty_details: 1,
  in_service_date: 1764028800,
  manufacturer_warranty_details: [
    {
      warranty_type: "Original Manufacturer Warranty",
      coverage: "Basic warranty",
      years: "1",
      months: "0",
      mileage_limit: "80000",
      is_unlimited_mileage: "0",
    },
    {
      warranty_type: "Powertrain",
      coverage: "Engine, transmission, & drivetrain",
      years: "2",
      months: "0",
      mileage_limit: "134273",
      is_unlimited_mileage: "0",
    },
    {
      warranty_type: "Battery Warranty",
      coverage: "High-voltage battery",
      years: "3",
      months: "0",
      mileage_limit: "",
      is_unlimited_mileage: "1",
    },
  ],
};

export const mockPopularFeatures = [
  "Apple CarPlay",
  "Android Auto",
  "Heated Seats",
  "Backup Camera",
];

export const mockCarMaxFeatures = [
  "Adaptive Cruise Control",
  "Lane Departure Warning",
  "Blind Spot Monitoring",
  "Apple CarPlay & Android Auto",
  "Front Seat Heaters",
  "Parking Sensors",
  "Heated Steering Wheel",
  "Navigation System",
];

export const mockPopularTagsConfig: PopularFeatureTag[] = [
  {
    label: "Apple CarPlay",
    value: "Apple CarPlay",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-gray-800"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.61 1.34-.55.63-1.03 1.68-.9 2.7.99.08 2.01-.5 2.59-1.19z"/></svg>`,
  },
  {
    label: "Android Auto",
    value: "Android Auto",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-gray-800"><path d="M12 2L1 21h4.2l6.8-12 6.8 12H23L12 2zm0 8.5L7.2 17h9.6L12 10.5z"/></svg>`,
  },
  {
    label: "Heated Seats",
    value: "Heated Seats",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-gray-800"><path d="M4 18h16"/><path d="M4 14h16"/><path d="M7 10c0-1.5 1-2 2-3s1-1.5 1-3"/><path d="M12 10c0-1.5 1-2 2-3s1-1.5 1-3"/><path d="M17 10c0-1.5 1-2 2-3s1-1.5 1-3"/></svg>`,
  },
  {
    label: "Backup Camera",
    value: "Backup Camera",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-gray-800"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
  },
];
