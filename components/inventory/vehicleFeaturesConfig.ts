import type { StaticImageData } from "next/image";

// Pickup assets
import pickupParkingSensors from "@/assets/features/pickup/P_5.png";
import pickupTowPack from "@/assets/features/pickup/P_4.png";

// Sedan assets
import sedanAdaptiveCruise from "@/assets/features/sedan/as_1.png";
import sedanLaneDeparture from "@/assets/features/sedan/as_2.png";
import sedanInterior from "@/assets/features/sedan/as_3.png";
import sedanBlindSpotImage from "@/assets/features/sedan/as_4.png";

// SUV assets
import suvAdaptiveCruise from "@/assets/features/suv/s_1.png";
import suvLaneDeparture from "@/assets/features/suv/s_2.png";
import suvParkingSensors from "@/assets/features/suv/s_3.png";

// Van assets
import vanAdaptiveCruise from "@/assets/features/van/v_1.png";
import vanLaneDeparture from "@/assets/features/van/v_2.png";
import vanParkingSensors from "@/assets/features/van/v_3.png";

// Shared / Interior / Connectivity / Comfort assets
import navigationSystem from "@/assets/features/pickup/p_6.png";
import appleCarPlay from "@/assets/features/pickup/p_7.png";
import frontSeatHeaters from "@/assets/features/pickup/p_8.png";
import memorySeats from "@/assets/features/pickup/p_9.png";
import heatedSteeringWheel from "@/assets/features/pickup/p_10.png";
import powerSeats from "@/assets/features/pickup/p_11.png";

import { parsePopularFeatures } from "@/utils/popularFeatures";

export type VehicleBodyType = "Pickup" | "Sedan" | "SUV" | "Van";

export type VehicleFeatureItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  image?: StaticImageData;
  video?: string;
};

interface FeatureDefinition {
  id: string;
  name: string; // Exact title from Image 1
  category: string;
  description: string;
  aliases: string[];
  getImage: (bodyType: VehicleBodyType | null) => StaticImageData;
  getVideo?: (bodyType: VehicleBodyType | null) => string | undefined;
}

const bodyTypeAliases: Record<string, VehicleBodyType> = {
  pickup: "Pickup",
  "pickup truck": "Pickup",
  "pickup-truck": "Pickup",
  truck: "Pickup",
  trucks: "Pickup",
  sedan: "Sedan",
  "sedan 4 dr.": "Sedan",
  "sedan 4 door": "Sedan",
  coupe: "Sedan",
  convertible: "Sedan",
  hatchback: "Sedan",
  suv: "SUV",
  "sport utility vehicle": "SUV",
  "suv-crossover": "SUV",
  crossover: "SUV",
  suvs: "SUV",
  "sport utility 4-door": "SUV",
  van: "Van",
  "minivan-van": "Van",
  minivan: "Van",
  "mini van": "Van",
};

export function normalizeVehicleBodyType(bodyType: string | null | undefined): VehicleBodyType | null {
  if (!bodyType) return null;
  const normalized = bodyType.trim().toLowerCase().replace(/\s+/g, " ");
  return bodyTypeAliases[normalized] ?? null;
}

/**
 * 23 CRM Popular Features definition with exact names from Image 1,
 * mapped to CarMax feature images & videos by vehicle body type.
 */
export const CRM_FEATURE_DEFINITIONS: FeatureDefinition[] = [
  {
    id: "apple-carplay-android-auto",
    name: "Apple CarPlay & Android Auto",
    category: "Connectivity",
    description: "Sync your smartphone for seamless maps, hands-free messages, podcasts, and audio.",
    aliases: [
      "apple carplay & android auto",
      "apple carplay and android auto",
      "apple carplay",
      "android auto",
      "carplay",
      "apple-carplay",
      "android-auto",
      "apple_carplay",
      "android_auto",
    ],
    getImage: () => appleCarPlay,
  },
  {
    id: "rear-parking-camera",
    name: "Rear Parking Camera",
    category: "Driver Assistance",
    description: "Provides a clear, wide-angle view of the area behind you to assist in reverse maneuvers.",
    aliases: [
      "rear parking camera",
      "rear parking camera",
      "backup camera",
      "backup-camera",
      "rear camera",
      "reverse camera",
      "rearview camera",
      "rear-view camera",
    ],
    getImage: (bt) => (bt === "Pickup" ? pickupParkingSensors : suvParkingSensors),
  },
  {
    id: "parking-sensors",
    name: "Parking Sensors",
    category: "Driver Assistance",
    description: "Audible proximity alerts help you measure distance and dodge obstacles while parking.",
    aliases: [
      "parking sensors",
      "parking sensor",
      "parking-sensors",
      "park assist",
      "parking distance control",
      "park distance warning",
      "rear parking sensors",
      "front and rear parking sensors",
    ],
    getImage: (bt) => {
      switch (bt) {
        case "Pickup":
          return pickupParkingSensors;
        case "Van":
          return vanParkingSensors;
        case "Sedan":
          return suvParkingSensors;
        case "SUV":
        default:
          return suvParkingSensors;
      }
    },
  },
  {
    id: "roof-rails",
    name: "Roof Rails",
    category: "Exterior & Utility",
    description: "Sturdy roof-mounted rails ready to carry luggage racks, bike mounts, or outdoor equipment.",
    aliases: [
      "roof rails",
      "roof rails",
      "roof rack",
      "roof-rails",
      "roof-rack",
      "luggage rack",
    ],
    getImage: () => suvLaneDeparture,
  },
  {
    id: "alloy-wheels",
    name: "Alloy Wheels",
    category: "Exterior",
    description: "Lightweight, durable alloy wheels engineered for sleek styling and responsive handling.",
    aliases: [
      "alloy wheels",
      "alloy wheels",
      "alloy rims",
      "aluminum wheels",
      "alloy-wheels",
      "custom wheels",
    ],
    getImage: () => sedanBlindSpotImage,
  },
  {
    id: "adaptive-cruise-control",
    name: "Adaptive Cruise Control",
    category: "Driver Assistance",
    description: "Automatically adjusts vehicle speed to maintain a preset distance from the car ahead.",
    aliases: [
      "adaptive cruise control",
      "adaptive cruise",
      "adaptive-cruise-control",
      "smart cruise control",
      "acc",
    ],
    getImage: (bt) => {
      switch (bt) {
        case "Sedan":
          return sedanAdaptiveCruise;
        case "Van":
          return vanAdaptiveCruise;
        case "Pickup":
        case "SUV":
        default:
          return suvAdaptiveCruise;
      }
    },
  },
  {
    id: "blind-spot-monitoring",
    name: "Blind Spot Monitoring",
    category: "Driver Assistance",
    description: "Scans alongside adjacent lanes and alerts you if a vehicle is hidden in your blind spot.",
    aliases: [
      "blind spot monitoring",
      "blind spot monitor",
      "blind spot detection",
      "blind-spot-monitoring",
      "blind-spot-monitor",
      "bsm",
      "blis",
    ],
    getVideo: (bt) => {
      switch (bt) {
        case "Van":
          return "/features/van/blind-spot-monitor-van-C8rfCPGE_1080p_20260924115605.mp4";
        case "Sedan":
          return "/features/sedan/p_13.mp4";
        case "Pickup":
          return "/features/pickup/p_12.mp4";
        case "SUV":
        default:
          return "/features/suv/p_14.mp4";
      }
    },
    getImage: () => sedanBlindSpotImage,
  },
  {
    id: "heated-steering-wheel",
    name: "Heated Steering Wheel",
    category: "Comfort & Convenience",
    description: "Provides soothing warmth across the steering wheel rim to make winter driving cozy.",
    aliases: [
      "heated steering wheel",
      "heated steering",
      "heated-steering-wheel",
      "heated wheel",
    ],
    getImage: () => heatedSteeringWheel,
  },
  {
    id: "remote-start",
    name: "Remote Start",
    category: "Comfort & Convenience",
    description: "Precondition cabin temperature and start the engine from afar before stepping inside.",
    aliases: [
      "remote start",
      "remote start",
      "remote engine start",
      "remote-start",
      "keyless remote start",
    ],
    getImage: () => heatedSteeringWheel,
  },
  {
    id: "front-seat-heaters",
    name: "Front Seat Heaters",
    category: "Comfort & Convenience",
    description: "Multi-level heated cushions and backrests provide rapid relief on chilly days.",
    aliases: [
      "front seat heaters",
      "front seat heaters",
      "heated seats",
      "heated front seats",
      "seat heaters",
      "front-seat-heaters",
      "heated-seats",
    ],
    getImage: () => frontSeatHeaters,
  },
  {
    id: "navigation-system",
    name: "Navigation System",
    category: "Connectivity",
    description: "Built-in GPS navigation with turn-by-turn guidance and real-time mapping assistance.",
    aliases: [
      "navigation system",
      "navigation",
      "navigation-system",
      "gps navigation",
      "gps",
      "nav system",
    ],
    getImage: () => navigationSystem,
  },
  {
    id: "bluetooth-technology",
    name: "Bluetooth Technology",
    category: "Connectivity",
    description: "Wireless Bluetooth connectivity for hands-free phone calls and high-fidelity audio playback.",
    aliases: [
      "bluetooth technology",
      "bluetooth",
      "bluetooth wireless",
      "bluetooth-technology",
      "hands-free bluetooth",
    ],
    getImage: () => appleCarPlay,
  },
  {
    id: "sunroof",
    name: "Sunroof",
    category: "Comfort & Convenience",
    description: "One-touch power sunroof welcomes natural overhead sunlight and refreshing airflow into the cabin.",
    aliases: [
      "sunroof",
      "moonroof",
      "sunroof / moonroof",
      "panoramic sunroof",
      "panoramic roof",
      "sun-roof",
    ],
    getImage: () => sedanInterior,
  },
  {
    id: "push-to-start",
    name: "Push to Start",
    category: "Comfort & Convenience",
    description: "Ignite the engine conveniently with a push-button start while leaving your key fob in your pocket.",
    aliases: [
      "push to start",
      "push-to-start",
      "push button start",
      "push-button start",
      "keyless start",
      "keyless go",
    ],
    getImage: () => navigationSystem,
  },
  {
    id: "leather-seats",
    name: "Leather Seats",
    category: "Interior & Comfort",
    description: "Luxurious, supportive leather-trimmed seats crafted for long-haul comfort and simple care.",
    aliases: [
      "leather seats",
      "leather interior",
      "leather upholstery",
      "leather-seats",
      "leather seating",
    ],
    getImage: () => memorySeats,
  },
  {
    id: "heads-up-display",
    name: "Heads Up Display",
    category: "Driver Assistance",
    description: "Projects critical speed and driving telemetry directly in the driver's forward sightline.",
    aliases: [
      "heads up display",
      "head-up display",
      "heads-up display",
      "hud",
      "head up display",
    ],
    getImage: () => navigationSystem,
  },
  {
    id: "360-degree-camera",
    name: "360 Degree Camera",
    category: "Driver Assistance",
    description: "Simulates an aerial surround bird's-eye perspective for confidence in tight parking spots.",
    aliases: [
      "360 degree camera",
      "360 camera",
      "360-degree camera",
      "surround view camera",
      "surround view",
      "bird's eye view",
      "birds eye view",
    ],
    getImage: () => suvParkingSensors,
  },
  {
    id: "tow-pack",
    name: "Tow Pack",
    category: "Capability & Utility",
    description: "Heavy-duty trailer hitch receiver and wiring harness ready for towing trailers, boats, or toys.",
    aliases: [
      "tow pack",
      "tow package",
      "trailer tow package",
      "towing package",
      "tow-pack",
      "tow hitch",
      "trailer hitch",
    ],
    getImage: () => pickupTowPack,
  },
  {
    id: "lane-departure-warning",
    name: "Lane Departure Warning",
    category: "Driver Assistance",
    description: "Warns if your vehicle unintentionally drifts from its detected lane and helps guide steering.",
    aliases: [
      "lane departure warning",
      "land departure warning", // CRM typo variant in Image 1
      "lane keep assist",
      "lane-departure-warning",
      "lane departure",
      "ldw",
      "lka",
    ],
    getImage: (bt) => {
      switch (bt) {
        case "Sedan":
          return sedanLaneDeparture;
        case "Van":
          return vanLaneDeparture;
        case "Pickup":
        case "SUV":
        default:
          return suvLaneDeparture;
      }
    },
  },
  {
    id: "power-gach-deck-lid",
    name: "Power Gach/Deck Lid",
    category: "Convenience & Utility",
    description: "Power-operated rear hatch, deck lid, or tailgate opens and closes with one effortless tap.",
    aliases: [
      "power gach/deck lid",
      "power gach/ deck lid",
      "power gach / deck lid",
      "power deck lid",
      "power liftgate",
      "power tailgate",
      "power trunk",
      "power-liftgate",
    ],
    getImage: (bt) => (bt === "Pickup" ? pickupTowPack : vanParkingSensors),
  },
  {
    id: "memory-seats",
    name: "Memory Seats",
    category: "Comfort & Convenience",
    description: "Save and instantly restore personalized driver seating and mirror preferences.",
    aliases: [
      "memory seats",
      "memory seat",
      "driver seat memory",
      "memory-seats",
      "seat memory",
    ],
    getImage: () => memorySeats,
  },
  {
    id: "power-seats",
    name: "Power Seats",
    category: "Comfort & Convenience",
    description: "Multi-directional electric adjustments make finding your optimal ergonomic posture effortless.",
    aliases: [
      "power seats",
      "power seat",
      "power driver seat",
      "power-seats",
      "electric seats",
      "power adjustable seats",
    ],
    getImage: () => powerSeats,
  },
  {
    id: "ac-seats",
    name: "A/C Seats",
    category: "Comfort & Convenience",
    description: "Ventilated cooling airflow circulates through seat cushions to keep you fresh in hot weather.",
    aliases: [
      "a/c seats",
      "ac seats",
      "a/c seat",
      "ventilated seats",
      "ventilated front seats",
      "cooled seats",
      "air conditioned seats",
    ],
    getImage: () => frontSeatHeaters,
  },
];

/**
 * Normalizes a raw feature string for fuzzy/alias matching.
 */
function normalizeFeatureKey(str: string): string {
  return str
    .toLowerCase()
    .replace(/[&/\\#,+()$~%.'":*?<>{}]/g, " ")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extracts raw feature strings from vehicle document (popular_features, features, etc.)
 */
export function extractVehicleFeatureNames(vehicle: any): string[] {
  if (!vehicle) return [];

  if (vehicle.popular_features) {
    const list = parsePopularFeatures(vehicle.popular_features);
    if (list.length > 0) return list;
  }

  if (vehicle.features) {
    const list = parsePopularFeatures(vehicle.features);
    if (list.length > 0) return list;
  }

  if (vehicle.popularFeatures) {
    const list = parsePopularFeatures(vehicle.popularFeatures);
    if (list.length > 0) return list;
  }

  return [];
}

/**
 * Matches vehicle selected feature names against CRM CarMax definitions.
 * Returns only the features enabled for this vehicle with their corresponding media.
 */
export function getMatchedVehicleFeatures(
  selectedFeatures: string[],
  bodyType?: string | null
): VehicleFeatureItem[] {
  if (!selectedFeatures || !Array.isArray(selectedFeatures) || selectedFeatures.length === 0) {
    return [];
  }

  const normalizedBodyType = normalizeVehicleBodyType(bodyType);
  const matched: VehicleFeatureItem[] = [];
  const seenIds = new Set<string>();

  for (const rawSelected of selectedFeatures) {
    if (!rawSelected || typeof rawSelected !== "string") continue;
    const normalizedSelected = normalizeFeatureKey(rawSelected);

    // Find matching definition
    const def = CRM_FEATURE_DEFINITIONS.find((item) => {
      if (item.id === normalizedSelected) return true;
      if (normalizeFeatureKey(item.name) === normalizedSelected) return true;
      return item.aliases.some((alias) => normalizeFeatureKey(alias) === normalizedSelected);
    });

    if (def && !seenIds.has(def.id)) {
      seenIds.add(def.id);

      const video = def.getVideo ? def.getVideo(normalizedBodyType) : undefined;
      const image = def.getImage(normalizedBodyType);

      matched.push({
        id: def.id,
        name: def.name, // Exact name from Image 1
        category: def.category,
        description: def.description,
        image,
        video,
      });
    }
  }

  return matched;
}

/**
 * Generates CarMax-style dynamic heading and natural subheading description
 * based on the actual vehicle features present.
 */
export function getVehicleFeaturesHeadline(features: VehicleFeatureItem[]): {
  heading: string;
  subheading: string;
} {
  const heading = "Even more to love";

  if (!features || features.length === 0) {
    return { heading, subheading: "" };
  }

  const hasAdaptive = features.some((f) => f.id === "adaptive-cruise-control");
  const hasLane = features.some((f) => f.id === "lane-departure-warning");
  const hasBlindSpot = features.some((f) => f.id === "blind-spot-monitoring");

  // If the 3 core CarMax driver-assist features are present, match Image 2 exactly
  if (hasAdaptive && hasLane && hasBlindSpot) {
    return {
      heading,
      subheading: "Helps adjust speed with traffic, guide steering, and flag blind spots and lane departures.",
    };
  }

  // Dynamic sentence composition for other feature combinations
  const parts: string[] = [];

  if (hasAdaptive) {
    parts.push("Helps adjust speed with traffic");
  }

  if (hasLane) {
    parts.push(parts.length > 0 ? "guide steering" : "Guides steering in your lane");
  }

  if (hasBlindSpot) {
    parts.push(parts.length > 0 ? "flag blind spot traffic" : "Flags blind spot vehicles");
  }

  const hasSeats = features.some(
    (f) => f.id === "front-seat-heaters" || f.id === "heated-steering-wheel" || f.id === "ac-seats"
  );
  if (hasSeats && parts.length < 2) {
    parts.push(parts.length > 0 ? "provide heated climate comfort" : "Provides soothing heated climate comfort");
  }

  const hasConnectivity = features.some(
    (f) => f.id === "apple-carplay-android-auto" || f.id === "navigation-system" || f.id === "bluetooth-technology"
  );
  if (hasConnectivity && parts.length < 2) {
    parts.push(parts.length > 0 ? "keep you seamlessly connected" : "Keeps navigation and media seamlessly connected");
  }

  const hasParking = features.some(
    (f) => f.id === "parking-sensors" || f.id === "rear-parking-camera" || f.id === "360-degree-camera"
  );
  if (hasParking && parts.length < 2) {
    parts.push(parts.length > 0 ? "ease tight parking maneuvers" : "Eases parking maneuvers with driver assist sensors");
  }

  let subheading = "";
  if (parts.length === 1) {
    subheading = `${parts[0]}.`;
  } else if (parts.length === 2) {
    subheading = `${parts[0]} and ${parts[1].replace(/^and\s+/i, "")}.`;
  } else if (parts.length >= 3) {
    subheading = `${parts[0]}, ${parts[1]}, and ${parts[2].replace(/^and\s+/i, "")}.`;
  } else {
    subheading = "Standout features designed for comfort, convenience, connectivity, and driver confidence.";
  }

  return { heading, subheading };
}
