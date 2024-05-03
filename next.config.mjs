/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "amplifyappsyncblog006d327ee3c74303a67a79f6b78b0161645-dev.s3.ap-northeast-1.amazonaws.com",
      "amplifyappsyncblog006d327ee3c74303a67a79f6b78b0a5d2e-production.s3.ap-northeast-1.amazonaws.com",
    ],
  },
};

export default nextConfig;
