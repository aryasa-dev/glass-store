import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";

export const metadata: Metadata = {
  title: "Shop. Custom Glass & Architectural Panels",
  description: "Configure precision cut-to-size glass panels and mirrors with live calculation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f2f4f5] text-[#000000]">
        <CartProvider>
          {children}
          <CartDrawer />
          <WhatsAppButton phoneNumber="+15550192834" />
        </CartProvider>
      </body>
    </html>
  );
}
