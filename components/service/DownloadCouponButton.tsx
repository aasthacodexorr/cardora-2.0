 

"use client";

import { downloadCouponPdf } from "@/utils/downloadCouponPdf";

interface Props {
  imageUrl: string;
  fileName: string;
}

export default function DownloadCouponButton({
  imageUrl,
  fileName,
}: Props) {
  return (
    <button
      type="button"
      onClick={() => downloadCouponPdf(imageUrl, fileName)}
      className="block cursor-pointer w-full bg-gradient-to-b from-[#00af66] to-[#00af66a6] hover:bg-[#0f9f6e] text-white font-medium py-3 px-4 rounded-md transition duration-200 text-center text-sm shadow-sm"
    >
      Download Offer
    </button>
  );
}