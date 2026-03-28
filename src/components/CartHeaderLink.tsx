"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"

import { CART_FLY_TARGET_ATTR } from "@/lib/fly-to-cart"
import { cn } from "@/lib/utils"
import { cartTotalQuantity, useCartStore } from "@/stores/cart-store"

export function CartHeaderLink({ className }: { className?: string }) {
  const items = useCartStore((s) => s.items)
  const count = cartTotalQuantity(items)

  return (
    <Link
      href="/carrito"
      {...{ [CART_FLY_TARGET_ATTR]: "" }}
      className={cn(
        "relative inline-flex items-center justify-center rounded-md p-2 text-foreground/80 hover:bg-muted hover:text-[#3483fa] dark:hover:text-[#6ea8ff]",
        className
      )}
      aria-label={
        count > 0
          ? `Carrito con ${count} artículos`
          : "Carrito de compras (vacío)"
      }
    >
      <ShoppingCart className="size-5" aria-hidden />
      {count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#3483fa] px-1 text-[10px] font-semibold text-white dark:bg-[#6ea8ff] dark:text-background">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  )
}
