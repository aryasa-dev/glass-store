import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItemType = "custom_glass" | "standard_product";

export interface CartItem {
  id: string; // Unique item ID in cart
  type: CartItemType;
  productId?: string;
  variantId?: string;
  name: string;
  variantName?: string;
  imageUrl?: string | null;

  // Custom Glass Dimensional attributes
  glassType?: string;
  thicknessMm?: number;
  widthMm?: number;
  heightMm?: number;
  unit?: "mm" | "cm";
  actualAreaSqm?: number;
  chargeableAreaSqm?: number;
  edgePolishing?: boolean;
  holesCount?: number;
  customSpecifications?: Record<string, unknown>;

  // Pricing & Quantity
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  createdAt: number;
}

export type AddToCartInput =
  | {
      type: "custom_glass";
      productId?: string;
      variantId?: string;
      name: string;
      variantName?: string;
      imageUrl?: string | null;
      glassType: string;
      thicknessMm: number;
      widthMm: number;
      heightMm: number;
      unit: "mm" | "cm";
      actualAreaSqm: number;
      chargeableAreaSqm: number;
      edgePolishing?: boolean;
      holesCount?: number;
      customSpecifications?: Record<string, unknown>;
      unitPrice: number;
      quantity?: number;
    }
  | {
      type: "standard_product";
      productId: string;
      variantId?: string;
      name: string;
      variantName?: string;
      imageUrl?: string | null;
      unitPrice: number;
      quantity?: number;
      customSpecifications?: Record<string, unknown>;
    };

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: AddToCartInput) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      addItem: (input) => {
        const qty = input.quantity && input.quantity > 0 ? input.quantity : 1;

        if (input.type === "standard_product") {
          // For standard products, check if exact productId & variantId already exists
          const existingIndex = get().items.findIndex(
            (i) =>
              i.type === "standard_product" &&
              i.productId === input.productId &&
              i.variantId === input.variantId
          );

          if (existingIndex > -1) {
            set((state) => {
              const updated = [...state.items];
              const target = updated[existingIndex];
              const newQty = target.quantity + qty;
              updated[existingIndex] = {
                ...target,
                quantity: newQty,
                totalPrice: target.unitPrice * newQty,
              };
              return { items: updated, isCartOpen: true };
            });
            return;
          }
        }

        // New item (custom glass or unique standard product)
        const newItem: CartItem = {
          ...input,
          id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          quantity: qty,
          totalPrice: input.unitPrice * qty,
          createdAt: Date.now(),
        };

        set((state) => ({
          items: [newItem, ...state.items],
          isCartOpen: true,
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity,
                  totalPrice: item.unitPrice * quantity,
                }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.totalPrice, 0);
      },
    }),
    {
      name: "shop_ecommerce_zustand_cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
