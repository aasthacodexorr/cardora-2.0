import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ScriptLoader } from "@/components/ScriptLoader";
import { getAppConfig } from "@/lib/appConfig";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadataHelper";

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataHelper({ pageType: "home" });
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appConfig = await getAppConfig();

  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <head>
        {/* Load form validation script before any interactive content */}
        <ScriptLoader />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers config={appConfig}>{children}</Providers>
      </body>
    </html>
  );
}