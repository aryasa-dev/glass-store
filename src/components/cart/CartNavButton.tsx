"use client";

import { useCartStore } from "@/store/cartStore";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

export function CartNavButton() {
  const toggleCart = useCartStore((s) => s.toggleCart);
  const totalCount = useCartStore((s) => s.getTotalCount());

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      onClick={toggleCart}
      className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-[#5433eb] hover:bg-[#4527cd] text-white text-xs font-semibold shadow-[0_4px_16px_rgba(84,51,235,0.25)] transition-all cursor-pointer tracking-tight"
    >
      <ShoppingBag className="w-4 h-4" />
      <span>Cart ({mounted ? totalCount : 0})</span>
    </button>
  );
}
