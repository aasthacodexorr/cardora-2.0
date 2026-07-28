"use client";

import { useState } from "react";
import { downloadCouponPdf } from "@/utils/downloadCouponPdf";
import { Loader } from "lucide-react";
import { COLORS } from "@/lib/colors";

interface Props {
  imageUrl: string;
  fileName: string;
}

export default function DownloadCouponButton({
  imageUrl,
  fileName,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadCouponPdf(imageUrl, fileName);
    } catch (error) {
      console.error("Failed to download coupon:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isDownloading}
      className={`flex items-center justify-center gap-2 w-full lg:max-w-[170px] min-h-[46px] cursor-pointer hover:brightness-95 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition duration-200 text-center text-xs md:text-sm shadow-sm border`}
      style={{
        background: `linear-gradient(to bottom, ${COLORS.primary.green}, ${COLORS.primary.greenAlpha})`,
        borderColor: COLORS.primary.green
      }}
    >
      {isDownloading ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        "Download Offer"
      )}
    </button>
  );
}