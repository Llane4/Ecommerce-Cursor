"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

export function HeaderSearchForm() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initialQ =
    pathname === "/buscar" ? (searchParams.get("q") ?? "").trim() : ""

  return (
    <form
      action="/buscar"
      method="get"
      role="search"
      className="relative min-w-0 flex-1"
    >
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        name="q"
        placeholder="Buscar productos, marcas y más…"
        className="h-10 w-full border-border bg-muted/40 pl-10 text-sm shadow-sm placeholder:text-muted-foreground dark:bg-muted/25"
        autoComplete="off"
        id="site-search"
        aria-label="Buscar productos"
        defaultValue={initialQ}
        key={initialQ}
      />
    </form>
  )
}

export function HeaderSearchFormFallback() {
  return (
    <form
      action="/buscar"
      method="get"
      role="search"
      className="relative min-w-0 flex-1"
    >
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        name="q"
        placeholder="Buscar productos, marcas y más…"
        className="h-10 w-full border-border bg-muted/40 pl-10 text-sm shadow-sm placeholder:text-muted-foreground dark:bg-muted/25"
        autoComplete="off"
        id="site-search"
        aria-label="Buscar productos"
      />
    </form>
  )
}
