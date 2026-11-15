import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PublicNavbar } from "@/components/common/PublicNavbar";
import { PublicFooter } from "@/components/common/PublicFooter";
import { generateWhatsAppOrderUrl } from "@/lib/whatsapp";
import { OrderConfirmationActions } from "./OrderConfirmationActions";
import {
  CheckCircle2,
  Sparkles,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Truck,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  Package,
  Layers,
  Ruler,
  ChevronRight,
} from "lucide-react";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  return {
    title: `Order Confirmation ${orderNumber} | Shop.`,
    description: `Review your precision cut architectural glass order specifications and dispatch status.`,
  };
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  await connection();
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
    },
  });

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f2f4f5]">
        <PublicNavbar />
        <main className="flex-1 flex items-center justify-center p-6 py-24">
          <div className="bg-white rounded-[28px] p-8 sm:p-12 max-w-lg w-full text-center shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#f2f4f5] flex items-center justify-center text-[#787574] mx-auto">
              <Package className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#000000]">
                Order Not Found
              </h1>
              <p className="text-xs sm:text-sm text-[#787574] leading-relaxed">
                We could not locate an order matching reference{" "}
                <span className="font-mono font-semibold text-[#000000]">
                  {orderNumber}
                </span>
                . Please verify your reference number or contact support.
              </p>
            </div>
            <div className="pt-2 flex justify-center">
              <Link
                href="/products"
                className="h-11 px-6 rounded-full bg-[#5433eb] hover:bg-[#4527cd] text-white text-xs font-semibold shadow-[0_4px_16px_rgba(84,51,235,0.3)] transition-all flex items-center gap-2 cursor-pointer tracking-tight"
              >
                <span>Return to Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  // Generate WhatsApp Redirect URL with real order data
  const subtotalNum = Number(order.subtotal);
  const taxNum = Number(order.tax);
  const shippingCostNum = Number(order.shippingCost);
  const totalAmountNum = Number(order.totalAmount);

  const whatsAppUrl = generateWhatsAppOrderUrl({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    shippingAddress: order.shippingAddress,
    notes: order.notes,
    subtotal: subtotalNum,
    tax: taxNum,
    shippingCost: shippingCostNum,
    totalAmount: totalAmountNum,
    items: order.items.map((i) => ({
      name: i.productName,
      variantName: i.variantName,
      quantity: i.quantity,
      unitPrice: Number(i.unitPrice),
      totalPrice: Number(i.totalPrice),
      widthMm: i.widthMm,
      heightMm: i.heightMm,
      calculatedAreaSqm: i.calculatedAreaSqm,
      customSpecifications: i.customSpecifications,
    })),
  });

  const totalUnits = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#f2f4f5]">
      <PublicNavbar />

      <main className="flex-1 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Floating Order Confirmation Card (strictly 28px radius, white surface, dual-layer shadow, zero border) */}
          <div className="bg-white rounded-[28px] p-6 sm:p-12 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] space-y-8 transition-all">
            {/* Header Hero Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#ebebeb] pb-8">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2f4f5] text-[11px] font-semibold text-[#5433eb]">
                    <Sparkles className="w-3.5 h-3.5" />
                    Fabrication Queued
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-semibold">
                    <Clock className="w-3 h-3" />
                    {order.status}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#000000]">
                  Order Confirmed
                </h1>
                <p className="text-xs sm:text-sm text-[#787574] leading-relaxed">
                  Thank you,{" "}
                  <span className="font-semibold text-[#000000]">
                    {order.customerName}
                  </span>
                  . Your glass panel specifications have been successfully recorded in our fabrication queue.
                </p>
              </div>

              {/* Order Reference Pill */}
              <div className="self-start sm:self-auto bg-[#f2f4f5] rounded-2xl p-4 sm:p-5 text-right space-y-1 min-w-[200px]">
                <span className="text-[10px] uppercase font-semibold text-[#787574] block tracking-wider">
                  Order Reference
                </span>
                <span className="font-mono text-base sm:text-lg font-bold text-[#000000] block tracking-tight">
                  {order.orderNumber}
                </span>
                <span className="text-[11px] text-[#787574] block">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* PRIMARY CALL TO ACTION: Confirm via WhatsApp (strictly rounded-full, #5433eb, glowing violet shadow) */}
            <div className="bg-[#f2f4f5] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5433eb]">
                  <MessageCircle className="w-4 h-4" />
                  <span>Immediate CAD & Production Verification</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#000000] tracking-tight">
                  Connect Directly with Our Glass Engineering Team
                </h3>
                <p className="text-xs text-[#787574] max-w-lg leading-relaxed">
                  Send your pre-filled order specifications and cut measurements directly to our shop floor desk on WhatsApp for instant confirmation.
                </p>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto h-14 px-8 rounded-full bg-[#5433eb] hover:bg-[#4527cd] text-white text-sm font-semibold shadow-[0_8px_24px_rgba(84,51,235,0.35)] transition-all flex items-center justify-center gap-2.5 cursor-pointer tracking-tight hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-[#5433eb]" />
                  <span>Confirm via WhatsApp</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>

            {/* Order Items Breakdown with Custom Glass Dimensions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#ebebeb] pb-3">
                <h2 className="text-base font-bold text-[#000000] tracking-tight flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#5433eb]" />
                  <span>Itemized Glass Specifications ({totalUnits} units)</span>
                </h2>
                <OrderConfirmationActions orderNumber={order.orderNumber} />
              </div>

              <div className="divide-y divide-[#ebebeb]">
                {order.items.map((item, idx) => {
                  const specs = item.customSpecifications as Record<
                    string,
                    any
                  > | null;
                  const hasDimensions = item.widthMm && item.heightMm;

                  return (
                    <div
                      key={item.id}
                      className="py-4.5 first:pt-2 last:pb-2 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-[#787574]">
                            #{idx + 1}
                          </span>
                          <h4 className="text-sm font-bold text-[#000000] tracking-tight">
                            {item.productName}
                          </h4>
                          {item.variantName && (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#f2f4f5] text-[11px] font-medium text-neutral-700">
                              {item.variantName}
                            </span>
                          )}
                        </div>

                        {/* Dimensions & Precision Specs Badge Row */}
                        {hasDimensions && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f2f4f5] text-[#000000] font-mono font-medium">
                              <Ruler className="w-3 h-3 text-[#5433eb]" />
                              {item.widthMm} × {item.heightMm} mm
                            </span>

                            {item.calculatedAreaSqm && (
                              <span className="px-2.5 py-0.5 rounded-full bg-[#f2f4f5] text-[#787574]">
                                {Number(item.calculatedAreaSqm).toFixed(3)} m²
                              </span>
                            )}

                            {specs?.edgePolishing && (
                              <span className="px-2.5 py-0.5 rounded-full bg-violet-50 text-[#5433eb] font-medium">
                                Flat Polished Edges
                              </span>
                            )}

                            {specs?.holesCount && specs.holesCount > 0 ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-violet-50 text-[#5433eb] font-medium">
                                {specs.holesCount} Drilled Holes
                              </span>
                            ) : null}

                            {specs?.thicknessMultiplier &&
                              specs.thicknessMultiplier > 1 && (
                                <span className="px-2.5 py-0.5 rounded-full bg-[#f2f4f5] text-[#787574]">
                                  Multiplier: {specs.thicknessMultiplier}x
                                </span>
                              )}
                          </div>
                        )}

                        {specs?.note && (
                          <p className="text-xs text-[#787574] italic mt-1">
                            Note: {specs.note}
                          </p>
                        )}
                      </div>

                      <div className="text-right sm:min-w-[140px] shrink-0">
                        <div className="text-sm font-bold text-[#000000] tracking-tight">
                          ${Number(item.totalPrice).toFixed(2)}
                        </div>
                        <div className="text-[11px] text-[#787574]">
                          {item.quantity} × ${Number(item.unitPrice).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial Summary & Delivery Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#ebebeb]">
              {/* Customer & Shipping Info */}
              <div className="bg-[#f2f4f5] rounded-2xl p-5 space-y-3.5 text-xs">
                <span className="text-[10px] uppercase font-bold text-[#787574] tracking-wider block">
                  Delivery & Logistics Details
                </span>

                <div className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#5433eb] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#000000] block">
                        {order.customerName}
                      </span>
                      <span className="text-[#787574] leading-relaxed block">
                        {order.shippingAddress || "Standard Delivery"}
                      </span>
                    </div>
                  </div>

                  {order.customerPhone && (
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-[#787574] shrink-0" />
                      <span className="text-[#000000] font-mono">
                        {order.customerPhone}
                      </span>
                    </div>
                  )}

                  {order.customerEmail && (
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-[#787574] shrink-0" />
                      <span className="text-[#787574]">
                        {order.customerEmail}
                      </span>
                    </div>
                  )}

                  {order.notes && (
                    <div className="flex items-start gap-2.5 pt-1 border-t border-[#ebebeb]">
                      <FileText className="w-4 h-4 text-[#787574] shrink-0 mt-0.5" />
                      <div className="text-[11px] text-[#787574]">
                        <span className="font-semibold text-[#000000] block">
                          Site Instructions:
                        </span>
                        {order.notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="bg-[#f2f4f5] rounded-2xl p-5 space-y-3 text-xs flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-[#787574] tracking-wider block">
                  Payment & Charge Breakdown
                </span>

                <div className="space-y-2">
                  <div className="flex justify-between text-[#787574]">
                    <span>Fabrication Subtotal</span>
                    <span className="font-medium text-[#000000]">
                      ${subtotalNum.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#787574]">
                    <div className="flex items-center gap-1">
                      <span>A-Frame Crate Freight</span>
                      {shippingCostNum === 0 && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                          FREE over $300
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-[#000000]">
                      {shippingCostNum === 0
                        ? "Free"
                        : `$${shippingCostNum.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#787574]">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-medium text-[#000000]">
                      ${taxNum.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t border-[#ebebeb] pt-3 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-bold text-[#000000] block tracking-tight">
                        Total Amount
                      </span>
                      <span className="text-[10px] text-[#787574]">
                        Status: {order.paymentStatus}
                      </span>
                    </div>
                    <span className="text-2xl font-extrabold text-[#000000] tracking-tight">
                      ${totalAmountNum.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Navigation Links */}
            <div className="pt-4 border-t border-[#ebebeb] flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/products"
                className="text-xs font-semibold text-[#5433eb] hover:underline flex items-center gap-1.5"
              >
                <span>Browse more architectural glass collections</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>

              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="h-10 px-5 rounded-full bg-white hover:bg-[#f2f4f5] text-[#000000] text-xs font-semibold border border-[#ebebeb] transition-all flex items-center gap-1.5 cursor-pointer tracking-tight"
                >
                  <span>Return to Home</span>
                </Link>
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-5 rounded-full bg-[#5433eb] hover:bg-[#4527cd] text-white text-xs font-semibold shadow-[0_4px_16px_rgba(84,51,235,0.3)] transition-all flex items-center gap-1.5 cursor-pointer tracking-tight"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white text-[#5433eb]" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
