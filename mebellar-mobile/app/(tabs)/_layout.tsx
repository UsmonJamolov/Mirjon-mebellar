import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";
import { useCart } from "../../src/context/CartContext";
import { useThemeColors } from "../../src/context/ThemeContext";
import { t } from "../../src/i18n";
import { colors } from "../../src/theme/colors";

export default function TabLayout() {
  const theme = useThemeColors();
  const { count, hydrated } = useCart();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: theme.muted,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("nav.homeShort"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="katalog"
        options={{
          title: t("nav.catalog"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="savatcha"
        options={{
          title: t("nav.cart"),
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="cart-outline" size={size} color={color} />
              {hydrated && count > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{count > 9 ? "9+" : count}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: t("nav.chat"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: t("nav.profile"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -4,
    right: -10,
    backgroundColor: colors.accent,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: { color: "#fff", fontSize: 9, fontWeight: "700" },
});
