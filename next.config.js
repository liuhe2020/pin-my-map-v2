/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/pin-my-map/image/upload/**',
      },
    ],
  },
};

module.exports = nextConfig;
