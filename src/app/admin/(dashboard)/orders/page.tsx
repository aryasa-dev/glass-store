import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrdersClient } from "./OrdersClient";

export const instant = false;

export const metadata = {
  title: "Orders & Fabrication | Admin Control Center",
};

export default async function AdminOrdersPage() {
  await connection();
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  const serializedOrders = orders.map((o) => ({
    ...o,
    subtotal: Number(o.subtotal),
    tax: Number(o.tax),
    shippingCost: Number(o.shippingCost),
    totalAmount: Number(o.totalAmount),
    items: o.items.map((i) => ({
      ...i,
      unitPrice: Number(i.unitPrice),
      totalPrice: Number(i.totalPrice),
    })),
  }));

  return <OrdersClient initialOrders={serializedOrders} />;
}
