/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@speakup/agent'],
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
