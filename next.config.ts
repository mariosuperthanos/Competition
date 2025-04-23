import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // If you're experiencing issues, you can try the webpack dev middleware config:
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'events-photos-recap-project.s3.eu-north-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
