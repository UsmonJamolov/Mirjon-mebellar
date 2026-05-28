import type { Metadata } from "next";
import { Poppins, Syne } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { ShopHeader } from "@/components/layout/ShopHeader";
import { ShopFooter } from "@/components/layout/ShopFooter";
import { ShopMainShell } from "@/components/layout/ShopMainShell";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { TelegramPollBridge } from "@/components/telegram/TelegramPollBridge";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: "Mebellar — Mebel do'koni",
  description:
    "Mebellar onlayn do'koni — sifatli mebellar, buyurtma, eskiz va chat",
  openGraph: {
    title: "Mebellar — Mebel do'koni",
    description: "Zamonaviy mebel do'koni O'zbekistonda",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("mmebel-theme");if(t==="dark")document.documentElement.classList.add("dark");var l=localStorage.getItem("mmebel-locale");if(l){var p=JSON.parse(l);if(p&&p.state&&p.state.locale){document.documentElement.lang=p.state.locale;document.cookie="mmebel-locale="+p.state.locale+";path=/;max-age=31536000;SameSite=Lax"}}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${poppins.variable} ${syne.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider>
        <I18nProvider>
        <AuthProvider>
        <TelegramPollBridge />
        <CartProvider>
          <ShopHeader />
          <ShopMainShell>{children}</ShopMainShell>
          <ShopFooter />
          <MobileBottomNav />
        </CartProvider>
        </AuthProvider>
        </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
