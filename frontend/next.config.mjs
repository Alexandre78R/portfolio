/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  reactStrictMode: true,
    outputFileTracingRoot: path.join(__dirname, '../'),
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
  },
  turbopack: {},
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