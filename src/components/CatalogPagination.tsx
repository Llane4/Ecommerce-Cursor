import Link from "next/link"

type CatalogPaginationProps = {
  currentPage: number
  totalPages: number
}

export function CatalogPagination({
  currentPage,
  totalPages,
}: CatalogPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav
      aria-label="Paginación del catálogo"
      className="mt-6 flex flex-wrap items-center justify-center gap-2"
    >
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
        const isCurrent = p === currentPage
        const href = p === 1 ? "/" : `/?page=${p}`
        return (
          <Link
            key={p}
            href={href}
            scroll
            aria-current={isCurrent ? "page" : undefined}
            className={
              isCurrent
                ? "flex min-h-9 min-w-9 items-center justify-center rounded-md border border-[#3483fa] bg-[#3483fa] px-3 text-sm font-medium text-white dark:border-[#6ea8ff] dark:bg-[#6ea8ff] dark:text-[#0f172a]"
                : "flex min-h-9 min-w-9 items-center justify-center rounded-md border border-border bg-card px-3 text-sm font-medium text-card-foreground transition-colors hover:bg-muted dark:border-white/10"
            }
          >
            {p}
          </Link>
        )
      })}
    </nav>
  )
}
