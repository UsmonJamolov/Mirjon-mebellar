import { useEffect, useState } from "react";
import { FlatList, View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "../src/components/ui/Screen";
import { ProductCard } from "../src/components/ui/ProductCard";
import { useAuth } from "../src/context/AuthContext";
import { useCart } from "../src/context/CartContext";
import { useThemeColors } from "../src/context/ThemeContext";
import { api } from "../src/api/client";
import type { Product } from "../src/types";
import { colors } from "../src/theme/colors";
import { t } from "../src/i18n";

export default function FavoritesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { likedIds } = useCart();
  const theme = useThemeColors();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace("/auth");
      return;
    }
    api
      .getProducts()
      .then((all) => setProducts(all.filter((p) => likedIds.includes(p.id))))
      .finally(() => setLoading(false));
  }, [user, likedIds, router]);

  if (loading) {
    return (
      <Screen title={t("profile.favorites")}>
        <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
      </Screen>
    );
  }

  return (
    <Screen title={t("profile.favorites")}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.muted }]}>
            Sevimli mahsulotlar yo'q
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <ProductCard product={item} />
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { justifyContent: "space-between" },
  item: { width: "48%" },
  empty: { textAlign: "center", marginTop: 40 },
});
