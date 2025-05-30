import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignore TypeScript and ESLint errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Remove console logs in production (Next.js 13+ method)
  compiler: {
    removeConsole: false,
  },

  // If you're experiencing issues, you can try the webpack dev middleware config:
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'events-photos-recap-project.s3.eu-north-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'letsenhance.io', // Add this pattern for the new image source
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Add this pattern for the new image source
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      }
    ],
  },
};

export default nextConfig;
