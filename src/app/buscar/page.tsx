import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { CatalogWithFilters } from "@/components/CatalogWithFilters"
import {
  filterProductsBySearchQuery,
  getCatalogProducts,
} from "@/lib/fake-products"

type Props = {
  searchParams: Promise<{ q?: string | string[] }>
}

export async function generateMetadata({ searchParams }: Props) {
  const params = await searchParams
  const raw = params.q
  const q = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? ""
  if (q) return { title: `${q} | Búsqueda · CursorShop` }
  return { title: "Búsqueda | CursorShop" }
}

export default async function BuscarPage({ searchParams }: Props) {
  const params = await searchParams
  const raw = params.q
  const query = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? ""

  const products = await getCatalogProducts()
  const results = filterProductsBySearchQuery(products, query)

  return (
    <div className="mx-auto max-w-7xl">
      <nav
        aria-label="Migas de pan"
        className="flex items-center gap-1 px-3 pb-2 pt-3 text-xs text-muted-foreground sm:px-4 sm:pt-4 md:px-6"
      >
        <Link href="/" className="hover:text-foreground hover:underline">
          Inicio
        </Link>
        <ChevronRight className="size-3.5 shrink-0" aria-hidden />
        <span className="truncate text-foreground">Búsqueda</span>
      </nav>

      <header className="border-b border-border px-3 pb-3 dark:border-white/10 sm:px-4 sm:pb-4 md:px-6">
        {query ? (
          <>
            <h1 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
              Resultados para &quot;{query}&quot;
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {results.length === 0
                ? "No encontramos productos con esos términos."
                : `${results.length} producto${results.length === 1 ? "" : "s"}`}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
              Buscá en el catálogo
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Escribí en el buscador del encabezado o usá los filtros de precio y
              stock.
            </p>
          </>
        )}
      </header>

      <CatalogWithFilters products={results} />
    </div>
  )
}
