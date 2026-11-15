"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowRight, Layers, Package, X, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductVariant {
  id: string;
  name: string;
  glassType: string | null;
  thicknessMm: number | null;
  priceAdjustment: any;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  basePrice: any;
  imageUrl: string | null;
  isCustomizable: boolean;
  category: Category;
  variants: ProductVariant[];
}

interface ProductCatalogClientProps {
  initialProducts: Product[];
  categories: Category[];
  initialCategorySlug?: string;
}

export function ProductCatalogClient({
  initialProducts,
  categories,
  initialCategorySlug,
}: ProductCatalogClientProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategorySlug || "ALL"
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleAddStandard = (product: Product) => {
    const firstVariant = product.variants[0];
    const unitPrice =
      Number(product.basePrice) +
      (firstVariant ? Number(firstVariant.priceAdjustment) : 0);

    addItem({
      type: "standard_product",
      productId: product.id,
      variantId: firstVariant?.id,
      name: product.name,
      variantName: firstVariant ? firstVariant.name : "Standard Unit",
      imageUrl: product.imageUrl,
      unitPrice: unitPrice > 0 ? unitPrice : 45.0,
      quantity: 1,
      customSpecifications: {
        note: "Pre-cut standard sample / catalog panel",
      },
    });
    openCart();
  };

  // Filtering products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesCat =
        selectedCategory === "ALL" || product.category.slug === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        product.category.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCat && matchesSearch;
    });
  }, [initialProducts, selectedCategory, searchQuery]);

  return (
    <div className="space-y-12">
      {/* Search and Category Chips Controls */}
      <div className="space-y-6">
        {/* Search Bar (strictly rounded-full, #ebebeb border) */}
        <div className="max-w-2xl mx-auto relative">
          <div className="relative">
            <Search className="w-5 h-5 text-[#787574] absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search glass panels, mirrors, shower screens..."
              className="w-full h-14 pl-13 pr-12 rounded-full bg-white border border-[#ebebeb] text-sm text-[#000000] placeholder:text-[#787574] focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb] shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-[#f2f4f5] transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Chips (strictly rounded-full, white fill, 1px faint border, subtle elevation) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-tight transition-all cursor-pointer ${
              selectedCategory === "ALL"
                ? "bg-[#5433eb] text-white shadow-[0_4px_16px_rgba(69,36,219,0.3)]"
                : "bg-white text-[#000000] border border-[#ebebeb] shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:bg-[#f2f4f5]"
            }`}
          >
            All Products ({initialProducts.length})
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#5433eb] text-white shadow-[0_4px_16px_rgba(69,36,219,0.3)]"
                    : "bg-white text-[#000000] border border-[#ebebeb] shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:bg-[#f2f4f5]"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Results Counter */}
      <div className="flex items-center justify-between text-xs text-[#787574] border-b border-[#ebebeb] pb-4">
        <div>
          Showing{" "}
          <span className="font-bold text-[#000000]">{filteredProducts.length}</span>{" "}
          of {initialProducts.length} architectural items
        </div>
        {selectedCategory !== "ALL" && (
          <button
            onClick={() => setSelectedCategory("ALL")}
            className="text-[#5433eb] hover:underline font-semibold"
          >
            Reset filter
          </button>
        )}
      </div>

      {/* Floating Product Cards Grid (rounded-3xl, white background, zero border, dual-layer soft shadow) */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-[28px] p-16 text-center shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06),0_2px_4px_-2px_rgba(0,0,0,0.06)] border-0 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#f2f4f5] flex items-center justify-center text-neutral-400 mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-[#000000]">No products match your criteria</h3>
          <p className="text-xs text-[#787574] max-w-sm mx-auto">
            Try searching for a different term or selecting another category filter.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("ALL");
              setSearchQuery("");
            }}
            className="px-5 py-2 rounded-full bg-[#5433eb] text-white text-xs font-semibold shadow-md"
          >
            View All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const displayImage =
              product.imageUrl ||
              "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80";

            return (
              <div
                key={product.id}
                className="bg-white rounded-[28px] overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] border-0 flex flex-col justify-between group transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1"
              >
                {/* Image Section with 20px inner radius padding convention */}
                <div className="p-4 pb-0">
                  <div className="w-full aspect-[4/3] rounded-[20px] overflow-hidden bg-[#f2f4f5] relative">
                    <img
                      src={displayImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-semibold text-[#000000] shadow-sm">
                      {product.category.name}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 pt-4 space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-[#000000] group-hover:text-[#5433eb] transition-colors leading-snug">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-xs text-[#787574] mt-1.5 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    )}
                  </div>

                  {/* Variants Specs Preview */}
                  {product.variants.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {product.variants.slice(0, 3).map((v) => (
                        <span
                          key={v.id}
                          className="px-2.5 py-0.5 rounded-full bg-[#f2f4f5] text-[10px] font-medium text-neutral-700"
                        >
                          {v.thicknessMm ? `${v.thicknessMm}mm` : v.name}
                        </span>
                      ))}
                      {product.variants.length > 3 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#f2f4f5] text-[10px] font-semibold text-[#787574]">
                          +{product.variants.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price & Action footer */}
                  <div className="pt-4 border-t border-[#ebebeb] flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-[#787574] block">Base rate</span>
                      <span className="text-base font-extrabold text-[#000000]">
                        ${Number(product.basePrice).toFixed(2)}
                        <span className="text-[11px] font-normal text-[#787574]"> /m²</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddStandard(product)}
                        title="Add standard panel to cart"
                        className="h-9 px-3 rounded-full bg-[#f2f4f5] hover:bg-[#ebebeb] text-[#000000] text-xs font-semibold border border-[#ebebeb] transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#5433eb]" />
                        <span>Add</span>
                      </button>

                      <Link
                        href={`/?product=${product.slug}#calculator-section`}
                        className="h-9 px-3.5 rounded-full bg-[#5433eb] hover:bg-[#4527cd] text-white text-xs font-semibold shadow-[0_4px_16px_rgba(84,51,235,0.3)] transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>Custom</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
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
