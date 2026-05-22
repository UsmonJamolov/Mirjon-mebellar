export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  material: string;
  width?: number;
  depth?: number;
  height?: number;
  description: string;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  isNew?: boolean;
  isPopular?: boolean;
  isRecommended?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  count: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface UserOrder {
  id: string;
  date: string;
  total: number;
  status: "yangi" | "jarayonda" | "tugallangan";
  items: { name: string; quantity: number }[];
}
