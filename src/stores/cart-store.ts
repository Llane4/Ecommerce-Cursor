import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { CatalogProduct } from "@/lib/fake-products"

export type CartLine = {
  slug: string
  name: string
  image: string
  price: number
  sku: string
  stock: number
  quantity: number
}

type CartState = {
  items: CartLine[]
  addItem: (product: CatalogProduct) => void
  removeItem: (slug: string) => void
  setQuantity: (slug: string, quantity: number) => void
  clearCart: () => void
}

function toLine(product: CatalogProduct, quantity: number): CartLine {
  return {
    slug: product.slug,
    name: product.name,
    image: product.image,
    price: product.price,
    sku: product.sku,
    stock: product.stock,
    quantity,
  }
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        if (!product.isActive || product.stock <= 0) return
        set((state) => {
          const i = state.items.findIndex((line) => line.slug === product.slug)
          if (i >= 0) {
            const next = [...state.items]
            const line = next[i]
            const qty = Math.min(line.quantity + 1, product.stock)
            next[i] = {
              ...line,
              stock: product.stock,
              price: product.price,
              name: product.name,
              image: product.image,
              sku: product.sku,
              quantity: qty,
            }
            return { items: next }
          }
          return { items: [...state.items, toLine(product, 1)] }
        })
      },
      removeItem: (slug) =>
        set((state) => ({
          items: state.items.filter((line) => line.slug !== slug),
        })),
      setQuantity: (slug, quantity) => {
        if (quantity <= 0) {
          get().removeItem(slug)
          return
        }
        set((state) => ({
          items: state.items.map((line) =>
            line.slug === slug
              ? { ...line, quantity: Math.min(quantity, line.stock) }
              : line
          ),
        }))
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cursorshop-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
    }
  )
)

export function cartTotalQuantity(items: CartLine[]): number {
  return items.reduce((sum, line) => sum + line.quantity, 0)
}

export function cartSubtotal(items: CartLine[]): number {
  return items.reduce((sum, line) => sum + line.price * line.quantity, 0)
}
