export type OrderStatus = "yangi" | "jarayonda" | "tugallangan" | "bekor";

export interface Order {
  id: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  date: string;
  total: number;
  status: OrderStatus;
  products?: OrderProduct[];
  note?: string;
}

export interface OrderProduct {
  id: string;
  name: string;
  material: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  registeredAt: string;
  status: "faol" | "nofaol";
  avatar: string;
  notes: string[];
  orders: Order[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  material: string;
  width?: number;
  depth?: number;
  height?: number;
  description?: string;
  image: string;
  images?: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  status: "yetarli" | "kam";
}

export interface ChatMessage {
  id: string;
  sender: "admin" | "customer";
  text: string;
  time: string;
  image?: string;
}

export interface ChatThread {
  id: string;
  customerName: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
  messages: ChatMessage[];
}

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  mobileOnly?: boolean;
}
