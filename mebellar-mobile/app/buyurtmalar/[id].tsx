import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Screen } from "../../src/components/ui/Screen";
import { useThemeColors } from "../../src/context/ThemeContext";
import { api } from "../../src/api/client";
import type { UserOrder } from "../../src/types";
import { colors } from "../../src/theme/colors";

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useThemeColors();
  const [order, setOrder] = useState<UserOrder | null>(null);

  useEffect(() => {
    api.getOrders().then((list) => {
      setOrder(list.find((o) => o.id === id) ?? null);
    });
  }, [id]);

  if (!order) {
    return (
      <Screen>
        <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
      </Screen>
    );
  }

  return (
    <Screen title={`Buyurtma #${order.id.slice(-6)}`}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={{ color: theme.muted }}>{order.date}</Text>
        <Text style={[styles.total, { color: theme.text }]}>
          {order.total.toLocaleString("uz-UZ")} so'm
        </Text>
        <Text style={styles.status}>{order.status}</Text>
        {order.items.map((item, i) => (
          <Text key={i} style={{ color: theme.text, marginTop: 8 }}>
            • {item.name} × {item.quantity}
          </Text>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 20 },
  total: { fontSize: 22, fontWeight: "800", marginVertical: 8 },
  status: { color: colors.accent, fontWeight: "700" },
});
