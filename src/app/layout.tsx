import type { Metadata } from "next";
import "./globals.css";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://customglass.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shop. — Architectural Custom Cut Glass & Precision Panels",
    template: "%s | Shop.",
  },
  description:
    "Precision architectural glass fabrication, custom-cut safety glass panels, tempered screens, and beveled mirrors with instant online calculation and nationwide crated transit.",
  keywords: [
    "custom cut glass",
    "architectural glass",
    "tempered safety glass",
    "glass sizing calculator",
    "frameless shower screen",
    "fluted reeded glass",
    "custom wall mirrors",
    "table top glass replacement",
    "CNC glass polishing",
  ],
  authors: [{ name: "Shop. Architectural Glazing" }],
  creator: "Shop. Architectural Glazing",
  publisher: "Shop. Architectural Glazing",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Shop. Custom Glass",
    title: "Shop. — Architectural Custom Cut Glass & Precision Panels",
    description:
      "Precision cut-to-size glass panels and architectural mirrors with real-time square-meter calculation, CNC diamond polishing, and insured crate delivery.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Shop. Architectural Custom Glass Panels and Glazing Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop. — Architectural Custom Cut Glass & Precision Panels",
    description:
      "Instant sizing calculation and direct-foundry fabrication for tempered panels, custom mirrors, and commercial shower partitions.",
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&h=630&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f2f4f5] text-[#000000]">
        {children}
        <CartDrawer />
        <WhatsAppButton phoneNumber="+15550192834" />
      </body>
    </html>
  );
}
