/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@lib": path.resolve(__dirname, "lib"),
      "@db": path.resolve(__dirname, "lib/db/prisma"),
      "@utils": path.resolve(__dirname, "lib/utils"),
      "@components": path.resolve(__dirname, "components"),
    };
    return config;
  },
};

module.exports = nextConfig;
