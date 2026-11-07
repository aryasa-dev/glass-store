"use client";

import { useCart } from "@/context/CartContext";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export function CartDrawer() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItemsCount,
    subtotalAmount,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-[#ebebeb]">
          {/* Header */}
          <div className="p-6 border-b border-[#ebebeb] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#5433eb]/10 text-[#5433eb] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold text-[#000000]">
                Your Cart ({totalItemsCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-[#f2f4f5] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#f2f4f5] flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm text-[#787574]">Your cart is empty.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-xs font-semibold text-[#5433eb] hover:underline"
                >
                  Start configuring glass &rarr;
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-[#ebebeb] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-[#000000]">
                        {item.productName}
                      </h3>
                      <p className="text-xs text-[#787574]">
                        {item.glassType} &bull; {item.thicknessMm}mm
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 rounded-full text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dimensions & Specs */}
                  <div className="flex flex-wrap gap-1.5 text-[11px] text-neutral-600">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#f2f4f5] border border-[#ebebeb] font-medium">
                      {item.widthMm}mm × {item.heightMm}mm
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#f2f4f5] border border-[#ebebeb]">
                      Area: {item.actualAreaSqm.toFixed(3)} m²
                    </span>
                    {item.chargeableAreaSqm > item.actualAreaSqm && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px]">
                        Min. {item.chargeableAreaSqm.toFixed(2)} m²
                      </span>
                    )}
                    {item.edgePolishing && (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px]">
                        Edge Polished
                      </span>
                    )}
                    {item.holesCount && item.holesCount > 0 ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px]">
                        {item.holesCount} Holes
                      </span>
                    ) : null}
                  </div>

                  {/* Pricing and Quantity controls */}
                  <div className="pt-2 border-t border-[#ebebeb] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-[#ebebeb] flex items-center justify-center font-bold hover:bg-[#f2f4f5] transition-colors"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-semibold text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full border border-[#ebebeb] flex items-center justify-center font-bold hover:bg-[#f2f4f5] transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-sm text-[#000000]">
                        ${item.totalPrice.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-[#787574]">
                        ${item.unitPrice.toFixed(2)} / unit
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#ebebeb] space-y-4 bg-[#f2f4f5]/40">
              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">
                    ${subtotalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax & Shipping</span>
                  <span className="text-neutral-500">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#000000] pt-2 border-t border-[#ebebeb]">
                  <span>Total Estimate</span>
                  <span>${subtotalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => alert("Checkout flow will be integrated with order payment!")}
                  className="w-full h-12 rounded-full bg-[#5433eb] hover:bg-[#4527cd] text-white text-xs font-semibold shadow-[0_8px_24px_rgba(84,51,235,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={clearCart}
                  className="w-full py-2 text-center text-[11px] text-neutral-500 hover:text-red-600 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
