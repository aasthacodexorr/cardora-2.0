import type { StaticImageData } from "next/image";

import pickupParkingSensors from "@/assets/features/pickup/P_5.png";
import sedanAdaptiveCruise from "@/assets/features/sedan/as_1.png";
import sedanLaneDeparture from "@/assets/features/sedan/as_3.png";
import suvAdaptiveCruise from "@/assets/features/suv/s_1.png";
import suvLaneDeparture from "@/assets/features/suv/s_2.png";
import suvParkingSensors from "@/assets/features/suv/s_3.png";
import vanParkingSensors from "@/assets/features/van/v_3.png";

import navigationSystem from "@/assets/features/pickup/p_6.png";
import appleCarPlay from "@/assets/features/pickup/p_7.png";
import frontSeatHeaters from "@/assets/features/pickup/p_8.png";
import memorySeats from "@/assets/features/pickup/p_9.png";
import heatedSteeringWheel from "@/assets/features/pickup/p_10.png";
import powerSeats from "@/assets/features/pickup/p_11.png";

const vanBlindSpotVideo =
  "/features/van/blind-spot-monitor-van-C8rfCPGE_1080p_20260924115605.mp4";

export type VehicleBodyType = "Pickup" | "Sedan" | "SUV" | "Van";

export type VehicleFeatureItem = {
  id: string;
  name: string;
  category?: string;
  image?: StaticImageData;
  video?: string;
};

const sharedFeatures: VehicleFeatureItem[] = [
  { id: "apple-carplay-android-auto", name: "Apple CarPlay & Android Auto", category: "Connectivity", image: appleCarPlay },
  { id: "navigation-system", name: "Navigation System", category: "Connectivity", image: navigationSystem },
  { id: "front-seat-heaters", name: "Front Seat Heaters", category: "Comfort & Convenience", image: frontSeatHeaters },
  { id: "memory-seats", name: "Memory Seats", category: "Comfort & Convenience", image: memorySeats },
  { id: "heated-steering-wheel", name: "Heated Steering Wheel", category: "Comfort & Convenience", image: heatedSteeringWheel },
  { id: "power-seats", name: "Power Seats", category: "Comfort & Convenience", image: powerSeats },
];

export const vehicleFeaturesByBodyType: Record<VehicleBodyType, VehicleFeatureItem[]> = {
  Pickup: [
    ...sharedFeatures,
    { id: "parking-sensors", name: "Parking sensors", category: "Driver Assistance", image: pickupParkingSensors },
  ],
  Sedan: [
    ...sharedFeatures,
    { id: "adaptive-cruise-control", name: "Adaptive cruise control", category: "Driver Assistance", image: sedanAdaptiveCruise },
    { id: "land-departure-warning", name: "Land Departure Warning", category: "Driver Assistance", image: sedanLaneDeparture },
  ],
  SUV: [
    ...sharedFeatures,
    { id: "adaptive-cruise-control", name: "Adaptive cruise control", category: "Driver Assistance", image: suvAdaptiveCruise },
    { id: "land-departure-warning", name: "Land Departure Warning", category: "Driver Assistance", image: suvLaneDeparture },
    { id: "parking-sensors", name: "Parking sensors", category: "Driver Assistance", image: suvParkingSensors },
  ],
  Van: [
    ...sharedFeatures,
    { id: "blind-spot-monitoring", name: "Blind spot monitoring", category: "Driver Assistance", video: vanBlindSpotVideo },
    { id: "parking-sensors", name: "Parking sensors", category: "Driver Assistance", image: vanParkingSensors },
  ],
};

const bodyTypeAliases: Record<string, VehicleBodyType> = {
  pickup: "Pickup",
  "pickup truck": "Pickup",
  "pickup-truck": "Pickup",
  truck: "Pickup",
  trucks: "Pickup",
  sedan: "Sedan",
  "sedan 4 dr.": "Sedan",
  suv: "SUV",
  "sport utility vehicle": "SUV",
  "suv-crossover": "SUV",
  suvs: "SUV",
  "sport utility 4-door": "SUV",
  van: "Van",
  "minivan-van": "Van",
  minivan: "Van",
  "mini van": "Van",
};

export function normalizeVehicleBodyType(bodyType: string | null | undefined): VehicleBodyType | null {
  if (!bodyType) return null;

  const normalizedBodyType = bodyType.trim().toLowerCase().replace(/\s+/g, " ");
  return bodyTypeAliases[normalizedBodyType] ?? null;
}

export function getVehicleFeatures(bodyType: string | null | undefined): VehicleFeatureItem[] {
  const normalizedBodyType = normalizeVehicleBodyType(bodyType);
  return normalizedBodyType ? vehicleFeaturesByBodyType[normalizedBodyType] : [];
}
