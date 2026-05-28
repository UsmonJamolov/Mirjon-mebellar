import { PremiumHome } from "@/components/premium/PremiumHome";
import { fetchBestsellers, fetchCategories, fetchProducts } from "@/lib/api";

export default async function HomePage() {
  const [categories, allProducts, featured] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
    fetchBestsellers(4),
  ]);

  return (
    <PremiumHome
      products={allProducts}
      categories={categories}
      featured={featured}
    />
  );
}
