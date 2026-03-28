import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"

import { faker } from "@faker-js/faker"

/** Ruta relativa al directorio de trabajo (ejecución desde la raíz del repo). */
export const FAKE_PRODUCTS_FILE = "data/fake-products.json" as const

/** Objeto de producto de prueba (alineado con lo que suelen persistir en `Product`). */
export type FakeProduct = {
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

const PRODUCT_COUNT = 12

export function generateFakeProducts(count: number): FakeProduct[] {
  return Array.from({ length: count }, () => {
    const name = faker.commerce.productName()
    const slug =
      faker.helpers.slugify(name).toLowerCase() +
      "-" +
      faker.string.alphanumeric(6).toLowerCase()

    const price = parseFloat(
      faker.commerce.price({ min: 10, max: 999, dec: 2 }),
    )

    const hasCompare = faker.datatype.boolean({ probability: 0.35 })
    const comparePrice = hasCompare
      ? Math.round((price + faker.number.float({ min: 5, max: 200, fractionDigits: 2 })) * 100) / 100
      : null

    return {
      name,
      slug,
      description: faker.commerce.productDescription(),
      price,
      comparePrice,
      image: faker.image.urlPicsumPhotos({
        width: 800,
        height: 800,
        blur: 0,
      }),
      stock: faker.number.int({ min: 0, max: 100 }),
      sku: `SKU-${faker.string.alphanumeric(8).toUpperCase()}`,
      isActive: faker.datatype.boolean({ probability: 0.95 }),
      isFeatured: faker.datatype.boolean({ probability: 0.15 }),
    }
  })
}

function main() {
  const products = generateFakeProducts(PRODUCT_COUNT)
  const root = process.cwd()
  const outPath = join(root, FAKE_PRODUCTS_FILE)

  mkdirSync(join(root, "data"), { recursive: true })
  writeFileSync(outPath, JSON.stringify(products, null, 2), "utf8")

  console.log(
    `Generated ${products.length} fake products → ${outPath}`,
  )
}

main()
