export interface LocationBenefit {
  title: string;
  description: string;
}

export interface LocationTradeOff {
  title: string;
  description: string;
}

export interface LocationSEOContentData {
  guideHeading: string;
  overview?: {
    heading?: string;
    paragraphs: string[];
  };
  keyBenefits?: {
    heading?: string;
    leadText?: string;
    items: LocationBenefit[];
    summary?: string;
  };
  tradeOffs?: {
    heading?: string;
    leadText?: string;
    items: LocationTradeOff[];
    closingNote?: string;
  };
}

export interface LocationPageConfig {
  city: string;
  province: string;
  slug: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  title: string;
  description: string;
  heading: string;
  seoContent?: LocationSEOContentData;
}

export const locationPages: Record<string, LocationPageConfig> = {
  brampton: {
    city: "Brampton",
    province: "Ontario",
    slug: "/used-cars-brampton",
    primaryKeyword: "used cars for sale in Brampton",
    secondaryKeywords: [
      "certified used cars Brampton",
      "pre-owned cars Brampton",
    ],
    title: "Used Cars for Sale in Brampton | Certified & Pre-Owned Cars | Cardora",
    description:
      "Find quality used cars for sale in Brampton at Cardora. Browse certified used cars Brampton and pre-owned cars Brampton with upfront pricing, inspection & financing.",
    heading: "Used Cars for Sale in Brampton, Ontario",
    seoContent: {
      guideHeading: "Brampton Used Car Guide",
      // Client will provide the final SEO content for this city.
      overview: {
        heading: "Overview",
        paragraphs: [],
      },
      keyBenefits: {
        heading: "Key benefits",
        leadText: "Buying a used car in Brampton comes with several advantages, including:",
        items: [],
        summary: "",
      },
      tradeOffs: {
        heading: "Potential trade-offs",
        leadText: "While buying a used car in Brampton offers great value, consider these trade-offs:",
        items: [],
        closingNote: "",
      },
    },
  },
  mississauga: {
    city: "Mississauga",
    province: "Ontario",
    slug: "/used-cars-mississauga",
    primaryKeyword: "used cars for sale in Mississauga",
    secondaryKeywords: [
      "pre-owned cars Mississauga",
      "trade in my car Mississauga",
    ],
    title: "Used Cars for Sale in Mississauga | Pre-Owned Cars | Cardora",
    description:
      "Shop quality used cars for sale in Mississauga at Cardora. Explore pre-owned cars Mississauga drivers love, or easily trade in my car Mississauga with top appraisal value.",
    heading: "Used Cars for Sale in Mississauga, Ontario",
    seoContent: {
      guideHeading: "Mississauga Used Car Guide",
      // Client will provide the final SEO content for this city.
      overview: {
        heading: "Overview",
        paragraphs: [],
      },
      keyBenefits: {
        heading: "Key benefits",
        leadText: "Buying a used car in Mississauga comes with several advantages, including:",
        items: [],
        summary: "",
      },
      tradeOffs: {
        heading: "Potential trade-offs",
        leadText: "While buying a used car in Mississauga offers great value, consider these trade-offs:",
        items: [],
        closingNote: "",
      },
    },
  },
  toronto: {
    city: "Toronto",
    province: "Ontario",
    slug: "/used-cars-toronto",
    primaryKeyword: "used cars for sale Toronto",
    secondaryKeywords: [
      "certified pre-owned cars Toronto",
      "trade in my car Toronto",
    ],
    title: "Used Cars for Sale Toronto | Certified Pre-Owned Cars | Cardora",
    description:
      "Discover reliable used cars for sale Toronto at Cardora. Browse certified pre-owned cars Toronto with multi-point inspection, or trade in my car Toronto easily.",
    heading: "Used Cars for Sale in Toronto, Ontario",
    seoContent: {
      guideHeading: "Toronto Used Car Guide",
      overview: {
        heading: "Overview",
        paragraphs: [
          "In a city as dynamic as Toronto, used cars are a practical and popular choice for drivers seeking affordability, variety, and reliability. Whether navigating the busy downtown streets, commuting on the Gardiner Expressway, or braving snowy winters, used cars provide versatility for Toronto's diverse driving needs.",
          "Compared to new cars, used vehicles offer significant cost savings and better value retention. While new cars depreciate quickly within the first few years, used cars have already undergone most of their depreciation, making them a smart investment. From fuel-efficient sedans to family-friendly SUVs, Toronto's used car market caters to a range of lifestyles. Explore our guide to the best used cars in Canada for insights on top models to consider.",
          "For those new to the process, understanding Ontario's unique buying process is key. Our guide to buying a used car in Ontario offers helpful tips and advice to navigate your purchase with confidence.",
        ],
      },
      keyBenefits: {
        heading: "Key benefits",
        leadText: "Buying a used car in Toronto comes with several advantages, including:",
        items: [
          {
            title: "Cost Savings",
            description:
              "Used cars are often significantly cheaper than new models, helping offset Toronto's high cost of living.",
          },
          {
            title: "Diverse Inventory",
            description:
              "Toronto's large and dynamic population ensures a wide variety of used cars for sale, from compact city vehicles to family SUVs.",
          },
          {
            title: "Lower Insurance Rates",
            description:
              "Ontario insurance premiums are typically lower for used vehicles, especially for experienced drivers.",
          },
          {
            title: "Eco-Friendly Choice",
            description:
              "Extending the life of a pre-owned vehicle reduces waste and environmental impact.",
          },
          {
            title: "Adaptability",
            description:
              "With the flexibility to choose vehicles that fit Toronto's specific needs—whether for downtown commutes or weekend road trips to Niagara or Muskoka—you can find a car that works for your lifestyle.",
          },
        ],
        summary:
          "Toronto's used car market balances affordability and variety, making it ideal for anyone.",
      },
      tradeOffs: {
        heading: "Potential trade-offs",
        leadText: "While buying a used car in Toronto offers great value, consider these trade-offs:",
        items: [
          {
            title: "Parking Challenges",
            description:
              "Compact cars are ideal for navigating Toronto, but parking spaces can still be scarce and expensive, especially downtown.",
          },
          {
            title: "Higher Mileage",
            description:
              "Many used cars in Toronto see heavy urban use, which may lead to more wear and tear.",
          },
          {
            title: "Limited Customization",
            description:
              "The pre-owned market depends on available inventory, so finding your preferred trim or features might take longer.",
          },
          {
            title: "Maintenance Needs",
            description:
              "Older vehicles may require more frequent servicing, especially in harsh winter conditions typical of Toronto.",
          },
          {
            title: "Urban Driving History",
            description:
              "Cars from Toronto's traffic-heavy streets might show signs of frequent stop-and-go driving.",
          },
        ],
        closingNote:
          "Understanding these considerations will help you find the best used car to meet your Toronto-specific needs.",
      },
    },
  },
  kitchener: {
    city: "Kitchener",
    province: "Ontario",
    slug: "/used-cars-kitchener",
    primaryKeyword: "used cars for sale in Kitchener",
    secondaryKeywords: [
      "used car dealer Kitchener",
      "certified used cars Kitchener",
    ],
    title: "Used Cars for Sale in Kitchener | Used Car Dealer | Cardora",
    description:
      "Explore dependable used cars for sale in Kitchener at Cardora. As a trusted used car dealer Kitchener, we offer certified used cars Kitchener with upfront pricing.",
    heading: "Used Cars for Sale in Kitchener, Ontario",
    seoContent: {
      guideHeading: "Kitchener Used Car Guide",
      // Client will provide the final SEO content for this city.
      overview: {
        heading: "Overview",
        paragraphs: [],
      },
      keyBenefits: {
        heading: "Key benefits",
        leadText: "Buying a used car in Kitchener comes with several advantages, including:",
        items: [],
        summary: "",
      },
      tradeOffs: {
        heading: "Potential trade-offs",
        leadText: "While buying a used car in Kitchener offers great value, consider these trade-offs:",
        items: [],
        closingNote: "",
      },
    },
  },
  barrie: {
    city: "Barrie",
    province: "Ontario",
    slug: "/used-cars-barrie",
    primaryKeyword: "used cars for sale in Barrie",
    secondaryKeywords: [
      "used car dealership Barrie",
      "pre-owned cars Barrie",
    ],
    title: "Used Cars for Sale in Barrie | Used Car Dealership | Cardora",
    description:
      "Find top quality used cars for sale in Barrie at Cardora. Your premier used car dealership Barrie offering inspected pre-owned cars Barrie drivers rely on.",
    heading: "Used Cars for Sale in Barrie, Ontario",
    seoContent: {
      guideHeading: "Barrie Used Car Guide",
      // Client will provide the final SEO content for this city.
      overview: {
        heading: "Overview",
        paragraphs: [],
      },
      keyBenefits: {
        heading: "Key benefits",
        leadText: "Buying a used car in Barrie comes with several advantages, including:",
        items: [],
        summary: "",
      },
      tradeOffs: {
        heading: "Potential trade-offs",
        leadText: "While buying a used car in Barrie offers great value, consider these trade-offs:",
        items: [],
        closingNote: "",
      },
    },
  },
  hamilton: {
    city: "Hamilton",
    province: "Ontario",
    slug: "/used-cars-hamilton",
    primaryKeyword: "used cars for sale in Hamilton",
    secondaryKeywords: [
      "certified used cars Hamilton",
      "sell my car Hamilton",
    ],
    title: "Used Cars for Sale in Hamilton | Certified Used Cars | Cardora",
    description:
      "Shop quality used cars for sale in Hamilton at Cardora. Discover certified used cars Hamilton with multi-point inspections, or easily sell my car Hamilton today.",
    heading: "Used Cars for Sale in Hamilton, Ontario",
    seoContent: {
      guideHeading: "Hamilton Used Car Guide",
      // Client will provide the final SEO content for this city.
      overview: {
        heading: "Overview",
        paragraphs: [],
      },
      keyBenefits: {
        heading: "Key benefits",
        leadText: "Buying a used car in Hamilton comes with several advantages, including:",
        items: [],
        summary: "",
      },
      tradeOffs: {
        heading: "Potential trade-offs",
        leadText: "While buying a used car in Hamilton offers great value, consider these trade-offs:",
        items: [],
        closingNote: "",
      },
    },
  },
};

export function getLocationPage(cityKey: string): LocationPageConfig | undefined {
  const normalizedKey = cityKey.toLowerCase().trim();
  return locationPages[normalizedKey];
}

export function getAllLocationSlugs(): string[] {
  return Object.values(locationPages).map((loc) => loc.slug);
}
