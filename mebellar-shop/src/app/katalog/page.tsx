import { fetchCategories, fetchProducts } from "@/lib/api";
import { CatalogClient } from "./CatalogClient";

export default async function CatalogPage() {
  const [categories, products] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
  ]);

  return <CatalogClient categories={categories} products={products} />;
}
