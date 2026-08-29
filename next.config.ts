import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output — the app now has API routes (upload, checkout,
  // webhooks) and renders published sites by slug, so it needs a Node
  // server. `standalone` emits a self-contained bundle with only the
  // node_modules it actually uses, which keeps the Docker image small.
  output: "standalone",
  // Photos are user-uploaded files served from a local volume through
  // /api/media. Next's optimizer would add a second copy of every image
  // to disk for no gain — `sharp` already resized them on upload.
  images: { unoptimized: true },
  // No `trailingSlash`. It was inherited from the static-export era, where
  // it made directory-style hosts behave. On a Node server it buys nothing
  // and actively breaks the OG image: Next emits
  // `/opengraph-image?<token>` (a valueless query key), and the redirect to
  // the slashed form rewrites it to `?<token>=`, which then fails to
  // render. That image is the WhatsApp preview — the first thing the
  // recipient sees — so it wins.
  devIndicators: false,
};

export default nextConfig;
