import couponImg from "@/assets/icons/couponImg.png"
import premiumImgOil from "@/assets/icons/premiumImg-oil.avif"
import premiumImgTire from "@/assets/icons/premiumImg-tire.jpg"
import premiumImgWheel from "@/assets/icons/premiumImg-wheel.avif"

import section2ImgOil from "@/assets/icons/section2Img-oil.avif"
import section2ImgTire from "@/assets/icons/section2Img-tire.jpg"
import section2Imgbreak from "@/assets/icons/section2Imgbrake.webp"
import section2ImgWheel from "@/assets/icons/section2Img-wheel.avif"

import whyImgBreak from "@/assets/icons/whyImg-break.jpg"
import whyImgTire from "@/assets/icons/whyImg-tire.webp"


export interface FAQItem {
  q: string;
  a: string;
}

export interface ServiceContent {
  id: string;
  cityTitle: string;
  couponTitle: string;
  couponImg: string;
  bannerChecklist: string[];
  introText1: string;
  introText2: string;
  introText3: string;
  section2Title: string;
  section2Sub: string;
  section2Checklist: string[];
  section2Body: string;
  section2LastBody1: string;
  section2LastBody2: string;
  section2Img: any;
  premiumTitle: string;
  premiumImg: any;
  premiumBody: string;
  cardText: string;
  faqs: FAQItem[];
  // Extra property found in your original data that needs to be optional or included
  signLastBody2?: string;
  premiumBody2?: string;
  premiumBody3?: string;
  signtitle1?: string;
  signtitle2?: string;
  signsList1?: string[];
  signLastBody1?: string;
  signsListBody1?: string;
  signsListBody2?: string;
  signList2?: string[];
  whyTitle?: string;
  whyFeature?: string[];
  whyLastBody?: string;
  whyImg?: any;
  premiumBody1?: string;
}

export interface DealershipConfig {
  dealership_name: string;
  city_1: string;
  province_1: string;
}

/**
 * Generate service data with dealership config values interpolated directly.
 * Since dealershipConfig is resolved at runtime (via an async getAppConfig() call),
 * this stays a function — but unlike before, there's no post-hoc regex replacement.
 * City, province, and dealership name are interpolated inline via template literals,
 * so the source of truth for each string lives right next to the copy itself.
 *
 * Usage:
 *   const dynamicServices = getServicesData(dealershipConfig);
 */
export function getServicesData(
  dealershipConfig: DealershipConfig
): Record<string, ServiceContent> {
  const { dealership_name, city_1, province_1 } = dealershipConfig;

  const servicesData: Record<string, ServiceContent> = {
    "oil-change": {
      id: "oil-change",
      cityTitle: `Oil Change in ${city_1}, ${province_1}`,
      couponTitle: "Oil Change Coupon",
      couponImg: couponImg?.src,
      bannerChecklist: [
        "Premium Synthetic Oil",
        "Fast & Reliable Service",
        "Multi-Point Vehicle Inspection",
        "High-Quality Oil Filters"
      ],
      introText1: `Keep your engine running smoothly with professional oil change at ${dealership_name} in ${city_1}. Whether you drive daily through city traffic, commute on the highway, or deal with tough Ontario winters, regular oil changes help protect your engine, improve fuel efficiency, and extend the life of your vehicle.`,
      introText2: `At ${dealership_name}, our experienced technicians provide quick, reliable oil changes using high-quality oil and filters designed for your vehicle's needs. We make maintenance simple, transparent, and stress-free.`,
      introText3: "",
      section2Title: "Why Regular Oil Changes Matter",
      section2Sub: "Your engine oil plays a critical role in protecting your engine by:",
      section2Checklist: ["Lubricating moving engine parts", "Reduces friction", "Preventing sludge buildup", "Helping improve fuel economy", "Extending engine life"],
      section2Body: "",
      section2Img: section2ImgOil,
      section2LastBody1: "Over time, oil breaks down and becomes less effective. Delaying oil changes can lead to poor performance, engine wear, and expensive repairs.",
      section2LastBody2: "If you notice dark oil, engine noise, reduced fuel economy, or your oil change light is on, it may be time for service.",
      signsList1: ["Oil change or check engine light is on", "Engine sounds louder than usual", "Burning oil smell", "Poor fuel economy", "Dirty or dark engine oil", "Vehicle feels rough while driving"],
      signList2: ["Free inspection for your air and cabin filters", "Drain and replace engine oil and install a new oil filter", "Fluid level inspection", "Tire pressure check", "Visual inspection of major components", "Reset maintenance reminders (if applicable)"],
      premiumTitle: "Premium Synthetic Oil Change Service",
      signLastBody2: "We service most makes and models, including domestic, European, and imported vehicles.  ",
      premiumImg: premiumImgOil,
      premiumBody: `At ${dealership_name}, we use high-quality synthetic oil designed to provide superior engine protection and performance in all driving conditions.`,
      premiumBody2: `Modern vehicles are designed to perform best with synthetic oil, especially for drivers dealing with daily commuting, stop-and-go traffic, and changing weather conditions around ${city_1} and the GTA.`,
      premiumBody3: "Our technicians will ensure your vehicle receives the correct synthetic oil and filter recommended for your engine.",
      cardText: "Premium Synthetic Oil & Filter",
      whyTitle: `Why Drivers in ${city_1} Choose ${dealership_name}`,
      whyFeature: ["Honest recommendations with no pressure", "Experienced technicians", "Quick turnaround times", "Transparent pricing", `Convenient ${city_1} location`, "Trusted customer service experience"],
      whyLastBody: "We know your time matters. Our goal is to get you back on the road quickly and confidently.",
      whyImg: whyImgTire,
      faqs: [
        { q: "How often should I get an oil change?", a: "Most vehicles require an oil change every 8,000 to 10,000 km." },
        { q: "How long does an oil change take?", a: `At ${dealership_name}, our oil changes can be completed within 30 minutes!` },
        { q: "Do you service all vehicle brands?", a: "Yes! We service all makes and models, including SUVs, sedans, trucks, and luxury vehicles!" },
        { q: `What type of oil does ${dealership_name} use?`, a: "We use premium synthetic oil designed to provide better engine protection, improved performance, and longer-lasting durability for modern vehicles." },
        { q: "Why is synthetic oil better for my engine?", a: "Synthetic oil provides superior lubrication, better protection in extreme temperatures, cleaner engine performance, and improved resistance to engine wear compared to conventional oil." },
        { q: "What happens if I delay an oil change?", a: "Delaying oil changes can lead to dirty oil buildup, reduced engine performance, lower fuel efficiency, and increased engine wear that may result in expensive repairs." },
        { q: "Do you replace the oil filter during every oil change?", a: `Yes. Every oil change service at ${dealership_name} includes a new oil filter replacement to help maintain proper engine protection and oil flow.` },
        { q: `Why choose ${dealership_name} for an oil change in ${city_1}?`, a: `Drivers across ${city_1} choose ${dealership_name} for fast service, experienced technicians, premium synthetic oil, honest recommendations, and a customer-focused experience.` }
      ]
    },
    "brakes": {
      id: "brakes",
      cityTitle: `Brake Repair & Brake Service in ${city_1}, ${province_1}`,
      couponTitle: "Brake Special Coupon",
      couponImg: couponImg?.src,
      bannerChecklist: [
        "Complimentary Brake System Inspection Included",
        "Premium Front or Rear Brake Pad Replacement",
        `Expert Installation by ${dealership_name} Certified Technicians`,
        "Valid for Most Cars, SUVs & Light Trucks",
        `Reliable Braking Performance You Can Trust at ${dealership_name}`
      ],
      introText1: `Your brakes are one of the most important safety systems in your vehicle. At ${dealership_name} in ${city_1}, we provide professional brake inspections, brake pad replacements, rotor service, and complete brake repairs to help keep you safe on the road.`,
      introText2: "If your brakes are squeaking, grinding, vibrating, or feeling less responsive, our technicians can quickly diagnose the issue and recommend the right solution.",
      introText3: "",
      section2Title: "Brake Warning Signs",
      section2Sub: "You may need brake service if you notice:",
      section2Checklist: ["Squeaking or grinding noises", "Brake pedal vibration", "Soft or spongy brake pedal", "Vehicle pulling while braking", "Longer stopping distances", "Brake warning light on dashboard"],
      section2Body: "",
      section2LastBody1: "Ignoring brake issues can increase stopping distance and lead to more costly repairs.",
      section2LastBody2: "",
      section2Img: section2Imgbreak,
      signtitle1: "Our Brake Services Include",
      signtitle2: "Why Brake Maintenance Matters",
      signsList1: ["Brake pad replacement", "Brake rotor replacement", "Brake fluid checks", "Brake bleeding", "Caliper service"],
      signLastBody1: "We use quality replacement parts designed for reliable performance and long-term durability.",
      signsListBody1: `Ontario driving conditions can put extra stress on your braking system, especially during winter months and stop-and-go city traffic around ${city_1} and the GTA.`,
      signsListBody2: "Routine brake maintenance helps:",
      signList2: ["Improve stopping performance", "Increase driving safety", "Prevent expensive repairs", "Extend brake system lifespan", "Protect other brake components"],
      premiumTitle: "",
      signLastBody2: "",
      whyTitle: `Why Choose ${dealership_name} for Brake Service?`,
      whyFeature: ["Experienced automotive technicians", "Honest and clear recommendations", "Fast service appointments", "Competitive pricing", `Trusted local service centre in ${city_1}`],
      whyLastBody: "We explain repairs clearly so you always understand what your vehicle needs.",
      whyImg: whyImgBreak,
      premiumImg: premiumImgOil,
      premiumBody: "We use high performance premium parts to keep your drives whisper quiet and incredibly safe.",
      cardText: "Premium Pads, Rotors & Calipers",
      faqs: [
        { q: "How long do brake pads last?", a: "Brake pads typically last between 40,000 and 60,000 km depending on driving habits and conditions." },
        { q: "Why are my brakes making noise?", a: "Squeaking or grinding noises often indicate worn brake pads or rotor issues." },
        { q: "Can I drive with bad brakes?", a: "Driving with worn brakes is unsafe and may damage other components. It's best to have them inspected as soon as possible." },
        { q: "What are signs I need brake service?", a: "Common warning signs include squeaking noises, vibrations while braking, a soft brake pedal, longer stopping distances, or a brake warning light on your dashboard." },
        { q: "How often should brakes be inspected?", a: "It's recommended to have your brakes inspected at least once a year or during routine maintenance appointments to help catch issues early." },
        { q: "Do you replace brake rotors?", a: "Yes. Our brake service includes brake rotor inspections and replacements if the rotors are worn, damaged, or uneven." },
        { q: "Why does my steering wheel shake when braking?", a: "A shaking or vibrating steering wheel during braking may indicate warped brake rotors or uneven brake wear." },
        { q: `Why choose ${dealership_name} for brake repair in ${city_1}?`, a: `Drivers across ${city_1} trust ${dealership_name} for professional brake inspections, honest recommendations, quality replacement parts, and reliable customer service.` }
      ],
    },
    "tire-service": {
      id: "tire-service",
      cityTitle: `Tire Service in ${city_1}, ${province_1}`,
      couponTitle: "Tire Service Coupon",
      couponImg: couponImg?.src,
      bannerChecklist: [
        "Complimentary Tire Inspection Included",
        "Professional Tire Rotation & Balancing Service",
        `Expert Installation by ${dealership_name} Certified Technicians`,
        "Valid for Most Cars, SUVs & Light Trucks",
        `Reliable Tire Performance & Safer Driving at ${dealership_name}`
      ],
      introText1: "Your tires are the only part of your vehicle that touch the road. Proper tire maintenance improves safety, handling, fuel efficiency, and driving comfort.",
      introText2: `At ${dealership_name} in ${city_1}, we provide complete tire services including tire replacement, tire rotations, balancing, seasonal tire swaps, flat tire repairs, and inspections.`,
      introText3: "Whether you need new tires or routine maintenance, our team is here to help keep you driving safely year-round.",
      section2Title: "Our Tire Services Include",
      section2Sub: " ",
      section2Checklist: ["Tire replacement", "Tire rotations", "Tire balancing", "Flat tire repair", "Seasonal tire changeovers", "Tire inspections", "Tire pressure checks", "We service all major tire brands and vehicle types."],
      section2Body: "",
      section2Img: section2ImgTire,
      signtitle1: "Why Tire Maintenance Is Important",
      signLastBody1: "Regular tire maintenance helps extend tire life and improve overall driving performance.",
      signtitle2: "Signs You May Need Tire Service",
      signsList1: ["Vehicle handling", "Braking distance", "Ride comfort", "Safety during rain and snow"],
      signLastBody2: "If you're unsure about the condition of your tires, our technicians can inspect them and recommend the best solution.",
      signList2: ["Uneven tire wear", "Low tread depth", "Vehicle vibration while driving", "Tire pressure warning light", "Cracks or damage on sidewalls", "Poor traction in wet or snowy conditions"],
      premiumTitle: `Seasonal Tire Service in ${city_1}`,
      premiumImg: premiumImgTire,
      premiumBody1: "Ontario weather changes quickly throughout the year. Winter tires provide better traction and control during snow and freezing temperatures, while all-season or summer tires perform better in warmer conditions.",
      premiumBody2: `${dealership_name} offers convenient seasonal tire swap services to help prepare your vehicle for changing weather conditions.`,
      premiumBody3: "",
      whyImg: whyImgTire,
      whyTitle: `Why Drivers Trust ${dealership_name}`,
      whyFeature: ["Reliable tire expertise", "Friendly customer service", "Honest recommendations", "Convenience", "Quick and efficient appointments"],
      whyLastBody: "We help you choose the right tire solution for your vehicle, driving style, and budget.",
      cardText: "Tire Rotation, Balancing & Alignment",
      faqs: [
        { q: "How often should tires be rotated?", a: "Most manufacturers recommend tire rotations every alternate service appointment." },
        { q: "How do I know if my tires need replacing?", a: "If you feel vibrations while driving, tread depth is low, tires are unevenly worn, or traction is poor, it may be time for new tires." },
        { q: "Do you install winter tires?", a: "Yes! We provide seasonal tire installation and changeover services." },
        { q: "Why is tire rotation important?", a: "Regular tire rotations help distribute tire wear evenly, improve handling, extend tire lifespan, and maintain better overall vehicle performance." },
        { q: "How long do tires typically last?", a: "Tire lifespan depends on driving habits, road conditions, and maintenance, but most tires last between 50,000 and 80,000 km." },
        { q: "What causes uneven tire wear?", a: "Uneven tire wear can be caused by improper tire pressure, poor wheel alignment, suspension issues, or missed tire rotations." },
        { q: "Can bad tires affect fuel economy?", a: "Yes. Worn or improperly inflated tires can increase rolling resistance and reduce fuel efficiency." },
        { q: `Why choose ${dealership_name} for tire service in ${city_1}?`, a: `Drivers throughout ${city_1} trust ${dealership_name} for reliable tire services, seasonal tire swaps, experienced technicians, and honest customer care.` }
      ],
      section2LastBody1: "",
      section2LastBody2: "",
      premiumBody: ""
    },
    "wheel-service": {
      id: "wheel-service",
      cityTitle: `Wheel Alignment Service in ${city_1}, ${province_1}`,
      couponTitle: "Wheel Alignment Coupon",
      couponImg: couponImg?.src,
      bannerChecklist: [
        "Complimentary Suspension & Tire Inspection Included",
        "Precision Four-Wheel Alignment Service",
        `Performed by ${dealership_name} Certified Technicians`,
        "Valid for Most Cars, SUVs & Light Trucks",
        `Improved Handling, Tire Life & Driving Comfort at ${dealership_name}`
      ],
      introText1: "If your vehicle pulls to one side, your steering wheel feels off-centre, or your tires are wearing unevenly, it may be time for a wheel alignment.",
      introText2: `At ${dealership_name} in ${city_1}, we provide professional wheel alignment services to help improve handling, protect your tires, and create a smoother driving experience.`,
      introText3: "Proper alignment helps your vehicle drive straight and keeps your tires performing evenly and efficiently.",
      section2Title: "What Is a Wheel Alignment?",
      section2Sub: "Wheel alignment adjusts the angles of your vehicle's wheels so they match manufacturer specifications.",
      section2Checklist: ["Improve steering control", "Reduce uneven tire wear", "Extend tire lifespan", "Create a smoother ride", "Misalignment can happen over time from potholes, rough roads, curbs, and normal driving conditions."],
      section2Body: "Proper alignment helps:",
      section2Img: section2ImgWheel,
      signtitle1: "Signs You Need a Wheel Alignment",
      signtitle2: "Our Wheel Alignment Service Includes",
      signsList1: ["Uneven tire wear", "Steering wheel is crooked", "Steering feels tilted", "Vibrations while driving", "Tires wearing out too quickly"],
      signLastBody1: "Ignoring alignment issues can shorten tire life and affect vehicle handling.",
      signLastBody2: "Our technicians use professional equipment to ensure accurate alignment adjustments.",
      signList2: ["Alignment inspection", "Precision wheel angle adjustments", "Steering sensors checks", "Tire wear inspection", "Test drive verification"],
      premiumTitle: `Why Wheel Alignments Matter in ${city_1}`,
      premiumImg: premiumImgWheel,
      premiumBody1: `Road conditions, potholes, construction zones, and seasonal weather changes around ${city_1} and the GTA can affect wheel alignment over time. Routine alignment checks help protect your tires and improve your vehicle's overall performance.`,
      cardText: "Computer Alignment & Suspension Check",
      whyImg: whyImgTire,
      whyTitle: `Why Choose ${dealership_name}?`,
      whyFeature: ["Experienced service technicians", "Modern alignment equipment", "Honest recommendations", "Fast appointment scheduling", `Convenient ${city_1} service location`],
      whyLastBody: "We focus on quality workmanship and customer satisfaction every step of the way.",
      faqs: [
        { q: "How often should I get a wheel alignment?", a: "It's recommended to check alignment every 3 months or whenever you notice steering or tire wear issues." },
        { q: "Does wheel alignment affect tire life?", a: "Yes. Poor alignment can cause uneven tire wear and reduce tire lifespan." },
        { q: "Can potholes cause alignment problems?", a: "Yes. Hitting potholes or curbs can knock your wheels out of alignment." },
        { q: "What are signs my vehicle needs a wheel alignment?", a: "Common signs include your vehicle pulling to one side, a crooked steering wheel, uneven tire wear, or vibrations while driving." },
        { q: "Can wheel alignment improve fuel efficiency?", a: "Yes. Proper wheel alignment reduces rolling resistance, which can help improve fuel efficiency and overall vehicle performance." },
        { q: "How long does a wheel alignment take?", a: "Most wheel alignment services can typically be completed within approximately one hour depending on the vehicle and condition." },
        { q: "Does wheel alignment improve driving comfort?", a: "Yes. Proper alignment helps create smoother steering, better vehicle control, and a more comfortable driving experience." },
        { q: `Why choose ${dealership_name} for wheel alignment in ${city_1}?`, a: `Drivers across ${city_1} trust ${dealership_name} for accurate wheel alignment services, experienced technicians, honest recommendations, and reliable customer care.` }
      ],
      section2LastBody1: "",
      section2LastBody2: "",
      premiumBody: ""
    },
    "battery": {
      id: "battery",
      cityTitle: `Car Battery Service & Replacement in ${city_1}, ${province_1}`,
      couponTitle: "Battery Replacement Coupon",
      couponImg: couponImg?.src,
      bannerChecklist: [
        "Premium Battery Brands",
        "Free Testing",
        "Professional Installation",
        "Warranty Coverage"
      ],
      introText1: `Ensure reliable engine starts with professional battery service at ${dealership_name} in ${city_1}. We provide expert battery testing, replacement, and maintenance to keep your vehicle running strong in any weather condition.`,
      introText2: "",
      introText3: "",
      section2Title: "Why Battery Maintenance Matters",
      section2Sub: "A healthy battery is crucial because it:",
      section2Checklist: ["Provides reliable engine starting", "Powers all electrical systems", "Ensures safety features work", "Prevents vehicle breakdowns", "Maintains optimal performance"],
      section2Body: "A failing battery can leave you stranded. Regular testing and maintenance prevents unexpected failures and costly towing fees.",
      section2Img: premiumImgWheel,
      signsList1: ["Slow engine cranking", "Dim headlights", "Battery warning light", "Corrosion on terminals", "Age over 3-5 years"],
      premiumTitle: "Premium Battery Replacement Package",
      premiumImg: "",
      premiumBody: "We install only premium batteries backed by comprehensive warranties for peace of mind.",
      cardText: "Premium Batteries with Warranty",
      faqs: [
        { q: "How long do car batteries typically last?", a: "Most batteries last between 3 to 5 years depending on driving habits and climate." },
        { q: "What's included with your battery replacement?", a: "Professional installation, terminal cleaning, old battery recycling, and comprehensive warranty coverage." },
        { q: "Can you test my battery for free?", a: "Yes! We offer free battery testing to determine if replacement is needed." }
      ],
      section2LastBody1: "",
      section2LastBody2: ""
    }
  };

  return servicesData;
}