import { prisma } from "@/lib/prisma";
import { ShoppingCart, User, Calendar, MapPin, Package, CheckCircle2 } from "lucide-react";

export const instant = false;

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      user: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#000000]">
            Orders & Fabrication Jobs
          </h1>
          <p className="text-sm text-[#787574] mt-1">
            Track order status, custom glass dimensions, specifications, and fulfillment.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white rounded-[28px] p-12 text-center text-sm text-[#787574] border border-[#ebebeb]/60">
            No orders found.
          </div>
        ) : (
          orders.map((order) => {
            const statusColors: Record<string, string> = {
              CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
              COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
              PENDING: "bg-amber-50 text-amber-700 border-amber-200",
              CANCELLED: "bg-red-50 text-red-700 border-red-200",
            };

            return (
              <div
                key={order.id}
                className="bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06),0_2px_4px_-2px_rgba(0,0,0,0.06)] border border-[#ebebeb]/60 space-y-5"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#ebebeb]/70 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-[#000000]">
                          {order.orderNumber}
                        </h2>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            statusColors[order.status] || "bg-neutral-50 text-neutral-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-[#787574] mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-[#000000]">
                      ${Number(order.totalAmount).toFixed(2)}
                    </div>
                    <div className="text-xs text-neutral-500 font-medium">
                      Subtotal: ${Number(order.subtotal).toFixed(2)} + Tax: $
                      {Number(order.tax).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Customer Details & Shipping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#f2f4f5]/60 text-xs">
                  <div>
                    <div className="font-semibold text-[#000000] mb-1">
                      Customer Info
                    </div>
                    <div className="text-neutral-700 font-medium">
                      {order.customerName}
                    </div>
                    <div className="text-[#787574]">{order.customerEmail}</div>
                    {order.customerPhone && (
                      <div className="text-[#787574]">{order.customerPhone}</div>
                    )}
                  </div>

                  <div>
                    <div className="font-semibold text-[#000000] mb-1">
                      Shipping Destination
                    </div>
                    <div className="text-[#787574] leading-relaxed">
                      {order.shippingAddress || "In-store pickup / Not provided"}
                    </div>
                  </div>
                </div>

                {/* Cut-to-Size Order Items */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-neutral-800 uppercase tracking-wider">
                    Fabrication Items ({order.items.length})
                  </div>

                  <div className="space-y-2.5">
                    {order.items.map((item) => {
                      const specs = item.customSpecifications as Record<
                        string,
                        any
                      > | null;

                      return (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl border border-[#ebebeb] bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="font-bold text-sm text-[#000000]">
                              {item.productName}
                              {item.variantName && (
                                <span className="ml-2 font-normal text-xs text-[#787574]">
                                  ({item.variantName})
                                </span>
                              )}
                            </div>

                            {/* Dimension chips */}
                            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-neutral-600">
                              {item.widthMm && item.heightMm && (
                                <span className="px-2.5 py-0.5 rounded-full bg-[#f2f4f5] font-medium text-neutral-800 border border-[#ebebeb]">
                                  {item.widthMm} mm × {item.heightMm} mm
                                </span>
                              )}
                              {item.calculatedAreaSqm && (
                                <span className="px-2.5 py-0.5 rounded-full bg-[#f2f4f5] font-medium text-neutral-800 border border-[#ebebeb]">
                                  {item.calculatedAreaSqm.toFixed(2)} m²
                                </span>
                              )}
                              <span>Qty: {item.quantity}</span>
                            </div>

                            {/* Specifications */}
                            {specs && Object.keys(specs).length > 0 && (
                              <div className="text-[11px] text-[#787574] pt-1">
                                Spec:{" "}
                                {Object.entries(specs)
                                  .map(([k, v]) => `${k}: ${v}`)
                                  .join(" • ")}
                              </div>
                            )}
                          </div>

                          <div className="text-right">
                            <div className="font-bold text-sm text-[#000000]">
                              ${Number(item.totalPrice).toFixed(2)}
                            </div>
                            <div className="text-[11px] text-[#787574]">
                              ${Number(item.unitPrice).toFixed(2)} each
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
