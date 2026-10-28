"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export interface ActionResponse {
  success: boolean;
  error?: string;
}

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus
): Promise<ActionResponse> {
  await requireAdmin();

  if (!Object.values(OrderStatus).includes(status)) {
    return { success: false, error: "Invalid order status value." };
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update order status." };
  }
}

export async function updatePaymentStatusAction(
  orderId: string,
  paymentStatus: PaymentStatus
): Promise<ActionResponse> {
  await requireAdmin();

  if (!Object.values(PaymentStatus).includes(paymentStatus)) {
    return { success: false, error: "Invalid payment status value." };
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus },
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating payment status:", error);
    return { success: false, error: "Failed to update payment status." };
  }
}

export async function deleteOrderAction(orderId: string): Promise<ActionResponse> {
  await requireAdmin();

  try {
    await prisma.order.delete({
      where: { id: orderId },
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, error: "Failed to delete order." };
  }
}
