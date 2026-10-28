"use client";

import { useState, useTransition } from "react";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  createVariantAction,
  updateVariantAction,
  deleteVariantAction,
} from "@/actions/products";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  Layers,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Image as ImageIcon,
  Sliders,
  DollarSign,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string | null;
  glassType: string | null;
  thicknessMm: number | null;
  priceAdjustment: any;
  stock: number;
  isAvailable: boolean;
}

interface ProductWithRelations {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  basePrice: any;
  imageUrl: string | null;
  images: string[];
  isActive: boolean;
  isCustomizable: boolean;
  categoryId: string;
  category: Category;
  variants: ProductVariant[];
}

interface ProductsClientProps {
  initialProducts: ProductWithRelations[];
  categories: Category[];
}

export function ProductsClient({
  initialProducts,
  categories,
}: ProductsClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithRelations | null>(null);

  // Variant modal state
  const [selectedProductForVariants, setSelectedProductForVariants] =
    useState<ProductWithRelations | null>(null);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);

  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Product Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [basePrice, setBasePrice] = useState("45.00");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState("");
  const [isCustomizable, setIsCustomizable] = useState(true);
  const [isActive, setIsActive] = useState(true);

  // Variant Form State
  const [variantName, setVariantName] = useState("");
  const [variantSku, setVariantSku] = useState("");
  const [variantGlassType, setVariantGlassType] = useState("Clear Float");
  const [variantThickness, setVariantThickness] = useState("6");
  const [variantPriceAdj, setVariantPriceAdj] = useState("0");
  const [variantStock, setVariantStock] = useState("100");
  const [variantAvailable, setVariantAvailable] = useState(true);

  // Open Product Modal
  const openCreateProductModal = () => {
    setEditingProduct(null);
    setName("");
    setSlug("");
    setCategoryId(categories[0]?.id || "");
    setBasePrice("45.00");
    setDescription("");
    setImageUrl("");
    setImages("");
    setIsCustomizable(true);
    setIsActive(true);
    setErrorMessage(null);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: ProductWithRelations) => {
    setEditingProduct(product);
    setName(product.name);
    setSlug(product.slug);
    setCategoryId(product.categoryId);
    setBasePrice(Number(product.basePrice).toString());
    setDescription(product.description || "");
    setImageUrl(product.imageUrl || "");
    setImages(product.images ? product.images.join("\n") : "");
    setIsCustomizable(product.isCustomizable);
    setIsActive(product.isActive);
    setErrorMessage(null);
    setIsProductModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!editingProduct) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  const handleProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("categoryId", categoryId);
    formData.append("basePrice", basePrice);
    formData.append("description", description);
    formData.append("imageUrl", imageUrl);
    formData.append("images", images);
    formData.append("isCustomizable", String(isCustomizable));
    formData.append("isActive", String(isActive));

    startTransition(async () => {
      let res;
      if (editingProduct) {
        res = await updateProductAction(editingProduct.id, formData);
      } else {
        res = await createProductAction(formData);
      }

      if (!res.success) {
        setErrorMessage(res.error || "An error occurred.");
      } else {
        setIsProductModalOpen(false);
        window.location.reload();
      }
    });
  };

  const handleDeleteProduct = async (id: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"? This will also remove its variants and rules.`)) {
      return;
    }

    startTransition(async () => {
      const res = await deleteProductAction(id);
      if (!res.success) {
        alert(res.error || "Failed to delete product.");
      } else {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    });
  };

  // Variant Modal Handlers
  const openVariantsDrawer = (product: ProductWithRelations) => {
    setSelectedProductForVariants(product);
    resetVariantForm();
    setIsVariantModalOpen(true);
  };

  const resetVariantForm = () => {
    setEditingVariant(null);
    setVariantName("");
    setVariantSku("");
    setVariantGlassType("Clear Float");
    setVariantThickness("6");
    setVariantPriceAdj("0");
    setVariantStock("100");
    setVariantAvailable(true);
    setErrorMessage(null);
  };

  const editVariantRow = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setVariantName(variant.name);
    setVariantSku(variant.sku || "");
    setVariantGlassType(variant.glassType || "Clear Float");
    setVariantThickness(variant.thicknessMm ? variant.thicknessMm.toString() : "6");
    setVariantPriceAdj(Number(variant.priceAdjustment).toString());
    setVariantStock(variant.stock.toString());
    setVariantAvailable(variant.isAvailable);
  };

  const handleVariantSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProductForVariants) return;
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("name", variantName);
    formData.append("sku", variantSku);
    formData.append("glassType", variantGlassType);
    formData.append("thicknessMm", variantThickness);
    formData.append("priceAdjustment", variantPriceAdj);
    formData.append("stock", variantStock);
    formData.append("isAvailable", String(variantAvailable));

    startTransition(async () => {
      let res;
      if (editingVariant) {
        res = await updateVariantAction(editingVariant.id, formData);
      } else {
        res = await createVariantAction(selectedProductForVariants.id, formData);
      }

      if (!res.success) {
        setErrorMessage(res.error || "An error occurred.");
      } else {
        resetVariantForm();
        window.location.reload();
      }
    });
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm("Delete this variant?")) return;
    startTransition(async () => {
      const res = await deleteVariantAction(variantId);
      if (!res.success) {
        alert(res.error || "Failed to delete variant.");
      } else {
        window.location.reload();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#000000]">
            Products & Variants
          </h1>
          <p className="text-sm text-[#787574] mt-1">
            Manage custom cut glass panels, base rates per m², and thickness specifications.
          </p>
        </div>

        <button
          onClick={openCreateProductModal}
          className="px-5 py-2.5 rounded-full bg-[#5433eb] hover:bg-[#4527cd] text-white text-xs font-semibold shadow-[0_4px_24px_rgba(69,36,219,0.34)] transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Product</span>
        </button>
      </div>

      {/* Product List */}
      {products.length === 0 ? (
        <div className="bg-white rounded-[28px] p-12 text-center text-sm text-[#787574] border border-[#ebebeb]/60">
          No products in catalog yet. Click "New Product" to begin.
        </div>
      ) : (
        <div className="space-y-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-[28px] p-6 sm:p-7 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06),0_2px_4px_-2px_rgba(0,0,0,0.06)] border border-[#ebebeb]/60 hover:border-[#5433eb]/30 transition-all space-y-5"
            >
              {/* Product Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb]/60 pb-4">
                <div className="flex items-center gap-4">
                  {product.imageUrl ? (
                    <div className="w-14 h-14 rounded-[20px] overflow-hidden bg-[#f2f4f5] flex-shrink-0 border border-[#ebebeb]">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-[20px] bg-[#f2f4f5] flex items-center justify-center text-[#5433eb] flex-shrink-0">
                      <Package className="w-6 h-6" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-[#000000]">
                        {product.name}
                      </h2>
                      {product.isActive ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-semibold border border-neutral-200">
                          Draft
                        </span>
                      )}
                      {product.isCustomizable && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-200">
                          Customizable
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#787574] mt-0.5">
                      <span className="font-medium text-neutral-800">
                        {product.category?.name}
                      </span>
                      <span>&bull;</span>
                      <span className="font-mono">/{product.slug}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <div className="text-right sm:mr-3">
                    <div className="text-sm font-extrabold text-[#000000]">
                      ${Number(product.basePrice).toFixed(2)}{" "}
                      <span className="text-xs font-normal text-[#787574]">/m²</span>
                    </div>
                    <div className="text-[11px] text-[#787574]">
                      {product.variants.length} variant(s)
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openVariantsDrawer(product)}
                      className="px-3.5 py-1.5 rounded-full bg-[#f2f4f5] hover:bg-[#5433eb]/10 text-neutral-800 hover:text-[#5433eb] text-xs font-semibold transition-all flex items-center gap-1.5"
                    >
                      <Layers className="w-3.5 h-3.5 text-[#5433eb]" />
                      <span>Variants ({product.variants.length})</span>
                    </button>
                    <button
                      onClick={() => openEditProductModal(product)}
                      className="p-2 rounded-full border border-[#ebebeb] text-neutral-600 hover:text-[#000000] hover:bg-[#f2f4f5] transition-colors"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      className="p-2 rounded-full border border-[#ebebeb] text-red-500 hover:text-red-700 hover:bg-red-50 hover:border-red-200 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-xs text-[#787574] leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Variants Pill List */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-neutral-800 flex items-center justify-between">
                  <span>Available Thicknesses & Types</span>
                  <button
                    onClick={() => openVariantsDrawer(product)}
                    className="text-[11px] text-[#5433eb] hover:underline font-medium"
                  >
                    + Add or edit variants
                  </button>
                </div>
                {product.variants.length === 0 ? (
                  <div className="p-3 rounded-2xl bg-[#f2f4f5]/60 text-xs text-neutral-500">
                    No variants added yet. Click "+ Add or edit variants" to add glass types and thicknesses.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {product.variants.map((v) => (
                      <div
                        key={v.id}
                        className="p-3 rounded-2xl bg-[#f2f4f5]/60 border border-[#ebebeb] text-xs flex flex-col justify-between"
                      >
                        <div className="font-semibold text-[#000000] flex items-center justify-between">
                          <span>{v.name}</span>
                          {v.isAvailable ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-neutral-300" />
                          )}
                        </div>
                        <div className="text-[11px] text-[#787574] mt-1 space-y-0.5">
                          <div>
                            {v.thicknessMm ? `${v.thicknessMm} mm` : "Custom"} &bull;{" "}
                            {v.glassType || "Standard"}
                          </div>
                          <div>
                            Adj: +${Number(v.priceAdjustment).toFixed(2)} &bull; Stock:{" "}
                            {v.stock}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Create / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-xl w-full p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-[#ebebeb] space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#ebebeb] pb-4">
              <h2 className="text-lg font-bold text-[#000000]">
                {editingProduct ? "Edit Product" : "Create New Product"}
              </h2>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-[#f2f4f5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={handleNameChange}
                    placeholder="e.g. Tempered Safety Glass Panel"
                    className="w-full h-11 px-4 rounded-full border border-[#ebebeb] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="tempered-safety-glass-panel"
                    className="w-full h-11 px-4 rounded-full border border-[#ebebeb] bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full h-11 px-4 rounded-full border border-[#ebebeb] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Base Price per m² ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="45.00"
                    className="w-full h-11 px-4 rounded-full border border-[#ebebeb] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Primary Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full h-11 px-4 rounded-full border border-[#ebebeb] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Additional Images (one per line)
                </label>
                <textarea
                  rows={2}
                  value={images}
                  onChange={(e) => setImages(e.target.value)}
                  placeholder="https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
                  className="w-full p-3.5 rounded-[20px] border border-[#ebebeb] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed material attributes, optical clarity, polish..."
                  className="w-full p-3.5 rounded-[20px] border border-[#ebebeb] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={isCustomizable}
                    onChange={(e) => setIsCustomizable(e.target.checked)}
                    className="w-4 h-4 rounded text-[#5433eb] focus:ring-[#5433eb]"
                  />
                  <span>Enable Custom Cutting Calculator</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-[#5433eb] focus:ring-[#5433eb]"
                  />
                  <span>Active in Storefront</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#ebebeb] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-[#ebebeb] text-xs font-semibold text-neutral-700 hover:bg-[#f2f4f5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 rounded-full bg-[#5433eb] hover:bg-[#4527cd] text-white text-xs font-semibold shadow-[0_4px_24px_rgba(69,36,219,0.34)] transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingProduct ? "Save Changes" : "Create Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Variant Management Modal */}
      {isVariantModalOpen && selectedProductForVariants && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-2xl w-full p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-[#ebebeb] space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#ebebeb] pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#000000]">
                  Manage Variants: {selectedProductForVariants.name}
                </h2>
                <p className="text-xs text-[#787574]">
                  Add or edit glass thicknesses, finishing types, and SKU stock.
                </p>
              </div>
              <button
                onClick={() => setIsVariantModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-[#f2f4f5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Existing Variants Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Current Variants ({selectedProductForVariants.variants.length})
              </h3>
              {selectedProductForVariants.variants.length === 0 ? (
                <div className="p-4 rounded-2xl bg-[#f2f4f5] text-xs text-neutral-500 text-center">
                  No variants configured for this product.
                </div>
              ) : (
                <div className="border border-[#ebebeb] rounded-2xl overflow-hidden divide-y divide-[#ebebeb]">
                  {selectedProductForVariants.variants.map((v) => (
                    <div
                      key={v.id}
                      className="p-3.5 flex items-center justify-between text-xs hover:bg-[#f2f4f5]/50 transition-colors"
                    >
                      <div>
                        <div className="font-bold text-[#000000]">{v.name}</div>
                        <div className="text-[11px] text-[#787574] mt-0.5">
                          {v.thicknessMm} mm &bull; {v.glassType || "Standard"} &bull;{" "}
                          SKU: {v.sku || "N/A"} &bull; Adj: +$
                          {Number(v.priceAdjustment).toFixed(2)} &bull; Stock: {v.stock}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => editVariantRow(v)}
                          className="px-2.5 py-1 rounded-full border border-[#ebebeb] text-[11px] font-medium hover:bg-neutral-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteVariant(v.id)}
                          className="px-2.5 py-1 rounded-full border border-red-200 text-[11px] text-red-600 font-medium hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Variant Form (Create or Edit) */}
            <div className="p-5 rounded-2xl bg-[#f2f4f5]/60 border border-[#ebebeb] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                  {editingVariant ? `Edit: ${editingVariant.name}` : "Add New Variant"}
                </h3>
                {editingVariant && (
                  <button
                    onClick={resetVariantForm}
                    className="text-[11px] text-[#5433eb] hover:underline"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>

              <form onSubmit={handleVariantSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Variant Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={variantName}
                      onChange={(e) => setVariantName(e.target.value)}
                      placeholder="e.g. Clear Float 8mm"
                      className="w-full h-10 px-3 rounded-full border border-[#ebebeb] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      SKU Code
                    </label>
                    <input
                      type="text"
                      value={variantSku}
                      onChange={(e) => setVariantSku(e.target.value)}
                      placeholder="e.g. GLS-CLR-8MM"
                      className="w-full h-10 px-3 rounded-full border border-[#ebebeb] bg-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Glass Type
                    </label>
                    <input
                      type="text"
                      value={variantGlassType}
                      onChange={(e) => setVariantGlassType(e.target.value)}
                      placeholder="Clear, Tempered, Frosted..."
                      className="w-full h-10 px-3 rounded-full border border-[#ebebeb] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Thickness (mm)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={variantThickness}
                      onChange={(e) => setVariantThickness(e.target.value)}
                      placeholder="8"
                      className="w-full h-10 px-3 rounded-full border border-[#ebebeb] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Price Adjustment ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={variantPriceAdj}
                      onChange={(e) => setVariantPriceAdj(e.target.value)}
                      placeholder="0.00"
                      className="w-full h-10 px-3 rounded-full border border-[#ebebeb] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        Stock
                      </label>
                      <input
                        type="number"
                        value={variantStock}
                        onChange={(e) => setVariantStock(e.target.value)}
                        className="w-24 h-9 px-3 rounded-full border border-[#ebebeb] bg-white text-xs"
                      />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800 pt-4">
                      <input
                        type="checkbox"
                        checked={variantAvailable}
                        onChange={(e) => setVariantAvailable(e.target.checked)}
                        className="w-4 h-4 rounded text-[#5433eb]"
                      />
                      <span>Available</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="mt-4 px-5 py-2 rounded-full bg-[#5433eb] hover:bg-[#4527cd] text-white text-xs font-semibold shadow-[0_4px_16px_rgba(69,36,219,0.3)] transition-all flex items-center gap-2 disabled:opacity-60"
                  >
                    {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{editingVariant ? "Update Variant" : "Save Variant"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
