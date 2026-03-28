/** Atributo en el icono del carrito del header (puede haber dos instancias: móvil / desktop). */
export const CART_FLY_TARGET_ATTR = "data-cart-fly-target"

/** `id` del contenedor de la imagen principal en la ficha de producto (servidor + cliente). */
export const PRODUCT_DETAIL_FLY_IMAGE_ID = "product-detail-fly-image"

const THUMB_SIZE = 52
const DURATION_MS = 700

function getVisibleCartTarget(): HTMLElement | null {
  const nodes = document.querySelectorAll<HTMLElement>(`[${CART_FLY_TARGET_ATTR}]`)
  for (const el of nodes) {
    const r = el.getBoundingClientRect()
    if (r.width > 0 && r.height > 0) return el
  }
  return nodes[0] ?? null
}

function centerThumbCoords(rect: DOMRectReadOnly, size: number) {
  return {
    left: rect.left + rect.width / 2 - size / 2,
    top: rect.top + rect.height / 2 - size / 2,
  }
}

/**
 * Miniatura del producto que vuela hasta el icono del carrito (solo cliente).
 */
export function flyProductThumbnailToCart(
  imageSrc: string,
  startRect: DOMRectReadOnly
): void {
  if (typeof document === "undefined") return

  const target = getVisibleCartTarget()
  if (!target) return

  const endRect = target.getBoundingClientRect()
  const { left: x0, top: y0 } = centerThumbCoords(startRect, THUMB_SIZE)
  const { left: x1, top: y1 } = centerThumbCoords(endRect, THUMB_SIZE)
  const dx = x1 - x0
  const dy = y1 - y0

  const fly = document.createElement("img")
  fly.src = imageSrc
  fly.alt = ""
  fly.setAttribute("aria-hidden", "true")
  const s = fly.style
  s.position = "fixed"
  s.left = `${x0}px`
  s.top = `${y0}px`
  s.width = `${THUMB_SIZE}px`
  s.height = `${THUMB_SIZE}px`
  s.objectFit = "contain"
  s.borderRadius = "10px"
  s.zIndex = "9999"
  s.pointerEvents = "none"
  s.boxShadow = "0 6px 20px rgba(0,0,0,0.18)"
  s.background = "var(--card, #fff)"

  document.body.appendChild(fly)

  const keyframes = [
    { transform: "translate(0, 0) scale(1)", opacity: 1 },
    {
      transform: `translate(${dx * 0.92}px, ${dy * 0.92}px) scale(0.42)`,
      opacity: 0.92,
    },
    { transform: `translate(${dx}px, ${dy}px) scale(0.2)`, opacity: 0 },
  ]

  const anim = fly.animate(keyframes, {
    duration: DURATION_MS,
    easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
  })

  anim.finished.finally(() => fly.remove())
}

export function flyStartRectFromElementId(elementId: string): DOMRect | null {
  if (typeof document === "undefined") return null
  const el = document.getElementById(elementId)
  return el?.getBoundingClientRect() ?? null
}
