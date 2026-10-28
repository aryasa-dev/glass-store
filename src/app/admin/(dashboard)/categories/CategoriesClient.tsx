"use client";

import { useState, useTransition } from "react";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/actions/categories";
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  Package,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";

interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date;
  _count: {
    products: number;
  };
}

interface CategoriesClientProps {
  initialCategories: CategoryWithCount[];
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImageUrl("");
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryWithCount) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setImageUrl(cat.imageUrl || "");
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setError(null);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!editingCategory) {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("imageUrl", imageUrl);

    startTransition(async () => {
      let res;
      if (editingCategory) {
        res = await updateCategoryAction(editingCategory.id, formData);
      } else {
        res = await createCategoryAction(formData);
      }

      if (!res.success) {
        setError(res.error || "An error occurred.");
      } else {
        closeModal();
        window.location.reload();
      }
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"? All associated products may be affected.`)) {
      return;
    }

    startTransition(async () => {
      const res = await deleteCategoryAction(id);
      if (!res.success) {
        alert(res.error || "Failed to delete category.");
      } else {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#000000]">
            Categories
          </h1>
          <p className="text-sm text-[#787574] mt-1">
            Group custom glass panels, mirrors, architectural supplies, and fittings.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-full bg-[#5433eb] hover:bg-[#4527cd] text-white text-xs font-semibold shadow-[0_4px_24px_rgba(69,36,219,0.34)] transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Grid of Categories */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-[28px] p-12 text-center text-sm text-[#787574] border border-[#ebebeb]/60">
          No categories found. Click "New Category" to create your first one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-[28px] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06),0_2px_4px_-2px_rgba(0,0,0,0.06)] border border-[#ebebeb]/60 flex flex-col justify-between space-y-4 hover:border-[#5433eb]/40 transition-all group"
            >
              <div>
                {/* Image preview banner if available */}
                {cat.imageUrl ? (
                  <div className="w-full h-36 rounded-[20px] overflow-hidden mb-4 bg-[#f2f4f5] relative">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full h-24 rounded-[20px] bg-[#f2f4f5] mb-4 flex items-center justify-center text-neutral-400">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                  </div>
                )}

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-[#000000]">
                      {cat.name}
                    </h2>
                    <span className="text-[11px] font-mono text-[#787574]">
                      /{cat.slug}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f2f4f5] text-[11px] font-medium text-neutral-700">
                    <Package className="w-3 h-3 text-[#5433eb]" />
                    {cat._count.products} products
                  </span>
                </div>

                {cat.description && (
                  <p className="text-xs text-[#787574] mt-2 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#ebebeb]/70 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(cat)}
                  className="px-3 py-1.5 rounded-full border border-[#ebebeb] text-xs font-medium text-neutral-700 hover:bg-[#f2f4f5] transition-colors flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="px-3 py-1.5 rounded-full border border-[#ebebeb] text-xs font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-[#ebebeb] space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#ebebeb] pb-4">
              <h2 className="text-lg font-bold text-[#000000]">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-[#f2f4f5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. Tempered Safety Glass"
                  className="w-full h-11 px-4 rounded-full border border-[#ebebeb] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Slug (URL Key) *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. tempered-safety-glass"
                  className="w-full h-11 px-4 rounded-full border border-[#ebebeb] bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full h-11 px-4 rounded-full border border-[#ebebeb] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb]"
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
                  placeholder="Provide a detailed description of this category..."
                  className="w-full p-3.5 rounded-[20px] border border-[#ebebeb] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb]"
                />
              </div>

              <div className="pt-4 border-t border-[#ebebeb] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
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
                  <span>{editingCategory ? "Save Changes" : "Create Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
