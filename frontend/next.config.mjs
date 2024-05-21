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
  // webpack: (config, { dev }) => {
  //   // Désactiver le HMR en mode développement
  //   if (dev) {
  //     config.plugins = config.plugins.filter(
  //       (plugin) => plugin.constructor.name !== 'HotModuleReplacementPlugin'
  //     );
  //   }

  //   return config;
  // },
  webpack: (config, { isServer }) => {
    // Si c'est le serveur, nous n'avons pas besoin de désactiver le HMR.
    if (!isServer) {
      // Filtrer les plugins webpack pour exclure le HotModuleReplacementPlugin.
      config.plugins = config.plugins.filter(
        (plugin) => plugin.constructor.name !== 'HotModuleReplacementPlugin'
      );
    }
    
    return config;
  },
};

export default nextConfig;
