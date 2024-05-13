/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    disableStaticImages: true
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig;
