"use client"

import { ChevronDown } from "lucide-react"

import { useDisplayCurrency } from "@/components/CurrencyProvider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DISPLAY_CURRENCIES } from "@/lib/currency"

export function CurrencyMenu() {
  const { currency, setCurrency } = useDisplayCurrency()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 gap-1 border-border px-2 font-normal tabular-nums"
          aria-label="Elegir moneda de precios"
        >
          {currency}
          <ChevronDown className="size-3.5 opacity-60" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[var(--radix-dropdown-menu-trigger-width)]">
        <DropdownMenuLabel className="text-xs">Moneda</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={currency}
          onValueChange={(v) => {
            const next = DISPLAY_CURRENCIES.find((o) => o.value === v)?.value
            if (next) setCurrency(next)
          }}
        >
          {DISPLAY_CURRENCIES.map((opt) => (
            <DropdownMenuRadioItem key={opt.value} value={opt.value}>
              {opt.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
