import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { brandAssets } from "@/lib/brand-assets";

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
      {
        url: "/icons/icon-512.png",
        width: 512,
        height: 512,
        alt: "Whats91 logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Whats91 Developer Docs",
    description: "WhatsApp Messaging & API Services Documentation",
    images: ["/twitter-image", "/icons/icon-512.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
