import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Turbopack for development
  experimental: {
    turbo: {
    }
  },
  // Your existing webpack config
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};
export default nextConfig;
