import type { Metadata } from "next";
import { Poppins, Syne } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ShopHeader } from "@/components/layout/ShopHeader";
import { ShopFooter } from "@/components/layout/ShopFooter";
import { ShopMainShell } from "@/components/layout/ShopMainShell";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
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
            __html: `(function(){try{var t=localStorage.getItem("mmebel-theme");if(t==="dark")document.documentElement.classList.add("dark")}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${poppins.variable} ${syne.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider>
        <AuthProvider>
        <CartProvider>
          <ShopHeader />
          <ShopMainShell>{children}</ShopMainShell>
          <ShopFooter />
          <MobileBottomNav />
        </CartProvider>
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
