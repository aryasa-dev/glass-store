import { prisma } from "@/lib/prisma";
import { Calculator, Settings, Percent, Ruler, Shield, Plus } from "lucide-react";

export const instant = false;

export default async function AdminCalculatorRulesPage() {
  const rules = await prisma.calculatorRule.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#000000]">
            Calculator Rules & Formulas
          </h1>
          <p className="text-sm text-[#787574] mt-1">
            Dynamic pricing engines, waste overhead factors, and thickness grade multipliers.
          </p>
        </div>

        <button
          disabled
          className="px-4 py-2 rounded-full bg-[#5433eb]/40 text-white text-xs font-semibold flex items-center gap-2 cursor-not-allowed"
          title="Rule creation modal will be expanded in upcoming iterations"
        >
          <Plus className="w-4 h-4" />
          <span>New Rule</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {rules.map((rule) => {
          const thicknessMap = (rule.thicknessMultipliers as Record<string, number>) || {};

          return (
            <div
              key={rule.id}
              className="bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06),0_2px_4px_-2px_rgba(0,0,0,0.06)] border border-[#ebebeb]/60 space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#ebebeb]/70 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#000000]">{rule.name}</h2>
                    <p className="text-xs text-[#787574]">
                      Associated Product:{" "}
                      <span className="font-medium text-[#000000]">
                        {rule.product ? rule.product.name : "Global Rule (All Products)"}
                      </span>
                    </p>
                  </div>
                </div>

                <span className="self-start sm:self-auto text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active Formula
                </span>
              </div>

              {/* Formula Parameters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#f2f4f5]/60 border border-[#ebebeb]">
                  <div className="text-[11px] font-semibold text-[#787574] uppercase tracking-wider">
                    Base Price (m²)
                  </div>
                  <div className="text-xl font-bold text-[#000000] mt-1">
                    ${Number(rule.basePricePerSqm).toFixed(2)}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#f2f4f5]/60 border border-[#ebebeb]">
                  <div className="text-[11px] font-semibold text-[#787574] uppercase tracking-wider">
                    Min Area Threshold
                  </div>
                  <div className="text-xl font-bold text-[#000000] mt-1">
                    {rule.minAreaThreshold} m²
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#f2f4f5]/60 border border-[#ebebeb]">
                  <div className="text-[11px] font-semibold text-[#787574] uppercase tracking-wider">
                    Waste Factor
                  </div>
                  <div className="text-xl font-bold text-[#000000] mt-1">
                    {((rule.wasteFactor - 1) * 100).toFixed(0)}% ({rule.wasteFactor}x)
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#f2f4f5]/60 border border-[#ebebeb]">
                  <div className="text-[11px] font-semibold text-[#787574] uppercase tracking-wider">
                    Edge Polish / Unit
                  </div>
                  <div className="text-xl font-bold text-[#000000] mt-1">
                    ${Number(rule.edgePricePerMeter || 0).toFixed(2)} /m
                  </div>
                </div>
              </div>

              {/* Thickness Multipliers */}
              <div>
                <h3 className="text-xs font-semibold text-[#000000] uppercase tracking-wider mb-3">
                  Thickness Multiplier Matrix
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(thicknessMap).map(([thickness, multiplier]) => (
                    <div
                      key={thickness}
                      className="px-3.5 py-2 rounded-xl bg-white border border-[#ebebeb] text-xs font-medium shadow-sm flex items-center gap-2"
                    >
                      <span className="font-bold text-[#5433eb]">{thickness} mm:</span>
                      <span className="text-neutral-700">{multiplier}x base rate</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dimensional Constraints */}
              <div className="p-4 rounded-2xl bg-neutral-50 text-xs text-[#787574] flex flex-wrap gap-6">
                <div>
                  Min Width: <span className="font-semibold text-[#000000]">{rule.minWidthMm || 100} mm</span>
                </div>
                <div>
                  Max Width: <span className="font-semibold text-[#000000]">{rule.maxWidthMm || 3000} mm</span>
                </div>
                <div>
                  Min Height: <span className="font-semibold text-[#000000]">{rule.minHeightMm || 100} mm</span>
                </div>
                <div>
                  Max Height: <span className="font-semibold text-[#000000]">{rule.maxHeightMm || 2400} mm</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
