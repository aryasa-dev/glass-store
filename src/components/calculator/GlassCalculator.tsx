"use client";

import React, { useState, useMemo } from "react";
import { useCartStore } from "@/store/cartStore";
import {
  Calculator,
  ShoppingBag,
  Sparkles,
  Layers,
  Ruler,
  CheckCircle2,
  Info,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export interface ProductVariantOption {
  id: string;
  name: string;
  glassType: string | null;
  thicknessMm: number | null;
  priceAdjustment: number;
  stock: number;
  isAvailable: boolean;
}

export interface CalculatorRuleData {
  id: string;
  name: string;
  basePricePerSqm: number;
  minAreaThreshold: number;
  wasteFactor: number;
  thicknessMultipliers: Record<string, number> | null;
  minWidthMm: number | null;
  maxWidthMm: number | null;
  minHeightMm: number | null;
  maxHeightMm: number | null;
  edgePricePerMeter: number | null;
  holeDrillingPrice: number | null;
  isActive: boolean;
}

export interface GlassCalculatorProps {
  productId?: string;
  productName?: string;
  basePrice?: number;
  variants?: ProductVariantOption[];
  calculatorRule?: CalculatorRuleData | null;
  className?: string;
}

// Fallback defaults if no rule exists in database yet
const DEFAULT_CALCULATOR_RULE: CalculatorRuleData = {
  id: "default-rule",
  name: "Standard Glass Matrix",
  basePricePerSqm: 45.0,
  minAreaThreshold: 0.3, // Enforced minimum chargeable area: 0.3 m²
  wasteFactor: 1.15,
  thicknessMultipliers: {
    "4": 1.0,
    "6": 1.25,
    "8": 1.55,
    "10": 1.95,
    "12": 2.4,
  },
  minWidthMm: 100,
  maxWidthMm: 3000,
  minHeightMm: 100,
  maxHeightMm: 2400,
  edgePricePerMeter: 8.5,
  holeDrillingPrice: 12.0,
  isActive: true,
};

const DEFAULT_VARIANTS: ProductVariantOption[] = [
  {
    id: "v-clear-6",
    name: "Clear Float 6mm",
    glassType: "Clear Float",
    thicknessMm: 6,
    priceAdjustment: 0,
    stock: 100,
    isAvailable: true,
  },
  {
    id: "v-clear-8",
    name: "Clear Float 8mm",
    glassType: "Clear Float",
    thicknessMm: 8,
    priceAdjustment: 12.5,
    stock: 80,
    isAvailable: true,
  },
  {
    id: "v-clear-10",
    name: "Clear Float 10mm",
    glassType: "Clear Float",
    thicknessMm: 10,
    priceAdjustment: 25.0,
    stock: 50,
    isAvailable: true,
  },
  {
    id: "v-frosted-8",
    name: "Frosted Satin 8mm",
    glassType: "Frosted Satin",
    thicknessMm: 8,
    priceAdjustment: 30.0,
    stock: 40,
    isAvailable: true,
  },
];

export function GlassCalculator({
  productId = "cmvride1d0002ydt0ybig4xdf",
  productName = "Custom Cut Glass Panel",
  basePrice = 45.0,
  variants = DEFAULT_VARIANTS,
  calculatorRule = DEFAULT_CALCULATOR_RULE,
  className = "",
}: GlassCalculatorProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const rule = calculatorRule || DEFAULT_CALCULATOR_RULE;

  // Active available variants
  const availableVariants = variants.length > 0 ? variants : DEFAULT_VARIANTS;

  // Derive unique glass types
  const uniqueGlassTypes = useMemo(() => {
    const set = new Set<string>();
    availableVariants.forEach((v) => {
      if (v.glassType) set.add(v.glassType);
    });
    return Array.from(set).length > 0
      ? Array.from(set)
      : ["Clear Float", "Frosted Satin", "Low-Iron Ultra Clear"];
  }, [availableVariants]);

  // Form states
  const [unit, setUnit] = useState<"mm" | "cm">("mm");
  const [widthInput, setWidthInput] = useState<string>("800");
  const [heightInput, setHeightInput] = useState<string>("1200");
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedGlassType, setSelectedGlassType] = useState<string>(
    uniqueGlassTypes[0] || "Clear Float"
  );

  // Available thicknesses for selected glass type
  const availableThicknesses = useMemo(() => {
    const filtered = availableVariants.filter(
      (v) => !v.glassType || v.glassType === selectedGlassType
    );
    const thicknessList = filtered
      .map((v) => v.thicknessMm)
      .filter((t): t is number => t !== null && !isNaN(t));

    const unique = Array.from(new Set(thicknessList)).sort((a, b) => a - b);
    return unique.length > 0 ? unique : [6, 8, 10];
  }, [availableVariants, selectedGlassType]);

  const [selectedThickness, setSelectedThickness] = useState<number>(
    availableThicknesses[0] || 6
  );

  // Optional customizations
  const [edgePolishing, setEdgePolishing] = useState<boolean>(true);
  const [holesCount, setHolesCount] = useState<number>(0);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  // Sync selected thickness if previous thickness is unavailable in selected glass type
  React.useEffect(() => {
    if (!availableThicknesses.includes(selectedThickness)) {
      setSelectedThickness(availableThicknesses[0] || 6);
    }
  }, [availableThicknesses, selectedThickness]);

  // Dimensional conversions to mm
  const widthMm = useMemo(() => {
    const val = parseFloat(widthInput);
    if (isNaN(val) || val <= 0) return 0;
    return unit === "cm" ? val * 10 : val;
  }, [widthInput, unit]);

  const heightMm = useMemo(() => {
    const val = parseFloat(heightInput);
    if (isNaN(val) || val <= 0) return 0;
    return unit === "cm" ? val * 10 : val;
  }, [heightInput, unit]);

  // Validation limits
  const minW = rule.minWidthMm || 100;
  const maxW = rule.maxWidthMm || 3000;
  const minH = rule.minHeightMm || 100;
  const maxH = rule.maxHeightMm || 2400;

  const widthError = useMemo(() => {
    if (!widthInput || widthInput.trim() === "") return "Width is required";
    const val = parseFloat(widthInput);
    if (isNaN(val)) return "Please enter a valid numeric value";
    if (val <= 0) return "Dimension must be greater than zero";
    if (widthMm < minW)
      return `Minimum width is ${unit === "cm" ? minW / 10 + " cm" : minW + " mm"}`;
    if (widthMm > maxW)
      return `Maximum width is ${unit === "cm" ? maxW / 10 + " cm" : maxW + " mm"}`;
    return null;
  }, [widthInput, widthMm, minW, maxW, unit]);

  const heightError = useMemo(() => {
    if (!heightInput || heightInput.trim() === "") return "Height is required";
    const val = parseFloat(heightInput);
    if (isNaN(val)) return "Please enter a valid numeric value";
    if (val <= 0) return "Dimension must be greater than zero";
    if (heightMm < minH)
      return `Minimum height is ${unit === "cm" ? minH / 10 + " cm" : minH + " mm"}`;
    if (heightMm > maxH)
      return `Maximum height is ${unit === "cm" ? maxH / 10 + " cm" : maxH + " mm"}`;
    return null;
  }, [heightInput, heightMm, minH, maxH, unit]);

  const quantityError = useMemo(() => {
    if (!quantity || isNaN(quantity) || quantity <= 0)
      return "Quantity must be at least 1";
    if (quantity > 200)
      return "Maximum order per custom batch is 200 panels";
    return null;
  }, [quantity]);

  const isValid = !widthError && !heightError && !quantityError && widthMm > 0 && heightMm > 0;

  // Selected Variant lookup for price adjustment
  const activeVariant = useMemo(() => {
    return availableVariants.find(
      (v) =>
        v.glassType === selectedGlassType &&
        Number(v.thicknessMm) === Number(selectedThickness)
    );
  }, [availableVariants, selectedGlassType, selectedThickness]);

  // Calculations
  const actualAreaSqm = useMemo(() => {
    if (widthMm <= 0 || heightMm <= 0) return 0;
    return (widthMm / 1000) * (heightMm / 1000);
  }, [widthMm, heightMm]);

  // Minimum chargeable area threshold (e.g. 0.3 m²)
  const minChargeableArea = rule.minAreaThreshold || 0.3;
  const chargeableAreaSqm = Math.max(actualAreaSqm, minChargeableArea);

  // Multipliers
  const thicknessMultipliers = (rule.thicknessMultipliers as Record<
    string,
    number
  >) || {
    "4": 1.0,
    "6": 1.25,
    "8": 1.55,
    "10": 1.95,
    "12": 2.4,
  };

  const thicknessMultiplier =
    thicknessMultipliers[selectedThickness.toString()] || 1.0;
  const wasteFactor = rule.wasteFactor || 1.15;
  const ruleBasePrice = Number(rule.basePricePerSqm) || basePrice || 45.0;
  const variantAdjustment = Number(activeVariant?.priceAdjustment || 0);

  // Edge Perimeter (meters)
  const perimeterMeters = ((widthMm + heightMm) * 2) / 1000;
  const edgePricePerMeter = Number(rule.edgePricePerMeter || 8.5);
  const edgeCost = edgePolishing ? perimeterMeters * edgePricePerMeter : 0;

  // Hole Drilling Cost
  const holeDrillingPrice = Number(rule.holeDrillingPrice || 12.0);
  const holesCost = holesCount * holeDrillingPrice;

  // Unit Price Calculation
  const unitPrice = useMemo(() => {
    if (actualAreaSqm <= 0) return 0;
    const baseAreaCost =
      chargeableAreaSqm *
      (ruleBasePrice + variantAdjustment) *
      thicknessMultiplier *
      wasteFactor;

    return baseAreaCost + edgeCost + holesCost;
  }, [
    actualAreaSqm,
    chargeableAreaSqm,
    ruleBasePrice,
    variantAdjustment,
    thicknessMultiplier,
    wasteFactor,
    edgeCost,
    holesCost,
  ]);

  const totalEstimate = unitPrice * (quantity || 1);

  // Add to cart handler
  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    addItem({
      type: "custom_glass",
      productId,
      variantId: activeVariant?.id,
      name: productName,
      variantName:
        activeVariant?.name || `${selectedGlassType} ${selectedThickness}mm`,
      glassType: selectedGlassType,
      thicknessMm: selectedThickness,
      widthMm,
      heightMm,
      unit,
      actualAreaSqm,
      chargeableAreaSqm,
      unitPrice,
      quantity,
      edgePolishing,
      holesCount,
      customSpecifications: {
        unitUsed: unit,
        inputWidth: widthInput,
        inputHeight: heightInput,
        thicknessMultiplier,
        wasteFactor,
        minAreaThreshold: minChargeableArea,
        perimeterMeters: Number(perimeterMeters.toFixed(2)),
      },
    });

    setIsAdded(true);
    openCart();
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div
      className={`bg-white rounded-[28px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] border-0 p-6 sm:p-8 max-w-xl w-full mx-auto transition-all ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#ebebeb] pb-5 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2f4f5] text-[11px] font-semibold text-[#000000] mb-2 border border-[#ebebeb]">
            <Sparkles className="w-3.5 h-3.5 text-[#5433eb]" />
            <span>Instant Sizing Calculator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#000000]">
            Cut-to-Size Glass Pricing
          </h2>
          <p className="text-xs text-[#787574] mt-1">
            Precision custom cut to your exact millimetre or centimetre measurements.
          </p>
        </div>

        <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-[#5433eb]/10 text-[#5433eb] items-center justify-center">
          <Calculator className="w-6 h-6" />
        </div>
      </div>

      <form onSubmit={handleAddToCart} className="space-y-6">
        {/* Unit Selector */}
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider">
            Measurement Unit
          </label>
          <div className="inline-flex p-1 rounded-full bg-[#f2f4f5] border border-[#ebebeb]">
            <button
              type="button"
              onClick={() => setUnit("mm")}
              className={`px-4 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                unit === "mm"
                  ? "bg-white text-[#000000] shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                  : "text-[#787574] hover:text-[#000000]"
              }`}
            >
              Millimetres (mm)
            </button>
            <button
              type="button"
              onClick={() => setUnit("cm")}
              className={`px-4 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                unit === "cm"
                  ? "bg-white text-[#000000] shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                  : "text-[#787574] hover:text-[#000000]"
              }`}
            >
              Centimetres (cm)
            </button>
          </div>
        </div>

        {/* Dimension Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Width */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#000000]">
                Width ({unit}) *
              </label>
              <span className="text-[11px] text-[#787574]">
                {unit === "cm" ? `${minW / 10}–${maxW / 10} cm` : `${minW}–${maxW} mm`}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="any"
                required
                value={widthInput}
                onChange={(e) => setWidthInput(e.target.value)}
                placeholder={unit === "cm" ? "80" : "800"}
                className={`w-full h-12 px-5 rounded-full bg-white border text-sm text-[#000000] placeholder:text-[#787574] focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb] transition-all ${
                  widthError ? "border-red-400 bg-red-50/20" : "border-[#ebebeb]"
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#787574] pointer-events-none">
                {unit}
              </span>
            </div>
            {widthError && (
              <p className="text-[11px] text-red-500 font-medium px-2">
                {widthError}
              </p>
            )}
          </div>

          {/* Height */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#000000]">
                Height ({unit}) *
              </label>
              <span className="text-[11px] text-[#787574]">
                {unit === "cm" ? `${minH / 10}–${maxH / 10} cm` : `${minH}–${maxH} mm`}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="any"
                required
                value={heightInput}
                onChange={(e) => setHeightInput(e.target.value)}
                placeholder={unit === "cm" ? "120" : "1200"}
                className={`w-full h-12 px-5 rounded-full bg-white border text-sm text-[#000000] placeholder:text-[#787574] focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb] transition-all ${
                  heightError ? "border-red-400 bg-red-50/20" : "border-[#ebebeb]"
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#787574] pointer-events-none">
                {unit}
              </span>
            </div>
            {heightError && (
              <p className="text-[11px] text-red-500 font-medium px-2">
                {heightError}
              </p>
            )}
          </div>
        </div>

        {/* Glass Type & Thickness */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Glass Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#000000]">
              Glass Type *
            </label>
            <div className="relative">
              <select
                value={selectedGlassType}
                onChange={(e) => setSelectedGlassType(e.target.value)}
                className="w-full h-12 px-5 pr-10 rounded-full bg-white border border-[#ebebeb] text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb] appearance-none transition-all cursor-pointer"
              >
                {uniqueGlassTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#787574]">
                ▼
              </div>
            </div>
          </div>

          {/* Thickness Options */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#000000]">
              Thickness (mm) *
            </label>
            <div className="relative">
              <select
                value={selectedThickness}
                onChange={(e) => setSelectedThickness(Number(e.target.value))}
                className="w-full h-12 px-5 pr-10 rounded-full bg-white border border-[#ebebeb] text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb] appearance-none transition-all cursor-pointer"
              >
                {availableThicknesses.map((th) => (
                  <option key={th} value={th}>
                    {th} mm {th === 6 ? "(Standard)" : th === 10 ? "(Heavy Duty)" : ""}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#787574]">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Optional Treatments (Edge Polishing & Holes) */}
        <div className="p-4 rounded-2xl bg-[#f2f4f5]/60 border border-[#ebebeb] space-y-3">
          <div className="text-xs font-semibold text-[#000000] uppercase tracking-wider">
            Finishing & Fabrication
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer text-[#000000] font-medium">
              <input
                type="checkbox"
                checked={edgePolishing}
                onChange={(e) => setEdgePolishing(e.target.checked)}
                className="w-4 h-4 rounded text-[#5433eb] focus:ring-[#5433eb]"
              />
              <span>Flat Polish All Edges (+${edgePricePerMeter}/m)</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-[#787574]">Drilled Holes:</span>
              <div className="flex items-center gap-1.5">
                {[0, 2, 4, 6].map((num) => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setHolesCount(num)}
                    className={`w-7 h-7 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      holesCount === num
                        ? "bg-[#5433eb] text-white"
                        : "bg-white text-neutral-700 border border-[#ebebeb] hover:bg-neutral-100"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quantity and Area Summary */}
        <div className="flex items-center justify-between pt-1">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-[#000000]">
                Quantity:
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-full border border-[#ebebeb] bg-white flex items-center justify-center font-bold text-sm text-[#000000] hover:bg-[#f2f4f5] transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={quantity || ""}
                  onChange={(e) => {
                    const parsed = parseInt(e.target.value, 10);
                    setQuantity(isNaN(parsed) ? 0 : Math.max(0, Math.min(200, parsed)));
                  }}
                  className="w-12 text-center font-bold text-sm text-[#000000] bg-transparent border-0 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(200, q + 1))}
                  className="w-9 h-9 rounded-full border border-[#ebebeb] bg-white flex items-center justify-center font-bold text-sm text-[#000000] hover:bg-[#f2f4f5] transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            {quantityError && (
              <p className="text-[11px] text-red-500 font-medium">{quantityError}</p>
            )}
          </div>

          {/* Area Metric Badge */}
          <div className="text-right">
            <div className="text-xs font-semibold text-[#000000]">
              Area: {actualAreaSqm.toFixed(3)} m²
            </div>
            {actualAreaSqm > 0 && actualAreaSqm < minChargeableArea && (
              <div className="text-[10px] text-[#787574] font-medium flex items-center gap-1 justify-end">
                <Info className="w-3 h-3 text-[#5433eb]" />
                <span>Min. threshold {minChargeableArea} m² applies</span>
              </div>
            )}
          </div>
        </div>

        {/* Calculated Breakdown Card */}
        <div className="p-4 rounded-2xl bg-[#f2f4f5] border border-[#ebebeb] space-y-2">
          <div className="flex justify-between text-xs text-[#787574]">
            <span>Chargeable Area:</span>
            <span className="font-semibold text-[#000000]">
              {chargeableAreaSqm.toFixed(3)} m²{" "}
              {chargeableAreaSqm > actualAreaSqm && "(Minimum Charge Threshold)"}
            </span>
          </div>

          <div className="flex justify-between text-xs text-[#787574]">
            <span>Thickness Multiplier ({selectedThickness}mm):</span>
            <span className="font-semibold text-[#000000]">
              {thicknessMultiplier}x base rate
            </span>
          </div>

          {edgeCost > 0 && (
            <div className="flex justify-between text-xs text-[#787574]">
              <span>Edge Polishing ({perimeterMeters.toFixed(2)}m):</span>
              <span className="font-semibold text-[#000000]">
                +${edgeCost.toFixed(2)}
              </span>
            </div>
          )}

          {holesCost > 0 && (
            <div className="flex justify-between text-xs text-[#787574]">
              <span>Holes ({holesCount} drilled):</span>
              <span className="font-semibold text-[#000000]">
                +${holesCost.toFixed(2)}
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-[#ebebeb] flex items-baseline justify-between">
            <div>
              <span className="text-xs font-semibold text-[#787574] uppercase tracking-wider block">
                Calculated Estimate
              </span>
              <span className="text-[11px] text-neutral-500">
                ${unitPrice.toFixed(2)} / unit &bull; Incl. waste factor
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#000000]">
              ${totalEstimate.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={!isValid}
          className={`w-full h-13 rounded-full bg-[#5433eb] hover:bg-[#4527cd] text-white text-sm font-semibold shadow-[0_8px_24px_rgba(84,51,235,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            isAdded ? "bg-emerald-600 hover:bg-emerald-600" : ""
          }`}
        >
          {isAdded ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-white animate-bounce" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              <span>Add to Cart &bull; ${totalEstimate.toFixed(2)}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-[11px] text-[#787574] text-center pt-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Automated fabrication spec calculation &bull; Instant pricing</span>
        </div>
      </form>
    </div>
  );
}
