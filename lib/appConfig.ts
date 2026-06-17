export const defineAppConfig = (config: any) => config;

export const appConfig = defineAppConfig({
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
    saas_api: "https://demo.zopsoftware.com",
    cdn_api: "https://zopsoftware-asset.b-cdn.net",
    collection: "56d5b06765ad7f3843fd182cf2b4afe0",
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
