/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/stock",
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
