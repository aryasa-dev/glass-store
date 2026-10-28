"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export interface ActionResponse {
  success: boolean;
  error?: string;
}

export async function createCalculatorRuleAction(
  formData: FormData
): Promise<ActionResponse> {
  await requireAdmin();

  const name = formData.get("name")?.toString().trim();
  const productId = formData.get("productId")?.toString().trim() || null;
  const basePricePerSqm = parseFloat(formData.get("basePricePerSqm")?.toString() || "0");
  const minAreaThreshold = parseFloat(formData.get("minAreaThreshold")?.toString() || "0.25");
  const wasteFactor = parseFloat(formData.get("wasteFactor")?.toString() || "1.10");
  const minWidthMm = parseFloat(formData.get("minWidthMm")?.toString() || "");
  const maxWidthMm = parseFloat(formData.get("maxWidthMm")?.toString() || "");
  const minHeightMm = parseFloat(formData.get("minHeightMm")?.toString() || "");
  const maxHeightMm = parseFloat(formData.get("maxHeightMm")?.toString() || "");
  const edgePricePerMeter = parseFloat(formData.get("edgePricePerMeter")?.toString() || "0");
  const holeDrillingPrice = parseFloat(formData.get("holeDrillingPrice")?.toString() || "0");
  const isActive = formData.get("isActive") === "on" || formData.get("isActive") === "true";

  const rawMultipliers = formData.get("thicknessMultipliers")?.toString().trim() || "{}";
  let thicknessMultipliers: Record<string, number> = {};
  try {
    thicknessMultipliers = JSON.parse(rawMultipliers);
  } catch {
    return { success: false, error: "Invalid JSON format for thickness multipliers." };
  }

  if (!name) {
    return { success: false, error: "Rule name is required." };
  }

  try {
    await prisma.calculatorRule.create({
      data: {
        name,
        productId: productId || null,
        basePricePerSqm: isNaN(basePricePerSqm) ? 0 : basePricePerSqm,
        minAreaThreshold: isNaN(minAreaThreshold) ? 0.25 : minAreaThreshold,
        wasteFactor: isNaN(wasteFactor) ? 1.10 : wasteFactor,
        thicknessMultipliers,
        minWidthMm: isNaN(minWidthMm) ? null : minWidthMm,
        maxWidthMm: isNaN(maxWidthMm) ? null : maxWidthMm,
        minHeightMm: isNaN(minHeightMm) ? null : minHeightMm,
        maxHeightMm: isNaN(maxHeightMm) ? null : maxHeightMm,
        edgePricePerMeter: isNaN(edgePricePerMeter) ? 0 : edgePricePerMeter,
        holeDrillingPrice: isNaN(holeDrillingPrice) ? 0 : holeDrillingPrice,
        isActive,
      },
    });

    revalidatePath("/admin/calculator-rules");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error creating calculator rule:", error);
    return { success: false, error: "Failed to create calculator rule." };
  }
}

export async function updateCalculatorRuleAction(
  id: string,
  formData: FormData
): Promise<ActionResponse> {
  await requireAdmin();

  const name = formData.get("name")?.toString().trim();
  const productId = formData.get("productId")?.toString().trim() || null;
  const basePricePerSqm = parseFloat(formData.get("basePricePerSqm")?.toString() || "0");
  const minAreaThreshold = parseFloat(formData.get("minAreaThreshold")?.toString() || "0.25");
  const wasteFactor = parseFloat(formData.get("wasteFactor")?.toString() || "1.10");
  const minWidthMm = parseFloat(formData.get("minWidthMm")?.toString() || "");
  const maxWidthMm = parseFloat(formData.get("maxWidthMm")?.toString() || "");
  const minHeightMm = parseFloat(formData.get("minHeightMm")?.toString() || "");
  const maxHeightMm = parseFloat(formData.get("maxHeightMm")?.toString() || "");
  const edgePricePerMeter = parseFloat(formData.get("edgePricePerMeter")?.toString() || "0");
  const holeDrillingPrice = parseFloat(formData.get("holeDrillingPrice")?.toString() || "0");
  const isActive = formData.get("isActive") === "on" || formData.get("isActive") === "true";

  const rawMultipliers = formData.get("thicknessMultipliers")?.toString().trim() || "{}";
  let thicknessMultipliers: Record<string, number> = {};
  try {
    thicknessMultipliers = JSON.parse(rawMultipliers);
  } catch {
    return { success: false, error: "Invalid JSON format for thickness multipliers." };
  }

  if (!name) {
    return { success: false, error: "Rule name is required." };
  }

  try {
    await prisma.calculatorRule.update({
      where: { id },
      data: {
        name,
        productId: productId || null,
        basePricePerSqm: isNaN(basePricePerSqm) ? 0 : basePricePerSqm,
        minAreaThreshold: isNaN(minAreaThreshold) ? 0.25 : minAreaThreshold,
        wasteFactor: isNaN(wasteFactor) ? 1.10 : wasteFactor,
        thicknessMultipliers,
        minWidthMm: isNaN(minWidthMm) ? null : minWidthMm,
        maxWidthMm: isNaN(maxWidthMm) ? null : maxWidthMm,
        minHeightMm: isNaN(minHeightMm) ? null : minHeightMm,
        maxHeightMm: isNaN(maxHeightMm) ? null : maxHeightMm,
        edgePricePerMeter: isNaN(edgePricePerMeter) ? 0 : edgePricePerMeter,
        holeDrillingPrice: isNaN(holeDrillingPrice) ? 0 : holeDrillingPrice,
        isActive,
      },
    });

    revalidatePath("/admin/calculator-rules");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating calculator rule:", error);
    return { success: false, error: "Failed to update calculator rule." };
  }
}

export async function deleteCalculatorRuleAction(id: string): Promise<ActionResponse> {
  await requireAdmin();

  try {
    await prisma.calculatorRule.delete({
      where: { id },
    });

    revalidatePath("/admin/calculator-rules");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting calculator rule:", error);
    return { success: false, error: "Failed to delete calculator rule." };
  }
}
