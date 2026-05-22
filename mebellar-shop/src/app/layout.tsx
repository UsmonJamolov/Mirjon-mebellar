import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ShopHeader } from "@/components/layout/ShopHeader";
import { ShopFooter } from "@/components/layout/ShopFooter";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
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

export default function RootLayout({
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
      <body className={`${poppins.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider>
        <AuthProvider>
        <CartProvider>
          <ShopHeader />
          <div className="min-h-[calc(100vh-4rem)] pb-20 md:pb-0 bg-[#faf8f5] dark:bg-[#1a1612] transition-colors">{children}</div>
          <ShopFooter />
          <MobileBottomNav />
        </CartProvider>
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
