"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export interface ActionResponse {
  success: boolean;
  error?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createProductAction(formData: FormData): Promise<ActionResponse> {
  await requireAdmin();

  const name = formData.get("name")?.toString().trim();
  const rawSlug = formData.get("slug")?.toString().trim();
  const categoryId = formData.get("categoryId")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const basePrice = parseFloat(formData.get("basePrice")?.toString() || "0");
  const imageUrl = formData.get("imageUrl")?.toString().trim() || null;
  const rawImages = formData.get("images")?.toString().trim() || "";
  const isCustomizable = formData.get("isCustomizable") === "on" || formData.get("isCustomizable") === "true";
  const isActive = formData.get("isActive") === "on" || formData.get("isActive") === "true";

  if (!name || !categoryId) {
    return { success: false, error: "Product name and category are required." };
  }

  const slug = rawSlug ? slugify(rawSlug) : slugify(name);
  const images = rawImages
    ? rawImages
        .split(/[\n,]+/)
        .map((img) => img.trim())
        .filter((img) => img.length > 0)
    : [];

  try {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "A product with this slug already exists." };
    }

    await prisma.product.create({
      data: {
        name,
        slug,
        categoryId,
        description,
        basePrice: isNaN(basePrice) ? 0 : basePrice,
        imageUrl,
        images,
        isCustomizable,
        isActive,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product." };
  }
}

export async function updateProductAction(
  id: string,
  formData: FormData
): Promise<ActionResponse> {
  await requireAdmin();

  const name = formData.get("name")?.toString().trim();
  const rawSlug = formData.get("slug")?.toString().trim();
  const categoryId = formData.get("categoryId")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const basePrice = parseFloat(formData.get("basePrice")?.toString() || "0");
  const imageUrl = formData.get("imageUrl")?.toString().trim() || null;
  const rawImages = formData.get("images")?.toString().trim() || "";
  const isCustomizable = formData.get("isCustomizable") === "on" || formData.get("isCustomizable") === "true";
  const isActive = formData.get("isActive") === "on" || formData.get("isActive") === "true";

  if (!name || !categoryId) {
    return { success: false, error: "Product name and category are required." };
  }

  const slug = rawSlug ? slugify(rawSlug) : slugify(name);
  const images = rawImages
    ? rawImages
        .split(/[\n,]+/)
        .map((img) => img.trim())
        .filter((img) => img.length > 0)
    : [];

  try {
    const existing = await prisma.product.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    });
    if (existing) {
      return { success: false, error: "Another product with this slug already exists." };
    }

    await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        categoryId,
        description,
        basePrice: isNaN(basePrice) ? 0 : basePrice,
        imageUrl,
        images,
        isCustomizable,
        isActive,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product." };
  }
}

export async function deleteProductAction(id: string): Promise<ActionResponse> {
  await requireAdmin();

  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product." };
  }
}

// -------------------------------------------------------------
// Product Variant Actions
// -------------------------------------------------------------

export async function createVariantAction(
  productId: string,
  formData: FormData
): Promise<ActionResponse> {
  await requireAdmin();

  const name = formData.get("name")?.toString().trim();
  const sku = formData.get("sku")?.toString().trim() || null;
  const glassType = formData.get("glassType")?.toString().trim() || null;
  const thicknessMm = parseFloat(formData.get("thicknessMm")?.toString() || "");
  const priceAdjustment = parseFloat(formData.get("priceAdjustment")?.toString() || "0");
  const stock = parseInt(formData.get("stock")?.toString() || "0", 10);
  const isAvailable = formData.get("isAvailable") === "on" || formData.get("isAvailable") === "true";

  if (!name) {
    return { success: false, error: "Variant name is required." };
  }

  try {
    if (sku) {
      const existingSku = await prisma.productVariant.findUnique({ where: { sku } });
      if (existingSku) {
        return { success: false, error: "A variant with this SKU already exists." };
      }
    }

    await prisma.productVariant.create({
      data: {
        productId,
        name,
        sku,
        glassType,
        thicknessMm: isNaN(thicknessMm) ? null : thicknessMm,
        priceAdjustment: isNaN(priceAdjustment) ? 0 : priceAdjustment,
        stock: isNaN(stock) ? 0 : stock,
        isAvailable,
      },
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error creating variant:", error);
    return { success: false, error: "Failed to create variant." };
  }
}

export async function updateVariantAction(
  id: string,
  formData: FormData
): Promise<ActionResponse> {
  await requireAdmin();

  const name = formData.get("name")?.toString().trim();
  const sku = formData.get("sku")?.toString().trim() || null;
  const glassType = formData.get("glassType")?.toString().trim() || null;
  const thicknessMm = parseFloat(formData.get("thicknessMm")?.toString() || "");
  const priceAdjustment = parseFloat(formData.get("priceAdjustment")?.toString() || "0");
  const stock = parseInt(formData.get("stock")?.toString() || "0", 10);
  const isAvailable = formData.get("isAvailable") === "on" || formData.get("isAvailable") === "true";

  if (!name) {
    return { success: false, error: "Variant name is required." };
  }

  try {
    if (sku) {
      const existingSku = await prisma.productVariant.findFirst({
        where: {
          sku,
          NOT: { id },
        },
      });
      if (existingSku) {
        return { success: false, error: "Another variant with this SKU already exists." };
      }
    }

    await prisma.productVariant.update({
      where: { id },
      data: {
        name,
        sku,
        glassType,
        thicknessMm: isNaN(thicknessMm) ? null : thicknessMm,
        priceAdjustment: isNaN(priceAdjustment) ? 0 : priceAdjustment,
        stock: isNaN(stock) ? 0 : stock,
        isAvailable,
      },
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error updating variant:", error);
    return { success: false, error: "Failed to update variant." };
  }
}

export async function deleteVariantAction(id: string): Promise<ActionResponse> {
  await requireAdmin();

  try {
    await prisma.productVariant.delete({
      where: { id },
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error deleting variant:", error);
    return { success: false, error: "Failed to delete variant." };
  }
}
