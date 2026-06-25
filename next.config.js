/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@remotion/bundler", "@remotion/renderer"],
};

module.exports = nextConfig;
