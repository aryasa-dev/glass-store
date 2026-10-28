"use client";

import { useState, useTransition } from "react";
import {
  createCalculatorRuleAction,
  updateCalculatorRuleAction,
  deleteCalculatorRuleAction,
} from "@/actions/calculator-rules";
import {
  Calculator,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  Percent,
  Ruler,
  DollarSign,
  Layers,
  HelpCircle,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
}

interface CalculatorRuleWithProduct {
  id: string;
  name: string;
  productId: string | null;
  product: Product | null;
  basePricePerSqm: any;
  minAreaThreshold: number;
  wasteFactor: number;
  thicknessMultipliers: any;
  minWidthMm: number | null;
  maxWidthMm: number | null;
  minHeightMm: number | null;
  maxHeightMm: number | null;
  edgePricePerMeter: any;
  holeDrillingPrice: any;
  isActive: boolean;
}

interface ThicknessRow {
  thickness: string;
  multiplier: string;
}

interface CalculatorRulesClientProps {
  initialRules: CalculatorRuleWithProduct[];
  products: Product[];
}

export function CalculatorRulesClient({
  initialRules,
  products,
}: CalculatorRulesClientProps) {
  const [rules, setRules] = useState(initialRules);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<CalculatorRuleWithProduct | null>(null);

  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [productId, setProductId] = useState("");
  const [basePricePerSqm, setBasePricePerSqm] = useState("45.00");
  const [minAreaThreshold, setMinAreaThreshold] = useState("0.25");
  const [wasteFactor, setWasteFactor] = useState("1.15");
  const [minWidthMm, setMinWidthMm] = useState("100");
  const [maxWidthMm, setMaxWidthMm] = useState("3000");
  const [minHeightMm, setMinHeightMm] = useState("100");
  const [maxHeightMm, setMaxHeightMm] = useState("2400");
  const [edgePricePerMeter, setEdgePricePerMeter] = useState("8.50");
  const [holeDrillingPrice, setHoleDrillingPrice] = useState("12.00");
  const [isActive, setIsActive] = useState(true);

  // Thickness Multipliers Rows
  const [thicknessRows, setThicknessRows] = useState<ThicknessRow[]>([
    { thickness: "4", multiplier: "1.00" },
    { thickness: "6", multiplier: "1.25" },
    { thickness: "8", multiplier: "1.55" },
    { thickness: "10", multiplier: "1.95" },
    { thickness: "12", multiplier: "2.40" },
  ]);

  const openCreateModal = () => {
    setEditingRule(null);
    setName("");
    setProductId("");
    setBasePricePerSqm("45.00");
    setMinAreaThreshold("0.25");
    setWasteFactor("1.15");
    setMinWidthMm("100");
    setMaxWidthMm("3000");
    setMinHeightMm("100");
    setMaxHeightMm("2400");
    setEdgePricePerMeter("8.50");
    setHoleDrillingPrice("12.00");
    setIsActive(true);
    setThicknessRows([
      { thickness: "4", multiplier: "1.00" },
      { thickness: "6", multiplier: "1.25" },
      { thickness: "8", multiplier: "1.55" },
      { thickness: "10", multiplier: "1.95" },
      { thickness: "12", multiplier: "2.40" },
    ]);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (rule: CalculatorRuleWithProduct) => {
    setEditingRule(rule);
    setName(rule.name);
    setProductId(rule.productId || "");
    setBasePricePerSqm(Number(rule.basePricePerSqm).toString());
    setMinAreaThreshold(rule.minAreaThreshold.toString());
    setWasteFactor(rule.wasteFactor.toString());
    setMinWidthMm(rule.minWidthMm ? rule.minWidthMm.toString() : "");
    setMaxWidthMm(rule.maxWidthMm ? rule.maxWidthMm.toString() : "");
    setMinHeightMm(rule.minHeightMm ? rule.minHeightMm.toString() : "");
    setMaxHeightMm(rule.maxHeightMm ? rule.maxHeightMm.toString() : "");
    setEdgePricePerMeter(rule.edgePricePerMeter ? Number(rule.edgePricePerMeter).toString() : "0");
    setHoleDrillingPrice(rule.holeDrillingPrice ? Number(rule.holeDrillingPrice).toString() : "0");
    setIsActive(rule.isActive);

    const map = (rule.thicknessMultipliers as Record<string, number>) || {};
    const rows = Object.entries(map).map(([thickness, multiplier]) => ({
      thickness,
      multiplier: multiplier.toString(),
    }));
    setThicknessRows(
      rows.length > 0
        ? rows
        : [
            { thickness: "6", multiplier: "1.00" },
            { thickness: "8", multiplier: "1.25" },
          ]
    );
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const addThicknessRow = () => {
    setThicknessRows((prev) => [...prev, { thickness: "", multiplier: "1.00" }]);
  };

  const removeThicknessRow = (index: number) => {
    setThicknessRows((prev) => prev.filter((_, i) => i !== index));
  };

  const updateThicknessRow = (
    index: number,
    field: "thickness" | "multiplier",
    value: string
  ) => {
    setThicknessRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    // Convert thickness rows to JSON object
    const multipliersObj: Record<string, number> = {};
    thicknessRows.forEach((r) => {
      const t = r.thickness.trim();
      const m = parseFloat(r.multiplier);
      if (t && !isNaN(m)) {
        multipliersObj[t] = m;
      }
    });

    const formData = new FormData();
    formData.append("name", name);
    formData.append("productId", productId);
    formData.append("basePricePerSqm", basePricePerSqm);
    formData.append("minAreaThreshold", minAreaThreshold);
    formData.append("wasteFactor", wasteFactor);
    formData.append("minWidthMm", minWidthMm);
    formData.append("maxWidthMm", maxWidthMm);
    formData.append("minHeightMm", minHeightMm);
    formData.append("maxHeightMm", maxHeightMm);
    formData.append("edgePricePerMeter", edgePricePerMeter);
    formData.append("holeDrillingPrice", holeDrillingPrice);
    formData.append("isActive", String(isActive));
    formData.append("thicknessMultipliers", JSON.stringify(multipliersObj));

    startTransition(async () => {
      let res;
      if (editingRule) {
        res = await updateCalculatorRuleAction(editingRule.id, formData);
      } else {
        res = await createCalculatorRuleAction(formData);
      }

      if (!res.success) {
        setErrorMessage(res.error || "An error occurred.");
      } else {
        setIsModalOpen(false);
        window.location.reload();
      }
    });
  };

  const handleDeleteRule = async (id: string, ruleName: string) => {
    if (!confirm(`Are you sure you want to delete rule "${ruleName}"?`)) return;

    startTransition(async () => {
      const res = await deleteCalculatorRuleAction(id);
      if (!res.success) {
        alert(res.error || "Failed to delete calculator rule.");
      } else {
        setRules((prev) => prev.filter((r) => r.id !== id));
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#000000]">
            Calculator Rules & Pricing
          </h1>
          <p className="text-sm text-[#787574] mt-1">
            Configure m² base rates, cutting waste factors, and thickness grading multipliers.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-full bg-[#5433eb] hover:bg-[#4527cd] text-white text-xs font-semibold shadow-[0_4px_24px_rgba(69,36,219,0.34)] transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Pricing Rule</span>
        </button>
      </div>

      {/* Rules List */}
      {rules.length === 0 ? (
        <div className="bg-white rounded-[28px] p-12 text-center text-sm text-[#787574] border border-[#ebebeb]/60">
          No calculator rules configured yet. Click "New Pricing Rule" to add one.
        </div>
      ) : (
        <div className="space-y-6">
          {rules.map((rule) => {
            const thicknessMap =
              (rule.thicknessMultipliers as Record<string, number>) || {};

            return (
              <div
                key={rule.id}
                className="bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06),0_2px_4px_-2px_rgba(0,0,0,0.06)] border border-[#ebebeb]/60 space-y-6 hover:border-[#5433eb]/30 transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb]/60 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-[20px] bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                      <Calculator className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-[#000000]">
                          {rule.name}
                        </h2>
                        {rule.isActive ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                            Active Formula
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[11px] font-semibold border border-neutral-200">
                            Disabled
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#787574] mt-0.5">
                        Assigned To:{" "}
                        <span className="font-semibold text-neutral-800">
                          {rule.product ? rule.product.name : "Global Default (All Products)"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(rule)}
                      className="px-3.5 py-1.5 rounded-full border border-[#ebebeb] text-xs font-semibold text-neutral-700 hover:bg-[#f2f4f5] transition-colors flex items-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Rule</span>
                    </button>
                    <button
                      onClick={() => handleDeleteRule(rule.id, rule.name)}
                      className="px-3.5 py-1.5 rounded-full border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Primary Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-[20px] bg-[#f2f4f5]/60 border border-[#ebebeb]">
                    <div className="text-[11px] font-semibold text-[#787574] uppercase tracking-wider">
                      Base Rate / m²
                    </div>
                    <div className="text-xl font-black text-[#000000] mt-1">
                      ${Number(rule.basePricePerSqm).toFixed(2)}
                    </div>
                  </div>

                  <div className="p-4 rounded-[20px] bg-[#f2f4f5]/60 border border-[#ebebeb]">
                    <div className="text-[11px] font-semibold text-[#787574] uppercase tracking-wider">
                      Min Area Threshold
                    </div>
                    <div className="text-xl font-black text-[#000000] mt-1">
                      {rule.minAreaThreshold} m²
                    </div>
                  </div>

                  <div className="p-4 rounded-[20px] bg-[#f2f4f5]/60 border border-[#ebebeb]">
                    <div className="text-[11px] font-semibold text-[#787574] uppercase tracking-wider">
                      Waste Overhead
                    </div>
                    <div className="text-xl font-black text-[#000000] mt-1">
                      {((rule.wasteFactor - 1) * 100).toFixed(0)}%{" "}
                      <span className="text-xs font-normal text-neutral-500">
                        ({rule.wasteFactor}x)
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-[20px] bg-[#f2f4f5]/60 border border-[#ebebeb]">
                    <div className="text-[11px] font-semibold text-[#787574] uppercase tracking-wider">
                      Edge Polish Rate
                    </div>
                    <div className="text-xl font-black text-[#000000] mt-1">
                      ${Number(rule.edgePricePerMeter || 0).toFixed(2)}{" "}
                      <span className="text-xs font-normal text-neutral-500">/m</span>
                    </div>
                  </div>
                </div>

                {/* Thickness Multiplier Matrix */}
                <div>
                  <div className="text-xs font-semibold text-[#000000] uppercase tracking-wider mb-2.5">
                    Thickness Multipliers ({Object.keys(thicknessMap).length} configured)
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {Object.entries(thicknessMap).map(([thickness, multiplier]) => (
                      <div
                        key={thickness}
                        className="px-3.5 py-2 rounded-xl bg-white border border-[#ebebeb] text-xs font-medium shadow-sm flex items-center gap-2"
                      >
                        <span className="font-bold text-[#5433eb]">{thickness} mm:</span>
                        <span className="text-neutral-700 font-semibold">{multiplier}x rate</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Machine Limits */}
                <div className="p-4 rounded-2xl bg-[#f2f4f5]/60 text-xs text-[#787574] flex flex-wrap items-center justify-between gap-4">
                  <div>
                    Cutting Limits:{" "}
                    <span className="font-semibold text-[#000000]">
                      {rule.minWidthMm || 100}mm – {rule.maxWidthMm || 3000}mm W
                    </span>{" "}
                    &bull;{" "}
                    <span className="font-semibold text-[#000000]">
                      {rule.minHeightMm || 100}mm – {rule.maxHeightMm || 2400}mm H
                    </span>
                  </div>
                  <div>
                    Hole Drilling:{" "}
                    <span className="font-semibold text-[#000000]">
                      ${Number(rule.holeDrillingPrice || 0).toFixed(2)}
                    </span>{" "}
                    per hole
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Dialog for Create & Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-2xl w-full p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-[#ebebeb] space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#ebebeb] pb-4">
              <h2 className="text-lg font-bold text-[#000000]">
                {editingRule ? "Edit Pricing Rule" : "Create Pricing Rule"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-[#f2f4f5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Rule Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Architectural Tempered Formula"
                    className="w-full h-11 px-4 rounded-full border border-[#ebebeb] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Assign to Specific Product
                  </label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full h-11 px-4 rounded-full border border-[#ebebeb] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb]"
                  >
                    <option value="">Global Default (All Products)</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Base Rate ($/m²) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={basePricePerSqm}
                    onChange={(e) => setBasePricePerSqm(e.target.value)}
                    placeholder="45.00"
                    className="w-full h-11 px-4 rounded-full border border-[#ebebeb] bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Min Area (m²) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={minAreaThreshold}
                    onChange={(e) => setMinAreaThreshold(e.target.value)}
                    placeholder="0.25"
                    className="w-full h-11 px-4 rounded-full border border-[#ebebeb] bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Waste Factor (e.g. 1.15) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={wasteFactor}
                    onChange={(e) => setWasteFactor(e.target.value)}
                    placeholder="1.15"
                    className="w-full h-11 px-4 rounded-full border border-[#ebebeb] bg-white text-sm"
                  />
                </div>
              </div>

              {/* Edge Polish & Hole Drilling */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Edge Polishing Price ($/linear meter)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={edgePricePerMeter}
                    onChange={(e) => setEdgePricePerMeter(e.target.value)}
                    placeholder="8.50"
                    className="w-full h-11 px-4 rounded-full border border-[#ebebeb] bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Hole Drilling Price ($/hole)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={holeDrillingPrice}
                    onChange={(e) => setHoleDrillingPrice(e.target.value)}
                    placeholder="12.00"
                    className="w-full h-11 px-4 rounded-full border border-[#ebebeb] bg-white text-sm"
                  />
                </div>
              </div>

              {/* Min/Max Constraints */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Min Width (mm)
                  </label>
                  <input
                    type="number"
                    value={minWidthMm}
                    onChange={(e) => setMinWidthMm(e.target.value)}
                    className="w-full h-10 px-3 rounded-full border border-[#ebebeb] bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Max Width (mm)
                  </label>
                  <input
                    type="number"
                    value={maxWidthMm}
                    onChange={(e) => setMaxWidthMm(e.target.value)}
                    className="w-full h-10 px-3 rounded-full border border-[#ebebeb] bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Min Height (mm)
                  </label>
                  <input
                    type="number"
                    value={minHeightMm}
                    onChange={(e) => setMinHeightMm(e.target.value)}
                    className="w-full h-10 px-3 rounded-full border border-[#ebebeb] bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Max Height (mm)
                  </label>
                  <input
                    type="number"
                    value={maxHeightMm}
                    onChange={(e) => setMaxHeightMm(e.target.value)}
                    className="w-full h-10 px-3 rounded-full border border-[#ebebeb] bg-white text-xs"
                  />
                </div>
              </div>

              {/* Dynamic Thickness Multipliers Section */}
              <div className="p-4 rounded-2xl bg-[#f2f4f5]/60 border border-[#ebebeb] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[#000000] uppercase tracking-wider">
                      Thickness Multipliers Matrix
                    </h3>
                    <p className="text-[11px] text-[#787574]">
                      Multiply the base m² rate depending on glass thickness.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addThicknessRow}
                    className="px-3 py-1 rounded-full bg-white border border-[#ebebeb] text-xs font-semibold hover:bg-neutral-100 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Row</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {thicknessRows.map((row, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          required
                          value={row.thickness}
                          onChange={(e) =>
                            updateThicknessRow(index, "thickness", e.target.value)
                          }
                          placeholder="Thickness (e.g. 6)"
                          className="w-full h-9 px-3 rounded-full border border-[#ebebeb] bg-white text-xs"
                        />
                        <span className="text-xs text-neutral-500 font-medium">mm</span>
                      </div>

                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="number"
                          step="0.05"
                          required
                          value={row.multiplier}
                          onChange={(e) =>
                            updateThicknessRow(index, "multiplier", e.target.value)
                          }
                          placeholder="Multiplier (e.g. 1.25)"
                          className="w-full h-9 px-3 rounded-full border border-[#ebebeb] bg-white text-xs"
                        />
                        <span className="text-xs text-neutral-500 font-medium">x</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeThicknessRow(index)}
                        disabled={thicknessRows.length <= 1}
                        className="p-1.5 rounded-full text-red-500 hover:bg-red-50 disabled:opacity-30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-[#5433eb]"
                />
                <label
                  htmlFor="isActive"
                  className="text-xs font-semibold text-neutral-800 cursor-pointer"
                >
                  Formula is actively used for pricing calculations
                </label>
              </div>

              <div className="pt-4 border-t border-[#ebebeb] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-[#ebebeb] text-xs font-semibold text-neutral-700 hover:bg-[#f2f4f5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 rounded-full bg-[#5433eb] hover:bg-[#4527cd] text-white text-xs font-semibold shadow-[0_4px_24px_rgba(69,36,219,0.34)] transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingRule ? "Save Changes" : "Create Formula"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
