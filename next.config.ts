import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },

  devIndicators: false,

  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
};

export default nextConfig;