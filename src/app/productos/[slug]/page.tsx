import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  BadgeCheck,
  ChevronRight,
  Heart,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react"

import { ProductDetailBuyActions } from "@/components/ProductDetailBuyActions"
import { ProductDetailPrices } from "@/components/ProductDetailPrices"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getProductBySlug } from "@/lib/fake-products"
import { PRODUCT_DETAIL_FLY_IMAGE_ID } from "@/lib/fly-to-cart"

type Props = {
  params: Promise<{ slug: string }>
}

function discount(price: number, comparePrice: number): number {
  return Math.round(((comparePrice - price) / comparePrice) * 100)
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "Producto no encontrado" }
  return { title: `${product.name} | CursorShop` }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const canBuy = product.isActive && product.stock > 0
  const discountPct =
    product.comparePrice != null
      ? discount(product.price, product.comparePrice)
      : null

  const stockLabel =
    product.stock === 0
      ? "Sin stock"
      : product.stock <= 10
        ? `¡Solo quedan ${product.stock}!`
        : `${product.stock} en stock`

  return (
    <div className="mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground hover:underline">
          Inicio
        </Link>
        <ChevronRight className="size-3.5 shrink-0" />
        <span className="truncate text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-10 xl:grid-cols-[1fr_420px] xl:gap-12">
        {/* ── Columna izquierda: imagen ── */}
        <div className="flex flex-col gap-4">
          <div
            id={PRODUCT_DETAIL_FLY_IMAGE_ID}
            className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-muted/20 dark:border-white/10"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain object-center p-4 sm:p-6"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {product.isFeatured && (
              <div className="absolute left-4 top-4">
                <Badge className="bg-[#3483fa] text-white hover:bg-[#2968c8]">
                  Destacado
                </Badge>
              </div>
            )}
            <button
              type="button"
              aria-label="Guardar en favoritos"
              className="absolute right-4 top-4 rounded-full bg-background/80 p-2 text-muted-foreground backdrop-blur-sm transition hover:text-rose-500 dark:bg-background/60"
            >
              <Heart className="size-5" />
            </button>
          </div>

          {/* Descripción del producto */}
          <div className="rounded-xl border border-border bg-card p-5 dark:border-white/10">
            <h2 className="mb-3 text-sm font-semibold text-card-foreground">
              Descripción
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>

          {/* Características */}
          <div className="rounded-xl border border-border bg-card p-5 dark:border-white/10">
            <h2 className="mb-3 text-sm font-semibold text-card-foreground">
              Características del producto
            </h2>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  SKU
                </dt>
                <dd className="mt-0.5 font-mono text-card-foreground">
                  {product.sku}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Estado
                </dt>
                <dd className="mt-0.5 text-card-foreground">Nuevo</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Stock
                </dt>
                <dd className="mt-0.5 text-card-foreground">{product.stock} unidades</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Disponible
                </dt>
                <dd className="mt-0.5 text-card-foreground">
                  {product.isActive ? "Sí" : "No"}
                </dd>
              </div>
              {product.isFeatured && (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Categoría
                  </dt>
                  <dd className="mt-0.5 text-card-foreground">Destacado</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* ── Columna derecha: información y compra ── */}
        <div className="flex flex-col gap-4">
          {/* Card principal */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6 dark:border-white/10">
            {/* Condición y ventas */}
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Nuevo</span>
              <span aria-hidden>·</span>
              <span>+100 vendidos</span>
            </div>

            {/* Nombre */}
            <h1 className="mb-3 text-lg font-semibold leading-snug text-card-foreground sm:text-xl md:text-2xl">
              {product.name}
            </h1>

            {/* SKU + verificado */}
            <div className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Ref. {product.sku}</span>
              <BadgeCheck
                className="size-3.5 shrink-0 text-[#3483fa] dark:text-[#6ea8ff]"
                aria-hidden
              />
            </div>

            {/* Rating */}
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-card-foreground">
                <Star
                  className="size-4 fill-[#3483fa] text-[#3483fa] dark:fill-[#6ea8ff] dark:text-[#6ea8ff]"
                  aria-hidden
                />
                4.8
              </span>
              <span className="text-xs text-muted-foreground">(4 opiniones)</span>
            </div>

            <ProductDetailPrices
              priceUsd={product.price}
              comparePriceUsd={product.comparePrice}
              discountPct={discountPct}
            />

            {/* Envío */}
            <p className="mb-5 flex items-center gap-1.5 text-sm font-bold text-[#00a650] dark:text-[#00d978]">
              <Truck className="size-4 shrink-0" aria-hidden />
              Envío gratis
            </p>

            {/* Stock */}
            <p className="mb-5 text-sm text-muted-foreground">
              {canBuy ? (
                <>
                  <span className="font-medium text-card-foreground">
                    {stockLabel}
                  </span>{" "}
                  · disponible
                </>
              ) : (
                <span className="font-medium text-destructive">
                  Producto no disponible
                </span>
              )}
            </p>

            <ProductDetailBuyActions product={product} canBuy={canBuy} />
          </div>

          {/* Garantías */}
          <div className="rounded-2xl border border-border bg-card p-5 dark:border-white/10">
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex items-start gap-3">
                <RotateCcw
                  className="mt-0.5 size-5 shrink-0 text-[#3483fa] dark:text-[#6ea8ff]"
                  aria-hidden
                />
                <div>
                  <span className="font-medium text-card-foreground">
                    Devolución gratis.
                  </span>{" "}
                  <span className="text-muted-foreground">
                    Tenés 30 días desde que lo recibís.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck
                  className="mt-0.5 size-5 shrink-0 text-[#3483fa] dark:text-[#6ea8ff]"
                  aria-hidden
                />
                <div>
                  <span className="font-medium text-card-foreground">
                    Compra protegida.
                  </span>{" "}
                  <span className="text-muted-foreground">
                    Recibí el producto que esperabas o te devolvemos el dinero.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <PackageCheck
                  className="mt-0.5 size-5 shrink-0 text-[#3483fa] dark:text-[#6ea8ff]"
                  aria-hidden
                />
                <div>
                  <span className="font-medium text-card-foreground">
                    Garantía del vendedor.
                  </span>{" "}
                  <span className="text-muted-foreground">
                    3 meses de garantía por defectos de fabricación.
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Volver al catálogo */}
          <Link
            href="/"
            className="text-center text-sm text-[#3483fa] underline-offset-4 hover:underline dark:text-[#6ea8ff]"
          >
            ← Volver al catálogo
          </Link>
        </div>
      </div>
    </div>
  )
}
