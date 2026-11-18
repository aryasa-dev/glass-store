import Link from "next/link";
import type { Metadata } from "next";
import { PublicNavbar } from "@/components/common/PublicNavbar";
import { PublicFooter } from "@/components/common/PublicFooter";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Our Glass Foundry",
  description:
    "Learn about our precision CNC cutting machinery, safety certifications, and commitment to architectural glazing excellence.",
  openGraph: {
    title: "About Our Glass Foundry | Shop.",
    description:
      "Precision CNC glass cutting, certified safety tempering, and direct-foundry architectural glazing code compliance.",
    url: "/about",
    images: [
      {
        url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Precision Architectural Glass Foundry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Our Glass Foundry | Shop.",
    description:
      "Precision CNC glass fabrication and architectural panel engineering.",
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&h=630&q=80",
    ],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f2f4f5] text-[#000000] flex flex-col justify-between">
      <PublicNavbar />

      <main className="space-y-16 sm:space-y-20 py-16 sm:py-20">
        {/* HERO SECTION */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-[#000000] border border-[#ebebeb] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <Sparkles className="w-3.5 h-3.5 text-[#5433eb]" />
              Founded on Craftsmanship &amp; Precision CNC Engineering
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#000000]">
              Pioneering Custom Glass &amp; Architectural Glazing
            </h1>

            <p className="text-base sm:text-lg text-[#787574] leading-relaxed">
              We bridge the gap between heavy industrial glass foundries and contemporary interior projects, delivering bespoke cut-to-size glass panels directly to residential builders, architects, and luxury homeowners.
            </p>
          </div>
        </section>

        {/* IMAGE & HERITAGE SHOWCASE */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06),0_2px_4px_-2px_rgba(0,0,0,0.06)] border-0 grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="p-8 sm:p-14 space-y-6">
              <span className="text-xs font-bold text-[#5433eb] uppercase tracking-wider">
                Our Heritage &amp; Equipment
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#000000]">
                CNC Diamond Wheels &amp; Advanced Convection Tempering Furnaces
              </h2>
              <p className="text-xs sm:text-sm text-[#787574] leading-relaxed">
                Every panel that leaves our production floor undergoes computerized laser-guided waterjet cutting, multi-stage diamond wheel edge polishing, and high-temperature thermal tempering. The result is structural glass with impeccable optical clarity, perfectly flat arrises, and certified shatter resistance.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "Toughened to 5x the structural strength of standard float glass",
                  "Sub-millimeter CNC tolerance on all dimensional cuts and notch cutouts",
                  "Polished flat and pencil edges standard across all custom products",
                  "Eco-conscious closed-loop water filtration and zero-waste glass recycling",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-neutral-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#5433eb] flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-full min-h-[360px] bg-[#f2f4f5] relative">
              <img
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
                alt="Glass fabrication workshop"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* STATS STRIP */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
            <div className="bg-white rounded-[28px] p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border-0 space-y-2">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#5433eb]">99.8%</div>
              <div className="text-xs font-semibold text-[#000000]">Dimensional Accuracy</div>
              <p className="text-[11px] text-[#787574]">Calibrated laser optics</p>
            </div>

            <div className="bg-white rounded-[28px] p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border-0 space-y-2">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#5433eb]">15,000+</div>
              <div className="text-xs font-semibold text-[#000000]">Panels Fabricated</div>
              <p className="text-[11px] text-[#787574]">For homes &amp; high-rises</p>
            </div>

            <div className="bg-white rounded-[28px] p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border-0 space-y-2">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#5433eb]">100%</div>
              <div className="text-xs font-semibold text-[#000000]">Transit Guarantee</div>
              <p className="text-[11px] text-[#787574]">Insured custom crates</p>
            </div>

            <div className="bg-white rounded-[28px] p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border-0 space-y-2">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#5433eb]">24 hr</div>
              <div className="text-xs font-semibold text-[#000000]">Drafting Turnaround</div>
              <p className="text-[11px] text-[#787574]">Fast CAD review</p>
            </div>
          </div>
        </section>

        {/* CTA TO CALCULATOR */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-[32px] p-8 sm:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-[#ebebeb] text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#000000]">
              Ready to calculate your custom dimensions?
            </h2>
            <p className="text-xs sm:text-sm text-[#787574] max-w-lg mx-auto">
              Use our live calculation engine to see immediate square-meter pricing with your preferred thickness and edge finishes.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/#calculator-section"
                className="h-12 px-8 rounded-full bg-[#5433eb] hover:bg-[#4527cd] text-white text-xs font-semibold shadow-[0_8px_24px_rgba(84,51,235,0.35)] transition-all flex items-center gap-2"
              >
                <span>Launch Sizing Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
