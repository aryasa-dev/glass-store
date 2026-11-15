import { connection } from "next/server";
import { PublicNavbar } from "@/components/common/PublicNavbar";
import { PublicFooter } from "@/components/common/PublicFooter";
import { CheckoutClient } from "./CheckoutClient";

export const instant = false;

export const metadata = {
  title: "Secure Checkout & Order Placement | Shop.",
  description: "Confirm your custom cut glass panels, review dimensions and transit crating, and submit your order.",
};

export default async function CheckoutPage() {
  await connection();

  return (
    <div className="min-h-screen flex flex-col bg-[#f2f4f5]">
      <PublicNavbar />
      <main className="flex-1">
        <CheckoutClient />
      </main>
      <PublicFooter />
    </div>
  );
}
