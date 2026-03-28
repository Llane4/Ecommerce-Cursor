"use client"

import * as React from "react"

import { ProductCard, ProductCardsGrid } from "@/components/ProductCard"
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import type { CatalogProduct } from "@/lib/fake-products"

type CatalogWithFiltersProps = {
  products: CatalogProduct[]
  /** Muestra esqueletos en la grilla y mantiene el sidebar visible. */
  isLoading?: boolean
  /** Total en catálogo (p. ej. API) cuando `products` es solo la página actual. */
  catalogTotal?: number
  /** Contenido debajo de la grilla (p. ej. paginación). */
  afterGrid?: React.ReactNode
}

function priceBounds(products: CatalogProduct[]) {
  if (products.length === 0) return { min: 0, max: 0 }
  const prices = products.map((p) => p.price)
  return { min: Math.min(...prices), max: Math.max(...prices) }
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n))
}

function parsePriceInput(raw: string, fallback: number) {
  const normalized = raw.replace(",", ".").trim()
  if (normalized === "" || Number.isNaN(Number(normalized))) return fallback
  return Number(normalized)
}

export function CatalogWithFilters({
  products,
  isLoading = false,
  catalogTotal,
  afterGrid,
}: CatalogWithFiltersProps) {
  const { min: boundMin, max: boundMax } = React.useMemo(
    () => priceBounds(products),
    [products],
  )

  const [range, setRange] = React.useState<[number, number]>([boundMin, boundMax])
  const [minStr, setMinStr] = React.useState(String(Math.round(boundMin)))
  const [maxStr, setMaxStr] = React.useState(String(Math.round(boundMax)))

  const commitRange = React.useCallback(
    (lo: number, hi: number) => {
      const a = clamp(Math.min(lo, hi), boundMin, boundMax)
      const b = clamp(Math.max(lo, hi), boundMin, boundMax)
      setRange([a, b])
      setMinStr(String(Math.round(a)))
      setMaxStr(String(Math.round(b)))
    },
    [boundMin, boundMax],
  )

  React.useEffect(() => {
    commitRange(boundMin, boundMax)
  }, [boundMin, boundMax, commitRange])

  const [onlyAvailable, setOnlyAvailable] = React.useState(false)

  const step = React.useMemo(() => {
    const span = boundMax - boundMin
    if (span <= 0) return 1
    const s = span / 200
    if (s < 1) return 1
    return Math.round(s)
  }, [boundMin, boundMax])

  const sliderMax = Math.max(boundMin, boundMax)

  const onSliderChange = (values: number[]) => {
    const a = values[0] ?? boundMin
    const b = values[1] ?? boundMax
    commitRange(a, b)
  }

  const filtered = React.useMemo(() => {
    const [lo, hi] = range
    return products.filter((p) => {
      if (onlyAvailable && (!p.isActive || p.stock <= 0)) return false
      if (p.price < lo || p.price > hi) return false
      return true
    })
  }, [products, range, onlyAvailable])

  const samePriceBand = boundMin === boundMax && products.length > 0
  const sliderDisabled =
    products.length === 0 || samePriceBand || isLoading

  return (
    <div className="flex flex-col gap-4 p-3 sm:gap-6 sm:p-4 md:p-6 lg:flex-row lg:items-start lg:gap-8">
      <aside className="w-full shrink-0 lg:sticky lg:top-[calc(4.5rem+env(safe-area-inset-top))] lg:w-72 lg:self-start">
        <Card className="border-border shadow-sm dark:border-white/10">
          <CardHeader className="pb-2">
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="space-y-3">
              <Label className="text-xs font-medium text-muted-foreground">
                Precio (ARS)
              </Label>
              <div className="flex gap-2">
                <div className="grid flex-1 gap-1">
                  <Label
                    htmlFor="price-min"
                    className="text-[0.65rem] font-normal uppercase tracking-wide text-muted-foreground"
                  >
                    Mínimo
                  </Label>
                  <Input
                    id="price-min"
                    type="text"
                    inputMode="decimal"
                    value={minStr}
                    onChange={(e) => setMinStr(e.target.value)}
                    onBlur={() =>
                      commitRange(
                        parsePriceInput(minStr, range[0]),
                        range[1],
                      )
                    }
                    className="h-9"
                    disabled={sliderDisabled}
                  />
                </div>
                <div className="grid flex-1 gap-1">
                  <Label
                    htmlFor="price-max"
                    className="text-[0.65rem] font-normal uppercase tracking-wide text-muted-foreground"
                  >
                    Máximo
                  </Label>
                  <Input
                    id="price-max"
                    type="text"
                    inputMode="decimal"
                    value={maxStr}
                    onChange={(e) => setMaxStr(e.target.value)}
                    onBlur={() =>
                      commitRange(
                        range[0],
                        parsePriceInput(maxStr, range[1]),
                      )
                    }
                    className="h-9"
                    disabled={sliderDisabled}
                  />
                </div>
              </div>
              <Slider
                min={boundMin}
                max={sliderMax}
                step={step}
                value={range}
                onValueChange={onSliderChange}
                disabled={sliderDisabled}
                className="pt-1"
                minStepsBetweenThumbs={0}
              />
              {samePriceBand ? (
                <p className="text-[0.7rem] leading-snug text-muted-foreground">
                  Todos los productos tienen el mismo precio; usá los campos
                  numéricos si necesitás afinar.
                </p>
              ) : null}
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Disponibilidad
              </Label>
              <label
                className={`flex items-start gap-2 rounded-md border border-transparent px-1 py-1 ${isLoading ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-muted/50"}`}
              >
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  disabled={isLoading}
                  className="mt-0.5 size-4 shrink-0 rounded border border-input accent-[#3483fa] dark:accent-[#6ea8ff] disabled:cursor-not-allowed"
                />
                <span className="text-sm text-card-foreground">
                  Solo productos disponibles
                  <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                    Activo y con stock
                  </span>
                </span>
              </label>
            </div>

            <p className="text-xs text-muted-foreground">
              {isLoading
                ? "Cargando catálogo…"
                : catalogTotal != null
                  ? `Mostrando ${filtered.length} de ${products.length} en esta página · ${catalogTotal} en el catálogo`
                  : `Mostrando ${filtered.length} de ${products.length}`}
            </p>
          </CardContent>
        </Card>
      </aside>

      <div className="min-w-0 flex-1">
        {isLoading ? (
          <ProductCardsGrid>
            {Array.from({ length: 8 }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </ProductCardsGrid>
        ) : filtered.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-12 text-center text-sm text-muted-foreground dark:border-white/10">
            No hay productos con estos filtros. Ajustá el precio o la
            disponibilidad.
          </p>
        ) : (
          <ProductCardsGrid>
            {filtered.map((product, i) => (
              <ProductCard
                key={product.slug}
                product={product}
                priority={i < 4}
              />
            ))}
          </ProductCardsGrid>
        )}
        {afterGrid}
      </div>
    </div>
  )
}
