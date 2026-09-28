/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    // Stub optional peer deps from @react-three/drei that we don't use
    config.resolve.alias = {
      ...config.resolve.alias,
      'hls.js': false,
    };

    return config;
  },
};

module.exports = nextConfig;
