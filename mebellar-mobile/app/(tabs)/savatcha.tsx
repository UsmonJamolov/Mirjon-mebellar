import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../../src/components/ui/Screen";
import { Button } from "../../src/components/ui/Button";
import { useCart } from "../../src/context/CartContext";
import { useAuth } from "../../src/context/AuthContext";
import { useThemeColors } from "../../src/context/ThemeContext";
import { resolveMediaUrl } from "../../src/api/client";
import { colors } from "../../src/theme/colors";
import { t } from "../../src/i18n";

export default function CartScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const theme = useThemeColors();
  const { items, total, updateQuantity, removeItem, hydrated } = useCart();

  if (!user) {
    return (
      <Screen title={t("cart.title")}>
        <View style={styles.center}>
          <Text style={{ color: theme.muted, marginBottom: 16 }}>
            Savatcha uchun kirish kerak
          </Text>
          <Button title={t("profile.login")} onPress={() => router.push("/auth")} />
        </View>
      </Screen>
    );
  }

  if (!hydrated) return <Screen title={t("cart.title")} />;

  if (!items.length) {
    return (
      <Screen title={t("cart.title")}>
        <View style={styles.center}>
          <Ionicons name="cart-outline" size={64} color={theme.muted} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            {t("cart.emptyTitle")}
          </Text>
          <Text style={{ color: theme.muted, marginBottom: 20 }}>
            {t("cart.emptyDesc")}
          </Text>
          <Button title={t("cart.goCatalog")} onPress={() => router.push("/katalog")} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen title={t("cart.title")}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.row,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Image
              source={{ uri: resolveMediaUrl(item.image) }}
              style={styles.thumb}
              contentFit="cover"
            />
            <View style={styles.info}>
              <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.price}>
                {item.price.toLocaleString("uz-UZ")} so'm
              </Text>
              <View style={styles.qtyRow}>
                <Pressable
                  onPress={() => updateQuantity(item.productId, item.quantity - 1)}
                  style={styles.qtyBtn}
                >
                  <Ionicons name="remove" size={18} color={colors.primary} />
                </Pressable>
                <Text style={{ color: theme.text, fontWeight: "700" }}>
                  {item.quantity}
                </Text>
                <Pressable
                  onPress={() => updateQuantity(item.productId, item.quantity + 1)}
                  style={styles.qtyBtn}
                >
                  <Ionicons name="add" size={18} color={colors.primary} />
                </Pressable>
                <Pressable
                  onPress={() => removeItem(item.productId)}
                  style={styles.remove}
                >
                  <Text style={{ color: "#c0392b", fontSize: 12 }}>
                    {t("cart.remove")}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />
      <View style={[styles.footer, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.totalLabel, { color: theme.text }]}>
          {t("cart.total")}:{" "}
          <Text style={styles.totalVal}>{total.toLocaleString("uz-UZ")} so'm</Text>
        </Text>
        <Button title={t("cart.checkout")} onPress={() => router.push("/checkout")} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  emptyTitle: { fontSize: 20, fontWeight: "700", marginTop: 16, marginBottom: 8 },
  row: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },
  thumb: { width: 80, height: 80, borderRadius: 12 },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  price: { color: colors.accent, fontWeight: "700", marginBottom: 8 },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  remove: { marginLeft: "auto" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
  totalLabel: { fontSize: 16, marginBottom: 12 },
  totalVal: { color: colors.accent, fontWeight: "800" },
});
