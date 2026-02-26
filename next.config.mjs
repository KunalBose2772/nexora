/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow local images in /public
    unoptimized: false,
  },
  // Ensure CSS modules and globals work
  reactStrictMode: true,
};

export default nextConfig;
