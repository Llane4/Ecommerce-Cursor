import { getProductById, getProducts } from "@/services/api"

/**
 * Modelo del catálogo (antes en `data/fake-products.json`; ahora mapeado desde DummyJSON).
 * `price` y `comparePrice` están en USD; la UI puede mostrarlos en otras monedas vía `src/lib/currency.ts`.
 */
export type CatalogProduct = {
  name: string
  slug: string
  description: string
  price: number
  comparePrice: number | null
  image: string
  stock: number
  sku: string
  isActive: boolean
  isFeatured: boolean
}

/** Catálogo ampliado para búsqueda y filtros (mismo origen que la home). */
export async function getCatalogProducts(): Promise<CatalogProduct[]> {
  return getProducts(100)
}

export async function getProductBySlug(slug: string): Promise<CatalogProduct | null> {
  if (/^\d+$/.test(slug)) {
    return getProductById(Number(slug))
  }
  return null
}

/** Busca por palabras en nombre, descripción, SKU y slug (como texto). */
export function filterProductsBySearchQuery(
  products: CatalogProduct[],
  rawQuery: string,
): CatalogProduct[] {
  const normalized = rawQuery.trim().toLowerCase()
  if (!normalized) return products

  const tokens = normalized.split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return products

  return products.filter((p) => {
    const blob = [p.name, p.description, p.sku, p.slug.replaceAll("-", " ")]
      .join(" ")
      .toLowerCase()

    return tokens.every((tok) => blob.includes(tok))
  })
}
