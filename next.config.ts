import type { NextConfig } from "next";

const nextConfig = {
  // Tambahkan ini untuk menghilangkan logo "N" kecil di pojok
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false, // Untuk Next.js versi terbaru
  },
};

export default nextConfig;
