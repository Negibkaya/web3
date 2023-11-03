/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;
// next.config.js
// next.config.js
module.exports = {
  webpack: (config) => {
    config.node = {
      __dirname: true,
      __filename: true,
    };

    return config;
  },
};
