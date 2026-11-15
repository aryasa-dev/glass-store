"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export interface CreateOrderItemInput {
  productId?: string;
  variantId?: string;
  name: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  widthMm?: number;
  heightMm?: number;
  calculatedAreaSqm?: number;
  customSpecifications?: Record<string, any>;
}

export interface CreateOrderInput {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress: string;
  notes?: string;
  items: CreateOrderItemInput[];
}

export interface CreateOrderResult {
  success: boolean;
  orderNumber?: string;
  orderId?: string;
  error?: string;
}

export async function createOrderAction(input: CreateOrderInput): Promise<CreateOrderResult> {
  const { customerName, customerEmail, customerPhone, shippingAddress, notes, items } = input;

  if (!customerName?.trim() || !shippingAddress?.trim()) {
    return { success: false, error: "Name and shipping address are required." };
  }

  if (!customerPhone?.trim() && !customerEmail?.trim()) {
    return { success: false, error: "Please provide a contact phone number or email address." };
  }

  if (!items || items.length === 0) {
    return { success: false, error: "Your cart is empty." };
  }

  const effectiveEmail = customerEmail?.trim()
    ? customerEmail.trim().toLowerCase()
    : `${(customerPhone || "guest").replace(/[^0-9a-zA-Z]/g, "") || "customer"}@orders.local`;

  try {
    // Generate human-friendly order number e.g. ORD-2026-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const datePrefix = new Date().getFullYear();
    const orderNumber = `ORD-${datePrefix}-${randomSuffix}`;

    // Calculate subtotal
    const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
    const tax = Number((subtotal * 0.08).toFixed(2)); // Standard 8% tax
    const shippingCost = subtotal > 300 ? 0 : 35.0; // Free freight over $300, else $35 crate transit
    const totalAmount = Number((subtotal + tax + shippingCost).toFixed(2));

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.UNPAID,
        customerName: customerName.trim(),
        customerEmail: effectiveEmail,
        customerPhone: customerPhone ? customerPhone.trim() : null,
        shippingAddress: shippingAddress.trim(),
        subtotal,
        tax,
        shippingCost,
        totalAmount,
        notes: notes ? notes.trim() : null,
        items: {
          create: items.map((item) => ({
            productId: item.productId || null,
            variantId: item.variantId || null,
            productName: item.name,
            variantName: item.variantName || null,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            widthMm: item.widthMm || null,
            heightMm: item.heightMm || null,
            calculatedAreaSqm: item.calculatedAreaSqm || null,
            customSpecifications: item.customSpecifications || {},
          })),
        },
      },
      include: {
        items: true,
      },
    });

    try {
      revalidatePath("/admin/orders");
      revalidatePath("/admin");
    } catch {
      // Ignore when running outside of Next.js server context
    }

    return {
      success: true,
      orderNumber: newOrder.orderNumber,
      orderId: newOrder.id,
    };
  } catch (error) {
    console.error("Order creation failed:", error);
    return { success: false, error: "Failed to place order. Please try again." };
  }
}
