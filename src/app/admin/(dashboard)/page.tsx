import Link from "next/link";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  Package,
  Calculator,
  ShoppingCart,
  TrendingUp,
  ArrowRight,
  FolderTree,
} from "lucide-react";

export const instant = false;

export default async function AdminDashboardPage() {
  await connection();

  const [
    productsCount,
    categoriesCount,
    ordersCount,
    calculatorRulesCount,
    orders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.calculatorRule.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    }),
  ]);

  const totalRevenue = orders.reduce(
    (acc, order) => acc + Number(order.totalAmount),
    0
  );

  return (
    <div className="space-y-8">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#000000]">
            Operational Overview
          </h1>
          <p className="text-sm text-[#787574] mt-1">
            Real-time catalog metrics, custom glass calculators, and customer orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-full bg-[#5433eb] hover:bg-[#4527cd] text-white text-xs font-semibold shadow-[0_4px_24px_rgba(69,36,219,0.34)] transition-all flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>Manage Products</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06),0_2px_4px_-2px_rgba(0,0,0,0.06)] border border-[#ebebeb]/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#787574] uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#000000]">
              {ordersCount}
            </span>
            <span className="text-xs text-neutral-500 font-medium">processed</span>
          </div>
        </div>

        {/* Volume */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06),0_2px_4px_-2px_rgba(0,0,0,0.06)] border border-[#ebebeb]/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#787574] uppercase tracking-wider">
              Volume
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#000000]">
              ${totalRevenue.toFixed(2)}
            </span>
            <span className="text-xs text-neutral-500 font-medium">USD</span>
          </div>
        </div>

        {/* Active Products & Categories */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06),0_2px_4px_-2px_rgba(0,0,0,0.06)] border border-[#ebebeb]/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#787574] uppercase tracking-wider">
              Catalog Items
            </span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#000000]">
              {productsCount}
            </span>
            <span className="text-xs text-neutral-500 font-medium">
              across {categoriesCount} cat.
            </span>
          </div>
        </div>

        {/* Calculator Rules */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06),0_2px_4px_-2px_rgba(0,0,0,0.06)] border border-[#ebebeb]/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#787574] uppercase tracking-wider">
              Pricing Matrices
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#000000]">
              {calculatorRulesCount}
            </span>
            <span className="text-xs text-neutral-500 font-medium">active rules</span>
          </div>
        </div>
      </div>

      {/* Navigation Quick Access Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link
          href="/admin/categories"
          className="bg-white rounded-[28px] p-6 border border-[#ebebeb]/70 hover:border-[#5433eb]/40 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(69,36,219,0.12)] transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#5433eb]/10 text-[#5433eb] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <FolderTree className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-[#000000] group-hover:text-[#5433eb] transition-colors">
            Categories
          </h2>
          <p className="text-xs text-[#787574] mt-1.5 leading-relaxed">
            Manage product collections, descriptions, and cover imagery.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#5433eb]">
            <span>View Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/products"
          className="bg-white rounded-[28px] p-6 border border-[#ebebeb]/70 hover:border-[#5433eb]/40 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(69,36,219,0.12)] transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Package className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-[#000000] group-hover:text-[#5433eb] transition-colors">
            Product Catalog
          </h2>
          <p className="text-xs text-[#787574] mt-1.5 leading-relaxed">
            Manage glass types, thicknesses, SKU inventory, and base prices.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#5433eb]">
            <span>Open Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/calculator-rules"
          className="bg-white rounded-[28px] p-6 border border-[#ebebeb]/70 hover:border-[#5433eb]/40 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(69,36,219,0.12)] transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Calculator className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-[#000000] group-hover:text-[#5433eb] transition-colors">
            Calculator Rules
          </h2>
          <p className="text-xs text-[#787574] mt-1.5 leading-relaxed">
            Configure m² base pricing, waste overhead factors, and thickness grading.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#5433eb]">
            <span>Manage Formulas</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white rounded-[28px] p-6 border border-[#ebebeb]/70 hover:border-[#5433eb]/40 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(69,36,219,0.12)] transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-[#000000] group-hover:text-[#5433eb] transition-colors">
            Orders & Tracking
          </h2>
          <p className="text-xs text-[#787574] mt-1.5 leading-relaxed">
            Review custom cutting specifications, customer details, and fulfillment statuses.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#5433eb]">
            <span>View Orders</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06),0_2px_4px_-2px_rgba(0,0,0,0.06)] border border-[#ebebeb]/60">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#000000]">Recent Orders</h2>
            <p className="text-xs text-[#787574] mt-0.5">
              Latest cut-to-size requests and orders
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-[#5433eb] hover:underline flex items-center gap-1"
          >
            See all orders
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 text-sm text-[#787574]">
            No orders found yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#ebebeb] text-[#787574] uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Order</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Items</th>
                  <th className="py-3 px-4 font-semibold">Total</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebebeb]/60">
                {orders.map((order) => {
                  const statusColors: Record<string, string> = {
                    CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
                    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
                    CANCELLED: "bg-red-50 text-red-700 border-red-200",
                  };

                  return (
                    <tr key={order.id} className="hover:bg-[#f2f4f5]/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-[#000000]">
                        {order.orderNumber}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-[#000000]">
                          {order.customerName}
                        </div>
                        <div className="text-[11px] text-[#787574]">
                          {order.customerEmail}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#787574]">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"}
                        {order.items[0]?.variantName && (
                          <div className="text-[11px] text-neutral-500">
                            {order.items[0].variantName}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 font-semibold text-[#000000]">
                        ${Number(order.totalAmount).toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            statusColors[order.status] || "bg-neutral-50 text-neutral-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-[#787574]">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
