import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { CategoriesClient } from "./CategoriesClient";

export const instant = false;

export const metadata = {
  title: "Categories | Admin Control Center",
};

export default async function AdminCategoriesPage() {
  await connection();
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return <CategoriesClient initialCategories={categories} />;
}
