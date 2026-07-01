import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Improve compatibility with older phones/browsers
  experimental: {
    optimizePackageImports: [],
  },
};

export default nextConfig;
