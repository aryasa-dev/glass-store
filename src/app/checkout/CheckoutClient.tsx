"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Sparkles,
  Layers,
  Ruler,
  AlertCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  FileText,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { createOrderAction } from "@/actions/checkout";

export function CheckoutClient() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  // Form states
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    itemsCount: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="py-24 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-neutral-200 rounded-full w-48"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 h-96 bg-neutral-200 rounded-[28px]"></div>
            <div className="lg:col-span-5 h-96 bg-neutral-200 rounded-[28px]"></div>
          </div>
        </div>
      </div>
    );
  }

  // Cost calculations
  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const tax = Number((subtotal * 0.08).toFixed(2));
  const shippingCost = subtotal === 0 ? 0 : subtotal > 300 ? 0 : 35.0;
  const totalAmount = Number((subtotal + tax + shippingCost).toFixed(2));
  const totalItemsCount = items.reduce((acc, i) => acc + i.quantity, 0);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!customerPhone.trim() && !customerEmail.trim()) {
      setErrorMessage("Please provide a phone number or email for delivery updates.");
      return;
    }

    if (!shippingAddress.trim()) {
      setErrorMessage("Please enter your complete shipping or job site address.");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Your cart is empty. Please add items before checking out.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        variantName: item.variantName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        widthMm: item.widthMm,
        heightMm: item.heightMm,
        calculatedAreaSqm: item.actualAreaSqm,
        customSpecifications: item.customSpecifications,
      }));

      const res = await createOrderAction({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        shippingAddress: shippingAddress.trim(),
        notes: notes.trim() || undefined,
        items: orderItems,
      });

      if (res.success && res.orderNumber) {
        clearCart();
        router.push(`/order-confirmation/${res.orderNumber}`);
      } else {
        setErrorMessage(res.error || "Failed to process order. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS STATE VIEW
  if (orderSuccess) {
    return (
      <div className="py-16 sm:py-24 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-[28px] p-8 sm:p-12 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] border-0 text-center space-y-8">
          <div className="w-20 h-20 bg-[#f2f4f5] rounded-full flex items-center justify-center mx-auto shadow-inner text-[#5433eb]">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#f2f4f5] text-xs font-semibold text-[#5433eb] border border-[#ebebeb]">
              <Sparkles className="w-3.5 h-3.5" />
              Order Confirmed & Logged
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#000000]">
              Thank You, {orderSuccess.customerName}!
            </h1>
            <p className="text-sm text-[#787574] max-w-md mx-auto leading-relaxed">
              Your architectural glass order has been queued for precision fabrication and staging.
            </p>
          </div>

          {/* Reference Info Card */}
          <div className="bg-[#f2f4f5] rounded-2xl p-6 text-left max-w-md mx-auto space-y-3 border border-[#ebebeb]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#787574]">Order Reference</span>
              <span className="font-mono font-bold text-sm text-[#000000]">
                {orderSuccess.orderNumber}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#787574]">Total Billed</span>
              <span className="font-bold text-sm text-[#000000]">
                ${orderSuccess.totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#787574]">Status</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f2f4f5] text-[#000000] border border-[#ebebeb] text-[11px] font-semibold">
                <Clock className="w-3 h-3 text-[#5433eb]" />
                Pending Verification
              </span>
            </div>
          </div>

          {/* WhatsApp Coordination Callout */}
          <div className="p-4 rounded-2xl bg-violet-50/60 border border-violet-100 flex items-start gap-3.5 text-left max-w-md mx-auto">
            <MessageCircle className="w-5 h-5 text-[#5433eb] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-[#000000]">Need custom technical drawings or expedited freight?</p>
              <p className="text-[#787574] leading-relaxed">
                Send your order reference ({orderSuccess.orderNumber}) to our glass engineering desk via WhatsApp for instant CAD check.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#5433eb] hover:bg-[#4527cd] text-white text-sm font-semibold shadow-[0_8px_24px_rgba(84,51,235,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer tracking-tight"
            >
              <span>Continue Shopping</span>
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto h-12 px-8 rounded-full bg-white hover:bg-[#f2f4f5] text-[#000000] text-sm font-semibold border border-[#ebebeb] transition-all flex items-center justify-center gap-2 cursor-pointer tracking-tight"
            >
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART VIEW
  if (items.length === 0) {
    return (
      <div className="py-24 max-w-xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-[#ebebeb] text-[#787574]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#000000]">
            Your Cart is Empty
          </h2>
          <p className="text-sm text-[#787574] leading-relaxed">
            Configure custom-cut glass panels with our interactive calculator or browse standard architectural catalog items.
          </p>
        </div>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/#calculator-section"
            className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#5433eb] hover:bg-[#4527cd] text-white text-sm font-semibold shadow-[0_8px_24px_rgba(84,51,235,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer tracking-tight"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Glass Calculator</span>
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto h-12 px-8 rounded-full bg-white hover:bg-[#f2f4f5] text-[#000000] text-sm font-semibold border border-[#ebebeb] transition-all flex items-center justify-center gap-2 cursor-pointer tracking-tight"
          >
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs text-[#787574] hover:text-[#000000] mb-2 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Catalog</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#000000]">
            Checkout & Project Delivery
          </h1>
          <p className="text-xs sm:text-sm text-[#787574] mt-1">
            Provide delivery details for your custom fabrication panels and hardware.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-full bg-white border border-[#ebebeb] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs text-[#787574]">
          <ShieldCheck className="w-4 h-4 text-[#5433eb]" />
          <span>Secure Architectural Checkout</span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Form on Left, Order Summary on Right */}
      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Customer Details Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] border-0 space-y-6">
          <div className="border-b border-[#ebebeb] pb-4">
            <h2 className="text-lg font-bold text-[#000000] tracking-tight">
              1. Customer & Job Site Details
            </h2>
            <p className="text-xs text-[#787574] mt-0.5">
              Contact information for logistics coordination and site delivery dispatch.
            </p>
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#000000] mb-1.5">
                Full Name / Project Manager <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full h-12 px-5 rounded-full bg-white border border-[#ebebeb] text-sm text-[#000000] placeholder:text-[#787574] focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb] transition-all"
                />
              </div>
            </div>

            {/* Phone & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#000000] mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#787574] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full h-12 pl-11 pr-5 rounded-full bg-white border border-[#ebebeb] text-sm text-[#000000] placeholder:text-[#787574] focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#000000] mb-1.5">
                  Email Address <span className="text-[#787574] font-normal">(for CAD / invoice)</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#787574] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="architect@studio.com"
                    className="w-full h-12 pl-11 pr-5 rounded-full bg-white border border-[#ebebeb] text-sm text-[#000000] placeholder:text-[#787574] focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <label className="block text-xs font-semibold text-[#000000] mb-1.5">
                Shipping & Site Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  required
                  rows={3}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Street Address, Suite / Unit, City, State, Postal Code"
                  className="w-full p-4 rounded-2xl bg-white border border-[#ebebeb] text-sm text-[#000000] placeholder:text-[#787574] focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb] transition-all resize-none"
                />
              </div>
            </div>

            {/* Special Instructions / Notes */}
            <div>
              <label className="block text-xs font-semibold text-[#000000] mb-1.5">
                Site Delivery Notes & Glass Specifications <span className="text-[#787574] font-normal">(optional)</span>
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Loading dock access code, freight elevator dimensions, uncrating assistance needed..."
                className="w-full p-4 rounded-2xl bg-white border border-[#ebebeb] text-sm text-[#000000] placeholder:text-[#787574] focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb] transition-all resize-none"
              />
            </div>
          </div>

          {/* Delivery & Assurance Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#ebebeb]">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#f2f4f5]">
              <Truck className="w-5 h-5 text-[#5433eb] shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-bold text-[#000000] block">Specialized Crate Freight</span>
                <span className="text-[#787574]">Reinforced A-frame crating</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#f2f4f5]">
              <ShieldCheck className="w-5 h-5 text-[#5433eb] shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-bold text-[#000000] block">Transit Damage Guarantee</span>
                <span className="text-[#787574]">100% replacement warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] border-0 space-y-6">
            <div className="border-b border-[#ebebeb] pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#000000] tracking-tight">
                  2. Order Summary
                </h2>
                <p className="text-xs text-[#787574]">
                  {totalItemsCount} item{totalItemsCount > 1 ? "s" : ""} in order
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#5433eb] bg-[#f2f4f5] px-3 py-1 rounded-full border border-[#ebebeb]">
                {items.length} Lines
              </span>
            </div>

            {/* Items List */}
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {items.map((item) => {
                const isCustom = item.type === "custom_glass";

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#f2f4f5]/60 border border-[#ebebeb] space-y-2.5 relative group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          {isCustom ? (
                            <span className="px-2 py-0.5 rounded-full bg-[#5433eb]/10 text-[#5433eb] text-[10px] font-semibold">
                              Custom Cut
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800 text-[10px] font-semibold">
                              Standard Catalog
                            </span>
                          )}
                          <h4 className="text-xs font-bold text-[#000000] leading-snug">
                            {item.name}
                          </h4>
                        </div>
                        {item.variantName && (
                          <p className="text-[11px] text-[#787574] mt-0.5">
                            {item.variantName}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-neutral-400 hover:text-red-500 p-1 rounded-lg transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Specifications Pill / Tag */}
                    {isCustom && (
                      <div className="flex flex-wrap gap-1 text-[10px] text-[#787574]">
                        <span className="px-2 py-0.5 rounded-md bg-white border border-[#ebebeb] font-mono">
                          {item.widthMm} × {item.heightMm} mm
                        </span>
                        {item.actualAreaSqm && (
                          <span className="px-2 py-0.5 rounded-md bg-white border border-[#ebebeb]">
                            {item.actualAreaSqm.toFixed(3)} m²
                          </span>
                        )}
                        {item.edgePolishing && (
                          <span className="px-2 py-0.5 rounded-md bg-white border border-[#ebebeb] text-[#5433eb] font-medium">
                            Polished Edges
                          </span>
                        )}
                        {item.holesCount && item.holesCount > 0 ? (
                          <span className="px-2 py-0.5 rounded-md bg-white border border-[#ebebeb]">
                            {item.holesCount} Holes
                          </span>
                        ) : null}
                      </div>
                    )}

                    {/* Quantity controls and price */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-white border border-[#ebebeb] flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-semibold text-[#000000] text-xs px-1">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-white border border-[#ebebeb] flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-xs text-[#000000]">
                          ${item.totalPrice.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-[#787574] block">
                          (${item.unitPrice.toFixed(2)} ea)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-[#ebebeb] pt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-[#787574]">
                <span>Fabrication Subtotal</span>
                <span className="font-medium text-[#000000]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[#787574]">
                <div className="flex items-center gap-1">
                  <span>Reinforced Crate Freight</span>
                  {shippingCost === 0 && (
                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                      FREE over $300
                    </span>
                  )}
                </div>
                <span className="font-medium text-[#000000]">
                  {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-[#787574]">
                <span>Estimated Tax (8%)</span>
                <span className="font-medium text-[#000000]">
                  ${tax.toFixed(2)}
                </span>
              </div>

              <div className="border-t border-[#ebebeb] pt-3 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-[#000000] block">Total Estimate</span>
                  <span className="text-[10px] text-[#787574]">Includes fabrication & tax</span>
                </div>
                <span className="text-2xl font-extrabold text-[#000000] tracking-tight">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Place Order CTA Button (strictly pill-shaped, #5433eb, glowing shadow) */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 rounded-full bg-[#5433eb] hover:bg-[#4527cd] disabled:opacity-50 text-white text-sm font-semibold shadow-[0_8px_24px_rgba(84,51,235,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer tracking-tight"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing Fabrication Order...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Place Architectural Order (${totalAmount.toFixed(2)})</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-[#787574] leading-relaxed">
              No immediate card charge required. Our engineering team reviews all tolerances and dimensions prior to formal invoice generation.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
