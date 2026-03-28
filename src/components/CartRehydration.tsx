"use client"

import { useEffect } from "react"

import { useCartStore } from "@/stores/cart-store"

/** Rehidrata el carrito desde `localStorage` después del primer paint (Next.js + persist). */
export function CartRehydration() {
  useEffect(() => {
    void useCartStore.persist.rehydrate()
  }, [])

  return null
}
