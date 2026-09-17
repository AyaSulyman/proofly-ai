import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // In production, business/seller photos come from the Django API
    // (Cloudinary/S3 URLs). api.dicebear.com is only used here to generate
    // realistic-looking placeholder avatars for businesses/sellers that
    // haven't uploaded a real photo yet, matching what the backend will
    // eventually return in `imageUrl`.
    remotePatterns: [
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.s3.amazonaws.com" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
