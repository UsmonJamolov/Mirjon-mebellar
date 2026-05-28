import type { Product } from "@/lib/types";

export type ProductSortOrder = "latest" | "oldest";

export function getProductSortTime(product: Product): number {
  if (product.createdAt) {
    const t = new Date(product.createdAt).getTime();
    if (!Number.isNaN(t)) return t;
  }
  const fromId = product.id.match(/^p-(\d+)/);
  if (fromId) return Number(fromId[1]);
  const numericId = Number(product.id);
  if (!Number.isNaN(numericId)) return numericId;
  return 0;
}

export function sortProducts(products: Product[], order: ProductSortOrder): Product[] {
  return [...products].sort((a, b) => {
    const diff = getProductSortTime(b) - getProductSortTime(a);
    return order === "latest" ? diff : -diff;
  });
}
