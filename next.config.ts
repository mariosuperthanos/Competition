import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // // Enable Turbopack for development with optimized settings
  // experimental: {
  //   turbo: {
  //     // Enable incremental compilation
  //     loaders: {
  //       '.js': ['swc-loader'],
  //       '.mjs': ['swc-loader'],
  //       '.jsx': ['swc-loader'],
  //       '.ts': ['swc-loader'],
  //       '.tsx': ['swc-loader'],
  //     },
  //     // Reduce the number of files being watched
  //     ignorePatterns: ['node_modules/**', '.git/**', '.next/**', 'out/**'],
  //   },
  //   // Other experimental features for faster dev experience
  //   optimizeCss: true, // Optimize CSS for faster builds
  //   serverActions: {
  //     bodySizeLimit: '2mb', // Increase if needed based on your requirements
  //   },
  // },
  // // Optimize webpack config
  // webpack: (config, { dev }) => {
  //   config.resolve.fallback = { fs: false, path: false };
    
  //   // Only apply in development mode
  //   if (dev) {
  //     // Optimize for development speed
  //     config.optimization = {
  //       ...config.optimization,
  //       removeAvailableModules: false,
  //       removeEmptyChunks: false,
  //       splitChunks: false,
  //     };
  //     // Disable source maps if not needed for even faster builds
  //     // config.devtool = false;
  //   }
    
  //   return config;
  // },
  // // Limit what triggers rebuilds
  // onDemandEntries: {
  //   // Keep pages in memory longer (in ms)
  //   maxInactiveAge: 60 * 60 * 1000,
  //   // Increase number of pages to cache
  //   pagesBufferLength: 5,
  // },
  // // Disable static export optimization during development
  // output: process.env.NODE_ENV === 'development' ? undefined : 'export',
  // // Minimize server-side compilation
  // swcMinify: true,
  // poweredByHeader: false,
  // // Reduce unnecessary page re-renders
  // reactStrictMode: false, // Consider setting to true for production
};

export default nextConfig;
