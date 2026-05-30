import { useEffect, useState } from "react";
import { FlatList, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "../../src/components/ui/Screen";
import { useAuth } from "../../src/context/AuthContext";
import { useThemeColors } from "../../src/context/ThemeContext";
import { api } from "../../src/api/client";
import type { UserOrder } from "../../src/types";
import { colors } from "../../src/theme/colors";
import { t } from "../../src/i18n";

const statusLabel: Record<string, string> = {
  yangi: t("orders.statusNew"),
  jarayonda: t("orders.statusProgress"),
  tugallangan: t("orders.statusDone"),
  bekor: t("orders.statusCancelled"),
};

export default function OrdersScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const theme = useThemeColors();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace("/auth");
      return;
    }
    api
      .getOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [user, router]);

  if (loading) {
    return (
      <Screen title={t("orders.title")}>
        <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
      </Screen>
    );
  }

  return (
    <Screen title={t("orders.title")}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.muted }]}>
            {t("orders.empty")}
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => router.push(`/buyurtmalar/${item.id}`)}
          >
            <Text style={[styles.id, { color: theme.text }]}>
              {t("orders.orderNumber")} #{item.id.slice(-6)}
            </Text>
            <Text style={{ color: theme.muted, fontSize: 12 }}>{item.date}</Text>
            <Text style={styles.status}>{statusLabel[item.status] ?? item.status}</Text>
            <Text style={styles.total}>{item.total.toLocaleString("uz-UZ")} so'm</Text>
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: { textAlign: "center", marginTop: 40, paddingHorizontal: 20 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  id: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  status: { color: colors.accent, fontWeight: "600", marginTop: 8 },
  total: { fontSize: 15, fontWeight: "700", marginTop: 4, color: colors.primary },
});
