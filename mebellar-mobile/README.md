# Mebellar Mobile (React Native / Expo)

Do'kon (`mebellar-shop`) bilan bir xil API va funksiyalar — mobil ilova.

## Talablar

- Node.js 18+
- Expo Go (telefonda) yoki Android Studio / Xcode
- `mebellar-shop` serveri ishlab turishi kerak (`:3001`)
- MongoDB ishlab turishi kerak

## O'rnatish

```powershell
cd C:\Users\HP\Desktop\MMebellar\mebellar-mobile
npm install
```

`.env.example` dan `.env` yarating va kompyuter IP manzilini yozing:

```
EXPO_PUBLIC_API_URL=http://10.181.191.114:3001
EXPO_PUBLIC_BOT_USERNAME=mmebeluz_bot
```

> Telefon va kompyuter **bir Wi-Fi** tarmog'ida bo'lishi kerak.

## Ishga tushirish

```powershell
cd C:\Users\HP\Desktop\MMebellar\mebellar-mobile
npm start
```

QR kodni **Expo Go** ilovasi bilan skanerlang.

## Ekranlar (web bilan bir xil)

| Ekran | Yo'l |
|-------|------|
| Bosh sahifa | Tab: Bosh |
| Katalog | Tab: Katalog |
| Mahsulot | `/mahsulot/[id]` |
| Savatcha | Tab: Savat |
| Checkout | `/checkout` |
| Kirish (Telegram OTP) | `/auth` |
| Profil | Tab: Profil |
| Buyurtmalar | `/buyurtmalar` |
| Sevimlilar | `/sevimlilar` |
| Chat | Tab: Chat |
| Eskiz | `/eskiz` |

## Autentifikatsiya

1. Profil → Kirish
2. Telegram botga o'ting, kontakt ulashing
3. 6 xonali OTP kodni kiriting

Mobil ilova `POST /api/auth/mobile/sign-in` orqali JWT oladi (web cookie emas).

## Backend o'zgarishlari

`mebellar-shop` ga qo'shildi:

- `POST /api/auth/mobile/sign-in` — OTP → JWT
- `GET /api/auth/mobile/me` — foydalanuvchi
- `/api/orders` va `/api/user/profile` — `Authorization: Bearer` qo'llab-quvvatlaydi
- `/api/chat` — mobil Bearer token

## Dizayn

Web do'kon ranglari: `#3d3229`, `#f4a261`, `#faf8f5` — qorong'u rejim ham mavjud.
