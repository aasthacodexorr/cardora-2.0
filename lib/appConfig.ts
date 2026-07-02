export const defineAppConfig = (config: any) => config;

export const defaultAppConfig = defineAppConfig({
  dealership: {
    dealership_name: "Demo Dealership",
    dealership_logo:
      "https://zopsoftware-asset.b-cdn.net/phaeton/themes/theme-1/images/demo_dealership_2_cropped.png",
    full_address_1: "1 Yonge St #1801",
    city_1: "Toronto",
    province_1: "Ontario",
    postal_code_1: "M5E 1W7",
    country_1: "CA",
    address_1_bar: "https://goo.gl/maps/zGuoEbgdJ2FC2MLW9",
    address_map_url_1:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11549.100105101092!2d-79.374554!3d43.642446!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4cb296060ebb1%3A0x24a25d5415ad871!2s1%20Yonge%20St%20%231801%2C%20Toronto%2C%20ON%20M5E%201W7%2C%20Canada!5e0!3m2!1sen!2sin!4v1739201380764!5m2!1sen!2sin",
    show_address_2: true,
    full_address_2: "18 Bartol Street",
    city_2: "San Francisco",
    province_2: "CA",
    postal_code_2: "94133",
    country_2: "USA",
    address_2_bar: "https://maps.app.goo.gl/6t8TafUNTrZ6Gvp8A",
    address_map_url_2: "",
    show_address_3: false,
    full_address_3: "18 Bartol Street",
    city_3: "San Francisco",
    province_3: "CA",
    postal_code_3: "94133",
    country_3: "USA",
    address_3_bar: "https://maps.app.goo.gl/6t8TafUNTrZ6Gvp8A",
    address_map_url_3: "",
    toll_free_number_1: "1-888-879-0000",
    toll_free_number_2: "",
    sales_number_1: "416-840-6606",
    sales_number_2: "",
    cell_phone_1: "",
    cell_phone_2: "",
    fax_number_1: "",
    fax_number_2: "",
    email_1: "support@example.com",
    email_2: "",
    social_media_facebook: "https://www.facebook.com/",
    social_media_instagram: "https://www.instagram.com/",
    social_media_twitter: "https://twitter.com/",
    social_media_youtube: "",
    social_media_google_review: "",
    social_media_tiktok: "",
    working_hours: [],
    default_placeholder_image:
      "https://zopsoftware-asset.b-cdn.net/image/3052a46429ae1b30c67d59f82c1b3a07/1691004750_0b3143a68b415b9465e9.jpg",
  },
  site: {
    saas_api: "https://cardora.zopsoftware.com/",
    cdn_api: "https://zopsoftware-asset.b-cdn.net",
    collection: "07cb7c095c0cf712732a976016079e19",
    feature_inventory_key:
      "Rjl5ckZSUmJVaE5raS9KRi9BUDV2bld6S2h0a3dSOFJYMTcybnBnQ2N3Yz1oZmUweyJmaWx0ZXJfYnkiOiJzdGF0dXM6W0luc3RvY2tdICYmIGZlYXR1cmVfbGlzdGluZzoxICYmIHZpc2liaWxpdHk6PjAgJiYgZGVsZXRlZF9hdDo9MCJ9",
    default_sort: "/sort/status_rank:asc,created_at:desc",
    inventory_slug: "inventory",
    typesense_host: "v6eba1srpfohj89dp-1.a1.typesense.net",
    typesense_port: "443",
    typesense_protocol: "https",
    inventory_page_key:
      "ZWoxa3NxVmJLWFBOK2dWcUFBM1V0aTJyb09wUDhFZ0R5Vnc1blc2RW9Kdz1oZmUweyJmaWx0ZXJfYnkiOiJzdGF0dXM6W0luc3RvY2ssIFNvbGRdICYmIHZpc2liaWxpdHk6PjAgJiYgZGVsZXRlZF9hdDo9MCJ9",
    inventory_search_only_key:
      "ZWoxa3NxVmJLWFBOK2dWcUFBM1V0aTJyb09wUDhFZ0R5Vnc1blc2RW9Kdz1oZmUweyJmaWx0ZXJfYnkiOiJzdGF0dXM6W0luc3RvY2ssIFNvbGRdICYmIHZpc2liaWxpdHk6PjAgJiYgZGVsZXRlZF9hdDo9MCJ9",
    inventory_pricing_verbage: "* Pricing excludes licensing and tax",
    vlp_template_template_type: "left",
    vlp_entity_image: "first_image",
    vdp_page_title_template:
      "%year %make %model at %dealership_name %city_1, %province_1",
    vdp_page_description_template:
      "Buy %year %make %model %trim - %dynamic_price_placeholder with confidence. Visit %dealership_name in %city_1 %province_1.",
    vdp_page_version: 2,
    vdp_image_gallery_version: 2,
    book_an_appointment_page_title:
      "Book Your Appointment With Our Experts in %city_1 %province_1",
    book_an_appointment_page_description:
      "Schedule a service appointment with %dealership_name and ensure your vehicle receives the best care in %city_1 %province_1.",
    book_a_test_drive_page_title: "Book Vehicles Test Drive Today",
    book_a_test_drive_page_description:
      "Looking for test drive? Book a test drive for various vehicles at %dealership_name %city_1, %province_1 by filling in the form and the rest we will take care of it!",
    contact_us_page_title: "Contact Us",
    contact_us_page_description:
      "Call %dealership_name %city_1, %province_1 at %sales_number_1 and our team will help you schedule a test drive or answer your questions. You can also drop us an email at %email_1.",
    trade_in_appraisal_page_title: "Trade In or Appraise Your Vehicle",
    trade_in_appraisal_page_description:
      "Vehicle appraisal for used cars, trucks and SUVs in  %city_1, %province_1 at %dealership_name. Find out what your trade in worth with our vehicle appraisal form.",
    home_page_title: "Used Cars, SUVs, Trucks for Sale in %city_1, %province_1",
    home_page_description:
      "At %dealership_name, we have a great variety of used cars, trucks, SUVs, and vans that we are sure you will find the right fit for you! Visit us today in %city_1, %province_1",
    finance_page_title: "Auto Financing in %city_1, %province_1",
    finance_page_description:
      "Easiest car loan approvals for good or bad credit only at %dealership_name %city_1, %province_1. Quick online pre-approval for car loans with low and affordable monthly payments.",
    inventory_page_default_title:
      "Used Cars in %city_1, %province_1 - Browse our Inventory Online",
    inventory_page_default_description:
      "Searching for the perfect used car in %province_1? Stop by %dealership_name ! We are your source for the best selection of used cars for sale in %city_1, %province_1.",
    payment_calculator_page_title: "Estimate Your Car Payment",
    payment_calculator_page_description:
      "Use %dealership_name's payment calculator to easily estimate and compare monthly payments on your next vehicle purchase.",
    thank_you_page_title: "Thank You",
    thank_you_page_description:
      "Thank You for entrusting us with your business - %dealership_name",
    terms_and_conditions_page_title: "Terms And Conditions",
    terms_and_conditions_page_description:
      "Please review terms and conditions of %dealership_name %city_1, %province_1. If you have any questions, feel free to contact us at %sales_number_1 or email us at %email_1",
    privacy_policy_page_title: "Privacy Policy",
    privacy_policy_page_description:
      "Please review privacy policy of %dealership_name %city_1, %province_1. If you have any questions, feel free to contact us at %sales_number_1 or email us at %email_1",
    review_page_title: "%dealership_name reviews",
    review_page_description:
      "Check out real reviews from satisfied customers at our dealership. Learn about their experiences and why we are the preferred destination for used car buyers.",
  },
  schema_org: {
    entity_type: "AutoDealer",
    vdp_entity_type: "Car",
    vdp_entity_tite: "%year %make %model %trim",
    opening_hours: "Tu - Fr 09:00-18:00",
    photos: [],
    currencies_accepted: "USD",
    payment_accepted: "Cash, Credit Card",
    price_range: "$$",
    keywords: [],
  },
  payment_calculator: {
    vehicle_price: 25000,
    additional_fees: 0,
    downpayment: 0,
    duration: 84,
    interest_rate: 7.99,
    tax: 13,
  },
});

export type AppConfig = typeof defaultAppConfig;

/**
 * Fallback helper: Returns value if it's not null/undefined/empty string, 
 * otherwise returns the default value
 */
export function fallbackValue<T>(value: T | null | undefined | "", defaultValue: T): T {
  return (value === null || value === undefined || value === "") ? defaultValue : value;
}

/**
 * Helper to create a safe dealership config object with fallback values
 * Use this when you need all dealership fields with fallback logic applied
 */
export function getSafeDealershipConfig(apiConfig: AppConfig['dealership']) {
  const defaultD = defaultAppConfig.dealership;
  
  return {
    dealership_name: fallbackValue(apiConfig.dealership_name, defaultD.dealership_name),
    dealership_logo: fallbackValue(apiConfig.dealership_logo, defaultD.dealership_logo),
    full_address_1: fallbackValue(apiConfig.full_address_1, defaultD.full_address_1),
    city_1: fallbackValue(apiConfig.city_1, defaultD.city_1),
    province_1: fallbackValue(apiConfig.province_1, defaultD.province_1),
    postal_code_1: fallbackValue(apiConfig.postal_code_1, defaultD.postal_code_1),
    country_1: fallbackValue(apiConfig.country_1, defaultD.country_1),
    address_1_bar: fallbackValue(apiConfig.address_1_bar, defaultD.address_1_bar),
    address_2_bar: fallbackValue(apiConfig.address_2_bar, defaultD.address_2_bar),
    address_map_url_1: fallbackValue(apiConfig.address_map_url_1, defaultD.address_map_url_1),
    toll_free_number_1: fallbackValue(apiConfig.toll_free_number_1, defaultD.toll_free_number_1),
    toll_free_number_2: fallbackValue(apiConfig.toll_free_number_2, defaultD.toll_free_number_2),
    sales_number_1: fallbackValue(apiConfig.sales_number_1, defaultD.sales_number_1),
    sales_number_2: fallbackValue(apiConfig.sales_number_2, defaultD.sales_number_2),
    cell_phone_1: fallbackValue(apiConfig.cell_phone_1, defaultD.cell_phone_1),
    cell_phone_2: fallbackValue(apiConfig.cell_phone_2, defaultD.cell_phone_2),
    fax_number_1: fallbackValue(apiConfig.fax_number_1, defaultD.fax_number_1),
    fax_number_2: fallbackValue(apiConfig.fax_number_2, defaultD.fax_number_2),
    email_1: fallbackValue(apiConfig.email_1, defaultD.email_1),
    email_2: fallbackValue(apiConfig.email_2, defaultD.email_2),
    social_media_facebook: fallbackValue(apiConfig.social_media_facebook, defaultD.social_media_facebook),
    social_media_instagram: fallbackValue(apiConfig.social_media_instagram, defaultD.social_media_instagram),
    social_media_twitter: fallbackValue(apiConfig.social_media_twitter, defaultD.social_media_twitter),
    social_media_youtube: fallbackValue(apiConfig.social_media_youtube, defaultD.social_media_youtube),
    social_media_tiktok: fallbackValue(apiConfig.social_media_tiktok, defaultD.social_media_tiktok),
    social_media_google_review: fallbackValue(apiConfig.social_media_google_review, defaultD.social_media_google_review),
    default_placeholder_image: fallbackValue(apiConfig.default_placeholder_image, defaultD.default_placeholder_image),
    working_hours: apiConfig.working_hours ?? defaultD.working_hours,
  };
}

/**
 * Helper to create a safe site config object with fallback values
 */
export function getSafeSiteConfig(apiConfig: AppConfig['site']) {
  const defaultS = defaultAppConfig.site;
  
  return {
    saas_api: fallbackValue(apiConfig.saas_api, defaultS.saas_api),
    cdn_api: fallbackValue(apiConfig.cdn_api, defaultS.cdn_api),
    collection: fallbackValue(apiConfig.collection, defaultS.collection),
    feature_inventory_key: fallbackValue(apiConfig.feature_inventory_key, defaultS.feature_inventory_key),
    default_sort: fallbackValue(apiConfig.default_sort, defaultS.default_sort),
    inventory_slug: fallbackValue(apiConfig.inventory_slug, defaultS.inventory_slug),
    typesense_host: fallbackValue(apiConfig.typesense_host, defaultS.typesense_host),
    typesense_port: fallbackValue(apiConfig.typesense_port, defaultS.typesense_port),
    typesense_protocol: fallbackValue(apiConfig.typesense_protocol, defaultS.typesense_protocol),
    inventory_page_key: fallbackValue(apiConfig.inventory_page_key, defaultS.inventory_page_key),
    inventory_search_only_key: fallbackValue(apiConfig.inventory_search_only_key, defaultS.inventory_search_only_key),
    inventory_pricing_verbage: fallbackValue(apiConfig.inventory_pricing_verbage, defaultS.inventory_pricing_verbage),
    vlp_template_template_type: fallbackValue(apiConfig.vlp_template_template_type, defaultS.vlp_template_template_type),
    vlp_entity_image: fallbackValue(apiConfig.vlp_entity_image, defaultS.vlp_entity_image),
    vdp_page_title_template: fallbackValue(apiConfig.vdp_page_title_template, defaultS.vdp_page_title_template),
    vdp_page_description_template: fallbackValue(apiConfig.vdp_page_description_template, defaultS.vdp_page_description_template),
    vdp_page_version: apiConfig.vdp_page_version ?? defaultS.vdp_page_version,
    vdp_image_gallery_version: apiConfig.vdp_image_gallery_version ?? defaultS.vdp_image_gallery_version,
    book_an_appointment_page_title: fallbackValue(apiConfig.book_an_appointment_page_title, defaultS.book_an_appointment_page_title),
    book_an_appointment_page_description: fallbackValue(apiConfig.book_an_appointment_page_description, defaultS.book_an_appointment_page_description),
    book_a_test_drive_page_title: fallbackValue(apiConfig.book_a_test_drive_page_title, defaultS.book_a_test_drive_page_title),
    book_a_test_drive_page_description: fallbackValue(apiConfig.book_a_test_drive_page_description, defaultS.book_a_test_drive_page_description),
    contact_us_page_title: fallbackValue(apiConfig.contact_us_page_title, defaultS.contact_us_page_title),
    contact_us_page_description: fallbackValue(apiConfig.contact_us_page_description, defaultS.contact_us_page_description),
    trade_in_appraisal_page_title: fallbackValue(apiConfig.trade_in_appraisal_page_title, defaultS.trade_in_appraisal_page_title),
    trade_in_appraisal_page_description: fallbackValue(apiConfig.trade_in_appraisal_page_description, defaultS.trade_in_appraisal_page_description),
    home_page_title: fallbackValue(apiConfig.home_page_title, defaultS.home_page_title),
    home_page_description: fallbackValue(apiConfig.home_page_description, defaultS.home_page_description),
    finance_page_title: fallbackValue(apiConfig.finance_page_title, defaultS.finance_page_title),
    finance_page_description: fallbackValue(apiConfig.finance_page_description, defaultS.finance_page_description),
    inventory_page_default_title: fallbackValue(apiConfig.inventory_page_default_title, defaultS.inventory_page_default_title),
    inventory_page_default_description: fallbackValue(apiConfig.inventory_page_default_description, defaultS.inventory_page_default_description),
    payment_calculator_page_title: fallbackValue(apiConfig.payment_calculator_page_title, defaultS.payment_calculator_page_title),
    payment_calculator_page_description: fallbackValue(apiConfig.payment_calculator_page_description, defaultS.payment_calculator_page_description),
    thank_you_page_title: fallbackValue(apiConfig.thank_you_page_title, defaultS.thank_you_page_title),
    thank_you_page_description: fallbackValue(apiConfig.thank_you_page_description, defaultS.thank_you_page_description),
    terms_and_conditions_page_title: fallbackValue(apiConfig.terms_and_conditions_page_title, defaultS.terms_and_conditions_page_title),
    terms_and_conditions_page_description: fallbackValue(apiConfig.terms_and_conditions_page_description, defaultS.terms_and_conditions_page_description),
    privacy_policy_page_title: fallbackValue(apiConfig.privacy_policy_page_title, defaultS.privacy_policy_page_title),
    privacy_policy_page_description: fallbackValue(apiConfig.privacy_policy_page_description, defaultS.privacy_policy_page_description),
    review_page_title: fallbackValue(apiConfig.review_page_title, defaultS.review_page_title),
    review_page_description: fallbackValue(apiConfig.review_page_description, defaultS.review_page_description),
  };
}

/**
 * Helper to create a safe schema_org config object with fallback values
 */
export function getSafeSchemaOrgConfig(apiConfig: AppConfig['schema_org']) {
  const defaultSO = defaultAppConfig.schema_org;
  
  return {
    entity_type: fallbackValue(apiConfig.entity_type, defaultSO.entity_type),
    vdp_entity_type: fallbackValue(apiConfig.vdp_entity_type, defaultSO.vdp_entity_type),
    vdp_entity_tite: fallbackValue(apiConfig.vdp_entity_tite, defaultSO.vdp_entity_tite),
    opening_hours: fallbackValue(apiConfig.opening_hours, defaultSO.opening_hours),
    photos: apiConfig.photos ?? defaultSO.photos,
    currencies_accepted: fallbackValue(apiConfig.currencies_accepted, defaultSO.currencies_accepted),
    payment_accepted: fallbackValue(apiConfig.payment_accepted, defaultSO.payment_accepted),
    price_range: fallbackValue(apiConfig.price_range, defaultSO.price_range),
    keywords: apiConfig.keywords ?? defaultSO.keywords,
  };
}

/**
 * Helper to create a safe payment_calculator config object with fallback values
 */
export function getSafePaymentCalculatorConfig(apiConfig: AppConfig['payment_calculator']) {
  const defaultPC = defaultAppConfig.payment_calculator;
  
  return {
    vehicle_price: apiConfig.vehicle_price ?? defaultPC.vehicle_price,
    additional_fees: apiConfig.additional_fees ?? defaultPC.additional_fees,
    downpayment: apiConfig.downpayment ?? defaultPC.downpayment,
    duration: apiConfig.duration ?? defaultPC.duration,
    interest_rate: apiConfig.interest_rate ?? defaultPC.interest_rate,
    tax: apiConfig.tax ?? defaultPC.tax,
  };
}

function isObject(item: any): item is Record<string, any> {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function deepMerge<T extends Record<string, any>>(target: T, source: Record<string, any>): T {
  const output = { ...target } as Record<string, any>;
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  return output as T;
}

export async function getAppConfig(): Promise<AppConfig> {
  try {
    const res = await fetch("https://cardora.zopsoftware.com/api/website/configuration", {
      next: { revalidate: 60 }
    });
    if (!res.ok) {
      return defaultAppConfig;
    }
    const apiConfig = await res.json();
    const mergedConfig = deepMerge(defaultAppConfig, apiConfig);
    
    // Apply fallback logic to all config sections to ensure null/undefined/"" values use defaults
    return {
      dealership: getSafeDealershipConfig(mergedConfig.dealership),
      site: getSafeSiteConfig(mergedConfig.site),
      schema_org: getSafeSchemaOrgConfig(mergedConfig.schema_org),
      payment_calculator: getSafePaymentCalculatorConfig(mergedConfig.payment_calculator),
    };
  } catch (error) {
    console.error("Failed to fetch app configuration", error);
    return defaultAppConfig;
  }
}
