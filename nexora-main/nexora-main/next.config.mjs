/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow local images in /public
    unoptimized: false,
  },
  // Disable strict mode to prevent double-renders/mounts in dev
  reactStrictMode: false,

  // Prevent the file watcher from triggering reloads on DB writes
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/.next/**",
          "**/dev.db",
          "**/dev.db-journal",
          "**/dev.db-wal",
          "**/dev.db-shm",
          "**/prisma/migrations/**",
        ],
      };
    }
    return config;
  },
};

export default nextConfig;

