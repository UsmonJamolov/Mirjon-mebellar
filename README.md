# Mebellar — Admin Panel

Mebel biznesi uchun responsive admin panel (Next.js 15, TypeScript, Tailwind CSS).

> **E-commerce (mijoz do'koni)** alohida loyihada: `../mebellar-shop` — port **3001**

## Ishga tushirish

```bash
npm install
npm run dev
```

Brauzerda: [http://localhost:3000](http://localhost:3000)

## Sahifalar

| Yo'l | Tavsif |
|------|--------|
| `/` | Bosh sahifa (dashboard) |
| `/buyurtmalar` | Buyurtmalar ro'yxati |
| `/buyurtmalar/[id]` | Buyurtma tafsiloti |
| `/buyurtmalar/[id]/holat` | Holatni o'zgartirish |
| `/mijozlar` | Mijozlar |
| `/mijozlar/[id]` | Mijoz profili |
| `/mahsulotlar` | Mahsulotlar katalogi |
| `/mahsulotlar/[id]` | Mahsulot tahrirlash |
| `/eskizlar` | Eskiz yaratish (2D preview) |
| `/xabarlar` | Chat |
| `/ombor` | Ombor / inventar |
| `/hisobotlar` | Hisobotlar va grafiklar |
| `/sozlamalar` | Sozlamalar |
| `/ko-proq` | Mobil: qo'shimcha menyu |

## Responsive

- **Desktop (lg+):** Sidebar + keng layout
- **Mobile:** Pastki navigatsiya, hamburger menyu, kartalar

## Keyingi bosqich (production)

TZ bo'yicha keyinroq qo'shiladi:

- MongoDB + Node.js API
- Socket.io (realtime chat)
- AWS S3 / Firebase Storage (rasmlar)
- Payme, Click, Uzum Pay
- Vercel / AWS deploy

Hozircha mock ma'lumotlar (`src/lib/mock-data.ts`) ishlatiladi.
# Mirjon-mebellar
