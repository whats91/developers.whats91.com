import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { brandAssets } from "@/lib/brand-assets";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://developers.whats91.com"),
  title: "Whats91 Developer Documentation — WhatsApp Messaging & API Services",
  description: "Explore the Whats91 API documentation. Send messages, manage templates, handle webhooks, and integrate WhatsApp Business API into your applications.",
  keywords: ["Whats91", "WhatsApp API", "WhatsApp Business", "messaging API", "chat API", "developers"],
  authors: [{ name: "Whats91" }],
  applicationName: brandAssets.docsName,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: brandAssets.favicon, type: "image/svg+xml" },
      { url: brandAssets.icon192, sizes: "192x192", type: "image/png" },
      { url: brandAssets.icon512, sizes: "512x512", type: "image/png" },
    ],
    shortcut: brandAssets.favicon,
    apple: [
      { url: brandAssets.appleTouchIcon, sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Whats91 Developer Docs",
    description: "WhatsApp Messaging & API Services Documentation",
    url: "https://developers.whats91.com",
    siteName: "Whats91 Developers",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Whats91 Developer Documentation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Whats91 Developer Docs",
    description: "WhatsApp Messaging & API Services Documentation",
    images: ["/twitter-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
