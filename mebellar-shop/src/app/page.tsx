import { PremiumHome } from "@/components/premium/PremiumHome";
import { fetchCategories, fetchProducts } from "@/lib/api";

export default async function HomePage() {
  const [categories, allProducts] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
  ]);

  const featured = allProducts
    .filter((p) => p.isRecommended || p.isPopular)
    .slice(0, 4);

  return (
    <PremiumHome
      products={allProducts}
      categories={categories}
      featured={featured}
    />
  );
}
