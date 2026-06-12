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
  introText: string;
  section2Title: string;
  section2Sub: string;
  section2Checklist: string[];
  section2Body: string;
  section2Img: string;
  signsList: string[];
  includesList: string[];
  premiumTitle: string;
  premiumImg: string;
  premiumBody: string;
  cardText: string;
  faqs: FAQItem[];
}

export const servicesData: Record<string, ServiceContent> = {
  "oil-change": {
    id: "oil-change",
    cityTitle: "Oil Change in Brampton, ON",
    couponTitle: "Oil Change Coupon",
    couponImg: "https://www.cardora.ca/wp-content/uploads/2026/05/oil-c.png",
    bannerChecklist: [
      "Premium Synthetic Oil",
      "Fast & Reliable Service",
      "Multi-Point Vehicle Inspection",
      "High-Quality Oil Filters"
    ],
    introText: "Keep your engine running smoothly with professional oil change at Cardora in Brampton. Whether you drive daily through city traffic, commute on the highway, or deal with tough Ontario winters, regular oil changes help protect your engine, improve fuel efficiency, and extend the life of your vehicle. At Cardora, our experienced technicians provide quick, reliable oil changes using high-quality oil and filters designed for your vehicle’s needs. We make maintenance simple, transparent, and stress-free.",
    section2Title: "Why Regular Oil Changes Matter",
    section2Sub: "Your engine oil plays a critical role in protecting your engine by:",
    section2Checklist: ["Lubricating moving engine parts", "Reduces friction", "Preventing sludge buildup", "Helping improve fuel economy", "Extending engine life", ],
    section2Body: "Your engine oil plays a critical role in protecting your engine by:",
    section2Img: "https://www.cardora.ca/wp-content/uploads/2026/05/oil.avif",
    signsList: ["Oil change or check engine light is on", "Engine sounds louder than usual", "Burning oil smell", "Poor fuel economy", "Dirty or dark engine oil", "Vehicle feels rough while driving"],
    includesList: ["Free inspection for your air and cabin filters", "Drain and replace engine oil and install a new oil filter", "Fluid level inspection", "Tire pressure check", "Visual inspection of major components"],
    premiumTitle: "Premium Synthetic Oil Change Service",
    premiumImg: "https://www.cardora.ca/wp-content/uploads/2026/05/car-service.avif",
    premiumBody: "At Cardora, we use high-quality synthetic oil designed to provide superior engine protection and performance in all driving conditions.",
    cardText: "Premium Synthetic Oil & Filter",
    faqs: [
      { q: "How often should I get an oil change?", a: "Most vehicles require an oil change every 8,000 to 10,000 km." },
      { q: "How long does an oil change take?", a: "At Cardora, our oil changes can be completed within 30 minutes!" },
      { q: "What type of oil does my vehicle use?", a: "Check your vehicle's owner manual or contact us for a personalized recommendation." },
      { q: "Do you offer synthetic oil options?", a: "Yes, we offer premium synthetic oil that provides superior protection and longer intervals between changes." }
    ]
  },
  "brakes": {
    id: "brakes",
    cityTitle: "Brake Service & Repair in Brampton, ON",
    couponTitle: "Brake Special Coupon",
    couponImg: "https://www.cardora.ca/wp-content/uploads/2026/05/break.png",
    bannerChecklist: [
      "Premium Brake Pads & Rotors",
      "Complimentary Brake Inspection",
      "Certified Technicians"
    ],
    introText: "Ensure your stopping power is safe and secure with premium brake services at Cardora in Brampton. Our expert technicians use only top-quality brake components to keep you and your passengers safe on every journey through Ontario.",
    section2Title: "Why Healthy Brakes Matter",
    section2Sub: "Your braking system protects your vehicle and passengers by:",
    section2Checklist: ["Minimizing stopping distances", "Preventing rotor grinding", "Reducing brake fade", "Extending component life"],
    section2Body: "Worn pads put excessive stress on your calipers and rotors, leading to expensive repairs. Regular brake service prevents costly damage.",
    section2Img: "https://www.cardora.ca/wp-content/uploads/2026/02/breaks.avif",
    signsList: ["Squealing or grinding noises", "Spongy brake pedal feel", "Brake warning light illuminated", "Longer stopping distances", "Vibration when braking"],
    includesList: ["Brake pad replacement", "Rotor resurfacing or replacement", "Brake fluid inspection", "Caliper service", "Safety inspection"],
    premiumTitle: "Premium Ceramic Brake Package",
    premiumImg: "https://www.cardora.ca/wp-content/uploads/2026/02/breaks.avif",
    premiumBody: "We use high performance premium parts to keep your drives whisper quiet and incredibly safe.",
    cardText: "Premium Pads, Rotors & Calipers",
    faqs: [
      { q: "How long do brake pads usually last?", a: "Typically between 40,000 to 70,000 km depending on driving habits and road conditions." },
      { q: "What's the difference between ceramic and metallic pads?", a: "Ceramic pads are quieter and produce less dust, while metallic pads handle high heat better. We recommend ceramic for daily driving." },
      { q: "Do I need new rotors or can they be resurfaced?", a: "We inspect your rotors and recommend replacement or resurfacing based on condition and thickness." }
    ]
  },
  "tire-service": {
    id: "tire-service",
    cityTitle: "Tire Service & Replacement in Brampton, ON",
    couponTitle: "Tire Service Coupon",
    couponImg: "https://www.cardora.ca/wp-content/uploads/2026/05/tire-new.png",
    bannerChecklist: [
      "Premium Tire Brands",
      "Professional Installation",
      "Wheel Balancing",
      "Seasonal Storage"
    ],
    introText: "Keep your ride smooth and safe with professional tire services at Cardora in Brampton. From regular maintenance to seasonal changes and emergency replacements, we ensure your tires are in perfect condition for any Ontario driving condition.",
    section2Title: "Why Tire Maintenance Matters",
    section2Sub: "Proper tire care is essential because it:",
    section2Checklist: ["Improves fuel efficiency", "Enhances handling and safety", "Extends tire lifespan", "Provides better traction", "Reduces uneven wear"],
    section2Body: "Neglecting tire maintenance leads to premature wear, poor handling, and increased risk of blowouts during critical moments.",
    section2Img: "https://www.cardora.ca/wp-content/uploads/2026/05/tire.jpg",
    signsList: ["Uneven tire wear patterns", "Bulges or cracks in sidewalls", "Tread depth below 2/32 inch", "Vibration while driving", "Frequent air pressure loss"],
    includesList: ["Tire inspection and rotation", "Professional installation", "Wheel balancing", "Tire pressure adjustment", "Free seasonal storage"],
    premiumTitle: "Complete Tire Care Package",
    premiumImg: "https://www.cardora.ca/wp-content/uploads/2026/05/car-service.avif",
    premiumBody: "We provide comprehensive tire solutions including premium brands, expert installation, and ongoing maintenance.",
    cardText: "Tire Rotation, Balancing & Alignment",
    faqs: [
      { q: "How often should I rotate my tires?", a: "We recommend tire rotation every 8,000 to 10,000 km to ensure even wear." },
      { q: "What's the tread depth requirement in Ontario?", a: "The legal minimum is 2/32 inch (1.6 mm). We recommend replacing at 4/32 inch for better safety." },
      { q: "Do you offer winter tire storage?", a: "Yes! We provide seasonal tire storage services to save you space and maintain tire condition." }
    ]
  },
  "wheel-service": {
    id: "wheel-service",
    cityTitle: "Wheel Alignment & Service in Brampton, ON",
    couponTitle: "Wheel Alignment Coupon",
    couponImg: "https://www.cardora.ca/wp-content/uploads/2026/05/wheel-new.png",
    bannerChecklist: [
      "Computer Wheel Alignment",
      "Expert Technicians",
      "Fast Service",
      "Suspension Inspection"
    ],
    introText: "Get back to perfect handling with professional wheel alignment and service at Cardora in Brampton. Proper alignment improves your vehicle's performance, extends tire life, and ensures a smooth, safe driving experience on all Ontario roads.",
    section2Title: "Why Wheel Alignment Matters",
    section2Sub: "Proper wheel alignment ensures:",
    section2Checklist: ["Even tire wear", "Better fuel economy", "Improved handling", "Reduced steering pull", "Safer driving experience"],
    section2Body: "Misaligned wheels cause excessive tire wear, poor handling, and can lead to safety issues. Regular alignment keeps your vehicle performing at its best.",
    section2Img: "https://www.cardora.ca/wp-content/uploads/2026/05/wheel.avif",
    signsList: ["Vehicle pulls to one side", "Uneven tire wear", "Steering wheel vibration", "Difficulty steering", "Squealing tires"],
    includesList: ["Computer wheel alignment", "Suspension inspection", "Tire rotation", "Steering angle correction", "Full alignment report"],
    premiumTitle: "Premium 4-Wheel Alignment Service",
    premiumImg: "https://www.cardora.ca/wp-content/uploads/2026/05/car-service.avif",
    premiumBody: "Our computerized alignment technology ensures precise measurements and perfect vehicle handling.",
    cardText: "Computer Alignment & Suspension Check",
    faqs: [
      { q: "How often should I get my wheels aligned?", a: "Every 10,000 to 15,000 km or whenever you notice pulling or uneven tire wear." },
      { q: "What's included in a wheel alignment?", a: "We check camber, caster, and toe angles, then adjust them to manufacturer specifications." },
      { q: "Will alignment help my fuel economy?", a: "Yes! Proper alignment reduces rolling resistance, improving fuel efficiency by up to 3%." }
    ]
  },
  "battery": {
    id: "battery",
    cityTitle: "Car Battery Service & Replacement in Brampton, ON",
    couponTitle: "Battery Replacement Coupon",
    couponImg: "https://www.cardora.ca/wp-content/uploads/2026/05/battery-c.png",
    bannerChecklist: [
      "Premium Battery Brands",
      "Free Testing",
      "Professional Installation",
      "Warranty Coverage"
    ],
    introText: "Ensure reliable engine starts with professional battery service at Cardora in Brampton. We provide expert battery testing, replacement, and maintenance to keep your vehicle running strong in any weather condition.",
    section2Title: "Why Battery Maintenance Matters",
    section2Sub: "A healthy battery is crucial because it:",
    section2Checklist: ["Provides reliable engine starting", "Powers all electrical systems", "Ensures safety features work", "Prevents vehicle breakdowns", "Maintains optimal performance"],
    section2Body: "A failing battery can leave you stranded. Regular testing and maintenance prevents unexpected failures and costly towing fees.",
    section2Img: "https://www.cardora.ca/wp-content/uploads/2026/02/Battery.jpg",
    signsList: ["Slow engine cranking", "Dim headlights", "Battery warning light", "Corrosion on terminals", "Age over 3-5 years"],
    includesList: ["Free battery testing", "Terminal cleaning", "Professional installation", "Recycle old battery", "Warranty coverage"],
    premiumTitle: "Premium Battery Replacement Package",
    premiumImg: "https://www.cardora.ca/wp-content/uploads/2026/05/car-service.avif",
    premiumBody: "We install only premium batteries backed by comprehensive warranties for peace of mind.",
    cardText: "Premium Batteries with Warranty",
    faqs: [
      { q: "How long do car batteries typically last?", a: "Most batteries last between 3 to 5 years depending on driving habits and climate." },
      { q: "What's included with your battery replacement?", a: "Professional installation, terminal cleaning, old battery recycling, and comprehensive warranty coverage." },
      { q: "Can you test my battery for free?", a: "Yes! We offer free battery testing to determine if replacement is needed." }
    ]
  }
};