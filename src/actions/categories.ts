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

export async function createCategoryAction(formData: FormData): Promise<ActionResponse> {
  await requireAdmin();

  const name = formData.get("name")?.toString().trim();
  const rawSlug = formData.get("slug")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const imageUrl = formData.get("imageUrl")?.toString().trim() || null;

  if (!name) {
    return { success: false, error: "Category name is required." };
  }

  const slug = rawSlug ? slugify(rawSlug) : slugify(name);

  try {
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "A category with this slug already exists." };
    }

    await prisma.category.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category." };
  }
}

export async function updateCategoryAction(
  id: string,
  formData: FormData
): Promise<ActionResponse> {
  await requireAdmin();

  const name = formData.get("name")?.toString().trim();
  const rawSlug = formData.get("slug")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const imageUrl = formData.get("imageUrl")?.toString().trim() || null;

  if (!name) {
    return { success: false, error: "Category name is required." };
  }

  const slug = rawSlug ? slugify(rawSlug) : slugify(name);

  try {
    const existing = await prisma.category.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    });
    if (existing) {
      return { success: false, error: "Another category with this slug already exists." };
    }

    await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        imageUrl,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Failed to update category." };
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResponse> {
  await requireAdmin();

  try {
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category." };
  }
}
