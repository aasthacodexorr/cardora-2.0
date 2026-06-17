/* =========================
   CardoraLogo Component (Common)
   Renders the Cardora brand logo image.
   Used in the Header (desktop + mobile)
   and anywhere else the logo is needed.
   The image is served from /public/cardora-logo.png.
========================= */

import Image from "next/image";
import { appConfig } from "@/lib/appConfig";

const CardoraLogo = () => {
  return (
    <Image
      src={appConfig.dealership.dealership_logo || "/cardora-logo.png"}
      alt={`${appConfig.dealership.dealership_name} Logo`}
      width={200}
      height={60}
      priority
      className="h-[48px] w-auto object-contain"
    />
  );
};

export default CardoraLogo;
