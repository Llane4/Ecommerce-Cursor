import type { Metadata } from "next"

import { CartPageContent } from "@/components/CartPageContent"

export const metadata: Metadata = {
  title: "Carrito | CursorShop",
  description: "Revisá los productos en tu carrito",
}

export default function CarritoPage() {
  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8 md:px-6">
      <h1 className="mb-4 text-xl font-semibold tracking-tight text-foreground sm:mb-6 sm:text-2xl">
        Carrito de compras
      </h1>
      <CartPageContent />
    </div>
  )
}
