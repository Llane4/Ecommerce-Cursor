"use client"

import { Zap } from "lucide-react"

import { AddToCartButton } from "@/components/AddToCartButton"
import { Button } from "@/components/ui/button"
import type { CatalogProduct } from "@/lib/fake-products"
import {
  PRODUCT_DETAIL_FLY_IMAGE_ID,
  flyProductThumbnailToCart,
  flyStartRectFromElementId,
} from "@/lib/fly-to-cart"
import { useCartStore } from "@/stores/cart-store"

type Props = {
  product: CatalogProduct
  canBuy: boolean
}

export function ProductDetailBuyActions({ product, canBuy }: Props) {
  const addItem = useCartStore((s) => s.addItem)

  return (
    <div className="flex flex-col gap-3">
      <Button
        type="button"
        size="lg"
        disabled={!canBuy}
        className="h-11 w-full rounded-xl bg-[#3483fa] text-base font-medium text-white hover:bg-[#2968c8] disabled:opacity-50"
        onClick={(e) => {
          if (!canBuy) return
          const fromImg = flyStartRectFromElementId(PRODUCT_DETAIL_FLY_IMAGE_ID)
          const rect =
            fromImg && fromImg.width > 0 && fromImg.height > 0
              ? fromImg
              : e.currentTarget.getBoundingClientRect()
          flyProductThumbnailToCart(product.image, rect)
          addItem(product)
        }}
      >
        <Zap className="mr-2 size-4" aria-hidden />
        Comprar ahora
      </Button>
      <AddToCartButton
        product={product}
        flyFromElementId={PRODUCT_DETAIL_FLY_IMAGE_ID}
        size="lg"
        variant="outline"
        showIcon
        availableLabel="Agregar al carrito"
        className="h-11 w-full rounded-xl border-[#3483fa] text-base font-medium text-[#3483fa] hover:bg-[#3483fa]/5 dark:border-[#6ea8ff] dark:text-[#6ea8ff] disabled:opacity-50"
      />
    </div>
  )
}
