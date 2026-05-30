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
  createdAt?: string;
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
  status: "yangi" | "jarayonda" | "tugallangan" | "bekor";
  items: { name: string; quantity: number; productId?: string; price?: number }[];
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  paymentMethod?: string;
  source?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  image?: string;
  role: string;
}

export interface OtpSession {
  ok: boolean;
  token: string;
  botUsername: string;
  botUrl: string;
  expiresAt: number;
  telegramConfigured: boolean;
  state?: string;
  hasTelegram?: boolean;
}
