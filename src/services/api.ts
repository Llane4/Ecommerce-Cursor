import type { CatalogProduct } from "@/lib/fake-products"

const PRODUCTS_URL = "https://dummyjson.com/products"

type DummyJsonProduct = {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  sku: string
  thumbnail: string
}

function mapDummyJsonProduct(p: DummyJsonProduct): CatalogProduct {
  const discountPct = p.discountPercentage ?? 0
  const comparePrice =
    discountPct > 0
      ? Math.round((p.price / (1 - discountPct / 100)) * 100) / 100
      : null

  return {
    name: p.title,
    slug: String(p.id),
    description: p.description,
    price: p.price,
    comparePrice,
    image: p.thumbnail,
    stock: p.stock,
    sku: p.sku,
    isActive: p.stock > 0,
    isFeatured: p.rating >= 4.5,
  }
}

/**
 * Lista productos desde DummyJSON. Por defecto los primeros 20 (`limit=20`).
 */
export async function getProducts(limit = 20): Promise<CatalogProduct[]> {
  const res = await fetch(`${PRODUCTS_URL}?limit=${limit}`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    throw new Error(`DummyJSON products: ${res.status} ${res.statusText}`)
  }

  const data = (await res.json()) as {
    products: DummyJsonProduct[]
    total: number
  }

  return data.products.map(mapDummyJsonProduct)
}

/** Tamaño de página y tope de páginas para el listado paginado del inicio. */
export const CATALOG_PAGE_SIZE = 10
export const CATALOG_MAX_PAGES = 10

export type CatalogPageResult = {
  products: CatalogProduct[]
  total: number
  page: number
  totalPages: number
  /** Si el `page` pedido supera el total disponible (acotado a CATALOG_MAX_PAGES), ir a esta página. */
  redirectToPage?: number
}

/**
 * Una página del catálogo desde DummyJSON (`skip` / `limit`).
 * `totalPages` no supera `CATALOG_MAX_PAGES` aunque el API tenga más resultados.
 */
export async function getProductsPage(
  requestedPage: number,
): Promise<CatalogPageResult> {
  const limit = CATALOG_PAGE_SIZE
  let page = Math.floor(Number(requestedPage))
  if (!Number.isFinite(page) || page < 1) page = 1
  page = Math.min(page, CATALOG_MAX_PAGES)

  const skip = (page - 1) * limit
  const res = await fetch(`${PRODUCTS_URL}?limit=${limit}&skip=${skip}`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    throw new Error(`DummyJSON products: ${res.status} ${res.statusText}`)
  }

  const data = (await res.json()) as {
    products: DummyJsonProduct[]
    total: number
  }

  const total = data.total
  const rawTotalPages = Math.ceil(total / limit)
  const totalPages = Math.min(
    rawTotalPages > 0 ? rawTotalPages : 0,
    CATALOG_MAX_PAGES,
  )

  if (totalPages === 0) {
    return { products: [], total, page: 1, totalPages: 0 }
  }

  if (page > totalPages) {
    return {
      products: [],
      total,
      page,
      totalPages,
      redirectToPage: totalPages,
    }
  }

  return {
    products: data.products.map(mapDummyJsonProduct),
    total,
    page,
    totalPages,
  }
}

export async function getProductById(id: number): Promise<CatalogProduct | null> {
  const res = await fetch(`${PRODUCTS_URL}/${id}`, {
    next: { revalidate: 3600 },
  })

  if (res.status === 404) return null
  if (!res.ok) {
    throw new Error(`DummyJSON product ${id}: ${res.status} ${res.statusText}`)
  }

  const p = (await res.json()) as DummyJsonProduct
  return mapDummyJsonProduct(p)
}
