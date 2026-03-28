"use client"

import { createContext, useContext, useCallback } from "react"
import { useTheme } from "next-themes"

const ThemeTransitionCtx = createContext<(e: React.MouseEvent) => void>(() => {})

export const useThemeToggle = () => useContext(ThemeTransitionCtx)

const css = `
  ::view-transition-old(root), ::view-transition-new(root) {
    animation-duration: 0.4s;
    mix-blend-mode: normal;
  }
  ::view-transition-old(root) { animation: none; z-index: 0; }
  ::view-transition-new(root) {
    z-index: 1;
    clip-path: circle(0 at var(--vt-x, 50%) var(--vt-y, 50%));
    animation: vt-reveal 0.4s ease-in forwards;
  }
  @keyframes vt-reveal {
    to { clip-path: circle(150vmax at var(--vt-x, 50%) var(--vt-y, 50%)); }
  }
`

export function ThemeWatcher({ children }: { children: React.ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme()

  const toggle = useCallback(
    (e: React.MouseEvent) => {
      const next = resolvedTheme === "dark" ? "light" : "dark"
      const root = document.documentElement
      root.style.setProperty("--vt-x", `${e.clientX}px`)
      root.style.setProperty("--vt-y", `${e.clientY}px`)

      if (!("startViewTransition" in document)) {
        setTheme(next)
        return
      }

      ;(document as Document & { startViewTransition(cb: () => void): void })
        .startViewTransition(() => setTheme(next))
    },
    [resolvedTheme, setTheme],
  )

  return (
    <ThemeTransitionCtx.Provider value={toggle}>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {children}
    </ThemeTransitionCtx.Provider>
  )
}
