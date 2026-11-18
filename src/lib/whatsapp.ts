export interface WhatsAppOrderInput {
  orderNumber: string;
  customerName: string;
  customerPhone?: string | null;
  shippingAddress?: string | null;
  notes?: string | null;
  subtotal: number;
  tax: number;
  shippingCost: number;
  totalAmount: number;
  items: Array<{
    name: string;
    variantName?: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    widthMm?: number | null;
    heightMm?: number | null;
    calculatedAreaSqm?: number | null;
    customSpecifications?: unknown;
  }>;
}

export function generateWhatsAppOrderUrl({
  orderNumber,
  customerName,
  customerPhone,
  shippingAddress,
  notes,
  subtotal,
  tax,
  shippingCost,
  totalAmount,
  items,
}: WhatsAppOrderInput): string {
  const targetPhone = (
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE ||
    process.env.WHATSAPP_PHONE ||
    "+15550192834"
  ).replace(/[^0-9]/g, "");

  const lines: string[] = [];
  lines.push(`✨ *NEW ARCHITECTURAL GLASS ORDER* ✨`);
  lines.push(`*Order No:* ${orderNumber}`);
  lines.push(``);
  lines.push(`*👤 CUSTOMER DETAILS:*`);
  lines.push(`• Name: ${customerName}`);
  if (customerPhone) lines.push(`• Phone: ${customerPhone}`);
  if (shippingAddress) lines.push(`• Shipping/Site Address: ${shippingAddress}`);
  if (notes) lines.push(`• Site Instructions: ${notes}`);
  lines.push(``);
  lines.push(`*📦 ITEM SPECIFICATIONS:*`);

  items.forEach((item, index) => {
    const itemTitle = item.variantName
      ? `${item.name} (${item.variantName})`
      : item.name;
    lines.push(`${index + 1}. *${itemTitle}*`);

    if (item.widthMm && item.heightMm) {
      const area = item.calculatedAreaSqm
        ? ` (${Number(item.calculatedAreaSqm).toFixed(3)} m²)`
        : "";
      lines.push(`   📐 Dimensions: ${item.widthMm} × ${item.heightMm} mm${area}`);
    }

    if (item.customSpecifications) {
      const specs = item.customSpecifications as Record<string, unknown>;
      const details: string[] = [];
      if (specs.edgePolishing) details.push("Flat Polished Edges");
      if (typeof specs.holesCount === "number" && specs.holesCount > 0)
        details.push(`${specs.holesCount} Drilled Holes`);
      if (typeof specs.thicknessMultiplier === "number" && specs.thicknessMultiplier > 1)
        details.push(`Thickness Multiplier: ${specs.thicknessMultiplier}x`);
      if (specs.note && typeof specs.note === "string") details.push(specs.note);
      if (details.length > 0) {
        lines.push(`   ⚙️ Specs: ${details.join(", ")}`);
      }
    }

    lines.push(
      `   💵 Qty: ${item.quantity} × $${Number(item.unitPrice).toFixed(2)} = *$${Number(item.totalPrice).toFixed(2)}*`
    );
  });

  lines.push(``);
  lines.push(`*💰 FINANCIAL SUMMARY:*`);
  lines.push(`• Fabrication Subtotal: $${subtotal.toFixed(2)}`);
  lines.push(
    `• Freight / Crating: ${
      shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`
    }`
  );
  lines.push(`• Estimated Tax (8%): $${tax.toFixed(2)}`);
  lines.push(`• *Total Amount:* *$${totalAmount.toFixed(2)}*`);
  lines.push(``);
  lines.push(
    `Please confirm fabrication scheduling and CAD tolerance verification.`
  );

  const message = lines.join("\n");
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}
