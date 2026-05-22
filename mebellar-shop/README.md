# Mebellar Shop — E-commerce (mijoz platformasi)

Mebellar biznesi uchun alohida mijoz-facing onlayn do'kon. Admin panel alohida loyihada: `MMebellar` (port 3000).

## Ishga tushirish

```bash
cd mebellar-shop
npm install
npm run dev
```

**http://localhost:3001**

Admin panel (boshqa terminalda):

```bash
cd MMebellar
npm run dev
```

**http://localhost:3000**

## Sahifalar

| Yo'l | Tavsif |
|------|--------|
| `/` | Bosh sahifa — hero, kategoriyalar, mashhur/yangi/tavsiya |
| `/katalog` | Mahsulotlar katalogi + filter |
| `/mahsulot/[id]` | Mahsulot tafsiloti, slider, savatga qo'shish |
| `/savatcha` | Savatcha |
| `/checkout` | To'lov (Payme, Click, Uzum — mock) |
| `/profil` | Profil, til, dark mode |
| `/buyurtmalar` | Buyurtmalarni kuzatish |
| `/sevimlilar` | Like qilingan mahsulotlar |
| `/eskiz` | Individual eskiz |
| `/chat` | Sotuvchi bilan chat (mock) |

## Xususiyatlar

- Savatcha `localStorage` da saqlanadi
- Sevimlilar (like) saqlanadi
- O'zbek tili, TZ dizayn ranglari
- Responsive (mobile pastki nav)

## Keyingi bosqich

- Backend API + MongoDB
- Socket.io chat
- Haqiqiy to'lov (Payme, Click, Uzum)
- S3 rasmlar
- Admin bilan sinxronizatsiya
