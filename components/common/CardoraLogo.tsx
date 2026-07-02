/* =========================
   CardoraLogo Component (Common)
   Renders the Cardora brand logo image.
   Used in the Header (desktop + mobile)
   and anywhere else the logo is needed.
   The image is served from /public/cardora-logo.png.
========================= */

import Image from "next/image";
import { useAppConfig } from "@/app/providers";
import { fallbackValue, defaultAppConfig } from "@/lib/appConfig";

const CardoraLogo = () => {
  const appConfig = useAppConfig();
  const defaultD = defaultAppConfig.dealership;
  
  const safeD = {
    dealership_logo: fallbackValue(appConfig.dealership.dealership_logo, defaultD.dealership_logo),
    dealership_name: fallbackValue(appConfig.dealership.dealership_name, defaultD.dealership_name),
  };
  
  return (
    <Image
      src={safeD.dealership_logo || "/cardora-logo.png"}
      alt={`${safeD.dealership_name} Logo`}
      width={200}
      height={60}
      priority
      className="h-[48px] w-auto object-contain"
    />
  );
};

export default CardoraLogo;
