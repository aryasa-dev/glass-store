"use client";

import { useState, useTransition } from "react";
import {
  updateOrderStatusAction,
  updatePaymentStatusAction,
  deleteOrderAction,
} from "@/actions/orders";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import {
  ShoppingCart,
  User,
  Calendar,
  MapPin,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Trash2,
  Loader2,
  Phone,
  Mail,
  Layers,
} from "lucide-react";

interface OrderItem {
  id: string;
  orderId: string;
  productName: string;
  variantName: string | null;
  quantity: number;
  unitPrice: any;
  totalPrice: any;
  widthMm: number | null;
  heightMm: number | null;
  calculatedAreaSqm: number | null;
  customSpecifications: any;
}

interface OrderWithRelations {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: string | null;
  subtotal: any;
  tax: any;
  shippingCost: any;
  totalAmount: any;
  notes: string | null;
  createdAt: Date;
  items: OrderItem[];
}

interface OrdersClientProps {
  initialOrders: OrderWithRelations[];
}

const statusBadgeStyles: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  PENDING: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  CONFIRMED: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  COMPLETED: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  CANCELLED: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

const paymentBadgeStyles: Record<PaymentStatus, { bg: string; text: string }> = {
  UNPAID: { bg: "bg-neutral-100", text: "text-neutral-700" },
  PAID: { bg: "bg-emerald-100", text: "text-emerald-800" },
  REFUNDED: { bg: "bg-purple-100", text: "text-purple-800" },
};

export function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "ALL" || order.status === filterStatus;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    startTransition(async () => {
      const res = await updateOrderStatusAction(orderId, newStatus);
      if (!res.success) {
        alert(res.error || "Failed to update order status.");
      } else {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
      setUpdatingOrderId(null);
    });
  };

  const handlePaymentStatusChange = (orderId: string, newPaymentStatus: PaymentStatus) => {
    setUpdatingOrderId(orderId);
    startTransition(async () => {
      const res = await updatePaymentStatusAction(orderId, newPaymentStatus);
      if (!res.success) {
        alert(res.error || "Failed to update payment status.");
      } else {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: newPaymentStatus } : o))
        );
      }
      setUpdatingOrderId(null);
    });
  };

  const handleDeleteOrder = (orderId: string, orderNumber: string) => {
    if (!confirm(`Are you sure you want to delete order "${orderNumber}"?`)) return;

    startTransition(async () => {
      const res = await deleteOrderAction(orderId);
      if (!res.success) {
        alert(res.error || "Failed to delete order.");
      } else {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      }
    });
  };

  const orderCounts = {
    ALL: orders.length,
    PENDING: orders.filter((o) => o.status === "PENDING").length,
    CONFIRMED: orders.filter((o) => o.status === "CONFIRMED").length,
    COMPLETED: orders.filter((o) => o.status === "COMPLETED").length,
    CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#000000]">
          Orders & Fabrication Management
        </h1>
        <p className="text-sm text-[#787574] mt-1">
          Review custom glass dimensions, update fulfillment progress, and process orders.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-white border border-[#ebebeb] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          {(["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const).map(
            (status) => {
              const isActive = filterStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#5433eb] text-white shadow-[0_2px_8px_rgba(69,36,219,0.25)]"
                      : "text-neutral-600 hover:text-[#000000] hover:bg-[#f2f4f5]"
                  }`}
                >
                  {status.charAt(0) + status.slice(1).toLowerCase()} (
                  {orderCounts[status]})
                </button>
              );
            }
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, customer, email..."
            className="w-full h-10 pl-9 pr-4 rounded-full border border-[#ebebeb] bg-white text-xs text-[#000000] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb]"
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-[28px] p-12 text-center text-sm text-[#787574] border border-[#ebebeb]/60">
          No orders found matching the filter criteria.
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => {
            const badge = statusBadgeStyles[order.status] || {
              bg: "bg-neutral-50",
              text: "text-neutral-700",
              border: "border-neutral-200",
            };
            const paymentBadge = paymentBadgeStyles[order.paymentStatus];
            const isUpdatingThis = updatingOrderId === order.id && isPending;

            return (
              <div
                key={order.id}
                className="bg-white rounded-[28px] p-6 sm:p-7 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06),0_2px_4px_-2px_rgba(0,0,0,0.06)] border border-[#ebebeb]/60 hover:border-[#5433eb]/30 transition-all space-y-5"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb]/60 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-[20px] bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base font-bold text-[#000000]">
                          {order.orderNumber}
                        </h2>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {order.status}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${paymentBadge.bg} ${paymentBadge.text}`}
                        >
                          {order.paymentStatus}
                        </span>
                        {isUpdatingThis && (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5433eb]" />
                        )}
                      </div>
                      <div className="text-xs text-[#787574] mt-0.5">
                        Received on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Status Dropdowns & Delete */}
                  <div className="flex items-center flex-wrap gap-2.5">
                    {/* Status Select */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-[#787574]">
                        Status:
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        disabled={isPending}
                        className="h-8 px-3 rounded-full border border-[#ebebeb] bg-white text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>

                    {/* Payment Select */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-[#787574]">
                        Payment:
                      </span>
                      <select
                        value={order.paymentStatus}
                        onChange={(e) =>
                          handlePaymentStatusChange(
                            order.id,
                            e.target.value as PaymentStatus
                          )
                        }
                        disabled={isPending}
                        className="h-8 px-3 rounded-full border border-[#ebebeb] bg-white text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20"
                      >
                        <option value="UNPAID">Unpaid</option>
                        <option value="PAID">Paid</option>
                        <option value="REFUNDED">Refunded</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                      className="p-1.5 rounded-full border border-red-200 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors ml-1"
                      title="Delete Order"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Customer Details & Pricing Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-[20px] bg-[#f2f4f5]/60 text-xs">
                  <div>
                    <div className="font-bold text-[#000000] mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#5433eb]" />
                      <span>Customer Details</span>
                    </div>
                    <div className="font-semibold text-neutral-800">
                      {order.customerName}
                    </div>
                    <div className="text-[#787574] flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" />
                      <span>{order.customerEmail}</span>
                    </div>
                    {order.customerPhone && (
                      <div className="text-[#787574] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{order.customerPhone}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="font-bold text-[#000000] mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#5433eb]" />
                      <span>Shipping Address</span>
                    </div>
                    <div className="text-[#787574] leading-relaxed">
                      {order.shippingAddress || "In-store pickup / None provided"}
                    </div>
                    {order.notes && (
                      <div className="mt-2 text-[11px] text-neutral-600 italic">
                        Note: "{order.notes}"
                      </div>
                    )}
                  </div>

                  <div className="md:text-right flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-[#000000] mb-1">Total Bill</div>
                      <div className="text-xl font-extrabold text-[#000000]">
                        ${Number(order.totalAmount).toFixed(2)}
                      </div>
                    </div>
                    <div className="text-[11px] text-[#787574] mt-2 space-y-0.5">
                      <div>Subtotal: ${Number(order.subtotal).toFixed(2)}</div>
                      <div>Tax: ${Number(order.tax).toFixed(2)}</div>
                      <div>Shipping: ${Number(order.shippingCost).toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {/* Order Items with Custom Cutting Specifications */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#5433eb]" />
                    <span>Fabrication Line Items ({order.items.length})</span>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item) => {
                      const specs = item.customSpecifications as Record<
                        string,
                        any
                      > | null;

                      return (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl border border-[#ebebeb] bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="font-bold text-sm text-[#000000]">
                              {item.productName}
                              {item.variantName && (
                                <span className="ml-2 font-normal text-xs text-[#787574]">
                                  &bull; {item.variantName}
                                </span>
                              )}
                            </div>

                            {/* Dimensional Badges */}
                            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
                              {item.widthMm && item.heightMm && (
                                <span className="px-2.5 py-0.5 rounded-full bg-[#f2f4f5] font-semibold text-neutral-800 border border-[#ebebeb]">
                                  {item.widthMm}mm × {item.heightMm}mm
                                </span>
                              )}
                              {item.calculatedAreaSqm && (
                                <span className="px-2.5 py-0.5 rounded-full bg-[#f2f4f5] font-semibold text-neutral-800 border border-[#ebebeb]">
                                  {item.calculatedAreaSqm.toFixed(2)} m²
                                </span>
                              )}
                              <span className="font-semibold text-neutral-700">
                                Qty: {item.quantity}
                              </span>
                            </div>

                            {/* Custom Specs */}
                            {specs && Object.keys(specs).length > 0 && (
                              <div className="text-[11px] text-[#787574] pt-1">
                                Spec:{" "}
                                {Object.entries(specs)
                                  .map(([k, v]) => `${k}: ${v}`)
                                  .join(" • ")}
                              </div>
                            )}
                          </div>

                          <div className="text-right sm:self-center">
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
          })}
        </div>
      )}
    </div>
  );
}
