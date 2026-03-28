"use client"

import Image from "next/image"
import Link from "next/link"
import { BadgeCheck, Star } from "lucide-react"
import { useRef, type ReactNode } from "react"

import { AddToCartButton } from "@/components/AddToCartButton"
import { useDisplayCurrency } from "@/components/CurrencyProvider"
import { convertFromUsd, formatDisplayPrice } from "@/lib/currency"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import type { CatalogProduct } from "@/lib/fake-products"

export type ProductCardProps = {
  product: CatalogProduct
  /** Solo las primeras tarjetas deben usar `priority` en `Image`. */
  priority?: boolean
}

const PRODUCT_CARDS_GRID_CLASS =
  "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center"

export function ProductCardsGrid({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={
        className
          ? `${PRODUCT_CARDS_GRID_CLASS} ${className}`
          : PRODUCT_CARDS_GRID_CLASS
      }
    >
      {children}
    </div>
  )
}

export function ProductCard({ product, priority }: ProductCardProps) {
  const { currency } = useDisplayCurrency()
  const formatMoney = (usd: number) =>
    formatDisplayPrice(convertFromUsd(usd, currency), currency)
  const installment = formatDisplayPrice(
    Math.ceil(convertFromUsd(product.price, currency) / 12),
    currency,
  )
  const flyImageRef = useRef<HTMLDivElement>(null)

  return (
    <Card className="group h-full w-full gap-0 border-border bg-card py-0 text-card-foreground shadow-sm ring-0 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md dark:border-white/10">
      <Link
        href={`/productos/${product.slug}`}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={`Ver detalle de ${product.name}`}
      >
      <CardContent className="flex flex-col gap-3 px-4 pt-4 pb-3">
        <div
          ref={flyImageRef}
          className="relative aspect-square w-full shrink-0 overflow-hidden rounded-md"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain object-center transition-transform duration-300 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            priority={priority}
          />
        </div>

        <h3 className="text-sm font-medium leading-snug text-card-foreground">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="truncate">Ref. {product.sku}</span>
          <BadgeCheck
            className="size-3.5 shrink-0 text-[#3483fa] dark:text-[#6ea8ff]"
            aria-hidden
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-0.5 font-medium text-card-foreground">
            <Star
              className="size-3.5 fill-[#3483fa] text-[#3483fa] dark:fill-[#6ea8ff] dark:text-[#6ea8ff]"
              aria-hidden
            />
            4.8
          </span>
          <span className="text-border" aria-hidden>
            |
          </span>
          <span>
            {product.stock > 0 ? `${product.stock} en stock` : "Sin stock"}
          </span>
        </div>

        <div className="space-y-1.5 pt-0.5">
          <p className="text-2xl font-normal tabular-nums tracking-tight text-card-foreground">
            {formatMoney(product.price)}
          </p>
          <p className="text-sm leading-snug text-[#00a650] dark:text-[#00d978]">
            Mismo precio 12 cuotas de {installment}
          </p>
          <p className="text-sm font-bold text-[#00a650] dark:text-[#00d978]">
            Envío gratis
          </p>
        </div>

        {product.comparePrice != null ? (
          <div className="space-y-1.5 border-t border-border pt-4 dark:border-white/10">
            <p className="text-xs text-muted-foreground">Otra opción de compra</p>
            <p className="text-2xl font-normal tabular-nums tracking-tight text-card-foreground">
              {formatMoney(product.comparePrice)}
            </p>
            <p className="text-xs text-muted-foreground">Precio de lista</p>
          </div>
        ) : null}
      </CardContent>
      </Link>

      <CardFooter className="mt-auto flex-col gap-0 border-t border-border px-4 pb-4 pt-3 dark:border-white/10">
        <AddToCartButton
          product={product}
          flyFromRef={flyImageRef}
          size="lg"
          className="h-9 w-full rounded-md bg-blue-500 text-sm font-medium text-white hover:bg-blue-600 dark:bg-[#3483fa] dark:hover:bg-[#2968c8] disabled:opacity-50"
        />
      </CardFooter>
    </Card>
  )
}
