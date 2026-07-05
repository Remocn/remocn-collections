/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@remotion/bundler", "@remotion/renderer"],
  // Inline the demo-assets override into the client bundle so the site's
  // <Player> honors it too (Remotion Studio/CLI read it from .env directly).
  env: {
    REMOTION_DEMO_ASSETS_BASE: process.env.REMOTION_DEMO_ASSETS_BASE ?? "",
  },
};

module.exports = nextConfig;
