import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Screen } from "../../src/components/ui/Screen";
import { ProductCard } from "../../src/components/ui/ProductCard";
import { api, resolveMediaUrl } from "../../src/api/client";
import type { Category, Product } from "../../src/types";
import { useThemeColors } from "../../src/context/ThemeContext";
import { colors } from "../../src/theme/colors";
import { t } from "../../src/i18n";

export default function HomeScreen() {
  const router = useRouter();
  const theme = useThemeColors();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getCategories(), api.getProducts({ popular: true })])
      .then(([cats, products]) => {
        setCategories(cats.slice(0, 6));
        setFeatured(products.slice(0, 4));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
      </Screen>
    );
  }

  return (
    <Screen noPad>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#3d3229", "#5c4f42", "#3d3229"]}
          style={styles.hero}
        >
          <Text style={styles.heroBadge}>MMEBEL</Text>
          <Text style={styles.heroTitle}>Premium mebel{"\n"}dunyosi</Text>
          <Text style={styles.heroSub}>
            Sifat, dizayn va qulaylik bir joyda
          </Text>
          <Pressable
            style={styles.heroBtn}
            onPress={() => router.push("/katalog")}
          >
            <Text style={styles.heroBtnText}>Katalogni ko'rish</Text>
          </Pressable>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {t("catalog.categories")}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat) => (
              <Pressable
                key={cat.id}
                style={[styles.catCard, { backgroundColor: theme.card }]}
                onPress={() =>
                  router.push({ pathname: "/katalog", params: { cat: cat.slug } })
                }
              >
                <Image
                  source={{ uri: resolveMediaUrl(cat.image) }}
                  style={styles.catImage}
                  contentFit="cover"
                />
                <Text style={[styles.catName, { color: theme.text }]} numberOfLines={1}>
                  {cat.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Mashhur mahsulotlar
          </Text>
          <View style={styles.grid}>
            {featured.map((p) => (
              <View key={p.id} style={styles.gridItem}>
                <ProductCard product={p} />
              </View>
            ))}
          </View>
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: 28,
    paddingTop: 48,
    minHeight: 260,
    justifyContent: "flex-end",
  },
  heroBadge: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 3,
    marginBottom: 8,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 38,
    marginBottom: 8,
  },
  heroSub: { color: "rgba(255,255,255,0.75)", fontSize: 14, marginBottom: 20 },
  heroBtn: {
    alignSelf: "flex-start",
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  heroBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 14 },
  catCard: {
    width: 120,
    marginRight: 12,
    borderRadius: 16,
    overflow: "hidden",
    paddingBottom: 10,
  },
  catImage: { width: 120, height: 90 },
  catName: { fontSize: 12, fontWeight: "600", paddingHorizontal: 8, marginTop: 8 },
  grid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  gridItem: { width: "50%" },
});
