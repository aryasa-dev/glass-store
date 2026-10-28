import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProductsClient } from "./ProductsClient";

export const instant = false;

export const metadata = {
  title: "Products & Variants | Admin Control Center",
};

export default async function AdminProductsPage() {
  await connection();
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        variants: {
          orderBy: { thicknessMm: "asc" },
        },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const serializedProducts = products.map((p) => ({
    ...p,
    basePrice: Number(p.basePrice),
    variants: p.variants.map((v) => ({
      ...v,
      priceAdjustment: Number(v.priceAdjustment),
    })),
  }));

  return <ProductsClient initialProducts={serializedProducts} categories={categories} />;
}
