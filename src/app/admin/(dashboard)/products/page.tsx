import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, Plus, Layers, Tag, Eye, CheckCircle2, XCircle } from "lucide-react";

export const instant = false;

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      variants: true,
      calculatorRules: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#000000]">
            Products & Variants
          </h1>
          <p className="text-sm text-[#787574] mt-1">
            Manage architectural glass offerings, thicknesses, and SKU inventories.
          </p>
        </div>

        <button
          disabled
          className="px-4 py-2 rounded-full bg-[#5433eb]/40 text-white text-xs font-semibold flex items-center gap-2 cursor-not-allowed"
          title="Product creation modal / form will be expanded in next task"
        >
          <Plus className="w-4 h-4" />
          <span>New Product</span>
        </button>
      </div>

      <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06),0_2px_4px_-2px_rgba(0,0,0,0.06)] border border-[#ebebeb]/60">
        {products.length === 0 ? (
          <div className="text-center py-12 text-sm text-[#787574]">
            No products in database yet.
          </div>
        ) : (
          <div className="space-y-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="p-5 rounded-[20px] border border-[#ebebeb] hover:border-[#5433eb]/30 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#ebebeb]/60 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#5433eb]/10 text-[#5433eb] flex items-center justify-center font-bold">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-[#000000]">
                        {product.name}
                      </h2>
                      <div className="flex items-center gap-2 text-xs text-[#787574]">
                        <span className="px-2 py-0.5 rounded-full bg-[#f2f4f5] text-neutral-600 font-medium">
                          {product.category.name}
                        </span>
                        <span>&bull;</span>
                        <span>Slug: /{product.slug}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active
                    </span>
                    <span className="text-sm font-bold text-[#000000]">
                      Base: ${Number(product.basePrice).toFixed(2)}/m²
                    </span>
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-xs text-[#787574] leading-relaxed">
                    {product.description}
                  </p>
                )}

                {/* Variants List */}
                <div>
                  <div className="text-xs font-semibold text-neutral-800 mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#5433eb]" />
                    <span>Variants & Specifications ({product.variants.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {product.variants.map((v) => (
                      <div
                        key={v.id}
                        className="p-3 rounded-xl bg-[#f2f4f5]/60 border border-[#ebebeb] text-xs flex flex-col justify-between"
                      >
                        <div className="font-semibold text-[#000000]">{v.name}</div>
                        <div className="text-[11px] text-[#787574] mt-1 space-y-0.5">
                          <div>SKU: {v.sku || "N/A"}</div>
                          <div>Thickness: {v.thicknessMm} mm</div>
                          <div>
                            Adj: +${Number(v.priceAdjustment).toFixed(2)} | Stock:{" "}
                            {v.stock}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
