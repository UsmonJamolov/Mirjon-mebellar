import { Pressable, View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { Product } from "../../types";
import { resolveMediaUrl } from "../../api/client";
import { useCart } from "../../context/CartContext";
import { useThemeColors } from "../../context/ThemeContext";
import { colors } from "../../theme/colors";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const router = useRouter();
  const { likedIds, toggleLike } = useCart();
  const theme = useThemeColors();
  const liked = likedIds.includes(product.id);

  return (
    <Pressable
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => router.push(`/mahsulot/${product.id}`)}
    >
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: resolveMediaUrl(product.image) }}
          style={styles.image}
          contentFit="cover"
        />
        <Pressable
          style={styles.likeBtn}
          onPress={() => toggleLike(product.id)}
        >
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={20}
            color={liked ? colors.accent : "#fff"}
          />
        </Pressable>
        {product.isNew && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Yangi</Text>
          </View>
        )}
      </View>
      <View style={styles.body}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.price}>
          {product.price.toLocaleString("uz-UZ")} so'm
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    flex: 1,
    margin: 6,
    shadowColor: "#3d3229",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  imageWrap: { aspectRatio: 1, backgroundColor: "#f0ebe4" },
  image: { width: "100%", height: "100%" },
  likeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  body: { padding: 12 },
  name: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  category: { fontSize: 11, color: colors.textMuted, marginBottom: 6 },
  price: { fontSize: 15, fontWeight: "700", color: colors.accent },
});
