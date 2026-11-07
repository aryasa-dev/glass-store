"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";

export function CartNavButton() {
  const { totalItemsCount, setIsCartOpen } = useCart();

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-[#5433eb] hover:bg-[#4527cd] text-white text-xs font-semibold shadow-[0_4px_16px_rgba(84,51,235,0.25)] transition-all cursor-pointer"
    >
      <ShoppingBag className="w-4 h-4" />
      <span>Cart ({totalItemsCount})</span>
    </button>
  );
}
