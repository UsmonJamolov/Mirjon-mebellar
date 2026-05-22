import type {
  ChatThread,
  Customer,
  InventoryItem,
  Order,
  Product,
} from "./types";

export const orders: Order[] = [
  {
    id: "12578",
    customerName: "Dilshod Akbarov",
    customerPhone: "+998 90 123 45 67",
    customerAddress: "Toshkent sh., Chilonzor tumani, 12-uy",
    date: "2026-05-18",
    total: 12500000,
    status: "yangi",
    products: [
      {
        id: "1",
        name: "Oshxona mebellari to'plami",
        material: "MDF, Laminat",
        quantity: 1,
        price: 8500000,
        image:
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop",
      },
      {
        id: "2",
        name: "Oshxona stoli",
        material: "Granit",
        quantity: 1,
        price: 4000000,
        image:
          "https://images.unsplash.com/photo-1615874959470-4a9ef09e4f1c?w=200&h=200&fit=crop",
      },
    ],
  },
  {
    id: "12577",
    customerName: "Malika Karimova",
    date: "2026-05-17",
    total: 5200000,
    status: "jarayonda",
  },
  {
    id: "12576",
    customerName: "Jasur Rahimov",
    date: "2026-05-16",
    total: 8900000,
    status: "tugallangan",
  },
  {
    id: "12575",
    customerName: "Nodira Tosheva",
    date: "2026-05-15",
    total: 3100000,
    status: "bekor",
  },
  {
    id: "12574",
    customerName: "Sardor Umarov",
    date: "2026-05-14",
    total: 15600000,
    status: "jarayonda",
  },
  {
    id: "12573",
    customerName: "Gulnora Saidova",
    date: "2026-05-13",
    total: 7200000,
    status: "tugallangan",
  },
];

export const customers: Customer[] = [
  {
    id: "1",
    name: "Dilshod Akbarov",
    phone: "+998 90 123 45 67",
    address: "Toshkent sh., Chilonzor tumani",
    registeredAt: "2025-03-12",
    status: "faol",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    notes: ["VIP mijoz", "Oshxona mebellari qiziqadi"],
    orders: orders.filter((o) => o.customerName === "Dilshod Akbarov"),
  },
  {
    id: "2",
    name: "Malika Karimova",
    phone: "+998 91 234 56 78",
    address: "Samarqand sh.",
    registeredAt: "2025-06-20",
    status: "faol",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    notes: [],
    orders: orders.filter((o) => o.customerName === "Malika Karimova"),
  },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Oshxona mebellari to'plami",
    category: "Oshxona",
    price: 12500000,
    material: "MDF, Laminat",
    width: 320,
    depth: 60,
    height: 220,
    description: "Zamonaviy oshxona mebellari to'plami",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1615874959470-4a9ef09e4f1c?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "2",
    name: "Yotoqxona shkafi",
    category: "Yotoqxona",
    price: 4800000,
    material: "MDF 18mm",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    name: "Ofis stoli",
    category: "Ofis",
    price: 2100000,
    material: "Yog'och",
    image:
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop",
  },
  {
    id: "4",
    name: "Divan to'plami",
    category: "Mehmonxona",
    price: 8900000,
    material: "Mato, Yog'och",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
  },
  {
    id: "5",
    name: "Bolalar shkafi",
    category: "Bolalar",
    price: 3500000,
    material: "MDF",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
  },
  {
    id: "6",
    name: "TV stendi",
    category: "Mehmonxona",
    price: 1800000,
    material: "Laminat",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&h=300&fit=crop",
  },
];

export const inventory: InventoryItem[] = [
  {
    id: "1",
    name: "MDF 18mm",
    category: "Material",
    quantity: 45,
    unit: "List",
    status: "yetarli",
  },
  {
    id: "2",
    name: "MDF 16mm",
    category: "Material",
    quantity: 8,
    unit: "List",
    status: "kam",
  },
  {
    id: "3",
    name: "Laminat oq",
    category: "Material",
    quantity: 120,
    unit: "m²",
    status: "yetarli",
  },
  {
    id: "4",
    name: "Tortish mexanizmi",
    category: "Aksessuar",
    quantity: 34,
    unit: "Dona",
    status: "yetarli",
  },
  {
    id: "5",
    name: "Ruchka metall",
    category: "Aksessuar",
    quantity: 5,
    unit: "Dona",
    status: "kam",
  },
];

export const chatThreads: ChatThread[] = [
  {
    id: "1",
    customerName: "Dilshod Akbarov",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
    lastMessage: "Eskizni ko'rib chiqdingizmi?",
    time: "14:32",
    unread: 2,
    messages: [
      {
        id: "1",
        sender: "customer",
        text: "Assalomu alaykum, oshxona mebellari uchun eskiz kerak",
        time: "14:20",
      },
      {
        id: "2",
        sender: "admin",
        text: "Va alaykum assalom! Albatta, o'lchamlarni yuboring",
        time: "14:22",
      },
      {
        id: "3",
        sender: "customer",
        text: "Eskizni ko'rib chiqdingizmi?",
        time: "14:32",
      },
    ],
  },
  {
    id: "2",
    customerName: "Malika Karimova",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
    lastMessage: "Rahmat, buyurtma qabul qilindi",
    time: "12:15",
    messages: [
      {
        id: "1",
        sender: "admin",
        text: "Buyurtmangiz qabul qilindi",
        time: "12:15",
      },
    ],
  },
];

export const incomeChartData = [
  { day: "1", summa: 4200000 },
  { day: "5", summa: 6100000 },
  { day: "10", summa: 8500000 },
  { day: "15", summa: 7200000 },
  { day: "20", summa: 9800000 },
  { day: "25", summa: 11200000 },
  { day: "30", summa: 12500000 },
];

export const salesByCategory = [
  { name: "Oshxona", value: 45, color: "#3b82f6" },
  { name: "Yotoqxona", value: 25, color: "#10b981" },
  { name: "Ofis", value: 15, color: "#f59e0b" },
  { name: "Boshqa", value: 15, color: "#8b5cf6" },
];

export function formatPrice(n: number): string {
  return n.toLocaleString("uz-UZ") + " so'm";
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    yangi: "Yangi",
    jarayonda: "Jarayonda",
    tugallangan: "Tugallangan",
    bekor: "Bekor qilingan",
  };
  return map[status] || status;
}

export function getStatusClass(status: string): string {
  const map: Record<string, string> = {
    yangi: "status-new",
    jarayonda: "status-progress",
    tugallangan: "status-done",
    bekor: "status-cancel",
  };
  return map[status] || "status-new";
}
