/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Browser code reads NEXT_PUBLIC_*; use GOOGLE_MAPS_API_KEY in .env (recommended).
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.env.GOOGLE_MAPS_API_KEY ||
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      "",
  },
};

export default nextConfig;
