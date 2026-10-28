import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { CalculatorRulesClient } from "./CalculatorRulesClient";

export const instant = false;

export const metadata = {
  title: "Calculator Rules | Admin Control Center",
};

export default async function AdminCalculatorRulesPage() {
  await connection();
  const [rules, products] = await Promise.all([
    prisma.calculatorRule.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: { id: true, name: true },
        },
      },
    }),
    prisma.product.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const serializedRules = rules.map((r) => ({
    ...r,
    basePricePerSqm: Number(r.basePricePerSqm),
    edgePricePerMeter: r.edgePricePerMeter ? Number(r.edgePricePerMeter) : 0,
    holeDrillingPrice: r.holeDrillingPrice ? Number(r.holeDrillingPrice) : 0,
  }));

  return <CalculatorRulesClient initialRules={serializedRules} products={products} />;
}
