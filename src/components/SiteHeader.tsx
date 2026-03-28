import Link from "next/link"
import { Suspense } from "react"

import {
  HeaderSearchForm,
  HeaderSearchFormFallback,
} from "@/components/HeaderSearchForm"
import { CartHeaderLink } from "@/components/CartHeaderLink"
import { CurrencyMenu } from "@/components/CurrencyMenu"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card pt-[env(safe-area-inset-top)] shadow-sm dark:border-white/10 dark:shadow-black/20">
      <div className="mx-auto max-w-7xl px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex flex-col gap-2 sm:gap-3 md:flex-row md:items-center md:gap-6">
          <div className="flex min-w-0 items-center justify-between gap-2 md:contents">
            <Link
              href="/"
              className="min-w-0 shrink-0 truncate text-base font-semibold tracking-tight text-[#3483fa] hover:opacity-90 sm:text-lg dark:text-[#6ea8ff]"
            >
              CursorShop
            </Link>
            <div className="flex shrink-0 items-center gap-0 md:hidden">
              <CurrencyMenu />
              <CartHeaderLink />
              <ThemeToggle />
            </div>
          </div>

          <Suspense fallback={<HeaderSearchFormFallback />}>
            <HeaderSearchForm />
          </Suspense>

          <nav
            aria-label="Cuenta"
            className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-border pt-2 text-xs text-foreground/80 sm:text-sm md:hidden dark:border-white/10"
          >
            <Link
              href="/login"
              className="rounded-md px-2 py-1.5 hover:bg-muted hover:text-[#3483fa] dark:hover:text-[#6ea8ff]"
            >
              Iniciar sesión
            </Link>
            <span className="select-none text-muted-foreground" aria-hidden>
              |
            </span>
            <Link
              href="/registro"
              className="rounded-md px-2 py-1.5 hover:bg-muted hover:text-[#3483fa] dark:hover:text-[#6ea8ff]"
            >
              Creá tu cuenta
            </Link>
          </nav>

          <nav
            aria-label="Cuenta"
            className="hidden shrink-0 items-center gap-1 text-sm text-foreground/80 md:flex"
          >
            <Link
              href="/login"
              className="rounded-md px-3 py-2 hover:bg-muted hover:text-[#3483fa] dark:hover:text-[#6ea8ff]"
            >
              Iniciar sesión
            </Link>
            <span className="select-none text-muted-foreground" aria-hidden>
              |
            </span>
            <Link
              href="/registro"
              className="rounded-md px-3 py-2 hover:bg-muted hover:text-[#3483fa] dark:hover:text-[#6ea8ff]"
            >
              Creá tu cuenta
            </Link>
            <CurrencyMenu />
            <CartHeaderLink />
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
