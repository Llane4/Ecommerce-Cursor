"use client"

import * as React from "react"

import type { DisplayCurrency } from "@/lib/currency"
import { isDisplayCurrency } from "@/lib/currency"

const STORAGE_KEY = "cursorshop-currency"

type CurrencyContextValue = {
  currency: DisplayCurrency
  setCurrency: (c: DisplayCurrency) => void
}

const CurrencyContext = React.createContext<CurrencyContextValue | null>(null)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = React.useState<DisplayCurrency>("USD")

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw && isDisplayCurrency(raw)) {
        setCurrencyState(raw)
      }
    } catch {
      /* ignore */
    }
  }, [])

  const setCurrency = React.useCallback((c: DisplayCurrency) => {
    setCurrencyState(c)
    try {
      window.localStorage.setItem(STORAGE_KEY, c)
    } catch {
      /* ignore */
    }
  }, [])

  const value = React.useMemo(
    () => ({ currency, setCurrency }),
    [currency, setCurrency],
  )

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  )
}

export function useDisplayCurrency(): CurrencyContextValue {
  const ctx = React.useContext(CurrencyContext)
  if (!ctx) {
    throw new Error("useDisplayCurrency debe usarse dentro de CurrencyProvider")
  }
  return ctx
}
