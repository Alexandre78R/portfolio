/** @type {import('next').NextConfig} */

const isProduction = process.env.isProduction === 'production';

const nextConfig = {
  reactStrictMode: true,
  // target: isProduction ? 'server' : 'serverless',
};

export default nextConfig;
