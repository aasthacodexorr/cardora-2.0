"use client"

import { jsPDF } from "jspdf";

export const downloadCouponPdf = async (
  imageUrl: string,
  fileName = "coupon"
) => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();

  return new Promise<void>((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const dataUrl = reader.result as string;

      const img = new Image();

      img.onload = () => {
        try {
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
          });

          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();

          const ratio = Math.min(
            pageWidth / img.width,
            pageHeight / img.height
          );

          const width = img.width * ratio;
          const height = img.height * ratio;

          const x = (pageWidth - width) / 2;
          const y = (pageHeight - height) / 2;

          pdf.addImage(dataUrl, "JPEG", x, y, width, height);
          pdf.save(`${fileName}.pdf`);

          resolve();
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = reject;
      img.src = dataUrl;
    };

    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};