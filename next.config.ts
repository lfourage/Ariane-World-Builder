import path from "path"
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;
