/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  // webpackDevMiddleware: (config) => {
  //   if (process.env.NEXT_DISABLE_HMR === 'true') {
  //     config.watchOptions = {
  //       ignored: /./,
  //     };
  //   }
  //   return config;
  // },
  webpack: (config, { dev }) => {
    // Désactiver le HMR en mode développement
    if (dev) {
      config.plugins = config.plugins.filter(
        (plugin) => plugin.constructor.name !== 'HotModuleReplacementPlugin'
      );
    }

    return config;
  },
};

export default nextConfig;
