/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@mui/x-date-pickers',
    '@mui/material',
    '@mui/system',
    '@mui/icons-material',
  ],
  env: {
    NEXT_PUBLIC_API_TOKEN: process.env.NEXT_PUBLIC_API_TOKEN,
    API_URL: process.env.API_URL,
  },
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
    disableOptimizedFontLoading: false,
  },
  onDemandEntries: {
    maxInactiveAge: 60000,
    pagesBufferLength: 5,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        poll: false,
        aggregateTimeout: 800,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/img/logo.jpeg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;