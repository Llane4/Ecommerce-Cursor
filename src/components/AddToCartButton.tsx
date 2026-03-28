"use client"

import { ShoppingCart } from "lucide-react"
import type { ComponentProps, RefObject } from "react"

import { Button } from "@/components/ui/button"
import type { CatalogProduct } from "@/lib/fake-products"
import {
  flyProductThumbnailToCart,
  flyStartRectFromElementId,
} from "@/lib/fly-to-cart"
import { useCartStore } from "@/stores/cart-store"

export type AddToCartButtonProps = Omit<
  ComponentProps<typeof Button>,
  "onClick" | "children"
> & {
  product: CatalogProduct
  showIcon?: boolean
  availableLabel?: string
  unavailableLabel?: string
  /** Rectángulo de la miniatura a animar; si existe, tiene prioridad sobre `flyFromElementId`. */
  flyFromRef?: RefObject<HTMLElement | null>
  /** `id` de un elemento cuyo `getBoundingClientRect` se usa como origen de la animación. */
  flyFromElementId?: string
}

function resolveFlyStartRect(
  buttonEl: HTMLElement,
  flyFromRef?: RefObject<HTMLElement | null>,
  flyFromElementId?: string
): DOMRectReadOnly {
  const fromRef = flyFromRef?.current?.getBoundingClientRect()
  if (fromRef && fromRef.width > 0 && fromRef.height > 0) return fromRef
  if (flyFromElementId) {
    const fromId = flyStartRectFromElementId(flyFromElementId)
    if (fromId && fromId.width > 0 && fromId.height > 0) return fromId
  }
  return buttonEl.getBoundingClientRect()
}

export function AddToCartButton({
  product,
  showIcon = false,
  availableLabel = "Añadir al carrito",
  unavailableLabel = "No disponible",
  disabled,
  flyFromRef,
  flyFromElementId,
  ...props
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem)
  const canBuy = product.isActive && product.stock > 0

  return (
    <Button
      type="button"
      disabled={disabled !== undefined ? disabled : !canBuy}
      onClick={(e) => {
        if (!canBuy) return
        const rect = resolveFlyStartRect(
          e.currentTarget,
          flyFromRef,
          flyFromElementId
        )
        flyProductThumbnailToCart(product.image, rect)
        addItem(product)
      }}
      {...props}
    >
      {showIcon ? <ShoppingCart className="mr-2 size-4" aria-hidden /> : null}
      {canBuy ? availableLabel : unavailableLabel}
    </Button>
  )
}
