import { notFound } from "next/navigation";
import { fetchProduct, fetchProducts } from "@/lib/api";
import { ProductDetail } from "./ProductDetail";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let product = await fetchProduct(id);
  if (!product) {
    const all = await fetchProducts();
    product = all[0] ?? null;
  }
  if (!product) notFound();

  return <ProductDetail product={product} />;
}
