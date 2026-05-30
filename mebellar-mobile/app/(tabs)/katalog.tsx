import { useCallback, useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Screen } from "../../src/components/ui/Screen";
import { ProductCard } from "../../src/components/ui/ProductCard";
import { api } from "../../src/api/client";
import type { Category, Product } from "../../src/types";
import { useThemeColors } from "../../src/context/ThemeContext";
import { colors } from "../../src/theme/colors";
import { t } from "../../src/i18n";

export default function CatalogScreen() {
  const params = useLocalSearchParams<{ cat?: string }>();
  const theme = useThemeColors();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cat, setCat] = useState(params.cat ?? "");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"latest" | "oldest">("latest");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, list] = await Promise.all([
        api.getCategories(),
        api.getProducts({ cat: cat || undefined, q: q || undefined }),
      ]);
      setCategories(cats);
      const sorted = [...list].sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sort === "latest" ? db - da : da - db;
      });
      setProducts(sorted);
    } finally {
      setLoading(false);
    }
  }, [cat, q, sort]);

  useEffect(() => {
    if (params.cat) setCat(params.cat);
  }, [params.cat]);

  useEffect(() => {
    const id = setTimeout(load, 300);
    return () => clearTimeout(id);
  }, [load]);

  return (
    <Screen title={t("catalog.allProducts")}>
      <TextInput
        placeholder={t("catalog.searchProducts")}
        placeholderTextColor={theme.muted}
        value={q}
        onChangeText={setQ}
        style={[
          styles.search,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
      />

      <View style={styles.sortRow}>
        {(["latest", "oldest"] as const).map((s) => (
          <Pressable
            key={s}
            onPress={() => setSort(s)}
            style={[
              styles.sortPill,
              sort === s && styles.sortPillActive,
              { borderColor: theme.border },
            ]}
          >
            <Text
              style={[
                styles.sortText,
                sort === s && { color: colors.accent, fontWeight: "700" },
              ]}
            >
              {s === "latest" ? t("catalog.sortLatest") : t("catalog.sortOldest")}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        horizontal
        data={[{ slug: "", name: t("catalog.all") }, ...categories]}
        keyExtractor={(item) => item.slug || "all"}
        showsHorizontalScrollIndicator={false}
        style={styles.catList}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setCat(item.slug)}
            style={[
              styles.catPill,
              cat === item.slug && styles.catPillActive,
              { borderColor: theme.border },
            ]}
          >
            <Text
              style={[
                styles.catPillText,
                cat === item.slug && { color: "#fff" },
              ]}
            >
              {item.name}
            </Text>
          </Pressable>
        )}
      />

      <Text style={[styles.count, { color: theme.muted }]}>
        {t("catalog.found", { count: products.length })}
      </Text>

      {loading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: theme.muted }]}>
              {t("catalog.empty")}
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <ProductCard product={item} />
            </View>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 12,
  },
  sortRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  sortPill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sortPillActive: { borderColor: colors.accent },
  sortText: { fontSize: 12, color: colors.textMuted },
  catList: { maxHeight: 44, marginBottom: 8 },
  catPill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  catPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  catPillText: { fontSize: 12, fontWeight: "600", color: colors.primary },
  count: { fontSize: 12, marginBottom: 8 },
  row: { justifyContent: "space-between" },
  gridItem: { width: "48%" },
  empty: { textAlign: "center", marginTop: 40, fontSize: 14 },
});
