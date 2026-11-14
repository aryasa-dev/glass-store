import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role, OrderStatus } from "@prisma/client";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding rich catalog data...");

  // 1. Create Admin User
  const adminPasswordHash = "$2b$10$t.9jUq33atGF8vTg8uolr.MAlfjj2Iv.cM8KDqZ8qv0SYiN2PY.Bm"; // admin123
  await prisma.user.upsert({
    where: { email: "admin@store.local" },
    update: {
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
    create: {
      email: "admin@store.local",
      name: "Store Administrator",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
  });

  // 2. Categories
  const catCustom = await prisma.category.upsert({
    where: { slug: "custom-glass" },
    update: {
      imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    },
    create: {
      name: "Custom Cut Glass",
      slug: "custom-glass",
      description: "Precision-cut custom architectural and interior safety glass panels.",
      imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    },
  });

  const catMirrors = await prisma.category.upsert({
    where: { slug: "mirrors" },
    update: {
      imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    },
    create: {
      name: "Architectural Mirrors",
      slug: "mirrors",
      description: "High-definition custom silver and bronze wall, gym, and vanity mirrors.",
      imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    },
  });

  const catShowers = await prisma.category.upsert({
    where: { slug: "shower-screens" },
    update: {
      imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    },
    create: {
      name: "Shower Enclosures",
      slug: "shower-screens",
      description: "Frameless heavy-tempered glass shower screens and splashback panels.",
      imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    },
  });

  const catTabletops = await prisma.category.upsert({
    where: { slug: "table-tops" },
    update: {
      imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
    },
    create: {
      name: "Glass Table Tops",
      slug: "table-tops",
      description: "Beveled edge protective dining, conference, and coffee table covers.",
      imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
    },
  });

  // 3. Products
  // Product 1: Tempered Glass Panel
  const p1 = await prisma.product.upsert({
    where: { slug: "tempered-glass-panel" },
    update: {
      imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    },
    create: {
      name: "Tempered Safety Glass Panel",
      slug: "tempered-glass-panel",
      description: "Toughened safety glass panel engineered for partitions, shelves, guards, and balustrades.",
      basePrice: 45.0,
      imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      categoryId: catCustom.id,
      isCustomizable: true,
      variants: {
        create: [
          { name: "Clear Float 6mm", sku: "GLS-CLR-6MM", glassType: "Clear Float", thicknessMm: 6.0, priceAdjustment: 0.0, stock: 100 },
          { name: "Clear Float 8mm", sku: "GLS-CLR-8MM", glassType: "Clear Float", thicknessMm: 8.0, priceAdjustment: 12.5, stock: 80 },
          { name: "Clear Float 10mm", sku: "GLS-CLR-10MM", glassType: "Clear Float", thicknessMm: 10.0, priceAdjustment: 25.0, stock: 60 },
          { name: "Frosted Satin 8mm", sku: "GLS-FROST-8MM", glassType: "Frosted Satin", thicknessMm: 8.0, priceAdjustment: 30.0, stock: 40 },
        ],
      },
      calculatorRules: {
        create: {
          name: "Standard Tempered Glass Calculator",
          basePricePerSqm: 45.0,
          minAreaThreshold: 0.25,
          wasteFactor: 1.15,
          thicknessMultipliers: { "4": 1.0, "6": 1.25, "8": 1.55, "10": 1.95, "12": 2.4 },
          minWidthMm: 100,
          maxWidthMm: 3000,
          minHeightMm: 100,
          maxHeightMm: 2400,
          edgePricePerMeter: 8.5,
          holeDrillingPrice: 12.0,
        },
      },
    },
  });

  // Product 2: Ultra-Clear Low-Iron Glass
  await prisma.product.upsert({
    where: { slug: "low-iron-glass-panel" },
    update: {
      imageUrl: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
    },
    create: {
      name: "Low-Iron Ultra-Clear Glass",
      slug: "low-iron-glass-panel",
      description: "Optically pure crystal glass with near-zero greenish tint, ideal for luxury retail and display cases.",
      basePrice: 65.0,
      imageUrl: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
      categoryId: catCustom.id,
      isCustomizable: true,
      variants: {
        create: [
          { name: "Low-Iron 8mm", sku: "LI-8MM", glassType: "Low-Iron Crystal", thicknessMm: 8.0, priceAdjustment: 0.0, stock: 50 },
          { name: "Low-Iron 10mm", sku: "LI-10MM", glassType: "Low-Iron Crystal", thicknessMm: 10.0, priceAdjustment: 20.0, stock: 45 },
          { name: "Low-Iron 12mm", sku: "LI-12MM", glassType: "Low-Iron Crystal", thicknessMm: 12.0, priceAdjustment: 38.0, stock: 30 },
        ],
      },
    },
  });

  // Product 3: Frameless Shower Screen
  await prisma.product.upsert({
    where: { slug: "frameless-shower-screen" },
    update: {
      imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    },
    create: {
      name: "Frameless Walk-in Shower Screen",
      slug: "frameless-shower-screen",
      description: "10mm toughened easy-clean nano-coated safety glass screen with polished chrome bracket cutouts.",
      basePrice: 85.0,
      imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
      categoryId: catShowers.id,
      isCustomizable: true,
      variants: {
        create: [
          { name: "Clear 10mm Shower Glass", sku: "SHW-10MM", glassType: "Clear Toughened", thicknessMm: 10.0, priceAdjustment: 0.0, stock: 35 },
          { name: "Fluted Reeded 10mm", sku: "SHW-FLUTE-10", glassType: "Fluted Reeded", thicknessMm: 10.0, priceAdjustment: 45.0, stock: 20 },
        ],
      },
    },
  });

  // Product 4: Polished Silver Mirror
  await prisma.product.upsert({
    where: { slug: "custom-cut-mirror" },
    update: {
      imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    },
    create: {
      name: "High-Definition Silver Mirror",
      slug: "custom-cut-mirror",
      description: "Distortion-free copper-free backing mirror tailored for bathrooms, gym studios, and luxury wardrobes.",
      basePrice: 50.0,
      imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
      categoryId: catMirrors.id,
      isCustomizable: true,
      variants: {
        create: [
          { name: "Silver Float 5mm", sku: "MIR-5MM", glassType: "Silver Mirror", thicknessMm: 5.0, priceAdjustment: 0.0, stock: 70 },
          { name: "Bronze Tinted 6mm", sku: "MIR-BRZ-6MM", glassType: "Bronze Mirror", thicknessMm: 6.0, priceAdjustment: 22.0, stock: 30 },
          { name: "Grey Smoked 6mm", sku: "MIR-GRY-6MM", glassType: "Grey Smoke Mirror", thicknessMm: 6.0, priceAdjustment: 25.0, stock: 25 },
        ],
      },
    },
  });

  // Product 5: Round Glass Table Top
  await prisma.product.upsert({
    where: { slug: "beveled-glass-table-top" },
    update: {
      imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
    },
    create: {
      name: "Beveled Round Glass Table Top",
      slug: "beveled-glass-table-top",
      description: "25mm beveled perimeter edge protector table top fabricated in heavy-duty impact-resistant clear glass.",
      basePrice: 70.0,
      imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
      categoryId: catTabletops.id,
      isCustomizable: true,
      variants: {
        create: [
          { name: "Clear 8mm Beveled", sku: "TBL-8MM", glassType: "Clear Float", thicknessMm: 8.0, priceAdjustment: 0.0, stock: 40 },
          { name: "Clear 12mm Heavy Beveled", sku: "TBL-12MM", glassType: "Clear Float", thicknessMm: 12.0, priceAdjustment: 35.0, stock: 25 },
        ],
      },
    },
  });

  console.log("Rich catalog seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
