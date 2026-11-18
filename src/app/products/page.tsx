import type { Metadata } from "next";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { PublicNavbar } from "@/components/common/PublicNavbar";
import { PublicFooter } from "@/components/common/PublicFooter";
import { ProductCatalogClient } from "./ProductCatalogClient";
import { Sparkles } from "lucide-react";

export const instant = false;

export const metadata: Metadata = {
  title: "Architectural Glass & Mirror Catalog",
  description:
    "Browse precision cut safety glass, fluted reeded panels, custom mirrors, and shower partitions with instant sizing tools.",
  openGraph: {
    title: "Architectural Glass & Mirror Catalog | Shop.",
    description:
      "Explore certified safety tempered glass, reeded textured panels, and frameless shower enclosures with custom sizing.",
    url: "/products",
    images: [
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Shop. Architectural Glass Catalog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Architectural Glass & Mirror Catalog | Shop.",
    description:
      "Browse precision cut safety glass, textured panels, and custom mirrors.",
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&h=630&q=80",
    ],
  },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }>;
}) {
  await connection();
  const resolvedParams = searchParams ? await searchParams : {};
  const categoryFilter = resolvedParams.category;

  let products: any[] = [];
  let categories: any[] = [];

  try {
    [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          variants: {
            where: { isAvailable: true },
            orderBy: { thicknessMm: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, slug: true },
      }),
    ]);
  } catch (e) {
    console.error("Error fetching product catalog:", e);
  }

  // Serialize Decimals for Client Component
  const serializedProducts = products.map((p) => ({
    ...p,
    basePrice: Number(p.basePrice),
    variants: p.variants.map((v: any) => ({
      ...v,
      priceAdjustment: Number(v.priceAdjustment),
    })),
  }));

  return (
    <div className="min-h-screen bg-[#f2f4f5] text-[#000000] flex flex-col justify-between">
      <PublicNavbar />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 sm:py-20 w-full space-y-12">
        {/* Catalog Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-[#000000] border border-[#ebebeb] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <Sparkles className="w-3.5 h-3.5 text-[#5433eb]" />
            Direct Architectural Catalog
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#000000]">
            Glass &amp; Mirror Collections
          </h1>
          <p className="text-sm sm:text-base text-[#787574] leading-relaxed">
            Engineered for interior designers, architects, and homeowners. Select your material and tailor cut-to-size specifications in millimeters.
          </p>
        </div>

        {/* Interactive Client Search, Category Chips, and Floating Product Grid */}
        <ProductCatalogClient
          initialProducts={serializedProducts}
          categories={categories}
          initialCategorySlug={categoryFilter}
        />
      </main>

      <PublicFooter />
    </div>
  );
}
