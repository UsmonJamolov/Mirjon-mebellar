import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../src/context/AuthContext";
import { CartProvider } from "../src/context/CartContext";
import { ThemeProvider, useThemeMode } from "../src/context/ThemeContext";

function RootNav() {
  const { isDark } = useThemeMode();
  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" options={{ presentation: "fullScreenModal" }} />
        <Stack.Screen name="mahsulot/[id]" options={{ headerShown: true, title: "Mahsulot" }} />
        <Stack.Screen name="checkout" options={{ headerShown: true, title: "Checkout" }} />
        <Stack.Screen name="buyurtmalar/index" options={{ headerShown: true, title: "Buyurtmalar" }} />
        <Stack.Screen name="buyurtmalar/[id]" options={{ headerShown: true, title: "Buyurtma" }} />
        <Stack.Screen name="sevimlilar" options={{ headerShown: true, title: "Sevimlilar" }} />
        <Stack.Screen name="eskiz" options={{ headerShown: true, title: "Eskiz" }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <RootNav />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
