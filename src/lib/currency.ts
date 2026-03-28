/**
 * Los precios del catálogo (DummyJSON) están en USD.
 * Tasas de referencia aproximadas; ajustá según necesidad o API externa.
 */
export const USD_TO_ARS = 1250
export const USD_TO_EUR = 0.93

export type DisplayCurrency = "USD" | "ARS" | "EUR"

export const DISPLAY_CURRENCIES: {
  value: DisplayCurrency
  label: string
}[] = [
  { value: "USD", label: "Dólar (USD)" },
  { value: "ARS", label: "Peso argentino (ARS)" },
  { value: "EUR", label: "Euro (EUR)" },
]

export function isDisplayCurrency(v: string): v is DisplayCurrency {
  return v === "USD" || v === "ARS" || v === "EUR"
}

/** Convierte un monto en USD a la moneda de visualización. */
export function convertFromUsd(amountUsd: number, currency: DisplayCurrency): number {
  switch (currency) {
    case "USD":
      return amountUsd
    case "ARS":
      return amountUsd * USD_TO_ARS
    case "EUR":
      return amountUsd * USD_TO_EUR
  }
}

/** Formatea un valor ya expresado en `currency` (no en USD). */
export function formatDisplayPrice(amount: number, currency: DisplayCurrency): string {
  const locale = currency === "USD" ? "en-US" : "es-AR"
  const fractionDigits = currency === "ARS" ? 0 : 2
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount)
}

/** Redondeo de unit_price para la API de preferencias (hasta 2 decimales). */
export function roundForMercadoPagoUnitPrice(amount: number): number {
  return Math.round(amount * 100) / 100
}
