import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: ['192.168.1.14'],
  devIndicators: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zopsoftware-asset.b-cdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cardora.ca",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.cardora.ca",
        pathname: "/**",
      },
    ],
  },

  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
};

export default nextConfig;