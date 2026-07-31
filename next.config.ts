import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export — the whole experience is client-side, so it can be
  // dropped on any static host (GitHub Pages, Netlify, Vercel, S3).
  output: "export",
  // Required by `output: "export"` — there is no image optimization server.
  // The app uses plain <img> tags anyway (photos are user-supplied files).
  images: { unoptimized: true },
  trailingSlash: true,
  devIndicators: false,
};

export default nextConfig;
