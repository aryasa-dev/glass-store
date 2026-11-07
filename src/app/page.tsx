import Link from "next/link";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { GlassCalculator } from "@/components/calculator/GlassCalculator";
import { CartNavButton } from "@/components/cart/CartNavButton";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  Sparkles,
  LayoutDashboard,
  Layers,
  CheckCircle2,
  ArrowRight,
  Ruler,
} from "lucide-react";

export const instant = false;

export default async function Home() {
  await connection();

  // Fetch customizable product and active calculator rule from Prisma database
  let product = null;
  try {
    product = await prisma.product.findFirst({
      where: { isCustomizable: true },
      include: {
        variants: {
          where: { isAvailable: true },
          orderBy: { thicknessMm: "asc" },
        },
        calculatorRules: {
          where: { isActive: true },
          take: 1,
        },
      },
    });
  } catch (e) {
    console.error("Prisma lookup failed, falling back to static default", e);
  }

  // Serialize Decimal objects for Client Component consumption
  const serializedVariants = product?.variants.map((v) => ({
    id: v.id,
    name: v.name,
    glassType: v.glassType,
    thicknessMm: v.thicknessMm,
    priceAdjustment: Number(v.priceAdjustment),
    stock: v.stock,
    isAvailable: v.isAvailable,
  }));

  const activeRule = product?.calculatorRules[0];
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
      {/* Top Navbar */}
      <header className="border-b border-[#ebebeb] bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
            <div className="w-8 h-8 rounded-xl bg-[#5433eb] text-white flex items-center justify-center font-bold text-sm shadow-[0_4px_12px_rgba(69,36,219,0.3)]">
              S
            </div>
            <span className="flex items-center">
              Shop<span className="text-[#5433eb] text-xl leading-none">.</span>
            </span>
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#ebebeb] text-xs font-semibold hover:bg-[#f2f4f5] transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#5433eb]" />
              <span>Admin Panel</span>
            </Link>

            <CartNavButton />
          </nav>
        </div>
      </header>

      {/* Main Section */}
      <main className="max-w-6xl mx-auto px-4 py-12 sm:py-16 space-y-16">
        {/* Hero Banner */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-[#000000] border border-[#ebebeb] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <Sparkles className="w-3.5 h-3.5 text-[#5433eb]" />
            Architectural Precision Cut Glass &bull; Custom Sizing
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#000000]">
            Custom Glass Sizing Calculator
          </h1>
          <p className="text-sm sm:text-base text-[#787574] leading-relaxed">
            Configure safety glass, partitions, table tops, and shelves with millimeter
            precision. Dynamic area and thickness multiplier estimation.
          </p>
        </div>

        {/* The Custom Glass Calculator Component */}
        <div className="flex justify-center">
          <GlassCalculator
            productId={product?.id}
            productName={product?.name || "Custom Cut Glass Panel"}
            basePrice={product ? Number(product.basePrice) : 45.0}
            variants={serializedVariants}
            calculatorRule={serializedRule}
          />
        </div>

        {/* Value Props / Guarantee */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-white rounded-[28px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#ebebeb] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5433eb]/10 text-[#5433eb] flex items-center justify-center">
              <Ruler className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#000000]">Millimeter Precision</h3>
            <p className="text-xs text-[#787574] leading-relaxed">
              CNC edge polishing and high-precision diamond cutting tailored to your architectural blueprints.
            </p>
          </div>

          <div className="bg-white rounded-[28px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#ebebeb] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#000000]">Certified Safety Glass</h3>
            <p className="text-xs text-[#787574] leading-relaxed">
              Heat-tempered architectural safety glass adhering to rigorous international shatter-resistance standards.
            </p>
          </div>

          <div className="bg-white rounded-[28px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#ebebeb] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#000000]">Insured White-Glove Transit</h3>
            <p className="text-xs text-[#787574] leading-relaxed">
              Custom foam-cushioned wooden crates and fully insured freight directly to your job site or door.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#ebebeb] bg-white py-8 text-center text-xs text-[#787574]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#000000]">Shop.</span>
            <span>&bull; Precision Glass Fabrication System</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/admin" className="hover:text-[#000000] underline">
              Admin Gateway
            </Link>
            <Link href="/" className="hover:text-[#000000]">
              Terms of Service
            </Link>
            <Link href="/" className="hover:text-[#000000]">
              Fabrication Standards
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
