"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { useThemeToggle } from "@/components/ThemeWatcher"

export function ThemeToggle() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const toggle = useThemeToggle()

  React.useEffect(() => { setMounted(true) }, [])

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className="text-foreground hover:bg-muted"
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      onClick={toggle}
      disabled={!mounted}
    >
      {mounted ? (
        isDark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />
      ) : (
        <Moon className="size-4 opacity-40" aria-hidden />
      )}
    </Button>
  )
}
