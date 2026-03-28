"use client"

import { Separator } from "@/components/ui/separator"
import { useDisplayCurrency } from "@/components/CurrencyProvider"
import { convertFromUsd, formatDisplayPrice } from "@/lib/currency"

type Props = {
  priceUsd: number
  comparePriceUsd: number | null
  discountPct: number | null
}

export function ProductDetailPrices({
  priceUsd,
  comparePriceUsd,
  discountPct,
}: Props) {
  const { currency } = useDisplayCurrency()
  const formatMoney = (usd: number) =>
    formatDisplayPrice(convertFromUsd(usd, currency), currency)
  const installment = formatDisplayPrice(
    Math.ceil(convertFromUsd(priceUsd, currency) / 12),
    currency,
  )

  return (
    <>
      <Separator className="mb-5" />

      {discountPct != null && comparePriceUsd != null && (
        <div className="mb-1 flex items-baseline gap-2">
          <span className="text-sm text-muted-foreground line-through">
            {formatMoney(comparePriceUsd)}
          </span>
          <span className="text-sm font-semibold text-[#00a650] dark:text-[#00d978]">
            {discountPct}% OFF
          </span>
        </div>
      )}

      <p className="mb-1 text-3xl font-light tabular-nums tracking-tight text-card-foreground sm:text-4xl">
        {formatMoney(priceUsd)}
      </p>

      <p className="mb-1 text-sm text-[#00a650] dark:text-[#00d978]">
        Mismo precio en 12 cuotas de {installment}
      </p>
    </>
  )
}
