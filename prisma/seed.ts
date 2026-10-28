import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role, OrderStatus } from "@prisma/client";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // 1. Create Admin User
  const adminPasswordHash = "$2b$10$t.9jUq33atGF8vTg8uolr.MAlfjj2Iv.cM8KDqZ8qv0SYiN2PY.Bm"; // admin123
  const admin = await prisma.user.upsert({
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
  console.log(`Created admin user: ${admin.email}`);

  // 2. Create Category
  const category = await prisma.category.upsert({
    where: { slug: "custom-glass" },
    update: {},
    create: {
      name: "Custom Cut Glass",
      slug: "custom-glass",
      description: "Precision-cut custom architectural and interior glass panels.",
    },
  });
  console.log(`Created category: ${category.name}`);

  // 3. Create Product
  const product = await prisma.product.upsert({
    where: { slug: "tempered-glass-panel" },
    update: {},
    create: {
      name: "Tempered Glass Panel",
      slug: "tempered-glass-panel",
      description: "Toughened safety glass ideal for table tops, partitions, shelves, and showers.",
      basePrice: 45.0,
      categoryId: category.id,
      isCustomizable: true,
      variants: {
        create: [
          {
            name: "Clear Float 6mm",
            sku: "GLS-CLR-6MM",
            glassType: "Clear Float",
            thicknessMm: 6.0,
            priceAdjustment: 0.0,
            stock: 100,
          },
          {
            name: "Clear Float 8mm",
            sku: "GLS-CLR-8MM",
            glassType: "Clear Float",
            thicknessMm: 8.0,
            priceAdjustment: 12.5,
            stock: 80,
          },
          {
            name: "Clear Float 10mm",
            sku: "GLS-CLR-10MM",
            glassType: "Clear Float",
            thicknessMm: 10.0,
            priceAdjustment: 25.0,
            stock: 60,
          },
          {
            name: "Frosted Satin 8mm",
            sku: "GLS-FROST-8MM",
            glassType: "Frosted Satin",
            thicknessMm: 8.0,
            priceAdjustment: 30.0,
            stock: 40,
          },
        ],
      },
      calculatorRules: {
        create: {
          name: "Standard Tempered Glass Calculator",
          basePricePerSqm: 45.0,
          minAreaThreshold: 0.25,
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
        },
      },
    },
  });
  console.log(`Created product: ${product.name}`);

  // 4. Sample Order
  const sampleOrder = await prisma.order.upsert({
    where: { orderNumber: "ORD-2026-0001" },
    update: {},
    create: {
      orderNumber: "ORD-2026-0001",
      customerName: "Jane Doe",
      customerEmail: "jane.doe@example.com",
      customerPhone: "+1 (555) 019-2834",
      shippingAddress: "123 Market St, Suite 400, San Francisco, CA 94105",
      subtotal: 185.5,
      tax: 15.0,
      shippingCost: 25.0,
      totalAmount: 225.5,
      status: OrderStatus.CONFIRMED,
      items: {
        create: {
          productId: product.id,
          productName: product.name,
          variantName: "Clear Float 8mm",
          quantity: 1,
          widthMm: 1200,
          heightMm: 800,
          calculatedAreaSqm: 0.96,
          unitPrice: 185.5,
          totalPrice: 185.5,
          customSpecifications: {
            edgePolishing: "Flat Polished Edge",
            cornerType: "Radius Corner 15mm",
            holesCount: 4,
          },
        },
      },
    },
  });
  console.log(`Created sample order: ${sampleOrder.orderNumber}`);

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
