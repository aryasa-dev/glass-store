import Link from "next/link";
import type { Metadata } from "next";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { GlassCalculator } from "@/components/calculator/GlassCalculator";
import { PublicNavbar } from "@/components/common/PublicNavbar";
import { PublicFooter } from "@/components/common/PublicFooter";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Ruler,
  Truck,
  Award,
  Layers,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

export const instant = false;

export const metadata: Metadata = {
  title: "Precision Cut-to-Size Glass & Architectural Panels",
  description:
    "Instant online calculation and ordering for custom tempered safety glass, shower panels, polished mirrors, and architectural glazing with CNC precision.",
  openGraph: {
    title: "Precision Cut-to-Size Glass & Architectural Panels | Shop.",
    description:
      "Configure precision cut-to-size glass panels and mirrors with live square-meter calculation, edge polish choices, and direct foundry delivery.",
    url: "/",
    images: [
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Custom Cut Architectural Glass Panels",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Precision Cut-to-Size Glass & Architectural Panels | Shop.",
    description:
      "Instant sizing calculator and direct foundry rates for custom cut tempered glass and mirrors.",
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&h=630&q=80",
    ],
  },
};

export default async function Home() {
  await connection();

  let featuredProducts: any[] = [];
  let categories: any[] = [];
  let customGlassProduct: any = null;

  try {
    [featuredProducts, categories, customGlassProduct] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        take: 4,
        include: {
          category: true,
          variants: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        take: 4,
        include: {
          _count: { select: { products: true } },
        },
      }),
      prisma.product.findFirst({
        where: { isCustomizable: true },
        include: {
          variants: { where: { isAvailable: true } },
          calculatorRules: { where: { isActive: true }, take: 1 },
        },
      }),
    ]);
  } catch (e) {
    console.error("Error fetching homepage records:", e);
  }

  // Serialize custom glass product for the calculator
  const serializedVariants = customGlassProduct?.variants.map((v: any) => ({
    id: v.id,
    name: v.name,
    glassType: v.glassType,
    thicknessMm: v.thicknessMm,
    priceAdjustment: Number(v.priceAdjustment),
    stock: v.stock,
    isAvailable: v.isAvailable,
  }));

  const activeRule = customGlassProduct?.calculatorRules[0];
  const serializedRule = activeRule
    ? {
        id: activeRule.id,
        name: activeRule.name,
        basePricePerSqm: Number(activeRule.basePricePerSqm),
        minAreaThreshold: activeRule.minAreaThreshold,
        wasteFactor: activeRule.wasteFactor,
        thicknessMultipliers:
          (activeRule.thicknessMultipliers as Record<string, number>) || null,
        minWidthMm: activeRule.minWidthMm,
        maxWidthMm: activeRule.maxWidthMm,
        minHeightMm: activeRule.minHeightMm,
        maxHeightMm: activeRule.maxHeightMm,
        edgePricePerMeter: activeRule.edgePricePerMeter
          ? Number(activeRule.edgePricePerMeter)
          : null,
        holeDrillingPrice: activeRule.holeDrillingPrice
          ? Number(activeRule.holeDrillingPrice)
          : null,
        isActive: activeRule.isActive,
      }
    : null;

  return (
    <div className="min-h-screen bg-[#f2f4f5] text-[#000000] flex flex-col justify-between">
      <PublicNavbar />

      <main className="space-y-16 sm:space-y-20">
        {/* HERO SECTION */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-12 sm:pt-20">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-[#000000] border border-[#ebebeb] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <span className="w-2 h-2 rounded-full bg-[#5433eb] animate-pulse" />
              <span>Architectural Precision &bull; Direct From Foundry</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#000000] leading-[1.1]">
              Custom Cut Glass &amp; Architectural Panels
            </h1>

            <p className="text-base sm:text-lg text-[#787574] leading-relaxed max-w-2xl mx-auto">
              Precision fabricated toughened safety glass, frameless shower screens, and custom mirrors. Tailored to your exact millimetre measurements.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="#calculator-section"
                className="h-12 px-7 rounded-full bg-[#5433eb] hover:bg-[#4527cd] text-white text-xs font-semibold shadow-[0_8px_24px_rgba(84,51,235,0.35)] transition-all flex items-center gap-2"
              >
                <span>Calculate Custom Size</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/products"
                className="h-12 px-7 rounded-full bg-white hover:bg-[#f2f4f5] text-[#000000] text-xs font-semibold border border-[#ebebeb] shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all flex items-center gap-2"
              >
                <span>Explore Catalog</span>
              </Link>
            </div>
          </div>
        </section>

        {/* BUSINESS OVERVIEW / VALUE PILLARS (py-16 to py-20 breathing room) */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06),0_2px_4px_-2px_rgba(0,0,0,0.06)] border-0 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#f2f4f5] text-[#000000] flex items-center justify-center">
                <Ruler className="w-6 h-6 text-[#5433eb]" />
              </div>
              <h3 className="font-bold text-sm text-[#000000]">CNC Diamond Polishing</h3>
              <p className="text-xs text-[#787574] leading-relaxed">
                Clean flat-polished edges, beveling, and radius corners executed with automated CNC equipment.
              </p>
            </div>

            <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06),0_2px_4px_-2px_rgba(0,0,0,0.06)] border-0 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#f2f4f5] text-[#000000] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#000000]" />
              </div>
              <h3 className="font-bold text-sm text-[#000000]">Grade A Tempered Glass</h3>
              <p className="text-xs text-[#787574] leading-relaxed">
                Heat-treated toughened glass compliant with ANSI &amp; BS 6206 safety glazing architectural codes.
              </p>
            </div>

            <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06),0_2px_4px_-2px_rgba(0,0,0,0.06)] border-0 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#f2f4f5] text-[#000000] flex items-center justify-center">
                <Award className="w-6 h-6 text-[#000000]" />
              </div>
              <h3 className="font-bold text-sm text-[#000000]">Direct Foundry Rates</h3>
              <p className="text-xs text-[#787574] leading-relaxed">
                Transparent square-meter pricing with zero showroom middleman markups for homeowners &amp; builders.
              </p>
            </div>

            <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06),0_2px_4px_-2px_rgba(0,0,0,0.06)] border-0 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#f2f4f5] text-[#000000] flex items-center justify-center">
                <Truck className="w-6 h-6 text-[#000000]" />
              </div>
              <h3 className="font-bold text-sm text-[#000000]">Secure Wooden Crates</h3>
              <p className="text-xs text-[#787574] leading-relaxed">
                Shipped in shock-absorbing timber shipping crates with 100% replacement guarantee against transit chips.
              </p>
            </div>
          </div>
        </section>

        {/* CUSTOM GLASS CALCULATOR SECTION */}
        <section id="calculator-section" className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#000000]">
              Interactive Dimension Calculator
            </h2>
            <p className="text-xs sm:text-sm text-[#787574]">
              Select glass type, thickness, and input your dimensions for an instantaneous quote.
            </p>
          </div>

          <div className="flex justify-center">
            <GlassCalculator
              productId={customGlassProduct?.id}
              productName={customGlassProduct?.name || "Custom Cut Safety Glass Panel"}
              basePrice={customGlassProduct ? Number(customGlassProduct.basePrice) : 45.0}
              variants={serializedVariants}
              calculatorRule={serializedRule}
            />
          </div>
        </section>

        {/* FEATURED PRODUCTS (Floating Cards, zero border, soft elevation) */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-semibold text-[#5433eb] uppercase tracking-wider mb-1">
                Curated Selection
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#000000]">
                Featured Architectural Products
              </h2>
            </div>

            <Link
              href="/products"
              className="text-xs font-bold text-[#5433eb] hover:underline flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>View full catalog</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => {
              const displayImage =
                p.imageUrl ||
                "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80";

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-[28px] overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] border-0 flex flex-col justify-between group transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                >
                  <div className="p-4 pb-0">
                    <div className="w-full aspect-square rounded-[20px] overflow-hidden bg-[#f2f4f5] relative">
                      <img
                        src={displayImage}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-semibold text-[#000000] shadow-sm">
                        {p.category.name}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 pt-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-sm text-[#000000] line-clamp-1 group-hover:text-[#5433eb] transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-xs text-[#787574] mt-1 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#ebebeb] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#787574] block">From</span>
                        <span className="text-base font-extrabold text-[#000000]">
                          ${Number(p.basePrice).toFixed(2)}
                          <span className="text-xs font-normal text-[#787574]"> /m²</span>
                        </span>
                      </div>

                      <a
                        href="#calculator-section"
                        className="h-9 px-4 rounded-full bg-[#f2f4f5] hover:bg-[#5433eb] text-neutral-800 hover:text-white text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>Configure</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CATEGORIES GRID */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#000000]">
              Explore by Application
            </h2>
            <p className="text-xs sm:text-sm text-[#787574]">
              High-durability structural glass, decorative mirrors, and bathroom enclosures.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="bg-white rounded-[28px] overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.08),0_2px_4px_-2px_rgba(0,0,0,0.08)] border-0 group block transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
              >
                <div className="h-44 w-full bg-[#f2f4f5] relative overflow-hidden">
                  {cat.imageUrl && (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-5 text-white">
                    <h3 className="font-bold text-base leading-snug">{cat.name}</h3>
                    <p className="text-[11px] text-white/80 mt-0.5">
                      {cat._count.products} products available
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CALL TO ACTION BANNER */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-12">
          <div className="bg-[#000000] text-white rounded-[32px] p-8 sm:p-14 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <span className="px-3.5 py-1 rounded-full bg-white/10 text-xs font-semibold text-white/90 backdrop-blur-md">
                Commercial Projects &amp; Large Orders
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Need Architectural Blueprints or Volume Pricing?
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Our drafting engineers can review CAD files, provide custom CNC drilling templates, and deliver bulk freight estimates directly to your project site.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/contact"
                className="h-12 px-7 rounded-full bg-[#5433eb] hover:bg-[#4527cd] text-white text-xs font-semibold shadow-[0_8px_24px_rgba(84,51,235,0.4)] transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span>Request Commercial Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="h-12 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all whitespace-nowrap"
              >
                <span>About Our Facility</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
