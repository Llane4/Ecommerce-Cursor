"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useDisplayCurrency } from "@/components/CurrencyProvider"
import {
  convertFromUsd,
  formatDisplayPrice,
  roundForMercadoPagoUnitPrice,
} from "@/lib/currency"
import {
  cartSubtotal,
  cartTotalQuantity,
  useCartStore,
} from "@/stores/cart-store"

export function CartPageContent() {
  const items = useCartStore((s) => s.items)
  const setQuantity = useCartStore((s) => s.setQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart = useCartStore((s) => s.clearCart)
  const [isLoading, setIsLoading] = useState(false)
  const { currency } = useDisplayCurrency()

  const totalQty = cartTotalQuantity(items)
  const subtotalUsd = cartSubtotal(items)
  const formatMoney = (valueUsd: number) =>
    formatDisplayPrice(convertFromUsd(valueUsd, currency), currency)

  if (items.length === 0) {
    return (
      <Card className="mx-auto max-w-lg border-border dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Tu carrito está vacío</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Agregá productos desde el catálogo para verlos aquí. Tus datos se
          guardan en este navegador.
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/">Ir al catálogo</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-4 sm:gap-6 lg:grid-cols-[1fr_minmax(0,320px)] lg:items-start">
      <Card className="min-w-0 border-border dark:border-white/10">
        <CardHeader className="flex flex-col gap-3 space-y-0 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base sm:text-lg">
            Productos ({totalQty})
          </CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 self-start text-muted-foreground sm:self-auto"
            onClick={() => clearCart()}
          >
            Vaciar carrito
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((line, index) => (
            <div key={line.slug}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
                  <Link
                    href={`/productos/${line.slug}`}
                    className="relative size-[4.5rem] shrink-0 overflow-hidden rounded-md border border-border bg-muted/30 sm:size-20 dark:border-white/10"
                  >
                    <Image
                      src={line.image}
                      alt={line.name}
                      fill
                      className="object-contain p-1"
                      sizes="(max-width: 640px) 72px, 80px"
                    />
                  </Link>
                  <div className="min-w-0 flex-1 space-y-2">
                    <Link
                      href={`/productos/${line.slug}`}
                      className="line-clamp-2 text-sm font-medium text-card-foreground hover:text-[#3483fa] hover:underline dark:hover:text-[#6ea8ff]"
                    >
                      {line.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      Ref. {line.sku} · {formatMoney(line.price)} c/u
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center rounded-md border border-border dark:border-white/10">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 px-0"
                          onClick={() =>
                            setQuantity(line.slug, line.quantity - 1)
                          }
                          aria-label="Quitar una unidad"
                        >
                          −
                        </Button>
                        <span className="min-w-8 text-center text-sm tabular-nums">
                          {line.quantity}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 px-0"
                          disabled={line.quantity >= line.stock}
                          onClick={() =>
                            setQuantity(line.slug, line.quantity + 1)
                          }
                          aria-label="Añadir una unidad"
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(line.slug)}
                        aria-label={`Eliminar ${line.name} del carrito`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="text-right text-sm font-medium tabular-nums text-card-foreground sm:shrink-0 sm:w-24 sm:pt-0.5">
                  {formatMoney(line.price * line.quantity)}
                </p>
              </div>
              {index < items.length - 1 ? (
                <Separator className="mt-4" />
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border lg:sticky lg:top-[calc(5rem+env(safe-area-inset-top))] dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Resumen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="tabular-nums text-card-foreground">
              {formatMoney(subtotalUsd)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Envío y promociones se calcularían al finalizar la compra.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            className="h-10 w-full rounded-md bg-[#3483fa] font-medium text-white hover:bg-[#2968c8] dark:bg-[#3483fa] dark:hover:bg-[#2968c8]"
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true)
              let redirecting = false
              try {
                const res = await fetch("/api/checkout", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    currency_id: currency,
                    products: items.map((line) => ({
                      title: line.name,
                      unit_price: roundForMercadoPagoUnitPrice(
                        convertFromUsd(line.price, currency),
                      ),
                      quantity: line.quantity,
                      id: line.slug,
                    })),
                  }),
                })
                const data = (await res.json()) as {
                  error?: string
                  init_point?: string
                  id?: string
                  mercadoPago?: unknown
                }
                console.log(
                  "[carrito] /api/checkout respuesta (status",
                  res.status,
                  "):",
                  data,
                )
                try {
                  console.log(
                    "[carrito] /api/checkout JSON:\n",
                    JSON.stringify(data, null, 2),
                  )
                } catch {
                  /* ignore stringify errors */
                }
                if (!res.ok) {
                  console.log(
                    "[carrito] Error API checkout; mercadoPago:",
                    data.mercadoPago ?? data,
                  )
                  alert(data.error ?? "No se pudo iniciar el pago.")
                  return
                }
                if (data.mercadoPago != null) {
                  console.log(
                    "[carrito] Objeto devuelto por Mercado Pago (preferencia):",
                    data.mercadoPago,
                  )
                }
                if (
                  typeof data.init_point === "string" &&
                  data.init_point.length > 0
                ) {
                  redirecting = true
                  console.log(
                    "[carrito] Redirigiendo a init_point de Mercado Pago:",
                    data.init_point,
                  )
                  window.location.href = data.init_point
                  return
                }
                alert("La respuesta no incluye la URL de pago (init_point).")
              } catch {
                alert("Error de red al contactar el servidor.")
              } finally {
                if (!redirecting) setIsLoading(false)
              }
            }}
          >
            {isLoading ? "Generando pago…" : "Iniciar compra"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
