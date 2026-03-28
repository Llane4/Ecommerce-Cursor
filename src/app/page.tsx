import { CatalogPagination } from "@/components/CatalogPagination"
import { CatalogWithFilters } from "@/components/CatalogWithFilters"
import { getProductsPage } from "@/services/api"
import { redirect } from "next/navigation"

type Props = {
  searchParams: Promise<{ page?: string | string[] }>
}

function parsePage(raw: string | string[] | undefined): number {
  const s = Array.isArray(raw) ? raw[0] : raw
  const n = Number.parseInt(s ?? "1", 10)
  return Number.isFinite(n) ? n : 1
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams
  const requested = parsePage(params.page)
  const {
    products,
    total,
    page,
    totalPages,
    redirectToPage,
  } = await getProductsPage(requested)

  if (redirectToPage != null) {
    redirect(redirectToPage === 1 ? "/" : `/?page=${redirectToPage}`)
  }

  return (
    <CatalogWithFilters
      products={products}
      isLoading={false}
      catalogTotal={total}
      afterGrid={
        <CatalogPagination currentPage={page} totalPages={totalPages} />
      }
    />
  )
}
