import type { Metadata } from "next";
import { getAppConfig, getSafeDealershipConfig, getSafeSiteConfig } from "./appConfig";

type MetadataPageType = 
  | "home"
  | "inventory"
  | "finance"
  | "contact_us"
  | "book_an_appointment"
  | "book_a_test_drive"
  | "trade_in_appraisal"
  | "payment_calculator"
  | "thank_you"
  | "terms_and_conditions"
  | "privacy_policy"
  | "review";

interface MetadataGeneratorOptions {
  pageType: MetadataPageType;
  customTitle?: string;
  customDescription?: string;
  additionalReplacements?: Record<string, string>;
}

/**
 * Mapping of page types to their corresponding config keys in appConfig.site
 */
const PAGE_METADATA_CONFIG: Record<MetadataPageType, { titleKey: string; descriptionKey: string }> = {
  home: { titleKey: "home_page_title", descriptionKey: "home_page_description" },
  inventory: { titleKey: "inventory_page_default_title", descriptionKey: "inventory_page_default_description" },
  finance: { titleKey: "finance_page_title", descriptionKey: "finance_page_description" },
  contact_us: { titleKey: "contact_us_page_title", descriptionKey: "contact_us_page_description" },
  book_an_appointment: { titleKey: "book_an_appointment_page_title", descriptionKey: "book_an_appointment_page_description" },
  book_a_test_drive: { titleKey: "book_a_test_drive_page_title", descriptionKey: "book_a_test_drive_page_description" },
  trade_in_appraisal: { titleKey: "trade_in_appraisal_page_title", descriptionKey: "trade_in_appraisal_page_description" },
  payment_calculator: { titleKey: "payment_calculator_page_title", descriptionKey: "payment_calculator_page_description" },
  thank_you: { titleKey: "thank_you_page_title", descriptionKey: "thank_you_page_description" },
  terms_and_conditions: { titleKey: "terms_and_conditions_page_title", descriptionKey: "terms_and_conditions_page_description" },
  privacy_policy: { titleKey: "privacy_policy_page_title", descriptionKey: "privacy_policy_page_description" },
  review: { titleKey: "review_page_title", descriptionKey: "review_page_description" },
};

/**
 * Replace template placeholders in metadata strings
 * Supports: %dealership_name, %city_1, %province_1, %sales_number_1, %email_1
 */
function replacePlaceholders(
  template: string,
  dealership: ReturnType<typeof getSafeDealershipConfig>,
  additionalReplacements?: Record<string, string>
): string {
  let result = template;

  // Standard replacements
  result = result.replace(/%dealership_name/g, dealership.dealership_name);
  result = result.replace(/%city_1/g, dealership.city_1);
  result = result.replace(/%province_1/g, dealership.province_1);
  result = result.replace(/%sales_number_1/g, dealership.sales_number_1);
  result = result.replace(/%email_1/g, dealership.email_1);

  // Custom replacements
  if (additionalReplacements) {
    Object.entries(additionalReplacements).forEach(([key, value]) => {
      result = result.replace(new RegExp(`%${key}`, "g"), value);
    });
  }

  return result;
}

export async function generateMetadata(
  options: MetadataGeneratorOptions
): Promise<Metadata> {
  const appConfig = await getAppConfig();
  const safeD = getSafeDealershipConfig(appConfig.dealership);
  const safeS = getSafeSiteConfig(appConfig.site);
  const config = PAGE_METADATA_CONFIG[options.pageType];

  if (!config) {
    throw new Error(`Unknown page type: ${options.pageType}`);
  }

  const baseTitle = safeS[config.titleKey as keyof typeof safeS] || "";
  const baseDescription = safeS[config.descriptionKey as keyof typeof safeS] || "";

  const titleTemplate = options.customTitle || baseTitle;
  const descriptionTemplate = options.customDescription || baseDescription;

  const title = replacePlaceholders(titleTemplate, safeD, options.additionalReplacements);
  const description = replacePlaceholders(descriptionTemplate, safeD, options.additionalReplacements);

  return { title, description };
}
