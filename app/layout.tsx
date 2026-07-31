import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Um presente para Ana",
  description: "1 ano de nós. Um presente especial.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Um presente para Ana",
    description: "1 ano de nós.",
    type: "website",
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
