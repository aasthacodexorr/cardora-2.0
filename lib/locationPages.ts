import { defaultAppConfig, type AppConfig } from "./appConfig";
import { formatFacetLabel } from "./inventoryRouting";

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
  ogImage?: string;
  seoContent?: LocationSEOContentData;
  schemaMarkup?: Record<string, any>;
}

export const locationPages: Record<string, LocationPageConfig> = {
  brampton: {
    city: "Brampton",
    province: "Ontario",
    slug: "/inventory/used-car-brampton",
    primaryKeyword: "used cars for sale in Brampton",
    secondaryKeywords: ["certified used cars Brampton", "pre-owned cars Brampton", "used car buying guide Ontario"],
    title: "Used Cars Brampton | Cardora",
    description: "Shop certified used cars in Brampton at Cardora, 8050 Dixie Rd. Inspected sedans and SUVs in stock. Financing for all credit.",
    heading: "Used Cars in Brampton",
    ogImage: "https://www.cardora.ca/wp-content/uploads/2026/03/Cardora-n.png",
    seoContent: {
      guideHeading: "Used Cars for Sale in Brampton: Buyer's Guide",
      overview: {
        paragraphs: [
          "Brampton is one of the fastest-growing cities in Ontario, and for most families here a car is a daily necessity. Whether you commute along Highway 410 or drive to work in Mississauga, choosing from quality used cars for sale in Brampton keeps you moving without the high cost of buying new.",
          "At Cardora, our Dixie Road showroom carries a wide range of inspected vehicles, from fuel-efficient sedans for daily commutes to family-friendly SUVs with room for the whole crew. Each vehicle comes with a clear history report and transparent pricing, and our team can help you compare models side by side. Not sure where to start? Our guide to the best used cars in Canada covers the most reliable options for Canadian roads and winters.",
          "Before you visit, read our used car buying guide for Ontario to understand safety certificates, vehicle history checks and financing, so you can shop for your next car with confidence."
],
      },
      keyBenefits: {
        heading: "Key Benefits of Certified Used Cars in Brampton",
        leadText: "Buying a used car in Brampton comes with several practical advantages for local drivers:",
        items: [
          {
                    "title": "Cost Savings",
                    "description": "A used car costs far less than a new one, and most of the depreciation has already happened, so your money goes further."
          },
          {
                    "title": "Diverse Inventory",
                    "description": "From compact sedans to three-row SUVs, you can choose from many makes, models and trims to suit your lifestyle and budget."
          },
          {
                    "title": "Lower Insurance Rates",
                    "description": "Insurance on a used vehicle is often cheaper than on a new one, which helps in Peel Region, where premiums tend to be high."
          },
          {
                    "title": "Flexible Financing",
                    "description": "Financing is available for all credit types, including bad credit, no credit and newcomers to Canada."
          },
          {
                    "title": "Easy Trade-Ins",
                    "description": "Bring in your current vehicle and put its value toward your next car, making the switch simple and affordable."
          }
],
        summary: "With the right vehicle and a trusted dealer, certified used cars in Brampton are a smart long-term choice.",
      },
      tradeOffs: {
        heading: "Potential Trade-offs of Pre-Owned Cars in Brampton",
        leadText: "Like any purchase, pre-owned cars in Brampton come with a few things to keep in mind:",
        items: [
          {
                    "title": "Higher Mileage",
                    "description": "Many GTA vehicles carry commuter mileage, so review the vehicle history and service records before you buy."
          },
          {
                    "title": "Winter Wear",
                    "description": "Road salt and cold Ontario winters can affect brakes, batteries and the underbody. An inspection helps catch these issues early."
          },
          {
                    "title": "Limited Customization",
                    "description": "You choose from available stock, so your preferred colour, trim or options may not always be on the lot."
          },
          {
                    "title": "Maintenance Needs",
                    "description": "Older vehicles may need tires, brakes or other parts replaced sooner, so budget for regular upkeep."
          },
          {
                    "title": "Warranty Coverage",
                    "description": "Factory warranty may be partly used or expired. Ask about extended protection plans for added peace of mind."
          }
],
        closingNote: "Choosing inspected vehicles with full history reports from a trusted local dealership helps you avoid most of these risks.",
      },
    },
    schemaMarkup: {
      "@context": "https://schema.org",
      "@graph": [
            {
                  "@type": "AutoDealer",
                  "@id": "https://www.cardora.ca/#dealer",
                  "name": "Cardora",
                  "url": "https://www.cardora.ca/",
                  "logo": "https://www.cardora.ca/wp-content/uploads/2026/03/Cardora-n.png",
                  "image": "https://www.cardora.ca/wp-content/uploads/2026/03/Cardora-n.png",
                  "telephone": "+1-855-514-5500",
                  "email": "info@cardora.ca",         
                  "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "8050 Dixie Rd",
                        "addressLocality": "Brampton",
                        "addressRegion": "ON",
                        "postalCode": "L6T 4W6",
                        "addressCountry": "CA"
                  },
                  "areaServed": [
                        {
                              "@type": "City",
                              "name": "Brampton"
                        },
                        {
                              "@type": "City",
                              "name": "Mississauga"
                        },
                        {
                              "@type": "City",
                              "name": "Toronto"
                        }
                  ],
                  "openingHoursSpecification": [
                        {
                              "@type": "OpeningHoursSpecification",
                              "dayOfWeek": [
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday"
                              ],
                              "opens": "10:00",
                              "closes": "20:00"
                        },
                        {
                              "@type": "OpeningHoursSpecification",
                              "dayOfWeek": "Saturday",
                              "opens": "10:00",
                              "closes": "18:00"
                        },
                        {
                              "@type": "OpeningHoursSpecification",
                              "dayOfWeek": "Sunday",
                              "opens": "12:00",
                              "closes": "17:00"
                        }
                  ]
            },
            {
                  "@type": "WebPage",
                  "@id": "https://www.cardora.ca/inventory/used-car-brampton/#webpage",
                  "url": "https://www.cardora.ca/inventory/used-car-brampton/",
                  "name": "Used Cars Brampton | Inspected Cars on Dixie Rd | Cardora",
                  "description": "Shop certified used cars in Brampton at Cardora, 8050 Dixie Rd. Inspected sedans and SUVs in stock. Financing for all credit.",
                  "inLanguage": "en-CA",
                  "about": {
                        "@id": "https://www.cardora.ca/#dealer"
                  },
                  "breadcrumb": {
                        "@id": "https://www.cardora.ca/inventory/used-car-brampton/#breadcrumb"
                  }
            },
            {
                  "@type": "BreadcrumbList",
                  "@id": "https://www.cardora.ca/inventory/used-car-brampton/#breadcrumb",
                  "itemListElement": [
                        {
                              "@type": "ListItem",
                              "position": 1,
                              "name": "Home",
                              "item": "https://www.cardora.ca/"
                        },
                        {
                              "@type": "ListItem",
                              "position": 2,
                              "name": "Used Cars Brampton",
                              "item": "https://www.cardora.ca/inventory/used-car-brampton/"
                        }
                  ]
            }
      ]
},
  },
  mississauga: {
    city: "Mississauga",
    province: "Ontario",
    slug: "/inventory/used-car-mississauga",
    primaryKeyword: "used cars for sale in Mississauga",
    secondaryKeywords: ["used cars in Mississauga", "pre-owned cars in Mississauga", "trade in my car in Mississauga"],
    title: "Used Cars in Mississauga | Cardora",
    description: "Looking for used cars in Mississauga? Shop quality pre-owned SUVs, sedans and more at Cardora. Financing for all credit, 10-day exchange.",
    heading: "Used Cars for Mississauga",
    ogImage: "https://www.cardora.ca/wp-content/uploads/2026/03/Cardora-n.png",
    seoContent: {
      guideHeading: "Used Cars for Sale in Mississauga: Buyer's Guide",
      overview: {
        paragraphs: [
          "From Port Credit to Meadowvale, Mississauga covers a lot of ground, and getting across the city usually means getting behind the wheel. Commuters on the 403 and QEW, parents managing school runs and weekend shoppers heading to Square One all need a car they can count on. Browsing used cars for sale in Mississauga is a practical way to find one at the right price.",
          "Cardora serves Mississauga drivers from our showroom at 8050 Dixie Rd, an easy trip north along Dixie Road. Our lot features dependable picks for every lifestyle, from roomy SUVs with the cargo space and all-weather traction families need to fuel-efficient sedans for commuters watching fuel costs. Every vehicle is inspected, priced upfront and backed by our 10-day exchange, so you're never locked into the wrong car.",
          "Have questions about payments, credit or what your current vehicle is worth? Our team can walk you through the numbers by phone, WhatsApp or text before you even leave home."
],
      },
      keyBenefits: {
        heading: "Key Benefits of Pre-Owned Cars in Mississauga",
        leadText: "For drivers in Mississauga, choosing a used vehicle pays off in several ways:",
        items: [
          {
                    "title": "Bigger Budget, Better Car",
                    "description": "Spending less upfront lets you step up to a higher trim, extra safety features or a larger SUV without stretching your finances."
          },
          {
                    "title": "Slower Value Loss",
                    "description": "New cars drop in value fastest in their first few years. A used model has already taken that hit, so it holds its value better while you own it."
          },
          {
                    "title": "Easier on Insurance",
                    "description": "Peel Region drivers pay some of the highest premiums in Ontario, and a used vehicle can help bring that monthly cost down."
          },
          {
                    "title": "Credit-Friendly Financing",
                    "description": "Whether you have strong credit, past credit challenges or are new to Canada, our finance team can match you with a plan."
          },
          {
                    "title": "Time to Decide",
                    "description": "Inspected vehicles and a 10-day exchange give you the confidence that you made the right choice."
          }
],
        summary: "That mix of value and flexibility is why so many locals now shop for pre-owned cars in Mississauga.",
      },
      tradeOffs: {
        heading: "Potential Trade-offs and Tips to Trade In My Car in Mississauga",
        leadText: "Buying used is a smart move, but a little research helps you avoid surprises:",
        items: [
          {
                    "title": "Highway Kilometres",
                    "description": "Daily trips on the 401 and 403 add up fast, so compare odometer readings and ask for maintenance records."
          },
          {
                    "title": "Salt and Rust",
                    "description": "Lakeshore winters bring heavy road salt, so check the underbody, brake lines and wheel wells closely."
          },
          {
                    "title": "Fewer Choices",
                    "description": "Inventory changes daily, so the exact colour or feature package you want may take time to find."
          },
          {
                    "title": "Older Components",
                    "description": "Tires, batteries and brakes on an older vehicle may need replacing sooner than on a newer one."
          },
          {
                    "title": "Remaining Coverage",
                    "description": "Check how much factory warranty is left and whether an extended protection plan makes sense for you."
          }
],
        closingNote: "Many drivers ask, “Should I trade in my car in Mississauga before I upgrade?” A quick appraisal with us answers that and puts your car's value toward your next purchase.",
      },
    },
    schemaMarkup: {
      "@context": "https://schema.org",
      "@graph": [
            {
                  "@type": "AutoDealer",
                  "@id": "https://www.cardora.ca/#dealer",
                  "name": "Cardora",
                  "url": "https://www.cardora.ca/",
                  "logo": "https://www.cardora.ca/wp-content/uploads/2026/03/Cardora-n.png",
                  "image": "https://www.cardora.ca/wp-content/uploads/2026/03/Cardora-n.png",
                  "telephone": "+1-855-514-5500",
                  "email": "info@cardora.ca",
                  "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "8050 Dixie Rd",
                        "addressLocality": "Brampton",
                        "addressRegion": "ON",
                        "postalCode": "L6T 4W6",
                        "addressCountry": "CA"
                  },
                  "areaServed": [
                        {
                              "@type": "City",
                              "name": "Mississauga"
                        },
                        {
                              "@type": "City",
                              "name": "Brampton"
                        },
                        {
                              "@type": "City",
                              "name": "Toronto"
                        }
                  ],
                  "openingHoursSpecification": [
                        {
                              "@type": "OpeningHoursSpecification",
                              "dayOfWeek": [
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday"
                              ],
                              "opens": "10:00",
                              "closes": "20:00"
                        },
                        {
                              "@type": "OpeningHoursSpecification",
                              "dayOfWeek": "Saturday",
                              "opens": "10:00",
                              "closes": "18:00"
                        },
                        {
                              "@type": "OpeningHoursSpecification",
                              "dayOfWeek": "Sunday",
                              "opens": "12:00",
                              "closes": "17:00"
                        }
                  ]
            },
            {
                  "@type": "WebPage",
                  "@id": "https://www.cardora.ca/inventory/used-car-mississauga/#webpage",
                  "url": "https://www.cardora.ca/inventory/used-car-mississauga/",
                  "name": "Used Cars Mississauga | Quality Pre-Owned Vehicles | Cardora",
                  "description": "Looking for used cars in Mississauga? Shop quality pre-owned SUVs, sedans and more at Cardora. Financing for all credit, 10-day exchange.",
                  "inLanguage": "en-CA",
                  "about": {
                        "@id": "https://www.cardora.ca/#dealer"
                  },
                  "breadcrumb": {
                        "@id": "https://www.cardora.ca/inventory/used-car-mississauga/#breadcrumb"
                  }
            },
            {
                  "@type": "BreadcrumbList",
                  "@id": "https://www.cardora.ca/inventory/used-car-mississauga/#breadcrumb",
                  "itemListElement": [
                        {
                              "@type": "ListItem",
                              "position": 1,
                              "name": "Home",
                              "item": "https://www.cardora.ca/"
                        },
                        {
                              "@type": "ListItem",
                              "position": 2,
                              "name": "Used Cars Mississauga",
                              "item": "https://www.cardora.ca/inventory/used-car-mississauga/"
                        }
                  ]
            }
      ]
},
  },
  toronto: {
    city: "Toronto",
    province: "Ontario",
    slug: "/inventory/used-car-toronto",
    primaryKeyword: "used cars for sale Toronto",
    secondaryKeywords: ["used cars in Toronto", "certified pre-owned cars in Toronto", "trade in my car in Toronto"],
    title: "Used Cars in Toronto | Quality Pre-Owned Vehicles | Cardora",
    description: "Looking for used cars in Toronto? Shop quality pre-owned SUVs, sedans and more at Cardora. Financing for all credit, 10-day exchange.",
    heading: "Used Cars for Toronto",
    ogImage: "https://www.cardora.ca/wp-content/uploads/2026/03/Cardora-n.png",
    seoContent: {
      guideHeading: "Used Cars for Sale Toronto Drivers Can Trust: Buyer's Guide",
      overview: {
        paragraphs: [
          "Toronto drivers deal with a little of everything: stop-and-go traffic on the Gardiner and DVP, tight downtown streets and longer runs out to Etobicoke, North York or Scarborough. The right vehicle makes all of that easier, and comparing the used cars for sale Toronto buyers can choose from is the quickest way to find a good fit without overspending.",
          "Cardora welcomes Toronto shoppers to our showroom at 8050 Dixie Rd, within easy reach of the city by Highway 401 and 427. Here you'll find popular choices for every driver, from roomy SUVs with the space and available AWD that suit growing households to compact sedans loved for their efficiency and nimble city handling. Each car is inspected, clearly priced and covered by our 10-day exchange.",
          "Not ready to visit yet? Reach our sales team by call, text, WhatsApp or email to check availability, estimate payments or book a test drive at a time that suits your schedule."
],
      },
      keyBenefits: {
        heading: "Key Benefits of Certified Pre-Owned Cars in Toronto",
        leadText: "Here's what Toronto buyers gain by going pre-owned:",
        items: [
          {
                    "title": "Lower Upfront Cost",
                    "description": "Paying less at purchase frees up money for tolls, insurance and the everyday costs of driving in a big city."
          },
          {
                    "title": "Proven Models",
                    "description": "Popular pre-owned SUVs and sedans have long track records, so you can research reliability and ownership costs before you buy."
          },
          {
                    "title": "Manageable Premiums",
                    "description": "Insurance in Toronto can be costly, and a used car usually costs less to cover than a brand-new one."
          },
          {
                    "title": "Financing for Every Situation",
                    "description": "Good credit, bruised credit or no Canadian credit history yet, our finance team works to find a payment that fits."
          },
          {
                    "title": "Built-In Flexibility",
                    "description": "Our 10-day exchange gives you a window to switch if your choice doesn't suit your routine."
          }
],
        summary: "For value without the guesswork, certified pre-owned cars in Toronto are hard to beat.",
      },
      tradeOffs: {
        heading: "Potential Trade-offs and When to Trade In My Car in Toronto",
        leadText: "Before you commit, weigh these common considerations:",
        items: [
          {
                    "title": "Stop-and-Go Wear",
                    "description": "Heavy city traffic is hard on brakes, transmissions and suspension, so ask how the vehicle was driven and serviced."
          },
          {
                    "title": "Pothole Damage",
                    "description": "Rough roads after the thaw can affect alignment, tires and suspension parts. A test drive and inspection reveal most issues."
          },
          {
                    "title": "Ownership History",
                    "description": "Review the vehicle history report for past accidents, liens or a long list of previous owners."
          },
          {
                    "title": "Less Choice on Features",
                    "description": "You're buying from existing stock, so certain option packages or colours can be harder to find."
          },
          {
                    "title": "Coverage Gaps",
                    "description": "Older models may be past their factory warranty, so consider adding an extended protection plan."
          }
],
        closingNote: "Asking yourself, “Is now the right time to trade in my car in Toronto?” Get an appraisal from our team and use your current vehicle's value to lower the cost of your next one.",
      },
    },
    schemaMarkup: {
      "@context": "https://schema.org",
      "@graph": [
            {
                  "@type": "AutoDealer",
                  "@id": "https://www.cardora.ca/#dealer",
                  "name": "Cardora",
                  "url": "https://www.cardora.ca/",
                  "logo": "https://www.cardora.ca/wp-content/uploads/2026/03/Cardora-n.png",
                  "image": "https://www.cardora.ca/wp-content/uploads/2026/03/Cardora-n.png",
                  "telephone": "+1-855-514-5500",
                  "email": "info@cardora.ca",
                  "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "8050 Dixie Rd",
                        "addressLocality": "Brampton",
                        "addressRegion": "ON",
                        "postalCode": "L6T 4W6",
                        "addressCountry": "CA"
                  },
                  "areaServed": [
                        {
                              "@type": "City",
                              "name": "Toronto"
                        },
                        {
                              "@type": "City",
                              "name": "Mississauga"
                        },
                        {
                              "@type": "City",
                              "name": "Brampton"
                        }
                  ],
                  "openingHoursSpecification": [
                        {
                              "@type": "OpeningHoursSpecification",
                              "dayOfWeek": [
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday"
                              ],
                              "opens": "10:00",
                              "closes": "20:00"
                        },
                        {
                              "@type": "OpeningHoursSpecification",
                              "dayOfWeek": "Saturday",
                              "opens": "10:00",
                              "closes": "18:00"
                        },
                        {
                              "@type": "OpeningHoursSpecification",
                              "dayOfWeek": "Sunday",
                              "opens": "12:00",
                              "closes": "17:00"
                        }
                  ]
            },
            {
                  "@type": "WebPage",
                  "@id": "https://www.cardora.ca/inventory/used-car-toronto/#webpage",
                  "url": "https://www.cardora.ca/inventory/used-car-toronto/",
                  "name": "Used Cars Toronto | Quality Pre-Owned Vehicles | Cardora",
                  "description": "Looking for used cars in Toronto? Shop quality pre-owned SUVs, sedans and more at Cardora. Financing for all credit, 10-day exchange.",
                  "inLanguage": "en-CA",
                  "about": {
                        "@id": "https://www.cardora.ca/#dealer"
                  },
                  "breadcrumb": {
                        "@id": "https://www.cardora.ca/inventory/used-car-toronto/#breadcrumb"
                  }
            },
            {
                  "@type": "BreadcrumbList",
                  "@id": "https://www.cardora.ca/inventory/used-car-toronto/#breadcrumb",
                  "itemListElement": [
                        {
                              "@type": "ListItem",
                              "position": 1,
                              "name": "Home",
                              "item": "https://www.cardora.ca/"
                        },
                        {
                              "@type": "ListItem",
                              "position": 2,
                              "name": "Used Cars Toronto",
                              "item": "https://www.cardora.ca/inventory/used-car-toronto/"
                        }
                  ]
            }
      ]
},
  },
  kitchener: {
    city: "Kitchener",
    province: "Ontario",
    slug: "/inventory/used-car-kitchener",
    primaryKeyword: "used cars for sale in Kitchener",
    secondaryKeywords: ["used cars in Kitchener", "certified used cars in Kitchener", "used car dealer Kitchener"],
    title: "Used Cars in Kitchener | Cardora",
    description: "Looking for used cars in Kitchener? Shop certified Toyota RAV4 and Honda Civic models at Cardora. Financing for all credit, 10-day exchange.",
    heading: "Used Cars for Kitchener",
    ogImage: "https://www.cardora.ca/wp-content/uploads/2026/03/Cardora-n.png",
    seoContent: {
      guideHeading: "Used Cars for Sale in Kitchener: What to Know Before You Buy",
      overview: {
        paragraphs: [
          "Kitchener has grown quickly alongside Waterloo and Cambridge, and with that growth comes more time on the road. Whether you drive the Conestoga Parkway to work, take the 401 toward the GTA or shuttle between campus and home, exploring used cars for sale in Kitchener is a smart way to find dependable transportation at a fair price.",
          "Kitchener-Waterloo drivers can visit Cardora at 8050 Dixie Rd in Brampton, an easy drive east along Highway 401. Our inventory includes favourites like the Toyota RAV4, a practical SUV with available AWD for snowy Waterloo Region winters, and the Honda Civic, a fuel-sipping commuter that's easy on the budget. Each vehicle is inspected, sold with transparent pricing and includes our 10-day exchange.",
          "Save yourself a trip by calling, texting or sending us a WhatsApp message first. We can confirm availability, share vehicle details and set up financing so everything is ready when you arrive."
],
      },
      keyBenefits: {
        heading: "Why Buy Certified Used Cars in Kitchener",
        leadText: "Going pre-owned brings real advantages for drivers in Waterloo Region:",
        items: [
          {
                    "title": "Smarter Spending",
                    "description": "A pre-owned car keeps your monthly payment lower, whether you're a student, a young professional or a growing family."
          },
          {
                    "title": "Reliable Daily Drivers",
                    "description": "The Civic and RAV4 are known for going the distance, making them a safe pick for regular 401 commutes."
          },
          {
                    "title": "Inspection Before Sale",
                    "description": "Our team checks each vehicle before it's listed, so problems are caught before you take the keys."
          },
          {
                    "title": "Credit Solutions",
                    "description": "Newcomers, first-time buyers and anyone with a less-than-perfect credit score can apply for financing with us."
          },
          {
                    "title": "Ten Days to Be Sure",
                    "description": "If the car doesn't fit your needs, our 10-day exchange lets you choose a different one."
          }
],
        summary: "For many households across the region, certified used cars in Kitchener offer the best balance of price and reliability.",
      },
      tradeOffs: {
        heading: "Potential Trade-offs When Choosing a Used Car Dealer Kitchener Drivers Trust",
        leadText: "To make a confident purchase, keep these factors in mind:",
        items: [
          {
                    "title": "Commuter Kilometres",
                    "description": "Vehicles used for daily trips between Kitchener and Toronto can rack up distance quickly, so compare the odometer with the car's age."
          },
          {
                    "title": "Heavy Snowfall",
                    "description": "Waterloo Region sees plenty of snow, so check for rust and make sure the car has good winter tires or budget for a set."
          },
          {
                    "title": "A Highway Drive Away",
                    "description": "Our showroom is in Brampton, roughly an hour away by the 401, so book your test drive in advance to make the trip worthwhile."
          },
          {
                    "title": "Stock Turnover",
                    "description": "Well-priced vehicles don't stay on the lot for long, so be ready to act when you find the right one."
          },
          {
                    "title": "Wear Items",
                    "description": "Expect to replace things like wiper blades, brake pads or tires sooner on a vehicle with some age."
          }
],
        closingNote: "Picking a used car dealer Kitchener drivers can rely on, with clear history reports and upfront pricing, helps you sidestep most of these issues.",
      },
    },
    schemaMarkup: {
      "@context": "https://schema.org",
      "@graph": [
            {
                  "@type": "AutoDealer",
                  "@id": "https://www.cardora.ca/#dealer",
                  "name": "Cardora",
                  "url": "https://www.cardora.ca/",
                  "logo": "https://www.cardora.ca/wp-content/uploads/2026/03/Cardora-n.png",
                  "image": "https://www.cardora.ca/wp-content/uploads/2026/03/Cardora-n.png",
                  "telephone": "+1-855-514-5500",
                  "email": "info@cardora.ca",
                  "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "8050 Dixie Rd",
                        "addressLocality": "Brampton",
                        "addressRegion": "ON",
                        "postalCode": "L6T 4W6",
                        "addressCountry": "CA"
                  },
                  "areaServed": [
                        {
                              "@type": "City",
                              "name": "Kitchener"
                        },
                        {
                              "@type": "City",
                              "name": "Waterloo"
                        },
                        {
                              "@type": "City",
                              "name": "Cambridge"
                        }
                  ],
                  "openingHoursSpecification": [
                        {
                              "@type": "OpeningHoursSpecification",
                              "dayOfWeek": [
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday"
                              ],
                              "opens": "10:00",
                              "closes": "20:00"
                        },
                        {
                              "@type": "OpeningHoursSpecification",
                              "dayOfWeek": "Saturday",
                              "opens": "10:00",
                              "closes": "18:00"
                        },
                        {
                              "@type": "OpeningHoursSpecification",
                              "dayOfWeek": "Sunday",
                              "opens": "12:00",
                              "closes": "17:00"
                        }
                  ]
            },
            {
                  "@type": "WebPage",
                  "@id": "https://www.cardora.ca/inventory/used-car-kitchener/#webpage",
                  "url": "https://www.cardora.ca/inventory/used-car-kitchener/",
                  "name": "Used Cars Kitchener | Toyota RAV4 & Honda Civic | Cardora",
                  "description": "Looking for used cars in Kitchener? Shop certified Toyota RAV4 and Honda Civic models at Cardora. Financing for all credit, 10-day exchange.",
                  "inLanguage": "en-CA",
                  "about": {
                        "@id": "https://www.cardora.ca/#dealer"
                  },
                  "breadcrumb": {
                        "@id": "https://www.cardora.ca/inventory/used-car-kitchener/#breadcrumb"
                  }
            },
            {
                  "@type": "BreadcrumbList",
                  "@id": "https://www.cardora.ca/inventory/used-car-kitchener/#breadcrumb",
                  "itemListElement": [
                        {
                              "@type": "ListItem",
                              "position": 1,
                              "name": "Home",
                              "item": "https://www.cardora.ca/"
                        },
                        {
                              "@type": "ListItem",
                              "position": 2,
                              "name": "Used Cars Kitchener",
                              "item": "https://www.cardora.ca/inventory/used-car-kitchener/"
                        }
                  ]
            }
      ]
},
  },
  barrie: {
    city: "Barrie",
    province: "Ontario",
    slug: "/inventory/used-car-barrie",
    primaryKeyword: "used cars for sale in Barrie",
    secondaryKeywords: ["used cars Barrie", "pre-owned cars in Barrie", "used car dealership Barrie"],
    title: "Used Cars Barrie | Quality Pre-Owned Vehicles | Cardora",
    description: "Looking for used cars in Barrie? Shop quality pre-owned SUVs, sedans and more at Cardora. Financing for all credit, 10-day exchange.",
    heading: "Used Cars for Barrie",
    ogImage: "https://www.cardora.ca/wp-content/uploads/2026/03/Cardora-n.png",
    seoContent: {
      guideHeading: "Used Cars for Sale in Barrie: A Practical Guide for Buyers",
      overview: {
        paragraphs: [
          "Barrie sits at the gateway to cottage country, and life here often means long drives, whether you're commuting down Highway 400, heading to the waterfront at Kempenfelt Bay or driving north for the weekend. With so much time behind the wheel, searching for used cars for sale in Barrie is a sensible way to get a reliable vehicle at a manageable price.",
          "Cardora welcomes Barrie buyers to our dealership at 8050 Dixie Rd in Brampton, a straightforward trip south on Highway 400. On our lot you'll find capable SUVs with available AWD and space for weekend gear, along with thrifty compact sedans that keep fuel costs down on long commutes. Every car is inspected, fairly priced and protected by our 10-day exchange.",
          "Before making the drive, contact our team by phone, text, WhatsApp or email. We'll confirm the vehicle is available, answer your questions and help you get pre-approved for financing."
],
      },
      keyBenefits: {
        heading: "The Upside of Pre-Owned Cars in Barrie",
        leadText: "Drivers in Barrie and Simcoe County enjoy several advantages when they buy used:",
        items: [
          {
                    "title": "Affordable Ownership",
                    "description": "Lower purchase prices and smaller loan amounts keep the total cost of owning a vehicle in check."
          },
          {
                    "title": "Ready for Snowbelt Driving",
                    "description": "A pre-owned SUV with AWD helps you handle the heavy lake-effect snow the area is known for."
          },
          {
                    "title": "Value That Lasts",
                    "description": "Because a pre-owned vehicle has already passed its sharpest depreciation, you lose less when you sell or trade later."
          },
          {
                    "title": "Financing Made Simple",
                    "description": "We offer financing for all credit levels, with a quick application and payment options tailored to you."
          },
          {
                    "title": "Swap Within 10 Days",
                    "description": "Our 10-day exchange gives you breathing room to be sure the vehicle suits your lifestyle."
          }
],
        summary: "With so many upsides, pre-owned cars in Barrie are a practical choice for commuters and families alike.",
      },
      tradeOffs: {
        heading: "Potential Trade-offs and Finding a Used Car Dealership Barrie Shoppers Can Count On",
        leadText: "Every used purchase comes with a few trade-offs worth knowing:",
        items: [
          {
                    "title": "Long-Distance Mileage",
                    "description": "Highway 400 commutes to the GTA add kilometres quickly, so check how the car was used and maintained."
          },
          {
                    "title": "Snowbelt Corrosion",
                    "description": "Long winters mean more road salt, so take a close look underneath for rust before you buy."
          },
          {
                    "title": "Plan Your Trip",
                    "description": "Our showroom is in Brampton, about an hour south on Highway 400, so schedule your visit ahead of time."
          },
          {
                    "title": "Selection Changes Quickly",
                    "description": "Inventory moves fast, and the model or colour you want may take a bit of patience to find."
          },
          {
                    "title": "Upcoming Service Costs",
                    "description": "Vehicles with some age may soon need new tires, brakes or a battery, so factor that into your budget."
          }
],
        closingNote: "Working with a used car dealership Barrie shoppers can count on, one that offers history reports and inspected vehicles, takes much of the risk out of buying.",
      },
    },
    schemaMarkup: {
      "@context": "https://schema.org",
      "@graph": [
            {
                  "@type": "AutoDealer",
                  "@id": "https://www.cardora.ca/#dealer",
                  "name": "Cardora",
                  "url": "https://www.cardora.ca/",
                  "logo": "https://www.cardora.ca/wp-content/uploads/2026/03/Cardora-n.png",
                  "image": "https://www.cardora.ca/wp-content/uploads/2026/03/Cardora-n.png",
                  "telephone": "+1-855-514-5500",
                  "email": "info@cardora.ca",
                  "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "8050 Dixie Rd",
                        "addressLocality": "Brampton",
                        "addressRegion": "ON",
                        "postalCode": "L6T 4W6",
                        "addressCountry": "CA"
                  },
                  "areaServed": [
                        {
                              "@type": "City",
                              "name": "Barrie"
                        },
                        {
                              "@type": "City",
                              "name": "Innisfil"
                        },
                        {
                              "@type": "City",
                              "name": "Orillia"
                        }
                  ],
                  "openingHoursSpecification": [
                        {
                              "@type": "OpeningHoursSpecification",
                              "dayOfWeek": [
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday"
                              ],
                              "opens": "10:00",
                              "closes": "20:00"
                        },
                        {
                              "@type": "OpeningHoursSpecification",
                              "dayOfWeek": "Saturday",
                              "opens": "10:00",
                              "closes": "18:00"
                        },
                        {
                              "@type": "OpeningHoursSpecification",
                              "dayOfWeek": "Sunday",
                              "opens": "12:00",
                              "closes": "17:00"
                        }
                  ]
            },
            {
                  "@type": "WebPage",
                  "@id": "https://www.cardora.ca/inventory/used-car-barrie/#webpage",
                  "url": "https://www.cardora.ca/inventory/used-car-barrie/",
                  "name": "Used Cars Barrie | Quality Pre-Owned Vehicles | Cardora",
                  "description": "Looking for used cars in Barrie? Shop quality pre-owned SUVs, sedans and more at Cardora. Financing for all credit, 10-day exchange.",
                  "inLanguage": "en-CA",
                  "about": {
                        "@id": "https://www.cardora.ca/#dealer"
                  },
                  "breadcrumb": {
                        "@id": "https://www.cardora.ca/inventory/used-car-barrie/#breadcrumb"
                  }
            },
            {
                  "@type": "BreadcrumbList",
                  "@id": "https://www.cardora.ca/inventory/used-car-barrie/#breadcrumb",
                  "itemListElement": [
                        {
                              "@type": "ListItem",
                              "position": 1,
                              "name": "Home",
                              "item": "https://www.cardora.ca/"
                        },
                        {
                              "@type": "ListItem",
                              "position": 2,
                              "name": "Used Cars Barrie",
                              "item": "https://www.cardora.ca/inventory/used-car-barrie/"
                        }
                  ]
            }
      ]
},
  },
  hamilton: {
    city: "Hamilton",
    province: "Ontario",
    slug: "/inventory/used-car-hamilton",
    primaryKeyword: "used cars for sale in Hamilton",
    secondaryKeywords: ["used cars in Hamilton", "certified used cars in Hamilton", "sell my car in Hamilton"],
    title: "Used Cars in Hamilton | Cardora",
    description: "Looking for used cars in Hamilton? Shop quality pre-owned SUVs, sedans and more at Cardora. Financing for all credit, 10-day exchange.",
    heading: "Used Cars for Hamilton",
    ogImage: "https://www.cardora.ca/wp-content/uploads/2026/03/Cardora-n.png",
    seoContent: {
      guideHeading: "Used Cars for Sale in Hamilton: Your Buying Guide",
      overview: {
        paragraphs: [
          "Hamilton blends city living with plenty of open road, from the lower city and the Mountain to Stoney Creek, Ancaster and Dundas. With daily drives along the Linc, the Red Hill Valley Parkway and the QEW, a dependable vehicle is essential, and shopping used cars for sale in Hamilton helps you get one without paying new-car prices.",
          "Cardora serves Hamilton buyers from our Brampton showroom at 8050 Dixie Rd, reachable via Highway 403 and the 407. We stock in-demand models for every lifestyle, from versatile SUVs with room for gear and available AWD to efficient sedans that make low-cost daily drivers. Every vehicle is inspected, transparently priced and comes with our 10-day exchange.",
          "Prefer to start from home? Message us on WhatsApp, text or email to confirm a vehicle is in stock, get a payment estimate or arrange a test drive before making the trip."
],
      },
      keyBenefits: {
        heading: "Top Advantages of Certified Used Cars in Hamilton",
        leadText: "Choosing used makes sense for Hamilton drivers for several reasons:",
        items: [
          {
                    "title": "Room in the Budget",
                    "description": "Buying pre-owned can save thousands compared with new, leaving money for winter tires, upkeep or your savings."
          },
          {
                    "title": "Depreciation Already Paid",
                    "description": "The steepest drop in a car's value happens early, and a second owner skips most of it."
          },
          {
                    "title": "Built for Hamilton Roads",
                    "description": "Pick from inspected SUVs and sedans that handle the climb up the Mountain and snowy winter mornings with confidence."
          },
          {
                    "title": "Approvals for All Credit",
                    "description": "From first-time buyers to those rebuilding their credit, our finance team finds lenders and terms that work for you."
          },
          {
                    "title": "Exchange Window",
                    "description": "Our 10-day exchange means you aren't stuck if the vehicle turns out to be the wrong fit."
          }
],
        summary: "It's no surprise more local drivers are choosing certified used cars in Hamilton for their next vehicle.",
      },
      tradeOffs: {
        heading: "Potential Trade-offs and How to Sell My Car in Hamilton",
        leadText: "A few points are worth checking before you sign:",
        items: [
          {
                    "title": "Escarpment Strain",
                    "description": "Frequent hill climbs and descents put extra load on brakes and transmissions, so look closely at service records."
          },
          {
                    "title": "Snowy Winters",
                    "description": "Salted roads can lead to corrosion over time, so inspect the frame, rocker panels and brake lines."
          },
          {
                    "title": "Distance to the Showroom",
                    "description": "Our dealership is in Brampton, so call ahead to confirm the vehicle you want is ready before you drive up."
          },
          {
                    "title": "Inventory Timing",
                    "description": "Popular models sell quickly, so the exact trim you have in mind might not be available the day you look."
          },
          {
                    "title": "Age-Related Repairs",
                    "description": "Higher-kilometre vehicles may need parts like shocks, belts or batteries sooner than newer ones."
          }
],
        closingNote: "If you've been searching how to sell my car in Hamilton, our team can appraise your vehicle and make you an offer, whether you're selling outright or trading toward your next one.",
      },
    },
    schemaMarkup: {
      "@context": "https://schema.org",
      "@graph": [
            {
                  "@type": "AutoDealer",
                  "@id": "https://www.cardora.ca/#dealer",
                  "name": "Cardora",
                  "url": "https://www.cardora.ca/",
                  "logo": "https://www.cardora.ca/wp-content/uploads/2026/03/Cardora-n.png",
                  "image": "https://www.cardora.ca/wp-content/uploads/2026/03/Cardora-n.png",
                  "telephone": "+1-855-514-5500",
                  "email": "info@cardora.ca",
                  "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "8050 Dixie Rd",
                        "addressLocality": "Brampton",
                        "addressRegion": "ON",
                        "postalCode": "L6T 4W6",
                        "addressCountry": "CA"
                  },
                  "areaServed": [
                        {
                              "@type": "City",
                              "name": "Hamilton"
                        },
                        {
                              "@type": "City",
                              "name": "Brampton"
                        },
                        {
                              "@type": "City",
                              "name": "Mississauga"
                        }
                  ],
                  "openingHoursSpecification": [
                        {
                              "@type": "OpeningHoursSpecification",
                              "dayOfWeek": [
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday"
                              ],
                              "opens": "10:00",
                              "closes": "20:00"
                        },
                        {
                              "@type": "OpeningHoursSpecification",
                              "dayOfWeek": "Saturday",
                              "opens": "10:00",
                              "closes": "18:00"
                        },
                        {
                              "@type": "OpeningHoursSpecification",
                              "dayOfWeek": "Sunday",
                              "opens": "12:00",
                              "closes": "17:00"
                        }
                  ]
            },
            {
                  "@type": "WebPage",
                  "@id": "https://www.cardora.ca/inventory/used-car-hamilton/#webpage",
                  "url": "https://www.cardora.ca/inventory/used-car-hamilton/",
                  "name": "Used Cars Hamilton | Quality Pre-Owned Vehicles | Cardora",
                  "description": "Looking for used cars in Hamilton? Shop quality pre-owned SUVs, sedans and more at Cardora. Financing for all credit, 10-day exchange.",
                  "inLanguage": "en-CA",
                  "about": {
                        "@id": "https://www.cardora.ca/#dealer"
                  },
                  "breadcrumb": {
                        "@id": "https://www.cardora.ca/inventory/used-car-hamilton/#breadcrumb"
                  }
            },
            {
                  "@type": "BreadcrumbList",
                  "@id": "https://www.cardora.ca/inventory/used-car-hamilton/#breadcrumb",
                  "itemListElement": [
                        {
                              "@type": "ListItem",
                              "position": 1,
                              "name": "Home",
                              "item": "https://www.cardora.ca/"
                        },
                        {
                              "@type": "ListItem",
                              "position": 2,
                              "name": "Used Cars Hamilton",
                              "item": "https://www.cardora.ca/inventory/used-car-hamilton/"
                        }
                  ]
            }
      ]
},
  },
};

export function getLocationPage(cityKey: string): LocationPageConfig | undefined {
  const normalizedKey = cityKey.toLowerCase().trim();
  return locationPages[normalizedKey];
}

export function extractLocationFromSlug(slug: string): {
  cityKey: string;
  city: string;
  locationSlug: string;
  config?: LocationPageConfig;
} | null {
  if (!slug || typeof slug !== "string") return null;
  const match = slug.trim().toLowerCase().match(/^used-cars?-([a-z0-9-]+)$/);
  if (!match) return null;
  const cityKey = match[1];
  const config = getLocationPage(cityKey);
  const city = config ? config.city : cityKey.charAt(0).toUpperCase() + cityKey.slice(1);
  return {
    cityKey,
    city,
    locationSlug: `used-car-${cityKey}`,
    config,
  };
}

export function getDynamicLocationHeading(
  refinementList: Record<string, string[] | undefined>,
  locationCity?: string,
  locationProvince?: string
): string {
  let city = locationCity ? locationCity.trim() : "Toronto";
  let province = locationProvince || "Ontario";

  if (locationCity) {
    const config = getLocationPage(locationCity);
    if (config) {
      city = config.city;
      province = config.province;
    }
  }

  const locationText = `${city}, ${province}`;

  // 1. Make & Model
  // Rule: Only include make and model if both have <= 1 selected value.
  // If > 1 make or > 1 model, neither make nor model is shown in text.
  const rawMakes = (refinementList.make || []).filter(Boolean);
  const rawModels = (refinementList.model || []).filter(Boolean);

  let singleMake: string | null = null;
  let singleModel: string | null = null;

  if (rawMakes.length <= 1 && rawModels.length <= 1) {
    if (rawMakes.length === 1) singleMake = formatFacetLabel(rawMakes[0]);
    if (rawModels.length === 1) singleModel = formatFacetLabel(rawModels[0]);
  }

  // 2. Color: only if exactly 1 value
  const rawColors = (refinementList.exterior_color || []).filter(Boolean);
  const singleColor = rawColors.length === 1 ? formatFacetLabel(rawColors[0]) : null;

  // 3. Fuel Type: only if exactly 1 value
  const rawFuels = (refinementList.fuel_type || []).filter(Boolean);
  let singleFuel: string | null = null;
  if (rawFuels.length === 1) {
    let f = formatFacetLabel(rawFuels[0]);
    if (f.toLowerCase() === "gasoline fuel") f = "Gasoline";
    else if (f.toLowerCase().endsWith(" fuel")) f = f.slice(0, -5);
    singleFuel = f;
  }

  // 4. Body Type: only if exactly 1 value
  const rawBodies = (refinementList.body_type || []).filter(Boolean);
  let singleBody: string | null = null;
  if (rawBodies.length === 1) {
    const lower = rawBodies[0].toLowerCase();
    if (lower === "sport utility vehicle" || lower === "suv-crossover") {
      singleBody = "SUV";
    } else {
      singleBody = formatFacetLabel(rawBodies[0]);
    }
  }

  const filterParts = [singleColor, singleMake, singleModel, singleFuel, singleBody].filter(Boolean);

  let filterText = "";
  if (filterParts.length === 0) {
    filterText = "Cars";
  } else if (singleFuel) {
    // If fuel type is present (e.g. Acura ADX Diesel Cars)
    filterText = `${filterParts.join(" ")} Cars`;
  } else if (!singleMake && !singleModel && !singleBody) {
    // If only adjective (e.g. Black Cars)
    filterText = `${filterParts.join(" ")} Cars`;
  } else {
    filterText = filterParts.join(" ");
  }

  return `Used ${filterText} for Sale in ${locationText}`;
}

export function getAllLocationSlugs(): string[] {
  return Object.values(locationPages).map((loc) => loc.slug);
}

export async function checkLocationHasVehicles(
  city: string,
  config?: AppConfig
): Promise<boolean> {
  try {
    const appConfig = config || defaultAppConfig;
    const protocol = appConfig.site?.typesense_protocol || "https";
    const host = appConfig.site?.typesense_host;
    const port = appConfig.site?.typesense_port || "443";
    const collection = appConfig.site?.collection;
    const apiKey = appConfig.site?.inventory_search_only_key;

    if (!host || !collection || !apiKey) {
      return false;
    }

    const url = `${protocol}://${host}:${port}/collections/${collection}/documents/search?q=*&filter_by=${encodeURIComponent(`location:${city}`)}&per_page=0`;
    const res = await fetch(url, {
      headers: {
        "x-typesense-api-key": apiKey,
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return false;
    }

    const data = await res.json();
    return typeof data.found === "number" && data.found > 0;
  } catch (err) {
    console.error("[checkLocationHasVehicles] error:", err);
    return false;
  }
}
