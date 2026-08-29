import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { env } from "@/lib/env";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

/**
 * Product-level defaults. Each published site overrides title, description
 * and OG tags in its own `generateMetadata` — this is only what shows for
 * the pages that aren't somebody's gift.
 */
export const metadata: Metadata = {
  // Relative asset paths in OG tags are absolutized against this. Without
  // it Next uses the request host, so a link shared from behind the proxy
  // would carry an internal hostname into the WhatsApp preview.
  metadataBase: new URL(env.APP_URL),
  title: {
    default: "Happyday",
    template: "%s",
  },
  description: "Monte um site de presente para quem você ama.",
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#121212",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={figtree.variable}>
      <body className="bg-spotify-black text-spotify-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
